<template>
    <b-card body-class="p-0" id="booking-date-container-picker"> 
        <b-button 
            @click="openDatePickerWindow();"
            id="popover-button-variant-picker" 
            variant="transparent" 
            class="border-0" 
            style="width:100%; margin:0; padding:0.5rem 1rem;">
            <span :style="pickedDates == 'Add dates'?'float: left;':''">{{pickedDates}}</span> <b-icon-calendar style="float:right"/>
        </b-button>
        <b-popover 
            :customClass="editDateMode? 'pop-edit':''"
            target="popover-button-variant-picker"  
            triggers="manual"
            :placement="editDateMode?'bottomcenter':'bottomleft'"
            container="booking-date-container-picker"
            ref="popover"
            :show.sync="onShow"           
            >
            <div>
                <b-row class="py-0" >
                    <b-col cols="7" class="vuetify">
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
                            <b-col cols="12" class="mt-2 ml-n2">
                                <b>Booking Times</b>                                
                            </b-col>
                            <time-picker style="width:13rem; height:22.5rem;" v-if="showTimePicker"  :pickedTimes="pickedTimes" @addTime="addTime"/>
                            <div v-else>
                                <default-time-selector 
                                    style="margin:0.2rem 0; width:12rem;"
                                    :key="updateTime"  
                                    :pickedTimes="pickedTimes" 
                                    @addTime="addTime"/>
                                <div style="display:inline-block"                                 
                                    v-for="pickedtime,inx in pickedTimes" :key="'picked'+inx">
                                        <b-button 
                                            style="margin:0.2rem; padding:0.2rem;" 
                                            :variant="pickedtime.start==''?'primary':'time'" 
                                            size="sm" 
                                            :disabled="pickedtime.start=='' && pickedTimes.length>6"
                                            @click="removeTime(pickedtime)">
                                                <span v-if="pickedtime.start==''" class="text-white"> Add Time </span>
                                                <span v-else class="text-white"> {{pickedtime.start}} </span>                                            
                                                <b-icon-plus-square-fill scale="0.75" variant="white" v-if="pickedtime.start==''" />
                                                <b-icon-x-square-fill scale="0.75" variant="white" v-else />
                                                <div style="margin-left:-1.3rem;color:yellow;"> {{pickedtime.end}} </div>
                                        </b-button>
                                </div>
                            </div>
                        </b-row>
                        
                    </b-col>
                </b-row>
            </div>
            <b-row v-if="!showTimePicker" class="mt-3">
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

import TimePicker from "./TimePicker/TimePicker.vue"
import DefaultTimeSelector from "./TimePicker/DefaultTimeSelector.vue"

@Component({
    components:{
        TimePicker,
        DefaultTimeSelector
    }
})
export default class BookingDatePicker extends Vue {
    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[];

    @Prop({required: false})
    blockedDates!: string[];

    @Prop({required: false, default: false})
    editDateMode!: boolean;

    onShow= false
    dates = []
    arrayEvents = []

    pickedDates=""
    pickedTimes=[{start:'',end:''}]
    showTimePicker = false

    updateTime=0;


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
                bookingTimes: JSON.parse(JSON.stringify(this.pickedTimes))
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
        if(time.start && time.end){       
            this.pickedTimes.push(time)           
        }
        this.pickedTimes = this.sortPickedTimes()
        this.showTimePicker = false;
        this.$emit('change', false);
    }

    public removeTime(pickedtime){
        if(pickedtime.start == '')
            this.showTimePicker = true;
        else{
            this.pickedTimes = this.pickedTimes.filter(tim => tim!=pickedtime);
            this.pickedTimes = this.sortPickedTimes() 
            this.updateTime++;
        }
    }

    public sortPickedTimes(){
        return _.sortBy(this.pickedTimes, function(time){
            const tim = JSON.parse(JSON.stringify(time))
            if(tim.start=='') return 'Z'
            if(tim.start.slice(0,2)=='12') tim.start ='00'+ tim.start.slice(2);
            return tim.start.slice(6,8)+tim.start.slice(0,5)
        })
    }

    public openDatePickerWindow(){
        this.$emit('change', true);
        this.clearDates();
        this.onShow=true;
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
        height: 28rem;
        width: 40rem;
        max-width: 40rem;
        margin:0 -.5rem;
        padding: 0;
        box-shadow: 3px 5px 6px #DDD;
        &.pop-edit{
            margin:0 0 0 2rem ;
        }
    }
</style>