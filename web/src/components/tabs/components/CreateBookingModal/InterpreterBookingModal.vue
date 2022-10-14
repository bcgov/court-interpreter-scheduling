<template>
<div>
    <loading-spinner color="#000" v-if="!interpreterDataReady" waitingText="Loading ..." />
    <b-card v-else class="border-white text-dark bg-white" body-class="py-0" :key="updatedBookingInfo"> 
        
        <b-row class="my-0 ml-2">
            <b-col cols="9" class="my-2 h2">  
                {{interpreter.firstName}} {{interpreter.lastName}}
            </b-col>                                       
        </b-row>

        <b-tabs v-if="allowBooking" :key="updateTabs" v-model="tabIndex" pills card>
            <b-tab no-body v-for="tab,inx in allBookingDatesTimes" :key="inx" title-link-class="text-center tab-class">
                <template #title>
                    <div><b-icon-calendar scale="0.85" /> {{tab.beautyDate}} </div>
                    <div style="margin-left:-1.2rem;"><b><b-icon-clock /> {{tab.time.start}}</b></div>
                    <div style="margin-left:0.1rem; color:#ABD  ;"><b> {{tab.time.end}}</b></div>
                </template> 
                <interpreter-booking-fields
                    :id="'tab-'+inx"
                    @copy="openCopyWindow"
                    :totalTabs="allBookingDatesTimes.length"
                    :tabName="tab.name"
                    :language="language"
                    :booking="tab.booking"
                    :registry="registry"                     
                    :bookingStates="tab.bookingStates" 
                    :languages="interpreter.languages"/>               
            </b-tab>
        </b-tabs> 

        <b-alert class="mt-3" variant="danger" :show="errorMsg.length>0" >            
            <b class="mr-2">Error: </b> {{errorMsg}} <b-icon-exclamation-circle-fill/>
        </b-alert>

        <b-row class="mt-5 mb-2 pt-1  border-top">
            <b-button class="mr-auto" variant="dark" @click="closeBookingWindow">Cancel</b-button>
            <b-button 
                v-if="allowBooking"                    
                variant="success" 
                @click="saveNewBooking">
                <b-icon-calendar-check-fill class="mr-2"/>Create Booking
            </b-button>                
        </b-row> 

        <b-modal body-class="py-0"  footer-class="d-none"  v-model="showCopyWindow" header-class="bg-warning" title-class="h3" title="Available Tabs to Copy" >
            <div class="text-center">
                <div class="my-3 h5 bg-white text-dark">Which Tab would you like to import into <b class="text-danger"> {{targetTab}} </b> ?</div>
                <b-button 
                    v-for="tab,inx in sourceBookingDatesTimes" :key="inx"
                    @click="copyTab(tab)"
                    variant="primary"
                    class="my-2 mx-5">
                        {{tab.name}}
                </b-button>
            </div>
        </b-modal>           
            
    </b-card> 
</div>  

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment-timezone'

import { bookingDateTimesInfoType, bookingInfoType } from '@/types/Bookings/json';
import { interpreterInfoType } from '@/types/Interpreters/json';


import { bookingStatesInfoType } from '@/types/Bookings';

import InterpreterBookingFields from "./InterpreterBookingFields.vue"
import {statusOptions, requestOptions, bookingMethodOfAppearanceOptions} from '../BookingEnums'
import { locationsInfoType } from '@/types/Common/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
    components:{       
       InterpreterBookingFields
    }
})
export default class InterpreterBookingModal extends Vue {
    
    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[]

    @Prop({required: true})
    interpreter!: interpreterInfoType;

    @Prop({required: true})
    public searchLocation!: locationsInfoType;

    @Prop({required: true})
    language!: string;

    @commonState.State
    public courtLocations!: locationsInfoType[];
     

    updatedBookingInfo = 0;
    interpreterDataReady = false;

    allBookingDatesTimes = []
    tabIndex = 0;
    showCopyWindow = false
    targetTab=''
    sourceBookingDatesTimes = []
    updateTabs=0;
    errorMsg=''    
    allowBooking = false;    
    registry = {id:0, name:''};

    statusOptions
    requestOptions
    bookingMethodOfAppearanceOptions

    created(){
        this.statusOptions=statusOptions 
        this.requestOptions=requestOptions
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions
    }

   
    mounted() {
        this.errorMsg=''
        this.interpreterDataReady = false; 
        //console.log(this.interpreter)
        //console.log(this.bookingDates)
        this.registry = {id:this.searchLocation.id, name:this.searchLocation.name};
        this.extractBookingDates()
        this.extractBlockDates(this.interpreter.id)
    }

    public extractBlockDates(interpreter_id){
        this.allowBooking = false;
        let errDates = ''
        this.$http.get('/booking/interpreter/' + interpreter_id)
        .then((response) => {            
            if(response?.data){
                const blockDates = response.data.map(bookingdate=> bookingdate.date.slice(0,10))
                const bookingDates = this.bookingDates.map(date => date.date.slice(0,10))
                //console.log(blockDates)
                //console.log(bookingDates)
                this.allowBooking = true;
                for(const date of bookingDates){
                    if( blockDates.includes(date)){
                        //console.log(date)
                        this.allowBooking = false;
                        errDates += date+ ', ' 
                    }
                }
                //console.log(errDates)
                if(errDates) this.errorMsg = "This interpreter is currently booked on "+ errDates                
            }
            this.interpreterDataReady = true;           
        },(err) => {
            this.interpreterDataReady = true;                        
        });       
    }

    public extractBookingDates(){
        this.allBookingDatesTimes = []
        for(const bookingDate of this.bookingDates){
            for(const time of bookingDate.bookingTimes){
                
                if(time.start=='') continue;
                
                const beautyDate = moment(bookingDate.date).format('MMM DD, YYYY ')
                this.allBookingDatesTimes.push({
                    date:bookingDate.date,
                    time:time,
                    beautyDate:beautyDate,
                    name:beautyDate+time.start.replace(' ',''),
                    booking:this.prepopulateDefaultValues(bookingDate.date, time),
                    bookingStates:this.prepopulateDefaultStates()
                })
            }
        }
        //console.log(this.allBookingDatesTimes)
    }


    public prepopulateDefaultValues(date, time){
        const booking = {} as bookingInfoType;        
        
        booking.caseType = null;
        booking.courtLevel = null;
        booking.courtClass = null;
        booking.caseName = null;
        booking.comment = null;
        booking.methodOfAppearance = this.bookingMethodOfAppearanceOptions[0].value;
        booking.prosecutor = null;        
        booking.reason = null;
        booking.registry = null;
        booking.requestedBy = this.requestOptions[0].value;
        booking.room = null;
        booking.file = null;
        booking.status = this.statusOptions[0].value;
        booking.federal = null;
        booking.bilingual = null;
        booking.languages = [];
        booking.locationId = null;
        booking.interpreterId = this.interpreter.id;
        booking.date = date;
        booking.startTime = time.start;
        booking.finishTime = time.end;
        booking.actualStartTime = null;
        booking.actualFinishTime = null;
        booking.approversInitials = null;
        return booking
    }

    public prepopulateDefaultStates(){    
        const bookingStates = {} as bookingStatesInfoType;
        bookingStates.status = null;
        bookingStates.room = null; 
        bookingStates.location = null;
        bookingStates.file = null;
        bookingStates.interpretFor = null;
        bookingStates.caseName = null;
        bookingStates.caseType = null;
        bookingStates.courtLevel = null;
        bookingStates.courtClass = null;
        bookingStates.courtClassOther = null;
        bookingStates.request = null;
        bookingStates.language = null;
        bookingStates.reason = null;
        bookingStates.reasonOther = null;
        bookingStates.prosecutor = null;
        bookingStates.methodOfAppearance = null;
        bookingStates.federal = null;
        bookingStates.bilingual = null;
        return bookingStates
    }  


    public saveNewBooking(){
        if (this.checkBookingStates(true)){ 
            //console.log(this.allBookingDatesTimes)

            const location = this.courtLocations.filter(loc => loc.id==this.registry.id)
            if(location.length==1){                
                this.registry.name = location[0].name
            }

            const body = {
                interpreter_id: this.interpreter.id,
                locationName: this.registry.name,
                locationId: this.registry.id,
                dates: this.allBookingDatesTimes.map(bookingDatesTimes=> {

                        return  bookingDatesTimes.booking
                    })
            }
            this.$http.post('/booking', body)
            .then((response) => {            
                if(response?.data){
                    this.closeBookingWindow();
                    this.$router.push({ name: "bookings" });                
                }
                
            },(err) => {
                this.errorMsg=err.response.data.detail          
            });
        }        
    }
    


    public checkBookingStates(showErrorPlace){

        let stateCheck = true;

        for(const eachBookingDateInx in this.allBookingDatesTimes){
            const eachBookingDate = this.allBookingDatesTimes[eachBookingDateInx]
            const booking = eachBookingDate.booking
            const bookingStates = eachBookingDate.bookingStates
    
            bookingStates.status = !(booking.status)? false : null;
            // bookingStates.room = !(booking.room)? false : null;        
        
            //bookingStates.location = !(booking.locationId)? false : null;
            bookingStates.file = !(booking.file)? false : null;           
            bookingStates.caseName = !(booking.caseName)? false : null;
            bookingStates.caseType = !(booking.caseType)? false : null;
            bookingStates.courtLevel = !(booking.courtLevel)? false : null;
            bookingStates.courtClass = !(booking.courtClass)? false : null;
            bookingStates.courtClassOther = !(booking.courtClass)? false : null;
            bookingStates.request = !(booking.requestedBy)? false : null;
            bookingStates.language = !(booking.languages.length>0 )? false : null;
            bookingStates.reason = !(booking.reason)? false : null;
            bookingStates.reasonOther = !(booking.reason)? false : null;
            bookingStates.prosecutor = (booking.federal && !booking.prosecutor)? false : null;
            bookingStates.methodOfAppearance = !(booking.methodOfAppearance)? false : null;
            bookingStates.federal = !(booking.federal != null)? false : null;
            bookingStates.bilingual = !(booking.bilingual != null)? false : null;

            for(const field of Object.keys(bookingStates)){
                if(bookingStates[field]==false){
                    stateCheck = false;
                    if(showErrorPlace){
                        this.tabIndex = Number(eachBookingDateInx)
                        break;
                    }
                }
            }
            if(!stateCheck && showErrorPlace) break;
        }

        return stateCheck;            
    }



    public closeBookingWindow(){
        this.$emit('close')        
    }

    public copyTab(tab){
        //console.log(tab)
        this.showCopyWindow = false
        const source =  this.allBookingDatesTimes.filter(booking =>booking.name==tab.name)
        const target =  this.allBookingDatesTimes.filter(booking =>booking.name==this.targetTab)
        if(source.length==1 && target.length==1){
           
            // target[0].booking = JSON.parse(JSON.stringify(source[0].booking))
            target[0].booking.caseName = JSON.parse(JSON.stringify(source[0].booking.caseName));
            target[0].booking.caseType = JSON.parse(JSON.stringify(source[0].booking.caseType));
            target[0].booking.courtLevel = JSON.parse(JSON.stringify(source[0].booking.courtLevel));
            target[0].booking.courtClass = JSON.parse(JSON.stringify(source[0].booking.courtClass));
            target[0].booking.comment = JSON.parse(JSON.stringify(source[0].booking.comment));
            target[0].booking.methodOfAppearance = JSON.parse(JSON.stringify(source[0].booking.methodOfAppearance));
            target[0].booking.prosecutor = JSON.parse(JSON.stringify(source[0].booking.prosecutor));        
            target[0].booking.reason = JSON.parse(JSON.stringify(source[0].booking.reason));
            target[0].booking.registry = JSON.parse(JSON.stringify(source[0].booking.registry));
            target[0].booking.requestedBy = JSON.parse(JSON.stringify(source[0].booking.requestedBy));
            target[0].booking.room = JSON.parse(JSON.stringify(source[0].booking.room));
            target[0].booking.file = JSON.parse(JSON.stringify(source[0].booking.file));
            target[0].booking.status = JSON.parse(JSON.stringify(source[0].booking.status));
            target[0].booking.federal = JSON.parse(JSON.stringify(source[0].booking.federal));
            target[0].booking.languages = JSON.parse(JSON.stringify(source[0].booking.languages));
            target[0].booking.locationId = JSON.parse(JSON.stringify(source[0].booking.locationId));
            target[0].booking.bilingual = JSON.parse(JSON.stringify(source[0].booking.bilingual));
            
            this.updateTabs++;
        }
        
        this.checkBookingStates(false)

    }
    public openCopyWindow(tabName){
        this.targetTab = tabName;
        this.sourceBookingDatesTimes = JSON.parse(JSON.stringify(this.allBookingDatesTimes.filter(booking =>booking.name!=tabName)))
        this.showCopyWindow = true
        //console.log(this.allBookingDatesTimes)
    }
}

</script>

<style lang="scss">
    .tab-class{
        margin:0.2rem 0.25rem;
        padding: 0.2rem 0.2rem;
        width: 8.5rem;
        font-size: 10.5pt;
        line-height: 1.3rem;
        background: white;
    }
</style>