<template>
    <div v-if="dataReady">
        <b-card class="text-center h2 bg-warning" body-class="py-3">Scheduling Conflict:</b-card>
        <b-table
            :items="conflictDates"
            :fields="conflictDateFields"                        
            small            
            responsive="sm">
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
import {bookingMethodOfAppearance, statusOptions} from './BookingEnums'
import * as _ from 'underscore';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { bookingDateTimesInfoType } from '@/types/Bookings/json';
const commonState = namespace("Common");

@Component
export default class SchedulingConflictPopup extends Vue {   

    @Prop({required: true})
    bookings!: any;

    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[]
    
    @commonState.State
    public courtLocations!: locationsInfoType[];

    dataReady=false

    conflictDates=[]
    conflictDateFields=[
        {key:'date',      label:'Date',            sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle,', tdClass:'align-middle', thStyle:' width:17%'},
        {key:'startTime', label:'Start', sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle,', tdClass:'align-middle', thStyle:' width:8%'},
        {key:'finishTime',label:'Finish', sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle,', tdClass:'align-middle', thStyle:' width:8%'},
        {key:'file',      label:'File Number',     sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle,', tdClass:'align-middle', thStyle:' width:16%'},
        {key:'reason',    label:'Matter',          sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:7%'},
        {key:'location',  label:'Court Location',  sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:27%'},
        {key:'appearance',  label:'Appearance Type',  sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:17%'},        
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
            for(const bookingdate of booking.dates){ 
                if(bookingdate.status != statusOptions[2].value && bookingdate.date.slice(0,10) >= minBookingDate)               
                    this.conflictDates.push({
                        date: bookingdate.date,
                        startTime: bookingdate.startTime,
                        finishTime: bookingdate.finishTime,
                        file: bookingdate.file,
                        reason: bookingdate.reason,
                        location: bookingdate.registry,
                        appearance: bookingdate.methodOfAppearance
                    })
            }
        }
        this.conflictDates = _.sortBy(this.conflictDates, 'date')
    }

}
</script>
