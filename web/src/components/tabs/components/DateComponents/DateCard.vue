<template>
    <b-card class="date-card mb-2 mx-2" :body-class="!showTimePicker? 'py-2' :'p-0'">
        <div v-if="!showTimePicker">               
            <b-row style="line-height:1rem; font-size:14pt; ">
                <b-col cols="9">
                    <div class="mt-1"> 
                        {{dayOfWeek}}
                    </div>
                </b-col>
                <b-col cols="3">
                    <b-button :disabled="!allowDelete" @click="RemoveDate" class="py-0 " variant="transparant"> X </b-button>
                </b-col>
            </b-row>

            <b-row class="py-1" style="line-height:1rem; font-weight:600; font-size:22pt; margin:0rem -1rem; 0rem 0">
                <b-col cols="12" class="text-primary">
                    {{month}} {{day}}
                </b-col>               
            </b-row>

            <b-row class="py-1 mt-2" style="line-height:1rem; font-weight:600; font-size:16pt; margin:0rem -1rem; 0rem 0">
                <b-col cols="12" class="py-0 mb-2 text-info text-left">
                    {{year}}
                </b-col>
            </b-row>

            <b-row style="line-height:1rem; font-size:14pt; color:#AAA; margin:0rem -1rem; 0rem 0;">
                <b-col cols="12" class="mx-1 my-0 p-0">
                    <div class="mb-2 ml-2"><b>Booking Times</b></div>                        
                    
                    <div 
                        style="display:inline-block"
                        v-for="pickedtime,inx in pickedTimes" :key="inx">
                        <div v-b-tooltip.hover.noninteractive.v-warning
                                :title="tooltipTitle(pickedtime)">
                            <b-button 
                                style="margin:0.2rem; padding:0.2rem;" 
                                :variant="pickedtime.start==''?'primary':'time'"                                 
                                :disabled="!allowDelete && pickedtime.original && pickedtime.start!=''"
                                size="sm" 
                                @click="removeTime(pickedtime)">
                                    <span v-if="pickedtime.start==''" class="text-white"> Add Time </span>
                                    <span v-else class="text-white"> {{pickedtime.start}} </span>                                            
                                    <b-icon-plus-square-fill scale="0.75" variant="white" v-if="pickedtime.start==''" />
                                    <b-icon-x-square-fill scale="0.75" variant="white" v-else />
                                    <div style="margin-left:-1.3rem;color:yellow;"> {{pickedtime.end}} </div>
                            </b-button>
                        </div>
                    </div>
                        
                        
                </b-col>
            </b-row>
        </div>
        <time-picker v-else  style="width:13rem; height:22.5rem;" :pickedTimes="pickedTimes" @addTime="addTime"/>
       

    </b-card>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import {bookingPeriodOptions} from '../BookingEnums'
import moment from 'moment-timezone'
import { bookingDateTimesInfoType } from '@/types/Bookings/json';
import TimePicker from "./TimePicker/TimePicker.vue"
import * as _ from 'underscore';

@Component({
    components:{
        TimePicker
    }
})
export default class DateCard extends Vue {
    
    @Prop({required: true})
    bookingDate!: bookingDateTimesInfoType;

    @Prop({required: false, default:true})
    allowDelete!: boolean;

    @Prop({required: true})
    public locationTimezone!: string;

    bookingPeriodOptions 
    created(){
        this.bookingPeriodOptions=bookingPeriodOptions
    }

    dayOfWeek=""
    day=""
    month=""
    year=""
    

    pickedTimes=[]
    showTimePicker=false
     

    mounted(){
       this.dayOfWeek = moment(this.bookingDate.date).tz(this.locationTimezone).format('dddd')
       this.day = moment(this.bookingDate.date).tz(this.locationTimezone).format('DD')
       this.month = moment(this.bookingDate.date).tz(this.locationTimezone).format('MMM')
       this.year = moment(this.bookingDate.date).tz(this.locationTimezone).format('YYYY')
       this.pickedTimes = this.bookingDate.bookingTimes

    }

    public RemoveDate(){
        this.$emit('remove', this.bookingDate.date)
    }

    public removeTime(pickedtime){
        if(pickedtime.start == ''){
            this.showTimePicker = true;
        }
        else{
            this.pickedTimes = this.pickedTimes.filter(tim => tim!=pickedtime);
            this.pickedTimes = this.sortPickedTimes()
            this.ChangeBookingDate(pickedtime)
        }
    }

    public addTime(time){ 
        if(time.start && time.end){
            this.pickedTimes.push(time)
        }
        this.pickedTimes = this.sortPickedTimes()
        this.showTimePicker = false;
        if(time) this.ChangeBookingDate(null)
    }

    public sortPickedTimes(){
        return _.sortBy(this.pickedTimes, function(time){
            const tim = JSON.parse(JSON.stringify(time))
            if(tim.start=='') return 'Z'
            if(tim.start.slice(0,2)=='12') tim.start ='00'+ tim.start.slice(2);
            return tim.start.slice(6,8)+tim.start.slice(0,5)
        })
    }

    public ChangeBookingDate(removedTime){
        // console.log("Change")
        const newBookingDate: bookingDateTimesInfoType = {
            date:this.bookingDate.date,
            bookingTimes: this.pickedTimes
        }
        this.$emit('bookingChanged', newBookingDate, removedTime)
    }

    public tooltipTitle(pickedtime){
        let title = ''
        if(!this.allowDelete && pickedtime.original && pickedtime.start!='')
            title = 'If you would like to change this time slot, you must cancel this booking record('+this.month+' '+this.day+', '+this.year+' at '+pickedtime.start+' - '+pickedtime.end +'), then add a new time slot here.';
        else if(pickedtime.start!='')
            title = 'Click to REMOVE this booking time'
        return title
    }

}

</script>

<style scoped lang="scss">
    .date-card{
        border-radius: 10px;
        border:1px solid #EEE;
        min-height: 22.5rem;
        width: 13rem;
        box-shadow: 2px 5px 5px 2px #DDD;
        margin:0 1rem;
        padding: 0;
    }
</style>