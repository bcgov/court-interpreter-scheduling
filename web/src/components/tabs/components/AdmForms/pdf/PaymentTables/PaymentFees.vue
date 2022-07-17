<template>
    <div>
                        
        <table class="flexsize mt-1 p-0">
            <tr style="color:rgb(182, 210, 221)">
                <td />
                <td v-for="inx in Array(25)" :key="inx" class="border" style="width:4%;">                               
                <td/>                         
            </tr>
            <tr>
                <th/>
                <th colspan="4" style="font-size:11pt;" class="border">Fees</th>
                <th colspan="1" class="border"></th>
                <th colspan="4" class="border text-center">Rate</th>
                <th colspan="1" class="border "></th>
                <th colspan="4" class="border text-center">Total Hours</th>
                <th colspan="1" class="border "></th>
                <th colspan="3" class="border "></th>
                <th colspan="2" class="border "></th>
                <th colspan="1" class="border "></th>
                <th colspan="4" class="border text-center">Fees Payable</th>                                                 
                <th />
            </tr>

<!-- <Court Hours> -->
            <tr>
                <th/>
                <th colspan="4" class="border">Court Hours (Level 1)</th>
                <th colspan="1" class="border text-right">$</th>
                <td colspan="4" class="border"><div class="answer-payment">100.0</div></td>
                <th colspan="1" class="border text-center">x</th>
                <td colspan="4" class="border"><div class="answer-payment">20.0</div></td>
                <th colspan="1" class="border text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="3" class="border"><div class="answer-payment">2000.00</div></td>
                <th colspan="2" class="border"></th>
                <th colspan="1" class="border text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="4" class="border"><div class="answer-payment">2000.00</div></td>                          
                <th/>
            </tr>
<!-- <spacer> -->
            <tr><td class="text-white">.</td></tr>


<!-- <Travel Hours> -->
            <tr>
                <th/>
                <th colspan="4" style="font-size:11pt;" class="border"></th>
                <th colspan="1" class="border"></th>
                <th colspan="4" class="border text-center">Rate</th>
                <th colspan="1" class="border "></th>
                <th colspan="4" class="border text-center">Total Hours</th>
                <th colspan="1" class="border "></th>
                <th colspan="3" class="border "></th>
                <th colspan="2" class="border "></th>
                <th colspan="1" class="border "></th>
                <th colspan="4" class="border text-center"></th>                                                 
                <th />
            </tr>
            <tr>
                <th/>
                <th colspan="4" class="border">Travel Hours</th>
                <th colspan="1" class="border text-right">$</th>
                <td colspan="4" class="border"></td>
                <th colspan="1" class="border text-center">x</th>
                <td colspan="4" class="border"></td>
                <th colspan="1" class="border text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="3" class="border"></td>
                <th colspan="2" class="border"></th>
                <th colspan="1" class="border text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="4" class="border"></td>                          
                <th/>
            </tr>

<!-- <Subtotal> -->
            <tr>
                <th/>
                <th colspan="15" class="border"></th>                        
                <th colspan="4" class="border text-right">Subtotal</th>
                <th colspan="1" class="border"></th>
                <th colspan="1" class="border text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="4" class="border"><div class="answer-payment"></div></td>                          
                <th/>
            </tr>

<!-- <GST> -->
            <b-tr>
                <th/>
                <th colspan="4" class="border"></th>                        
                <th colspan="5" class="border text-right">GST Number:</th>
                <td colspan="7" class="border"><div class="answer-payment"></div></td>
                <th colspan="2" class="border text-center">{{'5'}} % (rate)</th>
                <th colspan="1" class="border text-right">GST</th>
                <th colspan="1" class="border"></th>
                <th colspan="1" class="border text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <th colspan="4" class="border"></th>
                <th/>                         
            </b-tr>

<!-- <Total> -->
            <b-tr>
                <th/>
                <th colspan="18" class="border"></th>                        
                <th colspan="1" class="border text-right">Total</th>
                <th colspan="1" class="border"></th>
                <th colspan="1" class="border text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <th colspan="4" class="border"></th>
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
