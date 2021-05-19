import * as _ from 'lodash';
import * as ExcelJS from 'exceljs';
import { isSameDay, getUnixTime } from 'date-fns';

import { CreateInterpreterDto } from 'src/interpreter/dto/create-interpreter.dto';
import { GoogleDistance } from 'src/distance/googleMap';
import { BookingDateEntity } from 'src/booking/entities/booking-date.entity';
import { BookingDateDto } from 'src/booking/dto/booking-date.dto';
import { Level } from 'src/interpreter/enums/level.enum';

export function capFirstAndSmallRest(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const camelToSnakeCase = (str: string): string => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

/**
 * 
 * @param directories 
 * 
 * convert the data like the following to type CreateInterpreterDto:
 * [{
    languages: [{ level: 'Level 2', commentOnLevel: '', languageName: 'Korean' }],
    lastName: 'Fiedler',
    firstName: 'Jungwon (Julie)',
    address: '605-283 Davie Street',
    city: 'Vancouver',
    province: 'BC',
    postal: 'V6B 5T6',
    homePhone: '604.866.4418',
    businessPhone: '',
    phone: '',
    email: 'info@julietheinterpreter.com',
    supplier: '2305389',
    gst: '',
    criminalRecordCheck: '5-Feb-14',
    comments: '',
    contractExtension: 'Yes',
    contractTermination: ''
  },...],
 */

export const mappingDirectories = (directories: any[]): CreateInterpreterDto[] => {
  return _.chain(directories)
    .groupBy('email')
    .map(value => _.mergeWith({ languages: [] }, ...value, customizer))
    .value();
};

/**
 * helpers
 */

/**
 * used in lodash _.mergeWith to refactor the langauges to array
 *
 * @param objValue
 * @param srcValue
 * @param key
 * @returns
 */
function customizer(objValue: any, srcValue: any, key: string) {
  if (_.isArray(objValue)) {
    if (srcValue.length > 0) {
      const srcValueChildren = srcValue[0];
      if (srcValueChildren.level) {
        return objValue.concat([{ ...srcValueChildren, level: keyMapping('level', srcValueChildren.level) }]);
      }
    }
    return objValue.concat(srcValue);
  } else {
    return keyMapping(key, srcValue, objValue);
  }
}

/**
 * some type/value of fields are not suitable, using this function to transform
 *
 * @param key
 * @param value
 * @returns
 */
function keyMapping(key: string, value: string, objValue?: string): any {
  // contractExtension, contractTermination to boolean
  if (['contractExtension', 'contractTermination'].includes(key)) {
    if (value.toLowerCase() === 'yes') {
      return true;
    } else if (value.toLowerCase() === 'no') {
      return false;
    } else {
      return null;
    }
  }

  // 'Level 3' => 3
  if (key === 'level') {
    const arr = value.split(' ');
    if (arr.length > 1) {
      return arr[1];
    } else {
      return arr[0];
    }
  }

  //if coming value is empty and exists value is non-empty, then use non-empty value. ex. phone field
  if (!value && !!objValue) {
    return objValue;
  }

  return value;
}

/**
 *
 * Generate Spreadsheet related:
 */

/**
 * Get index from [a, b, c, ..., z, aa, ab, ..., az, ba, bb, ..., bz...]
 * actually, this is base 26
 * @param char
 * @returns 1, 2, ..., 26
 */
export const getIndexOfAlphabet = (char: string): number => {
  const singleCharIndex = (single: string) => single.toLowerCase().charCodeAt(0) - 96;
  if (char.length === 1) return singleCharIndex(char);

  const charArr = char.split('').reverse();
  return charArr.reduce((total, val, idx) => total + singleCharIndex(val) * Math.pow(26, idx), 0);
};

/**
 * convert bool to Yes/No
 * @param bool
 * @returns Yes | No
 */
export const formatYesNo = (bool: boolean): 'Yes' | 'No' => (bool ? 'Yes' : 'No');

/**
 * helper of setting the cell value
 * @param workSheet
 * @returns setCell function
 */
export const setCellHelper = (workSheet: ExcelJS.Worksheet) => ({
  row,
  column,
  value,
  alignment,
}: {
  row: number;
  column: string;
  value: string;
  alignment?: ExcelJS.Alignment['horizontal'];
}) => {
  const Row = workSheet.getRow(row);
  Row.getCell(getIndexOfAlphabet(column)).value = value;
  if (alignment) {
    Row.alignment = { horizontal: alignment, wrapText: true };
  }
  Row.commit();
};

/**
 * map and join strings arrary
 */
export const mapAndJoin = (
  strings: string[],
  delimiter: string = ', ',
  transform: (str: string) => string = (str: string) => str,
): string => {
  return strings.map(transform).join(delimiter);
};

export const isProduction = process.env.DEPLOYMENT_ENV === 'prod';

/**
 * Return distance from the data fetched from google map api
 * refering to googleMapApi.mock.ts file for the data structure
 * @param data
 */
export const parseDistanceFromGoogleApi = (data: GoogleDistance) => {
  if (data?.routes && data?.routes?.length > 0) {
    const { legs } = data.routes[0];
    if (legs.length > 0) {
      const leg = legs[0];
      return leg.distance.value / 1000;
    }
  }

  return null;
};

/**
 * check if entity = dto
 * @param entity
 * @param dto
 */
export const isSameBookingDate = (entity: BookingDateEntity, dto: BookingDateDto) =>   
  isSameDay(new Date(entity.date), new Date(dto.date)) && entity.period === dto.period && entity.arrivalTime === dto.arrivalTime;

  /**
 * sort array of booking dates by date
 * @param BookingDate[]
 * @param BookingDate[]
 */
export const sortBookingDates = (a: BookingDateEntity, b: BookingDateEntity) => {
  console.dir(getUnixTime(a.date));
  console.dir(getUnixTime(b.date));
  return getUnixTime(a.date) === getUnixTime(b.date) ? 0 : getUnixTime(a.date) > getUnixTime(b.date) ? 1 : -1
}

export const levelToMoney = {
  [Level.one]: 63.16,
  [Level.two]: 55.80,
  [Level.three]: 37.94,
  [Level.four]: 37.94,
}

