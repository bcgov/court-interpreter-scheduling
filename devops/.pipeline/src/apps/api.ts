import { Application } from '@lib/app';
import { ApplicationName, Env } from '@app-types/index';
import { DataBaseApp } from './db';
import { namespace } from '@config/namespace';

export class ApiApps extends Application {
    dbApp: DataBaseApp;
    constructor(env: Env, id: string, options: any) {
        super(ApplicationName.api, env, id, options);
        this.dbApp = new DataBaseApp(env, id, options);
    }

    resolveResourceParams() {
        const params = super.resolveResourceParams();
        delete params.VOLUME_CAPACITY;
        return params;
    }
    resolveBuildParams() {
        const bc = this.buildConfig();
        return {
            NAME: bc.name,
            TAG: this.tag,
        };
    }
    resolveDeploymentParams() {
        const params = {
            'NAME': this.deploymentConfig().name,
            'DB_SERVICE': this.dbApp.name(),
            TAG: this.tag,
            BUILD_ID: this.id
        };
        return params;
    }
    importImage() {
        return {
            namespace: namespace('tools'),
            tag: this.tag,
        };
    }
    delete() {
        this.deleteDeployment();
    }
}
