<template>
    <div v-if="dataReady">
                        
        <table class="flexsize mt-1 p-0">
            <tr>
                <td />
                <td v-for="inx in Array(50)" :key="inx" class="" style="width:2%;">                               
                <td/>                         
            </tr>
            <tr>
                <th/>
                <th colspan="13" style="font-size:11pt;" class="">Fees</th>
                <th colspan="1" class=""></th>
                <td colspan="7" class="text-center">Rate</td>
                <th colspan="2" class=""></th>
                <td colspan="6" class="text-center">Total Hours</td>
                <th colspan="2" class=""></th>
                <th colspan="7" class=""></th>
                <th colspan="2" class=""></th>
                <th colspan="2" class=""></th>
                <th colspan="8" class="text-center">Fees Payable</th>                                                 
                <th />
            </tr>

<!-- <Court Hours> -->
            <b-tbody v-for="lang,inx in languageItems" :key="'fees-'+inx">
                <tr v-if="form[courtFeeItems[1]+lang]">
                    <th/>
                    <th colspan="13" class="">Court Hours <span style="font-size:6pt;">({{getLanguageHrDetail(lang)}})</span></th>
                    <th colspan="1" class="text-right">$</th>
                    <td colspan="7" class="border-bottom"><div class="answer-payment">{{form[courtFeeItems[0]+lang]}}</div></td>
                    <th colspan="2" class="text-center">x</th>
                    <td colspan="6" class="border-bottom"><div class="answer-payment">{{form[courtFeeItems[1]+lang]}}</div></td>
                    <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                    <td colspan="7" class="border-bottom"><div class="answer-payment">{{form[courtFeeItems[2]+lang]}}</div></td>
                    <th colspan="2" class=""></th>
                    <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                    <td colspan="8" class="border-bottom"><div class="answer-payment">{{form[courtFeeItems[3]+lang]}}</div></td>                          
                    <th/>
                </tr>
                <b-tr v-if="form[courtFeeItems[1]+lang]" style="height:.3rem;line-height:.3rem;" ><b-td colspan="50" class="text-white">.</b-td></b-tr>
            </b-tbody>
            <b-tbody v-if="!form.includeCourtHrs">
                <tr>
                    <th/>
                    <th colspan="13" class="">Court Hours <span style="font-size:6pt;"></span></th>
                    <th colspan="1" class="text-right">$</th>
                    <td colspan="7" class="border-bottom"></td>
                    <th colspan="2" class="text-center">x</th>
                    <td colspan="6" class="border-bottom"></td>
                    <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                    <td colspan="7" class="border-bottom"></td>
                    <th colspan="2" class=""></th>
                    <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                    <td colspan="8" class="border-bottom"><div class="answer-payment">0.00</div></td>                          
                    <th/>
                </tr>
                <b-tr style="height:.3rem;line-height:.3rem;" ><b-td colspan="50" class="text-white">.</b-td></b-tr>
            </b-tbody>
<!-- <spacer> -->
            <b-tr style="height:.5rem;line-height:.5rem;" ><b-td colspan="50" class="text-white">.</b-td></b-tr>
                        

<!-- <Travel Hours> -->
            <tr>
                <th/>
                <th colspan="13" style="font-size:11pt;" class=""></th>
                <th colspan="1" class=""></th>
                <td colspan="7" class="text-center">Rate</td>
                <th colspan="2" class=""></th>
                <td colspan="6" class="text-center">Total Hours</td>
                <th colspan="2" class=""></th>
                <th colspan="7" class=""></th>
                <th colspan="2" class=""></th>
                <th colspan="2" class=""></th>
                <th colspan="8" class="text-center"></th>                                                 
                <th />
            </tr>
            <tr>
                <th/>
                <th colspan="13" class="">Travel Hours</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="7" class="border-bottom"><div class="answer-payment">{{form.travelHrRate}}</div></td>
                <th colspan="2" class="text-center">x</th>
                <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.travelTotalHrs}}</div></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="7" class="border-bottom"><div class="answer-payment">{{form.travelTotal}}</div></td>
                <th colspan="2" class=""></th>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">{{form.travelPayableFee}}</div></td>                          
                <th/>
            </tr>
<!-- <spacer> -->
                <tr><td class="text-white">.</td></tr>
<!-- <Subtotal> -->
            <tr>
                <th/>
                <th colspan="30" class=""></th>                        
                <th colspan="8" class="text-right">Subtotal</th>
                <th colspan="2" class=""></th>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">{{form.feesSubtotal}}</div></td>                          
                <th/>
            </tr>
<!-- <spacer small> -->
            <tr style="height:0.5rem; line-height:0.1rem;"><td class="text-white">.</td></tr>
<!-- <GST> -->
            <b-tr>
                <th/>
                <th colspan="8" class=""></th>                        
                <th colspan="10" class="text-right">GST Number :</th>
                <td colspan="12" class="border-bottom"><div class="answer-payment">{{form.gstNumber}}</div></td>
                <th colspan="6" class="text-center">{{'5'}} % (rate)</th>
                <th colspan="2" class="text-right">GST</th>
                <th colspan="2" class=""></th>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">{{form.feesGST}}</div></td>
                <th/>                         
            </b-tr>
<!-- <spacer small> -->
            <tr style="height:0.5rem; line-height:0.1rem;"><td class="text-white">.</td></tr>
<!-- <Total> -->
            <b-tr>
                <th/>
                <th colspan="36" class=""></th>                        
                <th colspan="2" class="text-right">Total</th>
                <th colspan="2" class=""></th>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <th colspan="8" class="border-bottom"><div class="answer-payment">{{form.feesTotal}}</div></th>
                <th/>                          
            </b-tr>                            
                          
        </table>
                
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { paymentDetailsInfoType } from '@/types/Bookings';
import { bookingSearchResultInfoType } from '@/types/Bookings/json';
import {languageItems, courtFeeItems} from '../../AdmCalculations/PaymentCalculation'

@Component
export default class PaymentFees extends Vue {
    
    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    
    @Prop({required: true})
    form!: paymentDetailsInfoType;

    dataReady = false;
    languageItems = []
    courtFeeItems = []

    mounted(){        
        this.dataReady = false;
        this.extractFormInfo()
        this.dataReady = true;    
    }

    public extractFormInfo(){
        this.languageItems = languageItems
        this.courtFeeItems = courtFeeItems               
    }

    public getLanguageHrDetail(lang){
        let detail=lang
        if(detail.includes('SPKL')){detail = detail.replace('SPKL','')}
        if(detail.includes('CART')){detail=detail+''}
        if(detail.includes('1')){detail=detail.replace('1','')+' Level 1'}
        if(detail.includes('2')){detail=detail.replace('2','')+' Level 2'}
        if(detail.includes('3')){detail=detail.replace('3','')+' Level 3'}
        if(detail.includes('4')){detail=detail.replace('4','')+' Level 4' }        
        if(detail.includes('Old')){detail = detail.replace('Old','') +' \'Previous Rate\' '}
        return detail
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
