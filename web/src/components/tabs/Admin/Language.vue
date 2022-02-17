<template>
    <b-card bg-variant="light" border-variant="white">
        <h1>Languages</h1>

        <b-card class="w-50 mx-auto my-4 py-3 bg-white border-light">                
            <b-row>
                
                <b-col cols="4" class="text-primary">
                    Filter Results By: 
                </b-col>
               
                <b-col cols="8" class="ml-0 pl-0 py-1">
                    <b-form-input                             
                        style="display:inline"
                        v-model="filterKeyword"
                        placeholder="keyword"
                    >
                    </b-form-input>
                </b-col>
                
            </b-row>
        </b-card>

        <loading-spinner v-if= "!dataLoaded" waitingText="Loading ..."/>

        <b-card class="w-50" v-else no-body style="margin: 0 auto">                                        
            <b-card v-if="languageError" border-variant="white" id="LanguageError" no-body>
                <h2 
                     
                    class="mx-1 mt-2">
                    <b-badge 
                        v-b-tooltip.hover 
                        :title="languageErrorMsgDesc"  
                        variant="danger"> {{languageErrorMsg}} 
                        <b-icon 
                            class="ml-3" 
                            icon = x-square-fill 
                            @click="languageError = false" />
                    </b-badge>
                </h2>
            </b-card>

            <div>
                <b-card  v-if="!addNewLanguageForm" border-variant="white" class="text-center">                
                    <b-button size="sm" variant="success" @click="addNewLanguage"> <b-icon icon="plus" /> Add New Language</b-button>
                </b-card>

                <b-card v-else id="addNewLanguageForm" class="my-3 mx-2" :border-variant="addFormColor" style="border:2px solid" body-class="m-0 px-0 py-1">
                    <add-new-language-form :formData="{}" :isCreate="true" v-on:submit="saveLanguage" v-on:cancel="closeLanguageForm" />              
                </b-card>
            </div>

            <div>
                <b-card no-body border-variant="white" bg-variant="white" v-if="!languageList.length" style="margin:auto">
                    <span class="text-muted ml-4 my-5">No languages exist.</span>
                </b-card>

                <b-card v-else border-variant="light" bg-variant="white">
                    <b-table
                        :key="updateTable"
                        :items="filteredLanguages"
                        :fields="fields"                        
                        sort-icon-left
                        head-row-variant="primary"                           
                        borderless
                        small
                        responsive="sm">                            
                                            
                            <template v-slot:head(name) >
                                <span>Language</span> 
                            </template>                                

                            <template v-slot:cell(edit)="data" >
                                <b-button 
                                    style="float:right"
                                    :disabled="data.item['_rowVariant']?true:false" 
                                    class="my-0 py-0 border-0" 
                                    v-b-tooltip
                                    :title="'Edit '+ data.item.name "
                                    size="sm" 
                                    variant="transparent" 
                                    @click="editLanguage(data)">
                                        <b-icon icon="pencil-square" font-scale="1.25" variant="primary"/>
                                </b-button>
                            </template>

                            <template v-slot:row-details="data">
                                <b-card :id="data.item.name" body-class="m-0 px-0 py-1" :border-variant="addFormColor" style="border:2px solid">
                                    <add-new-language-form :formData="data.item" :isCreate="false" v-on:submit="saveLanguage" v-on:cancel="closeLanguageForm" />
                                </b-card>
                            </template>
                    </b-table>
                </b-card> 
            </div>                                     
        </b-card>

        <b-modal v-model="openErrorModal" header-class="bg-warning text-light">
            <b-card class="h4 mx-2 py-2">
                <span class="p-0">{{errorText}}</span>
            </b-card>                        
            <template v-slot:modal-footer>
                <b-button variant="primary" @click="openErrorModal=false">Ok</b-button>
            </template>            
            <template v-slot:modal-header-close>                 
                <b-button variant="outline-warning" class="text-light closeButton" @click="openErrorModal=false"
                >&times;</b-button>
            </template>
        </b-modal>       
        
    </b-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as _ from 'underscore';
import moment from 'moment-timezone';
import { namespace } from "vuex-class";

import "@/store/modules/common";
const commonState = namespace("Common");

import { languagesInfoType } from "@/types/Common/json";
import AddNewLanguageForm from "./components/AddNewLanguageForm.vue";

@Component({
    components:{
        AddNewLanguageForm
    }
})
export default class LanguagePage extends Vue {

    @commonState.State
    public languages!: languagesInfoType[];

    dataLoaded = false;  
    isEditOpen = false;
    latestEditData;

    filterKeyword="";

    languageError = false;
    languageErrorMsg = '';
    languageErrorMsgDesc = '';

    addNewLanguageForm = false;
    addFormColor = 'dark';
    updateTable =0;

    languageList: languagesInfoType[] = [];

    errorText=''
	openErrorModal=false;

    fields = [ 
        {key:'name', label:'', sortable:false, tdClass: 'border-top'  },
        {key:'edit', label:'',  sortable:false, tdClass: 'border-top', thClass:'',},       
    ];  
   
    mounted() { 
        this.getLanguages();       
    }

    public getLanguages() { 
        this.closeLanguageForm(); 
        Vue.nextTick(()=>{         
            this.dataLoaded = false;
           
            this.$http.get('/language')
                .then(response => {
                    if(response.data){
                        this.languageList = _.sortBy(response.data,'name')                        
                    }
                    this.dataLoaded = true;
                },err => {
                    this.errorText=err.response.statusText+' '+err.response.status + '  - ' + moment().format(); 
                    if (err.response.status != '401') {
                        this.openErrorModal=true;
                    }   
                    this.dataLoaded=true;
                }) 
        });       
    }

    get filteredLanguages(){
       if(this.filterKeyword)
            return this.languageList.filter(language=>{
                return (
                    language.name.toLowerCase().includes(this.filterKeyword.toLowerCase())
                )
            })
        
        else
            return this.languageList
    }

    public addNewLanguage(){
        if(this.isEditOpen){            
            this.addFormColor = 'danger'
        }else
        {
            this.addNewLanguageForm = true;            
        }
    }

    public editLanguage(language){
        if(this.addNewLanguageForm){            
            this.addFormColor = 'danger'
        }else if(this.isEditOpen){            
            this.addFormColor = 'danger'               
        }else if(!this.isEditOpen && !language.detailsShowing){
            language.toggleDetails();
            this.isEditOpen = true;
            this.latestEditData = language;            
        }  
    }

    public saveLanguage(body, iscreate){
        this.languageError = false;       
        body['name'] = body.name;
        const method = iscreate? 'post' :'put';            
        const url = iscreate?'/language':'/language/' + body.id 
        const options = { method: method, url:url, data:body}
        
        this.$http(options)
            .then(response => {                
                this.getLanguages();

            }, err=>{                
                let errMsg = err.response.data.detail;
                if(errMsg.includes('=')){
                    errMsg = errMsg.split('=')[1]
                }

                errMsg = err.response?.status == 409 ? (err.response.statusText+': Language with name '+errMsg): errMsg

                this.languageErrorMsg = errMsg.length>30? (errMsg.slice(0,30)+' ...'): errMsg;
                this.languageErrorMsgDesc = errMsg;
                this.languageError = true; 
                this.closeLanguageForm(); 
                window.scrollTo(0,0);           
            });                
    }

    public closeLanguageForm() {                     
        this.addNewLanguageForm = false; 
        this.addFormColor = 'secondary'
        if(this.isEditOpen){
            this.latestEditData.toggleDetails();
            this.isEditOpen = false;
        } 
    }

    public addLanguageToList(languageJson){
        
        const language = {} as languagesInfoType;
        language.id = languageJson.id;
        language.name = languageJson.name;        
        this.languageList.push(language);
       
    }

    public modifyLanguageList(modifiedLanguageJson){            

        const index = this.languageList.findIndex(language =>{ if(language.id == modifiedLanguageJson.id) return true})
        if(index>=0){
            this.languageList[index].id =  modifiedLanguageJson.id;                
            this.languageList[index].name = modifiedLanguageJson.name;             
        }       
    }
}
</script>