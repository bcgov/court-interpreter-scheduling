import { Controller, Get, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus, Body } from '@nestjs/common';
import * as csvtojson from 'csvtojson';
import { FileInterceptor } from '@nestjs/platform-express';

import { InterpreterService } from 'src/interpreter/interpreter.service';
import { LocationService } from 'src/location/location.service';
import { DistanceService } from './distance.service';
import { FileUploadDistanceDto } from './dto/file-upload-distance.dto';
import { RoleMatchingMode, Roles } from 'nest-keycloak-connect';

@Controller('distance')
export class DistanceController {
  constructor(
    private readonly interpreterService: InterpreterService,
    private readonly locationService: LocationService,
    private readonly distanceService: DistanceService,
  ) {}

  @Get('generate')
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async generateDistance() {
    const courtAddrs = await this.locationService.findAllAddress();
    const intpAddrs = await this.interpreterService.findAllAddress();
    await this.distanceService.generate({ courtAddrs, intpAddrs });
    return { success: true };
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async uploadCSV(@UploadedFile() file: Express.Multer.File, @Body() fileUploadDistanceDto: FileUploadDistanceDto) {
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

      // empty table if needed
      if (fileUploadDistanceDto.isEmptyTable) {
        await this.distanceService.emptyTable();
      }

      /**
       * insert json to database
       */
      await this.distanceService.createMany(json);

      /**
       * return detail info
       */
      return {
        success: true,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
