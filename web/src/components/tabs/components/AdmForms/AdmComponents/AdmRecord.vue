<template>
    <div v-if="dataReady">
        <b-card class="glow my-5">
            <h3 class="text-dark p-0 mt-n2 mb-4">Record</h3>
            <b-table
                :items="records"
                :fields="recordFields"
                sort-by="date"                
            >
                <template v-slot:cell(date)="data" >
                    <span>{{data.value|iso-date}}</span>
                </template>

                <template v-slot:cell(time)="data" >
                    <div style="font-size:10.5pt;">{{data.value}}</div>
                </template>

                <template v-slot:cell(actualStartTime)="data" >                    
                    <b-form-input 
                        size="sm"
                        :disabled="data.item.recordsApproved==true"
                        @change="recordChanged(data.item)"                       
                        v-model="data.item.actualStartTime"
                        :state="data.item.actualStartTimeState">
                    </b-form-input>
                </template>

                <template v-slot:cell(actualFinishTime)="data" > 
                    <b-form-input 
                        size="sm"
                        :disabled="data.item.recordsApproved==true"
                        @change="recordChanged(data.item)"                     
                        v-model="data.item.actualFinishTime"
                        :state="data.item.finishTimeState">
                    </b-form-input>
                </template>

                <template v-slot:cell(approversInitials)="data" >                    
                    <b-form-input 
                        size="sm"
                        :disabled="data.item.recordsApproved==true"
                        @change="recordChanged(data.item)"                     
                        v-model="data.item.approversInitials"
                        :state="data.item.approversInitialsState">
                    </b-form-input>
                </template>

                <template v-slot:cell(federal)="data" >
                    <span>{{data.item.federalYN}}</span>
                </template>

                <template v-slot:cell(details)="data" >
                        
                    <b-button 
                        style="font-size:20px; border: none;" 
                        size="sm" 
                        @click="data.toggleDetails();" 
                        v-b-tooltip.hover.v-warning
                        :title="data.item.registryWarning?'This Booking corresponds to a different location.':''"
                        :class="data.item.registryWarning?'m-0 p-0 bg-danger text-warning': 'm-0 p-0 text-primary bg-transparent'">
                        <b-icon-caret-right-fill v-if="!data.item['_showDetails']"></b-icon-caret-right-fill>
                        <b-icon-caret-down-fill v-if="data.item['_showDetails']"></b-icon-caret-down-fill>                                                       
                    </b-button>
                    
                </template>

                <template v-slot:row-details ="data"> 
                    <!-- {{data.item}} -->
                    <record-details :recordDetails="data.item" />                    
                </template>

            </b-table>
        </b-card>
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';

import {reasonCodeClass} from '../../BookingEnums'
import { locationsInfoType } from '@/types/Common/json';
import { bookingAdmInfoType, bookingSearchInfoType } from '@/types/Bookings/json';

import RecordDetails from "./RecordDetails.vue"


@Component({
    components:{
        RecordDetails
    }
})
export default class AdmRecord extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType;
    
    @Prop({required: true})
    public searchLocation!: locationsInfoType;

    recordFields=[
        {key:'details',        label:'',                  sortable:false, thStyle:'width:1%',   cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle'},
        {key:'date',           label:'Date',              sortable:false, thStyle:' width:9%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'file',           label:'Court File Number', sortable:false, thStyle:' width:12%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'caseName',       label:'Case Name',         sortable:false, thStyle:' width:13%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},        
        {key:'reasonCd',         label:'Reason',            sortable:false, thStyle:' width:12%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},      
        {key:'federal',        label:'Fed.',              sortable:false, thStyle:' width:3%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},        
        {key:'room',           label:'Court Room',        sortable:false, thStyle:' width:13%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'time',           label:'Booking Time',      sortable:false, thStyle:' width:7%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'actualStartTime',label:'Actual Start Time', sortable:false, thStyle:' width:10%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'actualFinishTime',label:'Finish Time',      sortable:false, thStyle:' width:10%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'approversInitials',label:"Approver's Initials",sortable:false,thStyle:'width:10%',cellStyle:'',thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'}
    ]
    dataReady = false;
    records: bookingAdmInfoType[] = []

    mounted(){
        this.dataReady = false
        this.records = []
        for(const date of this.booking.dates){
            const record: bookingAdmInfoType = JSON.parse(JSON.stringify(date))
            if(record.status=="Cancelled") continue            
           
            record.registryWarning = !(date.registry==this.searchLocation.name)

            record.reasonCd = date.reason?.includes('OTHER__')? 'Other' :date.reason;
            record.reasonDesc=date.reason?.includes('OTHER__')? date.reason.replace('OTHER__','') :reasonCodeClass[date.reason];
            record.courtClassDesc= date.courtClass?.includes('OTHER__')? (date.courtClass.replace('OTHER__','')+' (other)') : date.courtClass;

            record.time = date.startTime + ' '+ date.finishTime
            record.federalYN = date.federal? 'Yes' : 'No'
            record.bilingualYN = date.bilingual? 'Yes' : 'No'
            record.actualStartTime=date.actualStartTime;
            record.actualStartTimeState=null;
            record.actualFinishTime=date.actualFinishTime;
            record.actualFinishTimeState=null;
            record.approversInitials=date.approversInitials;
            record.approversInitialsState=null;            
            // Vue.filter('initials')(this.booking.updated_by)

            this.records.push(record)
        }        
        this.dataReady = true;
        this.checkAllApproved()
    }

    public recordChanged(record){
        //console.log(record)
        record.actualStartTimeState = this.checkTimeFormat(record.actualStartTime);
        record.actualFinishTimeState = this.checkTimeFormat(record.actualFinishTime);
        const bookingDate = this.booking.dates.filter(date => date.id == record.dateId)
        if (bookingDate.length==1){
            bookingDate[0].actualStartTime = record.actualStartTimeState!=false? record.actualStartTime :'';
            bookingDate[0].actualFinishTime = record.actualFinishTimeState!=false? record.actualFinishTime: '';
            bookingDate[0].approversInitials = record.approversInitials;
        } 
        this.checkAllApproved()  
    }

    public checkAllApproved(){
        //TODO
        let allApproved = true;
        for(const record of this.records){
            if(!record.actualStartTime    || record.actualStartTimeState==false ||
                !record.actualFinishTime        || record.actualFinishTimeState==false      ||
                !record.approversInitials || record.approversInitialsState==false
            ){
                allApproved = false;
                break;
            }        
        }

        if(allApproved) this.$emit('approved')
    }


    // public saveBooking(){        
            
    //     this.$http.put('/booking/' + this.booking.id, this.booking)
    //     .then((response) => {            
    //         if(response?.data){                
    //             this.$emit('find');                
    //         }                
    //     },(err) => {
    //         // console.log(err.response.data.detail)
    //         this.errorMsg=err.response.data.detail
    //     });               
    // } 




    public checkTimeFormat(time){
        const timeFormat =/^(2[0-3]|[01]?[0-9]):([0-5][0-9])$/; 
        
        if(time && !timeFormat.test(time)) return false
        return null
    }

}
</script>

<style scoped lang="scss">
    .card.glow{
        background: rgb(182, 210, 221);
        box-shadow: 2px 5px 5px 2px #DDD;
    }

    .labels {
        font-size: 12px; font-weight:600; line-height: 0.025rem; color: rgb(50, 50, 50);
    }

</style>