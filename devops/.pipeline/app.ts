require('module-alias/register');
import { pipelineOptions } from '@lib/helper';
import { ApplicationName } from '@app-types/index';
import { DataBaseApp } from '@apps/db';
import { ApiApps } from '@apps/api';
import { exit } from 'process';
import { Application } from '@lib/app';

enum ScriptAction {
    build = 'build',
    deploy = 'deploy',
    delete = 'delete'
}
/**
 * Scripts method
 */
const usageMessage = `Usage: ts-node app.js <options>` +
`\n --app: application name [example: api, app, db]` +
`\n --env: Environment name [dev, test, prod]` +
`\n --action: Build or Deploy [build, deploy]` +
`\n --id: Operation id [any number string]` +
`\n --branch: (optional) git branch to build`;

const error = (message: string) => {
    console.error(message);
    console.error(usageMessage);
    exit(0);
};
(() => {
    const options = pipelineOptions();
    const action = options.action as ScriptAction;
    // console.log(`${JSON.stringify(options, null, 2)}`);

    if (options.help) {
        console.log(usageMessage);
        return;
    }

    if (! Object.values(ApplicationName).includes(options.app)) {
        error(`Error:Unknown app name ${options.app}: `);
    }
    if (!action) {
        error(`Error: Require Action  ${action}`);
    }
    if (!Object.values(ScriptAction).includes(action)) {
        error(`Error: Unknown script action ${action}`);
    }
    if (action !== 'build' && !options.env) {
        error(`Error: No env`);
    }
    if (!options.id) {
        error(`Error: No id`);
    }
    const appName = options.app as ApplicationName;

    console.log(`Action: ${action}`);
    console.log(`env: ${options.env}`);
    console.log(`app: ${appName}`);
    console.log(`id: ${options.id}`);
    let app: Application;
    switch (appName) {
        case ApplicationName.db:
            app = new DataBaseApp(options.env, options.id, options);
            break;
        case ApplicationName.api:
            app = new ApiApps(options.env, options.id, options);
            break;
        case ApplicationName.app:
            app = new DataBaseApp(options.env, options.id, options);
            break;
    }
    if (app) {
        switch (action) {
            case ScriptAction.deploy:
                app.deploy();
                break;
            case ScriptAction.build:
                app.build();
                break;
            case ScriptAction.delete:
                app.delete();
                break;
        }
    }
})();
