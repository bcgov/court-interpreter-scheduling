import moment from 'moment-timezone';
import {statusOptions} from '../../tabs/components/BookingEnums'
import { bookingDateTimesInfoType } from '@/types/Bookings/json';

export function datesOverlap(bookingStart, bookingEnd, busyDateStart, busyDateEnd ){
    return ( 
        (bookingStart >= busyDateStart && bookingStart < busyDateEnd) ||
        (bookingEnd > busyDateStart && bookingEnd <= busyDateEnd) ||
        (bookingStart <= busyDateStart && bookingEnd >= busyDateEnd)
    )
}

export function bookedDateTimesTZ(dates, timezone){
    return dates?.map(bookedDate =>
        {   
            if (!timezone) timezone = bookedDate.booking?.location?.timezone?  bookedDate.booking.location.timezone : 'America/Vancouver';
            if(bookedDate.status == statusOptions[2].value) return
            const date = moment(bookedDate.date).tz(timezone).format('YYYY-MM-DD')
            const startDate = date+' '+bookedDate.startTime
            const endDate = date+' '+bookedDate.finishTime
            const start = moment.tz(startDate, 'YYYY-MM-DD HH:mm A', timezone).format('X');
            const end = moment.tz(endDate, 'YYYY-MM-DD HH:mm A', timezone).format('X');
            return { start, end , startDate, endDate, timezone }
        }
    )
}


export function courtBookingDateTimesConflict(bookingDates: bookingDateTimesInfoType[], interpreterBusyDates, courtTimezone){
    for(const bookingDate of bookingDates){
        for(const bookingTime of bookingDate.bookingTimes){
            if(!bookingTime.start || !bookingTime.end) continue
            const bookingstart = moment.tz(bookingDate.date?.slice(0,10)+' '+bookingTime.start,'YYYY-MM-DD HH:mm A', courtTimezone).format('X');
            const bookingend = moment.tz(bookingDate.date?.slice(0,10)+' '+bookingTime.end,'YYYY-MM-DD HH:mm A', courtTimezone).format('X');
            
            for(const busyDate of interpreterBusyDates){  
                if( datesOverlap(bookingstart, bookingend, busyDate?.start, busyDate?.end ))
                    return true
            }
        }                
    }
    return false
}
