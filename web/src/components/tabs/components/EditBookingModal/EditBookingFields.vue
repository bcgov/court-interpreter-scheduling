<template>
    <div v-if="dataReady">
        <!-- {{bookingStates}}//{{tabIndex}}/{{tabNumber}} -->
        <!-- {{booking.cases}} -->
        
        <b-alert class="mt-3" variant="danger" :show="errorMsg.length>0" >            
            <b class="mr-2">Error: </b> {{errorMsg}} <b-icon-exclamation-circle-fill/>
        </b-alert>

<!-- < EXPORT IMPORT > -->
        <b-row v-if="totalTabs>1" class="mt-3 bg-lightcard p-1 mb-3 mx-0" style="border-radius:5px;">
            <b-button variant="warning" class="mr-auto" @click="openExportWindow" >
                <b-icon-layers /> Export to <b>All</b> Tabs
            </b-button>
            <b-button :disabled="disableEdit" @click="openCopy" variant="court" class="ml-auto">
                <b-icon-layers-half /> Import from  a Tab
            </b-button>
        </b-row>
<!-- <ROW - 1> -->
        <b-row class="mt-2 mb-5 mx-0">
            
            <div style="width:21%;">                    
                <b-form-group                    
                    :class="booking.status=='Cancelled'? 'labels text-danger':'labels'"                
                    :label="booking.status=='Cancelled'?('Cancelled by '+cancellationBy):'Status'"
                    label-for="status">                    
                    <b-form-select
                        id="status"
                        :disabled="disableEdit"
                        @change="statusChanged"                                       
                        :options="statusOptions"                                 
                        :state="bookingStates.status"                  
                        v-model="booking.status">
                    </b-form-select>
                </b-form-group>
            </div> 
            <div style="width:2%;"/>
            <div style="width:30%;">                              
                <b-form-group                        
                    label="Court Location" 
                    class="labels"
                    label-for="location">
                    <b-form-select 
                        id="location"
                        disabled                                                   
                        style="display:inline"                      
                        v-model="registry.id"> 
                        <b-form-select-option
                            v-for="courtLocation,inx in courtLocations" 
                            :key="inx"
                            :value="courtLocation.id">
                                {{courtLocation.name}}
                        </b-form-select-option>
                    </b-form-select> 
                </b-form-group>       
            </div>
            <div style="width:2%;"/>
            <div style="width:19%;">
                <b-form-group
                    :key="appearanceMethodKey"                         
                    label="Method Of Appearance" 
                    class="labels"
                    label-for="appearance-method">
                    <b-form-select 
                        id="appearance-method"
                        :disabled="disableEdit"                           
                        style="display:inline"
                        @change="checkStates()"                                
                        :options="bookingMethodOfAppearanceOptions"
                        :state="bookingStates.methodOfAppearance"
                        v-model="booking.methodOfAppearance">                                    
                    </b-form-select> 
                </b-form-group>
            </div>
            <div style="width:2%;"/>
            <div style="width:11%;" cols="3" :key="'start-update-'+updateTime"> 
                <b-form-group
                    class="labels"                
                    label="Start Time" 
                    label-for="start-time">
                    <b-form-input 
                        id="start-time"
                        :formatter="startTimeFormatter"
                        :disabled="disableEdit || !booking.id" 
                        :state="bookingStates.start"                                        
                        v-model="booking.startTime">
                    </b-form-input>
                </b-form-group>                        
            </div>
            <div style="width:2%;"/>
            <div style="width:11%;" cols="3" :key="'end-update-'+updateTime"> 
                <b-form-group
                    class="labels"                
                    label="Finish Time" 
                    label-for="finish-time">
                    <b-form-input
                        id="finish-time"
                        :formatter="endTimeFormatter"
                        :disabled="disableEdit || !booking.id" 
                        :state="bookingStates.end"                                        
                        v-model="booking.finishTime">
                    </b-form-input>
                </b-form-group>                        
            </div>
                
        </b-row>

<!-- <TABS> -->
        <div class="text-primary h3 mb-2" >Booking Details: <b-button :disabled="disableEdit" class="float-right" size="sm" @click="addBookingCase()" variant="select"><b-icon-clipboard-plus /> Add</b-button></div>
        <b-tabs  v-model="caseTabIndex" pills card :key="updateTab" class="case-tab-header">            
            <b-tab :title-link-attributes="{'href':'javascript:void(0);'}" no-body v-for="caseTab,inx in booking.cases" :key="'case-'+ inx" title-link-class="text-center case-tab-class">
                <template #title>
                    <b-row class="m-0">
                        <b-col cols="2" class="m-0 p-0">
                            <b-button :disabled="disableEdit" v-b-tooltip.hover.v-danger title="remove" @click="removeBookingCase(caseTab.tmpId)" style="width:1.0rem;height:0.98rem;" class="p-0 mt-n1 ml-n1 bg-danger border-0 " >
                                <b-icon-x-square style="transform:translate(-2px,-5px)" variant="white" scale="0.75"/>
                            </b-button>
                        </b-col>
                        <b-col cols="10" class="text-left m-0 p-0">
                            <b>{{caseTab.file|truncate-text(12)}}</b>
                        </b-col>                        
                    </b-row>
                    <b-row class="m-0">
                        <b-col cols="10" class="bg-card_detail border rounded text-dark m-0 p-0">                        
                            <b><b-icon-door-closed  scale="0.85" /> {{caseTab.room|truncate-text(8)}} </b>
                        </b-col>
                        <b-col cols="2" class="m-0 p-0">
                            <b-button :disabled="disableEdit" v-b-tooltip.hover.left.v-success title="Clone" @click="duplicateBookingCase(caseTab.tmpId)" style="width:1.0rem;height:1.1rem; margin-top:0.15rem;" class="p-0 bg-transparent border-0 float-right" ><b-icon-arrow-bar-right style="transform:translate(-3px,-4px)" variant="warning" scale="0.85"/></b-button>                        
                        </b-col>
                    </b-row>                    
                </template>
                <case-fields
                    @checkStates="checkStates"
                    :languages="languages" 
                    :bookingCase="caseTab" 
                    :caseStates="getBookingStates(caseTab.tmpId)" 
                    :registry="registry" 
                    :disableEdit="disableEdit" 
                    :bookingStatus="booking.status" />
            </b-tab>
        </b-tabs>            
        
<!-- <ROW - 5> -->
        <b-row class="ml-n3 mt-3">
            <b-col cols="12" >
                <b-form-group
                    class="labels"                
                    label="Comment" 
                    label-for="comment">
                    <b-form-textarea
                        rows="3"
                        :disabled="disableEdit" 
                        id="comment"                                                   
                        v-model="booking.comment">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>

<!-- <ROW - 6> -->
        <!-- <b-row class="ml-1 mt-2"> 
            <b-col cols="6 ">
                <b-row >
                    <b-button                     
                        style="margin:0rem 0 0 0.9rem; height: 2.25rem;"
                        v-if="!addNewLanguageForm"
                        :disabled="disableEdit"  
                        size="sm" 
                        :variant="bookingStates.language==false?'danger':'info'" 
                        @click="bookingStates.language=true;addNewLanguageForm = true"><b-icon-plus class="mr-1"/>Add Language
                    </b-button>
                    <div v-if="!addNewLanguageForm && booking.languages.length == 0" class="mt-2 ml-3 text-danger"> 
                        No languages have been added.
                    </div> 
                </b-row>

                <b-card class="mx-auto mt-1 bg-light" body-class="p-2" v-if="addNewLanguageForm">
                    <b-row class="ml-1">
                        <b-col cols="5">
                            <b-form-group                        
                                label="Language" 
                                class="labels"
                                label-for="language">
                                <b-form-select 
                                    id="language"                           
                                    style="display:inline"                                    
                                    v-model="selectedLanguage"> 
                                    <b-form-select-option
                                        v-for="language,inx in languages" 
                                        :key="inx"
                                        :value="language.languageName">
                                            {{language.languageName}} (Level {{language.level}})
                                    </b-form-select-option>
                                </b-form-select> 
                            </b-form-group>
                        </b-col> 
                        <b-col cols="5">
                            <b-form-group                        
                                label="Interpret For" 
                                class="labels"
                                label-for="interpret-for">
                                <b-form-select 
                                    id="interpret-for"                           
                                    style="display:inline"
                                    :options="interpretForOptions"
                                    v-model="selectedInterpretFor">                                    
                                </b-form-select> 
                            </b-form-group>
                        </b-col>
                        <b-col cols="2">
                            <b-button style="margin-top:2.5rem;" @click="addLanguage" variant="success" >
                                Add
                            </b-button>
                        </b-col>                  
                    </b-row>
                </b-card>
            </b-col>

            <b-col cols="6">                                          
                <b-table 
                    :items="booking.languages"
                    :fields="languageFields"                                            
                    borderless    
                    small
                    style="border:3px solid #dc3545"
                    :class="bookingStates.language==false?'':'border rounded'"                                 
                    responsive="sm"
                    >
                    <template v-slot:cell(language)="data" >                                    
                        {{data.value}} (Level {{data.item.level}})
                    </template>
                    <template v-slot:cell(edit)="data" >   
                        <div style="float: right;">                                                                     
                            <b-button 
                                class="mr-2 border-0" 
                                size="sm" 
                                :disabled="disableEdit" 
                                variant="transparent" 
                                @click="removeLanguage(data)">
                                <b-icon 
                                    icon="trash-fill" 
                                    font-scale="1.25" 
                                    variant="danger"/>
                            </b-button>                       
                        </div>
                    </template>                
                </b-table>                       
                
            </b-col>   
        </b-row>   -->
 

        <b-modal body-class="py-0"  v-model="showExportDataWindow" hide-header-close no-close-on-backdrop header-class="bg-warning">
            <template v-slot:modal-title>
                <h2 class="my-2">Export To Other Time Slots</h2>
            </template>           
            <b-form-group                                 
                class="export-items-labels"
                label-for="export-items">
                <template #label>
                    <b class="h3">Which information to export:</b><br><br>    
                    <b-form-checkbox
                        v-model="allExportItemsSelected"
                        :indeterminate="indeterminate"
                        @change="toggleAllExportItems"
                        class="text-dark"
                        >
                        {{ allExportItemsSelected ? 'Un-select All' : 'Select All' }}
                    </b-form-checkbox>
                </template>
      
                <b-form-checkbox-group
                    id="export-items"
                    class="ml-3"
                    stacked                    
                    v-model="selectedExportItems"
                    :options="exportOptions"/>
            </b-form-group>
            <template v-slot:modal-footer>                
                <b-button class="mr-auto" variant="dark" @click="showExportDataWindow=false;">Cancel</b-button>
                <b-button class="ml-auto" variant="success" @click="exportTabData()">Continue</b-button>
            </template>
        </b-modal>

    </div>   
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment-timezone';

import CaseFields from '../CaseComponents/CaseFields.vue'

import {bookingCaseInfoType, bookingInfoType } from '@/types/Bookings/json';
import {interpreterLanguageInfoType } from '@/types/Interpreters/json';

import {interpretForOptions, statusOptions, requestOptions, bookingMethodOfAppearanceOptions} from '../BookingEnums'
import {bookingCaseStatesInfoType, bookingStatesInfoType} from '@/types/Bookings';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { locationsInfoType } from '@/types/Common/json';
const commonState = namespace("Common");



@Component({
    components:{
        CaseFields
    }
})
export default class EditBookingFields extends Vue {
    
    @Prop({required: true})
    tabIndex!: number

    @Prop({required: true})
    tabName!: string;

    @Prop({required: true})
    tabNumber!: number

    @Prop({required: true})
    totalTabs!: number;
    
    @Prop({required: true})
    booking!: bookingInfoType

    @Prop({required: true})
    original!: boolean|null

    @Prop({required: true})
    bookingStates!: bookingStatesInfoType;

    @Prop({required: true})
    public registry!: any;
    
    @Prop({required: true})
    languages: interpreterLanguageInfoType[]

    @Prop({required: true})
    allBookings!: any[]

    @Prop({required: true})
    caseTabId!: number | null

    @commonState.State
    public courtLocations!: locationsInfoType[];

    // languageFields = [
    //     {key:'language',     label:'Language',      thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false},
    //     {key:'interpretFor', label:'Interpret For', thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false},
    //     {key:'edit',         label:'',              thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false }
    // ] 

    // addNewLanguageForm = false
    // selectedInterpretFor = ''
    // selectedLanguage =''
    dataReady = false

    cancellationReason = ''
    cancellationBy = ''

    previousStatus = ''

    disableEdit = false

    errorMsg=''

    updateTime = 0

    remoteLocation=false
    appearanceMethodKey = 0;

    reasonCode=''
    reasonCodeOther=''

    courtClass=''
    courtClassOther=''

    caseTabIndex=0;
    caseFileCounter=0;
    updateTab=0;
    showExportDataWindow = false;

    selectedExportItems = []
    exportOptions = []
    allExportItemsSelected = false
    indeterminate = false

    statusOptions
    bookingMethodOfAppearanceOptions

    created(){
        this.statusOptions=this.original? statusOptions : statusOptions.filter(stat =>  !stat.text.toLowerCase().includes("cancel"))        
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions
    }

    @Watch('selectedExportItems')
    exportItemsChanged(newValue) {
        
        if (newValue.length === 0) {
          this.indeterminate = false
          this.allExportItemsSelected = false
        } else if (newValue.length === this.exportOptions.length) {
          this.indeterminate = false
          this.allExportItemsSelected = true
        } else {
          this.indeterminate = true
          this.allExportItemsSelected = false
        }
    }

    @Watch('caseTabId')
    caseTabIdChanged(value){       
        if(value>=0){
            for(const inx in this.booking.cases){
                if(this.booking.cases[inx].tmpId==value){
                    this.caseTabIndex=Number(inx)
                    break
                }
            }
        }
    }

    @Watch('booking.status')
    watchStatusChanged(value){

        if(value==statusOptions[2].value){
            this.disableEdit = true
            this.extractCancellation()
        }else
            this.disableEdit = false
    }

    @Watch('booking.cancellationReason')
    extractCancellation(){
        if(this.booking.cancellationReason){
            const cancelParts = this.booking.cancellationReason.split(' (')
            this.cancellationBy = cancelParts[0]
            this.cancellationReason = '('+cancelParts[1]
        }
    }

    @Watch('tabIndex')
    tabEnter(value){
        if(value==this.tabNumber && this.booking.status!=statusOptions[2].value)
            this.timeConflict()
    }

    mounted() { 
        this.dataReady = false

        // this.addNewLanguageForm = false  
        // this.selectedLanguage = this.languages[0].languageName
        
        this.previousStatus =  JSON.parse(JSON.stringify(this.booking.status))
        this.watchStatusChanged(this.booking.status)
        this.extractCases()        
        this.dataReady = true        
    }


    public extractCases(){
        
        this.bookingStates.cases=[]

        if(this.booking.cases.length==0){ 
            this.addBookingCase()
        }
        else{
            for(const bookingCase of this.booking.cases){
                bookingCase.tmpId = this.caseFileCounter;
                if(!bookingCase.vanLocationId) bookingCase.vanLocationId= this.registry.id
                this.bookingStates.cases.push(this.prepopulateDefaultCasesState(this.caseFileCounter))
                this.caseFileCounter++;
            }
        }
    }

    public addBookingCase(){
        const newcase = this.prepopulateDefaultCasesValue(this.caseFileCounter)
        this.booking.cases.push(newcase)
        this.bookingStates.cases.push(this.prepopulateDefaultCasesState(this.caseFileCounter))
        this.caseFileCounter++;
        setTimeout(() => {this.caseTabIndex=(this.booking.cases.length-1)}, 10);
        // this.updateTab++;
    }

    public removeBookingCase(tmpId){
        this.booking.cases = this.booking.cases.filter(bookingcase => bookingcase.tmpId!=tmpId)
        this.bookingStates.cases = this.bookingStates.cases.filter(bookingcase => bookingcase.tmpId!=tmpId)

        if(this.booking.cases.length==0) 
            this.addBookingCase()
        // else
        //     this.updateTab++;
    }

    public duplicateBookingCase(tmpId){
        const dupcase = JSON.parse(JSON.stringify(this.booking.cases.filter(bookingcase => bookingcase.tmpId==tmpId)[0]))
        dupcase.id = null;
        dupcase.tmpId = this.caseFileCounter;
        this.booking.cases.push(dupcase)
        this.bookingStates.cases.push(this.prepopulateDefaultCasesState(this.caseFileCounter))
        this.caseFileCounter++;
        setTimeout(() => {this.caseTabIndex=(this.booking.cases.length-1)}, 10);
        // this.updateTab++;    
    }

    public prepopulateDefaultCasesValue(tmpId){
        const location = this.courtLocations.filter(loc => loc.id==this.registry.id)[0]
        const vanCourt = (location?.shortDescription=="2040"||location?.shortDescription=="2042")
                
        const language = this.languages[0]

        const newcase = {} as bookingCaseInfoType
        newcase.tmpId = tmpId
        newcase.methodOfAppearance = this.booking.methodOfAppearance
        newcase.interpretFor = interpretForOptions[0].value
        newcase.requestedBy = requestOptions[0].value
        newcase.bilingual = false
        newcase.federal = false
        newcase.vanRegistry = vanCourt? location.name: ''
        newcase.vanLocationId = vanCourt? location.id: null

        newcase.file = ''
        newcase.caseName = ''
        newcase.room = '';
        newcase.caseType = ''
        newcase.courtLevel = ''
        newcase.courtClass = ''
        newcase.courtClassOther = ''
        newcase.reason = ''
        newcase.reasonOther = ''
        newcase.interpretationMode = ''

        newcase.language = language
        newcase.prosecutor = ''
        newcase.remoteRegistry = '';
        newcase.remoteLocationId = null;
        return newcase
    }

    public prepopulateDefaultCasesState(tmpId){
        const caseStates = {} as bookingCaseStatesInfoType;
        caseStates.tabNumber= this.tabNumber;
        caseStates.tmpId = tmpId;

        caseStates.room = null;         
        caseStates.file = null;
        caseStates.interpretFor = null;
        caseStates.caseName = null;
        caseStates.caseType = null;
        caseStates.courtLevel = null;
        caseStates.courtClass = null;
        caseStates.courtClassOther = null;
        caseStates.request = null;
        caseStates.language = null;
        caseStates.reason = null;
        caseStates.reasonOther = null;
        caseStates.prosecutor = null;
        caseStates.methodOfAppearance = null;
        caseStates.federal = null;        
        caseStates.bilingual = null;        
        caseStates.remoteLocation = null;
        caseStates.vanLocation = null;
        caseStates.interpretationMode = null;
        return caseStates
    }

    // public addLanguage(){
    //     const selectedLanguageQuery = this.languages.filter(lang=>lang.languageName==this.selectedLanguage)
                
    //     this.booking.languages.push({
    //         languageId:(selectedLanguageQuery.length==1? selectedLanguageQuery[0].languageId : null),
    //         language:this.selectedLanguage,
    //         level: (selectedLanguageQuery.length==1? selectedLanguageQuery[0].level : null),            
    //         interpretFor:this.selectedInterpretFor
    //     })
    //     this.addNewLanguageForm = false;
    //     const bookingStates= this.bookingStates
    //     bookingStates.language = true;
    // }

    // public removeLanguage(data){
    //     this.booking.languages.splice(data.index,1);
    // }

    public statusChanged(value){
        if(value==statusOptions[2].value)
            this.$emit('cancel', this.booking, this.previousStatus)
    }

    public startTimeFormatter(time){ 
        time = time.toUpperCase()
        this.bookingStates.start = this.timeValid(time)
        this.timeConflict()
        return time
    }

    public endTimeFormatter(time){
        time = time.toUpperCase()
        this.bookingStates.end = this.timeValid(time)
        this.timeConflict()
        return time
    }

    public modifyTime(time){     
        if(time.slice(5,6)!=' '){
            time = time.slice(0,5)+' '+ time.slice(5)
        }
        return time
    }

    public timeValid(time){        
        const timeFormat =/^(1[0-2]|[0][0-9]):([0-5][0-9])([ ]?)([AP]M|[ap]m)$/; 
        
        if(time && timeFormat.test(time)){ 
            this.errorMsg=''
            return null
        }else{            
            this.errorMsg='Invalid Time Format!  Valid format is \"hh:mm AM/PM\".  e.g. 12:00 PM'
            return false        
        }
    }

    public timeConflict(){
        Vue.nextTick(()=>{
            if(this.bookingStates.start==null && this.bookingStates.end==null){

                this.booking.startTime =  this.modifyTime(this.booking.startTime)
                this.booking.finishTime=  this.modifyTime(this.booking.finishTime)
                this.updateTime++;

                const start = moment(this.booking.startTime, "hh:mm A").format()   
                const end = moment(this.booking.finishTime, "hh:mm A").format()
                if(start >= end){
                    this.errorMsg='Start Time is equal to or after the Finish Time. '
                    return
                }

                for(const eachBooking of this.allBookings){
                    
                    if( eachBooking.booking.status != statusOptions[2].value && 
                        eachBooking.date.slice(0,10)==this.booking.date.slice(0,10) &&
                        this.booking.id != eachBooking.booking.id
                    ){  
                        const existingStart = moment(eachBooking.time.start, "hh:mm A").format()   
                        const existingEnd = moment(eachBooking.time.end, "hh:mm A").format()
                        if(!((start>=existingEnd && end >existingEnd)||(start<existingStart && end <=existingStart))){
                            this.errorMsg='The Start/Finish Times Conflict with: '+
                                eachBooking.beautyDate+ ' ('+ 
                                eachBooking.time.start +') to ('+ 
                                eachBooking.time.end+')'
                            this.bookingStates.conflict=false
                            return
                        }
                    }
                }
                this.errorMsg=''
                this.bookingStates.conflict=null
                this.$emit('timeChanged', this.booking)
            }
        })
    }

    public checkStates(){
        this.$emit('checkStates')               
    }    
    
    public getBookingStates(tmpId){
        return this.bookingStates.cases.filter(bookingcase => bookingcase.tmpId==tmpId)[0]
    }

    public openCopy(){
        this.$emit('copy', this.tabName)
    }

    public toggleAllExportItems(checked){
        this.selectedExportItems = checked? this.exportOptions.map(item => item.value) : []
    }

    public openExportWindow(){
        console.log(this.booking.status)
        if(this.booking.status == statusOptions[2].value){
            this.exportOptions = [{ text: 'Status', value: 'status' }]
        }
        else{
            this.exportOptions = [        
                { text: 'Status', value: 'status' },
                { text: 'Method Of Appearance', value: 'methodOfAppearance' },
                { text: 'Comment', value: 'comment' }
            ]
            let inx=0;
            for(const bookingcase of this.booking.cases){
                // console.log(bookingcase)
                const text = 'Court File: '+bookingcase.file+' ('+inx+')'
                this.exportOptions.push({
                    text:text, value:bookingcase.tmpId
                })
                inx++;
            }
        }

        this.selectedExportItems = []
        this.showExportDataWindow=true;
    }

    public exportTabData(){
        this.showExportDataWindow=false;
        this.$emit('export', this.selectedExportItems)
    }

}

</script>


<style lang="scss" scoped>
    .labels {        
        margin:1rem 0 0rem 0;        
        line-height: 1rem;
    }

    .export-items-labels {        
        margin:1rem 0 3rem 2rem;        
        // line-height: 1rem;
        color:rgb(67, 93, 119);
        font-weight: 600;
    }
    
    
    ::v-deep .case-tab-header>.card-header{        
        overflow-y: auto;
        max-height: 8.55rem;        
    }


    ::v-deep .case-tab-class{
        margin:0.2rem 0.2rem;
        padding: 0.2rem 0.2rem;
        width: 8.75rem;        
        font-size: 10.5pt;
        line-height: 1.3rem;
        background: rgb(235, 232, 236);        
    }


</style>