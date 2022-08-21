<template>
    <div v-if="dataReady">       
        <b-row class="m-0 p0">
            
            <div style="width:5%;" />
            
            <div style="margin:-0.35rem 0 0 0rem; width:10% ">
                <div style="width:60px">
                    <img 
                        :src="src"                                                         
                        alt="B.C. Gov"/>
                </div>
            </div>
            
            <div class="text-center" style="font-size:12pt; color:0; margin:0.35rem 0 0 0rem; width:35%;" >
                COURT INTERPRETER REQUEST AND RECORD
            </div>
            <div style="width:5%;" />
            <div style=" margin:0rem 0 0 0; width:45%;" >
                <table class="flexsize border m-0 p-0">
                    <tr style="font-size:9pt; border:1px solid #414142;" class="m-0 p-0">
                        <td colspan="3" class="m-0 p-0"><div class="text-center font-weight-bold">Control/Invoice No. </div></td>                        
                    </tr>                   
                    <tr style="font-size:7pt; border:1px solid #414142;" >
                        <td style="width:25%;" class="border border-dark text-center">Registry #</td>
                        <td style="width:45%;" class="border border-dark text-center">Invoice # </td>
                        <td style="width:30%;" class="border border-dark text-center">Invoice Date </td>
                    </tr>
                    <tr style="border:1px solid #414142; height:1.5rem;" >
                        <td class="border border-dark text-center"><div class="answer-record">{{registry}}</div></td>
                        <td class="border border-dark text-center"><div class="answer-record">{{invoiceNum}}</div></td>
                        <td class="border border-dark text-center"><div class="answer-record">{{invoiceDate}}</div></td> <!-- {{currentDate}} -->
                           
                    </tr>
                </table>
            </div>
        </b-row>           
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {srcFile} from './logo'
import { bookingSearchResultInfoType } from '@/types/Bookings/json';
import { locationsInfoType } from '@/types/Common/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component
export default class AdmHeader extends Vue {
    
    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    
    @commonState.State
    public courtLocations!: locationsInfoType[];
    
    dataReady = false;
    registry=""
    invoiceNum=""
    invoiceDate=""
    src =""
    
    mounted(){
        this.dataReady = false;        
        this.src = srcFile;
        this.invoiceNum = this.booking.invoiceNumber;
        this.invoiceDate = this.booking.invoiceDate;        
        const location = this.courtLocations.filter(loc => loc.id==this.booking.location_id)
        if(location.length==1){                
            this.registry = location[0].shortDescription
        }
        this.dataReady = true;
    }    
}
</script>
<style scoped lang="scss" src="@/styles/_pdf.scss">
.fullsize > tr{
    color:red;
} 
</style>
