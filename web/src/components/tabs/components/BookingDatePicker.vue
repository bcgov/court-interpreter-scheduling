<template>
    <b-card body-class="p-0" id="booking-date-container"> 
        <b-button 
            @click="clearDates();onShow=true;"
            id="popover-button-variant" 
            variant="transparent" 
            class="border-0" 
            style="width:100%; margin:0; padding:0.5rem 1rem;">
            {{pickedDates}} <b-icon-calendar style="float:right"/>
        </b-button>
        <b-popover 
            customClass="pop"
            target="popover-button-variant"  
            triggers="manual"
            placement="bottomleft"
            container="booking-date-container"
            ref="popover"
            :show.sync="onShow"           
            >
            <div>
                <b-row class="py-0" >
                    <b-col cols="7">
                        <v-app style="height:24rem; padding:0; margin:1rem 0 -2rem 0;">                        
                            <v-date-picker
                                v-model="dates"
                                :events="arrayEvents"
                                color="warning"
                                show-adjacent-months
                                :allowed-dates="allowedDates"
                                multiple
                                header-color="red"
                            ></v-date-picker>                            
                        </v-app>
                    </b-col>
                    <b-col cols="4">
                        <b-row class="mt-3" style="line-height:2rem; font-size:14pt; color:#AAA">
                            <b-col cols="12" class="my-1">
                                <b>Arrival Time</b>
                            </b-col>
                        </b-row>

                        <b-row class="mt-0">
                            <b-col cols="12 ml-1 pl-2 pr-2">
                            <b-form-timepicker v-model="arrivalTime" placeholder="time" locale="en"></b-form-timepicker>
                            </b-col>
                        </b-row>

                        <b-row class="mt-3 pb-0" style="line-height:2rem; font-size:14pt; color:#AAA">
                            <b-col cols="12" class="my-1">
                                <b>Time Options</b>
                            </b-col>
                        </b-row>

                        <b-row class="py-0">
                            <b-col cols="12" class="py-0">
                                <b-form-radio-group
                                    v-model="period"                        
                                    size="lg"
                                >
                                <b-form-radio v-for="option,inx in bookingPeriodOptions" :key="inx" :value="option['value']" class="mt-3">
                                    {{option['text']}}
                                </b-form-radio>
                                </b-form-radio-group>
                            
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </div>
            <b-row class="mt-0">
                <b-col>
                    <b-button @click="focusSearchButton();onShow=false" class="border" variant="white">Cancel</b-button>
                </b-col>
                <b-col>
                    <b-button @click="AddDates" class="px-4" variant="success" style="float:right">Add</b-button>
                </b-col>
            </b-row>
        </b-popover>

    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {bookingPeriodOptions, bookingPeriod} from './BookingEnums'
import moment from 'moment-timezone'
import { bookingDateInfoType } from '@/types/Bookings/json';
import * as _ from 'underscore';

@Component
export default class BookingDatePicker extends Vue {
    @Prop({required: true})
    bookingDates!: bookingDateInfoType[];

    @Prop({required: false})
    blockedDates!: string[];

    onShow= false
    dates = []
    arrayEvents = []
    period=bookingPeriod.Morning
    arrivalTime="09:00"
    pickedDates=""

    
    bookingPeriodOptions 
    created(){
        this.bookingPeriodOptions=bookingPeriodOptions
    }


    mounted(){
        this.clearDates()
    }

    public allowedDates(date){
        if(this.blockedDates?.length>0)
            return !this.blockedDates.includes(date)
        else
            return true
    }


    public clearDates(){ 
            
        this.dates = []
        this.arrayEvents = []

        for(const bookingDate of this.bookingDates){
            const date = bookingDate.date.slice(0,10)
            this.arrayEvents.push(date)           
        }

        this.getDatesText(this.bookingDates)
    }


    public getDatesText(bookingDates){
        let datesText="  "
        for(const bookingDate of bookingDates){           
            datesText+= moment(bookingDate.date).format("MMM DD, ")
        }
        this.pickedDates = datesText.slice(0,-2)
        if(this.pickedDates.length>50){
            this.pickedDates =this.pickedDates.slice(0,50)+'...'
        }
        if(this.pickedDates.length<1){
            this.pickedDates ='Add dates'
        }
    }


    public AddDates(){
        let newBookingDates: bookingDateInfoType[] = []
        
        for(const bookingDate of this.bookingDates){
            const date = bookingDate.date.slice(0,10)
            if(!this.dates.includes(date))
                newBookingDates.push(bookingDate)
        }

        for(const selectedDate of this.dates){
            newBookingDates.push({
                period:this.period,
                arrivalTime:this.arrivalTime.substring(0,5),
                date:moment(selectedDate).toISOString(),
                id:null
            })
        }

        newBookingDates = _.sortBy(newBookingDates, 'date')
        this.getDatesText(newBookingDates)
        
        this.$emit('datesAdded',newBookingDates)
        this.onShow= false
    }

    public focusSearchButton(){
        Vue.nextTick(()=>{
            const el = document.getElementsByName("search")[0];
            if(el) el.focus();
        })        
    }
}
</script>

<style scoped lang="scss" >    
    .popover{
        border-radius: 10px;
        border:1px solid #EEE;
        height: 28rem;
        width: 36.5rem;
        max-width: 37rem;
        margin:0 -.5rem;
        padding: 0;
        box-shadow: 3px 5px 6px #DDD;
    }
</style>