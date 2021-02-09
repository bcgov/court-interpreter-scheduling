export function capFirstAndSmallRest(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const camelToSnakeCase = (str: string): string => 
    str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
