import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LocationFetchScheduleService {
  private readonly logger = new Logger(LocationFetchScheduleService.name);

  public fetchAndStoreLocation() {
    
  }

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
