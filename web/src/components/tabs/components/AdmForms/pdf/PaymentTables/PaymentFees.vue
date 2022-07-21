<template>
    <div>
                        
        <table class="flexsize mt-1 p-0">
            <tr>
                <td />
                <td v-for="inx in Array(25)" :key="inx" class="" style="width:4%;">                               
                <td/>                         
            </tr>
            <tr>
                <th/>
                <th colspan="4" style="font-size:11pt;" class="">Fees</th>
                <th colspan="1" class=""></th>
                <td colspan="4" class="text-center">Rate</td>
                <th colspan="1" class=""></th>
                <td colspan="4" class="text-center">Total Hours</td>
                <th colspan="1" class=""></th>
                <th colspan="3" class=""></th>
                <th colspan="2" class=""></th>
                <th colspan="1" class=""></th>
                <th colspan="4" class="text-center">Fees Payable</th>                                                 
                <th />
            </tr>

<!-- <Court Hours> -->
            <tr>
                <th/>
                <th colspan="4" class="">Court Hours (Level 1)</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class="text-center">x</th>
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.0</div></td>
                <th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="3" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="2" class=""></th>
                <th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>                          
                <th/>
            </tr>
<!-- <spacer> -->
            <tr><td class="text-white">.</td></tr>


<!-- <Travel Hours> -->
            <tr>
                <th/>
                <th colspan="4" style="font-size:11pt;" class=""></th>
                <th colspan="1" class=""></th>
                <td colspan="4" class="text-center">Rate</td>
                <th colspan="1" class=""></th>
                <td colspan="4" class="text-center">Total Hours</td>
                <th colspan="1" class=""></th>
                <th colspan="3" class=""></th>
                <th colspan="2" class=""></th>
                <th colspan="1" class=""></th>
                <th colspan="4" class="text-center"></th>                                                 
                <th />
            </tr>
            <tr>
                <th/>
                <th colspan="4" class="">Travel Hours</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class="text-center">x</th>
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.0</div></td>
                <th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="3" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="2" class=""></th>
                <th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>                          
                <th/>
            </tr>
<!-- <spacer> -->
                <tr><td class="text-white">.</td></tr>
<!-- <Subtotal> -->
            <tr>
                <th/>
                <th colspan="15" class=""></th>                        
                <th colspan="4" class="text-right">Subtotal</th>
                <th colspan="1" class=""></th>
                <th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>                          
                <th/>
            </tr>
<!-- <spacer small> -->
            <tr style="height:0.5rem; line-height:0.1rem;"><td class="text-white">.</td></tr>
<!-- <GST> -->
            <b-tr>
                <th/>
                <th colspan="4" class=""></th>                        
                <th colspan="5" class="text-right">GST Number :</th>
                <td colspan="6" class="border-bottom"><div class="answer-payment">0123456 - 001</div></td>
                <th colspan="3" class="text-center">{{'5'}} % (rate)</th>
                <th colspan="1" class="text-right">GST</th>
                <th colspan="1" class=""></th>
                <th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th/>                         
            </b-tr>
<!-- <spacer small> -->
            <tr style="height:0.5rem; line-height:0.1rem;"><td class="text-white">.</td></tr>
<!-- <Total> -->
            <b-tr>
                <th/>
                <th colspan="18" class=""></th>                        
                <th colspan="1" class="text-right">Total</th>
                <th colspan="1" class=""></th>
                <th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <th colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></th>
                <th/>                          
            </b-tr>                            
                          
        </table>
                
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class PaymentFees extends Vue {

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
