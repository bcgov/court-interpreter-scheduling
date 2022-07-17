<template>
    <div>
                        
        <table class="flexsize mt-1 p-0">
            <tr style="color:rgb(182, 210, 221)">
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
                <th colspan="5" class=" text-center">Rate</th>                
                <th colspan="7" class=" text-center">Total Kilometers</th>
                <td colspan="1" class=""></td>                        
                <th colspan="5" class=" text-center">Sutotal</th>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <th colspan="6" class=" text-center">Total</th>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <th colspan="8" class=" text-center">Expenses Payable</th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Travel Kilometers</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">0.55</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">150.0</div></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">82.50</div></td>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">82.50</div></td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left text-right">$</th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">930.50</div></td>
                <th/>                        
            </tr>

<!-- <Breakfast> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <th colspan="5" class=" text-center">Rate</th>
                <th colspan="1" class=""></th>
                <th colspan="5" class=" text-center">Total Days</th>
                <td colspan="2" class=""></td>                        
                <th colspan="5" class=" text-center">Sutotal</th>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <th colspan="6" class=" text-center">Total</th>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <th colspan="8" class="text-center"></th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Breakfast</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">12.75</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">16.0</div></td>                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">204.00</div></td>
                <th colspan="1" class=""></th>                
                <td colspan="4" class=""></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">204.00</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Lunch> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <th colspan="5" class=" text-center">Rate</th>
                <th colspan="1" class=""></th>
                <th colspan="5" class=" text-center">Total Days</th>
                <td colspan="2" class=""></td>                        
                <th colspan="5" class=" text-center">Sutotal</th>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <th colspan="6" class=" text-center">Total</th>
                <th colspan="1" class=""></th>
                <th colspan="2" class="-left -dark"></th> 
                <th colspan="8" class=" text-center">GST (if applicable)</th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Lunch</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="5" class=""><div class="answer-payment">14.75</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class=""><div class="answer-payment">16.0</div></td>                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class=""><div class="answer-payment">236.00</div></td>                
                <th colspan="1" class=""></th>
                <td colspan="4" class=""></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class=""><div class="answer-payment">236.00</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="-left -dark text-right">$</th> 
                <td colspan="8" class=""><div class="answer-payment">0.00</div></td> 
                <th/>                       
            </tr>

<!-- <Dinner> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <th colspan="5" class=" text-center">Rate</th>
                <th colspan="1" class=""></th>
                <th colspan="5" class=" text-center">Total Days</th>
                <td colspan="2" class=""></td>                        
                <th colspan="5" class=" text-center">Sutotal</th>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <th colspan="6" class=" text-center">Total</th>
                <th colspan="1" class=""></th>
                <th colspan="2" class="-left -dark"></th> 
                <th colspan="8" class=" text-center"></th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Dinner</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="5" class=""><div class="answer-payment">25.50</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class=""><div class="answer-payment">16.0</div></td>                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class=""><div class="answer-payment">408.00</div></td>
                <th colspan="1" class=""></th>                
                <td colspan="4" class=""></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class=""><div class="answer-payment">408.00</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="-left -dark"></th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Lodging> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <th colspan="5" class=" text-center">Rate</th>
                <th colspan="1" class=""></th>
                <th colspan="5" class=" text-center">Total Days</th>
                <td colspan="2" class=""></td>                        
                <th colspan="5" class=" text-center">Sutotal</th>
                <th colspan="1" class=""></th>
                <th colspan="4" class=" text-center">GST</th>                                                 
                <th colspan="2" class=""></th>                        
                <th colspan="6" class=" text-center">Total</th>
                <th colspan="1" class=""></th>
                <th colspan="2" class="-left -dark"></th> 
                <th colspan="8" class=" text-center">Total Expenses</th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Lodging</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="5" class=""><div class="answer-payment">100.00</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class=""><div class="answer-payment">1</div></td>                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class=""><div class="answer-payment">100.00</div></td>
                <th colspan="1" class=" text-center">+</th>                
                <td colspan="4" class=""><div class="answer-payment">5.00</div></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class=""><div class="answer-payment">105.00</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="-left -dark text-right">$</th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Airfare/Ferry> -->
            <tr style="line-height:1.6rem;">
                <th/>          
                <td colspan="21" class=""></td>                        
                <th colspan="5" class=" text-center">Sutotal</th>                                                 
                <th colspan="1" class=""></th> 
                <th colspan="4" class=" text-center">GST</th>
                <th colspan="2" class=""></th>      
                <th colspan="6" class=" text-center">Total</th>
                <th colspan="1" class=""></th>
                <th colspan="2" class="-left -dark"></th> 
                <th colspan="8" class=" text-center"></th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Airfare/Ferry</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="11" class=""><div class="answer-payment">1,000.00</div></td>                       
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class=""><div class="answer-payment">1,000.00</div></td>
                <th colspan="1" class=" text-center">+</th>                        
                <td colspan="4" class=""><div class="answer-payment">50.00</div></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class=""><div class="answer-payment">1,050.00</div></td> 
                <td colspan="1" class=""></td>
                <th colspan="2" class="-left -dark"></th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Miscellaneous> -->
            <tr style="line-height:1.6rem;">
                <th/>          
                <td colspan="21" class=""></td>                        
                <th colspan="5" class=" text-center">Sutotal</th>                                                 
                <th colspan="1" class=""></th> 
                <th colspan="4" class=" text-center">GST</th>
                <th colspan="2" class=""></th>      
                <th colspan="6" class=" text-center">Total</th>
                <th colspan="1" class=""></th>
                <th colspan="2" class="-left -dark"></th> 
                <th colspan="8" class=" text-center">Total Payable</th>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Miscellaneous</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="11" class=""><div class="answer-payment">200.00</div></td>                       
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class=""><div class="answer-payment">200.00</div></td>
                <th colspan="1" class=" text-center">+</th>                        
                <td colspan="4" class=""><div class="answer-payment">10.00</div></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class=""><div class="answer-payment">210.00</div></td> 
                <td colspan="1" class=""></td>
                <th colspan="2" class="-left -dark text-right">$</th> 
                <td colspan="8" class=""><div class="answer-payment">8,888.66</div></td> 
                <th/>                       
            </tr>
            <tr>
                <th/>
                <td colspan="40" class=""></td>
                <th colspan="2" class="-left -dark"></th> 
                <td colspan="8" class=""></td> 
                <th/>
            </tr>

<!-- <Expenses Pre-GST> -->
                    <tr>
                        <th/>                        
                        <th colspan="21" class=""></th>                        
                        <th colspan="5" style="line-height:0.85rem;" class=" text-center">Expenses Pre-GST</th>
                        <th colspan="1" class=""></th>
                        <th colspan="4" class=" text-center">Total GST</th>
                        <th colspan="2" class=""></th>      
                        <th colspan="6" class=" text-center">Total Expenses</th>
                        <th colspan="1" class=""></th>
                        <th colspan="2" class=""></th> 
                        <th colspan="8" class=""></th>
                        <th/>                        
                    </tr>
                    <tr>
                        <th/>
                        <th colspan="15" class=""></th>                        
                        <th colspan="6" class=" text-right">Checks Totals</th>                         
                        <td colspan="5" class=""><div class="answer-payment">930.50</div></td>
                        <th colspan="1" class=" text-center">+</th>                        
                        <td colspan="4" class=""><div class="answer-payment">65.00</div></td>
                        <th colspan="2" class=""></th>
                        <td colspan="6" class=""><div class="answer-payment">995.50</div></td> 
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
                        <th colspan="8" class=""><div class="answer-payment">4,444.66</div></th>
                        <th/>                          
                    </tr>

                    <tr style="line-height:1.6rem;">
                        <th/>
                        <td colspan="17" class=""></td>
                        <td colspan="10" class=" text-right">Sent to Federal Crown</td>
                        <td colspan="2" class=""></td>
                        <td colspan="11" class=" text-right"><b>Total paid by</b> Federal Crown</td>
                        <th colspan="2" class=" text-right"><div class="float-right">$</div></th> 
                        <th colspan="8" class=""><div class="answer-payment">4,444.00</div></th>
                        <th/>                          
                    </tr>


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
