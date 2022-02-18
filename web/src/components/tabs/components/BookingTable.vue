<template>
    <b-card class="bg-white border-white">                
            
        <loading-spinner color="#000" v-if="searching" waitingText="Loading Results ..." /> 
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
                        
                        <b-button style="font-size:18px; border: white; text-decoration: underline;" 
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
                            v-for="dateInfo,inx in sortByDate(data.value)" 
                            :key="inx"
                            style="display: block;">                            
                            <b style="font-size:11pt;">{{dateInfo['date'] | beautify-date-weekday}}</b> - {{dateInfo['arrivalTime'] | convert-time24to12}}
                            <span> ({{getBookingPeriod(dateInfo['period'])}})</span>
                        </span>

                    </template>                   

                    <template v-slot:cell(status)="data" >    
                        <b-badge v-if="data.value == 'Booked'" class="p-3" variant="success">Booked</b-badge> 
                        <b-badge v-else-if="data.value == 'Cancelled'" class="p-3" variant="danger">Cancelled</b-badge>
                        <b-badge v-if="data.value == 'Pending'" class="p-3" variant="warning">Pending</b-badge>                                       
                    </template>                    

                    <template v-slot:cell(edit)="data">
                        <b-row  style="float: right;" class="mr-1">
                            <!-- <b-button style="font-size:12px;" 
                                size="sm"       
                                @click="downloadAdm(data.item);" 
                                class="text-primary bg-info border-info mt-1 " 
                                ><img 
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHaADAAQAAAABAAAAHAAAAADjGz/hAAAC2klEQVRIDe1Wy0uUURQ/9442PTaJLWqaiiCjqP6AwEAhwgja6cCMizaWIwW1aqM0QS1aGjRDERWlU1kpvWmjFhG0aBMFolCUj15ibULS8Z5+99Mr1++bme4IbaJvMfe87u93zrmvIfr//cUOCD/22nj6EpM4QMQBnz/WrwtBN6uqtjb2p2pzfp+tS1vR8mIJvblMsaGhges1qb4yP66tB6qJxNM8F3BGCPHcDi4mM/P9eb8QPWtWyNirC4em522WUJAUjobRbMstK7aoaCXrxSHheyurKuvfphqm/BMD7fUH5NN1+7alupagukDSJh6+/T+Gxrs3HXkUNjYzLop0cHAg831w/Ne6xkydAco3MtO+yYkPPX5f0QX3BxtdCpIKK68ElRsb2vnJyN7IvBQhFah47wI7lJJIo4nzOxSpc4p5lwek6E4kke4NUVnrcOfBiA2Oo1cPvcu2Gdm5vevj6QrFqpdAiIWcFCQmiEQIQLtnhNpuAF1GZ9KcJFTHqzxQKXeOZpOVMhSqRadjYx3Nl13ITIxze0NCvJvB1aE/ZnUXR+QGiZnu0c7kbQNmj3PHLe/udq50+FryDRDa0FLNvQEEx1WOX2JNn0SPdS2zCf8kO5NqIGR/isLhjVLKo0jgqQfOtIe/jiMZ98+5vRoymkjH5fTUt48dze1Q21HlY1Rdh7dhs58y2pipUYr7tF1KUTvSkew3Mc6kADmsFJ3FDhaReGYAL8pnnMFqDcRSPDSALqN7e2XZMxL0YhaUt4CwRsu4FE6XunudSUeuNr0e60xWh5eXr0aVXmUSxwW7t3U2EfdfZ1ID+f5i0xfIw7gcpkSIfxp7KWPgHJknCo6SnjZNinVPYfOcKJYANtXJkistBogdmtKghWK0T8cUrBQTS/rngLV9YMjyVWwIdUwe0ozCIQjYDWChcSzbsmCOTWwT6vmB9griK8hl9pItxOBgN632EzpM/YdCfgOczgLVckVGfAAAAABJRU5ErkJggg==" 
                                    alt="">                                                                                  
                            </b-button> -->
                            <b-button 
                                style="font-size:11px;" 
                                size="lg"       
                                @click="editBooking(data.item);" 
                                class="text-primary bg-info border-info my-1 px-2 ml-2" >
                                <b-icon-pencil-fill scale="1.25"/>                                                       
                            </b-button>
                        </b-row> 
                    </template>                   
                    
                </b-table>

            
            </b-card>
        </div>

        <b-modal size="xl" v-model="showBookingWindow" header-class="bg-primary text-white" >
            <template v-slot:modal-title>
                <h1 class="my-2 ml-2">Update Court Interpreter Request</h1> 
            </template>

            <b-card class="bg-white border-white text-dark"> 
              
                <b-card no-body v-if="bookingDataReady" class="border-white" :key="updatedBookingInfo">

                    <b-row class="mt-1 mb-4 ml-2 h2">
                        {{booking.interpreter.firstName}} {{booking.interpreter.lastName}} (Level {{booking.interpreter.highestLevel}})                        
                    </b-row>

                    

                    <b-row class="mx-3 mt-0 mb-4">
                        <b-button size="sm" class="mr-1 mt-1 " style="height:2rem"  @click="enableEditDates= !enableEditDates;" :variant="enableEditDates?'warning':'primary'"> <span v-if="enableEditDates">Hide </span> <span v-else> Edit </span> Dates </b-button>
                        <b-card v-if="bookingStates.dates==false" class="h4 border-0 text-danger mx-2 my-2 py-1" no-body> Booking Date(s) required! </b-card>
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
                    
                    <div v-if="enableEditDates" class="mb-5" :key="updateEditDates">
                        <b-row class="mx-0" >
                            <b-col cols="6">
                                <booking-date-picker  :bookingDates="booking.dates" :blockedDates="blockDates" @datesAdded="addBookingDates"/>
                            </b-col>
                        </b-row>    
                        <b-row class="ml-2">
                            <date-card 
                                @remove="RemoveBookingDate" 
                                @bookingChanged="ChangeBookingDate" 
                                v-for="bookingDate,inx in booking.dates" :key="inx" 
                                :bookingDate="bookingDate"/>
                        </b-row>
                    </div>


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
                                    :class="bookingStates.federal==false? 'border border-danger pt-1 pb-2':'input-line'"                           
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

           
            <b-alert class="mt-3" variant="danger" :show="errorMsg.length>0" >            
                <b class="mr-2">Error: </b> {{errorMsg}} <b-icon-exclamation-circle-fill/>
            </b-alert>  
                 

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
                <b-col>{{interpreterDetails.phone | beautify-phone-no}}</b-col>
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';
import { max } from 'underscore';

import InterpreterDetails from "./InterpreterDetails.vue";
import DateCard from "./DateCard.vue"
import BookingDatePicker from "./BookingDatePicker.vue"

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

import {statusOptions, requestOptions, bookingPeriodOptions, bookingMethodOfAppearanceOptions, interpreterRequestOptions} from './BookingEnums'

import {bookingInterpreterInfoType, bookingSearchInfoType} from '@/types/Bookings/json';
import { bookingStatesInfoType } from '@/types/Bookings';
import { locationsInfoType } from '@/types/Common/json';

@Component({
    components:{
        InterpreterDetails,
        DateCard,
        BookingDatePicker
    }
})
export default class BookingTable extends Vue {

    @Prop({required: true})
    bookings!: bookingSearchInfoType[];
    
    @Prop({required: true})
    searching!: boolean;

    @commonState.State
    public courtLocations!: locationsInfoType[];
 
    bookingDataReady = false;
    updatedBookingInfo = 0;

    enableEditDates = false;
    updateEditDates=0;

    showBookingWindow = false;
    showInterpreterDetailsWindow = false;

    interpreterDetails = {} as bookingInterpreterInfoType;
    bookingStates = {} as bookingStatesInfoType;  
    booking = {} as bookingSearchInfoType;
    blockDates = []
    errorMsg=''
    
    statusOptions
    requestOptions
    bookingPeriodOptions
    bookingMethodOfAppearanceOptions
    interpreterRequestOptions
    created(){
        this.statusOptions=statusOptions 
        this.requestOptions=requestOptions 
        this.bookingPeriodOptions=bookingPeriodOptions 
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions 
        this.interpreterRequestOptions=interpreterRequestOptions
    }

    bookingFields = [        
        {key:'dates',          label:'Date Range',        sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle,', tdClass:'align-middle', thStyle:' width:18%'},
        {key:'file',           label:'Court File Number', sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle,', tdClass:'align-middle', thStyle:' width:10%'},
        {key:'caseName',       label:'Case Name',         sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:' width:12.5%'},
        {key:'language',       label:'Language',          sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:' width:9%'},
        {key:'interpreter',    label:'Interpreter',       sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:' width:20%'},
        {key:'status',         label:'Status',            sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:' width:6%'},
        {key:'comment',        label:'Comment',           sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:' width:12%'},
        {key:'edit',           label:'',                  sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:' width:5%'}
    ];


    mounted() { 
        this.errorMsg=''
        this.enableEditDates = false;
        this.bookingStates = {} as bookingStatesInfoType;
    }
    
    public displayInterpreterInfo(interpreterInfo: bookingInterpreterInfoType){
        this.interpreterDetails = interpreterInfo;
        this.showInterpreterDetailsWindow = true;
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
    
    public editBooking(bookingToEdit: bookingSearchInfoType){
        this.blockDates = []
        this.errorMsg=''
        this.booking = JSON.parse(JSON.stringify(bookingToEdit));
        const levels = this.booking.interpreter.languages.map(language => {return language.level})
        this.booking.interpreter.highestLevel = max(levels); 
        this.enableEditDates = false;
        this.showBookingWindow = true;
        
        this.$http.get('/booking/interpreter/' + this.booking.interpreter.id)
        .then((response) => {            
            if(response?.data){
                this.blockDates = response.data
                    .filter(bookingdate=> bookingdate.booking_id != this.booking.id)
                    .map(bookingdate=> bookingdate.date.slice(0,10))
            }  
            this.bookingDataReady = true;             
        },(err) => {
            this.bookingDataReady = true;         
        });       
        
    }

    public downloadAdm(bookingInfo: bookingSearchInfoType){
        console.log('downloading');
    }

    public sortByDate(data){
        return _.sortBy(data, 'date')
    }

    public saveBooking(){
        if (this.checkBookingStates()){ 
            
            this.$http.put('/booking/' + this.booking.id, this.booking)
            .then((response) => {            
                if(response?.data){
                    this.closeBookingWindow();
                    this.$emit('find');                
                }                
            },(err) => {
                // console.log(err.response.data.detail)
                this.errorMsg=err.response.data.detail
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
        this.bookingStates.prosecutor = (this.booking.federal && !this.booking.prosecutor)? false : null;
        this.bookingStates.methodOfAppearance = !(this.booking.methodOfAppearance)? false : null;
        this.bookingStates.federal = !(this.booking.federal != null)? false : null;
      
        this.bookingStates.dates = !(this.booking.dates.length>0)? false : null;

        this.updatedBookingInfo ++;

        for(const field of Object.keys(this.bookingStates)){
            if(this.bookingStates[field]==false)
                stateCheck = false;
        }

        return stateCheck;            
    }

    public getBookingPeriod(period){
        return this.bookingPeriodOptions.filter(opt => opt.value == period)[0]?.text
    }

    public addBookingDates(bookingDates){
        this.booking.dates = bookingDates
        this.updateEditDates++;       
        
    }

    public RemoveBookingDate(date){
        this.booking.dates = this.booking.dates.filter(booking => booking.date!=date)
        this.updateEditDates++;
    }

    public ChangeBookingDate(bookingDate){
        const changedBookingDate = this.booking.dates.filter(booking => booking.date==bookingDate.date)[0]
        changedBookingDate.period = bookingDate.period
        changedBookingDate.arrivalTime = bookingDate.arrivalTime
        this.updateEditDates++;
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