<template>
    <div v-if="dataReady" class="mt-2">
        <div v-for="slicedRecord,inx in slicedRecords" :key="'tbl-cancel-cont-'+inx" :class="inx>0? 'margintop0p5':''"> 
            <table style="font-size:7.25pt;" class="print-block flexsize border border-dark m-0 p-0">
                <tr style="font-size:12pt; " class="m-0 p-0">
                    <td class="m-0 p-0" colspan="6"><div  class="ml-1 font-weight-bold">4 Cancellation Information (Project Code 1500144) <span v-if="inx>0">(continued)</span></div></td>                        
                </tr>
                <tbody v-for="record,indx in slicedRecord" :key="'cancel-table-'+indx">
                    
                    <tr class="spacer">
                        <td />
                        <td  colspan="5" style="border-top:1px solid #DDD; border-bottom:1px solid #DDD;" />
                        <td />
                    </tr>
                    <tr><td class="text-white">.</td></tr>
                    <tr >
                        <td />
                        <td style="width:15%;"><b class="ml-1">Date: </b><div class="answer-record">{{record.date|iso-date}}</div></td>                                        
                        <td style="width:20%;"><b>Time: </b><div class="answer-record">{{record.time}}</div></td>                    
                        <td style="width:15%;"><b>File #: </b><div class="answer-record">{{record.file}}</div></td>
                        <td style="width:10%;"><b>Federal: </b><div class="answer-record">{{record.federalYN}}</div></td>
                        <td style="width:40%;"><b>Registry: </b><div class="answer-record">{{record.registry|truncate-text(25)}}</div></td>
                        <td />
                    </tr>
                    <tr>
                        <td />
                        <td colspan="2"><b class="ml-1">Case Name: </b><div class="answer-record">{{record.caseName}}</div></td>
                        <td colspan="2"><b>Cancellation Date: </b><div class="answer-record">{{record.cancellationDate|iso-date}}</div></td>
                        <td><b>Cancellation Time: </b><div class="answer-record">{{record.cancellationTime}}</div></td>                    
                        <td />
                    </tr>
                    <tr>
                        <td />
                        <td colspan="2"><b class="ml-1">Cancellation Reason: </b><div class="answer-record">{{record.cancelReason}}</div></td>
                        <td colspan="2"><b>Cancelled By: </b><div class="answer-record">{{record.cancelledBy}}</div></td>
                        <td><b>Cancellation Fee Applicable: </b><div class="answer-record">{{record.cancellationFee}}</div> $</td>                    
                        <td />
                    </tr>           
                    <tr>
                        <td />
                        <td class="align-top"><b class="ml-1">ReasonCd: </b><div class="answer-record">{{record.reasonCd}}</div></td>
                        <td colspan="4"><b>Comment: </b><div class="answer-record-sm">{{record.cancellationComment}}</div> </td>
                        <td />
                    </tr>
                    <tr><td class="text-white">.</td></tr>
                </tbody>                                   
            </table>
        </div>  
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { bookingAdmCancellationInfoType, bookingSearchResultInfoType } from '@/types/Bookings/json';
import * as _ from 'underscore';
import moment from 'moment';

@Component
export default class CancellationInfo extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;


    slicedRecords: bookingAdmCancellationInfoType[][]=[]

    dataReady = false

    mounted(){ 
        this.dataReady=false;       
        this.extractInfo()
        this.dataReady=true
    }

    public extractInfo(){

        this.slicedRecords =[]
        let records:bookingAdmCancellationInfoType[] = []
        let totalAdmRecords = 0;
        
        for(const date of this.booking.dates){
            const record: bookingAdmCancellationInfoType = JSON.parse(JSON.stringify(date))
            if(record.status!="Cancelled"){
                totalAdmRecords++;
                continue; 
            } 
            
            record.cancelledBy = date.cancellationReason.split('(')[0]
            record.cancelReason = date.cancellationReason.split('(')[1].replace(')','')
            record.cancellationFee = date.cancellationFee? date.cancellationFee : '0.00'
            record.date = moment(date.date.slice(0,10)+' '+date.startTime,'YYYY-MM-DD HH:mm A' ).format()
            record.reasonCd = date.reason?.includes('OTHER__')? 'Other' :date.reason;        
            record.time = date.startTime + ' - '+ date.finishTime
            record.federalYN = date.federal? 'Yes' : 'No'
            record.feeChanged = false;
            record.feeDisabled = false;
            records.push(record)
        }
       

        if(records.length==0){
            const record = {} as bookingAdmCancellationInfoType
            record.cancellationFee = "0.00"
            this.slicedRecords.push([record]) 
            return
        }
        records = _.sortBy(records,'date')

        let cancelIndex = 0;

        if(totalAdmRecords<4){// page=1
            cancelIndex = (4-totalAdmRecords)            
        }else{ //page!=1 {record:n, cancel:m, m_n ==6}
            const recordsOnLastPage = (totalAdmRecords-4)%5            
            cancelIndex = (recordsOnLastPage==0)? 8 :(6-recordsOnLastPage)            
        }
        
        this.slicedRecords.push(records.slice(0,cancelIndex))

        // page !=1 cancel ==8
        for(let index=cancelIndex; index<records.length; index+=8)
            this.slicedRecords.push(records.slice(index,(index+8)))
      
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
