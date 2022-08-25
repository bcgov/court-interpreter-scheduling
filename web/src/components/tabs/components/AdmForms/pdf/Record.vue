<template>
    <div v-if="dataReady" class="mt-2">
        <div v-for="slicedRecord,inx in slicedRecords" :key="'tbl-cont-'+inx" :class="inx>0? 'margintop0p5':''"> 
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
                    <td style="width:7%;" class="text-center"><b class="">Start Time</b></td>
                    <td style="width:0.75%;" />
                    <td style="width:7%;" class="text-center"><b class="">Finish Time</b></td>
                    <td style="width:1%;" />
                    <td style="width:10.5%;" class="text-center"><b class="">Approver's</b><div class="mt-0"><b>Initials</b></div></td>                        
                    <td /> 
                </tr>
                
                <tbody v-for="record,indx in slicedRecord" :key="'record-table-'+indx">
                    <tr><td class="text-white">.</td></tr>                        
                    <tr class="spacer">
                        <td />
                        <td  colspan="17" style="border-top:1px solid #DDD; border-bottom:1px solid #DDD;" />
                        <td />
                    </tr>
                    <tr><td class="text-white">.</td></tr>                  
                    <tr>
                        <td />
                        <td style="width:9%;" class="border-bottom text-center"><div class="answer-record">{{record.date|iso-date}}</div></td>                                              
                        <td style="width:1%;" />
                        <td style="width:14%;" class="border-bottom text-center"><div class="answer-record">{{record.file}}</div></td>
                        <td style="width:1%;" />
                        <td style="width:20%;" class="border-bottom text-center"><div class="answer-record">{{record.caseName}}</div></td>
                        <td style="width:1%;" />
                        <td style="width:6%;" class="border-bottom text-center"><div class="answer-record">{{record.reasonCd}} </div></td>
                        <td style="width:1%;" />
                        <td style="width:4%;" class="border-bottom text-center"><div class="answer-record">{{record.federalYN}}</div></td>
                        <td style="width:1%;" />
                        <td style="width:14%;" class="border-bottom text-center"><div class="answer-record">{{record.room}}</div></td>
                        <td style="width:1%;" />
                        <td style="width:7%;" class="border-bottom text-center">                            
                            <div v-if="admApproved" class="answer-record-sm">{{record.actualStartTime}}</div>
                            <b-form-input disabled :id="'interactive-text-'+(inx*100+indx)+'-start'" v-else style="font-size:9px; margin-left:-0.25rem; width:115%; height:1.05rem; background:#EFF6FF; color:#00F;" :alt="record['startTime']" /></td>
                        <td style="width:0.75%;" />
                        <td style="width:7%;" class="border-bottom text-center">
                            <div v-if="admApproved" class="answer-record-sm">{{record.actualFinishTime}}</div>
                            <b-input disabled :id="'interactive-text-'+(inx*100+indx)+'-finish'" v-else style="font-size:9px; margin-left:-0.15rem; width:115%; height:1.05rem; background:#EFF6FF; color:#00F;" :alt="record['finishTime']"/></td>
                        <td style="width:1%;" />
                        <td style="width:10.5%;" class="border-bottom text-center">
                            <div v-if="admApproved" class="answer-record">{{record.approversInitials}}</div>
                            <b-input disabled :id="'interactive-text-'+(inx*100+indx)+'-initials'" v-else style="font-size:9px; margin-left:-0.15rem; width:105%; height:1.05rem; background:#EFF6FF; color:#00F;"/></td>                        
                        <td /> 
                    </tr>
                    <tr style="font-size:6pt; " class="m-0 p-0">
                        <td class="m-0 p-0" colspan="19">
                            <div class="row m-0 p-0">
                                <div style="width:80%">
                                    <table class="flexsize mt-1 p-0">
                                        <tr>
                                            <td style="width:40%;"><b class="ml-1">Registry: </b><div class="answer-record-sm">{{record.registry|truncate-text(25)}}</div></td>                                        
                                            <td style="width:20%;"><b>Requested By: </b><div class="answer-record-sm">{{record.requestedBy}}</div></td>
                                            <td style="width:10%;"><b>Bilingual: </b><div class="answer-record-sm">{{record.bilingualYN}}</div></td>
                                            <td style="width:30%;"><b>Court Level: </b><div class="answer-record-sm">{{record.courtLevel}}</div></td>
                                        </tr>
                                        <tr>
                                            <td><b class="ml-1">Prosecutor: </b><div class="answer-record-sm">{{record.prosecutor|truncate-text(25)}}</div> </td>
                                            <td><b>Reason Code: </b><div class="answer-record-sm">{{record.reasonCd}}</div> </td>
                                            <td colspan="2"><b>Reason Desc: </b><div class="answer-record-sm">{{record.reasonDesc|truncate-text(25)}}</div> </td>
                                        </tr>    
                                        <tr>
                                            <td><b class="ml-1">Method Of Appearance: </b><div class="answer-record-sm">{{record.methodOfAppearance}}</div></td>
                                            <td><b>Case Type: </b><div class="answer-record-sm">{{record.caseType}}</div></td>
                                            <td colspan="2"><b>Court Class: </b><div class="answer-record-sm">{{record.courtClass|truncate-text(29)}}</div></td>
                                        </tr>
                                        
                                        <tr>
                                            <td colspan="4"><b class="ml-1">Comment: </b><div class="answer-record-sm">{{record.comment}}</div> </td>
                                        </tr>
                                    </table>
                                </div>
                                <div style="width:19.5%">
                                    <b-table
                                        class="mt-1 mb-0 border"
                                        style="font-size:6pt;"
                                        :items="record.languages"
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
import { bookingAdmRecordInfoType, bookingSearchResultInfoType } from '@/types/Bookings/json';
import {reasonCodeClass} from '../../BookingEnums'
import * as _ from 'underscore';
import moment from 'moment';

@Component
export default class Record extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    

    languageFields = [
        {key:'language',     label:'Language',    thStyle:'width:55%', thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'level',        label:'Lvl.',        thStyle:'width:10%', thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},        
        {key:'interpretFor', label:'Interp. For', thStyle:'width:35%', thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},               
    ];

    records: bookingAdmRecordInfoType[] = []
    slicedRecords: bookingAdmRecordInfoType[][]=[]
    
    dataReady=false
    admApproved=false

    mounted(){
        this.dataReady=false        
        this.extractInfo()
        this.dataReady=true
    }

    public extractInfo(){
        this.admApproved = this.booking.recordsApproved
        this.records = []
        this.slicedRecords =[]
        for(const date of this.booking.dates){
            const record: bookingAdmRecordInfoType = JSON.parse(JSON.stringify(date))
           
            record.reasonCd = date.reason?.includes('OTHER__')? 'Other' :date.reason;
            record.reasonDesc=date.reason?.includes('OTHER__')? date.reason.replace('OTHER__','') :reasonCodeClass[date.reason];
            record.courtClassDesc= date.courtClass?.includes('OTHER__')? (date.courtClass.replace('OTHER__','')+' (other)') : date.courtClass;
            record.date = moment(date.date.slice(0,10)+' '+date.startTime,'YYYY-MM-DD HH:mm A' ).format()
            record.federalYN = date.federal? 'Yes' : 'No'
            record.bilingualYN = date.bilingual? 'Yes' : 'No'            
            record.actualStartTimeState=null;            
            record.actualFinishTimeState=null;            
            record.approversInitialsState=null;            
            
            if(record.status=="Booked")
                this.records.push(record)
        }

        if(this.records.length==0){
            const record = {} as bookingAdmRecordInfoType            
            this.slicedRecords.push([record]) 
            return
        }

        this.records = _.sortBy(this.records,'date')       

        this.slicedRecords.push(this.records.slice(0,4))

        for(let index=4; index<this.records.length; index+=5)
            this.slicedRecords.push(this.records.slice(index,(index+5)))
        
    }   
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
