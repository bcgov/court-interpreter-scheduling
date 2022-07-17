<template>
    <div class="mt-2">       
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
                        <td class="border-bottom"><div class="answer ml-1">ABBAS, SOLEYMAN SALEH</div> </td>
                        <td />
                        <td class="border-bottom"><div class="answer">2</div> </td>
                        <td />
                        <td class="border-bottom"><div class="answer">Yes</div> </td>
                        <td />
                        <td class="border-bottom"><div class="answer">604 123 4568</div> </td>
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
                        <td ><div class="answer ml-1">5780 BLUNDELL RD, RICHMOND, BC, V7C1H5</div> </td>
                        <td />
                        <td />
                        <td />
                        <td colspan="3" ><div class="answer">abbass.soleyman@tlus.ca</div> </td>                        
                    </tr>
                </table>
        </b-row>           
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {srcFile} from './logo'

@Component
export default class InterpreterInfo extends Vue {
    src =""
    // @Prop({required: true})
    // booking!: bookingSearchInfoType;
    // update = 0


    mounted(){        
        this.src = srcFile
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
