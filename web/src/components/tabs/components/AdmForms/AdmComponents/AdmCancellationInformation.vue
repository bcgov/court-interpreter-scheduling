<template>
    <!-- <b-card :name="section_name" class="glow my-5"> -->
    <b-card class="glow my-5">
        <h3 class="text-dark p-0 mt-n2 mb-4">Cancellation Information</h3>
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

            <template v-slot:cell(cancellationDate)="data" >
                <span>{{data.value|beautify-date-simple}}</span>
            </template>

            <template v-slot:cell(comment)="data" >
                <div style="font-size:10pt; line-height:1rem;">
                    <div>{{data.item.cancellationComment}}</div>
                    <div>{{data.item.comment}}</div>                
                </div>
            </template>

            <template v-slot:cell(details)="data" >                        
                <b-button 
                    style="font-size:20px; border: none;" 
                    size="sm" 
                    @click="data.toggleDetails();"                         
                    class="m-0 p-0 text-secondary bg-transparent">
                    <b-icon-caret-right-fill v-if="!data.item['_showDetails']"></b-icon-caret-right-fill>
                    <b-icon-caret-down-fill v-if="data.item['_showDetails']"></b-icon-caret-down-fill>                                                       
                </b-button>                    
            </template>

            <template v-slot:row-details ="data">
                <record-details :recordDetails="data.item" headerColor="bg-secondary" />                    
            </template>

        </b-table>           
                   
    </b-card>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';
import moment from 'moment';
import { bookingAdmCancellationInfoType, bookingSearchResultInfoType } from '@/types/Bookings/json';
import RecordDetails from "./RecordDetails.vue"

@Component({
    components:{
        RecordDetails
    }
})
export default class AdmCancellationInformation extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    
    section_name="adm-cancellation"
    
    dataReady = false;
    records: bookingAdmCancellationInfoType[] = []
    activeRecords: bookingAdmCancellationInfoType[] = []

    recordFields=[
        {key:'details',          label:'',                    thStyle:'width:2%',  thClass:'bg-secondary text-white align-middle text-center', tdClass:'align-middle p-0 m-0'},
        {key:'date',             label:'Date',                thStyle:'width:9%',  thClass:'bg-secondary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'time',             label:'Booking Time',        thStyle:'width:12%', thClass:'bg-secondary text-white align-middle text-center', tdClass:'align-middle text-center'},        
        {key:'cancelledBy',      label:'Cancelled By',        thStyle:'width:11%', thClass:'bg-secondary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'cancellationDate', label:'Cancellation Date',   thStyle:'width:13%', thClass:'bg-secondary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'cancelReason',     label:'Cancellation Reason', thStyle:'width:22%', thClass:'bg-secondary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'comment',          label:'Comment',             thStyle:'width:31%', thClass:'bg-secondary text-white align-middle text-center', tdClass:'align-middle text-center'},
    ]
    
    
    mounted(){
        this.dataReady = false
        this.records = []
        this.activeRecords =[]
        for(const date of this.booking.dates){
            const record: bookingAdmCancellationInfoType = JSON.parse(JSON.stringify(date))
            if(record.status!="Cancelled"){
                this.activeRecords.push(record)
                continue            
            }
            record.date = moment(date.date.slice(0,10)+' '+date.startTime,'YYYY-MM-DD HH:mm A' ).format()
            record.cancelledBy = date.cancellationReason.split('(')[0]
            record.cancelReason = date.cancellationReason.split('(')[1].replace(')','')
            record.registryWarning = (date.registry && date.locationId!=this.booking.location_id)
            // record.reasonCd = date.reason?.includes('OTHER__')? 'Other' :date.reason;        
            record.time = date.startTime + ' - '+ date.finishTime
            // record.federalYN = date.federal? 'Yes' : 'No'
            record.feeChanged = false;
            record.feeDisabled = false;
            this.records.push(record)
        } 
        
        if(this.records.length==0){
            const record = {} as bookingAdmCancellationInfoType;
            record.feeDisabled = true
            this.records.push(record)
        }else{
            this.records = _.sortBy(this.records,'date')
        }
        this.dataReady = true;
    }

    // public feeChanged(recordDetails){        
    //     recordDetails.feeChanged=false
    //     this.$emit('saveChanges', [...this.records, ...this.activeRecords], this.section_name)        
    // }
   
 

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