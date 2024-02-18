# switch to namespace
kubectl config set-context --current --namespace=default

# get the current switched namespace
kubectl config view --minify --output 'jsonpath={..namespace}'

kubectl config view | grep namespace