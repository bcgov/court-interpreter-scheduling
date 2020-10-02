import { Template } from '@app-types/index';
const {OpenShiftClientX} = require('pipeline-cli');

export default function(template: Template) {
    const oc = new OpenShiftClientX(Object.assign({'namespace': template.namespace}, template.options));
    const appSelector = `app=${template.label},env-id=${template.id},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`;
    // Get all bc
    const allBC = oc.get('bc',
    {
        selector: appSelector,
        namespace: template.namespace
    });
    for (const bc of allBC) {
        if (bc.spec.output.to.kind === 'ImageStreamTag') {
            oc.delete([`ImageStreamTag/${bc.spec.output.to.name}`], {'ignore-not-found': 'true', 'wait': 'true', namespace: template.namespace});
          }
    }

    // Get all dc
    const allDC = oc.get('dc',
    {
        selector: appSelector,
        namespace: template.namespace
    });
    for (const dc of allDC) {
        dc.spec.triggers.forEach((trigger: any) => {
            if (trigger.type === 'ImageChange' && trigger.imageChangeParams.from.kind == 'ImageStreamTag') {
              oc.delete([`ImageStreamTag/${trigger.imageChangeParams.from.name}`], {'ignore-not-found': 'true', 'wait': 'true', namespace: template.namespace});
            }
          });
    }

    // Delete all items
    oc.raw('delete', ['all'], {selector: appSelector, wait: 'true', namespace: template.namespace});
    oc.raw('delete', ['all,pvc,secrets,Secrets,secret,configmap,endpoints,Endpoints'], {selector: appSelector, wait: 'true', namespace: template.namespace});
}
