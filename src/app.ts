import { KubeConfig, CoreV1Api, V1PodList, V1DeploymentList, AppsV1Api, V1ServiceList } from '@kubernetes/client-node';

const _namespace = process.env.NAMESPACE || 'default';

// Load kubeconfig from cluster 
const kubeConfig = new KubeConfig();
kubeConfig.loadFromCluster();
const coreApiClient = kubeConfig.makeApiClient(CoreV1Api);
const appApiClient = kubeConfig.makeApiClient(AppsV1Api);

async function getPods(): Promise<V1PodList> {
    const labelSelector = null;
    const response = await coreApiClient.listNamespacedPod(_namespace, null, false, null, null, labelSelector);
    return response.body;
}

async function getDeployments(): Promise<V1DeploymentList> {
    const labelSelector = null;
    const response = await appApiClient.listNamespacedDeployment(_namespace, null, false, null, null, labelSelector);
    return response.body;
}

async function getServices(): Promise<V1ServiceList> {
    const labelSelector = null;
    const response = await coreApiClient.listNamespacedService(_namespace, null, false, null, null, labelSelector);
    return response.body;
}

async function reapPods(podList: V1PodList) {
    const pods = podList.items;
    const promises = pods.map(pod => coreApiClient.deleteNamespacedPod(pod.metadata.name, pod.metadata.namespace));
    return Promise.all(promises);
}

async function readDeployments(deploymentList: V1DeploymentList) {
    const deployments = deploymentList.items;
    const promises = deployments.map(deployment => appApiClient.deleteNamespacedDeployment(deployment.metadata.name, deployment.metadata.namespace));
    return Promise.all(promises);
}

async function reapServices(serviceList: V1ServiceList) {
    const services = serviceList.items;
    const promises = services.map(service => coreApiClient.deleteNamespacedService(service.metadata.name, service.metadata.namespace));
    return Promise.all(promises);
}