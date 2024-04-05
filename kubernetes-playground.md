# Kubernetes Playground

> [!NOTE]
> Login on https://labs.play-with-k8s.com/ and follow below steps

### 1. Initializes cluster master node:

```sh
kubeadm init --apiserver-advertise-address $(hostname -i) --pod-network-cidr 10.5.0.0/16
```

### 2. Initialize cluster networking:

```sh
kubectl apply -f https://raw.githubusercontent.com/cloudnativelabs/kube-router/master/daemonset/kubeadm-kuberouter.yaml
```

### 3. Add another instance

### 4. Create join token

```sh
kubeadm token create --print-join-command
```

### 5. Join the node to cluster(replace below with the output from step 4)

> [!IMPORTANT]
> Every worker node must have kubelet installed and running as a system service. Please install kubelet on the target node before executing the join command.

```sh
sudo apt install kubeadm kubelet kubectl # optional for listed playground as it comes with pre-installed

```

```sh
kubeadm join 192.168.0.8:6443 --token c2ioq4.hy4ysw7ipf8a9svf --discovery-token-ca-cert-hash sha256:d507dc03285b97e1442dff82c07c7c623b4ac3d73379ca0cd954128a67f58423
```

### 6. List nodes on master

```sh
kubectl get nodes
```

### 7. List pods on specific nodes

```sh
kubectl get pods --field-selector spec.nodeName=node2
```

### 8. Deploy nginx app

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/application/nginx-app.yaml
```

> [!NOTE]
> List and verify the pods on both node1(master) and node2(worker)
> Pods should be running on worker nodes only

### 9. Get system level components

```sh
kubectl get pods -n kube-system
```

### 10. Get the system level components on a specific node

```sh
kubectl get pods -n kube-system --field-selector spec.nodeName=node2
```
