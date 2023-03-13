<template>
    <div v-if="dataReady" class="mt-2">
        <div v-for="slicedRecord,inx in slicedRecords" :key="'tbl-cont-'+inx" :class="inx>0? 'margintop0p5':''"> 
            <table  class="print-block flexsize border border-dark m-0 p-0">
                <tr style="font-size:12pt; " class="m-0 p-0">
                    <td class="m-0 p-0" colspan="13"><div class="ml-1 font-weight-bold">3 Record <span v-if="inx>0">(continued)</span></div></td>                        
                </tr> 
                
                <tr style="font-size:7pt; background-color:#EEE;" class="m-0 p-0" >
                    <td style="width:0.5%;"/>
                    <td style="width:10%;" class="text-center"><b class="ml-1 text-center">Date</b><div class="ml-1 mt-0" style="font-size:5pt;" ><i>YYYY-MM-DD</i></div></td>                                              
                    <td style="width:1%;" />
                    <td style="width:16%;" class="text-center"><b class="">Method of Appearance</b></td>
                    <td style="width:1%;" />
                    <td style="width:41%;" class="text-center"><b class="">Comment</b></td>
                    <td style="width:1%;" />                                                            
                    <td style="width:8%;" class="text-center"><b class="">Start Time</b></td>
                    <td style="width:1%;" />
                    <td style="width:8%;" class="text-center"><b class="">Finish Time</b></td>
                    <td style="width:1%;" />
                    <td style="width:11%;" class="text-center"><b class="">Approver's</b><div class="mt-0"><b>Initials</b></div></td>                        
                    <td style="width:0.5%;"/> 
                </tr>
                
                <tbody v-for="record,indx in slicedRecord" :key="'record-table-'+indx">
                    <tr style="line-height:0.25rem; height:0.25rem;" ><td class="text-white">.</td></tr>                        
                    <tr class="spacer">
                        <td />
                        <td colspan="11" style="border-top:1px solid #DDD; " />
                        <td />
                    </tr>
                    <!-- <tr><td class="text-white">.</td></tr>                   -->
                    <tr>
                        <td />
                        <td  class="border-bottom text-center"><div class="answer-record">{{record.date|iso-date}}</div></td>                                              
                        <td />
                        <td  class="border-bottom text-center"><div class="answer-record">{{record.methodOfAppearance}}</div></td>
                        <td  />
                        <td  class="border-bottom text-center"><div class="answer-record" style="font-size:7pt;">{{record.comment | truncate-text(64)}}</div></td>
                        <td  />                        
                        <td  class="border-bottom text-center">                            
                            <div v-if="admApproved" class="answer-record-sm">{{record.actualStartTime}}</div>
                            <b-form-input disabled :id="'interactive-text-'+(inx*100+indx)+'-start'" v-else style="font-size:9px; margin-left:-0.25rem; width:115%; height:1.05rem; background:#EFF6FF; color:#00F;" :alt="record['startTime']" /></td>
                        <td  />
                        <td  class="border-bottom text-center">
                            <div v-if="admApproved" class="answer-record-sm">{{record.actualFinishTime}}</div>
                            <b-input disabled :id="'interactive-text-'+(inx*100+indx)+'-finish'" v-else style="font-size:9px; margin-left:-0.15rem; width:115%; height:1.05rem; background:#EFF6FF; color:#00F;" :alt="record['finishTime']"/></td>
                        <td  />
                        <td  class="border-bottom text-center">
                            <div v-if="admApproved" class="answer-record">{{record.approversInitials}}</div>
                            <b-input disabled :id="'interactive-text-'+(inx*100+indx)+'-initials'" v-else style="font-size:9px; margin-left:-0.15rem; width:105%; height:1.05rem; background:#EFF6FF; color:#00F;"/></td>                        
                        <td /> 
                    </tr>
                    <tr style="font-size:6pt; " class="m-0 p-0">
                        <td />
                        <td class="m-0 p-0" colspan="11">
                            <b-table
                                class="mt-1 mb-0 border"
                                style="font-size:6pt;"
                                :items="record.cases"
                                :fields="caseFields"                    
                                small
                                borderless>                                        
                                <template v-slot:cell(language)="data" >
                                    {{'('+data.value.level+') '+data.value.languageName |truncate-text(14,true)}}
                                </template>
                                <template v-slot:cell(caseName)="data" >
                                    {{data.value |truncate-text(10, true)}}
                                </template>
                                <template v-slot:cell(courtClass)="data" >
                                    {{data.value |truncate-text(20, true)}}
                                </template>
                                <template v-slot:cell(prosecutor)="data" >
                                    {{data.value |truncate-text(20, true)}}
                                </template>
                                <template v-slot:cell(federal)="data" >
                                    {{data.value?'Yes':'No'}}
                                </template>
                                <template v-slot:cell(interpretationMode)="data" >                            
                                    {{data.item.bilingual? data.value:'No'}}
                                </template>
                                <template v-slot:cell(remoteRegistry)="data" >
                                    {{data.value |truncate-text(20, true)}}
                                </template>
                            </b-table>                                
                        </td>
                        <td />                        
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

import * as _ from 'underscore';
import moment from 'moment';

@Component
export default class Record extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;

    @Prop({required: true})
    lastPageAdmItemsNum!: any;
    

    caseFields = [       
        {key:'file',           label:'File#',        thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'caseName',       label:'Case Name',    thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'room',           label:'Room',         thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'language',       label:'Language',     thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'interpretFor',   label:'Intpr. For',   thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'caseType',       label:'Type',         thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'courtLevel',     label:'Court Level',  thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'courtClass',     label:'Court Class',  thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'requestedBy',    label:'Req. By',      thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},      
        {key:'reason',         label:'Rsn.',         thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},      
        {key:'methodOfAppearance',label:'Appearance',thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},        
        {key:'federal',        label:'Fed.',         thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'prosecutor',     label:'Prosecutor',   thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'interpretationMode',label:'Bilingual', thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'remoteRegistry', label:'Remote',       thClass:'bg-light align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        
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
           
            // record.reasonCd = date.reason?.includes('OTHER__')? 'Other' :date.reason;
            // record.reasonDesc=date.reason?.includes('OTHER__')? date.reason.replace('OTHER__','') :reasonCodeClass[date.reason];
            // record.courtClassDesc= date.courtClass?.includes('OTHER__')? (date.courtClass.replace('OTHER__','')+' (other)') : date.courtClass;
            record.date = moment(date.date.slice(0,10)+' '+date.startTime,'YYYY-MM-DD HH:mm A' ).format()                      
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


        const pageCapacity=[40, 52]        
        let pageNum=0
        let pageItem = 5 // per page
        const slicedRecords = []
        for(const record of this.records){            
            pageItem +=3 //per case
            pageItem += record.cases.length
            // console.log(pageItem)
            if(pageItem <= pageCapacity[pageNum>0?1:0]){
                slicedRecords.push(record)
            }else{
                this.slicedRecords.push(JSON.parse(JSON.stringify(slicedRecords)))
                slicedRecords.splice(0)
                pageNum++;
                pageItem = 5+3+record.cases.length
                // console.error(pageItem)
                slicedRecords.push(record)
            }
        }
        if(slicedRecords.length>0){
            this.slicedRecords.push(JSON.parse(JSON.stringify(slicedRecords)))
            slicedRecords.splice(0)
        }
        // console.log(slicedRecords)
        pageItem += 12*(pageNum==0?1:0)
        this.lastPageAdmItemsNum.num=pageItem
        // console.log(pageItem)
        
    }   
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
