<template>
    <b-card class="bg-white border-white">           

        <loading-spinner color="#000" v-if="searching" waitingText="Loading Results ..." />
        <div v-else> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!interpreters.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content border-white p-0">
                <b-table
                    :items="interpreters"
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

                    <template v-slot:cell(languages)="data" >    
                        <span 
                            v-for="lan,inx in data.item.languages.map(language => {return {name: language.languageName, level:language.level}})" 
                            :key="inx"
                            style="display: block;">
                            <b v-if="lan['name'] == language">{{lan['name']}} {{lan['level']}}</b>
                            <span v-else>{{lan['name']}} {{lan['level']}}</span>
                        </span>

                    </template>

                    <template v-slot:cell(fullAddress)="data">    
                        <div 
                            v-html="data.value" 
                            style="display:inline">
                            {{data.value}}
                        </div>
                        <a
                            style="margin-left:0.5rem; display:inline"
                            target="_blank"
                            rel="noopener noreferrer"
                            :href="'https://www.google.com/maps/dir/?api=1&origin='+data.value+' '+data.item.postal+'&destination='+data.item.city+' BC courthouse'"                            
                        >{{data.item.postal}} 
                        </a>           
                    </template>

                    <template v-slot:cell(phone)="data" >    
                        <span                            
                            v-if="data.value"                            
                            style="display: block;">
                            {{data.value | beautify-phone-no}} mobile
                        </span>    
                        <span 
                            v-if="data.item.businessPhone"                            
                            style="display: block;">
                            {{data.item.businessPhone | beautify-phone-no}} work
                        </span>
                        <span 
                            v-if="data.item.homePhone"                            
                            style="display: block;">
                            {{data.item.homePhone | beautify-phone-no}} home
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

                    <template v-slot:cell(edit)="data" >
                        <div
                            v-b-tooltip.hover.left.noninteractive.v-danger
                            :title="bookingDates.length==0?'Please, first select the dates':''" 
                        >
                            <b-button style="font-size:12px" 
                                size="sm" 
                                :disabled="bookingDates.length==0"
                                @click="bookInterpreter(data.item);" 
                                
                                class="text-primary bg-info border-info mt-0 px-3" 
                                ><b>Book</b>
                            </b-button>
                        </div>
                        
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
                        <b-card bg-variant="inactive" class="mb-3" border-variant="white" body-class="px-1 pt-0 pb-1">                                                     
                            <interpreter-details :interpreterDirectory="false" :interpreterDetails="expandedInterpreter" />
                        </b-card>
                    </template>
                    
                </b-table>

            
            </b-card>
        </div>

        <b-modal body-class="py-0" size="xl" v-model="showBookingWindow" header-class="bg-primary text-white" >
            <template v-slot:modal-title>
                <h1 class="my-2 ml-2">Court Interpreter Request</h1> 
            </template>

            <b-card v-if="interpreterDataReady" class="border-white text-dark bg-white" body-class="py-0" :key="updatedBookingInfo"> 
                <b-row class="my-0 ml-2">
                    <b-col cols="9" class="my-3 h2">  
                        {{interpreter.firstName}} {{interpreter.lastName}} (Level {{interpreter.highestLevel}})
                    </b-col>                                       
                </b-row>

                <b-row class="mx-3 mt-0 mb-4">
                    <b-card
                        bg-variant="light"
                        class="input-line mx-1 my-1"
                        body-class="m-0 py-1 px-2"
                        style="width:11rem; margin:0; padding:0;"
                        id="dates"
                        :key="inx"
                        v-for="date,inx in booking.dates">
                        <b-icon-calendar variant="primary"/> {{date.date | beautify-date-weekday-month-day}} <b-icon-clock variant="primary"/> {{date.arrivalTime}}
                    </b-card>                        
                </b-row>

                <b-row class="my-0 ml-1">
                    
                    <b-col cols="3" class="py-0">                    
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
                </b-row>


                <b-row class="ml-1">
                    <b-col cols="6" class="py-0">
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
                    <b-col cols="6" class="py-0">
                        <b-form-group                        
                            label="Court Location" 
                            class="labels"
                            label-for="location">
                            <b-form-select 
                                id="location" 
                                class="input-line"                           
                                style="display:inline"
                                :state="bookingStates.location"
                                v-model="booking.locationId"> 
                                <b-form-select-option
                                    v-for="courtLocation in courtLocations" 
                                    :key="courtLocation.id"
                                    :value="courtLocation.id">
                                        {{courtLocation.name}}
                                </b-form-select-option>
                            </b-form-select> 
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row class="ml-1">
                    <b-col cols="6">
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
                    <b-col cols="6">
                        <b-form-group                        
                            label="Interpret For" 
                            class="labels"
                            label-for="interpret-for">
                            <b-form-select 
                                id="interpret-for" 
                                class="input-line"                           
                                style="display:inline"
                                :options="interpretForOptions"
                                :state="bookingStates.interpretFor"
                                v-model="booking.interpretFor">                                    
                            </b-form-select> 
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row class="ml-1">
                    <b-col cols="6" class="py-0">
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
                    <b-col cols="6" class="py-0">
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
                </b-row>

                <b-row class="ml-1">
                    <b-col cols="6">
                        <b-form-group                        
                            label="Language" 
                            class="labels"
                            label-for="language">
                            <b-form-select 
                                id="language" 
                                class="input-line"                           
                                style="display:inline"
                                :state="bookingStates.language"
                                v-model="booking.language"> 
                                <b-form-select-option
                                    v-for="language in interpreter.languages" 
                                    :key="language.languageName"
                                    :value="language.languageName">
                                        {{language.languageName}}
                                </b-form-select-option>
                            </b-form-select> 
                        </b-form-group>
                    </b-col>
                    <b-col cols="6">
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
                </b-row>
                <b-row class="ml-1">
                    <b-col cols="6" class="py-0">
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
                    <b-col cols="6" class="py-0">
                        <b-form-group
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
                </b-row>                                

                <b-row class="ml-1" style="padding-bottom:0; margin-bottom:0;">
                    <b-col cols="6">
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
                    <b-col cols="6">
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
                  
            </b-card>            

            <template v-slot:modal-footer>
                
                <b-button class="mr-auto" variant="dark" @click="closeBookingWindow">Cancel</b-button>
                <b-button 
                    
                    variant="success" 
                    @click="saveNewBooking">
                    <b-icon-calendar-check-fill class="mr-2"/>Create Booking
                </b-button>
                
            </template>

            <template v-slot:modal-header-close>
                <b-button
                    variant="outline-dark"
                    class="closeButton"
                    @click="closeBookingWindow"
                    >&times;</b-button
                >
            </template>
        </b-modal>       
    
    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';

import InterpreterDetails from "./InterpreterDetails.vue";


import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { bookingStatesInfoType } from '@/types/Bookings';
import { bookingDateInfoType, bookingInfoType } from '@/types/Bookings/json';
import { max } from 'underscore';
const commonState = namespace("Common");

import {interpretForOptions, statusOptions, requestOptions, bookingPeriodOptions, bookingMethodOfAppearanceOptions, interpreterRequestOptions} from './BookingEnums'

@Component({
    components:{       
        InterpreterDetails,
    }
})
export default class SearchInterpretersTable extends Vue {

    @Prop({required: true})
    interpreters!: interpreterInfoType[];

    @Prop({required: true})
    searching!: boolean;

    @Prop({required: true})
    language!: string;

    @Prop({required: true})
    bookingDates!: bookingDateInfoType[]

    @Prop({required: true})
    public searchLocation!: locationsInfoType;

    @commonState.State
    public userLocation!: locationsInfoType;

    @commonState.State
    public courtLocations!: locationsInfoType[];

    // @commonState.State
    // public languages!: languagesInfoType[];   
    
    
    // AddNewLanguageForm = false;       
    // addLanguageFormColor = 'court';
    // latestEditLanguageData;
    // isEditLanguageOpen = false;

    updatedBookingInfo = 0;
    
    interpreterDataReady = false;

    interpreter = {} as interpreterInfoType;    
   
    // updateTable = 0;
    showBookingWindow = false;
    // showConfirmDeleteInterpreter = false;
    bookingStates = {} as bookingStatesInfoType;    
    
    // dataLoaded = false;  
    // resultsLoaded = false; 
    // searching = false;
    
    // location = {} as locationsInfoType;


    
    // language = '';    
    // level: string[] = [];
    // locationState = true;
    booking = {} as bookingInfoType;
    

    
    expandedInterpreter = {} as interpreterInfoType;

   
    interpreterFields = [
        {key:'details',             label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:5%'},
        {key:'lastName',            label:'Name',     sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:20%'},
        {key:'languages',           label:'Language', sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:14%'},
        {key:'fullAddress',         label:'Address',  sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:21%'},
        {key:'phone',               label:'Phone',    sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:14%'},
        {key:'email',               label:'Email',    sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:16%'},
        {key:'new',                 label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:5%'},
        {key:'edit',                label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:5%'}
    ]; 

    statusOptions
    requestOptions
    bookingPeriodOptions
    bookingMethodOfAppearanceOptions
    interpreterRequestOptions
    interpretForOptions
    created(){
        this.interpretForOptions=interpretForOptions
        this.statusOptions=statusOptions 
        this.requestOptions=requestOptions 
        this.bookingPeriodOptions=bookingPeriodOptions 
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions 
        this.interpreterRequestOptions=interpreterRequestOptions
    }
   
    mounted() { 
        this.bookingStates = {} as bookingStatesInfoType;        
        // this.location = this.userLocation?.name?this.userLocation:{} as locationsInfoType;
    }

    public bookInterpreter(interpreterToBook: interpreterInfoType){              
        this.interpreter = interpreterToBook;
        this.booking = {} as bookingInfoType;
        this.booking.interpreterId = interpreterToBook.id;
        const levels = interpreterToBook.languages.map(language => {return language.level})
        this.interpreter.highestLevel = max(levels);
        this.prepopulateDefaultValues();
        
        this.showBookingWindow = true;
        this.interpreterDataReady = true;        
    }

    public prepopulateDefaultValues(){
        this.booking.status = this.statusOptions[0].value;
        this.booking.interpretFor = this.interpretForOptions[0].value;
        this.booking.requestedBy = this.requestOptions[0].value;
        this.booking.methodOfAppearance = this.bookingMethodOfAppearanceOptions[0].value;
        this.booking.locationId = this.searchLocation.id;
        this.booking.language = this.interpreter.languages[0].languageName;
        this.booking.dates = this.bookingDates
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

    public openDetails(newExpandedInterpreter: interpreterInfoType){
        this.expandedInterpreter = newExpandedInterpreter;
    }
    
    public saveNewBooking(){
        if (this.checkBookingStates()){ 
            
            this.$http.post('/booking', this.booking)
            .then((response) => {            
                if(response?.data){
                    this.closeBookingWindow();
                    this.$router.push({ name: "bookings" });                
                }
                
            },(err) => {
                            
            });
        }        
    }    

    public checkBookingStates(){

        let stateCheck = true;
    
        this.bookingStates.status = !(this.booking.status)? false : null;
        this.bookingStates.room = !(this.booking.room)? false : null;        
      
        this.bookingStates.location = !(this.booking.locationId)? false : null;
        this.bookingStates.file = !(this.booking.file)? false : null;
        this.bookingStates.interpretFor = !(this.booking.interpretFor)? false : null;
        this.bookingStates.caseName = !(this.booking.caseName)? false : null;
        this.bookingStates.request = !(this.booking.requestedBy)? false : null;
        this.bookingStates.language = !(this.booking.language)? false : null;
        this.bookingStates.reason = !(this.booking.reason)? false : null;
        this.bookingStates.prosecutor = !(this.booking.prosecutor)? false : null;
        this.bookingStates.methodOfAppearance = !(this.booking.methodOfAppearance)? false : null;
        this.bookingStates.federal = !(this.booking.federal != null)? false : null;
      
        this.updatedBookingInfo ++;

        for(const field of Object.keys(this.bookingStates)){
            if(this.bookingStates[field]==false)
                stateCheck = false;
        }

        return stateCheck;            
    }
    
    public closeBookingWindow(){
        this.showBookingWindow = false; 
        this.clearStates();
    }

    public clearStates(){

        for(const field of Object.keys(this.bookingStates)){
            this.bookingStates[field] = null;                
        }                             
    }
}
</script>

<style scoped lang="scss">

    .labels {
        font-size: 16px; font-weight:600; line-height: 1rem; color: rgb(12, 82, 114);
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
