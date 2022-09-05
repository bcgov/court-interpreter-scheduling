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
                    <td class="border-bottom "><div class="answer-record">{{interpreterName}}</div></td>                                             
                    <td class="border-bottom border-left text-center"><div class="answer-record">{{getDate('I','Y')}}</div></td>
                    <td class="border-bottom border-left text-center"><div class="answer-record">{{getDate('I','M')}}</div></td>
                    <td class="border-bottom border-left border-right text-center"><div class="answer-record">{{getDate('I','D')}}</div></td>
                    <td class=""></td>
                    <td class="border-bottom"><div class="answer-record">{{qualifiedReceiverName}}</div></td>                                                                 
                    <td class="border-bottom border-left text-center"><div class="answer-record"> {{getDate('Q','Y')}}</div></td>
                    <td class="border-bottom border-left text-center"><div class="answer-record">{{getDate('Q','M')}}</div></td>
                    <td class="border-bottom border-left border-right text-center"><div class="answer-record">{{getDate('Q','D')}}</div></td>
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
                    <td class="border-bottom"></td>                                              
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
import { bookingSearchResultInfoType } from '@/types/Bookings/json';

@Component
export default class Authorizations extends Vue {
    
    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    
    dataReady = false;
    interpreterName = ""
    interpreterSigned = false    
    interpreterSigningDate = ""
    qualifiedReceiverSigned = false
    qualifiedReceiverName = ""
    qualifiedReceiverSigningDate =""

    mounted(){        
        this.dataReady = false;       
        this.extractInfo();
        this.dataReady = true;
    }

    public extractInfo(){
        const recordApproved = this.booking.recordsApproved
        this.interpreterSigned = recordApproved && this.booking.interpreterSigned
        this.interpreterName = this.interpreterSigned? this.booking.interpreter.fullName :''
        this.interpreterSigningDate = this.interpreterSigned? this.booking.interpreterSigningDate :''

        this.qualifiedReceiverSigned = recordApproved && this.booking.qualifiedReceiverSigned
        this.qualifiedReceiverSigningDate =this.qualifiedReceiverSigned? this.booking.qualifiedReceiverSigningDate :''
        this.qualifiedReceiverName = this.qualifiedReceiverSigned? this.booking.approverName:''
    }

    public getDate(dateType, type){
        let date=''
        if(dateType=='Q')
            date = this.qualifiedReceiverSigningDate
        else
            date = this.interpreterSigningDate

        if(date && date.length>=10){
            if(type=='Y')
                return date.slice(0,4)
            else if(type=='M')
                return date.slice(5,7)
            else if(type=='D')
                return date.slice(8,10)    
        }
        else
            return ''
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
