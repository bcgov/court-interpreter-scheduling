<template>
    <div class="mt-2">
        <div v-for="j,inx in [1]" :key="j" :class="inx>0? 'margintop0p5':''"> 
            <table  class="print-block flexsize border border-dark m-0 p-0">
                <tr style="font-size:9pt; " class="m-0 p-0">
                    <td class="m-0 p-0" colspan="19"><div style="font-size:12pt;" class="ml-1 font-weight-bold">5 Payment Details</div></td>                        
                </tr>                       
                <tr style="font-size:8pt; " class="m-0 p-0">
                    <td class="m-0 p-0" colspan="19">                        
                        <payment-fees />
                        <payment-expenses />
                    </td>                        
                </tr>                       
                                                           
            </table>
        </div>  
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import PaymentFees from './PaymentTables/PaymentFees.vue'
import PaymentExpenses from './PaymentTables/PaymentExpenses.vue'

@Component({
    components:{
        PaymentFees,
        PaymentExpenses
    }
})
export default class PaymentDetails extends Vue {

    // @Prop({required: true})
    // booking!: bookingSearchResultInfoType;
    // update = 0


    mounted(){        
       //
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
