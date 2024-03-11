<template>
    <b-card class="bg-white border-white" header="Audit Bookings" header-class="h1 mt-2 bg-white">                
            
        <loading-spinner color="#000" v-if="!dataReady" waitingText="Loading Results ..." /> 
        
        <div v-else>

            <b-tabs v-model="tabIndex" >

                <b-tab title="Different Locations" :title-link-class="tabClass(0)">
                    <b-card no-body border-variant="white" bg-variant="white" v-if="!bookingsDiffLocations.length">
                        <span class="text-muted ml-4 my-5">No records found for different locations.</span>
                    </b-card>
                    <b-card v-else class="home-content border-white mt-4 p-0" body-class="pt-0 px-0" >
                        <audit-booking-table :bookings="bookingsDiffLocations" name="diff-location" />
                    </b-card>
                </b-tab>

                <b-tab title="Same Location" :title-link-class="tabClass(1)">
                    <b-card no-body border-variant="white" bg-variant="white" v-if="!bookingsSameLocation.length">
                        <span class="text-muted ml-4 my-5">No records found for same location.</span>
                    </b-card>
                    <b-card v-else class="home-content border-white mt-4 p-0" body-class="pt-0 px-0" >
                        <audit-booking-table :bookings="bookingsSameLocation" name="same-location" />
                    </b-card>
                </b-tab>
                
            </b-tabs>
        </div>
    </b-card>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import moment from 'moment-timezone';
import AuditBookingTable from './components/AuditBookingTable.vue'


@Component({
    components:{        
        AuditBookingTable
    }
})
export default class AuditBooking extends Vue {

    

    bookingsSameLocation = []
    bookingsDiffLocations = []
    multipleSessionBookingsOverpaid = []
    dataReady = false;
    tabIndex = 0

    mounted(){
        this.dataReady = false;
        this.loadMultipleSessionBookingOverpaid()
    }

    public loadMultipleSessionBookingOverpaid(){
        this.$http.get('/audit/multiple-session-booking-overpaid')
        .then((response) => {            
            if(response?.data){                 
                console.log(response?.data)
                this.multipleSessionBookingsOverpaid = this.extractMultipleSessionOverpaid(response?.data)                
            }
            this.loadSameBookingsSameLocation()
        },(err) => {
            console.log(err)            
        });
    }

    public loadSameBookingsSameLocation(){
        this.$http.get('/audit/same-date-booking')
        .then((response) => {            
            if(response?.data){                 
                this.bookingsSameLocation =this.extractBookings(response?.data, true)                
            }
            this.loadSameBookingsDiffLocations()
        },(err) => {
            console.log(err)            
        });
    }

    public loadSameBookingsDiffLocations(){
        this.$http.get('/audit/same-date-booking-diff-locations')
        .then((response) => {            
            if(response?.data){                 
                this.bookingsDiffLocations = this.extractBookings(response?.data, false)                
            } 
            this.dataReady = true;          
        },(err) => {
            console.log(err)            
        });
    }
    
    extractBookings(bookingDates, sameLocation) {
        const allBookings = []
        const bookings = {} as any
        for(const bookingDate of bookingDates){
            const timezone = bookingDate.booking.location?.timezone?  bookingDate.booking.location.timezone : 'America/Vancouver'
            const date = moment(bookingDate.date).tz(timezone).format('YYYY-MM-DD')
            const key = date+'-'+bookingDate.interpreterId+(sameLocation? ('-'+bookingDate.booking.location_id) :'')
            const bookingInfo = {
                dateSort: date + bookingDate.startTime.slice(6,8)+ bookingDate.startTime.slice(0,5),
                date:date,
                time: bookingDate.startTime+' - '+bookingDate.finishTime,
                actualTime: bookingDate.actualStartTime? (bookingDate.actualStartTime+' - '+bookingDate.actualFinishTime) :'-',
                courtLocation: bookingDate.booking.location.name,
                interpreterName: bookingDate.booking.interpreter.lastName +', '+ bookingDate.booking.interpreter.firstName, 
                invoiceTotal: bookingDate.booking.invoiceTotal? bookingDate.booking.invoiceTotal : '0.00',
                invoiceDate: bookingDate.booking.invoiceDate? bookingDate.booking.invoiceDate : '-',
                invoiceNumber: bookingDate.booking.invoiceNumber? bookingDate.booking.invoiceNumber: '-' ,
                clerk: bookingDate.booking.approverName? bookingDate.booking.approverName : '-'
            }
            if(bookings[key])
                bookings[key].push(bookingInfo);
            else
                bookings[key] = [bookingInfo];            
        }
        
        for (const key of Object.keys(bookings))
            allBookings.push(bookings[key])
        return allBookings
    }

    extractMultipleSessionOverpaid(bookings){
        return []
    }

    tabClass(idx) {
        if (this.tabIndex === idx)
          return ['bg-primary', 'text-light', 'border']
        else
          return ['bg-light', 'text-dark', 'border']        
    }
    
}
</script>