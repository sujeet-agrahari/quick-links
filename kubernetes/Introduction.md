# Kubernetes

Kubernetes is a container orchestration platform that automates the deployment, scaling, and management of containerized applications. At a high level, Kubernetes has a master node that controls a set of worker nodes, where applications are deployed and run.

The Kubernetes architecture can be broken down into three main components:

1. Master node: The master node is responsible for managing the Kubernetes cluster. It consists of several components:

- API server: The API server provides a REST API for managing the cluster. It is the central point of communication for all components in the cluster.

- etcd: etcd is a distributed key-value store that stores the configuration data of the cluster. It is used to store the state of the cluster, including all the resource definitions and their current state.

- Controller manager: The controller manager is responsible for managing the controllers that automate the cluster operations, such as replicating pods and managing services.

- Scheduler: The scheduler is responsible for assigning pods to worker nodes based on available resources and the constraints specified in the pod's configuration.

2. Worker node: The worker node is a physical or virtual machine that runs the containerized applications. It consists of several components:

- Kubelet: The Kubelet is an agent that runs on each worker node and is responsible for managing the pods and containers on that node.

- Container runtime: The container runtime is the software that runs the containers on the worker node, such as Docker or containerd.

- Kube-proxy: The Kube-proxy is a network proxy that runs on each worker node and is responsible for managing the network connections between the pods and services.

3. Kubernetes resources: Kubernetes resources are the objects that are managed by the master node and deployed to the worker nodes. These resources include:

- Pods: A pod is the smallest deployable unit in Kubernetes, and it consists of one or more containers.

- ReplicaSets: A ReplicaSet is responsible for ensuring that a specified number of replicas of a pod are running at all times.

- Deployments: A Deployment is a higher-level abstraction over ReplicaSets and provides additional features such as rolling updates and rollbacks.

- Services: A service provides a stable IP address and DNS name for a set of pods and enables load balancing between them.

When a user deploys an application to Kubernetes, they define the desired state of the application using resource definitions. The Kubernetes master node then manages the creation and scaling of the application by communicating with the worker nodes. The worker nodes run the application containers and communicate with each other using the Kubernetes network.

In summary, the Kubernetes architecture consists of a master node that manages a set of worker nodes, where applications are deployed and run. The master node communicates with the worker nodes using the Kubernetes API, and the worker nodes run the containers and manage the network connections between them. Kubernetes resources such as pods, ReplicaSets, Deployments, and Services define the desired state of the application and are managed by the Kubernetes master node.

# Kubernetes Context

In Kubernetes, a context is a way to specify a Kubernetes cluster, a user, and a namespace. A context contains the information that kubectl needs to communicate with a Kubernetes cluster.

The Kubernetes configuration file, which is typically located at ~/.kube/config, contains one or more contexts. Each context specifies a Kubernetes cluster, a user, and a namespace. A user is an entity that can perform actions in a Kubernetes cluster, and a namespace is a way to divide a cluster into virtual sub-clusters.

When you run a kubectl command, it uses the context that is currently set to determine which Kubernetes cluster, user, and namespace to use. You can switch between contexts using the kubectl config use-context <context-name> command.

Contexts are useful when you need to work with multiple Kubernetes clusters or namespaces. For example, if you are managing several Kubernetes clusters, you can create a context for each cluster, which contains the credentials and other configuration information needed to communicate with that cluster. Then, you can switch between contexts to work with each cluster.

Overall, contexts provide a way to manage multiple Kubernetes clusters and namespaces and simplify the process of using kubectl to manage and deploy applications in a Kubernetes environment.

ou can list all available contexts in your Kubernetes configuration file using the kubectl config get-contexts command. This command will display a list of all the contexts that are defined in your ~/.kube/config file, along with the current context that kubectl is using.

Here is an example of the kubectl config get-contexts command:

```sh
$ kubectl config get-contexts
CURRENT   NAME                 CLUSTER              AUTHINFO             NAMESPACE
*         my-cluster-context   my-cluster-cluster   my-cluster-user      my-namespace
          another-context      another-cluster      another-user         another-namespace
          yet-another-context  yet-another-cluster  yet-another-user     yet-another-namespace
```

In this example, there are three contexts defined in the Kubernetes configuration file: my-cluster-context, another-context, and yet-another-context. The \* next to my-cluster-context indicates that it is the current context that kubectl is using. The columns in the output represent the context name, the cluster that the context is associated with, the user that is associated with the context, and the default namespace that is used when executing commands with the context.

Overall, the kubectl config get-contexts command is a useful way to view all the available contexts in your Kubernetes configuration file.

Example:
The command `kubectl config use-context docker-desktop && kubectl cluster-info` does the following:

It sets the context of the kubectl command to docker-desktop. A context in Kubernetes specifies the cluster, user, and namespace to use for kubectl commands. In this case, the docker-desktop context is used, which is a pre-configured context for a Kubernetes cluster running locally on Docker Desktop.

It displays information about the Kubernetes cluster that kubectl is currently pointing to. The kubectl cluster-info command provides information about the Kubernetes control plane, such as its URL and the version of Kubernetes that is running. It also provides information about other components, such as the CoreDNS service that is used for DNS resolution.

Overall, this command sets the context of kubectl to a local Kubernetes cluster and displays information about that cluster. This can be useful for debugging or diagnosing issues with the Kubernetes cluster.

# Kubernetes Namespace

In Kubernetes, a namespace is a way to create a virtual cluster inside a physical cluster. A namespace provides a way to divide a Kubernetes cluster into smaller, more manageable pieces. By creating multiple namespaces, you can isolate resources, control access to those resources, and apply different policies to each namespace.

Namespaces are used to organize and manage Kubernetes resources such as pods, services, and deployments. When you create a Kubernetes resource, you can specify which namespace it belongs to. By default, if no namespace is specified, the resource is created in the default namespace.

Here are some use cases for namespaces in Kubernetes:

Isolation: You can use namespaces to isolate different applications or environments in the same cluster. For example, you can create a namespace for development, testing, and production environments.

Access control: You can use namespaces to control access to resources in your cluster. By assigning different RBAC (Role-Based Access Control) policies to different namespaces, you can restrict access to resources based on the user's role or group.

Resource quotas: You can use namespaces to enforce resource quotas for a specific set of resources. For example, you can limit the number of pods or the amount of CPU and memory that can be used by resources in a specific namespace.

Overall, namespaces provide a way to organize and manage Kubernetes resources in a logical and scalable way. They allow you to partition your cluster, apply different policies to each partition, and manage those partitions independently.

Example:
The `kubectl create namespace` kong command creates a new Kubernetes namespace called kong.

By running kubectl create namespace kong, you are creating a new namespace called kong, which you can use to organize and manage your Kubernetes resources. You can create pods, deployments, services, and other resources in the kong namespace, and those resources will be isolated from other resources in your Kubernetes cluster

# Using `kubectl`

There is a consistent pattern for using `kubectl` commands in Kubernetes. The basic syntax for kubectl commands is:

```sh
kubectl [command] [TYPE] [NAME] [flags]

```

Here's what each of these parts mean:

`command`: The operation to perform, such as create, get, apply, delete, describe, etc.
`TYPE`: The Kubernetes resource type you want to interact with, such as `pod`, `service`, `deployment`, `namespace`, `configmap`, etc.
`NAME`: The name of the specific resource you want to interact with. This is optional, and if not provided, the command will apply to all resources of the specified type.
`flags`: Optional flags that modify the behavior of the command, such as `--namespace`, `--context`, `--output`, etc.
The kubectl command also has some common subcommands that can be used across all resource types, such as `apply`, `get`, `delete`, and `describe`.

For example, to get a list of all pods in the current namespace, you would use the following command:

```sh
kubectl get pods

```

To describe a specific pod, you would use:

```sh
kubectl describe pod <pod-name>

```

To create a new deployment from a YAML file, you would use:

```sh
kubectl apply -f deployment.yaml

```

And so on. By following this basic pattern, you can perform a wide range of operations on Kubernetes resources using the `kubectl` command.

# Ingress in Kubernetes

In Kubernetes, an Ingress is an API object that provides a way to manage external access to the services in a cluster. It allows inbound traffic to be routed to different services based on the incoming request's host and path.

An Ingress resource provides a set of rules that allow inbound connections to reach the Kubernetes services. In simple terms, it acts as a reverse proxy that sits in front of one or more services and routes incoming traffic to them.

Using Ingress, you can configure rules for routing HTTP/HTTPS traffic based on hostname, path, or other rules. It provides more flexibility than just using a service or load balancer, as you can create different routing rules based on various parameters. Ingress controllers like Nginx, Traefik, or Istio implement the ingress API and handle the ingress traffic.

In Kubernetes, Ingress is an API object that provides a way to route external traffic to the appropriate service in the cluster. It acts as a traffic manager and exposes HTTP and HTTPS routes from outside the cluster to services within the cluster.

An Ingress controller is a type of application that watches the Kubernetes API server for updates to the Ingress resources and then manages traffic based on the rules defined in those resources. An Ingress controller is essentially a reverse proxy that sits between the client and the server and is responsible for forwarding client requests to the appropriate backend service.

So, the Ingress controller is the component that actually implements the rules defined in the Ingress resource. It is responsible for intercepting incoming requests, processing the routing rules, and forwarding the requests to the appropriate backend service.

You need an Ingress controller because Ingress resources are not self-sufficient, meaning they don't do anything on their own. The Ingress controller is responsible for interpreting the rules defined in the Ingress resources and implementing them. Without an Ingress controller, Ingress resources are useless.

There are several Ingress controllers available for Kubernetes, including Nginx, Traefik, and Istio.

Kubernetes does not have a built-in Ingress Controller. In order to use Ingress resources, you need to have an Ingress Controller running in your cluster. There are several Ingress Controllers available, including Nginx, Traefik, and Kong.

To expose a service outside the cluster, Kubernetes provides different options, such as:

NodePort: A port is assigned on each node to forward traffic to the service.

LoadBalancer: A cloud load balancer is created to forward traffic to the service.

Ingress: An Ingress resource is created to configure a layer-7 load balancer to forward traffic to the service.

By using any of these options, a Kubernetes service can be made available to users outside the cluster.

# Port Mapping Semantic

Docker and Kubernetes use a similar semantic for port mapping, where you can specify the internal port of the container and the external port to which it should be exposed on the host machine.

The syntax for port mapping in Kubernetes is as follows:

```sh
kubectl port-forward <pod-name> <host-port>:<container-port>

```

Here, the `host-port` is the port number on the host machine where the container port is exposed, and `container-port` is the port number on the container that the service is listening on.

To remember which is the internal and which is the external port, you can use the following convention:

The first port number (before the colon) represents the port on the host machine, and the second port number (after the colon) represents the port on the container.
You can remember this by thinking of **_the colon as a gateway_** or a separator between the host and container ports.
For example, if you specify` -p 80:8080`, this means that the container is listening on port 8080, and the port is exposed to the host machine on port 80.

---
### Want to learn more?
[Kubernetes Learning Path](https://github.com/techiescamp/kubernetes-learning-path)
