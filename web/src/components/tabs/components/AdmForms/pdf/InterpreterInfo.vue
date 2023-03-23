<template>
    <div v-if="dataReady" class="margintop0p5">       
        <b-row class="m-0 p0">
                <table class="flexsize border border-dark m-0 p-0">
                    <tr style="font-size:9pt; " class="m-0 p-0">
                        <td class="m-0 p-0"><div style="font-size:12pt;" class="ml-1 font-weight-bold">1 Interpreter Information</div></td>                        
                    </tr> 
                    <tr style="font-size:7pt; line-height:1.25rem;" >
                        <td style="width:60%;"><b class="ml-1">Name/Agency</b> (must be the same name that appears on Interpreter Contract)</td>                                              
                        <td style="width:2%;" />
                        <td style="width:4%;"><b class="">Level</b></td>
                        <td style="width:2%;" />
                        <td style="width:13%;"><b class="">Multiple Languages</b></td>
                        <td style="width:2%;" />
                        <td style="width:17%;"><b class="">Telephone Number</b></td>
                    </tr>
                    <tr style="height:1.5rem;" >
                        <td class="border-bottom"><div class="answer ml-1">{{interpreterName}}</div> </td>
                        <td />
                        <td class="border-bottom"><div class="answer">{{languageLevel}}</div> </td>
                        <td />
                        <td class="border-bottom"><div class="answer">{{multipleLanguages}}</div> </td>
                        <td />
                        <td class="border-bottom"><div class="answer">{{phone}}</div> </td>
                    </tr>
                    <tr style="font-size:7pt; line-height:1.25rem;" >
                        <td style="width:60%;"><b class="ml-1">Address</b></td>                       
                        <td style="width:2%;" />
                        <td style="width:4%;" />
                        <td style="width:2%;" />
                        <td style="width:13%;"><b>Email</b></td>
                        <td style="width:2%;" />
                        <td style="width:17%;"/>
                    </tr>

                    <tr style="height:1.0rem;" >
                        <td ><div class="answer ml-1">{{address}}</div> </td>
                        <td />
                        <td />
                        <td />
                        <td colspan="3" ><div class="answer" v-html="email">{{email}}</div> </td>                        
                    </tr>
                </table>
        </b-row>           
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { bookingSearchResultInfoType } from '@/types/Bookings/json';


@Component
export default class InterpreterInfo extends Vue {
    
    @Prop({required: true})
    booking!: bookingSearchResultInfoType;

    dataReady = false;
    interpreterName = ""
    languageLevel = 0
    multipleLanguages =""
    phone=""
    address=""
    email=""

    mounted(){        
        this.dataReady = false;
        this.extractInfo()
        this.dataReady = true;
    }

    public extractInfo(){
        this.interpreterName = this.booking.interpreter.fullName
        this.languageLevel = this.booking.level
        this.multipleLanguages = this.booking.multipleLanguages
        this.phone = this.booking.interpreter.phone? Vue.filter('beautify-phone-no')(this.booking.interpreter.phone) :''
        this.address = this.booking.interpreter.fullAddress
        this.email = this.booking.interpreter.email.replace(',', '<br>')
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
