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
                    <b-button @click="RemoveDate" class="py-0 " variant="transparant"> X </b-button>
                </b-col>
            </b-row>

            <b-row class="py-1" style="line-height:1rem; font-weight:600; font-size:22pt; margin:0rem -1rem; 0rem 0">
                <b-col cols="12" class="text-primary">
                    {{month}} {{day}}
                </b-col>               
            </b-row>

            <b-row class="py-0 my-0" style="line-height:1rem; font-weight:600; font-size:16pt; margin:0rem -1rem; 0rem 0">
                <b-col cols="12" class="py-0 mb-2 text-info text-left">
                    {{year}}
                </b-col>
            </b-row>

            <b-row style="line-height:1rem; font-size:14pt; color:#AAA; margin:1rem -1rem; 0rem 0;">
                <b-col cols="12" class="mx-1 my-0 p-0">
                    <div class="mb-2 ml-2"><b>Booking Times</b></div>
                        
                    <div style="display:inline-block" v-for="pickedtime in pickedTimes" :key="pickedtime">
                        <b-button style="font-size:10pt; margin:0.15rem; padding:0.15rem;" :variant="pickedtime=='Add Time'?'primary':'time'" size="sm" @click="removeTime(pickedtime)">
                            <span class="text-white"> {{pickedtime}} </span>
                            <b-icon-plus-square-fill scale="0.75" variant="white" v-if="pickedtime=='Add Time'" />
                            <b-icon-x-square-fill scale="0.75" variant="white" v-else />
                        </b-button>
                    </div>
                        
                        
                </b-col>
            </b-row>
        </div>
        <time-picker v-else  :pickedTimes="pickedTimes" @addTime="addTime"/>
       

    </b-card>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import {bookingPeriodOptions} from './BookingEnums'
import moment from 'moment-timezone'
import { bookingDateTimesInfoType } from '@/types/Bookings/json';
import TimePicker from "./TimePicker.vue"
import * as _ from 'underscore';

@Component({
    components:{
        TimePicker
    }
})
export default class SearchInterpretersPage extends Vue {
    
    @Prop({required: true})
    bookingDate!: bookingDateTimesInfoType;

    bookingPeriodOptions 
    created(){
        this.bookingPeriodOptions=bookingPeriodOptions
    }

    dayOfWeek=""
    day=""
    month=""
    year=""
    

    pickedTimes=['Add Time']
    showTimePicker=false
     

    mounted(){
       this.dayOfWeek = moment(this.bookingDate.date).format('dddd')
       this.day = moment(this.bookingDate.date).format('DD')
       this.month = moment(this.bookingDate.date).format('MMM')
       this.year = moment(this.bookingDate.date).format('YYYY')
       this.pickedTimes = this.bookingDate.bookingTimes

    }

    public RemoveDate(){
        this.$emit('remove', this.bookingDate.date)
    }

    public removeTime(pickedtime){
        if(pickedtime == 'Add Time'){
            this.showTimePicker = true;
        }
        else{
            this.pickedTimes = this.pickedTimes.filter(tim => tim!=pickedtime);
            this.pickedTimes = _.sortBy(this.pickedTimes,function(tim){
                if(tim.slice(0,2)=='12') tim ='00'+ tim.slice(2);
                return tim.slice(6,8)+tim.slice(0,5)
            })
            this.ChangeBookingDate()
        }
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
        if(time) this.ChangeBookingDate()
    }

    public ChangeBookingDate(){
        // console.log("Change")
        const newBookingDate: bookingDateTimesInfoType = {
            date:this.bookingDate.date,
            bookingTimes: this.pickedTimes
        }
        this.$emit('bookingChanged', newBookingDate)
    }

}

</script>

<style scoped lang="scss">
    .date-card{
        border-radius: 10px;
        border:1px solid #EEE;
        min-height: 21.5rem;
        width: 12rem;
        box-shadow: 2px 5px 5px 2px #DDD;
        margin:0 1rem;
        padding: 0;
    }
</style>