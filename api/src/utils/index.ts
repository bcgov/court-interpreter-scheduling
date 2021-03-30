import * as _ from 'lodash';
import { CreateInterpreterDto } from 'src/interpreter/dto/create-interpreter.dto';

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
    return keyMapping(key, srcValue);
  }
}

/**
 * some type/value of fields are not suitable, using this function to transform
 *
 * @param key
 * @param value
 * @returns
 */
function keyMapping(key: string, value: string): any {
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

  return value;
}
