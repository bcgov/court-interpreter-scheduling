import { Controller, Get } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';

import { AppService } from './app.service';
import { AddHiddenFlag } from './common/decorator/flag.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthcheck')
  @Public()
  healthCheck(): string {
    console.log('health-check log');
    return 'hello healthcheck';
  }

  @Get('keycloak')
  keycloak() {
    return 'key cloak success';
  }

  @Get('config')
  @Public()
  @AddHiddenFlag(() => {
    const  deploymentEnvHiddenFlag = process.env.DEPLOYMENT_ENV_HIDDEN_FLAG ? process.env.DEPLOYMENT_ENV_HIDDEN_FLAG.split(',') : [];
    return deploymentEnvHiddenFlag.includes(process.env.DEPLOYMENT_ENV);
  })
  config() {
    return {
      keycloakAuthUrl: process.env.KEYCLOAK_AUTH_URL ?? '',
      keycloakRealm: process.env.KEYCLOAK_REALM ?? '',
    }
  }
}
