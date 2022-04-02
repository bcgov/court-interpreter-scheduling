<template>
    <div v-if="dataReady">

        <b-row class="mt-2 ml-1">
            
            <b-col cols="3">                    
                <b-form-group
                    class="labels"                
                    label="Status"
                    label-for="status">
                    <b-form-select 
                        class="input-line"
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


        <b-row class="ml-1">
            <b-col cols="4">
                <b-form-group
                    class="labels"                
                    label="Court File Number" 
                    label-for="file-number">
                    <b-form-input 
                        class="input-line"
                        id="file-number" 
                        :state="bookingStates.file"                                        
                        v-model="booking.file">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    class="labels"                
                    label="Court Room" 
                    label-for="room">
                    <b-form-input 
                        :state="bookingStates.room"
                        class="input-line"
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
                        class="input-line"                           
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


        <b-row class="ml-1">
            <b-col cols="4">
                <b-form-group
                    class="labels"                
                    label="Case Name" 
                    label-for="case-name">
                    <b-form-input 
                        class="input-line"
                        id="case-name" 
                        :state="bookingStates.caseName"                                        
                        v-model="booking.caseName">
                    </b-form-input>
                </b-form-group>
            </b-col>           
            
            <b-col cols="3">
                <b-form-group                        
                    label="Requested By" 
                    class="labels"
                    label-for="requested-by">
                    <b-form-select 
                        id="requested-by" 
                        class="input-line"                           
                        style="display:inline"
                        :options="requestOptions"
                        :state="bookingStates.request"
                        v-model="booking.requestedBy">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col>

            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Reason Code" 
                    label-for="reason-code">
                    <b-form-input 
                        class="input-line"
                        id="reason-code"  
                        placeholder="FA, HR"  
                        :state="bookingStates.reason"                                    
                        v-model="booking.reason">
                    </b-form-input>
                </b-form-group>
            </b-col>

            <b-col cols="3">
                <b-form-group                        
                    label="Method Of Appearance" 
                    class="labels"
                    label-for="appearance-method">
                    <b-form-select 
                        id="appearance-method" 
                        class="input-line"                           
                        style="display:inline"                                
                        :options="bookingMethodOfAppearanceOptions"
                        :state="bookingStates.methodOfAppearance"
                        v-model="booking.methodOfAppearance">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col>
        </b-row>
        

        <b-row class="ml-1">
            <b-col cols="2" >
                <b-form-group                        
                    label="Federal" 
                    class="labels"
                    label-for="federal">
                    <b-form-radio-group 
                        id="requested-by" 
                        :class="bookingStates.federal==false?'border rounded border-danger pb-3 pt-1 px-2':'input-line' "                           
                        style="display:inline"                                    
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
                        class="input-line"
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
                        class="input-line"
                        rows="3"
                        id="comment"                                                   
                        v-model="booking.comment">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row class="ml-1"> 
            <b-col cols="6 ">
                <b-row >
                    <b-button                     
                        style="margin:1rem 0; height: 2.25rem;"
                        v-if="!addNewLanguageForm" 
                        size="sm" 
                        :variant="bookingStates.language==false?'danger':'info'" 
                        @click="bookingStates.language=true;addNewLanguageForm = true"><b-icon-plus class="mr-1"/>Add Language
                    </b-button>
                    <div v-if="!addNewLanguageForm && booking.languages.length == 0" class="mt-4 ml-3 text-danger"> 
                        No languages have been added.
                    </div> 
                </b-row>

                <b-card class="mx-auto mt-4 bg-light" body-class="p-2" v-if="addNewLanguageForm">
                    <b-row class="ml-1">
                        <b-col cols="5">
                            <b-form-group                        
                                label="Language" 
                                class="labels"
                                label-for="language">
                                <b-form-select 
                                    id="language" 
                                    class="input-line"                           
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
                                    class="input-line"                           
                                    style="display:inline"
                                    :options="interpretForOptions"
                                    v-model="selectedInterpretFor">                                    
                                </b-form-select> 
                            </b-form-group>
                        </b-col>
                        <b-col cols="2 mt-4">
                            <b-button @click="addLanguage" variant="success" >
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

import {interpretForOptions, statusOptions, requestOptions, bookingPeriodOptions, bookingMethodOfAppearanceOptions, interpreterRequestOptions} from './BookingEnums'
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
    booking!: bookingInfoType

    @Prop({required: true})
    bookingStates!: bookingStatesInfoType;
    
    @Prop({required: true})
    languages: interpreterLanguageInfoType[]

    @commonState.State
    public courtLocations!: locationsInfoType[];

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
    interpreterRequestOptions
    interpretForOptions

    created(){
        this.interpretForOptions=interpretForOptions
        this.statusOptions=statusOptions.filter(stat =>  !stat.text.toLowerCase().includes("cancel"))        
        this.requestOptions=requestOptions 
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions 
        this.interpreterRequestOptions=interpreterRequestOptions
    }

    mounted() { 
        this.dataReady = false
        this.addNewLanguageForm = false  
        this.selectedInterpretFor = this.interpretForOptions[0].value;
        this.selectedLanguage = this.languages[0].languageName
        this.dataReady = true
    }

    public addLanguage(){
        const level = this.languages.filter(lang=>lang.languageName==this.selectedLanguage)
        
        this.booking.languages.push({
            language:this.selectedLanguage,
            level: (level.length==1? level[0].level : null),
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
    

}

</script>


<style lang="scss" scoped>
    .labels {        
        margin:0 0 0rem 0;        
        line-height: 1rem;
    }
    ::v-deep label{        
        margin:0 0 0.5rem 0;
    }

    .custom-radio{
        margin-top: 0.45rem;
    }
</style>