<template>
    <div class="mt-2">
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
                        <td style="width:15%;"><b class="ml-1">Date: </b><div class="answer-record">2022-04-26</div></td>                                        
                        <td style="width:20%;"><b>Time: </b><div class="answer-record">09:30 AM - 04:00 PM</div></td>                    
                        <td style="width:15%;"><b>File #: </b><div class="answer-record">CS20001203</div></td>
                        <td style="width:10%;"><b>Federal: </b><div class="answer-record">Yes</div></td>
                        <td style="width:40%;"><b>Registry: </b><div class="answer-record">{{'100 Mile House Law Courts'|truncate-text(25)}}</div></td>
                        <td />
                    </tr>
                    <tr>
                        <td />
                        <td colspan="2"><b class="ml-1">Case Name: </b><div class="answer-record">Old case VS New case</div></td>
                        <td colspan="2"><b>Cancellation Date: </b><div class="answer-record">2022-05-10</div></td>
                        <td><b>Cancellation Time: </b><div class="answer-record">10:16 AM</div></td>                    
                        <td />
                    </tr>
                    <tr>
                        <td />
                        <td colspan="2"><b class="ml-1">Cancellation Reason: </b><div class="answer-record">Other Appointments</div></td>
                        <td colspan="2"><b>Cancelled By: </b><div class="answer-record">Interpreter</div></td>
                        <td><b>Cancellation Fee Applicable: </b><div class="answer-record">1000</div> $</td>                    
                        <td />
                    </tr>           
                    <tr>
                        <td />
                        <td><b class="ml-1">ReasonCd: </b><div class="answer-record">Other</div></td>
                        <td colspan="4"><b>Comment: </b><div class="answer-record-sm">Some comment here</div> </td>
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


@Component
export default class CancellationInfo extends Vue {

    // @Prop({required: true})
    // booking!: bookingSearchInfoType;
    // update = 0

    mounted(){        
       //
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
