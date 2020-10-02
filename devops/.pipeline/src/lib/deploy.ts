'use strict';
import * as assert from 'assert';
import * as fs from 'fs';
import { DeploymentTemplate } from '@app-types/index';
const {OpenShiftClientX} = require('pipeline-cli');

export default function (config: DeploymentTemplate) {
    // Check config
    assert(config.name.length > 0, 'Deploy: Missing deployment name');
    assert(Object.keys(config.params).length > 0, 'Deploy: Missing deployment parameters');

    // Check file exists in path or not
    assert(fs.existsSync(config.path), `Deploy: Template file path missing: ${config.path}`);

    const oc = new OpenShiftClientX(Object.assign({'namespace': config.namespace}, config.options));
    const objects = [];
    const localTemplateURL = oc.toFileUrl(config.path);

    // Process template
    objects.push(...oc.processDeploymentTemplate(localTemplateURL, {
        param: {
            ...config.params
        }
    }));

    // Apply level
    oc.applyRecommendedLabels(objects, config.name, config.env, `${config.id}`, config.label);
    // Checking for import
    if (config.import) {
        console.log(`Will import image`);
        assert(config.import.namespace, 'Deploy: Image import source namespace is missing');
        assert(config.import.tag, 'Deploy: Image import missing tags');
        oc.importImageStreams(objects, config.tag, config.import.namespace, config.import.tag);
    }

    // Deploy
    oc.applyAndDeploy(objects);
}
