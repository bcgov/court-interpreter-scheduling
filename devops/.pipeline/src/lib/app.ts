import { buildConfig, deploymentConfig } from '@lib/helper';
import { Pipeline } from '@config/applications';
import { getTemplatePath } from './helper';
import { ApplicationConfig, ApplicationName, BuildTemplate, DeploymentTemplate, Env, Resource } from '@app-types/index';
import { namespace } from '@config/namespace';
import deploy from '@lib/deploy';
import build from '@lib/build';
import ocDelete from './ocDelete';

const assert = require('assert');

/**
 * Application Class
 */
export class Application {
    key: ApplicationName;
    env: Env;
    appConfig: ApplicationConfig;
    id: string;
    options: any;
    branch?: string;
    constructor(key: ApplicationName, env: Env, id: string, options: any) {
        assert(Pipeline.apps[key], `Pipeline-app: No application config for key: ${key}`);
        this.key = key;
        this.env = env;
        this.id = id;
        this.options = options;
        this.appConfig = Pipeline.apps[key] ?? {
            name: `${this.key}`,
            hostPrefix: `${this.key}`,
            template: {
                build: '',
                deploy: ''
            },
            info: {}
        };
        this.branch = options.branch;
    }

    get tag(): string {
        return this.buildConfig().tag;
    }


    buildConfig() {
        return buildConfig(this.name(), Pipeline.version, this.id, this.branch);
    }

    buildTemplate() {
        const branch = this.branch;
        const resourceParam = this.resolveResourceParams(Pipeline.defaultBuildResource);
        delete resourceParam.VOLUME_CAPACITY;
        delete resourceParam.MAX_REPLICAS;
        delete resourceParam.REPLICAS;
        const params = {
            ...resourceParam,
            ...this.resolveBuildParams()
        };
        const bc = this.buildConfig();
        const template: BuildTemplate = {
            ...bc,
            gitBranch: branch,
            gitURL: Pipeline.git.url,
            params,
            path: getTemplatePath(this.appConfig.template.build),
            options: this.options,
            env: 'build'
        };
        return template;
    }

    importImage(): any | undefined {
        return  {
            namespace: namespace('tools'),
            tag: this.tag
        };
    }

    deploymentConfig() {
        return deploymentConfig(this.name(), this.key, this.env, Pipeline.version, this.id);
    }

    deploymentTemplate() {
        const dc = this.deploymentConfig();
        const config: DeploymentTemplate = {
            name: this.name(),
            namespace: dc.namespace,
            params: this.deploymentParams(),
            label: dc.label,
            options: this.options,
            id: this.id,
            path: getTemplatePath(this.appConfig.template.deploy),
            import: this.importImage() ,
            env: this.env,
            tag: this.tag,
        };
        return config;
    }

    build() {
        build(this.buildTemplate());
    }

    name() {
        return `${this.key}-${Pipeline.suffix}`;
    }
    deploymentTemplatePath() {
        return getTemplatePath(this.appConfig.template?.deploy);
    }

    buildTemplatePath() {
        return getTemplatePath(this.appConfig.template?.build);
    }

    resolveResource() {
        const resourceDefault = Object.assign(Pipeline.defaultResource, this.appConfig.resource?.default ?? {});
        if (this.env === 'prod') {
            return Object.assign(resourceDefault, this.appConfig.resource?.prod ?? {});
        }
        return resourceDefault;
    }

    resolveResourceParams(inputResource?: Resource) {
        const resource = inputResource ?? this.resolveResource();
        return {
            CPU_REQUEST: resource.cpuRequest,
            MEMORY_REQUEST: resource.memoryRequest,
            CPU_LIMIT: resource.cpuLimit,
            MEMORY_LIMIT: resource.memoryLimit,
            REPLICAS: resource.replicas,
            MAX_REPLICAS: resource.maxReplicas,
            VOLUME_CAPACITY: resource.volumeCapacity
        };
    }

    // Placeholder
    resolveBuildParams(): any {}
    // Place holder
    resolveDeploymentParams(): any {}

    deploymentParams() {
        return {
            ...this.resolveResourceParams(),
            ...this.resolveDeploymentParams(),
        };
    }

    deploy() {
        deploy(this.deploymentTemplate());
    }

    deleteDeployment() {
        ocDelete(this.deploymentTemplate());
    }

    deleteBuild() {
        ocDelete(this.buildTemplate());
    }
    delete() {}
}
