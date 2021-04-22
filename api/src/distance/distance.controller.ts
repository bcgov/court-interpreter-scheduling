import { Controller, Get, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import * as csvtojson from 'csvtojson';
import { FileInterceptor } from '@nestjs/platform-express';

import { InterpreterService } from 'src/interpreter/interpreter.service';
import { LocationService } from 'src/location/location.service';
import { DistanceService } from './distance.service';

@Controller('distance')
export class DistanceController {
  constructor(
    private readonly interpreterService: InterpreterService,
    private readonly locationService: LocationService,
    private readonly distanceService: DistanceService,
  ) {}

  @Get('generate')
  async generateDistance() {
    const courtAddrs = await this.locationService.findAllAddress();
    const intpAddrs = await this.interpreterService.findAllAddress();
    const distanceData = await this.distanceService.generate({ courtAddrs, intpAddrs });
    return { length: distanceData.length, data: distanceData };
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(@UploadedFile() file: Express.Multer.File) {
    try {
      /**
       * check if it's correct file type
       */
      if (file.mimetype !== 'text/csv') {
        throw new Error('file type not correct');
      }

      let headers = [
        // the order of csv file must be consistent as sample file
        'intpAddr',
        'courtAddr',
        'distance',
      ];

      /**
       * convert csv to json
       */
      let json: {
        courtAddr: string;
        intpAddr: string;
        distance: string;
      }[] = await csvtojson({
        noheader: false,
        headers,
      }).fromString(file.buffer.toString());

      /**
       * insert json to database
       */
      const uploadedData = await this.distanceService.createMany(json);

      /**
       * return detail info
       */
      return {
        num: uploadedData.length,
        uploadedData,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
