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
        
        <booking-table :bookings="bookings" @find="find" :searching="searching" />
    
    </b-card>
</template>

<script lang="ts">


import { Component, Vue} from 'vue-property-decorator';
import * as _ from 'underscore';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

import InterpreterDetails from "./components/InterpreterDetails.vue";
import AddCourtSessionForm from "./components/AddCourtSessionForm.vue";
import BookingTable from './components/BookingTable.vue'

import { languagesInfoType, locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { bookingSearchInfoType, dateRangeInfoType } from '@/types/Bookings/json';
import Spinner from '@/components/utils/Spinner.vue'


@Component({
    components:{
        InterpreterDetails,
        AddCourtSessionForm,
        BookingTable,
        Spinner
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
    
    dataLoaded = false; 
    searching = false;
    
    location = {} as locationsInfoType;
    
    dates: dateRangeInfoType[] = [];
    
    courtFileNumber = '';    
    interpreterName = '';
   
    interpreter = {} as interpreterInfoType;
    bookings: bookingSearchInfoType[] = [];  
    
   
    mounted() {  
        this.dataLoaded = false;
        this.extractInfo(); 
    }

    public extractInfo(){      
        this.loadCourtLocations();        
    }

    public find(){
        
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

</style>
