import { Application } from '@lib/app';
import { ApplicationName, Env } from '@app-types/index';

export class DataBaseApp extends Application {
    constructor(env: Env, id: string, options: any) {
        super(ApplicationName.db, env, id, options);
    }
    resolveDeploymentParams() {
        const params = {
            'DATABASE_SERVICE_NAME': this.deploymentConfig().name,
        };
        return params;
    }
    importImage() {}
    delete() {
        this.deleteDeployment();
    }
}
