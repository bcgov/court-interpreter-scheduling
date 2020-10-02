export const NameSpaceConfig = {
    hostDomain: {
        dev: 'court-interpreter-scheduler.pathfinder.gov.bc.ca',
        prod: 'court-interpreter-scheduler.pathfinder.gov.bc.ca',
    },
    namespaceSuffix: 'l4izby',
    namespaces: {
        tools: 'tools',
        dev: 'dev',
        test: 'test',
        prod: 'prod'
    },
};

export const namespace = (phase: string) => `${NameSpaceConfig.namespaceSuffix}-${NameSpaceConfig.namespaces[phase]}`;
