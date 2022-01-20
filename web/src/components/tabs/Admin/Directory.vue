<template>
    <b-card class="bg-white border-white">
        <h1>Interpreter Directory</h1>            
            
        <loading-spinner color="#000" v-if="!dataLoaded" waitingText="Loading ..." />
        <b-card v-else class="w-100 mx-auto my-4 bg-light border-white">                
            <b-row>
                <b-col cols="4">
                    <b-form-group                        
                        label="Name" 
                        label-for="name">
                        <b-form-input 
                            id="name"                            
                            style="display:inline"
                            v-model="name"
                            placeholder="First, last or both"
                        >
                        </b-form-input> 
                    </b-form-group>
                </b-col>
                <b-col cols="4"></b-col>
                <b-col cols="4">
                    <b-form-group                        
                        label="Keywords" 
                        label-for="keywords">
                        <b-form-input 
                            id="keywords"                            
                            style="display:inline"
                            v-model="keyword"
                            placeholder="Email, phone etc"
                        >
                        </b-form-input> 
                    </b-form-group>
                </b-col>
                
            </b-row>

            <b-row>
                <b-col cols="4">
                    <b-form-group                        
                        label="Language" 
                        label-for="language">
                        <b-form-select 
                            id="language"                            
                            style="display:inline"
                            v-model="language"
                            :options="languageNames"
                        >
                        </b-form-select> 
                    </b-form-group>
                </b-col>
                <b-col cols="4">
                    <b-form-group                       
                        label="Level" 
                        label-for="level">
                        <b-form-checkbox-group
                            id="level"
                            class="mt-3"
                            style="max-width:75%;"                   
                            v-model="level"
                            :options="levelOptions"                
                        ></b-form-checkbox-group>
                    
                    </b-form-group>

                </b-col>
                <b-col cols="4">
                    <b-form-group                        
                        label="Active/Inactive" 
                        label-for="active">
                        <b-form-select 
                            id="active"                            
                            style="display:inline"
                            v-model="active"
                            :options="activeOptions"
                        >
                        </b-form-select> 
                    </b-form-group>
                </b-col>
                
            </b-row>

            <b-row>
                <b-col cols="4">
                    <b-form-group                        
                        label="Criminal Record Check Expiry" 
                        label-for="crcExpiryDate">
                        <b-form-datepicker                            
                            id="crcExpiryDate"
                            v-model="crcExpiryDate"                                                                                           
                            :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                            locale="en-US">
                        </b-form-datepicker>                        
                    </b-form-group>
                </b-col>
                <b-col cols="4">
                     <b-button 
                        
                        style="margin: 2rem 6rem; padding: 0.25rem 2rem;" 
                        :disabled="searching"
                        variant="primary"
                        @click="find()"
                        ><spinner color="#FFF" v-if="searching" style="margin:0; padding: 0; transform:translate(0px,0px);"/>
                        <span style="font-size: 20px;" v-else>Search</span>
                    </b-button>

                </b-col>
                <b-col cols="4"></b-col>
                
            </b-row>
        </b-card>

        <b-row class="mb-2">

            <b-col cols="10"></b-col>
            
            <b-col cols="2">                
                <b-button 
                    class="ml-5 bg-transparent border border-success"
                    size="lg"
                    @click="createInterpreter"
                    v-b-tooltip.hover.noninteractive.v-success
                    title="create new interpreter">
                    <b-icon-plus scale="1.5" variant="success"/>
                </b-button>

                <b-button 
                    class="ml-2 bg-transparent border border-primary"
                    size="lg"
                    @click="downloadArchive"
                    v-b-tooltip.hover.noninteractive.v-primary
                    title="download archive">
                    <b-icon-download variant="primary"/>
                </b-button>
            </b-col>

        </b-row>

        <loading-spinner color="#000" v-if="searching && !resultsLoaded" waitingText="Loading Results ..." /> 

        <div v-else> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!interpreters.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content border-white p-0">
                <b-table
                    :items="interpreters"
                    :fields="interpreterFields"
                    class="border-info"                                    
                    small
                    responsive="sm">

                    <template v-slot:head(email)="data" >                    
                        <span class="mt-1">{{data.label}}</span>
                        <b-button style="font-size:14px" 
                            size="sm"                        
                            @click="copyEmails();" 
                            class="text-white bg-transparent border-primary ml-2"
                            v-b-tooltip.hover.top.noninteractive
                            title="Copy emails to clipboard" 
                            ><i class="fa fa-clone"></i>
                        </b-button>

                    </template>

                    <template v-slot:cell(name)="data" >                    
                        <b>{{data.item.lastName | capitalizefirst}}</b>, {{data.item.firstName | capitalizefirst}}                    
                    </template>

                    <template v-slot:cell(languages)="data" >    
                        <span 
                            v-for="lan,inx in data.item.languages.map(language => {return language.languageName})" 
                            :key="inx"
                            style="display: block;">
                            <b v-if="lan == language">{{lan}}</b>
                            <span v-else>{{lan}}</span>
                        </span>                                        
                    </template>

                    <template v-slot:cell(level)="data" >    
                        <span 
                            v-for="level,inx in data.item.languages.map(language => {return language.level})" 
                            :key="inx"
                            style="display: block; margin-left:0.25rem;">
                            {{level}}
                        </span>                                        
                    </template>

                    <template v-slot:cell(new)="data" >    
                        <b-badge 
                            v-if="!data.item.new"
                            class="mt-2"
                            pill
                            variant="success"
                            style="float: left;"
                            >New
                        </b-badge>                                        
                    </template>

                    <template v-slot:cell(contractExtension)="data">    
                        <span v-if="data.value"
                            style="display: block; margin-left:0.25rem;">
                            Active
                        </span>
                        <span v-else
                            style="display: block; margin-left:0.25rem;">
                            Inactive
                        </span>
                                            
                    </template>

                    <template v-slot:cell(edit)="data" >
                        
                        <b-button style="font-size:12px" 
                            size="sm"                        
                            @click="editInterpreter(data.item);" 
                            class="text-primary bg-info border-info mt-1" 
                            ><b-icon-pencil-fill/>                                                       
                        </b-button>
                        
                    </template>

                    <template v-slot:cell(details)="data" >
                        
                        <b-button 
                            style="font-size:20px; border: none;" 
                            size="sm" 
                            @click="openDetails(data.item); data.toggleDetails();" 
                            class="text-primary bg-transparent">
                            <b-icon-caret-right-fill v-if="!data.item['_showDetails']"></b-icon-caret-right-fill>
                            <b-icon-caret-down-fill v-if="data.item['_showDetails']"></b-icon-caret-down-fill>                                                       
                        </b-button>
                        
                    </template>
                    <template v-slot:row-details>
                        <b-card bg-variant="primary" border-variant="white" body-class="px-1 pt-0 pb-1">                                                     
                            <interpreter-details :interpreterDetails="expandedInterpreter" />
                        </b-card>
                    </template>
                    
                </b-table>

            
            </b-card>
        </div>

        <b-modal size="xl" v-model="showInterpreterWindow" header-class="bg-primary text-white" :key="updatedInterpreterInfo">
            <template v-slot:modal-title>
                <h1 v-if="isCreate" class="my-2 ml-2">Add Interpreter</h1>
                <h1 v-else class="my-2 ml-2">Update Interpreter Details</h1>
            </template>

            <b-card class="bg-white border-white text-dark"> 
              
                <b-card no-body v-if="interpreterDataReady" class="border-white">

                    <b-row v-if="!isCreate">interpreter.name</b-row>

                    <b-row class="ml-1">
                        <b-col cols="6">                    
                            <b-form-group
                                class="labels"                
                                label="First Name" 
                                label-for="firstname">
                                <b-form-input 
                                    class="input-line"
                                    id="firstname"                                    
                                    :state="interpreterStates.firstName"                  
                                    v-model="interpreter.firstName">
                                </b-form-input>
                            </b-form-group>
                        </b-col>   
                        <b-col cols="6">
                            <b-form-group
                                class="labels"                
                                label="Last Name" 
                                label-for="lastname">
                                <b-form-input
                                    class="input-line" 
                                    id="lastname"                                    
                                    :state="interpreterStates.lastName"                  
                                    v-model="interpreter.lastName">
                                </b-form-input>
                            </b-form-group>       
                        </b-col>         
                    </b-row>

                    <b-card no-body v-if="interpreterDataReady" class="border-white">

                        <b-card no-body class="border-white">
                            <b-row class="ml-1">   
                                <b-col cols="10">
                                    <b-form-group
                                        class="labels text-primary"                
                                        label="Languages:" 
                                        label-for="languages">
                                        <span 
                                            v-if="interpreter.languages.length == 0 && !AddNewLanguageForm" 
                                            id="languages" 
                                            class="text-muted ml-2 my-2 input-line">No languages have been assigned.
                                        </span>                                        
                                        <b-table
                                            v-else-if="interpreter.languages.length > 0"
                                            :key="updated"                                
                                            id="languages"
                                            :items="interpreter.languages"
                                            :fields="languageFields"                                            
                                            borderless    
                                            small                                            
                                            responsive="sm"
                                            >                                             
                                            <template v-slot:cell(edit)="data" >   
                                                <div style="float: right;">                                                                     
                                                    <b-button 
                                                        class="mr-2" 
                                                        size="sm" 
                                                        variant="transparent" 
                                                        @click="removeLanguage(data)">
                                                        <b-icon 
                                                            icon="trash-fill" 
                                                            font-scale="1.25" 
                                                            variant="danger"/>
                                                    </b-button>
                                                    <b-button 
                                                        size="sm" 
                                                        variant="transparent" 
                                                        @click="editLanguage(data)">
                                                        <b-icon icon="pencil-square" font-scale="1.25" variant="primary"/>
                                                    </b-button>
                                                </div>
                                            </template>

                                            <template v-slot:row-details="data">
                                                <b-card 
                                                    body-class="m-0 px-0 py-1" 
                                                    :border-variant="addLanguageFormColor" 
                                                    style="border:2px solid;">
                                                    <add-language-form 
                                                        :formData="data.item" 
                                                        :index="data.index" 
                                                        :isCreateLanguage="false" 
                                                        v-on:submit="modifyLanguageList" 
                                                        v-on:cancel="closeLanguageForm" />
                                                </b-card>
                                            </template>
                                        </b-table>
                                    </b-form-group>
                                    
                                </b-col>  
                                <b-col cols="2">           
                                    <b-button 
                                        style="margin-top: 2.25rem; height: 2.25rem; font-size: 0.75rem;"
                                        v-if="!AddNewLanguageForm" 
                                        size="sm" 
                                        variant="court" 
                                        @click="addNewLanguage"><b-icon-plus class="mr-1"/>Add Language</b-button>
                                    <span 
                                        v-if="interpreterStates.languages == false"
                                        style="display: block; font-size: 9pt;"
                                        class="text-danger my-2">At least one language is required.
                                    </span>
                                </b-col>
                            </b-row>
                        </b-card>           

                        <b-card 
                            v-if="AddNewLanguageForm" 
                            id="addLanguageForm" 
                            class="my-1 ml-4" 
                            :border-variant="addLanguageFormColor" 
                            style="border:2px solid; width: 81%;" 
                            body-class="px-1 py-1">
                            <add-language-form 
                                :formData="{}" 
                                :index="-1" 
                                :isCreateLanguage="true" 
                                v-on:submit="modifyLanguageList" 
                                v-on:cancel="closeLanguageForm" />                
                        </b-card>                        

                    </b-card>

                    <h1 class="ml-3 pl-1 labels text-primary">Contact Information</h1>

                    <b-row class="ml-1">
                        <b-col cols="12">
                            <b-form-group
                                class="labels"                
                                label="Address" 
                                label-for="address">
                                <b-form-input 
                                    class="input-line"
                                    id="address"                                         
                                    v-model="interpreter.address">
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <b-row class="ml-1">
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="City" 
                                label-for="city">
                                <b-form-input 
                                    class="input-line"
                                    id="city"     
                                    :state="interpreterStates.city"                                          
                                    v-model="interpreter.city">
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="Postal Code" 
                                label-for="postal">
                                <b-form-input 
                                    class="input-line"
                                    id="postal"     
                                    :state="interpreterStates.postal"                                                  
                                    v-model="interpreter.postal">
                                </b-form-input>
                            </b-form-group>
                        </b-col> 
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="Province" 
                                label-for="province">
                                <b-form-select 
                                    class="input-line"
                                    id="province"     
                                    :state="interpreterStates.province"                                                  
                                    v-model="interpreter.province"
                                    :options="provinceOptions">
                                </b-form-select>                               
                            </b-form-group>
                        </b-col>          
                    </b-row>
                    <b-row class="ml-1">
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="Phone" 
                                label-for="phone">
                                <b-form-input 
                                    class="input-line"
                                    id="phone"                                        
                                    v-model="interpreter.phone">
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="Home Phone" 
                                label-for="home-phone">
                                <b-form-input 
                                    class="input-line"
                                    id="home-phone"                                                  
                                    v-model="interpreter.homePhone">
                                </b-form-input>
                            </b-form-group>
                        </b-col> 
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="Business Phone" 
                                label-for="business-phone">
                                <b-form-input 
                                    class="input-line"
                                    id="business-phone"                              
                                    v-model="interpreter.businessPhone">
                                </b-form-input>
                            </b-form-group>
                        </b-col>          
                    </b-row>
                    <b-row class="ml-1">
                        <b-col cols="6">
                            <b-form-group
                                class="labels"                
                                label="Email" 
                                label-for="email">
                                <b-form-input 
                                    class="input-line"
                                    id="email"                                        
                                    v-model="interpreter.email">
                                </b-form-input>
                            </b-form-group>
                        </b-col>                     
                    </b-row>

                    <h1 class="ml-3 pl-1 mt-2 labels text-primary">Details</h1>

                    <b-row class="ml-1">
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="Supplier #" 
                                label-for="supplier">
                                <b-form-input 
                                    class="input-line"
                                    id="supplier"                                        
                                    v-model="interpreter.supplier">
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="Site Code" 
                                label-for="site-code">
                                <b-form-input 
                                    class="input-line"
                                    id="site-code" 
                                    placeholder="001"                                                 
                                    v-model="interpreter.siteCode">
                                </b-form-input>
                            </b-form-group>
                        </b-col> 
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="GST" 
                                label-for="gst">
                                <b-form-input 
                                    class="input-line"
                                    id="gst"                              
                                    v-model="interpreter.gst">
                                </b-form-input>
                            </b-form-group>
                        </b-col>          
                    </b-row>

                    <b-row class="ml-1">
                        <b-col cols="4">
                            <b-form-group
                                class="labels"                
                                label="Criminal Record Check Date" 
                                label-for="crc-date">
                                <b-form-datepicker                            
                                    id="crc-date"
                                    v-model="interpreter.criminalRecordCheckDate"                                                                                           
                                    :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                                    locale="en-US">
                                </b-form-datepicker>                                
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group
                                class="labels"                
                                label="Comment On Criminal Record Check" 
                                label-for="crc-comment">
                                <b-form-input 
                                    class="input-line"
                                    id="crc-comment"                                                 
                                    v-model="interpreter.criminalRecordCheckComment">
                                </b-form-input>
                            </b-form-group>
                        </b-col> 
                        <b-col cols="2"> 
                            <b-form-group>                           
                                <b-form-checkbox 
                                    class="mt-4 labels"
                                    style="padding-top: 0.75rem;"                                                                                             
                                    v-model="interpreter.contractExtension">Contract Active
                                </b-form-checkbox> 
                            </b-form-group>                           
                        </b-col>          
                    </b-row>

                    <b-row class="ml-1">
                        <b-col cols="12">
                            <b-form-group
                                class="labels"                
                                label="Comment" 
                                label-for="comment">
                                <b-form-textarea 
                                    class="input-line"
                                    id="comment"                                                   
                                    v-model="interpreter.comments">
                                </b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <b-row class="ml-1">
                        <b-col cols="12">
                            <b-form-group
                                class="labels"                
                                label="Admin Comment" 
                                label-for="admin-comment">
                                <b-form-textarea 
                                    class="input-line"
                                    id="admin-comment"                                                   
                                    v-model="interpreter.adminComments">
                                </b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>                                
                </b-card>
            </b-card>            

            <template v-slot:modal-footer>
                <b-button 
                    v-if="!isCreate"
                    variant="danger"
                    class="mr-auto" 
                    @click="confirmDeleteInterpreter">
                    <b-icon-person-x-fill class="mr-1" />Delete
                </b-button>
                <b-button variant="dark" @click="closeInterpreterWindow">Cancel</b-button>
                <b-button 
                    v-if="isCreate"
                    variant="success" 
                    @click="saveNewInterpreter">
                    <b-icon-person-plus-fill class="mr-1"/>Add Interpreter
                </b-button>
                <b-button 
                    v-else-if="!isCreate"
                    variant="success" 
                    @click="saveInterpreter">
                    <b-icon-person-check-fill class="mr-1"/>Save
                </b-button>
            </template>

            <template v-slot:modal-header-close>
                <b-button
                    variant="outline-dark"
                    class="closeButton"
                    @click="closeInterpreterWindow"
                    >&times;</b-button
                >
            </template>
        </b-modal>

        
    
    </b-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as _ from 'underscore';

import InterpreterDetails from "./components/InterpreterDetails.vue";
import AddLanguageForm from "./components/AddLanguageForm.vue";
import Spinner from "@/components/utils/Spinner.vue";

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType, interpreterLanguageInfoType } from '@/types/Interpreters/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { interpreterStatesInfoType } from '@/types/Interpreters';
const commonState = namespace("Common");

@Component({
    components:{
        Spinner,
        InterpreterDetails,
        AddLanguageForm

    }
})
export default class DirectoryPage extends Vue {

    @commonState.State
    public courtLocations!: locationsInfoType[];

    @commonState.State
    public languages!: languagesInfoType[];

    @commonState.State
    public userLocation!: locationsInfoType;    

    isCreate = false;

    AddNewLanguageForm = false;       
    addLanguageFormColor = 'court';
    latestEditLanguageData;
    isEditLanguageOpen = false;

    updated = 0;
    updatedInterpreterInfo = 0;
    
    interpreterDataReady = false;

    interpreter = {} as interpreterInfoType;    
   
    updateTable = 0;
    showInterpreterWindow = false;
    showConfirmDeleteInterpreter = false;
    interpreterStates = {} as interpreterStatesInfoType;    
    
    dataLoaded = false;  
    resultsLoaded = false; 
    searching = false;
    
    name = '';
    keyword = '';
    active = true;
    language = '';    
    level: string[] = [];
    crcExpiryDate = '';

    interpreters: interpreterInfoType[] = [];
    expandedInterpreter = {} as interpreterInfoType;

    languageNames: string[] = [];    

    activeOptions = [
        {text: 'Active', value: true}, 
        {text: 'Inactive', value: false}
    ];

    levelOptions = ['1', '2', '3', '4'];

    provinceOptions = [
        {text: 'Alberta',                   value: 'AB'}, 
        {text: 'British Columbia',          value: 'BC'},
        {text: 'Manitoba',                  value: 'MB'}, 
        {text: 'New Brunswick',             value: 'NB'},
        {text: 'Newfoundland and Labrador', value: 'NL'},
        {text: 'Northwest Territories',     value: 'NT'},
        {text: 'Nova Scotia',               value: 'NS'},
        {text: 'Nunavut',                   value: 'NU'},
        {text: 'Ontario',                   value: 'ON'},
        {text: 'Prince Edward Island',      value: 'PE'},         
        {text: 'Quebec',                    value: 'QC'},
        {text: 'Saskatchewan',              value: 'SK'}, 
        {text: 'Washington - US',           value: 'WA'}, 
        {text: 'Yukon',                     value: 'YT'}        
    ]

    interpreterFields = [
        {key:'details',             label:'',     cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'name',                label:'Name',     cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'phone',               label:'Phone',    cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'email',               label:'Email',    cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'languages',           label:'Language', cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'level',               label:'Level',    cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'contractExtension',   label:'Active',   cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'city',                label:'City',     cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'new',                 label:'',         cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'edit',                label:'',         cellStyle:'', thClass:'bg-primary text-white align-middle'}
    ];

    languageFields = [
        {
            key:'languageName',          
            label:'Language',                  
            thClass: 'text-white bg-court',
            thStyle: 'font-size: 1rem;',            
            sortable:false            
        }, 
        {
            key:'level',          
            label:'Level',   
            thClass: 'text-white bg-court', 
            thStyle: 'font-size: 1rem;',          
            sortable:false            
        }, 
        {
            key:'commentOnLevel',          
            label:'Comment',   
            thClass: 'text-white bg-court', 
            thStyle: 'font-size: 1rem;',          
            sortable:false            
        },
        {
            key:'edit',          
            label:'',   
            thClass: 'text-white bg-court',           
            sortable:false            
        }        
    ]    
   
    mounted() {  
        this.dataLoaded = false;        
        this.interpreterStates = {} as interpreterStatesInfoType;
        this.extractInfo()       
    }

    public extractInfo(){

        this.languageNames = this.languages.map( language => {return language.name});

        this.dataLoaded = true;
    }

    public find(){
        this.resultsLoaded = false;
        this.searching = true;
        this.interpreters = [];

        const body = {
            "name":this.name,
            "active":this.active,
            "language":this.language,
            "level":this.level,
            "city":this.userLocation?.city?this.userLocation.city:'',
            "keywords":this.keyword,
            "criminalRecordCheck":this.crcExpiryDate?this.crcExpiryDate:null                
        }

        this.$http.post('/interpreter/search', body)
        .then((response) => {            
            if(response?.data?.data){ 
                console.log(response.data)
                this.interpreters = _.sortBy(response.data.data,'lastName');
                this.resultsLoaded = true;
            }
            
        },(err) => {
            this.resultsLoaded = true;            
        });
        this.searching = false;
    }

    public editInterpreter(interpreterToEdit: interpreterInfoType){              
        this.interpreter = interpreterToEdit;
        this.isCreate = false;
        this.showInterpreterWindow = true;
        this.interpreterDataReady = true;        
    }

    public copyEmails(){        
        const emailList = this.interpreters.map( interpreter => {if (interpreter.email && interpreter.email.length)return interpreter.email});      

        let inputField =document.createElement('input');
        document.body.appendChild(inputField)
        inputField.value =emailList.toString();
        inputField.select();
        document.execCommand('copy',false);
        inputField.remove();
    }

    public createInterpreter(){       
        this.interpreter = {} as interpreterInfoType;        
        this.isCreate = true;
        this.showInterpreterWindow = true;
        this.interpreterDataReady = false;
        this.interpreter.languages = [];       
        this.interpreterDataReady = true;
    }

    public downloadArchive(){
        console.log('copying');

    }

    public openDetails(newExpandedInterpreter: interpreterInfoType){
        this.expandedInterpreter = newExpandedInterpreter;
    }
    
    public saveNewInterpreter(){
        if (this.checkInterpreterStates()){ 
            
            this.$http.post('/interpreter', this.interpreter)
            .then((response) => {            
                if(response?.data){
                    this.closeInterpreterWindow();
                    this.find();                
                }
                
            },(err) => {
                            
            });

        }        
    }

    public saveInterpreter(){    
        
        if (this.checkInterpreterStates()){

            this.$http.put('/interpreter/' + this.interpreter.id, this.interpreter)
            .then((response) => {            
                if(response?.data){
                    this.closeInterpreterWindow();
                    this.find();                
                }
                
            },(err) => {
                            
            });        
        
            //TODO call find 
            // const index = this.interpreters.findIndex(originalInterpreter => originalInterpreter.id == this.interpreter.id)  //may not be required                       
            // this.interpreters[index] = this.interpreter; //may not be required
            
                
            // this.closeInterpreterWindow();

            // this.updateTable ++;

        }
        
        
    }

    public checkInterpreterStates(){

        let stateCheck = true;
    
        this.interpreterStates.lastName = !(this.interpreter.lastName)? false : null;
        this.interpreterStates.firstName = !(this.interpreter.firstName)? false : null;
        this.interpreterStates.languages = !(this.interpreter.languages && this.interpreter.languages.length > 0)? false : null;
      
        this.interpreterStates.city = !(this.interpreter.city)? false : null;
        this.interpreterStates.province = !(this.interpreter.province)? false : null;
        this.interpreterStates.postal = !(this.interpreter.postal)? false : null;
      
        this.updatedInterpreterInfo ++;

        for(const field of Object.keys(this.interpreterStates)){
            if(this.interpreterStates[field]==false)
                stateCheck = false;
        }

        return stateCheck;            
    }

    public addNewLanguage(){
        if(this.isEditLanguageOpen){            
            this.addLanguageFormColor = 'danger'
        }else{
            this.AddNewLanguageForm = true;            
        }
    }

    public modifyLanguageList(isCreateLanguage: boolean, newLanguage: interpreterLanguageInfoType, index: number){    
        //TODO: add check states    

        if (isCreateLanguage){           
            this.interpreter.languages.push(newLanguage)
            this.closeLanguageForm();
        } else {           
            this.interpreter.languages[index].languageName = newLanguage.languageName;
            this.interpreter.languages[index].level = newLanguage.level;     
            this.interpreter.languages[index].commentOnLevel = newLanguage.commentOnLevel;       
            this.closeLanguageForm();
        }
        this.updated ++;
        
    }

    public removeLanguage(data){        
        this.interpreter.languages.splice(data.index,1);
        this.updated ++;        
    }

    public closeLanguageForm() {                     
        this.AddNewLanguageForm= false; 
        this.addLanguageFormColor = 'court'
        if(this.isEditLanguageOpen){
            this.latestEditLanguageData.toggleDetails();
            this.isEditLanguageOpen = false;
        } 
    }

     public editLanguage(data) {
        if(this.AddNewLanguageForm || this.isEditLanguageOpen){            
            this.addLanguageFormColor = 'danger';                     
        }else if(!this.isEditLanguageOpen && !data.detailsShowing){
            data.toggleDetails();
            this.isEditLanguageOpen = true;
            this.latestEditLanguageData = data            
        }   
    }

    public confirmDeleteInterpreter(){        
        this.showConfirmDeleteInterpreter = true;
    }
    
    public cancelInterpreterDeletion() {
        this.showConfirmDeleteInterpreter = false;
    }

    public deleteInterpreter(){
        
        this.showConfirmDeleteInterpreter = false;
        //TODO: add api call
        const index = this.interpreters.findIndex(originalInterpreter => originalInterpreter.id == this.interpreter.id) //may not need this                        
        this.interpreters.splice(index, 1);      //may not need this 
               
        this.closeInterpreterWindow();
        //TODO call the find() method
        this.updateTable ++; //may not need this
    }

    public closeInterpreterWindow(){
        this.showInterpreterWindow = false; 
        this.clearStates();
    }

    public clearStates(){

        for(const field of Object.keys(this.interpreterStates)){
            this.interpreterStates[field] = null;
                
        }
                             
    }
}
</script>

<style scoped lang="scss">

    .labels {
        font-size: 16px; font-weight:600;
    }

    .input-line {
        font-size: 12px; font-weight:600;
    }

    .closeButton {
        background-color: transparent !important;
        color: white;
        border: white;
        font-weight: 700;
        font-size: 2rem;
        padding-top: 0;
        margin-top: 0;
    }

</style>
