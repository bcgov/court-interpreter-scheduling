<template>
    <b-card class="bg-white border-white">
        <h1>Interpreter Directory</h1>            
            
        <loading-spinner color="#000" v-if="!dataReady" waitingText="Loading ..." />
        <b-card v-else class="w-100 mx-auto my-4 bg-light border-white">                
            <b-row>
                <b-col cols="4">
                    <b-form-group                        
                        label="Name" 
                        label-for="name">
                        <b-form-input 
                            id="name"
                            @change="searchAgain"                            
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
                            @change="searchAgain"                            
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
                            @change="searchAgain"                      
                            style="display:inline"
                            v-model="language"
                            :options="languageNames"
                        >
                        </b-form-select> 
                    </b-form-group>
                </b-col>
                <b-col cols="1" />
                <b-col cols="2">
                    <b-form-group
                        style="width:20rem;"                       
                        label="Level" 
                        label-for="level">
                        <b-form-checkbox-group
                            id="level"
                            @change="searchAgain"
                            class="mt-3"
                            size="lg"
                            style="max-width:75%;"                   
                            v-model="level"
                            :options="levelOptions"                
                        ></b-form-checkbox-group>
                    
                    </b-form-group>
                </b-col>
                <b-col cols="1" />
                <b-col cols="4">
                    <b-form-group                        
                        label="Active/Inactive" 
                        label-for="active">
                        <b-form-select 
                            id="active"
                            @change="searchAgain"                            
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
                    <div class="mb-1">Criminal Record Check Expiry</div>
                    <booking-date-range-picker :key="updateCrc" :bookingRange="crcExpiryDate" @datesAdded="addCrcExpiryDates"/>                          
                </b-col>
                <b-col cols="1" />
                <b-col cols="2">
                     <b-button 
                        name="search"
                        @keyup.enter="find()"
                        style="margin: 2rem 3rem; padding: 0.25rem 2rem;" 
                        :disabled="searching"
                        variant="primary"
                        @click="find()"
                        ><spinner color="#FFF" v-if="searching" style="margin:0; padding: 0; height:2rem; transform:translate(0px,-24px);"/>
                        <span style="font-size: 20px;" v-else>Search</span>
                    </b-button>
                </b-col>
                <b-col cols="1" />
                <b-col cols="4">
                    <div class="text-right mt-4" style="">
                        <b-button 
                            class="ml-0 bg-transparent border border-success"
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
                    </div>
                </b-col>
                
            </b-row>
        </b-card>

        <loading-spinner color="#000" v-if="searching" waitingText="Loading Results ..." /> 

        <div v-else-if="dataLoaded"> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!interpreters.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content border-white p-0">
                <b-table
                    :items="currentPageInterpreters"
                    :fields="interpreterFields"
                    class="border-info" 
                    sort-icon-left                                   
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

                    <template v-slot:cell(lastName)="data" >                    
                        <b>{{data.item.lastName | capitalizefirst}}</b>, {{data.item.firstName | capitalizefirst}}                    
                    </template>

                    <template v-slot:cell(phone)="data" >
                        {{data.value | beautify-phone-no}}
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
                            class="mt-0 text-success border py-2"                            
                            variant="white"
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
                            class="text-primary bg-info border-info mt-0" 
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
                            <interpreter-details :interpreterDirectory="true" :interpreterDetails="expandedInterpreter" />
                        </b-card>
                    </template>
                    
                </b-table>

                <b-row style="float: right; margin-left: auto; margin-right: auto; padding: 0;" class="mt-4">
                    <b-dropdown 
                        style="height: 30% !important;"
                        class="mr-3 py-0"      
                        variant="primary">
                        <template #button-content >
                            <div style="display:inline; font-size: 0.75rem; line-height: 0.75rem !important; height: 40% !important;">
                                Items Per Page: {{itemsPerPage}}
                            </div>
                        </template>
                        <b-dropdown-item @click="switchNumberOfItems(10)">10</b-dropdown-item>
                        <b-dropdown-item @click="switchNumberOfItems(20)">20</b-dropdown-item>
                        <b-dropdown-item @click="switchNumberOfItems(30)">30</b-dropdown-item>
                    </b-dropdown>

                    <b-pagination                           
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="itemsPerPage" 
                        first-number
                        last-number                               
                        first-text="First"
                        prev-text="Prev"
                        next-text="Next"
                        last-text="Last">
                    </b-pagination>
                
                </b-row>
            
            </b-card>
        </div>

        <b-modal size="xl" v-model="showInterpreterWindow" header-class="bg-primary text-white" >
            <template v-slot:modal-title>
                <h1 v-if="isCreate" class="my-2 ml-2">Add Interpreter</h1>
                <h1 v-else class="my-2 ml-2">Update Interpreter Details</h1>
            </template>

            <b-card v-if="interpreterDataReady" class="bg-white border-white text-dark" :key="updatedInterpreterInfo"> 
              
                <b-card no-body class="border-white">

                    <b-row class="h2 ml-3" v-if="!isCreate">{{interpreter.firstName}} {{interpreter.lastName}}</b-row>

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
                    <h1 class="ml-3 pl-1 mt-3 mb-0 pb-0 labels text-primary">Languages</h1>
                    <b-row v-if="interpreterDataReady" class="border-white ml-1 mt-1">                           
                        <b-col cols="10">
                            <b-form-group
                                class="labels text-primary"                
                                >
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
                        <div v-if="interpreterStates.postal==false" style="margin-top:-1rem; font-size:10pt;" class="ml-1 text-danger" >Invalid Postal Code <i class="text-secondary">(Accepts: A1A 1A1)</i> </div>
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
                                :state="interpreterStates.phone"                                        
                                v-model="interpreter.phone">
                            </b-form-input>
                        </b-form-group>
                        <div v-if="interpreterStates.phone==false" style="margin-top:-1rem; font-size:10pt;" class="ml-1 text-danger" >Invalid Phone Format <i class="text-secondary">(Accepts: 123-456-7890)</i> </div>
                    </b-col>
                    <b-col cols="4">
                        <b-form-group
                            class="labels"                
                            label="Home Phone" 
                            label-for="home-phone">
                            <b-form-input 
                                class="input-line"
                                id="home-phone"
                                :state="interpreterStates.homePhone"                                                 
                                v-model="interpreter.homePhone">
                            </b-form-input>
                        </b-form-group>
                        <div v-if="interpreterStates.homePhone==false" style="margin-top:-1rem; font-size:10pt;" class="ml-1 text-danger" >Invalid Phone Format <i class="text-secondary">(Accepts: 123-456-7890)</i> </div>
                    </b-col> 
                    <b-col cols="4">
                        <b-form-group
                            class="labels"                
                            label="Business Phone" 
                            label-for="business-phone">
                            <b-form-input 
                                class="input-line"
                                id="business-phone"
                                :state="interpreterStates.businessPhone"                            
                                v-model="interpreter.businessPhone">
                            </b-form-input>
                        </b-form-group>
                        <div v-if="interpreterStates.businessPhone==false" style="margin-top:-1rem; font-size:10pt;" class="ml-1 text-danger" >Invalid Phone Format <i class="text-secondary">(Accepts: 123-456-7890)</i> </div>
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
                                :state="interpreterStates.email"
                                v-model="interpreter.email">
                            </b-form-input>
                        </b-form-group>
                        <div v-if="interpreterStates.email==false" style="margin-top:-1rem; font-size:10pt;" class="ml-1 text-danger" >Invalid Email</div>         
                    </b-col>                     
                </b-row>

                <h1 class="ml-3 pl-1 mt-3 labels text-primary">Details</h1>

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
                                v-model="interpreter.site_code">
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
                <!-- </b-card> -->
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

import InterpreterDetails from "../components/InterpreterDetails.vue";
import AddLanguageForm from "../components/AddLanguageForm.vue";
import Spinner from "@/components/utils/Spinner.vue";

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType, interpreterLanguageInfoType } from '@/types/Interpreters/json';

import BookingDateRangePicker from '@/components/tabs/components/BookingDateRangePicker.vue'

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { interpreterStatesInfoType } from '@/types/Interpreters';
import moment from 'moment-timezone';
import { dateRangeInfoType } from '@/types/Bookings/json';
const commonState = namespace("Common");

@Component({
    components:{
        Spinner,
        InterpreterDetails,
        AddLanguageForm,
        BookingDateRangePicker

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

    updateCrc = 0;

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
    
    dataReady = false;
    searching = false;
    dataLoaded = false;
    
    name = '';
    keyword = '';
    active = true;
    language = '';    
    level: string[] = [];
    crcExpiryDate: dateRangeInfoType = {startDate:null, endDate:null};

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
        {key:'details',             label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle'},
        {key:'lastName',            label:'Name',     sortable:true,  cellStyle:'',  thClass:'bg-primary text-white align-middle',tdClass:'align-middle'},
        {key:'phone',               label:'Phone',    sortable:true,  cellStyle:'',  thClass:'bg-primary text-white align-middle',tdClass:'align-middle'},
        {key:'email',               label:'Email',    sortable:true,  cellStyle:'',  thClass:'bg-primary text-white align-middle',tdClass:'align-middle'},
        {key:'languages',           label:'Language', sortable:true,  cellStyle:'',  thClass:'bg-primary text-white align-middle',tdClass:'align-middle'},
        {key:'level',               label:'Level',    sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',tdClass:'align-middle'},
        {key:'contractExtension',   label:'Active',   sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',tdClass:'align-middle'},
        {key:'city',                label:'City',     sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',tdClass:'align-middle'},
        {key:'new',                 label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',tdClass:'align-middle'},
        {key:'edit',                label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',tdClass:'align-middle'}
    ];

    languageFields = [
        {
            key:'languageName',          
            label:'Language',                  
            thClass: 'text-white bg-court',
            thStyle: 'font-size: 1rem;',
            tdClass:'align-middle',            
            sortable:false            
        }, 
        {
            key:'level',          
            label:'Level',   
            thClass: 'text-white bg-court', 
            thStyle: 'font-size: 1rem;',
            tdClass:'align-middle',    
            sortable:false            
        }, 
        {
            key:'commentOnLevel',          
            label:'Comment',   
            thClass: 'text-white bg-court', 
            thStyle: 'font-size: 1rem;',
            tdClass:'align-middle', 
            sortable:false            
        },
        {
            key:'edit',          
            label:'',   
            thClass: 'text-white bg-court',           
            sortable:false            
        }        
    ] 
    
    currentPage = 1;
    itemsPerPage = 10;// Default
   
    mounted() {  
        this.dataLoaded = false;
        this.dataReady = false; 
        this.searching = false;
        this.interpreterStates = {} as interpreterStatesInfoType;
        this.extractInfo()
        this.focusSearchButton()       
    }

    public extractInfo(){
        this.languageNames = this.languages.map( language => {return language.name});
        this.find()
    }

    public switchNumberOfItems(numberOfItemsPerPage){         
        this.itemsPerPage = numberOfItemsPerPage;
    }

    get totalRows() {
        return this.interpreters.length
    }

    public find(){
        this.dataLoaded = true;
        this.searching = true;
        this.interpreters = [];

        const body = {
            "name":this.name,
            "active":this.active,
            "language":this.language,
            "level":this.level,
            "city":'',//this.userLocation?.city?this.userLocation.city:'',
            "keywords":this.keyword,
            "criminalRecordCheck":this.crcExpiryDate                
        }

        this.$http.post('/interpreter/search-full-detail', body)
        .then((response) => {            
            if(response?.data){ 
                // console.log(response.data)
                this.interpreters = _.sortBy(response.data,'lastName');
            }    
                this.searching = false; 
                this.dataReady = true;           
            
        },(err) => {
            this.searching = false; 
            this.dataReady = true;           
        });
        
    }

    get currentPageInterpreters(){
        return this.interpreters.slice((this.itemsPerPage)*(this.currentPage-1), (this.itemsPerPage)*(this.currentPage-1) + this.itemsPerPage);
    }

    public editInterpreter(interpreterToEdit: interpreterInfoType){              
        this.interpreter = JSON.parse(JSON.stringify(interpreterToEdit));
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
        this.interpreterDataReady = false;
        this.interpreter.languages = [];  
        this.interpreter.province = this.provinceOptions[1].value;    
        this.interpreter.contractExtension = true;
        this.interpreterDataReady = true;
        this.showInterpreterWindow = true;
    }

    public downloadArchive(){

        const options = {
            responseType: "blob",
            headers: {
            "Content-Type": "application/json",
            }
        }

        const body = {            
            "ids":this.interpreters.map(interpreter=>interpreter.id)
        }
        
        this.$http.post('/interpreter/download-data-in-excel',body, options)
        .then((response) => {            
            if(response?.data){                 
                const blob = response.data;
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.download = "interpreters.csv";
                link.click();
                setTimeout(() => URL.revokeObjectURL(link.href), 1000);                
            }   
            
        },(err) => {
            
        });
    }

    public openDetails(newExpandedInterpreter: interpreterInfoType){
        this.expandedInterpreter = newExpandedInterpreter;
    }
    
    public saveNewInterpreter(){
        if (this.checkInterpreterStates()){ 

            if(this.interpreter.criminalRecordCheckDate){
                const crcDate = new Date(this.interpreter.criminalRecordCheckDate);           
                this.interpreter.criminalRecordCheckDate = moment.tz(crcDate, moment.tz.guess()).format();
            }

            this.$http.post('/interpreter', this.interpreter)
            .then((response) => {            
                if(response?.data){
                    this.closeInterpreterWindow();
                    // this.find();                
                }
                
            },(err) => {
                            
            });

        }        
    }

    public saveInterpreter(){    
        
        if (this.checkInterpreterStates()){

            const crcDate = new Date(this.interpreter.criminalRecordCheckDate);
            this.interpreter.criminalRecordCheckDate = moment.tz(crcDate, moment.tz.guess()).format();

            this.$http.put('/interpreter/' + this.interpreter.id, this.interpreter)
            .then((response) => {            
                if(response?.data){
                    this.closeInterpreterWindow();
                    this.find();                
                }
                
            },(err) => {
                            
            });
        }
    }

    public checkInterpreterStates(){

        let stateCheck = true;
    
        this.interpreterStates.lastName = !(this.interpreter.lastName)? false : null;
        this.interpreterStates.firstName = !(this.interpreter.firstName)? false : null;
        this.interpreterStates.languages = !(this.interpreter.languages && this.interpreter.languages.length > 0)? false : null;
      
        this.interpreterStates.city = !(this.interpreter.city)? false : null;
        this.interpreterStates.province = !(this.interpreter.province)? false : null;
        this.interpreterStates.postal = !(this.checkPostCodeFormat(this.interpreter.postal, this.interpreter.province))? false : null;
        
        this.interpreterStates.email = this.checkEmailFormat(this.interpreter.email)
        this.interpreterStates.phone = this.checkPhoneFormat(this.interpreter.phone)
        this.interpreterStates.homePhone = this.checkPhoneFormat(this.interpreter.homePhone)
        this.interpreterStates.businessPhone = this.checkPhoneFormat(this.interpreter.businessPhone)

        this.updatedInterpreterInfo ++;

        for(const field of Object.keys(this.interpreterStates)){
            if(this.interpreterStates[field]==false)
                stateCheck = false;
        }

        return stateCheck;            
    }

    public checkPostCodeFormat(postcode, province){
        if(province =='WA' && postcode){ 
            const postcodeFormat = /(^[0-9]{5}?$)|(^[0-9]{5}\-[0-9]{4}?$)/;                                
            if(!postcodeFormat.test(postcode)) return false
            return true
        }
        else if(postcode){
            const postcodeFormat = /^[a-zA-Z][0-9][a-zA-Z] [0-9][a-zA-Z][0-9]?$/;                              
            if(!postcodeFormat.test(postcode)) return false
            if(postcode?.substring(0,3) == 'A1A' && province != 'NL') return false
            if(postcode.length != 7 ) return false 
            return true
        }
        return false
    }

    public checkEmailFormat(email){
        
        const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;               
        if(email){     
            if(!emailFormat.test(email)) return false
            return null
        }
        return null
    }

    public checkPhoneFormat(phone){
       
        const phoneFormat = /^[0-9]{3}[\-\.\ ][0-9]{3}[\-\.\ ][0-9]{4}?$/;
        
        if(phone){                
            if(!phoneFormat.test(phone)) return false
            return null
        }
        return null           
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

    public searchAgain(){
        this.interpreters =[]
        this.dataLoaded = false;
        this.focusSearchButton();
    }

    public focusSearchButton(){
        Vue.nextTick(()=>{
            const el = document.getElementsByName("search")[0];
            if(el) el.focus();
        })        
    }

    public addCrcExpiryDates(dateRange){
        this.crcExpiryDate = dateRange
        this.updateCrc++;          
        this.searchAgain()
    }
}
</script>

<style scoped lang="scss">

    .labels {
        font-size: 16px; font-weight:600; line-height: 1rem;
    }

    h1.labels{
        font-size: 22px; font-weight:600; line-height: 1rem;
    }

    .input-line {
        font-size: 14px; font-weight:600;
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
