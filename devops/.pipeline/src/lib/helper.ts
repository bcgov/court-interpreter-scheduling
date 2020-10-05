import { Env } from '../types';
import { NameSpaceConfig, namespace } from '@config/namespace';
import * as assert from 'assert';
import * as path from 'path';
const util = require('pipeline-cli').Util;

export const processOptions = (options: any) => {
    const result = options;
    // Check git
    if (!result.git.url.includes('.git')) {
      result.git.url = `${result.git.url}.git`;
    }
    if (!result.git.http_url.includes('.git')) {
      result.git.http_url = `git@github.com:FreshworksStudio/Court-scheduler.git`;
    }
    // Fixing repo
    if (result.git.repository.includes('/')) {
      const last = result.git.repository.split('/').pop();
      const final = last.split('.')[0];
      result.git.repository = final;
    }
    return result;
};

export const pipelineOptions = (): any => processOptions(util.parseArguments());

export const buildConfig = (name: string, version: string = '1.0', id: string = 'default', branch?: string) => {
  return {
      namespace: namespace('tools'),
      name,
      phase: 'build',
      id,
      version,
      tag: `${branch ?? version}-${id}`,
      label: `${name}`
  };
};

export const deploymentConfig = (name: string, key: string, env: Env, version: string = '1.0', id: string = 'default') => {
  const project = namespace(env);
  assert(project, `deploymentConfig: No namespace for ${env}`);
  let host;
  if (env === 'prod') {
      host = `${key}-${NameSpaceConfig.hostDomain.prod}`;
  } else {
      host = `${env}-${key}-${NameSpaceConfig.hostDomain.dev}`;
  }
  return {
      namespace: project,
      name,
      phase: env,
      id,
      version,
      tag: `${version}-${id}`,
      label: `${name}`,
      host
  };
};

export const getTemplatePath = (templateFileName: string) => {
  assert(typeof templateFileName === 'string', `Unknown template file type ${typeof templateFileName}`);
  return path.resolve(__dirname, '../../../../openshift/', templateFileName);
};
