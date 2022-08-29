<template>
    <div :name="section_name" v-if="dataReady">
        <b-card class="my-5">
            <b-row class="mx-0 mt-n2 p-0">
                <h3 class="text-dark p-0 my-2 mr-n5">Office Use Only</h3>
                <b-button size="sm"             
                    v-if="officeUseChanges"
                    @click="saveOfficeUseChanges()"                                 
                    variant="success" 
                    style="margin:0rem auto; width:16rem; font-size:14pt;"> Save Office Use Only Info 
                </b-button>
            </b-row>
            <b-table-simple class="bg-white" borderless>
                <b-thead>
                    <b-tr  style="background:rgb(182, 210, 221);">
                        <b-td v-for="inx in Array(50)" :key="inx" class="" style="width:2%;" />                                               
                    </b-tr>
                </b-thead>                               
                <b-tbody>
                    <b-tr>
                        <b-th colspan="9" class="border">Supplier Name</b-th>
                        <b-td colspan="16" class="border">{{interpreterName}}</b-td>
                        <b-th colspan="9" class="border">Supplier No - Site No</b-th>
                        <b-td colspan="16" class="border">{{supplierNo}} - {{siteNo}}</b-td>                                    
                    </b-tr>

                    <b-tr>
                        <b-th colspan="9" class="border">Invoice Date</b-th>
                        <b-td colspan="16" class="p-1 border"><b-input type="date" v-model="invoiceDate" @input="officeUseChanges=true;" /></b-td>
                        <b-th colspan="9" class="border">Address Verified</b-th>
                        <b-td colspan="5" class="p-1 border">
                            <b-form-radio-group class="m-2 p-0" :options="['Y','N']" v-model="addressVerified" @change="officeUseChanges=true;"> 
                            </b-form-radio-group>
                        </b-td>                         
                        <b-td colspan="11" class="p-1 border"><b-input v-model="addressInstructions" @input="officeUseChanges=true;"/></b-td>                                
                    </b-tr>

                    <b-tr>
                        <b-th colspan="9" class="border">Invoice Number</b-th>
                        <b-td colspan="16" class="p-1 border"><b-input disabled v-model="invoiceNumber" @input="officeUseChanges=true;"/></b-td>
                        <b-th colspan="9" class="border">Expense Authority Name</b-th>
                        <b-td colspan="16" class="p-1 border"><b-input v-model="expenseAuthorityName" @input="officeUseChanges=true;"/></b-td>                                    
                    </b-tr>

                    <b-tr>
                        <b-th colspan="9" class="border">Qualified Receiver Name</b-th>
                        <b-td colspan="16" class="border">{{qualifiedReceiverName}}</b-td>
                        <b-th colspan="9" class="border">Invoice Total Amount</b-th>
                        <b-td colspan="16" class="border">{{invoiceTotalAmount}}</b-td>                                    
                    </b-tr>

                    <b-tr>
                        <b-th colspan="9" class="border">Contract Number</b-th>
                        <b-td colspan="16" class="p-1 border"><b-input v-model="contractNumber" @input="officeUseChanges=true;"/></b-td>
                        <b-th colspan="9" class="border">Pay Stub Comment</b-th>
                        <b-td colspan="16" class="p-1 border"><b-input v-model="payStubComment" @input="officeUseChanges=true;"/></b-td>                                    
                    </b-tr>

                    <b-tr style="background:#E1E3FF">
                        <b-th colspan="5" class="text-center border">Sub Total</b-th>                        
                        <b-th colspan="4" class="text-center border">GST</b-th>
                        <b-th colspan="4" class="text-center border">PST</b-th>
                        <b-th colspan="4" class="text-center border">CL</b-th>
                        <b-th colspan="4" class="text-center border">RESP</b-th>
                        <b-th colspan="4" class="text-center border">SL</b-th>
                        <b-th colspan="4" class="text-center border">STOB</b-th>
                        <b-th colspan="5" class="text-center border">PROJECT</b-th>
                        <b-th colspan="16" class="text-center border">COMMENTS</b-th>
                    </b-tr>
                    <!-- <b-tr>
                        <b-th colspan="1" class="border">Court File No</b-th>
                        <b-th colspan="2" class="border"></b-th>
                    </b-tr> -->

                    <b-tr>
                        <b-td colspan="5" class="text-center border">$ {{subtotalFees}}</b-td>                        
                        <b-td colspan="4" class="text-center border">$ {{feesGST}}</b-td>
                        <b-td colspan="4" class="text-center border">N/A</b-td>
                        <b-td colspan="4" class="text-center border">105</b-td>
                        <b-td colspan="4" class="text-center border">15160</b-td>
                        <b-td colspan="4" class="text-center border">10710</b-td>
                        <b-td colspan="4" class="text-center border">5542</b-td>
                        <b-td colspan="5" class="text-center border">1500000</b-td>                        
                        <b-td colspan="16" class="text-center border"></b-td>
                    </b-tr>

                    <b-tr>
                        <b-td colspan="5" class="text-center border">$ {{subtotalExpenses}}</b-td>                        
                        <b-td colspan="4" class="text-center border">$ {{expensesGST}}</b-td>
                        <b-td colspan="4" class="text-center border">N/A</b-td>
                        <b-td colspan="4" class="text-center border"></b-td>
                        <b-td colspan="4" class="text-center border"></b-td>
                        <b-td colspan="4" class="text-center border"></b-td>
                        <b-td colspan="4" class="text-center border"></b-td>                        
                        <b-td colspan="5" class="text-center border">1500000</b-td>
                        <b-td colspan="16" class="text-center border"></b-td>
                    </b-tr>

                    <b-tr>
                        <b-th colspan="9" class="text-center border">Additional Instructions:</b-th>
                        <b-td colspan="41" class="p-1 border"><b-input v-model="additionalInstructions" @input="officeUseChanges=true;"/></b-td>
                    </b-tr>



                
                </b-tbody>
            </b-table-simple>
        </b-card>
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';

import { bookingSearchResultInfoType, officeUseOnlyVars } from '@/types/Bookings/json';



@Component
export default class AdmOfficeUseOnly extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
 
    section_name="adm-office-use"
 
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

    officeUseChanges = false;
                

    mounted(){
        this.dataReady = false;
        this.officeUseChanges = false;
        this.extractInfo()
        this.dataReady = true;
    }

    public extractInfo(){
        this.interpreterName = this.booking.interpreter.fullName
        this.qualifiedReceiverName = this.booking.approverName
        this.supplierNo = this.booking.interpreter.supplier
        this.siteNo = this.booking.interpreter.siteCode

        this.invoiceDate = this.booking.invoiceDate
        this.invoiceNumber = this.booking.invoiceNumber

        this.subtotalFees = (this.booking.feesTotal-this.booking.feesGST).toFixed(2);
        this.feesGST = this.booking.feesGST? this.booking.feesGST.toFixed(2): '0.00';

        this.subtotalExpenses = (this.booking.expenseTotal - this.booking.expenseGST).toFixed(2);
        this.expensesGST = this.booking.expenseGST? this.booking.expenseGST.toFixed(2): '0.00';

        this.invoiceTotalAmount = this.booking.invoiceTotal? (this.booking.invoiceTotal + ' $'): '0.00 $'

        this.addressVerified = this.booking?.admDetail?.officeUse?.addressVerified;
        this.addressInstructions = this.booking?.admDetail?.officeUse?.addressInstructions    
        this.expenseAuthorityName = this.booking?.admDetail?.officeUse?.expenseAuthorityName 
        this.contractNumber = this.booking?.admDetail?.officeUse?.contractNumber 
        this.payStubComment = this.booking?.admDetail?.officeUse?.payStubComment 
        this.additionalInstructions = this.booking?.admDetail?.officeUse?.additionalInstructions
    }

    public saveOfficeUseChanges(){
        const officeUse = {} as  officeUseOnlyVars;
        officeUse.addressVerified = this.addressVerified;
        officeUse.addressInstructions = this.addressInstructions    
        officeUse.expenseAuthorityName = this.expenseAuthorityName
        officeUse.contractNumber = this.contractNumber
        officeUse.payStubComment = this.payStubComment
        officeUse.additionalInstructions = this.additionalInstructions

        const admDetail = this.booking.admDetail? JSON.parse(JSON.stringify(this.booking.admDetail)) :{}
        admDetail.officeUse = officeUse

        this.officeUseChanges=false;
        const officeUseChanges =[
            {name:'admDetail', value:admDetail},
            {name:'invoiceDate', value:this.invoiceDate},
            {name:'invoiceNumber', value:this.invoiceNumber}           
        ]
        this.$emit('saveOfficeUse',officeUseChanges, this.section_name)
    }

}
</script>

<style scoped lang="scss">
    .card{
        background: rgb(182, 210, 221);
        box-shadow: 2px 5px 5px 2px #DDD;
    }

    input{
        background: #f3f3f3;
        border:1px solid white;
        cursor: pointer;

    }

    .labels {
        font-size: 12px; font-weight:600; line-height: 0.025rem; color: rgb(50, 50, 50);
    }

</style>