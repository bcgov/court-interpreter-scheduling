<template>
    <b-card class="bg-white border-white">                
            
        <loading-spinner color="#000" v-if="!dataReady" waitingText="Loading ..." />
        <b-card v-else class="w-100 mx-auto my-1 bg-light border-white"> 

            <b-row>
                <b-col cols="4">
                    <b-form-group                        
                        label="Language" 
                        label-for="language">
                        <b-form-input 
                            list="language-list"
                            style="display:inline"
                            placeholder="Select Language"
                            v-model="language"
                            @change="searchAgain"
                            id="language">
                        </b-form-input>
                        <b-form-datalist 
                            id="language-list" 
                            @change="searchAgain"
                            >
                                <option v-for="langName,inx in languageNames" :key="'lang'+inx" :value="langName" />
                        </b-form-datalist>                        
                    </b-form-group>
                </b-col>
                <b-col cols="4">
                    <div class="mx-auto" style="width:15rem;">
                        <b-form-group
                            class="ml-3 mr-n2"                       
                            label="Level" 
                            label-for="level">
                            <b-form-checkbox-group
                                id="level"
                                @change="searchAgain"
                                class="mt-3"                            
                                style="max-width:100%;"
                                size="lg"                   
                                v-model="level"
                                :options="levelOptions"                
                            ></b-form-checkbox-group>
                        
                        </b-form-group>
                    </div>

                </b-col>
                <b-col cols="4">
                    <b-form-group                        
                        label="Court Location" 
                        label-for="location">
                        <b-form-select 
                            id="location"                            
                            style="display:inline"
                            @change="searchAgain"
                            :state="locationState?null:false"
                            v-model="location"> 
                            <b-form-select-option
                                v-for="courtLocation in courtLocations" 
                                :key="courtLocation.id"
                                :value="courtLocation">
                                    {{courtLocation.name}}
                            </b-form-select-option>
                        </b-form-select> 
                    </b-form-group>
                    <b-form-group>                           
                        <b-form-checkbox 
                            class="mt-0 labels"
                            :disabled="!(location && location.id)"
                            @change="searchAgain"                                                                                                             
                            v-model="limitDistance">Limit Search to 32 km
                        </b-form-checkbox> 
                    </b-form-group>
                </b-col>                
            </b-row>

            <b-row>
                <b-col cols="4" style="margin-top:-1rem"> 
                    <div> Dates</div>                 
                    <booking-date-picker 
                        :key="update" 
                        :bookingDates="bookingDates" 
                        @datesAdded="addBookingDates" 
                        @change="datePickerWindowChanged" 
                        :locationTimezone="locationTimezone"/>
                </b-col>
                <b-col cols="4">
                    <b-card style="width: 13rem; margin:0.5rem auto 0 auto;" body-class="py-2">
                        <b-row>
                            <div class="h4 mx-2 mt-2 mb-0">
                                View Type
                            </div>
                            <b-button size="sm" v-b-tooltip.hover.noninteractive.v-court title="List View" class="mx-1 border" :variant="calendarView?'white':'primary'" @click="calendarView=false; find(1)">
                                <b-icon-list-ul font-scale="1.5" />
                            </b-button>
                            <b-button size="sm" v-b-tooltip.hover.noninteractive.v-court title="Calendar View" class="mx-1 border" :variant="calendarView?'primary':'white'" @click="calendarView=true; find(1)">
                                <b-icon-calendar font-scale="1.5" />
                            </b-button>
                        </b-row>
                    </b-card> 
                </b-col>
                <b-col cols="4">
                    <b-button
                        name="search"
                        style="margin-top: 0.75rem; padding: 0.25rem 2rem; width: 100%;" 
                        :disabled="searching||disableSearch"
                        v-on:keyup.enter="find()"
                        variant="primary"
                        @click="find(1)"
                        ><spinner color="#FFF" v-if="searching" style="margin:0; padding: 0; height:2rem; transform:translate(0px,-24px);"/>
                        <span style="font-size: 20px;" v-else>Search</span>
                    </b-button>
                </b-col>                
            </b-row>
            <div>
                
            <b-row class="date-card-container" :key="update">
                <date-card 
                    class="date-card"
                    @remove="RemoveBookingDate" 
                    @bookingChanged="ChangeBookingDate" 
                    v-for="bookingDate,inx in bookingDates" :key="inx"
                    :locationTimezone="locationTimezone"
                    :bookingDate="bookingDate"/>
            </b-row> 
                
            </div>         
        </b-card>

        <search-interpreters-table 
            v-if="dataLoaded && !calendarView"
            :interpreters="interpreters" 
            :searching="searching" 
            :searchLocation="location"
            :language="language" 
            :bookingDates="bookingDates"
            :totalRecords="totalRecords"
            :initCurrentPage="initPage"
            :initItemsPerPage="tableLimit"
            @paginationChanged="find" />

        <search-interpreters-calendar-table
            v-if="dataLoaded && calendarView" 
            :interpreters="interpreters" 
            :searching="searching" 
            :searchLocation="location"
            :language="language" 
            :bookingDates="bookingDates"
            :totalRecords="totalRecords"
            :initCurrentPage="initPage"
            :initItemsPerPage="calendarLimit"
            @paginationChanged="find" />

        

    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as _ from 'underscore';
import moment from 'moment-timezone'

import Spinner from '@/components/utils/Spinner.vue'
import SearchInterpretersTable from "./components/SearchInterpretersTable.vue";
import DateCard from "./components/DateComponents/DateCard.vue"
import BookingDatePicker from "./components/DateComponents/BookingDatePicker.vue"

import SearchInterpretersCalendarTable from "./components/SearchInterpretersCalendarTable.vue"

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { bookingDateTimesInfoType } from '@/types/Bookings/json';

const commonState = namespace("Common");

@Component({
    components:{
        SearchInterpretersCalendarTable,
        SearchInterpretersTable,
        Spinner,
        DateCard,
        BookingDatePicker

    }
})
export default class SearchInterpretersPage extends Vue {

    @commonState.State
    public courtLocations!: locationsInfoType[];

    @commonState.State
    public languages!: languagesInfoType[];   
    
    @commonState.State
    public userLocation!: locationsInfoType;
    
    dataReady = false; 
    searching = false;
    dataLoaded = false
    
    location = {} as locationsInfoType;
    limitDistance = true;
    locationTimezone = 'America/Vancouver'
    
    language = '';    
    level: string[] = [];
    locationState = true;    

    interpreters: interpreterInfoType[] = [];

    languageNames: string[] = [];     

    levelOptions = ['1', '2', '3', '4'];

    bookingDates: bookingDateTimesInfoType[]=[];
    update = 0; 

    disableSearch = false;

    calendarView = false;
    
    totalRecords = 0;
    tableLimit = 10;
    calendarLimit = 3;
    initPage = 1;

    @Watch('userLocation')
    defaultLocationChanged(){
        this.extractInfo();
    }

    mounted() { 
        this.disableSearch = false;
        this.dataLoaded = false;
        this.dataReady = false;   
        this.locationState = true;
        this.extractInfo();  
        this.focusSearchButton()
    }

    public extractInfo(){
        this.languageNames = this.languages.map( language => {return language.name});
        this.location = this.userLocation?.name?this.userLocation:{} as locationsInfoType;
        if(this.location.timezone) this.locationTimezone = this.location.timezone;
        this.dataReady = true;
    }


    public find(page?: number, limit?: number){
        if (limit) {
            if (this.calendarView) this.calendarLimit = limit;
            else this.tableLimit = limit;
        }

        const queryLimit = limit ?? (this.calendarView ? this.calendarLimit : this.tableLimit);
        const queryPage = page ?? 1;

        this.initPage = queryPage;
       
        this.locationState = this.location?.id?true:false;

        if (this.locationState){ 
            this.dataLoaded = true
            this.searching = true;
            this.interpreters = [];
            
            const language = this.languages.filter(lang => lang.name==this.language);

            const body = {
                "distanceLimit":this.limitDistance,
                "languageId":language.length==1? language[0].id :null,
                "level":this.level,
                "active":true,
                "city":'',
                "dates":this.bookingDates,
                "location":this.location?this.location:null,
                "limit": queryLimit,
                "page": queryPage                
            }

            this.$http.post('/interpreter/search', body)
            .then((response) => {         
                if (response.data?.total) this.totalRecords = response.data.total;

                if(response?.data?.items){
                    this.extractInterpreterDetails(response.data.items);                    
                }
                this.searching = false;
                
            },(err) => {
                this.searching = false;           
            });
            
        }
    }

    public extractInterpreterDetails(interpreterData){

        const interpreterInfo: interpreterInfoType[] = [];        
        const currentTime = moment()

        for (const interpreter of interpreterData){            
            const address = interpreter.address?interpreter.address+'<br>':'';
            const city = interpreter.city?interpreter.city:'';
            const province = interpreter.province?interpreter.province:'';
            const postalCode = interpreter.postal?interpreter.postal:'';
            interpreter.new = moment(interpreter.created_at).diff(currentTime, 'days') < -30; //new for less than 30 days
            interpreter.fullAddress = address + ' ' + city + ' ' + province;
            interpreterInfo.push(interpreter);
        }

        this.interpreters = _.sortBy(interpreterInfo,'lastName')       
        
    }



    public searchAgain(){
        this.interpreters =[]
        this.dataLoaded = false
        if(this.location.timezone) this.locationTimezone = this.location.timezone;
        this.focusSearchButton()        
    }

    public focusSearchButton(){
        Vue.nextTick(()=>{
            const el = document.getElementsByName("search")[0];
            if(el) el.focus();
        })        
    }

    public addBookingDates(bookingDates){
        this.bookingDates = bookingDates
        //console.log(this.bookingDates)
        this.update++;        
        this.searchAgain()
    }

    public RemoveBookingDate(date){
        this.bookingDates = this.bookingDates.filter(booking => booking.date!=date)
        this.update++;
        this.searchAgain()
    }

    public ChangeBookingDate(bookingDate){
        const changedBookingDate = this.bookingDates.filter(booking => booking.date==bookingDate.date)[0]
        changedBookingDate.bookingTimes = bookingDate.bookingTimes
     
        this.update++;
        this.searchAgain()
        // console.log(this.bookingDates)
    }

    public datePickerWindowChanged(open){
        this.disableSearch = open
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

    .date-card-container{
        margin: 1rem 0 0 0;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;        
        overflow-y: hidden;        

        .date-card {
            flex: 0 0 auto;
        }  
    }



</style>
