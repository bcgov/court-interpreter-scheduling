export const LanguageMap: Map<string, string> = new Map<string, string>([
  ['ASL', 'Asl'],
  ['CART', 'Cart'],
]);

const reverseMap = (map: Map<string, string>) => {
  const temp = new Map<string, string>();
  for (const [key, value] of map) {
    temp.set(value, key);
  }
  return temp;
};

export const ReverseLanguageMap: Map<string, string> = reverseMap(LanguageMap);
