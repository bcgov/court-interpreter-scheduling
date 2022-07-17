<template>
    <div>       
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
                        <td class="border border-dark text-center"><div class="answer-record">2045</div></td>
                        <td class="border border-dark text-center"><div class="answer-record">2045ABBS0JAN00</div></td>
                        <td class="border border-dark text-center"><div class="answer-record">YYYY-MM-DD</div></td> <!-- {{currentDate}} -->
                           
                    </tr>
                </table>
            </div>
        </b-row>           
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {srcFile} from './logo'
import moment from 'moment-timezone'

@Component
export default class AdmHeader extends Vue {
    src =""
    // @Prop({required: true})
    // booking!: bookingSearchInfoType;
    // update = 0
    currentDate=""

    mounted(){        
        this.src = srcFile
        this.currentDate=moment().format("YYYY-MM-DD")
    }
    
}
</script>
<style scoped lang="scss" src="@/styles/_pdf.scss">
.fullsize > tr{
    color:red;
} 
</style>
