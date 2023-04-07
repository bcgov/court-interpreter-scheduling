import store from "@/store";
import moment from 'moment';
import * as _ from 'underscore';
import { rateJsonInfoType } from '@/types/Common';
import { totalInterpretingHoursInfoType, travelInformationInfoType } from "@/types/Bookings/json";
import { paymentDetailsInfoType } from "@/types/Bookings";

export const languageItems = ['CART','OldCART','ASL1','OldASL1','ASL2','OldASL2','SPKL1','OldSPKL1','SPKL2','OldSPKL2','SPKL3','OldSPKL3','SPKL4','OldSPKL4']
export const courtFeeItems = ['courtHrRate','courtTotalHrs','courtTotal','courtPayableFee']

export function paymentDetails(booking){
    
    //console.log(booking)
    const form = {} as paymentDetailsInfoType
    
    const ratesArray: rateJsonInfoType[] = store.state.Common.rates
    // console.log(ratesArray)
    const rates = getRates(ratesArray)
    
    form.includeCourtHrs = false;

    form.gstNumber = booking.interpreter.gst
    form.gstRate = booking?.admDetail?.calculations?.gst?.gstRate? booking.admDetail.calculations.gst.gstRate: '0.05'

    form.feesGST = '0.00'
    form.feesTotal = '0.00'
        
    form.totalPaidByCourt = booking?.admDetail?.paymentDetail?.totalPaidByCourt?.toFixed(2)
    form.totalPaidByCrown = booking?.admDetail?.paymentDetail?.totalPaidByCrown?.toFixed(2)

    if(booking?.admDetail?.calculations?.travelInformation && booking?.admDetail?.calculations?.totalInterpretingHours){
        //console.log(booking.admDetail.calculations)
        const travel: travelInformationInfoType = booking.admDetail.calculations.travelInformation
        const interpret: totalInterpretingHoursInfoType = booking.admDetail.calculations.totalInterpretingHours
        
        let totalCourtHourFees = 0;
        let maxLanguageRate = 0;

        //______Calculated__Fees
        for(const key of Object.keys(interpret)){                
            if(interpret[key]!=0){
                //console.log(rates[key])
                if(rates[key]>maxLanguageRate) maxLanguageRate = rates[key]
                form[courtFeeItems[0]+key]= rates[key]
                form[courtFeeItems[1]+key]= interpret[key].toFixed(1)
                form[courtFeeItems[2]+key]= (interpret[key]*Number(form[courtFeeItems[0]+key])).toFixed(2)
                form[courtFeeItems[3]+key]= form[courtFeeItems[2]+key]
                totalCourtHourFees += Number(form[courtFeeItems[3]+key])
                form.includeCourtHrs = true;
            }
        }  
           
        if(travel.status =='travel'){
            form.travelHrRate = maxLanguageRate.toFixed(2)
            form.travelTotalHrs = travel.totalHours? travel.totalHours.toFixed(1): '0.0'
            form.travelTotal = (Number(form.travelHrRate) * Number(form.travelTotalHrs)).toFixed(2)
        }
        form.travelPayableFee = form.travelTotal? form.travelTotal : '0.00'

        form.feesSubtotal = (
            totalCourtHourFees +
            Number(form.travelPayableFee)
        ).toFixed(2);

        if(form.gstNumber){
            form.feesGST = (
                Number(form.feesSubtotal) * Number(form.gstRate)
            ).toFixed(2);
        }

        form.feesTotal = (
            Number(form.feesSubtotal)+
            Number(form.feesGST)
        ).toFixed(2);

        //______Calculated__Expenses
        if(travel.status =='travel'){       
            
            form.travelKMsRate = travel.startDate >= rates['DateMILEAGE']? rates['MILEAGE'] : rates['OldMILEAGE']
            form.travelTotalKMs =  travel.totalKilometers? travel.totalKilometers.toFixed(2): '0.00'
            form.travelSubExp = (Number(form.travelTotalKMs) * Number(form.travelKMsRate)).toFixed(2)
            form.travelTotalExp = form.travelSubExp 

            form.breakfastRate = travel.startDate >= rates['DateBREAKFAST']? rates['BREAKFAST'] : rates['OldBREAKFAST']
            form.breakfastTotalDays = travel.breakfast? travel.breakfast.toFixed(1) :'0.0'
            form.breakfastSubExp = (Number(form.breakfastTotalDays) * Number(form.breakfastRate)).toFixed(2)
            form.breakfastTotalExp = form.breakfastSubExp

            form.lunchRate = travel.startDate >= rates['DateLUNCH']? rates['LUNCH'] : rates['OldLUNCH']
            form.lunchTotalDays = travel.lunch? travel.lunch.toFixed(1) :'0.0'
            form.lunchSubExp = (Number(form.lunchTotalDays) * Number(form.lunchRate)).toFixed(2)
            form.lunchTotalExp = form.lunchSubExp

            form.dinnerRate = travel.startDate >= rates['DateDINNER']? rates['DINNER'] : rates['OldDINNER']
            form.dinnerTotalDays = travel.dinner? travel.dinner.toFixed(1) :'0.0'
            form.dinnerSubExp = (Number(form.dinnerTotalDays) * Number(form.dinnerRate)).toFixed(2)
            form.dinnerTotalExp = form.dinnerSubExp

               
            //_______Inputs__
            form.lodgingRate = booking?.admDetail?.paymentDetail?.lodgingRate?.toFixed(2)
            form.lodgingSubExp = form.lodgingRate?  form.lodgingRate: '0.00'
            form.lodgingGST = booking?.admDetail?.paymentDetail?.lodgingGST?.toFixed(2)? booking.admDetail.paymentDetail.lodgingGST.toFixed(2):'0.00'
            form.lodgingTotalExp = Number(form.lodgingSubExp)? (Number(form.lodgingSubExp)+ Number(form.lodgingGST)).toFixed(2):'0.00'

            form.ferryExp = booking?.admDetail?.paymentDetail?.ferryExp?.toFixed(2)
            form.ferrySubExp = form.ferryExp? form.ferryExp : '0.00'
            form.ferryGST = booking?.admDetail?.paymentDetail?.ferryGST?.toFixed(2)? booking.admDetail.paymentDetail.ferryGST.toFixed(2):'0.00'
            form.ferryTotalExp = Number(form.ferrySubExp)? (Number(form.ferrySubExp)+ Number(form.ferryGST)).toFixed(2):'0.00'

            form.miscExp = booking?.admDetail?.paymentDetail?.miscExp?.toFixed(2)
            form.miscSubExp = form.miscExp? form.miscExp : '0.00'
            form.miscGST = booking?.admDetail?.paymentDetail?.miscGST?.toFixed(2)? booking.admDetail.paymentDetail.miscGST.toFixed(2) : '0.00'
            form.miscTotalExp = Number(form.miscSubExp)? (Number(form.miscSubExp)+Number(form.miscGST)).toFixed(2): '0.00'

            //___________TOTAL____
            form.expPreGST = ( 
                Number(form.travelSubExp) +
                Number(form.breakfastSubExp) +
                Number(form.lunchSubExp) +
                Number(form.dinnerSubExp) +
                Number(form.lodgingSubExp) +
                Number(form.ferrySubExp) +
                Number(form.miscSubExp)
            ).toFixed(2);
                
            form.expTotalGST = (
                (form.lodgingRate? Number(form.lodgingGST): 0) +
                (form.ferryExp? Number(form.ferryGST): 0)+
                (form.miscExp? Number(form.miscGST): 0)   
            ).toFixed(2);

            form.expTotal = (
                Number(form.expPreGST) +
                Number(form.expTotalGST)
            ).toFixed(2); 
        }
    }

    form.expPayable = form.expPreGST? form.expPreGST : '0.00'
    form.GSTifApplic = form.expTotalGST? form.expTotalGST : '0.00'
    form.totalExpenses = form.expTotal? form.expTotal : '0.00'
    form.totalCancellationFees = getCancellationFees(booking)
        
    form.totalPayable = (                
        Number(form.feesTotal) +
        Number(form.totalExpenses) +
        Number(form.totalCancellationFees)   
    ).toFixed(2);                
    
    //console.log(form)
    return form
}

function getRates(ratesArray){
    const rates = {}
    for(const rate of ratesArray){
        rates[rate.name]= rate.value
        rates['Old'+rate.name] = rate.previousValue
        rates['Date'+rate.name] = rate.valueChangedDate.slice(0,10) 
    }
    //console.log(rates)
    return(rates)
}

function getCancellationFees(booking){
    return booking.admDetail?.calculations?.cancellation?.totalFees? booking.admDetail?.calculations?.cancellation?.totalFees?.toFixed(2) : '0.00'
//     let cancellationFee = 0.0
//     for(const date of booking.dates){
//         if(date.status=='Cancelled' && date.cancellationFee)
//             cancellationFee += Number(date.cancellationFee)
//     }
//     return cancellationFee.toFixed(2)
}