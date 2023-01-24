<template>
    <div v-if="dataReady" :key="update">
        <b-card class="glow my-5">
            <b-row class="m-0 p-0">
                <h3 class="text-dark p-0 mt-n2 mb-4">Record</h3>                 
                <div class="text-success p-0 mt-n2 ml-3" v-if="booking.recordsApproved"> approved by <b>{{booking.approverName}}</b> </div>
                <b-button size="sm"
                    v-if="booking.recordsApproved"
                    variant="info" 
                    style="height:2rem; margin:-0.55rem 0 0 1rem;"
                    @click="confirmModifyRecords=true;"
                    >
                    Modify Approved Records
                    <b-icon-pencil-square />
                </b-button>
            </b-row>
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
                        :formatter="timeFormatter"
                        :disabled="booking.recordsApproved==true"
                        @input="recordChanged(data.item)"                       
                        v-model="data.item.actualStartTime"
                        :state="data.item.actualStartTimeState">
                    </b-form-input>
                    <div v-if="data.item.actualStartTimeState==false" class="subtext" >eg. 09:00 AM</div>
                    <div v-if="data.item.startAfterFinishState==false" class="subtext mr-n4" >Start-Time is after</div>
                    <div v-if="data.item.sessionLargerThan8hrsWarning==false" class="subtext-warning" >The session exceeds 8 hours !</div>
                </template>

                <template v-slot:cell(actualFinishTime)="data" > 
                    <b-form-input 
                        size="sm"
                        :formatter="timeFormatter"
                        :disabled="booking.recordsApproved==true"
                        @input="recordChanged(data.item)"                     
                        v-model="data.item.actualFinishTime"
                        :state="data.item.actualFinishTimeState">
                    </b-form-input>
                    <div v-if="data.item.actualFinishTimeState==false" class="subtext" >eg. 04:00 PM</div>
                    <div v-if="data.item.startAfterFinishState==false" class="subtext ml-n5" >the Finish-Time !</div>                    
                </template>

                <template v-slot:cell(approversInitials)="data" >                    
                    <b-form-input 
                        size="sm"
                        :disabled="booking.recordsApproved==true"
                        @input="recordChanged(data.item)"                     
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
                        :title="data.item.registryWarning?'This Booking corresponds to a remote location.':''"
                        :class="data.item.registryWarning?'m-0 p-0 text-warning': 'm-0 p-0 text-primary bg-transparent'">
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

        <b-modal size="lg" v-model="confirmModifyRecords" title-class="h1 ml-3" hide-header-close header-bg-variant="warning"  title="Confirm Modifying Records">
            <div class="mx-3">
                <div style="font-size:15pt;">
                    By modifying the approved records, all the manually entered values in the 
                    <b class="text-primary">Payment Details</b> section will be replaced with the automatically calculated values.
                </div>
                <h3 class="mt-5 text-danger">Are you sure you want to proceed?</h3>
            </div>
            <template v-slot:modal-footer>                                
                <b-button class="ml-3 mr-auto" variant="dark" @click="confirmModifyRecords=false;">Cancel</b-button>
                <b-button class="mr-3 ml-auto" variant="warning" @click="modifyRecords()">Confirm</b-button>
            </template>
        </b-modal> 
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';
import moment from 'moment';

import {reasonCodeClass} from '../../BookingEnums'

import { bookingAdmRecordInfoType, bookingSearchResultInfoType } from '@/types/Bookings/json';

import RecordDetails from "./RecordDetails.vue"


@Component({
    components:{
        RecordDetails
    }
})
export default class AdmRecord extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
        

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
    records: bookingAdmRecordInfoType[] = []
    cancelledRecords: bookingAdmRecordInfoType[] = []
    update=0;
    confirmModifyRecords = false;

    mounted(){
        this.dataReady = false
        this.confirmModifyRecords = false;
        this.records = []
        this.cancelledRecords = []
        for(const date of this.booking.dates){
            const record: bookingAdmRecordInfoType = JSON.parse(JSON.stringify(date))
           
            record.registryWarning = (date.registry && date.locationId!=this.booking.location_id)

            record.reasonCd = date.reason?.includes('OTHER__')? 'Other' :date.reason;
            record.reasonDesc=date.reason?.includes('OTHER__')? date.reason.replace('OTHER__','') :reasonCodeClass[date.reason];
            record.courtClassDesc= date.courtClass?.includes('OTHER__')? (date.courtClass.replace('OTHER__','')+' (other)') : date.courtClass;
            record.date = moment(date.date.slice(0,10)+' '+date.startTime,'YYYY-MM-DD HH:mm A' ).format()
            record.time = date.startTime + ' '+ date.finishTime
            record.federalYN = date.federal? 'Yes' : 'No'
            record.bilingualYN = date.bilingual? 'Yes' : 'No'            
            record.actualStartTimeState=null;            
            record.actualFinishTimeState=null;            
            record.approversInitialsState=null;
            record.startAfterFinishState=null;
            record.sessionLargerThan8hrsWarning=null;           
            // Vue.filter('initials')(this.booking.updated_by)
            if(record.status=="Booked"){
                this.records.push(record)         
            }else
                this.cancelledRecords.push(record)
        }        
        this.dataReady = true;
        for(const record of this.records)
            this.recordChanged(record)
        // this.checkAllApproved()
    }

    public recordChanged(record){
        //console.log(record)
        record.actualStartTimeState = this.checkTimeFormat(record.actualStartTime);
        record.actualFinishTimeState = this.checkTimeFormat(record.actualFinishTime);
        record.sessionLargerThan8hrsWarning = null;
        record.startAfterFinishState = null;
       
        if(record.actualStartTimeState != false && record.actualFinishTimeState != false){
            const start = moment(record.actualStartTime, "hh:mm A")
            const end = moment(record.actualFinishTime, "hh:mm A")
            const diff = (moment.duration(end.diff(start))).asMinutes()
            record.startAfterFinishState = (start>=end)? false :null
            record.sessionLargerThan8hrsWarning = (diff>480)? false : null;                        
        }

        const bookingDate = this.booking.dates.filter(date => date.id == record.dateId)
        if (bookingDate.length==1){
            bookingDate[0].actualStartTime = record.actualStartTimeState!=false? record.actualStartTime :'';
            bookingDate[0].actualFinishTime = record.actualFinishTimeState!=false? record.actualFinishTime: '';
            bookingDate[0].approversInitials = record.approversInitials;
        } 
        this.checkAllApproved()  
    }

    public checkAllApproved(){
        
        let allApproved = true;
        for(const record of this.records){
            if( !record.actualStartTime   || record.actualStartTimeState==false ||
                !record.actualFinishTime  || record.actualFinishTimeState==false ||                
                !record.approversInitials || record.approversInitialsState==false ||
                record.startAfterFinishState==false
            ){
                allApproved = false;
                break;
            }        
        }

        if(allApproved) {
            // console.log(this.records)
            this.$emit('approved',true, false ,[...this.records, ...this.cancelledRecords])
        }else{
            this.$emit('approved',false, false ,[...this.records, ...this.cancelledRecords])
        }
    }

    public modifyRecords(){
        this.confirmModifyRecords=false;
        this.booking.recordsApproved = false
        this.update++;
        this.$emit('approved',false, true ,[...this.records, ...this.cancelledRecords])
    }

    public timeFormatter(value){
        const lastChar =  value.slice(-1);
        const permittedChars=[':','A','a','p','P','m','M',' ']       
        if(!permittedChars.includes(lastChar) && isNaN(Number(lastChar))) return value.slice(0,-1)
        if(lastChar==':' && value.slice(0,-1).length==1) return ('0'+value)
        if(lastChar==':' && value.slice(0,-1).length>2) return value.slice(0,2)
        if(Number(value.slice(0,2))>12) return value.slice(0,1)

        return value.toUpperCase().replace(/\s\s+/g, ' ');
    }

    public checkTimeFormat(time){        
        const timeFormat =/^([0-1][0-9]):([0-5][0-9]) (AM|PM)$/; 
        
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
    .subtext{
        font-size: 11px;        
        color: red;
        margin: 0rem;
        line-height: 0;
        transform:translate(0,10px);        
    }

    .subtext-warning{
        font-size: 12px;
        color: rgb(218, 133, 23);
        text-shadow: 1px 1px #999393;
        margin:0 -9rem 0 0;        
        line-height: 0;
        transform:translate(0,7px);        
    }

    .labels {
        font-size: 12px; font-weight:600; line-height: 0.025rem; color: rgb(50, 50, 50);
    }

</style>