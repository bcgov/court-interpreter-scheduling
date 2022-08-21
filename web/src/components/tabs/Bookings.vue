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
                            @change="searchAgain"                           
                            style="display:inline"                            
                            v-model="location">
                            <!-- <b-form-select-option :value="alllocations">
                                --- All Locations ---
                            </b-form-select-option>  -->
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
                            @change="searchAgain"                                         
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
                            @change="searchAgain"                                         
                            v-model="courtFileNumber">
                        </b-form-input>
                    </b-form-group>                    
                   
                </b-col>
                
            </b-row>

            <b-row>
                <b-col cols="4 mt-2">
                    <booking-date-range-picker :key="update" :bookingRange="dates" @datesAdded="addBookingDates"/>
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

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

import BookingTable from './components/BookingTable.vue'

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { bookingSearchResultInfoType, dateRangeInfoType } from '@/types/Bookings/json';
import Spinner from '@/components/utils/Spinner.vue'

import BookingDateRangePicker from './components/DateComponents/BookingDateRangePicker.vue'
import { rateJsonInfoType } from '@/types/Common';

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

    @commonState.State
    public userLocation!: locationsInfoType;

    @commonState.Action
    public UpdateCourtLocations!: (newCourtLocations: locationsInfoType[]) => void

    @commonState.Action
    public UpdateLanguages!: (newLanguages: languagesInfoType[]) => void    

    update = 0;
    
    dataLoaded = false; 
    searching = false;
    dataReady = false;
    
    location = {} as locationsInfoType;

    alllocations: locationsInfoType= {
        id:null, 
        addressLine1: null,
        addressLine2:null,
        city:null,
        createdAt:"",
        latitude: null,
        locationCode: "",
        longitude: null,
        name: '',
        postalCode: null,
        shortDescription: '',
        updatedAt: ''}
    
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

        const body = {
            "file":this.courtFileNumber?this.courtFileNumber:'',
            "interpreter":this.interpreterName?this.interpreterName:'',  
            "dates": [this.dates],                           
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
        this.searchAgain()
    }

    public searchAgain(){
        this.bookings = [];
        this.dataLoaded = false;
        this.focusSearchButton()
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
