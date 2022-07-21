<template>
    <div>
                        
        <table class="flexsize mt-1 p-0">
            <tr>
                <td />
                <td v-for="inx in Array(50)" :key="inx" class="" style="width:2%;">                               
                <td/>                         
            </tr>

<!-- <Expenses> -->            
            <tr>
                <th/>
                <td colspan="38" class=""><b style="font-size:11pt;">Expenses</b> (receipts attached)</td>
                <th colspan="2"  class=""></th>
                <th colspan="2"  class=""></th>
                <th colspan="8"  class=""></th>                                                                 
                <th />
            </tr>

<!-- <Travel KM> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <td colspan="5" class="text-center">Rate</td>                
                <td colspan="7" class="text-center">Total Kilometers</td>
                <td colspan="1" class=""></td>                        
                <td colspan="5" class="text-center">Sutotal</td>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class="text-center">Expenses Payable</td>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Travel Kilometers</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.0</div></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left text-right">$</th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th/>                        
            </tr>

<!-- <Breakfast> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <td colspan="5" class="text-center">Rate</td>
                <th colspan="1" class=""></th>
                <td colspan="5" class="text-center">Total Days</td>
                <td colspan="2" class=""></td>                        
                <td colspan="5" class="text-center">Sutotal</td>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <th colspan="8" class="text-center"></th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Breakfast</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class="text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.0</div></td>                        
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=""></th>                
                <td colspan="4" class=""></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Lunch> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <td colspan="5" class="text-center">Rate</td>
                <th colspan="1" class=""></th>
                <td colspan="5" class="text-center">Total Days</td>
                <td colspan="2" class=""></td>                        
                <td colspan="5" class="text-center">Sutotal</td>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class="text-center">GST (if applicable)</td>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Lunch</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.0</div></td>                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>                
                <th colspan="1" class=""></th>
                <td colspan="4" class=""></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left text-right">$</th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">0.00</div></td> 
                <th/>                       
            </tr>

<!-- <Dinner> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <td colspan="5" class="text-center">Rate</td>
                <th colspan="1" class=""></th>
                <td colspan="5" class="text-center">Total Days</td>
                <td colspan="2" class=""></td>                        
                <td colspan="5" class="text-center">Sutotal</td>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <th colspan="8" class="text-center"></th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Dinner</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class="text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.0</div></td>                        
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=""></th>                
                <td colspan="4" class=""></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Lodging> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <td colspan="5" class="text-center">Rate</td>
                <th colspan="1" class=""></th>
                <td colspan="5" class="text-center">Total Days</td>
                <td colspan="2" class=""></td>                        
                <td colspan="5" class="text-center">Sutotal</td>
                <th colspan="1" class=""></th>
                <td colspan="4" class="text-center">GST</td>                                                 
                <th colspan="2" class=""></th>                        
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class="text-center">Total Expenses</td>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Lodging</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class="text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">1</div></td>                        
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class="text-center">+</th>                
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left text-right">$</th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">0.00</div></td> 
                <th/>                       
            </tr>

<!-- <Airfare/Ferry> -->
            <tr style="line-height:1.6rem;">
                <th/>          
                <td colspan="21" class=""></td>                        
                <td colspan="5" class="text-center">Sutotal</td>                                                 
                <th colspan="1" class=""></th> 
                <td colspan="4" class="text-center">GST</td>
                <th colspan="2" class=""></th>      
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <th colspan="8" class="text-center"></th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Airfare/Ferry</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="11" class="border-bottom"><div class="answer-payment">0.00</div></td>                       
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class="text-center">+</th>                        
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">0.00</div></td> 
                <td colspan="1" class=""></td>
                <th colspan="2" class="border-left -dark"></th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Miscellaneous> -->
            <tr style="line-height:1.6rem;">
                <th/>          
                <td colspan="21" class=""></td>                        
                <td colspan="5" class="text-center">Sutotal</td>                                                 
                <th colspan="1" class=""></th> 
                <td colspan="4" class="text-center">GST</td>
                <th colspan="2" class=""></th>      
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <th colspan="8" class="text-center">Total Payable</th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Miscellaneous</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="11" class="border-bottom"><div class="answer-payment">0.00</div></td>                       
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="1" class="text-center">+</th>                        
                <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">0.00</div></td> 
                <td colspan="1" class=""></td>
                <th colspan="2" class="border-left text-right">$</th> 
                <th colspan="8" class="border-bottom"><div class="answer-payment">0.00</div></th> 
                <th/>                       
            </tr>
            <tr>
                <th/>
                <td colspan="40" class=""></td>
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class=""></td> 
                <th/>
            </tr>

<!-- <Expenses Pre-GST> -->
                    <tr>
                        <th/>                        
                        <th colspan="20" class=""></th>                        
                        <td colspan="7" class="text-center">Expenses Pre-GST</td>                        
                        <td colspan="4" class="text-center">Total GST</td>
                        <th colspan="2" class=""></th>      
                        <td colspan="6" class="text-center">Total Expenses</td>
                        <th colspan="1" class=""></th>
                        <th colspan="2" class=""></th> 
                        <th colspan="8" class=""></th>
                        <th/>                        
                    </tr>
                    <tr>
                        <th/>
                        <th colspan="14" class=""></th>                        
                        <th colspan="6" class="text-right">Checks Totals</th> 
                        <td colspan="1" class=""></td>                         
                        <td colspan="5" class="border-bottom"><div class="answer-payment">0.00</div></td>
                        <th colspan="1" class="text-center">+</th>                        
                        <td colspan="4" class="border-bottom"><div class="answer-payment">0.00</div></td>
                        <th colspan="2" class=""></th>
                        <td colspan="6" class="border-bottom"><div class="answer-payment">0.00</div></td> 
                        <td colspan="1" class=""></td> 
                        <th colspan="2" class=""></th> 
                        <td colspan="8" class=""></td>
                        <th/>                       
                    </tr>
<!-- <spacer> -->
                    <tr><td class="text-white">.</td></tr>         
<!-- <Total paid by> -->
                    <tr style="line-height:1.6rem;">
                        <th/>
                        <td colspan="29" class=""></td>                        
                        <td colspan="11" class=" text-right"><b>Total paid by</b> Court Services</td>
                        <th colspan="2" class=" text-right"><div class="float-right">$</div></th> 
                        <th colspan="8" class="border-bottom"><div class="answer-payment">0.00</div></th>
                        <th/>                          
                    </tr>

                    <tr style="line-height:1.6rem;">
                        <th/>
                        <td colspan="17" class=""></td>
                        <td colspan="10" class=" text-right">Sent to Federal Crown</td>
                        <td colspan="2" class=""></td>
                        <td colspan="11" class=" text-right"><b>Total paid by</b> Federal Crown</td>
                        <th colspan="2" class=" text-right"><div class="float-right">$</div></th> 
                        <th colspan="8" class="border-bottom"><div class="answer-payment">0.00</div></th>
                        <th/>                          
                    </tr>
<!-- <spacer> -->
                    <tr><td class="text-white">.</td></tr>

<!-- <spacer> -->
            <!-- <tr><td class="text-white">.</td></tr>

            <div class="answer-payment"></div> -->                      
               
                    
                          
        </table>
                
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class PaymentExpenses extends Vue {

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
