<template>
    <b-card class="bg-white border-white">                
            
        <loading-spinner color="#000" v-if="!dataLoaded" waitingText="Loading ..." />
        <b-card v-else class="w-100 mx-auto my-4 bg-light border-white">                
           
            <b-row>
                <b-col cols="4">
                    <b-form-group                        
                        label="Court Location" 
                        label-for="location">
                        <b-form-select 
                            id="location"                            
                            style="display:inline"                            
                            v-model="location"> 
                            <b-form-select-option
                                v-for="courtLocation in courtLocations" 
                                :key="courtLocation.id"
                                :value="courtLocation">
                                    {{courtLocation.name}}
                            </b-form-select-option>
                        </b-form-select> 
                    </b-form-group>
                </b-col>
                <b-col cols="4">

                    <b-form-group
                        class="labels"                
                        label="Interpreter" 
                        label-for="interpreter">
                        <b-form-input
                            class="input-line"
                            id="interpreter"                                         
                            v-model="interpreterName">
                        </b-form-input>
                    </b-form-group>
                    

                </b-col>
                <b-col cols="4">

                    <b-form-group
                        class="labels"                
                        label="Court File Number" 
                        label-for="file-number">
                        <b-form-input                             
                            class="input-line"
                            id="file-number"                                         
                            v-model="courtFileNumber">
                        </b-form-input>
                    </b-form-group>                    
                   
                </b-col>
                
            </b-row>

            <b-row>
                <b-col cols="4">
                    <b-form-group                        
                        label="Date Range" 
                        label-for="sessionDates">
                        <b-form-datepicker                            
                            id="sessionDates"
                            v-model="dates"                                                                                           
                            :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                            locale="en-US">
                        </b-form-datepicker>                        
                    </b-form-group>
                </b-col>
                <b-col cols="4">
                </b-col>
                <b-col cols="4">
                    <b-button
                        style="margin-top: 2rem; padding: 0.25rem 2rem; width: 100%;" 
                        :disabled="searching"
                        variant="primary"
                        @click="find()"
                        ><spinner color="#FFF" v-if="searching" style="margin:0; padding: 0; transform:translate(0px,0px);"/>
                        <span style="font-size: 20px;" v-else>Search</span>
                    </b-button>
                </b-col>                
            </b-row>

        </b-card>        

        <loading-spinner color="#000" v-if="searching && !resultsLoaded" waitingText="Loading Results ..." /> 

        <div v-else> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!bookings.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content border-white p-0">
                <b-table
                    :items="bookings"
                    :fields="bookingFields"
                    class="border-info"                                    
                    small
                    sort-icon-left
                    responsive="sm">

                    <template v-slot:cell(interpreter)="data" >                    
                        
                        <b-button style="font-size:14px; border: white; text-decoration: underline;" 
                            size="sm"                        
                            @click="displayInterpreterInfo(data.value);" 
                            class="text-primary bg-transparent"
                            >{{data.value.lastName}}, {{data.value.firstName}}
                        </b-button>

                    </template>

                    <template v-slot:cell(name)="data" >                    
                        <b>{{data.item.lastName | capitalizefirst}}</b>, {{data.item.firstName | capitalizefirst}}                    
                    </template>

                    <template v-slot:cell(dates)="data" >    
                        <span 
                            v-for="dateInfo,inx in data.value" 
                            :key="inx"
                            style="display: block;">                            
                            <b>{{dateInfo.date | beautify-date-weekday}}</b> - {{dateInfo.arrivalTime | convert-time24to12}}
                            <span v-if="dateInfo.period != 'WHOLE_DAY'"> ({{dateInfo.period | capitalize}})</span>
                        </span>

                    </template>                   

                    <template v-slot:cell(status)="data" >    
                        <b-badge v-if="data.value == 'Booked'" class="mt-2" variant="success">Booked</b-badge> 
                        <b-badge v-else-if="data.value == 'Cancelled'" class="mt-2" variant="danger">Cancelled</b-badge>
                        <b-badge v-if="data.value == 'Pending'" class="mt-2" variant="warning">Pending</b-badge>                                       
                    </template>                    

                    <template v-slot:cell(edit)="data">
                        <b-row  style="float: right;" class="mr-1">
                            <b-button style="font-size:12px;" 
                                size="sm"       
                                @click="downloadAdm(data.item);" 
                                class="text-primary bg-info border-info mt-1 " 
                                ><img 
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHaADAAQAAAABAAAAHAAAAADjGz/hAAAC2klEQVRIDe1Wy0uUURQ/9442PTaJLWqaiiCjqP6AwEAhwgja6cCMizaWIwW1aqM0QS1aGjRDERWlU1kpvWmjFhG0aBMFolCUj15ibULS8Z5+99Mr1++bme4IbaJvMfe87u93zrmvIfr//cUOCD/22nj6EpM4QMQBnz/WrwtBN6uqtjb2p2pzfp+tS1vR8mIJvblMsaGhges1qb4yP66tB6qJxNM8F3BGCPHcDi4mM/P9eb8QPWtWyNirC4em522WUJAUjobRbMstK7aoaCXrxSHheyurKuvfphqm/BMD7fUH5NN1+7alupagukDSJh6+/T+Gxrs3HXkUNjYzLop0cHAg831w/Ne6xkydAco3MtO+yYkPPX5f0QX3BxtdCpIKK68ElRsb2vnJyN7IvBQhFah47wI7lJJIo4nzOxSpc4p5lwek6E4kke4NUVnrcOfBiA2Oo1cPvcu2Gdm5vevj6QrFqpdAiIWcFCQmiEQIQLtnhNpuAF1GZ9KcJFTHqzxQKXeOZpOVMhSqRadjYx3Nl13ITIxze0NCvJvB1aE/ZnUXR+QGiZnu0c7kbQNmj3PHLe/udq50+FryDRDa0FLNvQEEx1WOX2JNn0SPdS2zCf8kO5NqIGR/isLhjVLKo0jgqQfOtIe/jiMZ98+5vRoymkjH5fTUt48dze1Q21HlY1Rdh7dhs58y2pipUYr7tF1KUTvSkew3Mc6kADmsFJ3FDhaReGYAL8pnnMFqDcRSPDSALqN7e2XZMxL0YhaUt4CwRsu4FE6XunudSUeuNr0e60xWh5eXr0aVXmUSxwW7t3U2EfdfZ1ID+f5i0xfIw7gcpkSIfxp7KWPgHJknCo6SnjZNinVPYfOcKJYANtXJkistBogdmtKghWK0T8cUrBQTS/rngLV9YMjyVWwIdUwe0ozCIQjYDWChcSzbsmCOTWwT6vmB9griK8hl9pItxOBgN632EzpM/YdCfgOczgLVckVGfAAAAABJRU5ErkJggg==" 
                                    alt="">                                                                                  
                            </b-button>
                            <b-button style="font-size:12px; padding: 0.55rem 0.9rem;" 
                                size="sm"       
                                @click="editBooking(data.item);" 
                                class="text-primary bg-info border-info mt-1 ml-2" >
                                <b-icon-pencil-fill scale="1.5"/>                                                       
                            </b-button>
                        </b-row> 
                    </template>                   
                    
                </b-table>

            
            </b-card>
        </div>

        <b-modal size="xl" v-model="showBookingWindow" header-class="bg-primary text-white" :key="updatedBookingInfo">
            <template v-slot:modal-title>
                <h1 class="my-2 ml-2">Update Court Interpreter Request</h1> 
            </template>

            <b-card class="bg-white border-white text-dark"> 
              
                <b-card no-body v-if="bookingDataReady" class="border-white">

                    <b-row class="mt-1 mb-4 ml-2 h2">
                        {{booking.interpreter.firstName}} {{booking.interpreter.lastName}} (Level {{booking.interpreter.highestLevel}})                        
                    </b-row>

                    <b-row class="ml-1">
                        <b-col cols="6">                    
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
                    </b-row>


                    <b-row class="ml-1">
                        <b-col cols="6">                    
                            
                        </b-col>   
                        <b-col cols="6">
                           
                        </b-col>         
                    </b-row>

                    <b-row class="ml-1">
                        <b-col cols="6">
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
                        <b-col cols="6">
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
                                    :options="interpreterRequestOptions"
                                    :state="bookingStates.interpretFor"
                                    v-model="booking.interpretFor">                                    
                                </b-form-select> 
                            </b-form-group>
                        </b-col>
                    </b-row>

                    <b-row class="ml-1">
                        <b-col cols="6">
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
                        <b-col cols="6">
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
                                        v-for="language in booking.interpreter.languages" 
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
                                    class="input-line"                           
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
                        <b-col cols="6">
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
                        <b-col cols="6">
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

                    <b-row class="ml-1">
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
                                    id="comment"                                                   
                                    v-model="booking.comment">
                                </b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>
                                                
                </b-card>
            </b-card>            

            <template v-slot:modal-footer>
                
                <b-button class="mr-auto" variant="dark" @click="closeBookingWindow">Cancel</b-button>
                <b-button
                    variant="success" 
                    @click="saveBooking">
                    <b-icon-check-square class="mr-2"/>Save
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

        <b-modal v-model="showInterpreterDetailsWindow" id="bv-modal-interpreter-details" header-class="bg-white text-primary" centered hide-footer>            
            <template v-slot:modal-title>
                <h2 class="my-2">{{interpreterDetails.firstName}} {{interpreterDetails.lastName}}</h2>
            </template>

            <b-row>
                <b-col style="font-weight: 700;">Phone</b-col>
                <b-col>{{interpreterDetails.phone}}</b-col>
            </b-row>
            <b-row>
                <b-col style="font-weight: 700;">Email Address</b-col>
                <b-col>{{interpreterDetails.email}}</b-col>
            </b-row>            
                       
            <template v-slot:modal-header-close>                 
                 <b-button variant="outline-white" style="padding-bottom:0;" class="text-primary closeButton" @click="$bvModal.hide('bv-modal-interpreter-details')"
                 >&times;</b-button>
            </template>
        </b-modal>  
    
    </b-card>
</template>

<script lang="ts">


import { Component, Vue, Watch } from 'vue-property-decorator';
import * as _ from 'underscore';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

import InterpreterDetails from "./components/InterpreterDetails.vue";
import AddCourtSessionForm from "./components/AddCourtSessionForm.vue";
import Spinner from "@/components/utils/Spinner.vue";

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { bookingStatesInfoType } from '@/types/Bookings';
import { bookingDateInfoType, bookingInfoType, bookingInterpreterInfoType, bookingSearchInfoType, dateRangeInfoType } from '@/types/Bookings/json';
import { max } from 'underscore';

enum bookingStatus {'Pending'='Pending', 'Booked'='Booked', 'Cancelled'='Cancelled'}
enum bookingPeriod {'Morning'='MORNING', 'Afternoon'='AFTERNOON', 'Full Day'='WHOLE_DAY'}
enum bookingInterpreterRequest {'Witness'='Witness', 'Party'='Party', 'Accused'='Accused'}
enum bookingMethodOfAppearance {'In Person'='In-Person', 'MS Teams'='MS Teams', 'Via Teleconference'='Via Teleconference', 'RIS'='RIS'}
enum bookingRequest {'Court'='Court', 'Crown'='Crown', 'Applicant'='Applicant', 'Defence'='Defence', 'Respondent'='Respondent'}



@Component({
    components:{
        Spinner,
        InterpreterDetails,
        AddCourtSessionForm

    }
})
export default class BookingsPage extends Vue {

    @commonState.State
    public courtLocations!: locationsInfoType[];

    @commonState.State
    public languages!: languagesInfoType[];    

    @commonState.State
    public userLocation!: locationsInfoType;

    @commonState.Action
    public UpdateCourtLocations!: (newCourtLocations: locationsInfoType[]) => void

    @commonState.Action
    public UpdateLanguages!: (newLanguages: languagesInfoType[]) => void    

    updated = 0;
    updatedBookingInfo = 0;
    
    bookingDataReady = false;
    
    showBookingWindow = false;
    showInterpreterDetailsWindow = false;
    bookingStates = {} as bookingStatesInfoType;    
    
    dataLoaded = false;  
    resultsLoaded = false; 
    searching = false;
    
    location = {} as locationsInfoType;
    
    dates: dateRangeInfoType[] = [];
    
    courtFileNumber = '';    
    interpreterName = '';
   
    booking = {} as bookingSearchInfoType;
    interpreter = {} as interpreterInfoType;
    bookings: bookingSearchInfoType[] = [];  
    interpreterDetails = {} as bookingInterpreterInfoType;

    statusOptions = [
        {text: 'Pending',         value: bookingStatus.Pending}, 
        {text: 'Booked',          value: bookingStatus.Booked},
        {text: 'Cancelled',       value: bookingStatus.Cancelled}
    ]

    interpreterRequestOptions = [
        {text: 'Witness',       value: bookingInterpreterRequest.Witness}, 
        {text: 'Party',         value: bookingInterpreterRequest.Party},
        {text: 'Accused',       value: bookingInterpreterRequest.Accused}
    ]

    requestOptions = [
        {text: 'Court',         value: bookingRequest.Court}, 
        {text: 'Crown',         value: bookingRequest.Crown},
        {text: 'Applicant',     value: bookingRequest.Applicant},
        {text: 'Defence',       value: bookingRequest.Defence},
        {text: 'Respondent',    value: bookingRequest.Respondent}
    ]

    bookingPeriodOptions = [
        {text: 'Full Day',      value: bookingPeriod['Full Day']}, 
        {text: 'Morning',       value: bookingPeriod.Morning},
        {text: 'Afternoon',     value: bookingPeriod.Afternoon}
    ]

    bookingMethodOfAppearanceOptions = [
        {text: 'In Person',            value: bookingMethodOfAppearance['In Person']}, 
        {text: 'MS Teams',             value: bookingMethodOfAppearance['MS Teams']},
        {text: 'Afternoon',            value: bookingMethodOfAppearance['Via Teleconference']},
        {text: 'Via Teleconference',   value: bookingMethodOfAppearance.RIS}
    ]   

    bookingFields = [        
        {key:'dates',          label:'Date Range',        sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'file',           label:'Court File Number', sortable:true, cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'caseName',       label:'Case Name',         sortable:true, cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'language',       label:'Language',          sortable:true, cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'interpreter',    label:'Interpreter',       sortable:true, cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'status',         label:'Status',            sortable:true, cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'comment',        label:'Comment',           sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle'},
        {key:'edit',           label:'',                  sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle'}
    ];    
   
    mounted() {  
        this.dataLoaded = false;
        this.bookingStates = {} as bookingStatesInfoType;
        this.extractInfo(); 
    }

    public extractInfo(){      
        this.loadCourtLocations();        
    }

     public find(){        
       
        this.resultsLoaded = false;
        this.searching = true;
        this.bookings = [];

        const body = {
            "file":this.courtFileNumber?this.courtFileNumber:'',
            "interpreter":this.interpreterName?this.interpreterName:'',  
            "dates": [],                           
            // "dates":this.dates,
            "location":this.location?this.location:null                
        }

        this.$http.post('/booking/search', body)
        .then((response) => {            
            if(response?.data?.data){                     
                this.bookings = response.data.data;        
                this.resultsLoaded = true;              
            }
            
        },(err) => {
            this.resultsLoaded = true;            
        });
        this.searching = false;
        
    }

    public editBooking(bookingToEdit: bookingSearchInfoType){

        this.booking = bookingToEdit;

        const levels = this.booking.interpreter.languages.map(language => {return language.level})
        this.booking.interpreter.highestLevel = max(levels);        
        this.showBookingWindow = true;
        this.bookingDataReady = true;        
        
    }

     public saveBooking(){
        if (this.checkBookingStates()){ 
            
            this.$http.put('/booking/' + this.booking.id, this.booking)
            .then((response) => {            
                if(response?.data){
                    this.closeBookingWindow();
                    this.find();                
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

    public displayInterpreterInfo(interpreterInfo: bookingInterpreterInfoType){
        this.interpreterDetails = interpreterInfo;
        this.showInterpreterDetailsWindow = true;
    }

    public downloadAdm(bookingInfo: bookingSearchInfoType){
        console.log('downloading');
    }

    public loadCourtLocations(){
        this.$http.get('/location')
        .then((response) => {            
            if(response?.data){                
                this.UpdateCourtLocations(response.data);
                this.loadLanguages();
            }
            
        },(err) => {
            console.log(err)            
        });
    }

    public loadLanguages(){
        this.$http.get('/language')
        .then((response) => {            
            if(response?.data){ 
                const languages = _.sortBy(response.data,'name')               
                this.UpdateLanguages(languages);                
            }
            this.location = this.userLocation?.name?this.userLocation:{} as locationsInfoType;
            this.dataLoaded = true;
        },(err) => {
            this.dataLoaded = true;            
        });
    }

    get sortedCourtLocations(){
        return _.sortBy(this.courtLocations,'name')
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
