kubectl create namespace argocd 

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml 

kubectl port-forward svc/argocd-server 8003:443 -n argocd   

kubectl get secrets -n argocd argocd-initial-admin-secret -o yaml                                                  q                                               


# to serve on http you need add toplevel 
# data:
#    server.insecure: true

# in config map kubectl describe configmaps argocd-cmd-params-cm  -n argocd

# also update server.rootpath: /argocd