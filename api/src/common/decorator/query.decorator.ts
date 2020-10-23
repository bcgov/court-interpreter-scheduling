import { SelectQueryBuilder } from 'typeorm';

export function AndWhere(sql: string, column: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const queryBuilder = originalMethod.apply(
        this,
        args,
      ) as SelectQueryBuilder<any>;
      const val = this[column];
      if (val) {
        if (Array.isArray(val) && val.length === 0) {
          return;
        }
        queryBuilder.andWhere(sql, {
          [column]: sql.includes('LIKE') ? `%${val}%` : val,
        });
      }
      return queryBuilder;
    };
  };
}
