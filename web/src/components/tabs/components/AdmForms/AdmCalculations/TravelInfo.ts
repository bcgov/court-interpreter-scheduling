import store from "@/store";
import moment from 'moment';
import * as _ from 'underscore';
import { locationsInfoType } from '@/types/Common/json';
import { bookingSearchResultInfoType, courtsDistanceInfoType, travelInformationInfoType } from "@/types/Bookings/json";

export function travelInformation(booking: bookingSearchResultInfoType){
    //console.log(booking)

    const travelInfo = {status:'local', totalHours: 0, totalKilometers:0, breakfast:0, lunch:0, dinner:0} as travelInformationInfoType
    
    const location:locationsInfoType[] = store.state.Common.courtLocations.filter(loc => loc.id==booking.location_id)
    if(location.length==1){

        const travel = interpreterHomeToCourtHouseDistance(location[0], booking.interpreter.courts)        

        if (travel.status){

            const bookingDates = booking.dates.filter(date => date.status=='Booked' && date.methodOfAppearance=='In-Person' )            
            
            if(bookingDates.length>0){
                const sortedBookingDates = _.sortBy(bookingDates, bookingdate => {
                    return moment(bookingdate.date.slice(0,10)+' '+bookingdate.actualStartTime,'YYYY-MM-DD HH:mm A' ).format()                
                })
                
                const meals = numberOfMeals(sortedBookingDates, travel.time)
                
                travelInfo.startDate = sortedBookingDates[0].date.slice(0,10)
                travelInfo.status = 'travel'
                travelInfo.totalHours = Math.ceil(travel.time*4)/2, 
                travelInfo.totalKilometers = travel.distance*2,
                travelInfo.breakfast = meals.breakfast,
                travelInfo.lunch = meals.lunch,
                travelInfo.dinner = meals.dinner 
            }           
        }
    }

    return travelInfo
}


function numberOfMeals(bookingDates, travelHours){
    //console.log("Days")
    // for(const bookingDate of bookingDates){
    //     console.log(bookingDate.date + bookingDate.startTime)
    // }
    //console.log("\nBreakfast")

    const lastIndex = bookingDates.length-1    
    //console.log('Travel Hours ',travelHours)

    if(!travelHours) travelHours =0
    
    const startOfTravel = moment(bookingDates[0].date.slice(0,10)+' '+bookingDates[0].actualStartTime,'YYYY-MM-DD HH:mm A' ).add(-1*travelHours,'hours')    
    const startOfTravelTime = startOfTravel.format()
    //console.log(startOfTravelTime)
    
    const firstBreakfastTime = startOfTravel.startOf('day').add(7,'hours').format()
    //console.log(firstBreakfastTime)
    const firstLunchTime = startOfTravel.startOf('day').add(12,'hours').format()
    //console.log(firstLunchTime)
    const firstDinnerTime = startOfTravel.startOf('day').add(18,'hours').format()
    //console.log(firstDinnerTime)
    
    const eligibleFirstBreakfast = (startOfTravelTime <= firstBreakfastTime)? 1:0
    const eligibleFirstLunch = (startOfTravelTime <= firstLunchTime)? 1:0
    const eligibleFirstDinner = (startOfTravelTime <= firstDinnerTime)? 1:0
    //console.log('first Breakfast ', eligibleFirstBreakfast)
    //console.log('first Lunch ', eligibleFirstLunch)
    //console.log('first Dinner ', eligibleFirstDinner)


    const endOfTravel = moment(bookingDates[lastIndex].date.slice(0,10)+' '+bookingDates[lastIndex].actualFinishTime,'YYYY-MM-DD HH:mm A' ).add(travelHours,'hours')
    const endOfTravelTime = endOfTravel.format()
    //console.log(endOfTravelTime)

    const lastBreakfastTime = endOfTravel.startOf('day').add(7,'hours').format()
    //console.log(lastBreakfastTime)
    const lastLunchTime = endOfTravel.startOf('day').add(12,'hours').format()
    //console.log(lastLunchTime)
    const lastDinnerTime = endOfTravel.startOf('day').add(18,'hours').format()
    //console.log(lastDinnerTime)
    
    const eligibleLastBreakfast = (endOfTravelTime >= lastBreakfastTime)? 1:0
    const eligibleLastLunch = (endOfTravelTime >= lastLunchTime)? 1:0
    const eligibleLastDinner = (endOfTravelTime >= lastDinnerTime)? 1:0
    //console.log('last Breakfast ', eligibleLastBreakfast)
    //console.log('last Lunch ', eligibleLastLunch)
    //console.log('last Dinner ', eligibleLastDinner)

    const startOfTravelDay = startOfTravel.startOf('day')
    const endOfTravelDay = endOfTravel.startOf('day')
    const lengthOfJourney = moment.duration(endOfTravelDay.diff(startOfTravelDay)).asDays()
    //console.log(lengthOfJourney-1)

    let numberOfBreakfast = eligibleFirstBreakfast * eligibleLastBreakfast
    let numberOfLunch = eligibleFirstLunch * eligibleLastLunch
    let numberOfDinner = eligibleFirstDinner * eligibleLastDinner
    if(lengthOfJourney > 0){    
        numberOfBreakfast = (lengthOfJourney-1) + eligibleFirstBreakfast + eligibleLastBreakfast
        numberOfLunch = (lengthOfJourney-1) + eligibleFirstLunch + eligibleLastLunch
        numberOfDinner = (lengthOfJourney-1) + eligibleFirstDinner + eligibleLastDinner
    }

    //console.log(numberOfBreakfast, numberOfLunch, numberOfDinner)

    return {breakfast:numberOfBreakfast, lunch:numberOfLunch, dinner:numberOfDinner}

}


function interpreterHomeToCourtHouseDistance(location: locationsInfoType, courts: courtsDistanceInfoType[]){
    
    const court = courts.filter(court => (court.court_code==location.locationCode && court.court_id==location.id) )

    if(!location.locationCode || !location.id || courts.length<1 || court.length!=1)
        return {status:false, distance:0, time:0}

    const status = court[0].distance > 32000
    const distance = (court[0].distance/1000)
    const time = (court[0].duration/3600)

    return {status, distance, time}
}