import { MersenneTwister19937, integer, Engine } from 'random-js'
import { first_name, last_name } from 'faker/lib/locales/en/name'
import * as crypto from 'crypto'

export type ValueType = 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'postalCode' | 'province'

const engine = (randomSeed?: number): Engine => {
    if (randomSeed) {
        return MersenneTwister19937.seed(randomSeed)
    } else {
        return MersenneTwister19937.autoSeed()
    }
}

const choose = <T>(engine: Engine, from: T[]): T => {
    return from[integer(0, from.length - 1)(engine)]
}

const LAST_NAMES = last_name as string[]
const FIRST_NAMES = first_name as string[]

const CITIES = [
    'Abbotsford',
    'Armstrong',
    'Burnaby',
    'Campbell River',
    'Castlegar',
    'Chilliwack',
    'Colwood',
    'Coquitlam',
    'Courtenay',
    'Cranbrook',
    'Dawson Creek',
    'Delta',
    'Duncan',
    'Enderby',
    'Fernie',
    'Fort St. John',
    'Grand Forks',
    'Greenwood',
    'Kamloops',
    'Kelowna',
    'Kimberley',
    'Langford',
    'Langley',
    'Maple Ridge',
    'Merritt',
    'Nanaimo',
    'Nelson',
    'New Westminster',
    'North Vancouver',
    'Parksville',
    'Penticton',
    'Pitt Meadows',
    'Port Alberni',
    'Port Coquitlam',
    'Port Moody',
    'Powell River',
    'Prince George',
    'Prince Rupert',
    'Quesnel',
    'Revelstoke',
    'Richmond',
    'Rossland',
    'Salmon Arm',
    'Surrey',
    'Terrace',
    'Trail',
    'Vancouver',
    'Vernon',
    'Victoria',
    'West Kelowna',
    'White Rock',
    'Williams Lake',
]

export const anonymousValue = (valueType: ValueType, randomSeed?: number): string => {
    const gen = engine(randomSeed)

    switch (valueType) {
        case 'firstName':
            return choose(gen, FIRST_NAMES)
        case 'lastName':
            return choose(gen, LAST_NAMES)
        case 'email':
            return `${anonymousValue('firstName', randomSeed).toLowerCase()}.${anonymousValue('lastName', randomSeed).toLowerCase()}@fake.com`
        case 'phone':
            return '555-555-5555'
        case 'address':
            return `${integer(1, 1000000)(gen)} Main Street`
        case 'province':
            return 'BC'
        case 'postalCode':
            return 'V8V 2L8'
        case 'city':
            return choose(gen, CITIES)
    }
}

const deterministicSeedFromObject = <K extends keyof any, T extends Record<K, string>>(
        obj: T, keys: K[]): number => {
    const sortedKeys = keys.sort()
    const values = sortedKeys.map(k => obj[k])
    const concated = values.reduce((x, y) => x + y, "")
    return crypto
        .createHash('md5')
        .update(concated)
        .digest()
        // Just take the first 32 bits of the hash, should be enough to seed the RNG
        .readInt32LE(0) 
}

/**
 * Deterministic anonymisation of all (shallow) values in an object.
 * Returns a copy of the object with values at the given keys replaced with
 * anonymised versions.
 */
export const anonymiseObject =
    <K extends keyof any, T extends Partial<Record<K, any>>>(
        obj: T, 
        keysToAnonymise: Partial<Record<K, ValueType>>): T => {
    const result = {...obj}
    const seed = deterministicSeedFromObject(result, Object.keys(keysToAnonymise))
    for (const [key, valueType] of Object.entries(keysToAnonymise)) {
        result[key] = anonymousValue(valueType as ValueType, seed)
    }
    return result
}
