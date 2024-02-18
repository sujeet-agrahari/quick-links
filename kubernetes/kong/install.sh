
# default namesapce
helm install kong kong/kong  --set admin.useTLS=false,admin.enabled=true,admin.http.enabled=true,env.admin_gui_path=/kong-manager,env.admin_gui_url=http://localhost/kong-manager,env.admin_gui_api_url=http://localhost/kong-admin



# enable kong admin api
kubectl port-forward svc/kong-kong-admin 8001:8001

# enable kong manager 
kubectl port-forward svc/kong-kong-manager 8002:8002



# Better way change the path of admin and manager

helm install kong kong/kong  --set admin.useTLS=false,admin.enabled=true,admin.http.enabled=true,manager.ingress.path=/kong-manager,admin.ingress.path=/kong-admin,manager.ingress.enabled=true,admin.ingress.enabled=true


# upgrade values

helm upgrade kong kong/kong  --set admin.useTLS=false,admin.enabled=true,admin.http.enabled=true,manager.ingress.path=/kong-manager,admin.ingress.path=/kong-admin,manager.ingress.enabled=true,admin.ingress.enabled=true

helm install kong kong/kong  --set admin.useTLS=false,admin.enabled=true,admin.http.enabled=true,env.admin_gui_path=/kong-manager,env.admin_gui_url=http://localhost/kong-manager,env.admin_gui_api_url=http://localhost/kong-admin

# https://jaygorrell.medium.com/kubernetes-ingress-82aa960f658e