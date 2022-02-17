<template>
    <b-card class="bg-white border-white">                
            
        <loading-spinner color="#000" v-if="!dataReady" waitingText="Loading ..." />
        <b-card v-else class="w-100 mx-auto my-1 bg-light border-white"> 
            <b-card body-class="py-2" class="bg-info text-center mt-0 mb-5 mx-auto w-50">
                <b-icon-info-circle font-scale="1.35" class="mr-3"/>
                <b>Add Dates, Court Location and Search for interpreters to book.</b>
            </b-card>               
           
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
                <b-col cols="4">
                    <b-form-group                       
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
                            @change="searchAgain"                                                                                                             
                            v-model="limitDistance">Limit Search to 32KM
                        </b-form-checkbox> 
                    </b-form-group>
                </b-col>
                
            </b-row>

            <b-row>
                <b-col cols="4" style="margin-top:-1rem"> 
                    <div> Dates</div>                 
                    <booking-date-picker :key="update" :bookingDates="bookingDates" @datesAdded="addBookingDates"/>
                </b-col>
                <b-col cols="4">
                </b-col>
                <b-col cols="4">
                    <b-button
                        name="search"
                        style="margin-top: 0rem; padding: 0.25rem 2rem; width: 100%;" 
                        :disabled="searching"
                        v-on:keyup.enter="find()"
                        variant="primary"
                        @click="find()"
                        ><spinner color="#FFF" v-if="searching" style="margin:0; padding: 0; height:2rem; transform:translate(0px,-24px);"/>
                        <span style="font-size: 20px;" v-else>Search</span>
                    </b-button>
                </b-col>                
            </b-row>
            <b-row :key="update">
                <date-card 
                    @remove="RemoveBookingDate" 
                    @bookingChanged="ChangeBookingDate" 
                    v-for="bookingDate,inx in bookingDates" :key="inx" 
                    :bookingDate="bookingDate"/>
            </b-row>
        </b-card>        
   
        <search-interpreters-table 
            v-if="dataLoaded"
            :interpreters="interpreters" 
            :searching="searching" 
            :searchLocation="location"
            :language="language" 
            :bookingDates="bookingDates" />

    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as _ from 'underscore';
import moment from 'moment-timezone'

import Spinner from '@/components/utils/Spinner.vue'
import SearchInterpretersTable from "./components/SearchInterpretersTable.vue";
import DateCard from "./components/DateCard.vue"
import BookingDatePicker from "./components/BookingDatePicker.vue"

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { bookingDateInfoType } from '@/types/Bookings/json';

const commonState = namespace("Common");



@Component({
    components:{
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
    limitDistance = false;
    
    language = '';    
    level: string[] = [];
    locationState = true;    

    interpreters: interpreterInfoType[] = [];

    languageNames: string[] = [];     

    levelOptions = ['1', '2', '3', '4'];

    bookingDates: bookingDateInfoType[]=[];
    update = 0; 

    @Watch('userLocation')
    defaultLocationChanged(){
        this.extractInfo();
    }

    mounted() {  
        this.dataLoaded = false;
        this.dataReady = false;   
        this.locationState = true;
        this.extractInfo();  
        this.focusSearchButton()
    }

    public extractInfo(){

        this.languageNames = this.languages.map( language => {return language.name});
        this.location = this.userLocation?.name?this.userLocation:{} as locationsInfoType;

        this.dataReady = true;
    }

    public find(){
       
        this.locationState = this.location?.id?true:false;

        if (this.locationState){ 
             this.dataLoaded = true
            this.searching = true;
            this.interpreters = [];

            const body = {
                // "courtAddr":this.location?.addressLine1?this.location.addressLine1:'',
                "distanceLimit":this.limitDistance,
                "language":this.language,
                "level":this.level,
                "city":'',
                "dates":this.bookingDates,
                "location":this.location?this.location:null                
            }

            this.$http.post('/interpreter/search', body)
            .then((response) => {            
                if(response?.data?.data){
                    this.extractInterpreterDetails(response.data.data);                    
                }
                
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

        this.interpreters = _.sortBy(interpreterInfo,'lastName');
        
        this.searching = false;
    }

    public searchAgain(){
        this.interpreters =[]
        this.dataLoaded = false
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
        changedBookingDate.period = bookingDate.period
        changedBookingDate.arrivalTime = bookingDate.arrivalTime
        this.update++;
        this.searchAgain()
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
