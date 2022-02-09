<template>
    <b-card class="date-card mb-2 mx-2" body-class="py-2">                
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

            <b-row style="line-height:1rem; font-size:14pt; color:#AAA; margin:.5rem -1rem; 0rem 0">
                <b-col cols="12" class="my-0 pt-1 pb-0">
                    <b>Arrival Time</b>
                </b-col>
            </b-row>

            <b-row class="py-1">
                <b-col cols="12 m-0 px-2 py-0" >
                   <b-form-timepicker v-model="arrivalTime" placeholder="time" @hidden="timeContext()" locale="en"></b-form-timepicker>
                </b-col>
            </b-row>

            <b-row class="py-0">
                <b-col cols="12" class="">
                    <b-form-radio-group
                        v-model="period"                        
                        size="lg"
                        @change="ChangeBookingDate"
                    >
                    <b-form-radio v-for="option,inx in bookingPeriodOptions" :key="inx" :value="option['value']" class="mt-1">
                        {{option['text']}}
                    </b-form-radio>
                    </b-form-radio-group>
                   
                </b-col>
            </b-row>
       

    </b-card>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import {bookingPeriodOptions} from './BookingEnums'
import moment from 'moment-timezone'
import { bookingDateInfoType } from '@/types/Bookings/json';

@Component({
    components:{

    }
})
export default class SearchInterpretersPage extends Vue {
    
    @Prop({required: true})
    bookingDate!: bookingDateInfoType;

    bookingPeriodOptions 
    created(){
        this.bookingPeriodOptions=bookingPeriodOptions
    }

    dayOfWeek=""
    day=""
    month=""
    year=""
    arrivalTime=""
    period=""
     

    mounted(){
       this.dayOfWeek = moment(this.bookingDate.date).format('dddd')
       this.day = moment(this.bookingDate.date).format('DD')
       this.month = moment(this.bookingDate.date).format('MMM')
       this.year = moment(this.bookingDate.date).format('YYYY')
       this.arrivalTime = this.bookingDate.arrivalTime
       this.period = this.bookingDate.period

    }

    public RemoveDate(){
        this.$emit('remove', this.bookingDate.date)
    }

    public timeContext(){
        // console.log("Change")
        // console.log(this.bookingDate.arrivalTime)
        // console.log(this.arrivalTime.substring(0,5))
        if(this.bookingDate.arrivalTime.substring(0,5)!=this.arrivalTime.substring(0,5)){
            this.ChangeBookingDate()
        }
    }

    public ChangeBookingDate(){
        // console.log("Change")
        const newBookingDate: bookingDateInfoType = {
            date:this.bookingDate.date,
            id:this.bookingDate.id,
            period: this.period,
            arrivalTime: this.arrivalTime.substring(0,5)
        }
        this.$emit('bookingChanged', newBookingDate)
    }

}

</script>

<style scoped lang="scss">
    .date-card{
        border-radius: 10px;
        border:1px solid #EEE;
        height: 20rem;
        width: 12rem;
        box-shadow: 2px 5px 5px 2px #DDD;
        margin:0 1rem;
        padding: 0;
    }
</style>