<template>
    <div v-if="dataReady" class="mt-2">
        <div v-for="slicedRecord,inx in slicedRecords" :key="'tbl-cancel-cont-'+inx" :class="inx>0? 'new-page margintop0p5':''"> 
            <table style="font-size:7.25pt;" class="print-block flexsize border border-dark m-0 p-0">
                <tr style="font-size:12pt; " class="m-0 p-0">
                    <td class="m-0 p-0" colspan="13"><div  class="ml-1 font-weight-bold">4 Cancellation Information (Project Code 1500144) <span v-if="inx>0">(continued)</span></div></td>                        
                </tr>
                
                <tr style="font-size:7pt; background-color:#EEE;" class="m-0 p-0" >
                    <td style="width:0.5%;"/>
                    <td style="width:9%;" class="text-center"><b class="ml-1 text-center">Date</b><div class="ml-1 mt-0" style="font-size:5pt;" ><i>YYYY-MM-DD</i></div></td>                                              
                    <td style="width:1%;" />
                    <td style="width:13%;" class="text-center"><b class="">Booking Time</b></td>
                    <td style="width:1%;" />
                    <td style="width:10%;" class="text-center"><b class="">Cancelled By</b></td>
                    <td style="width:1%;" />                                                            
                    <td style="width:12%;" class="text-center"><b class="">Cancellation Date</b></td>
                    <td style="width:1%;" />
                    <td style="width:22%;" class="text-center"><b class="">Cancellation Reason</b></td>
                    <td style="width:1%;" />
                    <td style="width:28%;" class="text-center"><b class="">Comment</b></td>                        
                    <td style="width:0.5%;"/> 
                </tr>
                <tbody v-for="record,indx in slicedRecord" :key="'record-table-'+indx">
                    <tr style="line-height:0.25rem; height:0.25rem;" ><td class="text-white">.</td></tr>                        
                    <tr class="spacer">
                        <td />
                        <td  colspan="11" style="border-top:1px solid #DDD; " />
                        <td />
                    </tr>
                    <tr>
                        <td />
                        <td  class="border-bottom text-center"><div class="answer-record">{{record.date|iso-date}}</div></td>                                              
                        <td />
                        <td  class="border-bottom text-center"><div class="answer-record" style="font-size:7pt;">{{record.time}}</div></td>
                        <td  />
                        <td  class="border-bottom text-center"><div class="answer-record" style="font-size:7pt;">{{record.cancelledBy}}</div></td>
                        <td  />
                        <td  class="border-bottom text-center"><div class="answer-record" style="font-size:7pt;">{{record.cancellationDate|beautify-date-simple}}</div></td>
                        <td  />
                        <td  class="border-bottom text-center"><div class="answer-record" style="font-size:7pt;">{{record.cancelReason}}</div></td>
                        <td  />
                        <td  class="border-bottom text-center"><div class="answer-record" style="font-size:7pt;">{{((record.cancellationComment?record.cancellationComment:'')+' '+(record.comment?record.comment:'')) | truncate-text(47)}}</div></td>
                        <td  />                        
                        
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
                                borderless                                
                                responsive="sm">                                        
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
import { bookingAdmCancellationInfoType, bookingSearchResultInfoType } from '@/types/Bookings/json';
import * as _ from 'underscore';
import moment from 'moment-timezone';

@Component
export default class CancellationInfo extends Vue {

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

    slicedRecords: bookingAdmCancellationInfoType[][]=[]

    dataReady = false

    mounted(){ 
        this.dataReady=false;       
        this.extractInfo()
        this.dataReady=true
    }

    public extractInfo(){
        const bookingRecordsApproved = this.booking.recordsApproved? true : false;
        this.slicedRecords =[]
        let records:bookingAdmCancellationInfoType[] = []        
        
        for(const date of this.booking.dates){
            const record: bookingAdmCancellationInfoType = JSON.parse(JSON.stringify(date))
            if(record.status!="Cancelled"){                
                continue; 
            } 
            const dateTZ = moment(date.date).tz(this.booking.location.timezone).format('YYYY-MM-DD');
            record.cancelledBy = date.cancellationReason.split('(')[0]
            record.cancelReason = date.cancellationReason.split('(')[1].replace(')','')
            record.cancellationFee = (bookingRecordsApproved && date.cancellationFee)? date.cancellationFee : '0.00'
            record.date = moment(dateTZ+' '+date.startTime,'YYYY-MM-DD HH:mm A' ).format()
                   
            record.time = date.startTime + ' - '+ date.finishTime
            
            record.feeChanged = false;
            record.feeDisabled = false;
            records.push(record)
        }
       

        if(records.length==0){
            const record = {} as bookingAdmCancellationInfoType
            record.cancellationFee = "0.00"
            record.cancellationComment=' '
            record.comment=' '
            this.slicedRecords.push([record]) 
            return
        }
        records = _.sortBy(records,'date')



        const pageCapacity=[52-Number(this.lastPageAdmItemsNum.num), 52]        
        let pageNum=0
        let pageItem = 5 // per page
        const slicedRecords = []
        for(const record of records){            
            pageItem +=4 //per case up down
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
      
    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
