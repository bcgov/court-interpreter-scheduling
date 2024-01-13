<template>
    <div v-if="dataReady">
        <b-row class="py-0 vuetify" style="margin-top:-3rem;">

                <v-app style="height:24rem; padding:0; margin:0 0 -2.5rem 0; overflow:hidden;">                    
                    <v-date-picker
                        class="calendar-left"
                        v-model="dates"
                        multiple
                        :events="currentBookingDates"
                        color="success"
                        :allowed-dates="allowedDates"                         
                        :picker-date.sync="pickerDateL"                        
                    ></v-date-picker>                            
                </v-app>

                <v-app style="height:24rem; padding:0; margin:0 0 -2.5rem 0; overflow:hidden;">                        
                    <v-date-picker
                        class="calendar-middle"
                        v-model="dates"
                        multiple
                        :events="currentBookingDates"
                        color="success"
                        :allowed-dates="allowedDates"                         
                        :picker-date.sync="pickerDateM"                                
                    ></v-date-picker>                            
                </v-app>

                <v-app style="height:24rem; padding:0; margin:0 0 -2.5rem 0; overflow:hidden;">                        
                    <v-date-picker
                        class="calendar-right"
                        v-model="dates"
                        multiple
                        :events="currentBookingDates"
                        color="success"
                        :allowed-dates="allowedDates"                             
                        :picker-date.sync="pickerDateR"                                
                    ></v-date-picker>                            
                </v-app>

        </b-row>

        <b-modal body-class="py-0" size="xl" footer-class="d-none"  v-model="showBookingConflicts" header-class="bg-warning" no-close-on-backdrop>
            <template v-slot:modal-title>                
                <h1 class="my-2 ml-2">
                    <b class="">{{interpreter.lastName | capitalizefirst}}, {{interpreter.firstName | capitalizefirst}}</b> 
                    <i class="ml-4 text-secondary" style="font-size:14pt;">{{clickedDate|beautify-date-weekday}}</i>
                </h1>                
            </template>

            <scheduling-conflict-popup class="mt-2" :bookings="interpreter.booking" :bookingDates="[]" :exactBookingDate="clickedDate" :showTitle="false" :searchLocation="searchLocation"/>        

            <template v-slot:modal-header-close>
                <b-button
                    variant="outline-dark"
                    class="closeButton"
                    @click="showBookingConflicts=false"
                    ><b-icon-x />
                </b-button
                >
            </template>
        </b-modal>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment-timezone'
import {bookingDateTimesInfoType} from '@/types/Bookings/json';
import { interpreterInfoType } from '@/types/Interpreters/json';
import SchedulingConflictPopup from "../SchedulingConflictPopup.vue"
import { statusOptions } from '../BookingEnums';
import { locationsInfoType } from '@/types/Common/json';

@Component({
    components:{ 
        SchedulingConflictPopup,  
    }
})
export default class BookingCalendarView extends Vue {
    
    @Prop({required: true})
    bookings!: any;

    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[]

    @Prop({required: true})
    interpreter!: interpreterInfoType;
    
    @Prop({required: true})
    public searchLocation!: locationsInfoType;


    dates = []
    currentBookingDates = []
    showBookingConflicts = false
    clickedDate=""

    pickedDates=""
    pickerDateL=""
    pickerDateM=""
    pickerDateR=""

    dataReady=false
    conflictDates=[]

    @Watch('pickerDateL')
    monthChange(newValue){
        this.pickerDateM = moment(newValue).add(1,'months').format("YYYY-MM")
        this.pickerDateR = moment(newValue).add(2,'months').format("YYYY-MM")
    }


    @Watch('pickerDateR')
    monthChangeR(newValue){
        this.pickerDateM = moment(newValue).add(-1,'months').format("YYYY-MM")
        this.pickerDateL = moment(newValue).add(-2,'months').format("YYYY-MM")
    }

    @Watch('dates')   
    dateClick(){       
        if(this.dates.length != this.conflictDates.length){        
            for(const date of this.conflictDates){
                if(!this.dates.includes(date)){
                    this.clickedDate=date
                    this.showBookingConflicts = true
                }
            }
            this.dates = this.conflictDates        
        }
   }

    mounted(){
        this.dataReady=false
        this.extractInfo()
        this.dataReady=true
    }

    public extractInfo(){
        this.conflictDates=[]       
        
        for(const booking of this.bookings){
            const timezone = booking.location?.timezone? booking.location.timezone: 'America/Vancouver';
            for(const bookingdate of booking.dates){
                const conflictDate = moment(bookingdate.date).tz(timezone).format('YYYY-MM-DD');
                if(!this.conflictDates.includes(conflictDate) && bookingdate.status != statusOptions[2].value)               
                    this.conflictDates.push(conflictDate)
            }
        } 
        
        this.dates = this.conflictDates 
        this.currentBookingDates = this.bookingDates.map(date=>date.date.slice(0,10))
        if(this.currentBookingDates.length>0){
            const sortedDates = this.currentBookingDates.sort()
            this.pickerDateL = sortedDates[0]
        }
    }

    public allowedDates(date){        
        if(!this.currentBookingDates.includes(date) && !this.conflictDates.includes(date)) 
            return false        
        else 
            return true
    }
}
</script>

<style scoped lang="scss">
    ::v-deep .vuetify{
        @import "@/styles/vuetify.scss";
        @import "@/styles/_custom_vuetify.scss";    

        .v-date-picker-header .success--text button[type="button"]{
            pointer-events: none;
        }

        .calendar-left .v-date-picker-header button[aria-label="Next month"]{
            display: none;
        }

        .calendar-middle .v-date-picker-header .v-btn{
            display: none;
        }

        .calendar-right .v-date-picker-header button[aria-label="Previous month"]{
            display: none;
        }

        td>button.v-btn.v-btn--text.v-btn--rounded.theme--light:not(.v-btn--disabled){
        
            background: rgb(56, 90, 171) !important; 
            color:white !important;
            pointer-events: auto !important; 

            :hover::before{
                content:"Selected"; 
                position:absolute;
                transform:translate(-10%,-120%);
                margin-left:10px;
                font-size: 10pt;                
                width:5.5rem;
                padding:5px;
                border-radius:10px;
                background:#000;
                color: #fff;
                text-align:center;
            }
            div.warning{
                background-color:  rgb(56, 90, 171) !important;
            }
        }

        td>button.v-btn.v-btn--rounded.v-btn--active.theme--light.success{
        
            background: rgb(233, 108, 108) !important; 
            color:white !important;
            pointer-events: auto !important; 

            :hover::before{
                content:"Busy"; 
                position:absolute;
                transform:translate(-10%,-120%);
                margin-left:10px;
                font-size: 10pt;                
                width:3.5rem;
                padding:5px;
                border-radius:10px;
                background:#000;
                color: #fff;
                text-align:center;
                z-index: 1;
            }
            div.warning{
                background-color:  rgb(56, 90, 171) !important;
            }
        }
       
    }

    .closeButton {
        background-color: transparent !important;
        color: #000;
        border: white;
        font-weight: 700;
        font-size: 2rem;
        padding-top: 0;
        margin-top: 0;
    }
</style>