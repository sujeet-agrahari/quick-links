# Introduction

We will be deploying the `quick-links` service in a local kubernetes cluster along with `PostgreSQL` and `Redis` cluster.

Also, we will setup `Kong` API gateway and we will use `Argocd` for continuous deployment.

We have two main directories to handles all of the deployment/setup tasks

- deploy: It has the deployment related files: `helm` chart and argocd `application` file
- kubernetes: It will have `kong` related setup files and `kubernetes` dashboard setup files

## Prerequisites

1. Make sure you have latest docker desktop version installed
2. Enable kubernetes
3. Install helm: `brew install helm`
4. Install `kubectl`: `brew install kubernetes-cli`

## Setup PostgreSQL cluster

```sh
# step 1
helm repo add bitnami https://charts.bitnami.com/bitnami

# step 2
helm install postgres bitnami/postgresql-ha \
--set global.postgresql.username="postgres" \
--set global.postgresql.password="password" \
--set global.postgresql.database="quicklink" \
--set global.postgresql.repmgrUsername="repmgr" \
--set global.postgresql.repmgrPassword="password" \
--set global.postgresql.repmgrDatabase="repmgr" \
--set global.pgpool.adminUsername="admin" \
--set global.pgpool.adminPassword="password" \
--set postgresqlImage.debug=true
```

Once installed,

PostgreSQL can be accessed through Pgpool via port 5432 on the following DNS name from within your cluster:

```sh
postgres-postgresql-ha-pgpool.default.svc.cluster.local
```

To get the password for the `postgres` user run:

```sh
kubectl get secret --namespace default postgres-postgresql-ha-postgresql -o jsonpath="{.data.password}" | base64 -d | pbcopy
```

To connect to your database and test from outside the cluster execute the following commands:

```sh
kubectl port-forward --namespace default svc/postgres-postgresql-ha-pgpool 5433:5432

# If you want to make accessible through th process, you can run in background process:

kubectl port-forward --namespace default svc/postgres-postgresql-ha-pgpool 5433:5432 &
```

## Setup Redis cluster

```sh
# Install redis - single mast and multiple slaves
helm install redis bitnami/redis




# Redis&reg; can be accessed on the following DNS names from within your cluster:

# redis-master.default.svc.cluster.local for read/write operations (port 6379)
# redis-replicas.default.svc.cluster.local for read-only operations (port 6379)

# To get your password run:
kubectl get secret --namespace default redis -o jsonpath="{.data.redis-password}" | base64 -d | pbcopy

# To connect to your database from outside the cluster execute the following commands:

kubectl port-forward --namespace default svc/redis-master 6379:6379 &
```

## Setup Kubernetes dashboard

```sh
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/

helm install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard

# To access the dashboard run the following command:
  kubectl apply -f kubernetes/k8s-dashboard/k8s-dashboard.service-account.yaml
kubectl apply -f kubernetes/k8s-dashboard/k8s-dashboard.role-binding.yaml


# Get the token
kubectl create token dashboard-sa | pbcopy

kubectl proxy
# http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:https/proxy/#/login

```

## Setup Kong

```sh
# default namesapce
helm install kong kong/kong  --set admin.useTLS=false,admin.enabled=true,admin.http.enabled=true,env.admin_gui_path=/kong-manager,env.admin_gui_url=http://localhost/kong-manager,env.admin_gui_api_url=http://localhost/kong-admin
```

## Setup Argocd

```sh
kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml


# to serve on http you need add toplevel
# Go to kubernetes dashboard and update the argocd-cm config map
# data:
#    server.insecure: true
#    server.rootpath: /argocd -> it is needed to run behind proxy

kubectl get secrets -n argocd argocd-initial-admin-secret -o yaml

# Decode the password field got from above command
echo NkZoc3E0RW45OTZDRDlJdg== | base64 --decode
# user will be admin only

```

## Create Ingress for accessing service via Kong

```
kubectl apply -f kubernetes/kong/argocd-ingress.yaml
kubectl apply -f kubernetes/kong/kong-admin.yaml
kubectl apply -f kubernetes/kong/kong-manager.yaml
kubectl apply -f kubernetes/kong/quick-links-ingress.yaml
```

## Deploy the app using argo cd

```sh
# Make sure you build the app first
docker build . --target dev -t quick-links:argocd

kubectl apply -f deploy/argocd/application.yaml
```
