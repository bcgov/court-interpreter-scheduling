import store from "@/store";
import moment from 'moment';
import * as _ from 'underscore';
import { rateJsonInfoType } from '@/types/Common';
import { totalInterpretingHoursInfoType } from "@/types/Bookings/json";

// // "[{\"language_id\": 5, \"language\": \"ASL\", \"level\": 2, \"effective_date\": \"2022-08-08\", \"disabled\": false},{\"language_id\": 5, \"language\": \"ASL\", \"level\": 1, \"effective_date\": \"2022-01-08\", \"disabled\": false}]"
// "[{\"language_id\": 4, \"language\": \"Arabic\", \"level\": 2, \"prvlevel\": 3, \"effective_date\": \"2022-11-03\", \"disabled\": false}]"
// "[{\"language_id\": 4, \"language\": \"Arabic\", \"level\": 2, \"effective_date\": \"2022-11-03\", \"disabled\": false}]"
// "[{\"language_id\": 4, \"language\": \"Arabic\", \"level\": 2, \"effective_date\": \"2022-11-03\", \"disabled\": false}, {\"language_id\": 4, \"language\": \"Arabic\", \"level\": 1, \"prvlevel\": 2, \"effective_date\": \"2022-11-04\", \"disabled\": false}]"

// "[{\"language_id\": 4, \"language\": \"Arabic\", \"level\": 2, \"prvlevel\": 3, \"effective_date\": \"2022-11-13\", \"disabled\": false}, {\"language_id\": 4, \"language\": \"Arabic\", \"level\": 1, \"prvlevel\": 2, \"effective_date\": \"2022-11-17\", \"disabled\": false}, {\"language_id\": 4, \"language\": \"Arabic\", \"level\": 3, \"prvlevel\": 4, \"effective_date\": \"2022-11-04\", \"disabled\": false}]"

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

    const MAX_INX= 1000

    const sortedRateNames = _.chain(rates).sortBy('name').reverse().sortBy('value').reverse().value().map(rate=>{return rate.name})

    const languageHistory = _.sortBy(booking.interpreter.languageHistory,'effective_date').reverse()
    const languageHistoryRev = _.sortBy(booking.interpreter.languageHistory,'effective_date')
    // console.log(sortedRateNames)
    //console.log(sortedRateNames.length-1)
    //console.log(languageHistory)
    
    const sessionHours = { }
    const recordDateTemplate = {Morning:0, Afternoon:0, minLevelMorning:MAX_INX, minLevelAfternoon:MAX_INX}

    for(const record of booking.dates){
        if(record.status != 'Booked') continue
        const recordDate = record.date.slice(0,10)
        const start = moment(record.actualStartTime, "hh:mm A")
        const end = moment(record.actualFinishTime, "hh:mm A")
        const mid = moment("01:00 PM", "hh:mm A")
        //console.error(recordDate+' '+ record.actualStartTime)
        //console.log(mid.format())
        //console.log(end<=mid)
        //console.log(start>=mid)
        //console.log(start<mid && end>mid)
        //console.log(end.format())

        //console.log(record)
        
        const dateLanguagesType: number[] = []
        for(const bookingCase of record.cases){
            const langItem = bookingCase.language
            let languageLevel = langItem.level
            //console.log(langItem.languageName)
            
            const indexLanguageHistory = languageHistory.findIndex(lang => ((recordDate > lang.effective_date)&&(langItem.languageName.toLowerCase()==lang.language.toLowerCase())))
            //console.warn(indexLanguageHistory)

            const indexLanguageHistoryRev = languageHistoryRev.findIndex(lang => ((recordDate < lang.effective_date)&&(langItem.languageName.toLowerCase()==lang.language.toLowerCase())))
            //console.warn(indexLanguageHistoryRev)
            //console.log(languageHistoryRev[indexLanguageHistoryRev])

            if(indexLanguageHistory>=0){
                languageLevel = languageHistory[indexLanguageHistory].level
            }else if(indexLanguageHistoryRev>=0){
                languageLevel = (languageHistoryRev[indexLanguageHistoryRev].prvlevel)? languageHistoryRev[indexLanguageHistoryRev].prvlevel : languageHistoryRev[indexLanguageHistoryRev].level;
            }

            let languageType = '' 
            if(langItem.languageName.includes('CART')) languageType='CART';
            else if(langItem.languageName.includes('ASL')) languageType=('ASL'+languageLevel);
            else languageType=('SPKL'+languageLevel);                
            dateLanguagesType.push(sortedRateNames.indexOf(languageType))
        }
        const highestLanguageIndex = Math.min(...dateLanguagesType)
        //console.log(highestLanguageIndex)
        
        if(!sessionHours[recordDate]){
            sessionHours[recordDate] = JSON.parse(JSON.stringify(recordDateTemplate))            
        }

        // console.log(start.format())    
        // console.log(end.format())
        // console.log(sessionDuration(start, end))
        if(end<=mid){ //'Morning'           
            sessionHours[recordDate].Morning += sessionDuration(start, end)
            sessionHours[recordDate].minLevelMorning = Math.min(sessionHours[recordDate].minLevelMorning, highestLanguageIndex)
        }else if(start>=mid){ //'Afternoon'
            sessionHours[recordDate].Afternoon += sessionDuration(start, end)
            sessionHours[recordDate].minLevelAfternoon = Math.min(sessionHours[recordDate].minLevelAfternoon, highestLanguageIndex)
        }else if(start<mid && end>mid){ //'FullDay'           
            sessionHours[recordDate].Morning += sessionDuration(start, mid)
            sessionHours[recordDate].Afternoon += sessionDuration(mid, end)            
            sessionHours[recordDate].minLevelMorning   = Math.min(sessionHours[recordDate].minLevelMorning,   highestLanguageIndex)
            sessionHours[recordDate].minLevelAfternoon = Math.min(sessionHours[recordDate].minLevelAfternoon, highestLanguageIndex)
        }

        
    }
    
    // console.log(sessionHours)
    
    for (const recordDate of Object.keys(sessionHours))
    {
        // console.log(recordDate)
        if(sessionHours[recordDate].Morning >0 && sessionHours[recordDate].minLevelMorning<MAX_INX){
            const keyMorning = getTotalHoursKey(recordDate, rates, sortedRateNames, sessionHours[recordDate].minLevelMorning)
            const morningHours = Math.max(2.5, sessionHours[recordDate].Morning)
            totalHours[keyMorning] = totalHours[keyMorning] + Math.ceil(morningHours*2)/2
        }
        if(sessionHours[recordDate].Afternoon >0 && sessionHours[recordDate].minLevelAfternoon<MAX_INX){
            const keyAfternoon = getTotalHoursKey(recordDate, rates, sortedRateNames, sessionHours[recordDate].minLevelAfternoon)
            const afternoonHours = Math.max(2.5, sessionHours[recordDate].Afternoon)
            totalHours[keyAfternoon] = totalHours[keyAfternoon] + Math.ceil(afternoonHours*2)/2
        }
        
        //console.log(dateLanguagesType)
        // console.log(highestLanguageIndex)
        // console.log(higherRateLanguage)
        //console.log(record.date.slice(0,10))
        //console.log(higherRateLanguage.valueChangedDate.slice(0,10))

    } 
    // console.log(totalHours)
    return totalHours
}



function sessionDuration(start, end){
    const diff = (moment.duration(end.diff(start))).asMinutes()
    const totalHour = Number((diff/60).toFixed(2))
    return totalHour
}



function getTotalHoursKey(recordDate, rates, sortedRateNames, highestLanguageIndex){

    const higherRateLanguageName = sortedRateNames[highestLanguageIndex]
    const higherRateLanguage = rates.filter(rate => rate.name == higherRateLanguageName)[0]
    
    
    let key=higherRateLanguageName
    
    if( (higherRateLanguage.previousValue != higherRateLanguage.value) &&
        (recordDate < higherRateLanguage.valueChangedDate.slice(0,10))
    ){
        key='Old'+higherRateLanguageName                                   
    }

    return key
}