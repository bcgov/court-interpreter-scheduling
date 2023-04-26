import store from "@/store";
import { holidaysInfoType } from "@/types/Common";
import moment from 'moment-timezone'
import * as _ from 'underscore';
import { rateJsonInfoType } from '@/types/Common';
import { totalInterpretingHoursInfoType } from "@/types/Bookings/json";



export function cancellationCalculation(booking, gstRate?){
    //console.log(booking.dates)

    const dates = booking.dates.map(date => date.date)
    const sortedDates = _.sortBy(dates)
    const assignmentStart =  sortedDates[0]
    const assignmentDays = getAssignmentDays(dates);

    const cancelledDates = []
    for(const record of booking.dates){
        
        //console.log(record)
        //console.log(record.cancellationDate)
        //console.log(record.date)

        if( record.status != 'Cancelled' ||
            record.date <= record.cancellationDate ||
            record.cancellationReason.includes('Interpreter') ||
            record.cancellationReason.includes('no cancellation fee')
        ) continue
        
        
        const daysBetween = getDaysBetweenCancellationAndAssignment(assignmentStart,record.cancellationDate)
        //console.log(daysBetween)
        if((assignmentDays.length>10 && daysBetween.length<3)||(assignmentDays.length<=10 && daysBetween.length<2)){
            cancelledDates.push(record)
        }
        
    }

    //console.log(cancelledDates)
    if(cancelledDates.length>0){
        const totalHours = getTotalHours(booking, cancelledDates)
        const totalCancellationFee = getTotalCancellations(totalHours, booking, gstRate)        
        //console.log(totalCancellationFee)
        //====
        return {totalFees: totalCancellationFee}        
    }else{
        return {totalFees: 0}
    }
}

//______________________________________
//______________________________________
//______________________________________

function getTotalCancellations(totalHours: totalInterpretingHoursInfoType, booking, gstRate){
    let totalCancelledHr=0;
    const cancelledLaguagesType=[]
    const cancelledLaguagesName=[]
    for (const langItemHoursKey of Object.keys(totalHours)){
        if(totalHours[langItemHoursKey]>0){
            const langkey = langItemHoursKey.replace('Old','');
            cancelledLaguagesType.push(langkey)
            cancelledLaguagesName.push(langItemHoursKey)
            totalCancelledHr+= totalHours[langItemHoursKey]
        }
    }
    const rates: rateJsonInfoType[] = store.state.Common.rates
    const sortedRates = _.chain(rates).sortBy('name').reverse().sortBy('value').reverse().value()
    const bestRateIndex = sortedRates.findIndex(rate => cancelledLaguagesType.includes(rate.name))
    const bestRate =  cancelledLaguagesName.includes(sortedRates[bestRateIndex].name)? sortedRates[bestRateIndex].value : sortedRates[bestRateIndex].previousValue;
    //console.log(totalCancelledHr)
    //console.log(cancelledLaguagesName)
    //console.log(sortedRates)
    //console.log(bestRateIndex)
    //console.log(bestRate)

    const twodays =      2*5
    const fivedays =     5*5
    const tendays =     10*5
    const fifteendays = 15*5

    let cancellationFee = 0

    if(totalCancelledHr<=twodays) cancellationFee = bestRate*totalCancelledHr
    else if(totalCancelledHr>twodays && totalCancelledHr<=fivedays) cancellationFee = bestRate*10
    else if(totalCancelledHr>fivedays && totalCancelledHr<=tendays) cancellationFee = bestRate*15
    else if(totalCancelledHr>tendays && totalCancelledHr<=fifteendays) cancellationFee = bestRate*20
    else if(totalCancelledHr>fifteendays) cancellationFee = bestRate*25
    
    const gstNumber = booking?.interpreter?.gst
    if(!gstRate)
        gstRate = (booking?.admDetail?.calculations?.gst?.gstRate)? booking.admDetail.calculations.gst.gstRate: '0.05'


    const cancellationSubtotal = Number((cancellationFee).toFixed(2))
    if(gstNumber)
        return Number((
            (cancellationSubtotal * Number(gstRate))+cancellationSubtotal+0.0001 
        ).toFixed(2));
    else
        return cancellationSubtotal
}


function getTotalHours(booking, cancelledDates){
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
    //console.log(sortedRateNames)
    //console.log(sortedRateNames.length-1)
    //console.log(languageHistory)
    
    const sessionHours = { }
    const recordDateTemplate = {Morning:0, Afternoon:0, minLevelMorning:MAX_INX, minLevelAfternoon:MAX_INX}

    for(const record of cancelledDates){
        if(record.status != 'Cancelled') continue
        const recordDate = record.date.slice(0,10)
        const start = moment(record.startTime, "hh:mm A")
        const end = moment(record.finishTime, "hh:mm A")
        const mid = moment("01:00 PM", "hh:mm A")
        //console.error(recordDate+' '+ record.startTime)
        ////console.log(mid.format())
        ////console.log(end<=mid)
        ////console.log(start>=mid)
        ////console.log(start<mid && end>mid)
        ////console.log(end.format())

        //console.log(record)
        
        const dateLanguagesType: number[] = []
        for(const cancelCase of record.cases){
            const langItem = cancelCase.language
            let languageLevel = langItem.level
            ////console.log(langItem.languageName)
            
            const indexLanguageHistory = languageHistory.findIndex(lang => ((recordDate > lang.effective_date)&&(langItem.languageName.toLowerCase()==lang.language.toLowerCase())))
            //console.warn(indexLanguageHistory)

            const indexLanguageHistoryRev = languageHistoryRev.findIndex(lang => ((recordDate < lang.effective_date)&&(langItem.languageName.toLowerCase()==lang.language.toLowerCase())))
            //console.warn(indexLanguageHistoryRev)
            ////console.log(languageHistoryRev[indexLanguageHistoryRev])

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

        // //console.log(start.format())    
        // //console.log(end.format())
        // //console.log(sessionDuration(start, end))
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
    
    //console.log(sessionHours)
    
    for (const recordDate of Object.keys(sessionHours))
    {
        // //console.log(recordDate)
        if(sessionHours[recordDate].Morning >0 && sessionHours[recordDate].minLevelMorning<MAX_INX){
            const keyMorning = getTotalHoursKey(recordDate, rates, sortedRateNames, sessionHours[recordDate].minLevelMorning)
            const morningHours = Math.min(2.5, Math.max(2.5, sessionHours[recordDate].Morning))
            totalHours[keyMorning] = totalHours[keyMorning] + morningHours
        }
        if(sessionHours[recordDate].Afternoon >0 && sessionHours[recordDate].minLevelAfternoon<MAX_INX){
            const keyAfternoon = getTotalHoursKey(recordDate, rates, sortedRateNames, sessionHours[recordDate].minLevelAfternoon)
            const afternoonHours = Math.min(2.5,Math.max(2.5, sessionHours[recordDate].Afternoon))
            totalHours[keyAfternoon] = totalHours[keyAfternoon] + afternoonHours
        }
        
        ////console.log(dateLanguagesType)
        // //console.log(highestLanguageIndex)
        // //console.log(higherRateLanguage)
        ////console.log(record.date.slice(0,10))
        ////console.log(higherRateLanguage.valueChangedDate.slice(0,10))

    } 
    //console.log(totalHours)
    return totalHours    

}


function getAssignmentDays(dates){
    const assignmentDays=[]
    for(const day of dates){
        if(!assignmentDays.includes(day.slice(0,10)))
            assignmentDays.push(day.slice(0,10))
    }
    //console.log(assignmentDays)
    return assignmentDays
}


function getDaysBetweenCancellationAndAssignment(assignmentStart, cancelDate){

    const daysBetweenCancellationAndAssignment=[]
    const holidayList = getHolidays()

    const assignmentStartDateObj = moment(assignmentStart) //('2022-04-20T09:30:00.000-08:00') //moment(dates[0])//this.combineDataTime(this.cancellationBooking.date, this.cancellationBooking.startTime)
    const cancellationDateObj = moment(cancelDate) //('2022-04-14T10:00:00.000-08:00')
    
    const assignmentStartDate = assignmentStartDateObj.format("YYYY-MM-DD")    
    const daysDiff = assignmentStartDateObj.diff(cancellationDateObj, 'days')+1
    
    for(let day=1; day<=daysDiff; day++){
        const nextdayObj = cancellationDateObj.clone().add(day, 'day')
        const nextDay = nextdayObj.format("YYYY-MM-DD")
        const weekDayName = nextdayObj.format('dd')
        if(nextDay >= assignmentStartDate) break;            
        //console.log(weekDayName)
        //console.log(nextDay)
        if(weekDayName=='Sa' || weekDayName=='Su' || holidayList.includes(nextDay)) continue
        daysBetweenCancellationAndAssignment.push(nextDay)
    }
    // console.warn(cancellationDateObj.format())
    //console.log(assignmentStartDate)
    //console.log(daysBetweenCancellationAndAssignment)
    return daysBetweenCancellationAndAssignment
}



//______________________________________
//______________________________________
//______________________________________
function getHolidays(){
    const holidays: holidaysInfoType[] = store.state.Common.holidays
    const holidayList = []
    for(const year of holidays){
        for(const value of Object.values(year))
            holidayList.push(value)
    }
    return holidayList
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

function combineDataTime(dateIso, timeAmPm){
    const tz = moment(dateIso).format('Z')
    return moment(dateIso.slice(0,10)+' '+timeAmPm+' '+tz, 'YYYY-MM-DD HH:mm A Z')
}