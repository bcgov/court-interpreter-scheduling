<template>
    <div v-if="dataReady">
        <b-card class="my-5">
            <h3 class="text-dark p-0 mt-n2 mb-n3">OfficeUseOnly</h3>
            <b-table-simple class="bg-white" borderless>
                <b-thead>
                    <b-tr  style="background:rgb(182, 210, 221);">
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:9%;"></b-th>
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:10%;"></b-th>
                        <b-th style="width:8%;"></b-th>
                        <b-th style="width:8%;"></b-th>                        
                    </b-tr>
                </b-thead>                               
                <b-tbody>
                    <b-tr>
                        <b-th colspan="3" class="border">Supplier Name</b-th>
                        <b-td colspan="3" class="border"></b-td>
                        <b-th colspan="2" class="border">Supplier No-Site No</b-th>
                        <b-td colspan="4" class="border"></b-td>                                    
                    </b-tr>

                    <b-tr>
                        <b-th colspan="3" class="border">Invoice Date</b-th>
                        <b-td colspan="3" class="border"></b-td>
                        <b-th colspan="2" class="border">Address Verified</b-th>
                        <b-td colspan="1" class="border"></b-td> 
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="2" class="border"></b-td>                                
                    </b-tr>

                    <b-tr>
                        <b-th colspan="3" class="border">Invoice Number</b-th>
                        <b-td colspan="3" class="border"></b-td>
                        <b-th colspan="2" class="border">Expense Authority Name</b-th>
                        <b-td colspan="4" class="border"></b-td>                                    
                    </b-tr>

                    <b-tr>
                        <b-th colspan="3" class="border">Qualified Receiver Name</b-th>
                        <b-td colspan="3" class="border"></b-td>
                        <b-th colspan="2" class="border">Invoice Total Amount</b-th>
                        <b-td colspan="4" class="border"></b-td>                                    
                    </b-tr>

                    <b-tr>
                        <b-th colspan="3" class="border">Contractor Number</b-th>
                        <b-td colspan="3" class="border"></b-td>
                        <b-th colspan="2" class="border">Pay Stub Comment</b-th>
                        <b-td colspan="4" class="border"></b-td>                                    
                    </b-tr>

                    <b-tr>
                        <b-th colspan="2"  rowspan="2" class="align-bottom border">Sub Total</b-th>                        
                        <b-th colspan="1"  rowspan="2" class="align-bottom border">GST</b-th>
                        <b-th colspan="1"  rowspan="2" class="align-bottom border">PST</b-th>
                        <b-th colspan="1"  rowspan="2" class="align-bottom border">CL</b-th>
                        <b-th colspan="1"  rowspan="2" class="align-bottom border">RESP</b-th>
                        <b-th colspan="1"  rowspan="2" class="align-bottom border">SL</b-th>
                        <b-th colspan="1" rowspan="2" class="align-bottom border">STOB</b-th>
                        <b-th colspan="1" rowspan="2" class="align-bottom border">PROJECT</b-th>
                        <b-th colspan="3" class="text-center border">COMMENTS</b-th>
                    </b-tr>
                    <b-tr>
                        <b-th colspan="1" class="border">Court File No</b-th>
                        <b-th colspan="2" class="border"></b-th>
                    </b-tr>

                    <b-tr>
                        <b-td colspan="2" class="border">$ 7,579.20</b-td>                        
                        <b-td colspan="1" class="border">$ 387.96</b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="2" class="border"></b-td>
                    </b-tr>

                    <b-tr>
                        <b-td colspan="2" class="border">$ 930.50</b-td>                        
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="1" class="border"></b-td>
                        <b-td colspan="2" class="border"></b-td>
                    </b-tr>

                    <b-tr>
                        <b-th colspan="3" class="border">Additional Instructions:</b-th>
                        <b-td colspan="9" class="border"></b-td>
                    </b-tr>



                
                </b-tbody>
            </b-table-simple>
        </b-card>
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';

import { bookingSearchResultInfoType } from '@/types/Bookings/json';



@Component
export default class AdmOfficeUseOnly extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    

  
    dataReady = false;


    mounted(){
        this.dataReady = false;
        
        this.dataReady = true;
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