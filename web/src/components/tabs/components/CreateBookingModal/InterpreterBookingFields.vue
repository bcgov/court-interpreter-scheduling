<template>
    <div v-if="dataReady">
<!-- {{booking}} -->
<!-- {{bookingStates}} -->

<!-- < EXPORT IMPORT > -->
        <b-row v-if="totalTabs>1" class="mt-3 mb-3 mx-0 p-1 bg-lightcard" style="border-radius:5px;">
            <b-button  @click="openExportWindow" variant="warning" class="mr-auto">
                <b-icon-layers /> Export to <b>All</b> Tabs
            </b-button>
            <b-button  @click="openCopy" variant="court" class="ml-auto">
                <b-icon-layers-half /> Import from  a Tab
            </b-button>
        </b-row>
<!-- <ROW - 1> -->
        <b-row class="mt-2 mb-5 mx-0">
            
            <div style="width:20%;">                    
                <b-form-group
                    class="labels"                
                    label="Status"
                    label-for="status">
                    <b-form-select                        
                        id="status"                                       
                        :options="statusOptions"                                 
                        :state="bookingStates.status"                  
                        v-model="booking.status">
                    </b-form-select>
                </b-form-group>
            </div> 
            <div style="width:2%;"/>
            <div style="width:31%;">                
                <b-form-group                        
                    label="Court Location" 
                    class="labels"
                    label-for="location">
                    <b-form-select 
                        id="location"                                                   
                        style="display:inline"                      
                        v-model="registry.id"
                        @change="updateRegistry"
                        :disabled="true"> 
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
                        style="display:inline" 
                        @change="checkStates()"                          
                        :options="bookingMethodOfAppearanceOptions"
                        :state="bookingStates.methodOfAppearance"
                        v-model="booking.methodOfAppearance">                                    
                    </b-form-select> 
                </b-form-group>
            </div>
            <div style="width:2%;"/>
            <div style="width:24%;">                    
                
            </div>

        </b-row>
        
<!-- <TABS> -->
        <div class="text-primary h3 mb-2" >Booking Details: <b-button :disabled="disableEdit" class="float-right" size="sm" @click="addBookingCase()" variant="select"><b-icon-clipboard-plus /> Add</b-button></div>
        <b-tabs  v-model="caseTabIndex" pills card :key="updateTab" class="case-tab-header" @input="emitCaseIndex">            
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
                    :bookingStatus="booking.status"
                    />
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

import CaseFields from '../CaseComponents/CaseFields.vue'

import {bookingCaseInfoType, bookingInfoType } from '@/types/Bookings/json';
import {interpreterLanguageInfoType } from '@/types/Interpreters/json';

import {interpretForOptions, statusOptions, requestOptions, bookingMethodOfAppearanceOptions } from '../BookingEnums'
import { bookingCaseStatesInfoType, bookingStatesInfoType} from '@/types/Bookings';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { locationsInfoType } from '@/types/Common/json';
const commonState = namespace("Common");

@Component({
    components:{
        CaseFields
    }
})
export default class InterpreterBookingFields extends Vue {
    
    @Prop({required: true})
    tabName!: string;

    @Prop({required: true})
    tabNumber!: number

    @Prop({required: true})
    totalTabs!: number;

    @Prop({required: true})
    pickedLanguage!: string;

    @Prop({required: true})
    booking!: bookingInfoType

    @Prop({required: true})
    bookingStates!: bookingStatesInfoType;
    
    @Prop({required: true})
    languages: interpreterLanguageInfoType[]
    
    @Prop({required: true})
    registry!: any;

    @Prop({required: true})
    caseTabId!: number | null

    @commonState.State
    public courtLocations!: locationsInfoType[];

    reasonCode=''
    reasonCodeOther=''

    remoteLocation=false
    appearanceMethodKey = 0;

    disableEdit=false
    caseTabIndex=0;
    caseFileCounter=0;
    updateTab=0;
    showExportDataWindow = false;

    selectedExportItems = []
    exportOptions = []
    allExportItemsSelected = false
    indeterminate = false

    courtClass=''
    courtClassOther=''

    languageFields = [
        {key:'language',     label:'Language',      thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false},
        {key:'interpretFor', label:'Interpret For', thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false},
        {key:'edit',         label:'',              thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false }
    ] 

    // addNewLanguageForm = false
    // selectedInterpretFor = ''
    // selectedLanguage =''
    dataReady = false


    statusOptions
    bookingMethodOfAppearanceOptions

    created(){        
        this.statusOptions=statusOptions.filter(stat =>  !stat.text.toLowerCase().includes("cancel"))        
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions
    }

    @Watch('caseTabId')
    caseTabIdChanged(value){
        // console.log(value)       
        if(value>=0){
            for(const inx in this.booking.cases){
                if(this.booking.cases[inx].tmpId==value){
                    this.caseTabIndex=Number(inx)
                    break
                }
            }
        }
    }

    mounted() { 
        this.dataReady = false

        // this.addNewLanguageForm = false
        // this.selectedLanguage = this.language? this.language: this.languages[0].languageName

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
        
        const selectedLanguage = this.languages.filter(lang => lang.languageName==this.pickedLanguage)[0]
        const language = this.pickedLanguage && selectedLanguage? selectedLanguage: this.languages[0]

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
        newcase.antcpStartTime = this.booking.startTime
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

    public getBookingStates(tmpId){
        return this.bookingStates.cases.filter(bookingcase => bookingcase.tmpId==tmpId)[0]
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

    public openCopy(){
        this.$emit('copy', this.tabName)
    }

    public checkStates(){
        this.$emit('checkStates')
    }

    public toggleAllExportItems(checked){
        this.selectedExportItems = checked? this.exportOptions.map(item => item.value) : []
    }

    public openExportWindow(){
        // console.log(this.booking.status)
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
    
    public emitCaseIndex() {
        this.$emit('caseIndexChanged', this.caseTabIndex);
    }
    updateRegistry() {
        this.$emit('update-registry', this.registry.id);
    }
}

</script>


<style lang="scss" scoped>
    .labels {        
        margin:1rem 0 0rem 0;        
        line-height: 1rem;
        color:rgb(67, 93, 119);
        font-weight: 600;
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

    ::v-deep label{        
        margin:0 0 0.5rem 0;
    }

    .custom-radio{
        margin-top: 0.45rem;
    }
</style>