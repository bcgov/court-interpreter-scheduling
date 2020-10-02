'use strict';
import * as assert from 'assert';
import * as fs from 'fs';
import { BuildTemplate } from '@app-types/index';
const {OpenShiftClientX} = require('pipeline-cli');


export default function (config: BuildTemplate) {
    // Verify config

    // Check file exists in path or not
    assert(fs.existsSync(config.path), `Build: Template file path missing`);

    const oc = new OpenShiftClientX(Object.assign({'namespace': config.namespace}, config.options));
    const objects = [];
    const localTemplateURL = oc.toFileUrl(config.path);

    // Process template
    objects.push(...oc.processDeploymentTemplate(localTemplateURL, {
        param: {
            SOURCE_REPOSITORY_REF: config.gitBranch || oc.git.ref,
            SOURCE_REPOSITORY_URL: config.gitURL,
            ...config.params,
        }
    }));

    // Apply labels
    oc.applyRecommendedLabels(objects, config.name, 'build', config.id, config.label);

    // Build
    oc.applyAndBuild(objects);

}
