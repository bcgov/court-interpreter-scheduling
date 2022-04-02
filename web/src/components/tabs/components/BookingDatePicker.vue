<template>
    <b-card body-class="p-0" id="booking-date-container"> 
        <b-button 
            @click="openDatePickerWindow();"
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
                    <b-col cols="5">
                        <b-row class="mt-3" style="line-height:2rem; font-size:14pt; color:#AAA">
                            <b-col cols="12" class="my-0 ml-n2">
                                <b>Booking Times</b>                                
                            </b-col>
                            <time-picker style="width:12rem;" v-if="showTimePicker"  :pickedTimes="pickedTimes" @addTime="addTime"/>
                            <div style="display:inline-block" v-else v-for="pickedtime in pickedTimes" :key="pickedtime">
                                <b-button style="margin:0.2rem; padding:0.2rem;" :variant="pickedtime=='Add Time'?'primary':'time'" size="sm" @click="removeTime(pickedtime)">
                                    <span class="text-white"> {{pickedtime}} </span>
                                    <b-icon-plus-square-fill scale="0.75" variant="white" v-if="pickedtime=='Add Time'" />
                                    <b-icon-x-square-fill scale="0.75" variant="white" v-else />
                                </b-button>
                            </div>
                        </b-row>
                        
                        
                        
                    </b-col>
                </b-row>
            </div>
            <b-row v-if="!showTimePicker" class="mt-0">
                <b-col>
                    <b-button @click="focusSearchButton();onShow=false" class="border" variant="white">Cancel</b-button>
                </b-col>
                <b-col>
                    <b-button @click="AddDates" :disabled="(dates.length<1)||(pickedTimes.length<2)" class="px-4" variant="success" style="float:right">Add</b-button>                    
                </b-col>
            </b-row>
        </b-popover>

    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment-timezone'
import { bookingDateInfoType, bookingDateTimesInfoType } from '@/types/Bookings/json';
import * as _ from 'underscore';

import TimePicker from "./TimePicker.vue"

@Component({
    components:{
        TimePicker
    }
})
export default class BookingDatePicker extends Vue {
    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[];

    @Prop({required: false})
    blockedDates!: string[];

    onShow= false
    dates = []
    arrayEvents = []

    pickedDates=""
    pickedTimes=['Add Time']
    showTimePicker = false


    mounted(){
        this.clearDates()
    }

    public allowedDates(date){
        const day = moment(date).weekday()
        
        if(this.blockedDates?.length>0)
            return !this.blockedDates.includes(date)
        else if(day==0 || day==6) return false
        else return true
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
        let datesText=""
        if(bookingDates.length==1){  
            datesText =  moment(bookingDates[0].date).format("MMM DD YYYY")
        }else if(bookingDates.length>0){  
            datesText = 
                moment(bookingDates[0].date).format("MMM DD, YYYY . . . ") +
                moment(bookingDates[bookingDates.length-1].date).format("MMM DD, YYYY")
        }
        this.pickedDates = datesText
       
        if(this.pickedDates.length<1){
            this.pickedDates ='Add dates'
        }
    }


    public AddDates(){
        let newBookingDates: bookingDateTimesInfoType[] = []
        
        for(const bookingDate of this.bookingDates){
            const date = bookingDate.date.slice(0,10)
            if(!this.dates.includes(date))
                newBookingDates.push(bookingDate)
        }

        for(const selectedDate of this.dates){
            newBookingDates.push({                
                date: moment(selectedDate).toISOString(),
                bookingTimes: this.pickedTimes
            })
        }

        newBookingDates = _.sortBy(newBookingDates, 'date')
        this.getDatesText(newBookingDates)
        
        this.$emit('datesAdded',newBookingDates)
        this.onShow= false
    }

    public focusSearchButton(){
        this.$emit('change', false)
        Vue.nextTick(()=>{
            const el = document.getElementsByName("search")[0];
            if(el) el.focus();
        })        
    }

    public addTime(time){ 
        if(time){       
            this.pickedTimes.push(time)           
        }
        this.pickedTimes = _.sortBy(this.pickedTimes,function(tim){
            if(tim.slice(0,2)=='12') tim ='00'+ tim.slice(2);
            return tim.slice(6,8)+tim.slice(0,5)
        })
        this.showTimePicker = false;
        this.$emit('change', false);
    }

    public removeTime(pickedtime){
        if(pickedtime == 'Add Time')
            this.showTimePicker = true;
        else{
            this.pickedTimes = this.pickedTimes.filter(tim => tim!=pickedtime);
            this.pickedTimes = _.sortBy(this.pickedTimes,function(tim){
                if(tim.slice(0,2)=='12') tim ='00'+ tim.slice(2);
                return tim.slice(6,8)+tim.slice(0,5)
            })
        }
    }

    public openDatePickerWindow(){
        this.$emit('change', true);
        this.clearDates();
        this.onShow=true;
    }

}
</script>

<style scoped lang="scss" >    
    .popover{
        border-radius: 10px;
        border:1px solid #EEE;
        height: 28rem;
        width: 40rem;
        max-width: 40rem;
        margin:0 -.5rem;
        padding: 0;
        box-shadow: 3px 5px 6px #DDD;
    }
</style>