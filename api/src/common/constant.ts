export const LanguageDisplayNameToNameMap: Map<string, string> = new Map<string, string>([
  ['ASL', 'Asl'],
  ['CART', 'Cart'],
]);

export const LanguageNameToDisplayName: Map<string, string> = new Map<string, string>(
  Array.from(LanguageDisplayNameToNameMap).map(([x, y]) => [y, x]),
);
