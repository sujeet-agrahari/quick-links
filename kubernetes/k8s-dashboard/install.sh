#will create kubernetes-dashboard namespace
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml


# Link

# http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:https/proxy/#/login

# create token
kubectl create token dashboard-sa | pbcopy


# for cluster roles
# https://surajblog.medium.com/simplified-deployment-of-kubernetes-dashboard-with-alb-ingress-controller-bf3396c0dc54