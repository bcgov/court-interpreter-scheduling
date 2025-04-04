<template>
    <b-card class="bg-white border-white">                
            
        <loading-spinner color="#000" v-if="!dataReady" waitingText="Loading ..." />
        <b-card v-else class="w-100 mx-auto my-1 bg-light border-white">                
           
            <b-row>
                <b-col cols="4">
                    <b-form-group 
                        class="labels"              
                        label="Court Location" 
                        label-for="location">
                        <b-form-select 
                            id="location" 
                            @change="searchAgain(true)"                           
                            style="display:inline"                            
                            v-model="location">
                            <b-form-select-option v-if="userRole.includes('super-admin')" :value="alllocations">
                                --- All Locations ---
                            </b-form-select-option> 
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
                            @input="searchAgain(null)"
                            @change="searchAgain(true)"                                         
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
                            @input="searchAgain(null)"
                            @change="searchAgain(true)"                                         
                            v-model="courtFileNumber">
                        </b-form-input>
                    </b-form-group>                    
                   
                </b-col>
                
            </b-row>

            <b-row>
                <b-col cols="4 mt-2">
                    <booking-date-range-picker 
                        :key="update"
                        :locationTimezone="location.timezone"
                        :bookingRange="dates" 
                        @datesAdded="addBookingDates"/>
                </b-col>
                <b-col cols="4">
                </b-col>
                <b-col cols="4">
                    <b-button
                        name="search"
                        @keyup.enter="find()"
                        style="margin-top: 0.6rem; padding: 0.25rem 2rem; width: 100%;" 
                        :disabled="searching"
                        variant="primary"
                        @click="find()"
                        ><spinner color="#FFF" v-if="searching" style="margin:0; padding: 0; height:2rem; transform:translate(0px,-25px);"/>
                        <span style="font-size: 20px;" v-else>Search</span>
                    </b-button>
                </b-col>                
            </b-row>
            
        </b-card>
        
        <booking-table 
            v-if="dataLoaded" 
            :bookings="bookings" 
            :searchLocation="location"
            @find="find" 
            :searching="searching" />
    
    </b-card>
</template>

<script lang="ts">


import { Component, Vue, Watch} from 'vue-property-decorator';
import * as _ from 'underscore';
import moment from 'moment-timezone'

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

import BookingTable from './components/BookingTable.vue'

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { bookingSearchResultInfoType, dateRangeInfoType } from '@/types/Bookings/json';
import Spinner from '@/components/utils/Spinner.vue'

import BookingDateRangePicker from './components/DateComponents/BookingDateRangePicker.vue'
import { holidaysInfoType, rateJsonInfoType } from '@/types/Common';

@Component({
    components:{
        BookingTable,
        Spinner,
        BookingDateRangePicker
    }
})
export default class BookingsPage extends Vue {

    @commonState.State
    public courtLocations!: locationsInfoType[];

    @commonState.State
    public languages!: languagesInfoType[]; 
    
    @commonState.Action
    public UpdateRates!: (newRates: rateJsonInfoType[]) => void

    @commonState.Action
    public UpdateHolidays!: (newHolidays: holidaysInfoType[]) => void

    @commonState.State
    public userLocation!: locationsInfoType;

    @commonState.Action
    public UpdateCourtLocations!: (newCourtLocations: locationsInfoType[]) => void

    @commonState.Action
    public UpdateLanguages!: (newLanguages: languagesInfoType[]) => void  
    
    @commonState.State
    public userRole!: string[];

    update = 0;
    
    dataLoaded = false; 
    searching = false;
    dataReady = false;
    
    location = {} as locationsInfoType;

    alllocations: locationsInfoType = {
        id:null, 
        addressLine1: null,
        addressLine2:null,
        city:null,
        createdAt:"",
        latitude: null,
        locationCode: "",
        longitude: null,
        timezone:'America/Vancouver',
        name: '',
        postalCode: null,
        shortDescription: '',
        updatedAt: ''
    }
    
    dates: dateRangeInfoType = {startDate:null, endDate:null};
    
    courtFileNumber = '';    
    interpreterName = '';
   
    interpreter = {} as interpreterInfoType;
    bookings: bookingSearchResultInfoType[] = [];  

    
    @Watch('userLocation')
    defaultLocationChanged(){
        this.location = this.userLocation?.name?this.userLocation:{} as locationsInfoType;
        this.find()
    }
   
    mounted() {  
        this.dataReady = false;
        this.dates = {startDate:moment().toISOString(), endDate:moment().toISOString()};
        this.extractInfo();
        this.focusSearchButton()
    }

    public extractInfo(){      
        this.loadCourtLocations();        
    }


    public find(){
        this.dataLoaded = true;
        this.searching = true;
        this.bookings = [];
        const timezone = this.location?.timezone?? 'America/Vancouver' 
        const startDate = moment(this.dates.startDate).tz(timezone).startOf('day')
        const endDate = moment(this.dates.endDate).tz(timezone).endOf('day')

        const body = {
            "file":this.courtFileNumber?this.courtFileNumber:'',
            "interpreter":this.interpreterName?this.interpreterName:'',  
            "dates": [{startDate: startDate, endDate: endDate}],                           
            "locationId":this.location.id?this.location.id:null                
        }

        this.$http.post('/booking/search', body)
        .then((response) => {            
            if(response?.data){                     
                this.bookings = response.data;                            
            }
            this.searching = false;
            
        },(err) => {
            this.searching = false;
        });        
        
    }  

    public loadCourtLocations(){
        this.$http.get('/location')
        .then((response) => {            
            if(response?.data){ 
                const locations = _.sortBy(response.data,'name')                                
                this.UpdateCourtLocations(locations);
                this.loadRates();
            }
            
        },(err) => {
            console.log(err)            
        });
    }

    public loadRates(){
        this.$http.get('/rate')
        .then((response) => {            
            if(response?.data){ 
                const rates = response.data                              
                this.UpdateRates(rates);
                this.loadHolidays();
            }
            
        },(err) => {
            console.log(err)            
        });
    }

    public loadHolidays(){
        const startYear = moment().add(-1, 'years').format('YYYY')
        const endYear = moment().add(1, 'years').format('YYYY')
        this.$http.get('/holidays/stats/'+startYear+'/'+endYear)
        .then((response) => {            
            if(response?.data){ 
                const holidays = response.data                              
                this.UpdateHolidays(holidays);
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
            this.location = this.userLocation?.name? this.userLocation : this.courtLocations[0]//({} as locationsInfoType);
            this.dataReady = true;
            this.find()
        },(err) => {
            this.dataReady = true;            
        });
    }

    get sortedCourtLocations(){
        return _.sortBy(this.courtLocations,'name')
    }

    public addBookingDates(dateRange){
        this.dates = dateRange
        this.update++;          
        this.searchAgain(true)
        
    }

    public searchAgain(applyFind){
        this.bookings = [];
        this.dataLoaded = false;
        if(applyFind==true || applyFind==false)
            this.focusSearchButton()
        if(applyFind==true)
            Vue.nextTick(() => this.find());
    }

    public focusSearchButton(){
        Vue.nextTick(()=>{
            const el = document.getElementsByName("search")[0];
            if(el) el.focus();
        })        
    }

}
</script>

<style scoped lang="scss">

    .labels {
        font-size: 16px; font-weight:600;
    }

    .input-line {
        font-size: 16px; font-weight:300;
    }

</style>
