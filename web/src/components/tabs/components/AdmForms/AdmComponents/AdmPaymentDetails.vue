<template>
    <div v-if="dataReady">
        <b-card class="my-5">
            <h3 class="text-dark p-0 mt-n2 mb-0">Payment Details</h3>
            <b-table-simple small borderless>
                <b-thead head-variant="" >
                    <b-tr style="color:rgb(182, 210, 221)">
                        <b-th>Country1</b-th>
                        <b-th>Co2</b-th>
                        <b-th>C3</b-th>
                        <b-th>CountryCo4</b-th>
                        <b-th>C5</b-th>
                        <b-th>CountryCountry6</b-th>
                        <b-th>C7</b-th>
                        <b-th>CountryCount8</b-th>
                        <b-th>C9</b-th>
                        <b-th>CountryCount0</b-th>
                        <b-th>Co1</b-th>
                        <b-th>Country2</b-th>
                        <b-th>Country3</b-th>
                        <b-th>C4</b-th>
                        <b-th>Country5</b-th>
                        <b-th>Country6</b-th>                        
                    </b-tr>
                </b-thead>                               
                <b-tbody>
<!-- <Court Hours> -->
                    <b-tr>
                        <b-th colspan="4" class="h3">Fees</b-th>
                        <b-th colspan="2" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="text-center">Total Hours</b-th>
                        <b-th colspan="5" class=""></b-th>
                        <b-th colspan="2" class="text-center">Fees Payable</b-th>                                                 
                    </b-tr>
                    <b-tr>
                        <b-th colspan="3" class="">Court Hours</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="2" class=""><underline-text :text="form.courtHrRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="2" class=""><underline-text :text="form.courtTotalHrs"/></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.courtTotal"/></b-td>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.courtPayableFee"/></b-td>                          
                    </b-tr>
<!-- <Travel Hours> -->
                    <b-tr>
                        <b-th colspan="4" class=""></b-th>
                        <b-th colspan="2" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="2" class="text-center">Total Hours</b-th>
                        <b-th colspan="7" class=""></b-th>                                                 
                    </b-tr>
                    <b-tr>
                        <b-th colspan="3" class="">Travel Hours</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="2" class=""><underline-text :text="form.travelHrRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-th colspan="2" class=""><underline-text :text="form.travelTotalHrs"/></b-th>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.travelTotal"/></b-td>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.travelPayableFee"/></b-td>                          
                    </b-tr>
<!-- <Subtotal> -->
                    <b-tr>
                        <b-th colspan="12" class=""></b-th>                        
                        <b-th colspan="1" class="text-right">Subtotal</b-th>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.feesSubtotal"/></b-td>                          
                    </b-tr>
<!-- <GST> -->
                    <b-tr>
                        <b-th colspan="5" class=""></b-th>                        
                        <b-th colspan="2" class="text-right">GST Number:</b-th>
                        <b-td colspan="3" class=""><underline-text :text="form.gstNumber"/></b-td>
                        <b-th colspan="2" class="text-center">{{form.gstRate}} % (rate)</b-th>
                        <b-th colspan="1" class="text-right">GST</b-th>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-th colspan="2" class=""></b-th>                          
                    </b-tr>
<!-- <Total> -->
                    <b-tr>
                        <b-th colspan="12" class=""></b-th>                        
                        <b-th colspan="1" class="text-right">Total</b-th>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-th colspan="2" class=""></b-th>                          
                    </b-tr>
<!-- <Expenses> -->
<!-- <Expenses> -->
                    <b-tr>
                        <b-td colspan="16" class=""><h3 style="display:inline">Expenses</h3> (receipts attached)</b-td>                                                
                    </b-tr>
<!-- <Travel KM> -->
                    <b-tr>                        
                        <b-th colspan="3" class=""></b-th>
                        <b-th colspan="1" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="1" class="text-center">Total Kilometers</b-th>
                        <b-td colspan="1" class=""></b-td>                        
                        <b-th colspan="1" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="3" class=""></b-th>                        
                        <b-th colspan="2" class="pr-4 text-center">Total</b-th>
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-th colspan="2" class="text-center">Expenses Payable</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2" class="">Travel Kilometers</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.travelKMsRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.travelTotalKMs"/></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="1" class=""><underline-text :text="form.travelSubExp"/></b-td>
                        <b-th colspan="1" class=""></b-th>                        
                        <b-td colspan="1" class=""></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class="pr-4"><underline-text :text="form.travelTotalExp"/></b-td> 
                        <b-th colspan="1" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.expPayable"/></b-td>                        
                    </b-tr>
<!-- <Breakfast> -->
                    <b-tr>                        
                        <b-th colspan="3" class=""></b-th>
                        <b-th colspan="1" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="1" class="text-center">Total Days</b-th>
                        <b-td colspan="1" class=""></b-td>                        
                        <b-th colspan="1" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="3" class=""></b-th>                        
                        <b-th colspan="2" class="pr-4 text-center">Total</b-th>
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-th colspan="2" class=""></b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2" class="">Breakfast</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.breakfastRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.breakfastTotalDays"/></b-td>                        
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="1" class=""><underline-text :text="form.breakfastSubExp"/></b-td>
                        <b-th colspan="1" class=""></b-th>                        
                        <b-td colspan="1" class=""></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class="pr-4"><underline-text :text="form.breakfastTotalExp"/></b-td> 
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-td colspan="2" class=""></b-td>                        
                    </b-tr>
<!-- <Lunch> -->
                    <b-tr>                        
                        <b-th colspan="3" class=""></b-th>
                        <b-th colspan="1" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="1" class="text-center">Total Days</b-th>
                        <b-td colspan="1" class=""></b-td>                        
                        <b-th colspan="1" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="3" class=""></b-th>                        
                        <b-th colspan="2" class="pr-4 text-center">Total</b-th>
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-th colspan="2" class="text-center">GST (if applicable)</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2" class="">Lunch</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.lunchRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.lunchTotalDays"/></b-td>                        
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="1" class=""><underline-text :text="form.lunchSubExp"/></b-td>
                        <b-th colspan="1" class=""></b-th>                        
                        <b-td colspan="1" class=""></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class="pr-4"><underline-text :text="form.lunchTotalExp"/></b-td> 
                        <b-th colspan="1" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.GSTifApplic"/></b-td>                        
                    </b-tr>
<!-- <Dinner> -->
                    <b-tr>                        
                        <b-th colspan="3" class=""></b-th>
                        <b-th colspan="1" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="1" class="text-center">Total Days</b-th>
                        <b-td colspan="1" class=""></b-td>                        
                        <b-th colspan="1" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="3" class=""></b-th>                        
                        <b-th colspan="2" class="pr-4 text-center">Total</b-th>
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-th colspan="2" class="text-center"></b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2" class="">Dinner</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.dinnerRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.dinnerTotalDays"/></b-td>                        
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="1" class=""><underline-text :text="form.dinnerSubExp"/></b-td>
                        <b-th colspan="1" class=""></b-th>                        
                        <b-td colspan="1" class=""></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class="pr-4"><underline-text :text="form.dinnerTotalExp"/></b-td> 
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-td colspan="2" class=""></b-td>                        
                    </b-tr>

<!-- <Lodging> -->
                    <b-tr>                        
                        <b-th colspan="3" class=""></b-th>
                        <b-th colspan="1" class="text-center">Rate</b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-th colspan="1" class="text-center">Total Days</b-th>
                        <b-td colspan="1" class=""></b-td>                        
                        <b-th colspan="1" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="1" class=""></b-th> 
                        <b-th colspan="1" class="text-center">GST</b-th>
                        <b-th colspan="1" class=""></b-th>      
                        <b-th colspan="2" class="pr-4 text-center">Total</b-th>
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-th colspan="2" class="text-center">Total Expenses</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2" class="">Lodging</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="1" class=""><underline-text :text="form.lodgingRate"/></b-td>
                        <b-th colspan="1" class="text-center">x</b-th>
                        <b-th colspan="1" class=""><underline-text :text="form.lodgingTotalDays"/></b-th>                        
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="1" class=""><underline-text :text="form.lodgingSubExp"/></b-td>
                        <b-th colspan="1" class="text-center">+</b-th>                        
                        <b-td colspan="1" class=""><underline-text :text="form.lodgingGST"/></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class="pr-4"><underline-text :text="form.lodgingTotalExp"/></b-td> 
                        <b-th colspan="1" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.totalExpenses"/></b-td>                        
                    </b-tr>

<!-- <Airfare/Ferry> -->
                    <b-tr>                        
                        <b-th colspan="6" class=""></b-th>
                        <b-td colspan="1" class=""></b-td>                        
                        <b-th colspan="1" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="1" class=""></b-th> 
                        <b-th colspan="1" class="text-center">GST</b-th>
                        <b-th colspan="1" class=""></b-th>      
                        <b-th colspan="2" class="pr-4 text-center">Total</b-th>
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-th colspan="2" class="text-center"></b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2" class="">Airfare/Ferry</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="3" class=""><underline-text :text="form.ferryExp"/></b-td>                       
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="1" class=""><underline-text :text="form.ferrySubExp"/></b-td>
                        <b-th colspan="1" class="text-center">+</b-th>                        
                        <b-td colspan="1" class=""><underline-text :text="form.ferryGST"/></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class="pr-4"><underline-text :text="form.ferryTotalExp"/></b-td> 
                        <b-th colspan="1" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="2" class=""></b-td>                        
                    </b-tr>
<!-- <Miscellaneous> -->
                    <b-tr>                        
                        <b-th colspan="6" class=""></b-th>
                        <b-td colspan="1" class=""></b-td>                        
                        <b-th colspan="1" class="text-center">Sub-Total</b-th>                                                 
                        <b-th colspan="1" class=""></b-th> 
                        <b-th colspan="1" class="text-center">GST</b-th>
                        <b-th colspan="1" class=""></b-th>      
                        <b-th colspan="2" class="pr-4 text-center">Total</b-th>
                        <b-th colspan="1" class="border-left border-dark"></b-th> 
                        <b-th colspan="2" class="text-center">Total Payable</b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2" class="">Miscellaneous</b-th>
                        <b-th colspan="1" class="text-right">$</b-th>
                        <b-td colspan="3" class=""><underline-text :text="form.miscExp"/></b-td>                       
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th>                         
                        <b-td colspan="1" class=""><underline-text :text="form.miscSubExp"/></b-td>
                        <b-th colspan="1" class="text-center">+</b-th>                        
                        <b-td colspan="1" class=""><underline-text :text="form.miscGST"/></b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-td colspan="2" class="pr-4"><underline-text :text="form.miscTotalExp"/></b-td> 
                        <b-th colspan="1" class="border-left border-dark text-right">$</b-th> 
                        <b-td colspan="2" class=""><underline-text :text="form.totalPayable"/></b-td>                        
                    </b-tr>
<!-- <Expenses Pre-GST> -->
                    <b-tr class="">                        
                        <b-th colspan="6" class=""></b-th>                        
                        <b-th colspan="3" class="pt-4 text-center">Expenses Pre-GST</b-th>
                        <b-th colspan="1" class="pt-4 text-center">Total GST</b-th>
                        <b-th colspan="1" class=""></b-th>      
                        <b-th colspan="2" class="pt-4 pr-4 text-center">Total Expenses</b-th>
                        <b-th colspan="1" class=""></b-th> 
                        <b-th colspan="2" class=""></b-th>                        
                    </b-tr>
                    <b-tr>
                        <b-th colspan="2" class=""></b-th>
                        <b-th colspan="1" class=""></b-th>
                        <b-td colspan="2" class=""></b-td>                       
                        <b-th colspan="2" class="text-right">Checks Totals</b-th>                         
                        <b-td colspan="1" class=""><underline-text :text="form.expPreGST"/></b-td>
                        <b-th colspan="1" class="text-center">+</b-th>                        
                        <b-td colspan="1" class=""><underline-text :text="form.expTotalGST"/></b-td>
                        <b-th colspan="1" class=""></b-th> 
                        <b-td colspan="2" class="pr-4"><underline-text :text="form.expTotal"/></b-td> 
                        <b-th colspan="1" class=""></b-th> 
                        <b-td colspan="2" class=""></b-td>                        
                    </b-tr>
<!-- <Total paid by> -->
                    <b-tr>
                        <b-td colspan="10" class=""></b-td>                        
                        <b-td colspan="3" class="pt-4 text-right"><b>Total paid by</b> Court Services</b-td>
                        <b-th colspan="1" class="pt-4 text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-th colspan="2" class="pt-4"><underline-text :text="form.totalPaidByCourt"/></b-th>                          
                    </b-tr>

                    <b-tr>
                        <b-td colspan="7" class=""></b-td>
                        <b-td colspan="3" class="text-right">Sent to Federal Crown</b-td>
                        <b-td colspan="3" class="text-right"><b>Total paid by</b> Federal Crown</b-td>
                        <b-th colspan="1" class="text-right"><div class="float-left">=</div><div class="float-right">$</div></b-th> 
                        <b-th colspan="2" class=""><underline-text :text="form.totalPaidByCrown"/></b-th>                          
                    </b-tr>
                
                </b-tbody>
            </b-table-simple>
        </b-card>
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';

import { bookingSearchInfoType } from '@/types/Bookings/json';
import UnderlineText from "./UnderlineText.vue"
import { paymentDetailsInfoType } from '@/types/Bookings';


@Component({
    components:{
        UnderlineText
    }
})
export default class AdmPaymentDetails extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType;
    
    form = {} as paymentDetailsInfoType
  
    dataReady = false;


    mounted(){
        this.dataReady = false;
        this.extractFormInfo()
        this.dataReady = true;
    }

    public extractFormInfo(){
        this.form = {
            courtHrRate:'63.16',
            courtTotalHrs:'120.0',
            courtTotal:'7579.20',
            courtPayableFee:'7579.20',

            travelHrRate:'',
            travelTotalHrs:'',
            travelTotal:'',
            travelPayableFee:'0.00',

            feesSubtotal:'7579.20',

            gstNumber:'708018684',
            gstRate:'0.05',

            feesGST:'378.96',
            feesTotal:'7,958.16',

            travelKMsRate:'0.55',
            travelTotalKMs:'150.0',
            travelSubExp:'82.50',
            travelTotalExp:'82.50',

            breakfastRate:'12.75',
            breakfastTotalDays:'16.0',
            breakfastSubExp:'204.00',
            breakfastTotalExp:'204.00',

            lunchRate:'14.75',
            lunchTotalDays:'16.0',
            lunchSubExp:'236.00',
            lunchTotalExp:'236.00',

            dinnerRate:'25.50',
            dinnerTotalDays:'16.0',
            dinnerSubExp:'408.00',
            dinnerTotalExp:'408.00',

            lodgingRate:'152.22',
            lodgingTotalDays:'',
            lodgingSubExp:'0.00',
            lodgingGST:'0.00',
            lodgingTotalExp:'0.00',

            ferryExp:'',
            ferrySubExp:'0.00',
            ferryGST:'0.00',
            ferryTotalExp:'0.00',

            miscExp:'',
            miscSubExp:'0.00',
            miscGST:'0.00',
            miscTotalExp:'0.00',

            expPreGST:'930.50',
            expTotalGST:'0.00',
            expTotal:'930.50',

            expPayable:'930.50',
            GSTifApplic:'0.00',
            totalExpenses:'930.50',
            totalPayable:'8,888.66',
            
            totalPaidByCourt:'',
            totalPaidByCrown:''
        }
        
    }


}
</script>

<style scoped lang="scss">
    .card{
        background: rgb(182, 210, 221);
        box-shadow: 2px 5px 5px 2px #DDD;
    }

    .labels {
        font-size: 12px; font-weight:600; line-height: 0.025rem; color: rgb(50, 50, 50);
    }

</style>