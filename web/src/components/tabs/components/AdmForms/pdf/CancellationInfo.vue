<template>
    <div v-if="dataReady" class="mt-2">
        <div v-for="j,inx in [1]" :key="j" :class="inx>0? 'margintop0p5':''"> 
            <table style="font-size:7.5pt;" class="print-block flexsize border border-dark m-0 p-0">
                <tr style="font-size:12pt; " class="m-0 p-0">
                    <td class="m-0 p-0" colspan="6"><div  class="ml-1 font-weight-bold">4 Cancellation Information (Project Code 1500144)</div></td>                        
                </tr>
                <tbody v-for="i in [1]" :key="i">
                    
                    <tr class="spacer">
                        <td />
                        <td  colspan="5" style="border-top:1px solid #DDD; border-bottom:1px solid #DDD;" />
                        <td />
                    </tr>
                    <tr><td class="text-white">.</td></tr>
                    <tr >
                        <td />
                        <td style="width:15%;"><b class="ml-1">Date: </b><div class="answer-record">{{record.date}}</div></td>                                        
                        <td style="width:20%;"><b>Time: </b><div class="answer-record">{{record.time}}</div></td>                    
                        <td style="width:15%;"><b>File #: </b><div class="answer-record">{{record.file}}</div></td>
                        <td style="width:10%;"><b>Federal: </b><div class="answer-record">{{record.federalYN}}</div></td>
                        <td style="width:40%;"><b>Registry: </b><div class="answer-record">{{record.registry|truncate-text(25)}}</div></td>
                        <td />
                    </tr>
                    <tr>
                        <td />
                        <td colspan="2"><b class="ml-1">Case Name: </b><div class="answer-record">{{record.caseName}}</div></td>
                        <td colspan="2"><b>Cancellation Date: </b><div class="answer-record">{{record.cancellationDate}}</div></td>
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
                        <td><b class="ml-1">ReasonCd: </b><div class="answer-record">{{record.reasonCd}}</div></td>
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
import { bookingAdmCancellationInfoType } from '@/types/Bookings/json';


@Component
export default class CancellationInfo extends Vue {

    // @Prop({required: true})
    // booking!: bookingSearchResultInfoType;
    // update = 0

    record = {} as  bookingAdmCancellationInfoType

    dataReady = false

    mounted(){ 
        this.dataReady=false;       
        this.record.cancellationFee = '0'
        this.dataReady=true
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
