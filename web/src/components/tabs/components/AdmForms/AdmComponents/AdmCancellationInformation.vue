<template>
    <b-card class="glow my-5">
        <h3 class="text-dark p-0 mt-n2 mb-4">Cancellation Information</h3>
        
        <b-card v-for="recordDetails in records" :key="'cancellation-'+recordDetails.id" class="mb-4 bg-card_detail">
            <b-table-simple  borderless style="width:100%;font-size:12pt;" class="my-n3 mb-0">
                <tr>
                    <td class="m-1 p-1" style="width:11%;"><b>Date:</b> {{recordDetails.date|iso-date}} </td>
                    <td class="m-1 p-1" style="width:17%;"><b>Time:</b> {{recordDetails.time}} </td>
                    <td class="m-1 p-1" style="width:32%;"><b>Registry:</b> {{recordDetails.registry}} <b-icon-exclamation-triangle-fill v-if="recordDetails.registryWarning" class="ml-1" v-b-tooltip.hover.v-warning title="This Booking corresponds to a different location." font-scale="1.3" variant="warning"/> </td>
                    <td class="m-1 p-1" style="width:18%;"><b>File #:</b> {{recordDetails.file}} </td>
                    <td class="m-1 p-1" style="width:22%;"><b>CaseName:</b> {{recordDetails.caseName}} </td>
                                   
                </tr>
                <tr>
                    <td class="m-1 p-1"><b>Federal:</b> {{recordDetails.federalYN}} </td>
                    <td class="m-1 p-1"><b>Reason Code:</b> {{recordDetails.reasonCd}} </td>                     
                    <td class="m-1 p-1"><b>Cancellation Date:</b> {{recordDetails.cancellationDate|iso-date}} </td>
                    <td class="m-1 p-1" colspan="2"><b>Cancellation Time:</b> {{recordDetails.cancellationTime}} </td>                                           
                </tr> 
                <tr>
                    <td class="m-1 p-1" colspan="2"><b>Cancelled By:</b> {{recordDetails.cancelledBy}} </td>
                    <td class="m-1 p-1"><b>Cancellation Reason:</b> {{recordDetails.cancelReason}} </td>
                    <td class="m-1 py-0 pl-1" colspan="2">
                        <b-row class="m-0 p-0">
                            <b>Cancellation Fee Applicable:</b>
                            <b-form-input                                
                                class="ml-3"
                                style="width:6rem;"
                                size="sm"                        
                                v-model="recordDetails.cancellationFee" />
                            <div class="ml-3" style="font-size:13pt;" > $</div>
                        </b-row>
                        
                    </td>                    
                </tr>                
                <tr>
                    <td class="m-1 p-1" colspan="4"><b>Cancellation Comment:</b> {{recordDetails.cancellationComment}} </td>
                </tr>

            </b-table-simple >
        </b-card>

            
                   
    </b-card>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingAdmInfoType, bookingSearchInfoType } from '@/types/Bookings/json';
import { locationsInfoType } from '@/types/Common/json';

@Component
export default class AdmCancellationInformation extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType;
    
    @Prop({required: true})
    public searchLocation!: locationsInfoType;
    
    dataReady = false;
    records: bookingAdmInfoType[] = []
    
    mounted(){
        this.dataReady = false
        this.records = []
        for(const date of this.booking.dates){
            const record: bookingAdmInfoType = JSON.parse(JSON.stringify(date))
            if(record.status!="Cancelled") continue            
            record.cancelledBy = date.cancellationReason.split('(')[0]
            record.cancelReason = date.cancellationReason.split('(')[1].replace(')','')
            record.registryWarning = !(date.registry==this.searchLocation.name)
            record.reasonCd = date.reason?.includes('OTHER__')? 'Other' :date.reason;
        
            record.time = date.startTime + ' - '+ date.finishTime
            record.federalYN = date.federal? 'Yes' : 'No'

            this.records.push(record)
        }        
        this.dataReady = true;
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