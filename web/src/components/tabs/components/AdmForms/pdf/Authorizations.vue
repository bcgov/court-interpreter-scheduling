<template>
    <div class="mt-2">
        <div v-for="j,inx in [1]" :key="j" :class="inx>0? 'margintop0p5':''"> 
            <table  class="print-block flexsize border border-dark m-0 p-0">
                <tr style="font-size:9pt; " class="m-0 p-0">
                    <td class="m-0 p-0" colspan="19"><div style="font-size:12pt;" class="ml-1 font-weight-bold">6 Authorizations</div></td>                        
                </tr> 
                
                <tr style="font-size:6pt;height:0.5rem;line-height:0.5rem;">
                    <td />
                    <td style="width:45%;" class=""></td>                                            
                    <td style="width:3.5%;" class="border-left text-center"><i>YYYY</i></td>
                    <td style="width:2.5%;" class="text-center"><i>MM</i></td>
                    <td style="width:2.5%;" class="border-right text-center"><i>DD</i></td>                    
                    <td style="width:1%;" class=""></td> 
                    <td style="width:35%;" class=""></td>                                            
                    <td style="width:3.5%;" class="border-left text-center"><i>YYYY</i></td>
                    <td style="width:2.5%;" class="text-center"><i>MM</i></td>
                    <td style="width:2.5%;" class="border-right text-center"><i>DD</i></td>
                    <td /> 
                </tr>

                <tr style="font-size:8pt;height:2rem;line-height:1.5rem;" >
                    <td />
                    <td class="border-bottom "></td>                                             
                    <td class="border-bottom border-left text-center"><div class="answer-record">2020</div></td>
                    <td class="border-bottom border-left text-center"><div class="answer-record">01</div></td>
                    <td class="border-bottom border-left border-right text-center"><div class="answer-record">01</div></td>
                    <td class=""></td>
                    <td class="border-bottom"></td>                                                                 
                    <td class="border-bottom border-left text-center"><div class="answer-record">2021</div></td>
                    <td class="border-bottom border-left text-center"><div class="answer-record">12</div></td>
                    <td class="border-bottom border-left border-right text-center"><div class="answer-record">31</div></td>
                    <td /> 
                </tr>

                <tr style="font-size:8pt;height:1rem;line-height:1rem;" >
                    <td />
                    <th class="">Interpreter’s Signature</th>                                              
                    <td class=""></td>
                    <td class=""></td>
                    <td class=""></td>
                    <td class=""></td>
                    <th class="">Qualified Receiver</th>                                              
                    <td class=""></td>
                    <td class=""></td>
                    <td class=""></td>
                    <td /> 
                </tr>

                <tr style="font-size:7pt;height:1rem;line-height:1rem;" >
                    <td />
                    <td class="">
                        I certify this is a true statement of disbursements made a entitled as a result of 
                        travel on government business as have not been and will not be</td>                                              
                    <td class=""></td>
                    <td class=""></td>
                    <td class=""></td>
                    <td class=""></td>
                    <th class="border-bottom"></th>                                              
                    <td class="border-bottom"></td>
                    <td class="border-bottom"></td>
                    <td class="border-bottom"></td>
                    <td /> 
                </tr>

                <tr style="font-size:8pt;height:0.7rem;line-height:0.7rem;" >
                    <td />
                    <td class="" style="font-size:7pt"> reimbursed by any other party</td>                                             
                    <td class=""></td>
                    <td class=""></td>
                    <td class=""></td>
                    <td class=""></td>
                    <th class="" style="line-height:1rem;">Print Name</th>                                              
                    <td class=""></td>
                    <td class=""></td>
                    <td class=""></td>
                    <td /> 
                </tr>
                
                                                              
            </table>
        </div>  
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class Authorizations extends Vue {

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
