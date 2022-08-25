<template>
    <div class="mt-2">
         
        <table style="line-height:1.2rem; font-size:8pt;" class="print-block flexsize border border-dark m-0 p-0">
            <tr style="line-height:1.75rem; background:#888; color:#FFF;" class="m-0 p-0">
                <td class="m-0 p-0" colspan="50"><div style="font-size:12pt;" class="ml-1 font-weight-bold">Office Use Only</div></td>                        
            </tr> 
            <tr style="background:#888; height:0.05rem; line-height:0.05rem;">                    
                <td v-for="inx in Array(50)" :key="inx" class="" style="width:2%;" />                    
            </tr>

<!-- <Line 1> -->
            <tr>                    
                <td colspan="9"  style="background:#F4F1FF;" class="border-top border-right text-right">Supplier Name</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top border-right"><div class="answer-record"> </div></td>
                <td colspan="9"  style="background:#F4F1FF;" class="border-top border-right text-right">Supplier # -Site #</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top"><div class="answer-record"></div></td>                                                                                        
            </tr>

<!-- <Line 2> -->
            <tr>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Invoice Date</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top border-right"></td>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Address Verified</td>
                <td colspan="1" class="border-top"><div class="radio-circle"><div class="radio-circle-fill bg-dark"/></div></td>
                <td colspan="1" class="border-top">Y</td>
                <td colspan="1" class="border-top"><div class="radio-circle"><div class="radio-circle-fill"/></div></td>
                <td colspan="1" class="border-top border-right">N</td>
                <td colspan="12" class="border-top"><div class="answer-record"></div></td>
            </tr>

<!-- <Line 3> -->
            <tr>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Invoice Number</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top border-right"><div class="answer-record"></div></td>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Expense Authority Name</td>
                <td colspan="16" class="border-top"><div class="answer-record"></div></td>
            </tr>

<!-- <Line 4> -->
            <tr style="line-height:0.85rem;">
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Qualified Receiver Name<div style="font-size:6pt;">( must match Approver Name)</div></td>
                <td colspan="16" class="border-top border-right"><div class="answer-record"></div></td>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Invoice Total Amount</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top"><div class="answer-record"></div></td>
            </tr>
            
<!-- <Line 5> -->
            <tr> 
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Contract Number</td>
                <td colspan="16" class="border-top border-right"><div class="answer-record"></div></td>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Pay Stub Comment</td>
                <td colspan="16" class="border-top"><div class="answer-record"></div></td>
            </tr>

<!-- <Line 6 -Titles> -->
            <tr style="line-height:1.5rem; background:#D9D1F1;">
                <td colspan="5" class="border-top border-right text-center">Sub-Total</td>
                <td colspan="4" class="border-top border-right text-center">GST</td>
                <td colspan="4" class="border-top border-right text-center">PST</td>
                <td colspan="4" class="border-top border-right text-center">CL</td>
                <td colspan="4" class="border-top border-right text-center">RESP</td>
                <td colspan="4" class="border-top border-right text-center">SL</td>
                <td colspan="4" class="border-top border-right text-center">STOB</td>
                <td colspan="5" class="border-top border-right text-center">PROJECT</td>
                <td colspan="16" class="border-top text-center">COMMENTS</td>
            </tr>

<!-- <Line 7 -Fees> -->
            <tr style="background:#EFEFEF;">
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="4" class="border-top border-right text-left"><div class="answer-record">0.00</div></td>
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="3" class="border-top border-right text-left"><div class="answer-record">0.00</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">N/A</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="5" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="16" class="border-top text-center"><div class="answer-record"></div></td>
            </tr>

<!-- <Line 8 -Expenses> -->
            <tr style="background:#EFEFEF;">
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="4" class="border-top border-right text-left"><div class="answer-record">0.00</div></td>
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="3" class="border-top border-right text-left"><div class="answer-record">0.00</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">N/A</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="5" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="16" class="border-top text-center"><div class="answer-record"></div></td>
            </tr> 

<!-- <Line 9 -Additional Instructions> -->
            <tr style="line-height:2.5rem; background:#F9F9F9;">
                <td colspan="9" class="border-top border-right text-center">Additional Instructions:</td>
                <td colspan="41" class="border-top text-center"></td>
            </tr>                               
                                                            
        </table>
    </div>  
  
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class OfficeUseOnly extends Vue {

    // @Prop({required: true})
    // booking!: bookingSearchResultInfoType;
    // update = 0

   

    mounted(){        
       //
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
