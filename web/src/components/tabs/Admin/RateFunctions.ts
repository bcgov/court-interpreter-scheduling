import { ratesInfoType } from "@/types/Common";


export function getRatesIndices(allRates){
    const rates = {} as ratesInfoType;

    rates.spkl1 = allRates.findIndex(rate => rate.name == 'SPKL1')
    rates.spkl2 = allRates.findIndex(rate => rate.name == 'SPKL2')
    rates.spkl3 = allRates.findIndex(rate => rate.name == 'SPKL3')
    rates.spkl4 = allRates.findIndex(rate => rate.name == 'SPKL4')

    rates.asl1 = allRates.findIndex(rate => rate.name == 'ASL1')
    rates.asl2 = allRates.findIndex(rate => rate.name == 'ASL2')
    
    rates.cart = allRates.findIndex(rate => rate.name == 'CART')

    rates.breakfast = allRates.findIndex(rate => rate.name == 'BREAKFAST')
    rates.lunch = allRates.findIndex(rate => rate.name == 'LUNCH')
    rates.dinner = allRates.findIndex(rate => rate.name == 'DINNER')

    rates.lodge = allRates.findIndex(rate => rate.name == 'LODGING')
    rates.mileage = allRates.findIndex(rate => rate.name == 'MILEAGE')

    return rates
}
