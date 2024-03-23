<template>
<div>
    <loading-spinner color="#000" v-if="!interpreterDataReady" waitingText="Loading ..." />
    <b-card v-else class="border-white text-dark bg-white" body-class="py-0" :key="updatedBookingInfo"> 
        
        <b-row class="my-0 ml-2">
            <b-col cols="9" class="my-2 h2">  
                {{interpreter.firstName}} {{interpreter.lastName}}
            </b-col>                                       
        </b-row>

        <b-tabs v-if="allowBooking" :key="updateTabs" v-model="tabIndex" pills card class="booking-tab-header">
            <b-tab no-body v-for="tab,inx in allBookingDatesTimes" :key="inx" title-link-class="text-center create-tab-class">
                <template #title>
                    <div><b-icon-calendar scale="0.85" /> {{tab.beautyDate}} </div>
                    <div style="margin-left:-1.2rem;"><b><b-icon-clock /> {{tab.time.start}}</b></div>                    
                    <div style="margin-left:0.1rem; color:#ABD  ;">
                        <b> {{tab.time.end}}</b>                        
                        <span v-if="tab.booking.status==statusOptions[1].value" v-b-tooltip.hover.v-success  title="Booked">
                            <b-icon-calendar-check-fill scale="0.9" class="text-success ml-2"  />
                        </span>
                    </div>
                </template> 
                <interpreter-booking-fields
                    :id="'tab-'+inx"
                    @copy="openCopyWindow"
                    @checkStates="checkBookingStates(false)"
                    @export="exportTabData($event,tab)"
                    :totalTabs="allBookingDatesTimes.length"
                    :tabName="tab.name"
                    :tabNumber="inx+1"
                    :caseTabId="caseTabId"
                    :pickedLanguage="language"
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
                
                    <spinner color="#FFF" v-if="savingData" style="margin:0; padding: 0; height:1.9rem; transform:translate(0px,-25px);"/>
                    <span v-else> 
                        <b-icon-calendar-check-fill class="mr-2"/> 
                        Create Booking 
                    </span>
            </b-button>                
        </b-row> 

        <b-modal body-class="py-0"  footer-class="d-none"  v-model="showCopyWindow" header-class="bg-court pt-4" title-class="h3 text-white mt-n1" title="Available Tabs to Copy" >
            <div class="text-center mb-3">
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
import Spinner from '@/components/utils/Spinner.vue'

import { bookingStatesInfoType} from '@/types/Bookings';
import { courtBookingDateTimesConflict, bookedDateTimesTZ} from '@/components/utils/BookingDateFunctions/BookingDatesFunctions';

import InterpreterBookingFields from "./InterpreterBookingFields.vue"
import {statusOptions, requestOptions, bookingMethodOfAppearanceOptions} from '../BookingEnums'
import { locationsInfoType } from '@/types/Common/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
    components:{  
       Spinner,     
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
    registry = {id:0, name:'', timezone:''};
    savingData = false;
    caseTabId=null

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
        this.savingData = false;
        this.interpreterDataReady = false; 
        //console.log(this.interpreter)
        //console.log(this.bookingDates)
        this.registry = {id:this.searchLocation.id, name:this.searchLocation.name, timezone:this.searchLocation.timezone};
        this.extractBookingDates()
        this.extractBlockDates(this.interpreter.id)
    }

    public extractBlockDates(interpreter_id){
        this.allowBooking = false;
        this.$http.get('/booking/interpreter/' + interpreter_id)
        .then((response) => {            
            if(response?.data){
                const blockDates = bookedDateTimesTZ(response.data, null);
                this.allowBooking = !courtBookingDateTimesConflict(this.bookingDates, blockDates, this.searchLocation.timezone);
                if(!this.allowBooking) this.errorMsg = "This interpreter is currently booked";
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
                
                const beautyDate = moment.tz(bookingDate.date, this.searchLocation.timezone).format('MMM DD, YYYY ')
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
                
        booking.comment = null;
        booking.methodOfAppearance = this.bookingMethodOfAppearanceOptions[0].value;        
        booking.registry = null;       
        booking.status = this.statusOptions[0].value;        
        booking.languages = [];
        booking.locationId = null;
        booking.interpreterId = this.interpreter.id;
        booking.date = date;
        booking.startTime = time.start;
        booking.finishTime = time.end;
        booking.actualStartTime = null;
        booking.actualFinishTime = null;
        booking.approversInitials = null;
        booking.cases = []
        return booking
    }

    public prepopulateDefaultStates(){    
        const bookingStates = {} as bookingStatesInfoType;
        bookingStates.status = null;       
        bookingStates.location = null;        
        bookingStates.methodOfAppearance = null;
        bookingStates.cases = [] 
       
        return bookingStates
    }  


    public saveNewBooking(){
        if (this.checkBookingStates(true)){ 
            //console.log(this.allBookingDatesTimes)
            this.savingData = true;
            const location = this.courtLocations.filter(loc => loc.id==this.registry.id)
            if(location.length==1){                
                this.registry.name = location[0].name
                this.registry.timezone = location[0].timezone
            }

            const body = {
                interpreter_id: this.interpreter.id,
                locationName: this.registry.name,
                locationId: this.registry.id,
                timezone: this.registry.timezone,
                dates: this.allBookingDatesTimes.map(bookingDatesTimes=> {

                        return  bookingDatesTimes.booking
                    })
            }
            this.$http.post('/booking', body)
            .then((response) => {            
                if(response?.data){
                    this.savingData = false;
                    this.closeBookingWindow();                    
                    this.$router.push({ name: "bookings" });                
                }
                
            },(err) => {
                this.savingData = false;
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
            
            bookingStates.methodOfAppearance = !(booking.methodOfAppearance)? false : null;
            bookingStates.status = !(booking.status)? false : null;       
           
                      
            for(const caseState of bookingStates.cases){
                //console.log(caseState)
                const bookingCase = booking.cases.filter(bookingcase => bookingcase.tmpId==caseState.tmpId)[0]
                //console.log(bookingCase)
                if(bookingCase){
                    caseState.file = !(bookingCase.file)? false : null;           
                    caseState.caseName = !(bookingCase.caseName)? false : null;
                    caseState.language = !(bookingCase.language?.level )? false : null;

                    caseState.caseType = !(bookingCase.caseType)? false : null;
                    caseState.courtLevel = !(bookingCase.courtLevel)? false : null;
                    caseState.courtClass = !(bookingCase.courtClass)? false : null;
                    caseState.courtClassOther = bookingCase.courtClass=='OTHER' && !(bookingCase.courtClassOther)? false : null;
                    caseState.request = !(bookingCase.requestedBy)? false : null;
                    
                    caseState.reason = !(bookingCase.reason)? false : null;
                    caseState.reasonOther = bookingCase.reason=='OTHER' && !(bookingCase.reasonOther)? false : null;
                    caseState.methodOfAppearance = !(bookingCase.methodOfAppearance)? false : null;
                    caseState.bilingual = !(bookingCase.bilingual != null)? false : null;
                    caseState.interpretationMode = (bookingCase.bilingual && !bookingCase.interpretationMode)? false : null;
                    
                    caseState.prosecutor = (bookingCase.federal && !bookingCase.prosecutor)? false : null;        
                    caseState.federal = !(bookingCase.federal != null)? false : null;
                }
            }
            
            this.caseTabId=-1 
            for(const field of Object.keys(bookingStates)){
                if(bookingStates[field]==false){
                    stateCheck = false;
                    if(showErrorPlace){
                        this.tabIndex = Number(eachBookingDateInx)
                        break;
                    }
                }
                else if(field=='cases'){
                    for(const caseitems of bookingStates.cases)
                        for(const casefield of Object.keys(caseitems)){
                            if(caseitems[casefield]==false && casefield!='tabNumber' && casefield!='tmpId'){ 
                                // console.log(eachBookingDateInx)
                                // console.log(caseitems.tabNumber)
                                if(showErrorPlace){
                                    this.tabIndex = Number(caseitems.tabNumber)-1
                                    Vue.nextTick(()=> this.caseTabId = Number(caseitems.tmpId) )                       
                                }
                                return false
                            }
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
            
            target[0].booking.status = JSON.parse(JSON.stringify(source[0].booking.status));
            target[0].booking.methodOfAppearance = JSON.parse(JSON.stringify(source[0].booking.methodOfAppearance));
            target[0].booking.comment = JSON.parse(JSON.stringify(source[0].booking.comment));
            target[0].booking.cases = JSON.parse(JSON.stringify(source[0].booking.cases));            
            for(const caseItem of target[0].booking.cases ){
                caseItem.antcpStartTime = target[0].time?.start?? ''
            }
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

    public exportTabData(fields, source){
        console.log(fields)
        console.log(source)
        const sourceCases = []
        for(const bookingCase of source.booking.cases){
            if(fields.includes(bookingCase.tmpId))
                sourceCases.push(bookingCase)
        }

        for(const target of this.allBookingDatesTimes){            
            if(target.name==source.name || target.booking.status == this.statusOptions[2].value ) continue
            
            console.log(target)
            if(fields.includes('status')){
                target.booking.status = JSON.parse(JSON.stringify(source.booking.status));                                
            }
            if(fields.includes('methodOfAppearance')){
                target.booking.methodOfAppearance = JSON.parse(JSON.stringify(source.booking.methodOfAppearance));
            }
            if(fields.includes('comment')){
                target.booking.comment = JSON.parse(JSON.stringify(source.booking.comment));
            }
            if(sourceCases.length>0){
                target.booking.cases = JSON.parse(JSON.stringify(sourceCases));
                for(const caseItem of target.booking.cases ){
                    caseItem.antcpStartTime = target.time?.start?? ''
                }
            }            
        }
        this.updatedBookingInfo++
    }
}

</script>

<style lang="scss" scoped >
    ::v-deep .create-tab-class{
        margin:0.2rem 0.25rem;
        padding: 0.2rem 0.2rem;
        width: 8.5rem;        
        font-size: 10.5pt;
        line-height: 1.3rem;
        background: white;
    }

    ::v-deep .booking-tab-header>.card-header{        
        overflow-y: auto;
        max-height: 11.5rem;        
    }
</style>