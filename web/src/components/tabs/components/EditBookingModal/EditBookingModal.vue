<template>
    <b-card v-if="interpreterDataReady" class="border-white text-dark bg-white" body-class="py-0" :key="updatedBookingInfo"> 

        <b-row class="my-n2 ml-2">
            <b-col cols="9" class="mb-3 h2">  
                {{interpreter.firstName}} {{interpreter.lastName}}
            </b-col>                                       
        </b-row>
       
        <b-tabs  v-model="tabIndex" pills card class="booking-tab-header">
            <b-tab title="Edit Dates" :title-link-class="'text-center tab-class edit-button'" >
                <b-row class="mx-0 mt-2 mb-4">                    
                    <b-col cols="6">
                        <booking-date-picker 
                            v-if="editDateReady"                            
                            :editDateMode="true"  
                            :bookingDates="bookingCardsDates" 
                            :blockedDates="blockDates" 
                            @datesAdded="addBookingDates"/>
                        <loading-spinner color="#000" v-else waitingText="Loading ..." />
                    </b-col>
                </b-row>    
                <b-row class="date-card-container" :key="updateCards"> 
<!-- <CHECK_POINT> -->
<!-- <div v-for="bookingCardDate,inx in bookingCardsDates" :key="inx">
    {{bookingCardDate.date.slice(0,10)}}<br>
    {{bookingCardDate.date}}
    <div  v-for="i,j in bookingCardDate.bookingTimes" :key="j" >
        {{i}}
    </div>              
</div> -->
                    <date-card 
                        @remove="RemoveBookingDate" 
                        @bookingChanged="ChangeBookingDate" 
                        v-for="bookingCardDate,inx in bookingCardsDates" :key="'edit-card-'+inx"
                        :allowDelete="false" 
                        :bookingDate="bookingCardDate"/>
                </b-row>
            </b-tab>
            
            <b-tab no-body v-for="tab,inx in allBookingDatesTimes" :key="'dates-'+updateTabs+'-'+ inx" title-link-class="text-center tab-class">
                <template #title>
                    <div><b-icon-calendar scale="0.85" /> {{tab.beautyDate}} </div>
                    <div style="margin-left:-1.2rem;"><b><b-icon-clock /> {{tab.time.start}}</b></div>
                    <div style="margin-left:0.1rem; color:#ABD  ;">
                        <b> {{tab.time.end}}</b>
                        <span v-if="tab.booking.status==statusOptions[2].value" v-b-tooltip.hover.v-danger title="Cancelled">
                            <b-icon-calendar-x-fill  class="text-danger ml-2"  />
                        </span>
                        <span v-if="tab.booking.status==statusOptions[1].value" v-b-tooltip.hover.v-success  title="Booked">
                            <b-icon-calendar-check-fill scale="0.9" class="text-success ml-2"  />
                        </span>
                        <span v-if="tab.booking.locationId && tab.booking.locationId != registryLocationId" v-b-tooltip.hover title="Remote Location">
                            <b-icon-exclamation-triangle-fill  variant="warning" class="ml-2" />
                        </span>
                    </div>
                </template>

                <edit-booking-fields
                    @cancel="cancelStatus"
                    @timeChanged="bookingTimeChanged"
                    @copy="openCopyWindow"
                    @checkStates="checkBookingStates(false)"
                    @export="exportTabData($event,tab)"
                    :id="'tab-'+inx"
                    :tabIndex="tabIndex"
                    :tabName="tab.name"                  
                    :tabNumber="inx+1"
                    :totalTabs="allBookingDatesTimes.length"
                    :registry="registry"
                    :booking="tab.booking" 
                    :original="tab.original"
                    :bookingStates="tab.bookingStates"
                    :allBookings="allBookingDatesTimes"
                    :caseTabId="caseTabId" 
                    :languages="interpreter.languages"/>         
            </b-tab>
        </b-tabs> 

        <b-alert class="mt-3" variant="danger" :show="errorMsg.length>0" >            
            <b class="mr-2">Error: </b> {{errorMsg}} <b-icon-exclamation-circle-fill/>
        </b-alert>  

        <b-row class="mt-5 mb-2 pt-1  border-top">
            <b-button class="mr-auto" variant="dark" @click="closeBookingWindow">Cancel Changes</b-button>
            <b-button                     
                variant="success"                 
                @click="saveBooking">
                <b-icon-check-square class="mr-2"/>Save Changes
            </b-button>                
        </b-row>

        <b-modal size="lg" body-class="py-0"  v-model="showCancelReasonWindow" no-close-on-backdrop header-class="bg-warning">
            <template v-slot:modal-title>
                <h2 class="my-2">Reason For Cancellation</h2>
            </template>
            <b-row class="my-4">
                <b-col cols="1" />
                <b-col cols="6" >
                    <b-form-group                        
                        label="Cancelled by:" 
                        class="labels">
                        <b-form-radio-group  
                            style="font-weight:300;"                 
                            :class="cancelledByStates==false?'border rounded border-danger pb-3 pt-1 px-2':'' "                                                                                             
                            @change="cancellationReason='';cancelledByStates=null;"
                            v-model="cancelledBy"> 
                            <b-form-radio value="Interpreter">Interpreter</b-form-radio> 
                            <b-form-radio value="Court">Court</b-form-radio> 
                            <b-form-radio value="Registry Clerk">Registry Clerk</b-form-radio>                                
                        </b-form-radio-group> 
                    </b-form-group>
                </b-col>
                
                <b-col cols="4" v-if="cancelledBy=='Interpreter'">
                    <b-form-group                                                
                        label="Reason:" 
                        class="labels">
                        <b-form-select                                
                            :options="interpreterCancellationOptions"
                            :state="cancellationReasonStates"
                            v-model="cancellationReason">                                    
                        </b-form-select> 
                    </b-form-group>
                </b-col>
                <b-col cols="4" v-if="cancelledBy=='Court'">
                    <b-form-group                         
                        label="Reason" 
                        class="labels">
                        <b-form-select                                
                            :options="courtCancellationOptions"
                            :state="cancellationReasonStates"
                            v-model="cancellationReason">                                    
                        </b-form-select> 
                    </b-form-group>
                </b-col>
                <b-col cols="4" v-if="cancelledBy=='Registry Clerk'">
                    <b-form-group                         
                        label="Reason" 
                        class="labels">
                        <b-form-select                                
                            :options="clerkCancellationOptions" 
                            :state="cancellationReasonStates"                           
                            v-model="cancellationReason">                                    
                        </b-form-select> 
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="mt-n4 mb-4" v-if="cancelledBy">
                <b-col cols="1" />
                <b-col cols="10" >
                    <b-form-group
                        class="labels"                
                        label="Comment:">
                        <b-form-textarea                             
                            rows="3"                            
                            v-model="cancellationComment">
                        </b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-row>
        
            <template v-slot:modal-footer>                
                <b-button class="mr-auto" variant="dark" @click="confirmCancel(false)">Cancel</b-button>
                <b-button class="ml-auto" variant="success" @click="confirmCancel(true)">Continue</b-button>
            </template>
        </b-modal>
            
        <b-modal body-class="py-0"  footer-class="d-none"  v-model="showCopyWindow" header-class="bg-court pt-4" title-class="h3 text-white mt-n1" title="Available Tabs to Copy" >
            <div class="text-center mb-3">
                <div class="my-3 h5 bg-white text-dark">Which Tab would you like to import into <b class="text-danger"> {{targetTab}} </b> ?</div>
                <b-button 
                    v-for="tab,inx in sourceBookingDatesTimes" :key="inx"
                    @click="copyTab(tab)"
                    variant="primary"
                    style="width:19rem;"
                    class="my-2 mx-5">
                        {{tab.name}}
                </b-button>
            </div>
        </b-modal>            
            
    </b-card>   
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment-timezone'
import * as _ from 'underscore';

import { bookingDateTimesInfoType, bookingInfoType } from '@/types/Bookings/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { bookingStatesInfoType } from '@/types/Bookings';
import DateCard from "../DateComponents/DateCard.vue"
import BookingDatePicker from "../DateComponents/BookingDatePicker.vue"
import EditBookingFields from "./EditBookingFields.vue"
import {statusOptions, requestOptions, bookingMethodOfAppearanceOptions} from '../BookingEnums'
import { locationsInfoType } from '@/types/Common/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
    components:{       
        EditBookingFields,
        DateCard,
        BookingDatePicker,
    }
})
export default class EditBookingModal extends Vue {
    
    @Prop({required: true})
    bookingDates!: bookingInfoType[]

    @Prop({required: true})
    interpreter!: interpreterInfoType;

    @Prop({required: true})
    bookingId!: number
     
    @Prop({required: true})
    public registryLocationId!: number;

    @commonState.State
    public courtLocations!: locationsInfoType[];

    registry = {id:0, name:''};

    updatedBookingInfo = 0;
    interpreterDataReady = false;

    allBookingDatesTimes = []
    tabIndex = 1;
    showCancelReasonWindow = false
    targetTab=''
    sourceBookingDatesTimes = []
    updateTabs=0;

    bookingCardsDates = []
    blockDates = []
    editDateReady = false
    updateCards=0
    errorMsg=''

    caseTabId=null
    showCopyWindow = false

    cancellationBooking = {} as bookingInfoType
    cancellationBookingPreviousStatus = ''
    cancelledByStates = null
    cancelledBy = ''
    cancellationReasonStates = null
    cancellationReason = ''
    cancellationComment = ''
    interpreterCancellationOptions = ['Sick', 'No Show', 'Other appointment']
    courtCancellationOptions = [ 'Adjourned',  'Re-scheduled', 'Scheduling Error', 'File ended']
    clerkCancellationOptions = [ 'Booking error, no cancellation fee',  'Booking error, cancellation fee due'];

    statusOptions
    requestOptions
    bookingMethodOfAppearanceOptions

    created(){
        this.statusOptions=statusOptions 
        this.requestOptions=requestOptions
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions 
    }

    @Watch('tabIndex')
    tabChanged(value){
        if(value==0){            
            this.updateCards++;
        }
    }
   
    mounted() {
        this.interpreterDataReady = false;
        this.errorMsg=''
        //console.log(this.interpreter)
        //console.log(this.bookingDates)
        this.registry = {id:this.registryLocationId, name:''};
        this.extractBookingDates()
        this.interpreterDataReady = true;
    }

    public extractBookingDates(){

        this.allBookingDatesTimes = []
        // this.bookingCardsDates = []
        this.blockDates = []
        this.editDateReady = false

        this.extractBlockDates()

        for(const bookingDate of this.bookingDates){              
                
            const beautyDate = moment(bookingDate.date).format('MMM DD, YYYY ')
            const booking: bookingInfoType = JSON.parse(JSON.stringify(bookingDate))
            if(!booking.cases) booking.cases=[]
            const date = this.combineDataTime(bookingDate.date, bookingDate.startTime).format()
            
            this.allBookingDatesTimes.push({
                date:date,
                time:{start:bookingDate.startTime, end:bookingDate.finishTime},
                beautyDate:beautyDate,
                name:beautyDate+bookingDate.startTime.replace(' ','')+' ('+bookingDate.status+')',
                booking: booking,
                bookingStates:this.prepopulateDefaultStates(),
                original:true
            })
                        
            this.blockDates.push(bookingDate.date.slice(0,10));
                  
        }

        this.sortAllBookingDatesTimes()
        this.extractBookingCards()
        
        // console.log(this.allBookingDatesTimes)
        //console.log(this.blockDates)
        
    }

    public combineDataTime(dateIso, timeAmPm){
        const tz = moment(dateIso).format('Z')
        return moment(dateIso.slice(0,10)+' '+timeAmPm+' '+tz, 'YYYY-MM-DD HH:mm A Z')
    }

    public extractBookingCards(){
        this.bookingCardsDates = []
        for(const eachBookingDate of this.allBookingDatesTimes){              
                
            const bookingDate = eachBookingDate.booking

            const bookingCancelled = (bookingDate.status==this.statusOptions[2].value)

            if(!bookingCancelled){
                const index = this.bookingCardsDates.findIndex(booking => booking.date.slice(0,10)==bookingDate.date.slice(0,10))
                
                if(index>-1){
                    this.bookingCardsDates[index].bookingTimes.push({start:bookingDate.startTime, end:bookingDate.finishTime, original:eachBookingDate.original})
                }else
                    this.bookingCardsDates.push({
                        date: bookingDate.date,    
                        bookingTimes:[{start:bookingDate.startTime, end:bookingDate.finishTime, original:eachBookingDate.original}]
                    }) 
            }else if(eachBookingDate.original==true){
                const index = this.bookingCardsDates.findIndex(booking => booking.date.slice(0,10)==bookingDate.date.slice(0,10))
                if(index<0)
                    this.bookingCardsDates.push({
                        date: bookingDate.date,    
                        bookingTimes:[]
                    })
                //console.log(eachBookingDate)
            } 
                  
        }
        
        for(const booking of this.bookingCardsDates){
            booking.bookingTimes.push({start:'', end:''})
        }
    }

    public extractBlockDates(){
        this.$http.get('/booking/interpreter/' + this.interpreter.id)
        .then((response) => {            
            if(response?.data){
                this.blockDates = response.data.map(bookingdate=> bookingdate.date.slice(0,10))
                this.editDateReady = true; 
            }           
        },(err) => {
            this.editDateReady = true;         
        });       
    }

    public prepopulateDefaultStates(){    
        const bookingStates = {} as bookingStatesInfoType;
        bookingStates.status = null;
        bookingStates.location = null;
        bookingStates.methodOfAppearance = null;
        bookingStates.start = null;
        bookingStates.end = null;
        bookingStates.cases = []

        return bookingStates
    } 
    

    public saveBooking(){
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
            this.$http.put('/booking/' + this.bookingId, body)
            .then((response) => {            
                if(response?.data){
                    this.closeBookingWindow();                 
                }
                
            },(err) => {
                //console.log(err.response.data.detail)
                this.errorMsg=err.response.data.detail           
            });
        }        
    }
    


    public checkBookingStates(showErrorPlace){

        let stateCheck = true;

        for(const eachBookingDateInx in this.allBookingDatesTimes){
            const eachBookingDate = this.allBookingDatesTimes[eachBookingDateInx]
            let booking = eachBookingDate.booking
            const bookingStates = eachBookingDate.bookingStates

            if(booking.status==statusOptions[2].value){                
            //     const originalBookingDate = this.bookingDates.filter(bookingdate =>bookingdate.id==booking.id)
            //     if(originalBookingDate.length>0){
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.caseName = JSON.parse(JSON.stringify(originalBookingDate[0].caseName));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.caseType = JSON.parse(JSON.stringify(originalBookingDate[0].caseType));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.courtLevel = JSON.parse(JSON.stringify(originalBookingDate[0].courtLevel));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.courtClass = JSON.parse(JSON.stringify(originalBookingDate[0].courtClass));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.comment = JSON.parse(JSON.stringify(originalBookingDate[0].comment));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.methodOfAppearance = JSON.parse(JSON.stringify(originalBookingDate[0].methodOfAppearance));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.prosecutor = JSON.parse(JSON.stringify(originalBookingDate[0].prosecutor));        
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.reason = JSON.parse(JSON.stringify(originalBookingDate[0].reason));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.registry = JSON.parse(JSON.stringify(originalBookingDate[0].registry));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.requestedBy = JSON.parse(JSON.stringify(originalBookingDate[0].requestedBy));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.room = JSON.parse(JSON.stringify(originalBookingDate[0].room));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.file = JSON.parse(JSON.stringify(originalBookingDate[0].file));
                    
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.federal = JSON.parse(JSON.stringify(originalBookingDate[0].federal));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.languages = JSON.parse(JSON.stringify(originalBookingDate[0].languages));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.locationId = JSON.parse(JSON.stringify(originalBookingDate[0].locationId));

            //         this.allBookingDatesTimes[eachBookingDateInx].booking.startTime = JSON.parse(JSON.stringify(originalBookingDate[0].startTime));
            //         this.allBookingDatesTimes[eachBookingDateInx].booking.finishTime = JSON.parse(JSON.stringify(originalBookingDate[0].finishTime));

            //         this.allBookingDatesTimes[eachBookingDateInx].booking.bilingual = JSON.parse(JSON.stringify(originalBookingDate[0].bilingual));
            //     }
                continue
            }
    
            bookingStates.status = !(booking.status)? false : null;
            bookingStates.methodOfAppearance = !(booking.methodOfAppearance)? false : null;

                       
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
                        this.tabIndex = Number(eachBookingDateInx)+1
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
                                    this.tabIndex = Number(caseitems.tabNumber)
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

    public cancelStatus(booking, previousStatus){
        this.cancellationBooking = booking
        this.cancellationBookingPreviousStatus = previousStatus
        this.showCancelReasonWindow = true;
    }

    public confirmCancel(confirm){
        if(confirm){
            this.cancelledByStates = null;
            this.cancellationReasonStates = null;
            if(!this.cancelledBy) {this.cancelledByStates = false; return}
            if(!this.cancellationReason) {this.cancellationReasonStates = false; return}

            this.cancellationBooking.cancellationReason = this.cancelledBy+' ('+this.cancellationReason+')'
            this.cancellationBooking.cancellationComment = this.cancellationComment
            this.cancellationBooking.cancellationDate = moment().format()
            this.cancellationBooking.cancellationTime = moment().format("hh:mm A")
            this.showCancelReasonWindow = false;
            this.extractBookingCards()
            
        }else{
            this.cancellationBooking.status = this.cancellationBookingPreviousStatus;
            this.showCancelReasonWindow = false;
        }
        
    }

    public bookingTimeChanged(newBookingDate: bookingInfoType){
        if(newBookingDate.id){
            const index = this.allBookingDatesTimes.findIndex(item => item.booking.id==newBookingDate.id)
            if(index>-1){
                this.allBookingDatesTimes[index].time = {start:newBookingDate.startTime, end:newBookingDate.finishTime};                
                this.allBookingDatesTimes[index].name = this.allBookingDatesTimes[index].beautyDate+newBookingDate.startTime.replace(' ','')+' ('+this.allBookingDatesTimes[index].booking.status+')';
                this.allBookingDatesTimes[index].booking =  newBookingDate;
            }
            this.extractBookingCards()
        }
    }

    public RemoveBookingDate(newDate){
        // console.log(newDate)                
    }
    
    public addBookingDates(newDates){
        this.bookingCardsDates = newDates;
        
        for(const newDate of newDates)
            this.ChangeBookingDate(newDate, null);

        // this.sortAllBookingDatesTimes()
        // this.extractBookingCards()
        this.updateCards++
    }

    public ChangeBookingDate(changedBookingDate, removedTime ){
        // console.log(changedBookingDate)
        // console.log(removedTime)
        
        if(!removedTime){
            for(const time of changedBookingDate.bookingTimes){
                
                if(time.original==true || time.start=='') continue;
                
                const indexOfExisting = this.allBookingDatesTimes.findIndex(booking =>{ 
                    
                    return ((booking.date.slice(0,10) == changedBookingDate.date.slice(0,10)) &&
                            (booking.time.start == time.start) &&
                            (booking.time.end == time.end) && 
                            (booking.booking.status != this.statusOptions[2].value)
                            
                    )               
                })
                
                if(indexOfExisting>-1) continue;

                const beautyDate = moment(changedBookingDate.date).format('MMM DD, YYYY ')
                this.allBookingDatesTimes.push({
                    date:changedBookingDate.date,
                    time:time,
                    beautyDate:beautyDate,
                    name:beautyDate+time.start.replace(' ','')+' ('+this.statusOptions[0].value+')',
                    booking:this.prepopulateDefaultValues(changedBookingDate.date, time),
                    bookingStates:this.prepopulateDefaultStates()                    
                })
            
            // this.updateEditDates++;
            }
            this.updateTabs++;
        }
        else{
            const indexOfRemoving = this.allBookingDatesTimes.findIndex(booking =>{                
                return ((booking.date.slice(0,10) == changedBookingDate.date.slice(0,10)) &&
                        (booking.time.start == removedTime.start) &&
                        (booking.time.end == removedTime.end) &&
                        (booking.booking.status != this.statusOptions[2].value)
                )                                      
            })
            if(indexOfRemoving>-1) this.allBookingDatesTimes.splice(indexOfRemoving,1);
        }
        
        //console.log(this.allBookingDatesTimes)
        this.sortAllBookingDatesTimes()
        this.extractBookingCards()
        //        
    }

    public sortAllBookingDatesTimes(){
        this.allBookingDatesTimes =  _.sortBy(this.allBookingDatesTimes, function(BookingDatesTime){            
            const startTime = BookingDatesTime.time.start
            return (BookingDatesTime.date.slice(0,10) + startTime.slice(6,8)+ startTime.slice(0,5))
        })
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

    public copyTab(tab){
        //console.log(tab)
        this.showCopyWindow = false
        const source =  this.allBookingDatesTimes.filter(booking =>booking.name==tab.name)
        const target =  this.allBookingDatesTimes.filter(booking =>booking.name==this.targetTab)
        if(source.length==1 && target.length==1){           
            
            // target[0].booking.status = JSON.parse(JSON.stringify(source[0].booking.status));
            target[0].booking.methodOfAppearance = JSON.parse(JSON.stringify(source[0].booking.methodOfAppearance));
            target[0].booking.comment = JSON.parse(JSON.stringify(source[0].booking.comment));
            target[0].booking.cases = JSON.parse(JSON.stringify(source[0].booking.cases));            
            this.updatedBookingInfo++
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
        // console.log(fields)
        // console.log(source)
        const sourceCases = []
        for(const bookingCase of source.booking.cases){
            if(fields.includes(bookingCase.tmpId))
                sourceCases.push(bookingCase)
        }

        for(const target of this.allBookingDatesTimes){            
            if(target.name==source.name || target.booking.status == this.statusOptions[2].value ) continue
            
            // console.log(target)
            if(fields.includes('status')){
                target.booking.status = JSON.parse(JSON.stringify(source.booking.status));
                if(source.booking.status == this.statusOptions[2].value){
                    target.booking.cancellationReason = JSON.parse(JSON.stringify(source.booking.cancellationReason));
                    target.booking.cancellationComment = JSON.parse(JSON.stringify(source.booking.cancellationComment));
                    target.booking.cancellationDate = moment().format()
                    target.booking.cancellationTime = moment().format("hh:mm A")
                }                
            }
            if(fields.includes('methodOfAppearance')){
                target.booking.methodOfAppearance = JSON.parse(JSON.stringify(source.booking.methodOfAppearance));
            }
            if(fields.includes('comment')){
                target.booking.comment = JSON.parse(JSON.stringify(source.booking.comment));
            }
            if(sourceCases.length>0){
                target.booking.cases = JSON.parse(JSON.stringify(sourceCases));
            }            
        }
        this.updatedBookingInfo++
    }


   
}

</script>

<style scoped lang="scss">
    ::v-deep .tab-class{
        margin:0.2rem 0.25rem;
        padding: 0.2rem 0.2rem;
        width: 8.5rem;        
        font-size: 10.5pt;
        line-height: 1.3rem;
        background: white;
        &.edit-button{
            height: 4.25rem;
            width:  4rem;
            background: rgb(245, 214, 128);
            font-weight: 600;
            align-items: center;
            display: flex;
        }
    }

    ::v-deep .booking-tab-header>.card-header{        
        overflow-y: auto;
        max-height: 11.5rem;        
    }

    ::v-deep .labels{
        font-weight: 600;
        color: rgb(63, 98, 133);
        
    }

    .date-card-container{
        margin: 1rem 0 0rem 0;
        padding:1.5rem 0;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;        
        overflow-y: hidden;        

        .date-card {
            flex: 0 0 auto;
        }  
    }
</style>