export enum DeploymentEnv {
    Prod = 'prod',
    Test = 'test',
    Dev = 'dev',
  }
  
  export interface Flag {
    deploymentEnv: DeploymentEnv[];
  }
  