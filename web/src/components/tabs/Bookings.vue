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
                        <b-dropdown
                            id="location"
                            ref="locationDropdown"
                            :text="getDropdownText"
                            variant="outline-secondary"
                            class="location-dropdown w-100"
                            menu-class="location-dropdown-menu"
                            @hidden="clearLocationSearch"
                            no-caret>
                            <template #button-content>
                                <div class="d-flex justify-content-between align-items-center w-100">
                                    <span class="flex-grow-1 text-left">{{ getDropdownText }}</span>
                                    <b-icon icon="chevron-down"></b-icon>
                                </div>
                            </template>
                            
                            <div class="px-3 pt-2 pb-1">
                                <b-form-input
                                    v-model.trim="locationSearchTerm"
                                    placeholder="Search locations..."
                                    autocomplete="off"
                                    @click.stop
                                    @keydown.stop
                                />
                            </div>

                            <!-- All Locations option for super-admin -->
                            <b-dropdown-item-button
                                @click.stop.prevent="toggleAllLocations"
                                :active="isAllLocationsSelected">
                                <b-form-checkbox
                                    :checked="isAllLocationsSelected"
                                    @click.native.stop
                                    @change="toggleAllLocations">
                                    --- All Locations ---
                                </b-form-checkbox>
                            </b-dropdown-item-button>
                            
                            <b-dropdown-divider></b-dropdown-divider>
                            
                            <!-- Individual location options -->
                            <b-dropdown-item-button
                                v-for="courtLocation in filteredCourtLocations"
                                :key="courtLocation.id"
                                @click.stop.prevent="toggleLocation(courtLocation.id)"
                                :active="isLocationSelected(courtLocation.id)">
                                <b-form-checkbox
                                    :checked="isLocationSelected(courtLocation.id)"
                                    @click.native.stop
                                    @change="toggleLocation(courtLocation.id)">
                                    {{ courtLocation.name }}
                                </b-form-checkbox>
                            </b-dropdown-item-button>

                            <div
                                v-if="filteredCourtLocations.length === 0"
                                class="px-3 py-2 text-muted small"
                            >
                                No matching locations
                            </div>
                        </b-dropdown>
                        
                        <!-- Display selected locations as tags -->
                        <div v-if="displayedSelectedLocations.length > 0" class="selected-locations-tags mt-2">
                            <b-badge
                                v-for="location in displayedSelectedLocations"
                                :key="location.id"
                                variant="primary"
                                pill
                                class="mr-2 mb-1 location-tag">
                                {{ location.name }}
                                <b-icon
                                    icon="x"
                                    class="ml-1"
                                    style="cursor: pointer;"
                                    @click="removeLocation(location.id)"></b-icon>
                            </b-badge>
                        </div>
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
                        :locationTimezone="getFirstSelectedLocationTimezone"
                        :bookingRange="dates" 
                        @datesAdded="addBookingDates"/>
                </b-col>
                <b-col cols="4">
                </b-col>
                <b-col cols="4">
                    <b-button
                        name="search"
                        type="button"
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
            :searchLocation="getFirstSelectedLocationObject"
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
    
    selectedLocations: number[] = [];  // Array of location IDs
    locationSearchTerm = '';

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
        if (this.userLocation?.id) {
            this.selectedLocations = [this.userLocation.id];
        } else if (this.courtLocations.length > 0) {
            this.selectedLocations = [this.courtLocations[0].id];
        }
        this.find()
    }
   
    mounted() {  
        this.dataReady = false;
        this.dates = {startDate:moment().toISOString(), endDate:moment().toISOString()};
        this.extractInfo();
        this.focusSearchButton()
    }

    get getFirstSelectedLocationObject(): locationsInfoType {
        // Return the first selected location object for backward compatibility
        if (this.selectedLocations.length > 0 && this.selectedLocations[0] !== null) {
            return this.courtLocations.find(loc => loc.id === this.selectedLocations[0]) || ({} as locationsInfoType);
        }
        return {} as locationsInfoType;
    }

    get getFirstSelectedLocationTimezone(): string {
        if (this.selectedLocations.length > 0 && this.selectedLocations[0] !== null) {
            const location = this.courtLocations.find(loc => loc.id === this.selectedLocations[0]);
            return location?.timezone || 'America/Vancouver';
        }
        return 'America/Vancouver';
    }

    public extractInfo(){      
        this.loadCourtLocations();        
    }


    public find(){
        this.dataLoaded = true;
        this.searching = true;
        this.bookings = [];
        
        // Get timezone from first selected location, or default
        const timezone = this.getFirstSelectedLocationTimezone 
        const startDate = moment(this.dates.startDate).tz(timezone).startOf('day')
        const endDate = moment(this.dates.endDate).tz(timezone).endOf('day')

        // Filter out null values (which represent "All Locations")
        const locationIds = this.selectedLocations.filter(id => id !== null);
        
        const body = {
            "file": this.courtFileNumber ? this.courtFileNumber : '',
            "interpreter": this.interpreterName ? this.interpreterName : '',  
            "dates": [{startDate: startDate, endDate: endDate}],
            "locationIds": locationIds.length > 0 ? locationIds : null  // Send null if "All Locations" or none selected              
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
            
            // Initialize selectedLocations with user's location or first location
            if (this.userLocation?.id) {
                this.selectedLocations = [this.userLocation.id];
            } else if (this.courtLocations.length > 0) {
                this.selectedLocations = [this.courtLocations[0].id];
            }
            
            this.dataReady = true;
            this.find()
        },(err) => {
            this.dataReady = true;            
        });
    }

    get sortedCourtLocations(){
        return _.sortBy(this.courtLocations,'name')
    }

    get filteredCourtLocations(){
        const term = this.locationSearchTerm.trim().toLowerCase();
        if (!term) {
            return this.sortedCourtLocations;
        }
        return this.sortedCourtLocations.filter((location) => {
            const haystack = `${location.name || ''} ${location.locationCode || ''} ${location.shortDescription || ''}`.toLowerCase();
            return haystack.includes(term);
        });
    }

    // Computed property for dropdown text
    get getDropdownText(): string {
        if (this.isAllLocationsSelected) {
            return '--- All Locations ---';
        }
        const count = this.selectedLocations.filter(id => id !== null).length;
        if (count === 0) {
            return 'Select locations...';
        } else if (count === 1) {
            const location = this.courtLocations.find(loc => loc.id === this.selectedLocations[0]);
            return location ? location.name : 'Select locations...';
        } else {
            return `${count} locations selected`;
        }
    }

    // Check if "All Locations" is selected
    get isAllLocationsSelected(): boolean {
        return this.selectedLocations.includes(null);
    }

    // Get location objects for displaying as tags
    get displayedSelectedLocations(): locationsInfoType[] {
        if (this.isAllLocationsSelected) {
            return [{
                id: null,
                name: '--- All Locations ---',
                addressLine1: null,
                addressLine2: null,
                city: null,
                createdAt: '',
                latitude: null,
                locationCode: '',
                longitude: null,
                timezone: 'America/Vancouver',
                postalCode: null,
                shortDescription: '',
                updatedAt: ''
            }];
        }
        return this.selectedLocations
            .filter(id => id !== null)
            .map(id => this.courtLocations.find(loc => loc.id === id))
            .filter(loc => loc !== undefined) as locationsInfoType[];
    }

    // Check if a specific location is selected
    public isLocationSelected(locationId: number): boolean {
        return this.selectedLocations.includes(locationId);
    }

    // Toggle a single location
    public toggleLocation(locationId: number): void {
        const index = this.selectedLocations.indexOf(locationId);
        if (index > -1) {
            // Remove this location
            this.selectedLocations.splice(index, 1);
        } else {
            // Remove "All Locations" if it was selected
            const nullIndex = this.selectedLocations.indexOf(null);
            if (nullIndex > -1) {
                this.selectedLocations.splice(nullIndex, 1);
            }
            // Add this location
            this.selectedLocations.push(locationId);
        }
        this.searchAgain(true);
    }

    // Toggle "All Locations"
    public toggleAllLocations(): void {
        if (this.isAllLocationsSelected) {
            // If "All Locations" is currently selected, deselect it
            const nullIndex = this.selectedLocations.indexOf(null);
            if (nullIndex > -1) {
                this.selectedLocations.splice(nullIndex, 1);
            }
            // Default to user location or first location
            if (this.userLocation?.id) {
                this.selectedLocations = [this.userLocation.id];
            } else if (this.courtLocations.length > 0) {
                this.selectedLocations = [this.courtLocations[0].id];
            }
        } else {
            // Select "All Locations" and clear all other selections
            this.selectedLocations = [null];
        }
        this.searchAgain(true);
    }

    // Remove a location from the selection
    public removeLocation(locationId: number | null): void {
        const index = this.selectedLocations.indexOf(locationId);
        if (index > -1) {
            this.selectedLocations.splice(index, 1);
        }
        
        // If no locations are selected, default to user location or first location
        if (this.selectedLocations.length === 0) {
            if (this.userLocation?.id) {
                this.selectedLocations = [this.userLocation.id];
            } else if (this.courtLocations.length > 0) {
                this.selectedLocations = [this.courtLocations[0].id];
            }
        }
        this.searchAgain(true);
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

    public clearLocationSearch(): void {
        this.locationSearchTerm = '';
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

    // Multi-select dropdown styles
    .location-dropdown {
        ::v-deep .btn {
            width: 100%;
            text-align: left;
            background-color: white;
            border: 1px solid #ced4da;
            color: #495057;
            padding: 0.375rem 0.75rem;
            font-size: 16px;
            font-weight: 300;

            &:hover, &:focus, &:active {
                background-color: #f8f9fa;
                border-color: #80bdff;
                color: #495057;
            }
        }
    }

    ::v-deep .location-dropdown-menu {
        max-height: 400px;
        overflow-y: auto;
        width: 100%;

        .dropdown-item {
            padding: 0.5rem 1rem;

            &:hover {
                background-color: #f8f9fa;
            }

            &.active {
                background-color: transparent;
                color: inherit;
            }

            .custom-control-label {
                cursor: pointer;
                user-select: none;
            }
        }
    }

    // Selected locations as tags
    .selected-locations-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .location-tag {
            font-size: 14px;
            font-weight: 500;
            padding: 0.5rem 0.75rem;
            display: inline-flex;
            align-items: center;
            background-color: #003366;
            color: white;

            .b-icon {
                font-size: 16px;
                cursor: pointer;
                margin-left: 0.5rem;

                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }

</style>
