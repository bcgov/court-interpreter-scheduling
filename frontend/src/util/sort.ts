const fieldSort = (field: string) =>
  (a: any, b: any): number =>
    a[field] === b[field]
      ? 0
      : a[field] > b[field] ? 1 : -1

const arrayFieldSort = (field: string, index: number, subField: string) =>
  (a: any, b: any): number =>
    a[field][index][subField] === b[field][index][subField]
      ? 0
      : a[field][index][subField] > b[field][index][subField] ? 1 : -1

export {
  fieldSort,
  arrayFieldSort,
}