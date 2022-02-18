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
        </b-table>
    </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { locationsInfoType } from '@/types/Common/json';
import {bookingPeriodOptions, bookingPeriod} from './BookingEnums'

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component
export default class SchedulingConflictPopup extends Vue {   

    @Prop({required: true})
    bookings!: any;
    
    @commonState.State
    public courtLocations!: locationsInfoType[];

    dataReady=false

    conflictDates=[]
    conflictDateFields=[
        {key:'date',    label:'Date',            sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle,', tdClass:'align-middle', thStyle:' width:18%'},
        {key:'time',    label:'Time',            sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle,', tdClass:'align-middle', thStyle:' width:7%'},
        {key:'period',  label:'Period',          sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle,', tdClass:'align-middle', thStyle:' width:12%'},
        {key:'file',    label:'File Number',     sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle,', tdClass:'align-middle', thStyle:' width:20%'},
        {key:'reason',  label:'Matter',          sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:10%'},
        {key:'location',label:'Court Location',  sortable:false, cellStyle:'', thClass:'bg-secondary text-white align-middle', tdClass:'align-middle', thStyle:' width:33%'},    
    ]
    
    
    mounted(){
        this.dataReady=false
        this.extractInfo()
        this.dataReady=true
    }

    public extractInfo(){
        this.conflictDates=[]
        console.log(this.bookings)
        for(const booking of this.bookings){
            for(const date of booking.dates){                
                this.conflictDates.push({
                    date:date.date,
                    time:date.arrivalTime,
                    period:bookingPeriodOptions.filter(period => period.value ==date.period)[0].text,
                    file:booking.file,
                    reason:booking.reason,
                    location:this.courtLocations.filter(loc => loc.id == booking.locationId)[0].name
                })
            }
        }
    }

}
</script>
