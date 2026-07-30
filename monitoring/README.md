# Monitoring (Prometheus + Grafana)

Prometheus and Grafana stack for the employee-management-system, based on [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack).

## Prerequisites

- Kubernetes cluster (Rancher Desktop recommended)
- `kubectl` and Helm 3
- Chart dependencies downloaded (see below)

## One-time setup

Download the Helm chart dependency:

```bash
helm dependency update ./monitoring
```

## Install

```bash
helm upgrade --install monitoring ./monitoring \
  --namespace monitoring \
  --create-namespace
```

Check status:

```bash
kubectl get pods -n monitoring
helm list -n monitoring
```

## Access Grafana

```bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```

Open **http://localhost:3000**

- Username: `admin`
- Password: `admin` (change in `values.yaml` before production)

## Access Prometheus

```bash
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
```

Open **http://localhost:9090**

## Upgrade

```bash
helm dependency update ./monitoring
helm upgrade monitoring ./monitoring -n monitoring
```

## Uninstall

```bash
helm uninstall monitoring -n monitoring
kubectl delete namespace monitoring
```

To remove Prometheus operator CRDs as well:

```bash
kubectl get crd -o name | grep monitoring.coreos.com | xargs kubectl delete
```

## Configuration

Edit `values.yaml` to customize Grafana password, scrape intervals, or resource limits.

To see all upstream options:

```bash
helm show values monitoring/charts/kube-prometheus-stack-*.tgz
```

## Useful Grafana queries

In **Explore**, select Prometheus and try:

```promql
up
count(kube_pod_info) by (namespace)
rate(container_cpu_usage_seconds_total{container!=""}[5m])
```

## Dashboards

Built-in Kubernetes dashboards are auto-loaded. Go to **Dashboards → Browse** and search for "Kubernetes".
