
import { fixLanguageName } from './languages' 

function l(name: string): { languageName: string, anotherProp: number } {
    return { languageName: name, anotherProp: 3 }
}

describe("fixLanguageName", () => {
    test("should replace acronym names with uppercase version", () => {
        expect(fixLanguageName(l("Cart"))).toEqual(l("CART"))
        expect(fixLanguageName(l("Asl"))).toEqual(l("ASL"))
    })

    test("should capitalise dialects", () => {
        expect(fixLanguageName(l("kurdish (sorani)"))).toEqual(l("Kurdish (Sorani)"))
    })
})
