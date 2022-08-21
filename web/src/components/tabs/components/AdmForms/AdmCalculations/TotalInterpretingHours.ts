import store from "@/store";
import moment from 'moment';
import * as _ from 'underscore';
import { rateJsonInfoType } from '@/types/Common';
import { totalInterpretingHoursInfoType } from "@/types/Bookings/json";

// // "[{\"language_id\": 5, \"language\": \"ASL\", \"level\": 2, \"effective_date\": \"2022-08-08\", \"disabled\": false},{\"language_id\": 5, \"language\": \"ASL\", \"level\": 1, \"effective_date\": \"2022-01-08\", \"disabled\": false}]"

export function getTotalInterpretingHours(booking){
    //console.log(booking)
    const rates: rateJsonInfoType[] = store.state.Common.rates

    const totalHours: totalInterpretingHoursInfoType = {
        SPKL1 : 0,
        OldSPKL1 : 0,
        SPKL2 : 0,
        OldSPKL2 : 0,
        SPKL3 : 0,
        OldSPKL3 : 0,
        SPKL4 : 0,
        OldSPKL4 : 0,
        ASL1 : 0,
        OldASL1 : 0,
        ASL2 : 0,
        OldASL2 : 0,
        CART : 0,
        OldCART : 0
    }

    const sortedRateNames = _.chain(rates).sortBy('name').reverse().sortBy('value').reverse().value().map(rate=>{return rate.name})

    const languageHistory = _.sortBy(booking.interpreter.languageHistory,'effective_date').reverse()
    //console.log(sortedRateNames)
    //console.log(languageHistory)
    
    for(const record of booking.dates){
        if(record.status != 'Booked') continue
        const recordDate = record.date.slice(0,10)
        const start = moment(record.actualStartTime, "hh:mm A")
        const end = moment(record.actualFinishTime, "hh:mm A")
        //console.log(start.format())
        //console.log(end.format())
        const diff = (moment.duration(end.diff(start))).asMinutes()
        const totalHour = Number((diff/60).toFixed(2))
        //console.log(totalHour)
        //console.log(record)
        
        
        const dateLanguagesType: number[] = []
        for(const langItem of record.languages){

            let languageLevel = langItem.level
            //console.log(langItem.language)
            
            const indexLanguageHistory = languageHistory.findIndex(lang => ((recordDate > lang.effective_date)&&(langItem.language.toLowerCase()==lang.language.toLowerCase())))
            //console.log(indexLanguageHistory)

            if(indexLanguageHistory>0){
                languageLevel = languageHistory[indexLanguageHistory].level
            }

            let languageType = '' 
            if(langItem.language.includes('CART')) languageType='CART';
            else if(langItem.language.includes('ASL')) languageType=('ASL'+languageLevel);
            else languageType=('SPKL'+languageLevel);                
            dateLanguagesType.push(sortedRateNames.indexOf(languageType))
        }
        const highestLanguageIndex = Math.min(...dateLanguagesType)            
        const higherRateLanguageName = sortedRateNames[highestLanguageIndex]
        const higherRateLanguage = rates.filter(rate => rate.name == higherRateLanguageName)[0]
        let key=higherRateLanguageName
        
        if( (higherRateLanguage.previousValue != higherRateLanguage.value) &&
            (recordDate < higherRateLanguage.valueChangedDate.slice(0,10))
        ){
            key='Old'+higherRateLanguageName                                   
        }
        totalHours[key] = totalHours[key] + totalHour
        
        
        //console.log(dateLanguagesType)
        //console.log(highestLanguageIndex)
        //console.log(higherRateLanguage)
        //console.log(record.date.slice(0,10))
        //console.log(higherRateLanguage.valueChangedDate.slice(0,10))

    } 
    // console.log(totalHours)
    return totalHours
}