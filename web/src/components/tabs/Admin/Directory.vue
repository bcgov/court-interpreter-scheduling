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
                        <span>{{data.label}}</span>
                        <b-button style="font-size:12px" 
                            size="sm"                        
                            @click="copyEmails();" 
                            class="text-primary bg-info border-info ml-3"
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

                    <template v-slot:cell(active)="data" >    
                        <span v-if="data.item.active"
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
                            @click="editInterpreter(data);" 
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
                        <b-card >                                                     
                            <interpreter-details :interpreterDetails="expandedInterpreter" />
                        </b-card>
                    </template>
                    
                </b-table>

            
            </b-card>
        </div>

        
    
    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as _ from 'underscore';

import InterpreterDetails from "./components/InterpreterDetails.vue";
import Spinner from "@/components/utils/Spinner.vue";

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");



@Component({
    components:{
        Spinner,
        InterpreterDetails

    }
})
export default class DirectoryPage extends Vue {

    @commonState.State
    public courtLocations!: locationsInfoType[];

    @commonState.State
    public languages!: languagesInfoType[];

    @commonState.State
    public userLocation!: locationsInfoType;    

    dataLoaded = false;  
    resultsLoaded = false; 
    searching = false;
    
    name = '';
    keyword = '';
    active = false;
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

    interpreterFields = [
        {key:'details',        label:'',     cellStyle:'', cellClass:''},
        {key:'name',        label:'Name',     cellStyle:'', cellClass:''},
        {key:'phone',       label:'Phone',    cellStyle:'', cellClass:''},
        {key:'email',       label:'Email',    cellStyle:'', cellClass:''},
        {key:'languages',   label:'Language', cellStyle:'', cellClass:''},
        {key:'level',       label:'Level',    cellStyle:'', cellClass:''},
        {key:'active',      label:'Active',   cellStyle:'', cellClass:''},
        {key:'city',        label:'City',     cellStyle:'', cellClass:''},
        {key:'new',         label:'',         cellStyle:'', cellClass:''},
        {key:'edit',        label:'',         cellStyle:'', cellClass:''}
    ];

    
   
    mounted() {  
        this.dataLoaded = false;        
       
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
            "name":"",
            "language":this.language,
            "level":this.level,
            "city":this.userLocation?this.userLocation:'',
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

    public editInterpreter(interpreter){
        console.log('editing');
    }

    public copyEmails(){
        console.log('copying');

    }

    public createInterpreter(interpreter){
        console.log('editing');
    }

    public downloadArchive(){
        console.log('copying');

    }

    public openDetails(newExpandedInterpreter: interpreterInfoType){
        this.expandedInterpreter = newExpandedInterpreter;
    }

}
</script>
