<template>
    <div v-if="dataReady">
        <b-card v-if="showTitle" class="text-center h2 bg-warning" body-class="py-3">Scheduling Conflict:</b-card>
        <b-table
            :items="conflictDates"
            :fields="conflictDateFields"                        
            small            
            responsive="sm">
            <template v-slot:head(startTime) >
                <div>Start</div>
                <div style="font-size:9pt; margin-top:-.45rem; color:#ffc107;">(Court Time)</div>
            </template>
            <template v-slot:head(finishTime) >
                <div>Finish</div>
                <div style="font-size:9pt; margin-top:-.45rem; color:#ffc107;">(Court Time)</div>
            </template>
            <template v-slot:head(searchLocationStart) >
                <div>Start</div>
                <div style="font-size:9pt; margin-top:-.45rem; color:#ffc107;">({{searchLocation.city}} Time)</div>
            </template>
            <template v-slot:head(searchLocationFinish) >
                <div>Finish</div>
                <div style="font-size:9pt; margin-top:-.45rem; color:#ffc107;">({{searchLocation.city}} Time)</div>
            </template>
            <template v-slot:cell(date)="data" >
                <b>{{data.value|beautify-date-weekday}}</b>
            </template>
            <template v-slot:cell(location)="data" >
                <div style="color:#de350b;">{{data.value}}</div>
            </template>
            <template v-slot:cell(reason)="data" >
                <b>{{data.value}}</b>
            </template>
        </b-table>
    </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { locationsInfoType } from '@/types/Common/json';
import {statusOptions} from './BookingEnums'
import * as _ from 'underscore';
import moment from 'moment-timezone'

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { bookingDateTimesInfoType } from '@/types/Bookings/json';
const commonState = namespace("Common");

@Component
export default class SchedulingConflictPopup extends Vue {   

    @Prop({default: true})
    showTitle!: boolean;

    @Prop({required: true})
    bookings!: any;

    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[]

    @Prop({default: null})
    exactBookingDate!: string
    
    @Prop({required: true})
    public searchLocation!: locationsInfoType;
    
    @commonState.State
    public courtLocations!: locationsInfoType[];

    dataReady=false

    conflictDates=[]
    conflictDateFields=[
        {key:'date',      label:'Date',            sortable:false,cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:15%'},
        {key:'startTime', label:'Start',           sortable:false,cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:9%'},
        {key:'finishTime',label:'Finish',          sortable:false,cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:9%'},        
        {key:'location',  label:'Court Location',  sortable:false,cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:28%'},
        {key:'appearance',label:'Appearance Type', sortable:false,cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:15%'},
        {key:'searchLocationStart', label:'Start', sortable:false,cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:12%'},
        {key:'searchLocationFinish',label:'Finish',sortable:false,cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:12%'},
    ]
    
    
    mounted(){
        this.dataReady=false
        this.extractInfo()
        this.dataReady=true
    }

    public extractInfo(){
        this.conflictDates=[]
        //console.log(this.bookings)
        const sortedBookingDate = _.sortBy(this.bookingDates, 'date')
        const minBookingDate = sortedBookingDate.length>0? sortedBookingDate[0].date.slice(0,10): ''
        //console.log(minBookingDate)
        for(const booking of this.bookings){
            
            const timezone = booking.location?.timezone? booking.location.timezone: 'America/Vancouver';
            
            for(const bookingdate of booking.dates){                
                const bookingdateTZ = moment(bookingdate.date).tz(timezone).format('YYYY-MM-DD');
                if(bookingdate.status != statusOptions[2].value && ((minBookingDate && bookingdateTZ >= minBookingDate) || bookingdateTZ==this.exactBookingDate)){
                    const registry = this.getCourtLocation(booking.locationId)                    
                    const date = moment.tz(bookingdateTZ+' '+bookingdate.startTime, 'YYYY-MM-DD HH:mm A',registry.timezone).format()
                    const searchLocationDate = moment.tz(bookingdateTZ+' '+bookingdate.startTime, 'YYYY-MM-DD HH:mm A',registry.timezone).tz(this.searchLocation.timezone).format()
                    const searchLocationStart = moment.tz(bookingdateTZ+' '+bookingdate.startTime, 'YYYY-MM-DD HH:mm A',registry.timezone).tz(this.searchLocation.timezone).format('hh:mm A')
                    const searchLocationFinish = moment.tz(bookingdateTZ+' '+bookingdate.finishTime, 'YYYY-MM-DD HH:mm A',registry.timezone).tz(this.searchLocation.timezone).format('hh:mm A')
                    this.conflictDates.push({
                        date: date,                                                
                        startTime: bookingdate.startTime,
                        finishTime: bookingdate.finishTime,
                        file: bookingdate.file,
                        reason: bookingdate.reason,
                        location: registry.name,
                        appearance: bookingdate.methodOfAppearance,
                        searchLocationDate,
                        searchLocationStart,
                        searchLocationFinish
                    })
                }
            }
        }
        this.conflictDates = _.sortBy(this.conflictDates, 'searchLocationDate')
    }

    public getCourtLocation(id){
        return this.courtLocations.filter(loc => loc.id==id)[0]
    }

}
</script>
