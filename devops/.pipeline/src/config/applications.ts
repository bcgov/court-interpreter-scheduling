import { PipelineConfig} from '../types';
export const Pipeline: PipelineConfig = {
    suffix: 'court-interpreter-scheduler',
    version: '1.0',
    defaultResource: {
        cpuLimit: '500m',
        memoryLimit: '512Mi',
        cpuRequest: '200m',
        memoryRequest: '256Mi',
        replicas: '1',
        maxReplicas: '1',
    },
    defaultBuildResource: {
        cpuLimit: '1000m',
        memoryLimit: '1Gi',
        cpuRequest: '500m',
        memoryRequest: '512Mi',
    },
    apps: {
        db: {
            name: 'db',
            hostPrefix: 'db',
            resource: {
                default: {
                    cpuRequest: '500m',
                    memoryRequest: '512Mi',
                    cpuLimit: '1000m',
                    memoryLimit: '1Gi',
                    volumeCapacity: '3Gi'
                }
            },
            template: {
                build: '',
                deploy: 'db.dc.yml'
            },
            info: {}
        },
        api: {
            name: 'api',
            hostPrefix: 'api',
            resource: {
                default: {
                    cpuRequest: '500m',
                    memoryRequest: '512Mi',
                    cpuLimit: '1000m',
                    memoryLimit: '1Gi',
                }
            },
            template: {
                build: 'api.bc.yml',
                deploy: 'api.dc.yml'
            },
            info: {}
        },
    },
    git: {
        url: 'git@github.com:FreshworksStudio/Court-scheduler.git',
        branch: 'dev'
    }
};

