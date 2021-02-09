import { describe, test, expect } from '@jest/globals'
import { anonymiseObject, ValueType } from './anonymisation'

describe('anonymiseObject', () => {
    test('should work for simple examples', () => {
        const exampleObj: { firstName: string, lastName: string, other: object[], city?: string } = {
            firstName: 'Steve 1',
            lastName: 'Jobs 2',
            other: [{
                someKey: 'yo'
            }]
        }

        const anonymised = anonymiseObject(exampleObj, {
            'firstName': 'firstName',
            'lastName': 'lastName',
            'city': 'city'
        })
        expect(anonymised.other).toEqual(exampleObj.other)
        expect(anonymised.firstName).not.toEqual(exampleObj.firstName)
        expect(anonymised.lastName).not.toEqual(exampleObj.lastName)
        expect(anonymised.firstName.length).toBeGreaterThan(1)
        expect(anonymised.lastName.length).toBeGreaterThan(1)
        expect(anonymised.city.length).toBeGreaterThan(1)

        // Check determinism
        expect(anonymiseObject(exampleObj, {
            'firstName': 'firstName',
            'lastName': 'lastName',
            'city': 'city'
        })).toEqual(anonymised)

        // Check determinism affected by keys provided
        expect(anonymiseObject(exampleObj, {
            'firstName': 'firstName',
            'city': 'city'
        })).not.toEqual(anonymised)
    })
})
