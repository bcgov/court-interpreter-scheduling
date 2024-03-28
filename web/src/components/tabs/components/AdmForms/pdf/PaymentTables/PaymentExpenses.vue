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
                <td colspan="5" class="text-center">Subtotal</td>
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
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.travelKMsRate}}</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.travelTotalKMs}}</div></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.travelSubExp}}</div></td>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.travelTotalExp}}</div></td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left text-right">$</th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">{{form.expPayable}}</div></td>
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
                <td colspan="5" class="text-center">Subtotal</td>
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
                <th colspan="7" class="">Breakfast</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.breakfastRate}}</div></td>
                <th colspan="1" class="text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.breakfastTotalDays}}</div></td>                        
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.breakfastSubExp}}</div></td>
                <th colspan="1" class=""></th>                
                <td colspan="4" class=""></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.breakfastTotalExp}}</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left text-right">$</th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">{{form.GSTifApplic}}</div></td> 
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
                <td colspan="5" class="text-center">Subtotal</td>
                <th colspan="1" class=""></th>
                <th colspan="4" class=""></th>                                                 
                <th colspan="2" class=""></th>                        
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class="text-center">Total Expenses</td>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Lunch</th>
                <th colspan="1" class=" text-right">$</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.lunchRate}}</div></td>
                <th colspan="1" class=" text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.lunchTotalDays}}</div></td>                        
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.lunchSubExp}}</div></td>                
                <th colspan="1" class=""></th>
                <td colspan="4" class=""></td>
                <th colspan="2" class=" text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.lunchTotalExp}}</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left text-right">$</th> 
                <td colspan="8" class="border-bottom"><div class="answer-payment">{{form.totalExpenses}}</div></td> 
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
                <td colspan="5" class="text-center">Subtotal</td>
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
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.dinnerRate}}</div></td>
                <th colspan="1" class="text-center">x</th>
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.dinnerTotalDays}}</div></td>                        
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.dinnerSubExp}}</div></td>
                <th colspan="1" class=""></th>                
                <td colspan="4" class=""></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.dinnerTotalExp}}</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Lodging> -->
            <tr style="line-height:1.6rem;">
                <th/>                        
                <th colspan="8" class=""></th>
                <td colspan="11" class="text-center">Total Pre GST</td>
                <th colspan="2" class=""></th>                   
                <td colspan="5" class="text-center">Subtotal</td>
                <th colspan="1" class=""></th>
                <td colspan="4" class="text-center">GST</td>                                                 
                <th colspan="2" class=""></th>                        
                <td colspan="6" class="text-center">Total</td>
                <th colspan="1" class=""></th>
                <th colspan="2" class="border-left"></th> 
                <td colspan="8" class="text-center" style="font-size:7.8pt;"></td>
                <th/>                        
            </tr>
            <tr>
                <th/>
                <th colspan="7" class="">Lodging</th>
                <th colspan="1" class="text-right">$</th>
                <td colspan="11" class="border-bottom"><div class="answer-payment">{{form.lodgingRate}}</div></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.lodgingSubExp}}</div></td>
                <th colspan="1" class="text-center">+</th>                
                <td colspan="4" class="border-bottom"><div class="answer-payment">{{form.lodgingGST}}</div></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.lodgingTotalExp}}</div></td>
                <th colspan="1" class=""></th> 
                <th colspan="2" class="border-left text-right"></th> 
                <td colspan="8" class=""><div class="answer-payment"></div></td> 
                <th/>                       
            </tr>

<!-- <Airfare/Ferry> -->
            <tr style="line-height:1.6rem;">
                <th/>          
                <td colspan="21" class=""></td>                        
                <td colspan="5" class="text-center">Subtotal</td>                                                 
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
                <td colspan="11" class="border-bottom"><div class="answer-payment">{{form.ferryExp}}</div></td>                       
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.ferrySubExp}}</div></td>
                <th colspan="1" class="text-center">+</th>                        
                <td colspan="4" class="border-bottom"><div class="answer-payment">{{form.ferryGST}}</div></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.ferryTotalExp}}</div></td> 
                <td colspan="1" class=""></td>
                <th colspan="2" class="border-left -dark"></th> 
                <td colspan="8" class=""></td> 
                <th/>                       
            </tr>

<!-- <Miscellaneous> -->
            <tr style="line-height:1.6rem;">
                <th/>          
                <td colspan="21" class=""></td>                        
                <td colspan="5" class="text-center">Subtotal</td>                                                 
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
                <td colspan="11" class="border-bottom"><div class="answer-payment">{{form.miscExp}}</div></td>                       
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th>                         
                <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.miscSubExp}}</div></td>
                <th colspan="1" class="text-center">+</th>                        
                <td colspan="4" class="border-bottom"><div class="answer-payment">{{form.miscGST}}</div></td>
                <th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></th> 
                <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.miscTotalExp}}</div></td> 
                <td colspan="1" class=""></td>
                <th colspan="2" class="border-left text-right">$</th> 
                <th colspan="8" class="border-bottom"><div class="answer-payment">{{form.totalPayable}}</div></th> 
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
                        <td colspan="5" class="border-bottom"><div class="answer-payment">{{form.expPreGST}}</div></td>
                        <th colspan="1" class="text-center">+</th>                        
                        <td colspan="4" class="border-bottom"><div class="answer-payment">{{form.expTotalGST}}</div></td>
                        <th colspan="2" class=""></th>
                        <td colspan="6" class="border-bottom"><div class="answer-payment">{{form.expTotal}}</div></td> 
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
                        <th colspan="8" class="border-bottom"><div class="answer-payment">{{form.totalPaidByCourt}}</div></th>
                        <th/>                          
                    </tr>

                    <tr style="line-height:1.6rem;">
                        <th/>
                        <td colspan="17" class=""></td>
                        <td colspan="10" class=" text-right">Sent to Federal Crown</td>
                        <td colspan="2" class=""></td>
                        <td colspan="11" class=" text-right"><b>Total paid by</b> Federal Crown</td>
                        <th colspan="2" class=" text-right"><div class="float-right">$</div></th> 
                        <th colspan="8" class="border-bottom"><div class="answer-payment">{{form.totalPaidByCrown}}</div></th>
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
import { paymentDetailsInfoType } from '@/types/Bookings';
import { bookingSearchResultInfoType } from '@/types/Bookings/json';

@Component
export default class PaymentExpenses extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    
    @Prop({required: true})
    form!: paymentDetailsInfoType;


    mounted(){        
       //
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
