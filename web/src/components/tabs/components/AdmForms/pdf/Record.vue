<template>
    <div class="mt-2">
        <div v-for="j,inx in [1]" :key="j" :class="inx>0? 'margintop0p5':''"> 
            <table  class="print-block flexsize border border-dark m-0 p-0">
                <tr style="font-size:9pt; " class="m-0 p-0">
                    <td class="m-0 p-0" colspan="19"><div style="font-size:12pt;" class="ml-1 font-weight-bold">3 Record <span v-if="inx>0">(continued)</span></div></td>                        
                </tr> 
                
                <tr style="font-size:7pt; background-color:#EEE;" class="m-0 p-0" >
                    <td />
                    <td style="width:9%;" class="text-center"><b class="ml-1 text-center">Date</b><div class="ml-1 mt-0" style="font-size:5pt;" ><i>YYYY-MM-DD</i></div></td>                                              
                    <td style="width:1%;" />
                    <td style="width:14%;" class="text-center"><b class="">Court File Number</b></td>
                    <td style="width:1%;" />
                    <td style="width:20%;" class="text-center"><b class="">Case Name</b></td>
                    <td style="width:1%;" />
                    <td style="width:6%;" class="text-center"><b class="">Reason</b></td>
                    <td style="width:1%;" />
                    <td style="width:4%;" class="text-center"><b class="">Fed.</b></td>
                    <td style="width:1%;" />
                    <td style="width:14%;" class="text-center"><b class="">Court Room</b></td>
                    <td style="width:1%;" />
                    <td style="width:8%;" class="text-center"><b class="">Start Time</b></td>
                    <td style="width:1%;" />
                    <td style="width:8%;" class="text-center"><b class="">Finish Time</b></td>
                    <td style="width:1.5%;" />
                    <td style="width:8%;" class="text-center"><b class="">Approver's</b><div class="mt-0"><b>Initials</b></div></td>                        
                    <td /> 
                </tr>
                
                <tbody v-for="i in [1,2,3]" :key="i">
                    <tr><td class="text-white">.</td></tr>                        
                    <tr class="spacer">
                        <td />
                        <td  colspan="17" style="border-top:1px solid #DDD; border-bottom:1px solid #DDD;" />
                        <td />
                    </tr>
                    <tr><td class="text-white">.</td></tr>                  
                    <tr>
                        <td />
                        <td style="width:9%;" class="border-bottom text-center"><div class="answer-record">2022-04-26</div></td>                                              
                        <td style="width:1%;" />
                        <td style="width:14%;" class="border-bottom text-center"><div class="answer-record">CS20201115</div></td>
                        <td style="width:1%;" />
                        <td style="width:20%;" class="border-bottom text-center"><div class="answer-record">New case VS old Case</div></td>
                        <td style="width:1%;" />
                        <td style="width:6%;" class="border-bottom text-center"><div class="answer-record">Other</div></td>
                        <td style="width:1%;" />
                        <td style="width:4%;" class="border-bottom text-center"><div class="answer-record">Yes</div></td>
                        <td style="width:1%;" />
                        <td style="width:14%;" class="border-bottom text-center"><div class="answer-record">Malcolm Rowe</div></td>
                        <td style="width:1%;" />
                        <td style="width:8%;" class="border-bottom text-center"><div class="answer-record">09:45 AM</div></td>
                        <td style="width:1%;" />
                        <td style="width:8%;" class="border-bottom text-center"><div class="answer-record">12:30 PM</div></td>
                        <td style="width:1%;" />
                        <td style="width:8%;" class="border-bottom text-center"><div class="answer-record">A.B.C.D.E.</div></td>                        
                        <td /> 
                    </tr>
                    <tr style="font-size:6pt; " class="m-0 p-0">
                        <td class="m-0 p-0" colspan="19">
                            <div class="row m-0 p-0">
                                <div style="width:80%">
                                    <table class="flexsize mt-1 p-0">
                                        <tr>
                                            <td style="width:40%;"><b class="ml-1">Registry: </b><div class="answer-record-sm">100 Mile House Law Courts</div></td>                                        
                                            <td style="width:20%;"><b>Requested By: </b><div class="answer-record-sm">Court</div></td>
                                            <td style="width:10%;"><b>Bilingual: </b><div class="answer-record-sm">No</div></td>
                                            <td style="width:30%;"><b>Court Level: </b><div class="answer-record-sm">Court of Appeal</div></td>
                                        </tr>
                                        <tr>
                                            <td><b class="ml-1">Prosecutor: </b><div class="answer-record-sm">{{'Prosecutor Name'|truncate-text(25)}}</div> </td>
                                            <td><b>Reason Code: </b><div class="answer-record-sm">Other</div> </td>
                                            <td colspan="2"><b>Reason Desc: </b><div class="answer-record-sm">{{'Family Law Proceeding(Divorce Act and Family Law Act)'|truncate-text(25)}}</div> </td>
                                        </tr>    
                                        <tr>
                                            <td><b class="ml-1">Method Of Appearance: </b><div class="answer-record-sm">Via Teleconference</div></td>
                                            <td><b>Case Type: </b><div class="answer-record-sm">Civil</div></td>
                                            <td colspan="2"><b>Court Class: </b><div class="answer-record-sm">{{'Family Law Proceeding(Divorce Act and Family Law Act)'|truncate-text(29)}}</div></td>
                                        </tr>
                                        
                                        <tr>
                                            <td colspan="4"><b class="ml-1">Comment: </b><div class="answer-record-sm"> Some comments.</div> </td>
                                        </tr>
                                    </table>
                                </div>
                                <div style="width:19.5%">
                                    <b-table
                                        class="mt-1 mb-0 border"
                                        style="font-size:6pt;"
                                        :items="languages"
                                        :fields="languageFields"                    
                                        small
                                        borderless>                                        
                                        <template v-slot:cell(language)="data" >
                                            {{data.value|truncate-text(14)}}
                                        </template>
                                    </b-table>
                                </div>
                            </div>
                        </td>                        
                    </tr>                        
                </tbody>
                <tr><td></td></tr>                                                
            </table>
        </div>  
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class Record extends Vue {

    // @Prop({required: true})
    // booking!: bookingSearchResultInfoType;
    // update = 0

    languageFields = [
        {key:'language',     label:'Language',    thStyle:'width:55%', thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'level',        label:'Lvl.',        thStyle:'width:10%', thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},        
        {key:'interpretFor', label:'Interp. For', thStyle:'width:35%', thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},               
    ];

    languages =[
        {language:"Language1",level:2, interpretFor:'Party'},
        {language:"Language2",level:1, interpretFor:'Witness'},
        {language:"Language3",level:3, interpretFor:'Accused'}
    ]

    mounted(){        
       //
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
