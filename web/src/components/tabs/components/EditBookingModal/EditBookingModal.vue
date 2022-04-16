<template>
    <b-card v-if="interpreterDataReady" class="border-white text-dark bg-white" body-class="py-0" :key="updatedBookingInfo"> 
        
        <b-row class="my-n2 ml-2">
            <b-col cols="9" class="mb-3 h2">  
                {{interpreter.firstName}} {{interpreter.lastName}}
            </b-col>                                       
        </b-row>
       
            
        <b-tabs :key="updateTabs" v-model="tabIndex" pills card>
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
                <b-row class="date-card-container" :key="updateCards" >                    
                    <date-card 
                        @remove="RemoveBookingDate" 
                        @bookingChanged="ChangeBookingDate" 
                        v-for="bookingCardDate,inx in bookingCardsDates" :key="'edit-card-'+inx"
                        :allowDelete="false" 
                        :bookingDate="bookingCardDate"/>
                </b-row>
            </b-tab>

            <b-tab no-body v-for="tab,inx in allBookingDatesTimes" :key="inx" title-link-class="text-center tab-class">
                <template #title>
                    <div><b-icon-calendar scale="0.85" /> {{tab.beautyDate}} </div>
                    <div style="margin-left:-1.2rem;"><b><b-icon-clock /> {{tab.time.start}}</b></div>
                    <div style="margin-left:0.1rem; color:#ABD  ;">
                        <b> {{tab.time.end}}</b>
                        <b-icon-x-octagon-fill v-if="tab.booking.status==statusOptions[2].value" class="text-danger ml-2"  />
                    </div>
                </template> 

                <edit-booking-fields
                    @cancel="cancelStatus"
                    @timeChanged="bookingTimeChanged"
                    :id="'tab-'+inx"                    
                    :totalTabs="allBookingDatesTimes.length"                   
                    :booking="tab.booking" 
                    :bookingStates="tab.bookingStates"
                    :allBookings="allBookingDatesTimes" 
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

        <b-modal size="lg" body-class="py-0"  v-model="showReasonWindow" header-class="bg-warning">
            <template v-slot:modal-title>
                <h2 class="my-2">Reason For Cancellation</h2>
            </template>
            <b-row class="my-4">
                <b-col cols="1" >
                </b-col>
                <b-col cols="5" >
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
                        </b-form-radio-group> 
                    </b-form-group>
                </b-col>
                
                <b-col cols="5" v-if="cancelledBy=='Interpreter'">
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
                <b-col cols="5" v-if="cancelledBy=='Court'">
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
            
            
    </b-card>   
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment-timezone'
import * as _ from 'underscore';

import { bookingDateTimesInfoType, bookingInfoType } from '@/types/Bookings/json';
import { interpreterInfoType } from '@/types/Interpreters/json';

import { bookingStatesInfoType } from '@/types/Bookings';
import DateCard from "../DateComponents/DateCard.vue"
import BookingDatePicker from "../DateComponents/BookingDatePicker.vue"
import EditBookingFields from "./EditBookingFields.vue"
import {interpretForOptions, statusOptions, requestOptions, bookingPeriodOptions, bookingMethodOfAppearanceOptions, interpreterRequestOptions} from '../BookingEnums'
import { locationsInfoType } from '@/types/Common/json';


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
    public searchLocation!: locationsInfoType;

    updatedBookingInfo = 0;
    interpreterDataReady = false;

    allBookingDatesTimes = []
    tabIndex = 1;
    showReasonWindow = false
    targetTab=''
    sourceBookingDatesTimes = []
    updateTabs=0;

    bookingCardsDates = []
    blockDates = []
    editDateReady = false
    updateCards=0
    errorMsg=''

    cancellationBooking = {} as bookingInfoType
    cancellationBookingPreviousStatus = ''
    cancelledByStates = null
    cancelledBy = ''
    cancellationReasonStates = null
    cancellationReason = ''
    cancellationComment = ''
    interpreterCancellationOptions = ['Sick', 'No Show', 'Other appointment']
    courtCancellationOptions = [ 'Adjourned',  'Re-scheduled', 'Scheduling Error']


    statusOptions
    requestOptions
    bookingMethodOfAppearanceOptions
    interpreterRequestOptions
    interpretForOptions

    created(){
        this.interpretForOptions=interpretForOptions
        this.statusOptions=statusOptions 
        this.requestOptions=requestOptions
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions 
        this.interpreterRequestOptions=interpreterRequestOptions
    }

   
    mounted() { 
        this.errorMsg=''
        console.log(this.interpreter)
        console.log(this.bookingDates)
        this.extractBookingDates()
        this.interpreterDataReady = true;
    }

    public extractBookingDates(){

        this.allBookingDatesTimes = []
        this.bookingCardsDates = []
        this.blockDates = []
        this.editDateReady = false

        this.extractBlockDates()

        for(const bookingDate of this.bookingDates){              
                
            const beautyDate = moment(bookingDate.date).format('MMM DD, YYYY ')
            this.allBookingDatesTimes.push({
                date:bookingDate.date,
                time:{start:bookingDate.startTime, end:bookingDate.finishTime},
                beautyDate:beautyDate,
                name:beautyDate+bookingDate.startTime.replace(' ',''),
                booking: bookingDate,
                bookingStates:this.prepopulateDefaultStates()
            })

            this.blockDates.push(bookingDate.date.slice(0,10));

            const index = this.bookingCardsDates.findIndex(booking => booking.date==bookingDate.date)
            if(index>-1){
                this.bookingCardsDates[index].bookingTimes.push({start:bookingDate.startTime, end:bookingDate.finishTime, original:true})
            }else
                this.bookingCardsDates.push({
                    date: bookingDate.date,    
                    bookingTimes:[{start:bookingDate.startTime, end:bookingDate.finishTime, original:true}]
                })            
        }

        for(const booking of this.bookingCardsDates)
        {
            booking.bookingTimes.push({start:'', end:''})
        }

        this.sortAllBookingDatesTimes()
        // console.log(this.allBookingDatesTimes)
        //console.log(this.blockDates)
        
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
        bookingStates.room = null; 
        bookingStates.location = null;
        bookingStates.file = null;
        bookingStates.interpretFor = null;
        bookingStates.caseName = null;
        bookingStates.request = null;
        bookingStates.language = null;
        bookingStates.reason = null;
        bookingStates.prosecutor = null;
        bookingStates.methodOfAppearance = null;
        bookingStates.federal = null;
        bookingStates.start = null;
        bookingStates.end = null;
        return bookingStates
    } 
    

    public saveBooking(){
        if (this.checkBookingStates(true)){ 
            console.log(this.allBookingDatesTimes)
            const body = {
                interpreter_id: this.interpreter.id,
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
            const booking = eachBookingDate.booking
            const bookingStates = eachBookingDate.bookingStates
    
            bookingStates.status = !(booking.status)? false : null;
            // bookingStates.room = !(booking.room)? false : null;        
        
            bookingStates.location = !(booking.locationId)? false : null;
            bookingStates.file = !(booking.file)? false : null;           
            bookingStates.caseName = !(booking.caseName)? false : null;
            bookingStates.request = !(booking.requestedBy)? false : null;
            bookingStates.language = !(booking.languages.length>0 )? false : null;
            bookingStates.reason = !(booking.reason)? false : null;
            bookingStates.prosecutor = (booking.federal && !booking.prosecutor)? false : null;
            bookingStates.methodOfAppearance = !(booking.methodOfAppearance)? false : null;
            bookingStates.federal = !(booking.federal != null)? false : null;

            for(const field of Object.keys(bookingStates)){
                if(bookingStates[field]==false){
                    stateCheck = false;
                    if(showErrorPlace){
                        this.tabIndex = Number(eachBookingDateInx)+1
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

    public cancelStatus(booking, previousStatus){
        this.cancellationBooking = booking
        this.cancellationBookingPreviousStatus = previousStatus
        this.showReasonWindow = true;
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
            this.showReasonWindow = false;
            
        }else{
            this.cancellationBooking.status = this.cancellationBookingPreviousStatus;
            this.showReasonWindow = false;
        }
        
    }

    public bookingTimeChanged(newBookingDate: bookingInfoType){
        const index = this.allBookingDatesTimes.findIndex(item => item.booking.id==newBookingDate.id)
        if(index>-1){
            this.allBookingDatesTimes[index].time = {start:newBookingDate.startTime, end:newBookingDate.finishTime};                
            this.allBookingDatesTimes[index].name = this.allBookingDatesTimes[index].beautyDate+newBookingDate.startTime.replace(' ','');
            this.allBookingDatesTimes[index].booking =  newBookingDate;
        }
    }

    public RemoveBookingDate(newDate){
        // console.log(newDate)                
    }
    
    public addBookingDates(newDates){
        this.bookingCardsDates = newDates;
        this.updateCards++
        for(const newDate of newDates)
            this.ChangeBookingDate(newDate, null);
    }

    public ChangeBookingDate(changedBookingDate, removedTime ){
        console.log(changedBookingDate)
        
        if(!removedTime){
            for(const time of changedBookingDate.bookingTimes){
                
                if(time.original || time.start=='') continue;
                
                const indexOfExisting = this.allBookingDatesTimes.findIndex(booking =>{                
                    return ((booking.date.slice(0,10) == changedBookingDate.date.slice(0,10)) &&
                            (booking.time.start == time.start) &&
                            (booking.time.end == time.end))               
                })
                
                if(indexOfExisting>-1) continue;

                const beautyDate = moment(changedBookingDate.date).format('MMM DD, YYYY ')
                this.allBookingDatesTimes.push({
                    date:changedBookingDate.date,
                    time:time,
                    beautyDate:beautyDate,
                    name:beautyDate+time.start.replace(' ',''),
                    booking:this.prepopulateDefaultValues(changedBookingDate.date, time),
                    bookingStates:this.prepopulateDefaultStates()
                })
            
            // this.updateEditDates++;
            }
        }
        else{
            const indexOfRemoving = this.allBookingDatesTimes.findIndex(booking =>{                
                return ((booking.date.slice(0,10) == changedBookingDate.date.slice(0,10)) &&
                        (booking.time.start == removedTime.start) &&
                        (booking.time.end == removedTime.end))                                      
            })
            if(indexOfRemoving>-1) this.allBookingDatesTimes.splice(indexOfRemoving,1);
        }

        this.sortAllBookingDatesTimes()
    }

    public sortAllBookingDatesTimes(){
        this.allBookingDatesTimes =  _.sortBy(this.allBookingDatesTimes, function(BookingDatesTime){            
            const startTime = BookingDatesTime.time.start
            return (BookingDatesTime.date + startTime.slice(6,8)+ startTime.slice(0,5))
        })
    }

    public prepopulateDefaultValues(date, time){
        const booking = {} as bookingInfoType;        
        
        booking.caseName = null;
        booking.comment = null;
        booking.methodOfAppearance = this.bookingMethodOfAppearanceOptions[0].value;
        booking.prosecutor = null;        
        booking.reason = null;
        booking.registry = this.searchLocation.name;
        booking.requestedBy = this.requestOptions[0].value;
        booking.room = null;
        booking.file = null;
        booking.status = this.statusOptions[0].value;
        booking.federal = null;
        booking.languages = [];
        booking.locationId = this.searchLocation.id;
        booking.interpreterId = this.interpreter.id;
        booking.date = date;
        booking.startTime = time.start;
        booking.finishTime = time.end;
        booking.actualStartTime = null;
        booking.actualFinishTime = null;
        booking.approversInitials = null;
        return booking
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

    ::v-deep .labels{
        font-weight: 600;
        color: rgb(63, 98, 133);
        
    }

    .date-card-container{
        margin: 1rem 0 2rem 0;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;        
        overflow-y: hidden;        

        .date-card {
            flex: 0 0 auto;
        }  
    }
</style>