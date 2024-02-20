kubectl create namespace argocd 

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml 

kubectl port-forward svc/argocd-server 8003:443 -n argocd   

kubectl get secrets -n argocd argocd-initial-admin-secret -o yaml                                                                                                 
