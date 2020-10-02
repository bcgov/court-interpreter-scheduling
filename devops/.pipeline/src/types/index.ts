/** Types */
export type Env = 'dev' | 'test' | 'tools' | 'prod';

export enum ApplicationName {
    api = 'api',
    app = 'app',
    db = 'db'
}

export interface Resource {
    cpuRequest: string;
    memoryRequest: string;
    cpuLimit: string;
    memoryLimit: string;
    volumeCapacity?: string;
    replicas?: string;
    maxReplicas?: string;
}

export interface ApplicationConfig {
    name: string;
    hostPrefix: string;
    resource?: {
        default?: Resource;
        prod?: Resource;
    };
    template: {
        build: string;
        deploy: string;
    };
    info: {[key: string]: any};
}

export interface PipelineConfig {
    suffix: string;
    version: string;
    defaultResource: Resource;
    defaultBuildResource: Resource;
    apps: {[value in ApplicationName]?: ApplicationConfig};
    git: {
        url: string;
        branch: string;
    };
}

export interface Template {
    name: string;
    namespace: string;
    params: {[key: string]: string};
    options: any;
    label: string;
    id: string;
    path: string;
    env: string;
    tag: string;
}

export interface BuildTemplate extends Template {
    gitBranch?: string;
    gitURL: string;
}

export interface DeploymentTemplate extends Template {
    import?: {
        namespace: string;
        tag: string;
    };
}
