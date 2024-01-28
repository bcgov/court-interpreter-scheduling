<template>
    <div v-if="dataReady" class="mt-2">
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
                <td colspan="16" style="background:#EFEFEF;" class="border-top border-right"><div class="answer-record ml-1">{{interpreterName}}</div></td>
                <td colspan="9"  style="background:#F4F1FF;" class="border-top border-right text-right">Supplier # -Site #</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top"><div class="answer-record ml-1">{{supplierNo}} - {{siteNo}}</div></td>                                                                                        
            </tr>

<!-- <Line 2> -->
            <tr>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Invoice Date</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top border-right"><div class="answer-record ml-1">{{invoiceDate}}</div></td>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Address Verified</td>
                <td colspan="1" class="border-top"><div class="radio-circle"><div :class="(addressVerified=='Y'?'bg-dark':'')+' radio-circle-fill'"/></div></td>
                <td colspan="1" class="border-top">Y</td>
                <td colspan="1" class="border-top"><div class="radio-circle"><div :class="(addressVerified=='N'?'bg-dark':'')+' radio-circle-fill'"/></div></td>
                <td colspan="1" class="border-top border-right">N</td>
                <td colspan="12" class="border-top"><div class="answer-record">{{addressInstructions}}</div></td>
            </tr>

<!-- <Line 3> -->
            <tr>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Invoice Number</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top border-right"><div class="answer-record ml-1">{{invoiceNumber}}</div></td>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Expense Authority Name</td>
                <td colspan="16" class="border-top"><div class="answer-record ml-1">{{expenseAuthorityName}}</div></td>
            </tr>

<!-- <Line 4> -->
            <tr style="line-height:0.85rem;">
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Qualified Receiver Name<div style="font-size:6pt;">( must match Approver Name)</div></td>
                <td colspan="16" class="border-top border-right"><div class="answer-record ml-1">{{qualifiedReceiverName}}</div></td>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Invoice Total Amount</td>
                <td colspan="16" style="background:#EFEFEF;" class="border-top"><div class="answer-record ml-1">{{invoiceTotalAmount}}</div></td>
            </tr>
            
<!-- <Line 5> -->
            <tr> 
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Contract Number</td>
                <td colspan="16" class="border-top border-right"><div class="answer-record ml-1">{{contractNumber}}</div></td>
                <td colspan="9" style="background:#F4F1FF;" class="border-top border-right text-right">Pay Stub Comment</td>
                <td colspan="16" class="border-top"><div class="answer-record ml-1">{{payStubComment}}</div></td>
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
                <td colspan="4" class="border-top border-right text-left"><div class="answer-record">{{subtotalFees}}</div></td>
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="3" class="border-top border-right text-left"><div class="answer-record">{{feesGST}}</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">N/A</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">105</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">{{resp0}}</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">10710</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">5542</div></td>
                <td colspan="5" class="border-top border-right text-center"><div class="answer-record">{{project0}}</div></td>
                <td colspan="16" class="border-top text-center"><div class="answer-record"></div></td>
            </tr>

<!-- <Line 8 -Expenses> -->
            <tr style="background:#EFEFEF;">
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="4" class="border-top border-right text-left"><div class="answer-record">{{subtotalExpenses}}</div></td>
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="3" class="border-top border-right text-left"><div class="answer-record">{{expensesGST}}</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">N/A</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">{{resp1}}</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record"></div></td>
                <td colspan="5" class="border-top border-right text-center"><div class="answer-record">{{project1}}</div></td>
                <td colspan="16" class="border-top text-center"><div class="answer-record"></div></td>
            </tr> 

<!-- <Line 9 -Cancellation> -->
            <tr style="background:#EFEFEF;">
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="4" class="border-top border-right text-left"><div class="answer-record">{{subtotalCancellation}}</div></td>
                <td colspan="1" class="border-top text-right">$</td>
                <td colspan="3" class="border-top border-right text-left"><div class="answer-record">{{cancellationGST}}</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">N/A</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">105</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">{{resp2}}</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">10710</div></td>
                <td colspan="4" class="border-top border-right text-center"><div class="answer-record">5542</div></td>
                <td colspan="5" class="border-top border-right text-center"><div class="answer-record">{{project2}}</div></td>
                <td colspan="16" class="border-top text-center"><div class="answer-record"></div></td>
            </tr> 

<!-- <Line 10 -Additional Instructions> -->
            <tr style="line-height:2.5rem; background:#F9F9F9;">
                <td colspan="9" class="border-top border-right text-center">Additional Instructions:</td>
                <td colspan="41" class="border-top text-left"><div class="answer-record ml-1">{{additionalInstructions}}</div></td>
            </tr>                               
                                                            
        </table>
    </div>  
  
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { bookingSearchResultInfoType } from '@/types/Bookings/json';

@Component
export default class OfficeUseOnly extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;

    dataReady = false;
    interpreterName = ''
    supplierNo = ''
    siteNo = ''
    qualifiedReceiverName=''

    invoiceDate =''
    addressVerified=''
    addressInstructions=''
    invoiceNumber=''
    expenseAuthorityName=''
    contractNumber=''
    payStubComment=''
    additionalInstructions=''

    invoiceTotalAmount=''
    subtotalFees='0.00'
    feesGST='0.00'
    subtotalExpenses='0.00'
    expensesGST='0.00'
    subtotalCancellation='0.00'
    cancellationGST='0.00'

    resp0=''
    resp1=''
    resp2=''
    project0=''
    project1=''
    project2=''

    officeUseChanges = false;

    mounted(){        
        this.dataReady = false;
        this.officeUseChanges = false;
        this.extractInfo()
        this.dataReady = true;
    }

    public extractInfo(){
        const recordApproved = this.booking.recordsApproved
        this.interpreterName = this.booking.interpreter.fullName
        this.qualifiedReceiverName = this.booking.approverName
        this.supplierNo = this.booking.interpreter.supplier
        this.siteNo = this.booking.interpreter.siteCode

        this.invoiceDate = this.booking.invoiceDate
        this.invoiceNumber = this.booking.invoiceNumber

        this.subtotalFees = recordApproved? (this.booking.feesTotal-this.booking.feesGST).toFixed(2): '0.00';
        this.feesGST = recordApproved && this.booking.feesGST? this.booking.feesGST.toFixed(2): '0.00';

        this.subtotalExpenses = recordApproved? (this.booking.expenseTotal - this.booking.expenseGST).toFixed(2): '0.00';
        this.expensesGST = recordApproved && this.booking.expenseGST? this.booking.expenseGST.toFixed(2): '0.00';

        this.subtotalCancellation = recordApproved? (this.booking?.admDetail?.calculations?.cancellation?.subtotalFees?.toFixed(2)?? '0.00'):'0.00'
        this.cancellationGST = recordApproved? (this.booking?.admDetail?.calculations?.cancellation?.totalGst?.toFixed(2)?? '0.00'):'0.00'

        this.invoiceTotalAmount = recordApproved && this.booking.invoiceTotal? ('$ '+this.booking.invoiceTotal): '$ 0.00'

        this.addressVerified = this.booking?.admDetail?.officeUse?.addressVerified;
        this.addressInstructions = this.booking?.admDetail?.officeUse?.addressInstructions    
        this.expenseAuthorityName = this.booking?.admDetail?.officeUse?.expenseAuthorityName 
        this.contractNumber = this.booking?.admDetail?.officeUse?.contractNumber 
        this.payStubComment = this.booking?.admDetail?.officeUse?.payStubComment 
        this.additionalInstructions = this.booking?.admDetail?.officeUse?.additionalInstructions

        this.resp0 = this.booking?.admDetail?.officeUse?.resp0
        this.resp1 = this.booking?.admDetail?.officeUse?.resp1
        this.resp2 = this.booking?.admDetail?.officeUse?.resp2
        this.project0 = this.booking?.admDetail?.officeUse?.project0? this.booking.admDetail.officeUse.project0:'1500000'
        this.project1 = this.booking?.admDetail?.officeUse?.project1? this.booking.admDetail.officeUse.project1:'1500000'
        this.project2 = this.booking?.admDetail?.officeUse?.project2? this.booking.admDetail.officeUse.project2:'1500144'

    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
