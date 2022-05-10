<template>
    <div v-if="dataReady">

<!-- <ROW - 1> -->
        <b-row class="mt-2 ml-1">
            
            <b-col cols="3">                    
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
            </b-col> 
            <b-col cols="6">
            </b-col>
            <b-col cols="3">                    
                <b-button v-if="totalTabs>1" @click="openCopy" variant="warning" class="mt-3 float-right">
                    <b-icon-layers /> Import from Tab
                </b-button>
            </b-col>

        </b-row>

<!-- <ROW - 2> -->
        <b-row class="ml-1">
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Court File Number" 
                    label-for="file-number">
                    <b-form-input                        
                        id="file-number" 
                        :state="bookingStates.file"                                        
                        v-model="booking.file">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    class="labels"                
                    label="Case Name" 
                    label-for="case-name">
                    <b-form-input                        
                        id="case-name" 
                        :state="bookingStates.caseName"                                        
                        v-model="booking.caseName">
                    </b-form-input>
                </b-form-group>
            </b-col>   
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Court Room" 
                    label-for="room">
                    <b-form-input 
                        :state="bookingStates.room"                        
                        id="room"                                         
                        v-model="booking.room">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="5">
                <b-form-group                        
                    label="Court Location" 
                    class="labels"
                    label-for="location">
                    <b-form-select 
                        id="location"                                                   
                        style="display:inline"
                        @change="changeLocation"
                        :state="bookingStates.location"
                        v-model="booking.locationId"> 
                        <b-form-select-option
                            v-for="courtLocation,inx in courtLocations" 
                            :key="inx"
                            :value="courtLocation.id">
                                {{courtLocation.name}}
                        </b-form-select-option>
                    </b-form-select> 
                </b-form-group>
            </b-col>
            
        </b-row>

<!-- <ROW - 3> -->
        <b-row class="ml-1">
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Case Type" 
                    label-for="case-type">
                    <b-form-select 
                        :options="caseTypeOptions"                    
                        :state="bookingStates.caseType"                        
                        @change="booking.courtClass='';extractCourtClass();"
                        id="case-type"                                         
                        v-model="booking.caseType">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Court Level" 
                    label-for="court-level">
                    <b-form-select 
                        :options="courtLevelOptions"
                        :state="bookingStates.courtLevel"                       
                        id="court-level"                                         
                        v-model="booking.courtLevel">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    class="labels"                
                    label="Court Class" 
                    label-for="court-class">
                    <b-form-select 
                        :options="booking.caseType=='Civil'? civilCourtClassOptions: criminalCourtClassOptions"
                        :state="bookingStates.courtClass"
                        @change="courtClassChanged"                       
                        id="court-class"                                         
                        v-model="courtClass">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group v-if="courtClass=='OTHER'"
                    class="labels"                
                    label="Other Court Class" 
                    label-for="other-court-class">
                    <b-form-input
                        id="other-court-class"                                                                          
                        :state="bookingStates.courtClassOther"
                        @change="courtClassChanged"                                    
                        v-model="courtClassOther">
                    </b-form-input>
                </b-form-group>
            </b-col>                    
            
            <b-col cols="2">
                <b-form-group                        
                    label="Requested By" 
                    class="labels"
                    label-for="requested-by">
                    <b-form-select 
                        id="requested-by"                                                   
                        style="display:inline"
                        :options="requestOptions"
                        :state="bookingStates.request"
                        v-model="booking.requestedBy">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col>            
        </b-row>
        
<!-- <ROW - 4> -->
        <b-row class="ml-1">
            <b-col cols="4">
                <b-form-group                
                    class="labels"                
                    label="Reason Code" 
                    label-for="reason-code">
                    <b-form-select
                        id="reason-code"
                        :options="reasonCodeClassOptions"                          
                        :state="bookingStates.reason" 
                        @change="reasonCodeChanged"                                   
                        v-model="reasonCode">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group v-if="reasonCode=='OTHER'"
                    class="labels"                
                    label="Other Reason Code " 
                    label-for="other-reason-code">
                    <b-form-input
                        id="reason-code"                                                                          
                        :state="bookingStates.reasonOther"
                        @change="reasonCodeChanged"                                    
                        v-model="reasonCodeOther">
                    </b-form-input>
                </b-form-group>
            </b-col><b-col cols="3">
                <b-form-group                        
                    label="Method Of Appearance" 
                    class="labels"
                    label-for="appearance-method">
                    <b-form-select 
                        id="appearance-method"                                                   
                        style="display:inline"                                
                        :options="bookingMethodOfAppearanceOptions"
                        :state="bookingStates.methodOfAppearance"
                        v-model="booking.methodOfAppearance">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col>
            <b-col cols="2" >
                <b-form-group>
                    <label class="labels mb-1" style="display:block;" >Bilingual (EN, FR)</label>
                    <b-form-radio-group                                                
                        :class="bookingStates.bilingual==false?'border rounded border-danger pb-3 pt-1 px-2':'' "                           
                        style="display:inline"
                        @change="bookingStates.bilingual=null"
                                                           
                        :state="bookingStates.bilingual"
                        v-model="booking.bilingual"> 
                        <b-form-radio :value="true">Yes</b-form-radio> 
                        <b-form-radio :value="false">No</b-form-radio>                                  
                    </b-form-radio-group> 
                </b-form-group>                
            </b-col>
            
        </b-row>

<!-- <ROW - 5> -->
        <b-row class="ml-1">
            
            <b-col cols="2" >
                <b-form-group>
                    <label class="labels mb-1" style="display:block;" >Federal</label>                
                    <b-form-radio-group                                                 
                        :class="bookingStates.federal==false?'border rounded border-danger pb-3 pt-1 px-2':'' "                           
                        style="display:inline"
                        @change="bookingStates.federal=null"                                
                        :state="bookingStates.federal"
                        v-model="booking.federal"> 
                        <b-form-radio :value="true">Yes</b-form-radio> 
                        <b-form-radio :value="false">No</b-form-radio>                                  
                    </b-form-radio-group> 
                </b-form-group>
            </b-col>
            <b-col cols="5" >
                <b-form-group
                    v-if="booking.federal"
                    class="labels"                
                    label="Federal Prosecutor Name" 
                    label-for="prosecutor-name">
                    <b-form-input                         
                        id="prosecutor-name" 
                        :state="bookingStates.prosecutor"                                                 
                        v-model="booking.prosecutor">
                    </b-form-input>
                </b-form-group>
            </b-col>
       
           
            <b-col cols="5" >
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
        <b-row class="ml-1 mt-2"> 
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
        </b-row>  

    </div>   
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import {bookingInfoType } from '@/types/Bookings/json';
import {interpreterLanguageInfoType } from '@/types/Interpreters/json';

import {interpretForOptions, statusOptions, requestOptions, bookingMethodOfAppearanceOptions, caseTypeOptions, courtLevelOptions, civilCourtClassOptions, criminalCourtClassOptions, reasonCodeClassOptions} from '../BookingEnums'
import { bookingStatesInfoType } from '@/types/Bookings';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { locationsInfoType } from '@/types/Common/json';
const commonState = namespace("Common");



@Component
export default class InterpreterBookingFields extends Vue {
    
    @Prop({required: true})
    tabName!: string;

    @Prop({required: true})
    totalTabs!: number;

    @Prop({required: true})
    language!: string;

    @Prop({required: true})
    booking!: bookingInfoType

    @Prop({required: true})
    bookingStates!: bookingStatesInfoType;
    
    @Prop({required: true})
    languages: interpreterLanguageInfoType[]

    @commonState.State
    public courtLocations!: locationsInfoType[];

    reasonCode=''
    reasonCodeOther=''

    courtClass=''
    courtClassOther=''

    languageFields = [
        {key:'language',     label:'Language',      thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false},
        {key:'interpretFor', label:'Interpret For', thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false},
        {key:'edit',         label:'',              thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false }
    ] 

    addNewLanguageForm = false
    selectedInterpretFor = ''
    selectedLanguage =''
    dataReady = false


    statusOptions
    requestOptions
    bookingMethodOfAppearanceOptions
    interpretForOptions
    caseTypeOptions
    courtLevelOptions 
    civilCourtClassOptions
    criminalCourtClassOptions
    reasonCodeClassOptions

    created(){
        this.interpretForOptions=interpretForOptions
        this.statusOptions=statusOptions.filter(stat =>  !stat.text.toLowerCase().includes("cancel"))        
        this.requestOptions=requestOptions 
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions
        this.caseTypeOptions=caseTypeOptions
        this.courtLevelOptions=courtLevelOptions
        this.civilCourtClassOptions=civilCourtClassOptions
        this.criminalCourtClassOptions=criminalCourtClassOptions
        this.reasonCodeClassOptions=reasonCodeClassOptions
    }

    mounted() { 
        this.dataReady = false
        this.addNewLanguageForm = false  
        this.selectedInterpretFor = this.interpretForOptions[0].value;
        this.selectedLanguage = this.language? this.language: this.languages[0].languageName
        this.extractReasonCode()
        this.extractCourtClass()
        this.dataReady = true
    }

    public addLanguage(){
        const selectedLanguageQuery = this.languages.filter(lang=>lang.languageName==this.selectedLanguage)
        
        this.booking.languages.push({
            languageId:(selectedLanguageQuery.length==1? selectedLanguageQuery[0].languageId : null), 
            language:this.selectedLanguage,
            level: (selectedLanguageQuery.length==1? selectedLanguageQuery[0].level : null),
            interpretFor:this.selectedInterpretFor
        })
        this.addNewLanguageForm = false;
        const bookingStates= this.bookingStates
        bookingStates.language = true;
    }

    public changeLocation(){

        const location = this.courtLocations.filter(loc => loc.id==this.booking.locationId)

        if(location.length==1){
            const booking= this.booking
            booking.registry = location[0].name
        }
    }

    public removeLanguage(data){
        this.booking.languages.splice(data.index,1);
    }

    public openCopy(){
        this.$emit('copy', this.tabName)
    }

    public reasonCodeChanged(){
        if(this.reasonCode !='OTHER'){
            this.booking.reason=this.reasonCode            
        }else{
            if(this.reasonCodeOther){
                this.booking.reason=this.reasonCode+'__'+this.reasonCodeOther 
            }else{
                this.booking.reason=''
                this.bookingStates.reasonOther = false
            }
        }        
    }

    public extractReasonCode(){
        if(this.booking.reason?.includes('OTHER__')){
            this.reasonCode='OTHER'
            this.reasonCodeOther=this.booking.reason.slice(7)
        }else{
            this.reasonCode=this.booking.reason
            this.reasonCodeOther=''
        }
    }

    public courtClassChanged(){
        if(this.courtClass !='OTHER'){
            this.booking.courtClass=this.courtClass            
        }else{
            if(this.courtClassOther){
                this.booking.courtClass=this.courtClass+'__'+this.courtClassOther 
            }else{
                this.booking.courtClass=''
                this.bookingStates.courtClassOther = false
            }
        }
        // console.log(this.courtClass)
        // console.log(this.courtClassOther)
        // console.log(this.booking.courtClass)        
    }

    public extractCourtClass(){
        if(this.booking.courtClass?.includes('OTHER__')){
            this.courtClass='OTHER'
            this.courtClassOther=this.booking.courtClass.slice(7)
        }else{
            this.courtClass=this.booking.courtClass
            this.courtClassOther=''
        }
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
    ::v-deep label{        
        margin:0 0 0.5rem 0;
    }

    .custom-radio{
        margin-top: 0.45rem;
    }
</style>