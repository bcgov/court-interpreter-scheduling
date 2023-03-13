<template>
    <div :name="section_name" v-if="dataReady">
        <b-card class="my-5">
            
            <b-row class="m-0">
                <h3 class="text-dark p-0 mt-n2 mb-0">Payment Details</h3>
                <b-button size="sm"             
                    v-if="paymentChanges"
                    @click="savePaymentDetailsChanges()"                                 
                    variant="success" 
                    style="margin:-0.5rem 0 -1rem auto; width:14rem; font-size:14pt;"
                    > Save Payment Details 
                </b-button>
                <b-button size="sm"
                    v-if="paymentChanges"
                    @click="cancelPaymentChanges()"
                    style="margin:-0.5rem 0 -1rem 1rem; width:16rem; font-size:14pt;"
                    >Cancel Payment Changes
                </b-button>
            </b-row>
            <b-table-simple small borderless>
                <b-thead head-variant="" >
                    <b-tr style="color:rgb(182, 210, 221); height:2rem;">                    
                        <b-td v-for="inx in Array(50)" :key="inx" class="border-0 border-dark" style="width:2%;" />                         
                    </b-tr>
                </b-thead>                               
                
<!-- <Court Hours> -->
                <b-tbody v-for="lang,inx in languageItems" :key="'fees-'+inx">
                    <b-tr v-if="inx==0">
                        <b-td colspan="42" class="h3 py-0" style="transform:translate(0,20px);">Fees</b-td> 
                        <b-td colspan="8" class="h4 text-center pb-0 pt-1" style="transform:translate(0,20px);">Fees Payable</b-td>                                              
                    </b-tr>                    
                    <b-tr v-if="form[courtFeeItems[1]+lang] || form[courtFeeItems[1]+lang]==''">
                        <b-th colspan="8" class="h3"></b-th>
                        <b-th colspan="2" class=""></b-th>
                        <b-th colspan="8" class="text-center">Rate</b-th>
                        <b-th colspan="2" class=""></b-th>
                        <b-th colspan="8" class="text-center">Total Hours</b-th>
                        <b-th colspan="14" class=""></b-th>
                        <b-th colspan="8" class="text-center"></b-th>                                                 
                    </b-tr>
                    <b-tr v-if="form[courtFeeItems[1]+lang] || form[courtFeeItems[1]+lang]==''">
                        <b-th colspan="8" class="">Court Hours <div class="h5">({{getLanguageHrDetail(lang)}})</div></b-th>
                        <b-th colspan="2" class="text-right">$</b-th>
                        <b-td colspan="8" class=""><underline-text :text="form[courtFeeItems[0]+lang]" /></b-td>
                        <b-th colspan="2" class="text-center">x</b-th>
                        <b-td colspan="8" class="">                            
                            <b-input class="w-75 mx-auto mt-n2" v-model="form[courtFeeItems[1]+lang]" :formatter="formatterRate" @input="paymentChanges=true;"/>
                        </b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form[courtFeeItems[2]+lang]"/></b-td>
                        <b-th colspan="4" class=""></b-th>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="8" class=""><underline-text :text="form[courtFeeItems[3]+lang]"/></b-td>                          
                    </b-tr>
                    <!-- <b-tr style="height:.1rem;line-height:.1rem;" ><b-td colspan="50" class="text-white">.</b-td></b-tr>  -->
                </b-tbody>
                <b-tbody v-if="!form.includeCourtHrs">
                    <b-tr>
                        <b-th colspan="8" class="h3"></b-th>
                        <b-th colspan="2" class=""></b-th>
                        <b-th colspan="8" class="text-center">Rate</b-th>
                        <b-th colspan="2" class=""></b-th>
                        <b-th colspan="8" class="text-center">Total Hours</b-th>
                        <b-th colspan="14" class=""></b-th>
                        <b-th colspan="8" class="text-center"></b-th>                                                 
                    </b-tr>
                    <b-tr>
                        <b-th colspan="8" class="">Court Hours</b-th>
                        <b-th colspan="2" class="text-right">$</b-th>
                        <b-td colspan="8" class=""><underline-text text="" /></b-td>
                        <b-th colspan="2" class="text-center">x</b-th>
                        <b-td colspan="8" class=""><underline-text text=""/></b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text text=""/></b-td>
                        <b-th colspan="4" class=""></b-th>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="8" class=""><underline-text text=""/></b-td>                          
                    </b-tr>
                    <b-tr><b-td colspan="50" class="text-white">.</b-td></b-tr>
                </b-tbody>  
                <b-tbody>   
<!-- <spacer> -->                   
                    <!-- <b-tr><b-td colspan="50" class="text-white">.</b-td></b-tr>                     -->
<!-- <Travel Hours> -->
                    <b-tr>
                        <b-th colspan="10" class=""></b-th>
                        <b-th colspan="8" class="text-center">Rate</b-th>
                        <b-th colspan="2" class=""></b-th>
                        <b-th colspan="8" class="text-center">Total Hours</b-th>
                        <b-th colspan="22" class=""></b-th>                                                
                    </b-tr>
                    <b-tr>
                        <b-th colspan="8" class="">Travel Hours</b-th>
                        <b-th colspan="2" class="text-right">$</b-th>
                        <b-td colspan="8" class=""><underline-text :text="form.travelHrRate"/></b-td>
                        <b-th colspan="2" class="text-center">x</b-th>
                        <b-td colspan="8" class="">                            
                            <b-input class="w-75 mx-auto mt-n2" v-model="form.travelTotalHrs" :formatter="formatterDays" @input="paymentChanges=true;"/>
                        </b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.travelTotal"/></b-td>
                        <b-th colspan="4" class=""></b-th>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="8" class=""><underline-text :text="form.travelPayableFee"/></b-td>                          
                    </b-tr>
<!-- <Subtotal> -->
                    <b-tr>
                        <b-th colspan="32" class=""></b-th>                        
                        <b-th colspan="8" class="text-right">Subtotal</b-th>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="8" class=""><underline-text :text="form.feesSubtotal"/></b-td>                          
                    </b-tr>
<!-- <GST> -->
                    <b-tr>
                        <b-th colspan="10" class="p-0"></b-th>                        
                        <b-th colspan="7" class="text-right">GST Number :</b-th>
                        <b-td colspan="12" class=""><underline-text :text="form.gstNumber"/></b-td>
                        <b-th colspan="7" class="text-right">                            
                            <b-row>
                                <div style="width:10%;" />
                                <b-input class="w-50 mx-auto mt-n2" v-model="form.gstRate" :formatter="formatterGST" @input="paymentChanges=true;"/>
                                <div style="width:40%;" > (GST rate)</div>
                            </b-row></b-th>
                        <b-th colspan="4" class="text-right">GST</b-th>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="8" class=""><underline-text :text="form.feesGST"/></b-td>                          
                    </b-tr>
<!-- <Total> -->
                    <b-tr>
                        <b-th colspan="38" class=""></b-th>                        
                        <b-th colspan="2" class="text-right">Total</b-th>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-th colspan="8" class=""><underline-text :text="form.feesTotal"/></b-th>                          
                    </b-tr>
<!-- <Expenses> -->
<!-- <Expenses> -->
                    <b-tr>
                        <b-td colspan="50" class=""><h3 style="display:inline">Expenses</h3> (receipts attached)</b-td>                                                
                    </b-tr>
<!-- <Travel KM> -->
                    <b-tr>                        
                        <b-th colspan="8" class=""></b-th>
                        <b-th colspan="5" class="text-center">Rate</b-th>                        
                        <b-th colspan="7" class="text-center">Total Kilometers</b-th>
                        <b-td colspan="1" class=""></b-td>                        
                        <b-th colspan="5" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="7" class=""></b-th>                        
                        <b-th colspan="6" class="text-center">Total</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-th colspan="8" class="text-center">Expenses Payable</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="7" class="">Travel Kilometers</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="5" class=""><underline-text :text="form.travelKMsRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="5" class="">                            
                            <b-input class="w-75 mx-auto mt-n2" v-model="form.travelTotalKMs" :formatter="formatterTravelKm" @input="paymentChanges=true;"/>
                        </b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="5" class=""><underline-text :text="form.travelSubExp"/></b-td>
                        <b-th colspan="1" class=""></b-th>                        
                        <b-td colspan="4" class=""></b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.travelTotalExp"/></b-td> 
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="8" class=""><underline-text :text="form.expPayable"/></b-td>                        
                    </b-tr>
<!-- <Breakfast> -->
                    <b-tr>                        
                        <b-th colspan="8" class=""></b-th>
                        <b-th colspan="5" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="5" class="text-center">Total Days</b-th>
                        <b-td colspan="2" class=""></b-td>                        
                        <b-th colspan="5" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="7" class=""></b-th>                        
                        <b-th colspan="6" class="text-center">Total</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-th colspan="8" class=""></b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="7" class="">Breakfast</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="5" class=""><underline-text :text="form.breakfastRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="5" class="">
                            <b-input class="w-75 mx-auto mt-n2" v-model="form.breakfastTotalDays" :formatter="formatterDays" @input="paymentChanges=true;"/>
                        </b-td>                        
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="5" class=""><underline-text :text="form.breakfastSubExp"/></b-td>
                        <b-th colspan="1" class=""></b-th>                        
                        <b-td colspan="4" class=""></b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.breakfastTotalExp"/></b-td> 
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-td colspan="8" class=""></b-td>                        
                    </b-tr>
<!-- <Lunch> -->
                    <b-tr>                        
                        <b-th colspan="8" class=""></b-th>
                        <b-th colspan="5" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="5" class="text-center">Total Days</b-th>
                        <b-td colspan="2" class=""></b-td>                        
                        <b-th colspan="5" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="7" class=""></b-th>                        
                        <b-th colspan="6" class="text-center">Total</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-th colspan="8" class="text-center">GST (if applicable)</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="7" class="">Lunch</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="5" class=""><underline-text :text="form.lunchRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="5" class="">                            
                            <b-input class="w-75 mx-auto mt-n2" v-model="form.lunchTotalDays" :formatter="formatterDays" @input="paymentChanges=true;"/>
                        </b-td>                        
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="5" class=""><underline-text :text="form.lunchSubExp"/></b-td>
                        <b-th colspan="1" class=""></b-th>                        
                        <b-td colspan="4" class=""></b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.lunchTotalExp"/></b-td> 
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="8" class=""><underline-text :text="form.GSTifApplic"/></b-td>                        
                    </b-tr>
<!-- <Dinner> -->
                    <b-tr>                        
                        <b-th colspan="8" class=""></b-th>
                        <b-th colspan="5" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="5" class="text-center">Total Days</b-th>
                        <b-td colspan="2" class=""></b-td>                        
                        <b-th colspan="5" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="7" class=""></b-th>                        
                        <b-th colspan="6" class="text-center">Total</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-th colspan="8" class="text-center"></b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="7" class="">Dinner</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="5" class=""><underline-text :text="form.dinnerRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="5" class="">
                            <b-input class="w-75 mx-auto mt-n2" v-model="form.dinnerTotalDays" :formatter="formatterDays" @input="paymentChanges=true;"/>
                        </b-td>                        
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="5" class=""><underline-text :text="form.dinnerSubExp"/></b-td>
                        <b-th colspan="1" class=""></b-th>                        
                        <b-td colspan="4" class=""></b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.dinnerTotalExp"/></b-td> 
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-td colspan="8" class=""></b-td>                        
                    </b-tr>

<!-- <Lodging> -->
                    <b-tr style="height:3rem;line-height:3rem;" >                        
                        <b-th colspan="8" class=""></b-th>                        
                        <b-th colspan="11" class="text-center">Total Pre-GST</b-th>
                        <b-td colspan="2" class=""></b-td>                        
                        <b-th colspan="5" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="1" class=""></b-th> 
                        <b-th colspan="4" class="text-center">GST</b-th>
                        <b-th colspan="2" class=""></b-th>      
                        <b-th colspan="6" class="text-center">Total</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-th colspan="8" class="text-center">Total Expenses</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="7" class="">Lodging</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="11" class="p-0"><b-input class="w-50 mx-auto" v-model="form.lodgingRate" :formatter="formatterExpense" @input="paymentChanges=true;" /></b-td>                                                
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="5" class=""><underline-text :text="form.lodgingSubExp"/></b-td>
                        <b-th colspan="1" class="text-center">+</b-th>                        
                        <b-td colspan="4" class="p-0"><b-input class="" v-model="form.lodgingGST" :formatter="formatterExpenseGST" @input="paymentChanges=true;"/></b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.lodgingTotalExp"/></b-td> 
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="8" class=""><underline-text :text="form.totalExpenses"/></b-td>                        
                    </b-tr>

<!-- <Airfare/Ferry> -->
                    <b-tr>                        
                        <b-th colspan="21" class=""></b-th>                        
                        <b-th colspan="5" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="1" class=""></b-th> 
                        <b-th colspan="4" class="text-center">GST</b-th>
                        <b-th colspan="2" class=""></b-th>      
                        <b-th colspan="6" class="text-center">Total</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-th colspan="8" class="text-center">Total Cancellation Fees</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="7" class="">Airfare/Ferry</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="11" class="p-0"><b-input class="w-50 mx-auto" v-model="form.ferryExp" :formatter="formatterExpense" @input="paymentChanges=true;"/></b-td>                       
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="5" class=""><underline-text :text="form.ferrySubExp"/></b-td>
                        <b-th colspan="1" class="text-center">+</b-th>                        
                        <b-td colspan="4" class="p-0"><b-input class="" v-model="form.ferryGST" :formatter="formatterExpenseGST" @input="paymentChanges=true;"/></b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.ferryTotalExp"/></b-td> 
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="8" class=""><b-input class="w-75 mx-auto mt-n2" v-model="form.totalCancellationFees" :formatter="formatterExpense" @input="paymentChanges=true;"/>
                            <!-- <underline-text :text="form.totalCancellationFees"/> -->
                            </b-td>                        
                    </b-tr>
<!-- <Miscellaneous> -->
                    <b-tr>                        
                        <b-th colspan="21" class=""></b-th>                       
                        <b-th colspan="5" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="1" class=""></b-th> 
                        <b-th colspan="4" class="text-center">GST</b-th>
                        <b-th colspan="2" class=""></b-th>      
                        <b-th colspan="6" class="text-center">Total</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark"></b-th> 
                        <b-th colspan="8" class="text-center">Total Payable</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="7" class="">Miscellaneous</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="11" class="p-0"><b-input class="w-50 mx-auto" v-model="form.miscExp" :formatter="formatterExpense" @input="paymentChanges=true;"/></b-td>                       
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="5" class=""><underline-text :text="form.miscSubExp"/></b-td>
                        <b-th colspan="1" class="text-center">+</b-th>                        
                        <b-td colspan="4" class="p-0"><b-input class="" v-model="form.miscGST" :formatter="formatterExpenseGST" @input="paymentChanges=true;"/></b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.miscTotalExp"/></b-td> 
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="border-left border-dark text-right">$</b-th> 
                        <b-th colspan="8" class=""><underline-text :text="form.totalPayable"/></b-th>                        
                    </b-tr>
<!-- <Expenses Pre-GST> -->
                    <b-tr class="">                        
                        <b-th colspan="20" class=""></b-th>                        
                        <b-th colspan="7" class="pt-4 text-center">Expenses Pre-GST</b-th>
                        <b-th colspan="4" class="pt-4 text-center">Total GST</b-th>
                        <b-th colspan="2" class=""></b-th>      
                        <b-th colspan="6" class="pt-4 text-center">Total Expenses</b-th>
                        <b-th colspan="11" class=""></b-th>                      
                    </b-tr>
                    <b-tr>                       
                        <b-td colspan="14" class=""></b-td>                       
                        <b-th colspan="6" class="text-right">Checks Totals</b-th>                         
                        <b-th colspan="1" class=""></b-th>
                        <b-td colspan="5" class=""><underline-text :text="form.expPreGST"/></b-td>
                        <b-th colspan="1" class="text-center">+</b-th>                        
                        <b-td colspan="4" class=""><underline-text :text="form.expTotalGST"/></b-td>
                        <b-th colspan="2" class=""></b-th> 
                        <b-td colspan="6" class=""><underline-text :text="form.expTotal"/></b-td> 
                        <b-th colspan="11" class=""></b-th>                                                 
                    </b-tr>
<!-- <Total paid by> -->
                    <b-tr>
                        <b-td colspan="29" class=""></b-td>                        
                        <b-td colspan="11" class="pt-4 text-right"><b>Total paid by</b> Court Services</b-td>
                        <b-th colspan="2" class="pt-4 text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-th colspan="8" class="pt-3 pb-1"><b-input class="w-75 mx-auto" v-model="form.totalPaidByCourt" :formatter="formatterTotal" @input="paymentChanges=true;"/></b-th>                          
                    </b-tr>

                    <b-tr>
                        <b-td colspan="20" class="p-0">
                            <b-row class="m-0">                                
                                <b-button size="sm"             
                                    v-if="paymentChanges"
                                    @click="savePaymentDetailsChanges()"                                 
                                    variant="success" 
                                    style="margin:0rem 0 0rem 0; width:14rem; font-size:14pt;"
                                    > Save Payment Details 
                                </b-button>
                                <b-button size="sm"
                                    v-if="paymentChanges"
                                    @click="cancelPaymentChanges()"
                                    style="margin:0rem 0 0rem 1rem; width:16rem; font-size:14pt;"
                                    >Cancel Payment Changes
                                </b-button>
                            </b-row>                            
                        </b-td>
                        <b-td colspan="7" class="text-right">Sent to Federal Crown</b-td>
                        <b-th colspan="2" class=""></b-th> 
                        <b-td colspan="11" class="text-right"><b>Total paid by</b> Federal Crown</b-td>
                        <b-th colspan="2" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-th colspan="8" class="py-0"><b-input class="w-75 mx-auto" v-model="form.totalPaidByCrown" :formatter="formatterTotal" @input="paymentChanges=true;"/></b-th>                          
                    </b-tr>
                
                </b-tbody>
            </b-table-simple>
        </b-card>
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as _ from 'underscore';

import {bookingSearchResultInfoType, gstInfoType, paymentDetailsVars, totalInterpretingHoursInfoType, travelInformationInfoType} from '@/types/Bookings/json';
import UnderlineText from "./UnderlineText.vue"
import {paymentDetailsInfoType} from '@/types/Bookings';
import {languageItems, courtFeeItems} from '../AdmCalculations/PaymentCalculation'


@Component({
    components:{
        UnderlineText
    }
})
export default class AdmPaymentDetails extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    
    @Prop({required: true})
    form!: paymentDetailsInfoType;

    languageItems = []
    courtFeeItems = []

    section_name="adm-payment"

    dataReady = false;
    paymentChanges = false;

    @Watch('paymentChanges')
    paymentChanged(newVal){
        console.log(newVal)
        this.$emit('change',newVal)
    }
                            

    mounted(){
        this.dataReady = false;
        this.paymentChanges = false;
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
        if(detail.includes('1')){detail=detail.replace('1','')+' Level 1 '}
        if(detail.includes('2')){detail=detail.replace('2','')+' Level 2 '}
        if(detail.includes('3')){detail=detail.replace('3','')+' Level 3 '}
        if(detail.includes('4')){detail=detail.replace('4','')+' Level 4 '}        
        if(detail.includes('Old')){detail = detail.replace('Old','') +'\'Previous Rate\' '}
        return detail
    }

    public savePaymentDetailsChanges(){

        const admDetail = this.booking.admDetail? JSON.parse(JSON.stringify(this.booking.admDetail)) :{}

        this.paymentChanges=false;
        
        //_______paymentDetail
        const paymentDetail = {} as  paymentDetailsVars;
        paymentDetail.totalPaidByCourt = this.form.totalPaidByCourt? parseFloat(this.form.totalPaidByCourt): null
        paymentDetail.totalPaidByCrown = this.form.totalPaidByCrown? parseFloat(this.form.totalPaidByCrown): null
        paymentDetail.lodgingRate = this.form.lodgingRate? parseFloat(this.form.lodgingRate): null
        paymentDetail.lodgingGST = this.form.lodgingGST? parseFloat(this.form.lodgingGST): null
        paymentDetail.ferryExp = this.form.ferryExp? parseFloat(this.form.ferryExp): null
        paymentDetail.ferryGST = this.form.ferryGST? parseFloat(this.form.ferryGST): null
        paymentDetail.miscExp = this.form.miscExp? parseFloat(this.form.miscExp): null
        paymentDetail.miscGST = this.form.miscGST? parseFloat(this.form.miscGST): null
        admDetail.paymentDetail = paymentDetail
        
        //_______travelInformation
        const travelInformation = {} as travelInformationInfoType;        
        travelInformation.startDate = admDetail?.calculations?.travelInformation?.startDate
        travelInformation.status = admDetail?.calculations?.travelInformation?.status
        travelInformation.totalHours = this.form.travelTotalHrs? parseFloat(this.form.travelTotalHrs) : 0
        travelInformation.totalKilometers = this.form.travelTotalKMs? parseFloat(this.form.travelTotalKMs): 0
        travelInformation.breakfast = this.form.breakfastTotalDays? parseFloat(this.form.breakfastTotalDays) : 0
        travelInformation.lunch = this.form.lunchTotalDays ? parseFloat(this.form.lunchTotalDays) : 0
        travelInformation.dinner = this.form.dinnerTotalDays? parseFloat(this.form.dinnerTotalDays) : 0
        admDetail.calculations.travelInformation = travelInformation
        
        //_______GST
        const gst = {} as gstInfoType
        gst.gstRate = this.form.gstRate? parseFloat(this.form.gstRate) : 0.05
        admDetail.calculations.gst = gst
        
        //_______totalInterpretingHours
        if(admDetail?.calculations?.totalInterpretingHours){
            const totalInterpretingHours =  admDetail.calculations.totalInterpretingHours as totalInterpretingHoursInfoType;
            for(const lang of this.languageItems){
                if (this.form[courtFeeItems[1]+lang]){
                    totalInterpretingHours[lang] = parseFloat(this.form[courtFeeItems[1]+lang])
                }
            }
            admDetail.calculations.totalInterpretingHours = totalInterpretingHours
        }
        
        //_______cancellation
        if(Number(admDetail?.calculations?.cancellation?.totalFees) != Number(this.form.totalCancellationFees)){
            admDetail.calculations.cancellation.totalFees = Number(this.form.totalCancellationFees)
        }        

        const paymentDetailChanges =[
            {name:'admDetail', value:admDetail}                  
        ]
        this.$emit('savePaymentDetail',paymentDetailChanges, this.section_name)
    }

    cancelPaymentChanges(){
        this.$emit('cancelChanges')
    }

    public formatterGST(value){
        return this.formatter(value, 4, 0.5)
    }

    public formatterRate(value){
        return this.formatter(value, 6, 500)
    }

    public formatterExpense(value){
        return this.formatter(value, 8, 10000)
    }

    public formatterExpenseGST(value){
        return this.formatter(value, 7, 1000)
    }

    public formatterTotal(value){
        return this.formatter(value, 10, 1000000)
    }

    public formatterDays(value){
        return this.formatter(value, 4, 50)
    }

    public formatterTravelKm(value){
        return this.formatter(value, 7, 5000)
    }

    public formatter(value: string, len, max){
        const lastChar =  value.slice(-1);
        if(lastChar != '.' && isNaN(Number(lastChar))) return value.slice(0,-1)
        if(lastChar =='.' && value.slice(0,-1).includes('.')) return value.slice(0,-1)
        if(value.length>len) return value.slice(0,-1)
        const dotInx = value.indexOf('.')
        if(dotInx==0) return ('0'+value)
        if(dotInx>-1 && value.length-dotInx>3)return value.slice(0,-1)
        if(Number(value)>max) return '0'
        return value
    }


}
</script>

<style scoped lang="scss">
    .card{
        background: rgb(182, 210, 221);
        box-shadow: 2px 5px 5px 2px #DDD;
    }
    // th{
    //     border: 1px solid #000 !important;
    // }
    // td{
    //     border: 1px solid #000 !important;
    // }

    .labels {
        font-size: 12px; font-weight:600; line-height: 0.025rem; color: rgb(50, 50, 50);
    }

</style>