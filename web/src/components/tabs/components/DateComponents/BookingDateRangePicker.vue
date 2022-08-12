<template>
    <b-card body-class="p-0" id="booking-date-container-range"> 
        <b-button 
            @click="initDates();onShow=true;"
            id="popover-range-button-variant" 
            variant="transparent" 
            class="border-0" 
            style="width:100%; margin:0; padding:0.5rem 1rem;"
            >
            <span v-html="pickedDates">{{pickedDates}}</span> <b-icon-calendar style="float:right"/>
        </b-button>
        <b-popover 
            customClass="pop-range"
            target="popover-range-button-variant"  
            triggers="manual"
            placement="bottomleft"
            container="booking-date-container-range"
            ref="popover"
            :show.sync="onShow"           
            >
            <div>
                <b-row class="mt-1 py-0" >
                    <b-col cols="5 text-center bg-select h4 border ml-4 py-2">
                        <span v-if="dates[1]<dates[0]"><b class="text-danger">From: </b>{{dates[1]|beautify-date-weekday}}</span>
                        <span v-else><b class="text-danger">From: </b>{{dates[0]|beautify-date-weekday}}</span>
                    </b-col>
                    <b-col cols="1" />
                    <b-col cols="5 text-center bg-select h4 border ml-2 py-2">
                        <span v-if="dates[0]>dates[1]"><b class="text-danger">To: </b>{{dates[0]|beautify-date-weekday}}</span>
                        <span v-else ><b class="text-danger">To: </b>{{dates[1]|beautify-date-weekday}}</span>
                    </b-col>
                </b-row>
                <b-row class="py-0 mt-n4 mb-4" >
                    <b-col cols="6" class="vuetify">
                        <v-app style="height:24rem; padding:0; margin:1rem 0 -2rem 0;">                        
                            <v-date-picker
                                v-model="dates"
                                color="success" 
                                :allowed-dates="allowedDates"                        
                                range                                
                                :picker-date.sync="pickerDateL"
                            ></v-date-picker>                            
                        </v-app>
                    </b-col>
                    <b-col cols="4" class="vuetify">
                        <v-app style="height:24rem; padding:0; margin:1rem 0 -2rem 0;">                        
                            <v-date-picker
                                v-model="dates"
                                color="success"
                                :allowed-dates="allowedDates" 
                                range
                                :picker-date.sync="pickerDateR"                                
                            ></v-date-picker>                            
                        </v-app>
                    </b-col>
                </b-row>
            </div>

            <b-row style="margin-top:-1rem;">
                <b-col>
                    <b-button @click="setDatesToday" style="width:8rem;" variant="primary">Today</b-button>
                </b-col>
                <b-col>
                    <b-button @click="setDatesOneWeek" style="width:8rem;" variant="primary">One Week</b-button>
                </b-col>
                <b-col>
                    <b-button @click="setDatesTwoWeeks" style="width:8rem;" variant="primary">Two Weeks</b-button>
                </b-col>
                <b-col>
                    <b-button @click="setDatesOneMonth" style="width:8rem;" variant="primary" >One Month</b-button>
                </b-col>
            </b-row>

            <b-row class="border rounded mx-0" style="padding:0.1rem 0rem; margin-top:1rem; box-shadow: 0px 0px 6px 3px #DDD;">
                <b-col>
                    <b-button @click="focusSearchButton();onShow=false" class="border" variant="white" style="width:7rem;" >Cancel</b-button>
                </b-col>
                <b-col>
                    <b-button @click="clearDates" class="border" variant="warning">Remove Date Filter</b-button>
                </b-col>
                <b-col>
                    <b-button @click="AddDates" class="px-4" variant="success" style="float:right; width:7rem;">Add</b-button>
                </b-col>
            </b-row>
        </b-popover>

    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment-timezone'
import {dateRangeInfoType } from '@/types/Bookings/json';
import * as _ from 'underscore';

@Component
export default class BookingDateRangePicker extends Vue {
    @Prop({required: true})
    bookingRange!: dateRangeInfoType;

    onShow= false
    dates = []

    pickedDates=""
    pickerDateL=""
    pickerDateR=""

    @Watch('pickerDateL')
    monthChange(newValue){
        this.pickerDateR = moment(newValue).add(1,'months').format("YYYY-MM")
    }

    @Watch('pickerDateR')
    monthChangeR(newValue){
        this.pickerDateL = moment(newValue).add(-1,'months').format("YYYY-MM")
    }
   

    mounted(){
        this.initDates()
    }


    public clearDates(){ 
        this.dates=[null,null]
        // this.AddDates()
    }

    public initDates(){
        this.dates = []
     
        this.dates.push(this.bookingRange.startDate?.slice(0,10))
        this.dates.push(this.bookingRange.endDate?.slice(0,10))
        this.getDatesText(_.sortBy(this.dates))

        if(this.bookingRange.startDate?.slice(0,7))
            this.pickerDateL = this.bookingRange.startDate.slice(0,7)
        else
            this.pickerDateL = moment().format("YYYY-MM")
    }


    public getDatesText(bookingDate){

        if(!bookingDate[1] || !bookingDate[0])
            this.pickedDates ='All dates'
        else
            this.pickedDates ='<b>From </b>'+ moment(bookingDate[0]).format("MMM DD, YYYY") +
                              '<b>  To </b>'+  moment(bookingDate[1]).format("MMM DD, YYYY");      
    }


    public AddDates(){
        if(!this.dates[1] || !this.dates[0])
            this.dates=['','']
        this.dates = _.sortBy(this.dates)
        this.getDatesText(this.dates)
        const dateRange: dateRangeInfoType = {
            startDate:moment(this.dates[0]).toISOString() ,
            endDate:moment(this.dates[1]).toISOString()
        }
        this.$emit('datesAdded',dateRange)
        this.onShow= false
    }

    public focusSearchButton(){
        Vue.nextTick(()=>{
            const el = document.getElementsByName("search")[0];
            if(el) el.focus();
        })        
    }

    public allowedDates(date){
        return true
        // const day = moment(date).weekday()
        // if(day==0 || day==6) return false
        // else return true
    }


    public setDatesToday(){
        const today = moment().format("YYYY-MM-DD")        
        this.dates=[today, today]
        this.pickerDateL = moment().format("YYYY-MM")
    }

    public setDatesOneWeek(){
        const today = moment().format("YYYY-MM-DD")
        const nextWeek = moment().add(6,'days').format("YYYY-MM-DD")        
        this.dates=[today, nextWeek]
        this.pickerDateL = moment().format("YYYY-MM")
    }

    public setDatesTwoWeeks(){
        const today = moment().format("YYYY-MM-DD")
        const twoWeek = moment().add(13,'days').format("YYYY-MM-DD")
        this.dates=[today, twoWeek]
        this.pickerDateL = moment().format("YYYY-MM")
    }

    public setDatesOneMonth(){
        const today = moment().format("YYYY-MM-DD")
        const oneMonth = moment(today).add(1,'month').format("YYYY-MM-DD")       
        this.dates=[today, oneMonth]
    }
}
</script>

<style scoped lang="scss" >

    ::v-deep .vuetify{
        @import "@/styles/vuetify.scss";
        @import "@/styles/_custom_vuetify.scss";
    }

    .popover{
        border-radius: 10px;
        border:1px solid #EEE;
        height: 33rem;
        width: 40rem;
        max-width: 40rem;
        margin:0 -.5rem;
        padding: 0;
        box-shadow: 3px 3px 6px 6px #DDD;
    }
</style>