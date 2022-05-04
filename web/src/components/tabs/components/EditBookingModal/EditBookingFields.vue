<template>
    <div v-if="dataReady">

        <b-alert class="mt-3" variant="danger" :show="errorMsg.length>0" >            
            <b class="mr-2">Error: </b> {{errorMsg}} <b-icon-exclamation-circle-fill/>
        </b-alert>
<!-- <ROW - 1> -->
        <b-row class="mt-2 ml-1">
            
            <b-col cols="3">                    
                <b-form-group
                    class="labels"                
                    label="Status"
                    label-for="status">
                    <b-form-select 
                        class="input-line"
                        id="status"
                        :disabled="disableEdit"
                        @change="statusChanged"                                       
                        :options="statusOptions"                                 
                        :state="bookingStates.status"                  
                        v-model="booking.status">
                    </b-form-select>
                </b-form-group>
            </b-col> 
            <b-col cols="5">                              
                <div v-if="booking.status.includes('Cancel')"  
                    style="margin:1.35rem 0 0 0; height:2.5rem; padding:0.65rem;" 
                    class="rounded h4 text-center text-white bg-danger" >
                        Cancelled by: {{cancellationBy}} {{cancellationReason}}
                </div>
                <div v-else-if="booking.locationId!=searchLocation.id"  
                    style="margin:1.35rem 0 0 0; height:2.5rem; padding:0.65rem 0 0 0;" 
                    class="rounded h4 text-center text-white bg-warning" >
                        <b-icon-exclamation-triangle-fill/> This Booking corresponds to a different location.
                        
                </div>                
            </b-col>

            <b-col cols="2" :key="'start-update-'+updateTime"> 
                <b-form-group
                    class="labels"                
                    label="Start Time" 
                    label-for="start-time">
                    <b-form-input 
                        class="input-line"
                        id="start-time"
                        :formatter="startTimeFormatter"
                        :disabled="disableEdit" 
                        :state="bookingStates.start"                                        
                        v-model="booking.startTime">
                    </b-form-input>
                </b-form-group>                        
            </b-col>
            <b-col cols="2" :key="'end-update-'+updateTime"> 
                <b-form-group
                    class="labels"                
                    label="Finish Time" 
                    label-for="finish-time">
                    <b-form-input 
                        class="input-line"
                        id="finish-time"
                        :formatter="endTimeFormatter"
                        :disabled="disableEdit" 
                        :state="bookingStates.end"                                        
                        v-model="booking.finishTime">
                    </b-form-input>
                </b-form-group>                        
            </b-col>

        </b-row>

<!-- <ROW - 2> -->
        <b-row class="ml-1">
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Court File Number" 
                    label-for="file-number">
                    <b-form-input 
                        class="input-line"
                        id="file-number"
                        :disabled="disableEdit" 
                        :state="bookingStates.file"                                        
                        v-model="booking.file">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    class="labels"                
                    label="Case Name" 
                    label-for="case-name">
                    <b-form-input 
                        class="input-line"
                        id="case-name" 
                        :disabled="disableEdit" 
                        :state="bookingStates.caseName"                                        
                        v-model="booking.caseName">
                    </b-form-input>
                </b-form-group>
            </b-col>             
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Court Room" 
                    label-for="room">
                    <b-form-input 
                        :state="bookingStates.room"
                        :disabled="disableEdit" 
                        class="input-line"
                        id="room"                                         
                        v-model="booking.room">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="5">
                <b-form-group                        
                    label="Court Location" 
                    class="labels"
                    label-for="location">
                    <b-form-select 
                        id="location" 
                        class="input-line"                           
                        style="display:inline"
                        @change="changeLocation"
                        disabled
                        :state="bookingStates.location"
                        v-model="booking.locationId"> 
                        <b-form-select-option
                            v-for="courtLocation,inx in courtLocations" 
                            :key="inx"
                            :value="courtLocation.id">
                                {{courtLocation.name}}
                        </b-form-select-option>
                    </b-form-select> 
                </b-form-group>
            </b-col>
            
        </b-row>

<!-- <ROW - 3> -->
        <b-row class="ml-1">
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Case Type" 
                    label-for="case-type">
                    <b-form-select 
                        :options="caseTypeOptions"                    
                        :state="bookingStates.caseType"
                        class="input-line"
                        @change="booking.courtClass='';"
                        id="case-type"                                         
                        v-model="booking.caseType">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Court Level" 
                    label-for="court-level">
                    <b-form-select 
                        :options="courtLevelOptions"
                        :state="bookingStates.courtLevel"
                        class="input-line"
                        id="court-level"                                         
                        v-model="booking.courtLevel">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    class="labels"                
                    label="Court Class" 
                    label-for="court-class">
                    <b-form-select 
                        :options="booking.caseType=='Civil'? civilCourtClassOptions: criminalCourtClassOptions"
                        :state="bookingStates.courtClass"
                        class="input-line"
                        id="court-class"                                         
                        v-model="booking.courtClass">
                    </b-form-select>
                </b-form-group>
            </b-col>
                      
            
            <b-col cols="2">
                <b-form-group                        
                    label="Requested By" 
                    class="labels"
                    label-for="requested-by">
                    <b-form-select 
                        id="requested-by"
                        :disabled="disableEdit"  
                        class="input-line"                           
                        style="display:inline"
                        :options="requestOptions"
                        :state="bookingStates.request"
                        v-model="booking.requestedBy">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col>

            

            <b-col cols="3">
                <b-form-group                        
                    label="Method Of Appearance" 
                    class="labels"
                    label-for="appearance-method">
                    <b-form-select 
                        id="appearance-method" 
                        class="input-line"
                        :disabled="disableEdit"                           
                        style="display:inline"                                
                        :options="bookingMethodOfAppearanceOptions"
                        :state="bookingStates.methodOfAppearance"
                        v-model="booking.methodOfAppearance">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col>
        </b-row>
        
<!-- <ROW - 4> -->
        <b-row class="ml-1">
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Reason Code" 
                    label-for="reason-code">
                    <b-form-input 
                        class="input-line"
                        id="reason-code"  
                        :disabled="disableEdit" 
                        placeholder="FA, HR"  
                        :state="bookingStates.reason"                                    
                        v-model="booking.reason">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="2" >
                <b-form-group                        
                    label="Federal" 
                    class="labels mt-n1">
                    <b-form-radio-group                         
                        :class="bookingStates.federal==false?'border rounded border-danger pb-3 pt-1 px-2':'' "                           
                        style="display:inline"
                        @change="bookingStates.federal=null"
                        :disabled="disableEdit"                                     
                        :state="bookingStates.federal"
                        v-model="booking.federal"> 
                        <b-form-radio :value="true">Yes</b-form-radio> 
                        <b-form-radio :value="false">No</b-form-radio>                                  
                    </b-form-radio-group> 
                </b-form-group>
            </b-col>
            <b-col cols="3" >
                <b-form-group
                    v-if="booking.federal"
                    class="labels"                
                    label="Federal Prosecutor Name" 
                    label-for="prosecutor-name">
                    <b-form-input 
                        class="input-line"
                        :disabled="disableEdit" 
                        id="prosecutor-name" 
                        :state="bookingStates.prosecutor"                                                 
                        v-model="booking.prosecutor">
                    </b-form-input>
                </b-form-group>
            </b-col>
       
           
            <b-col cols="5" >
                <b-form-group
                    class="labels"                
                    label="Comment" 
                    label-for="comment">
                    <b-form-textarea 
                        class="input-line"
                        rows="3"
                        :disabled="disableEdit" 
                        id="comment"                                                   
                        v-model="booking.comment">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>

<!-- <ROW - 5> -->
        <b-row class="ml-1"> 
            <b-col cols="6 ">
                <b-row >
                    <b-button                     
                        style="margin:1rem 0; height: 2.25rem;"
                        v-if="!addNewLanguageForm"
                        :disabled="disableEdit"  
                        size="sm" 
                        :variant="bookingStates.language==false?'danger':'info'" 
                        @click="bookingStates.language=true;addNewLanguageForm = true"><b-icon-plus class="mr-1"/>Add Language
                    </b-button>
                    <div v-if="!addNewLanguageForm && booking.languages.length == 0" class="mt-4 ml-3 text-danger"> 
                        No languages have been added.
                    </div> 
                </b-row>

                <b-card class="mx-auto mt-4 bg-light" body-class="p-2" v-if="addNewLanguageForm">
                    <b-row class="ml-1">
                        <b-col cols="5">
                            <b-form-group                        
                                label="Language" 
                                class="labels"
                                label-for="language">
                                <b-form-select 
                                    id="language" 
                                    class="input-line"                           
                                    style="display:inline"                                    
                                    v-model="selectedLanguage"> 
                                    <b-form-select-option
                                        v-for="language,inx in languages" 
                                        :key="inx"
                                        :value="language.languageName">
                                            {{language.languageName}} (Level {{language.level}})
                                    </b-form-select-option>
                                </b-form-select> 
                            </b-form-group>
                        </b-col> 
                        <b-col cols="5">
                            <b-form-group                        
                                label="Interpret For" 
                                class="labels"
                                label-for="interpret-for">
                                <b-form-select 
                                    id="interpret-for" 
                                    class="input-line"                           
                                    style="display:inline"
                                    :options="interpretForOptions"
                                    v-model="selectedInterpretFor">                                    
                                </b-form-select> 
                            </b-form-group>
                        </b-col>
                        <b-col cols="2 mt-4">
                            <b-button @click="addLanguage" variant="success" >
                                Add
                            </b-button>
                        </b-col>                  
                    </b-row>
                </b-card>
            </b-col>

            <b-col cols="6">                                          
                <b-table 
                    :items="booking.languages"
                    :fields="languageFields"                                            
                    borderless    
                    small
                    style="border:3px solid #dc3545"
                    :class="bookingStates.language==false?'':'border rounded'"                                 
                    responsive="sm"
                    >
                    <template v-slot:cell(language)="data" >                                    
                        {{data.value}} (Level {{data.item.level}})
                    </template>
                    <template v-slot:cell(edit)="data" >   
                        <div style="float: right;">                                                                     
                            <b-button 
                                class="mr-2 border-0" 
                                size="sm" 
                                :disabled="disableEdit" 
                                variant="transparent" 
                                @click="removeLanguage(data)">
                                <b-icon 
                                    icon="trash-fill" 
                                    font-scale="1.25" 
                                    variant="danger"/>
                            </b-button>                       
                        </div>
                    </template>                
                </b-table>                       
                
            </b-col>   
        </b-row>  
 

    </div>   
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';

import {bookingInfoType } from '@/types/Bookings/json';
import {interpreterLanguageInfoType } from '@/types/Interpreters/json';

import {interpretForOptions, statusOptions, requestOptions, bookingMethodOfAppearanceOptions, caseTypeOptions, courtLevelOptions, civilCourtClassOptions, criminalCourtClassOptions} from '../BookingEnums'
import { bookingStatesInfoType } from '@/types/Bookings';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { locationsInfoType } from '@/types/Common/json';
const commonState = namespace("Common");



@Component
export default class EditBookingFields extends Vue {
    
    @Prop({required: true})
    tabIndex!: number
    
    @Prop({required: true})
    tabNumber!: number

    @Prop({required: true})
    booking!: bookingInfoType

    @Prop({required: true})
    original!: boolean|null

    @Prop({required: true})
    bookingStates!: bookingStatesInfoType;

    @Prop({required: true})
    public searchLocation!: locationsInfoType;
    
    @Prop({required: true})
    languages: interpreterLanguageInfoType[]

    @Prop({required: true})
    allBookings!: any[]

    @commonState.State
    public courtLocations!: locationsInfoType[];

    languageFields = [
        {key:'language',     label:'Language',      thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false},
        {key:'interpretFor', label:'Interpret For', thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false},
        {key:'edit',         label:'',              thClass:'text-white bg-time', thStyle:'', tdClass:'border-top align-middle', sortable:false }
    ] 

    addNewLanguageForm = false
    selectedInterpretFor = ''
    selectedLanguage =''
    dataReady = false

    cancellationReason = ''
    cancellationBy = ''

    previousStatus = ''

    disableEdit = false

    errorMsg=''

    updateTime = 0
    

    statusOptions
    requestOptions
    bookingMethodOfAppearanceOptions
    interpretForOptions
    caseTypeOptions
    courtLevelOptions 
    civilCourtClassOptions
    criminalCourtClassOptions

    created(){
        this.interpretForOptions=interpretForOptions
        this.statusOptions=this.original? statusOptions : statusOptions.filter(stat =>  !stat.text.toLowerCase().includes("cancel"))        
        this.requestOptions=requestOptions 
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions
        this.caseTypeOptions=caseTypeOptions
        this.courtLevelOptions=courtLevelOptions
        this.civilCourtClassOptions=civilCourtClassOptions
        this.criminalCourtClassOptions=criminalCourtClassOptions
    }

    @Watch('booking.status')
    watchStatusChanged(value){

        if(value==statusOptions[2].value){
            this.disableEdit = true
            this.extractCancellation()
        }else
            this.disableEdit = false
    }

    @Watch('booking.cancellationReason')
    extractCancellation(){
        if(this.booking.cancellationReason){
            const cancelParts = this.booking.cancellationReason.split(' (')
            this.cancellationBy = cancelParts[0]
            this.cancellationReason = '('+cancelParts[1]
        }
    }

    @Watch('tabIndex')
    tabEnter(value){
        if(value==this.tabNumber && this.booking.status!=statusOptions[2].value)
            this.timeConflict()
    }

    mounted() { 
        this.dataReady = false
        this.addNewLanguageForm = false  
        this.selectedInterpretFor = this.interpretForOptions[0].value;
        this.selectedLanguage = this.languages[0].languageName
        this.previousStatus =  JSON.parse(JSON.stringify(this.booking.status))
        this.watchStatusChanged(this.booking.status)
        this.dataReady = true        
    }

    public addLanguage(){
        const level = this.languages.filter(lang=>lang.languageName==this.selectedLanguage)
        
        this.booking.languages.push({
            language:this.selectedLanguage,
            level: (level.length==1? level[0].level : null),
            interpretFor:this.selectedInterpretFor
        })
        this.addNewLanguageForm = false;
        const bookingStates= this.bookingStates
        bookingStates.language = true;
    }

    public changeLocation(){

        const location = this.courtLocations.filter(loc => loc.id==this.booking.locationId)

        if(location.length==1){
            const booking= this.booking
            booking.registry = location[0].name
        }
    }

    public removeLanguage(data){
        this.booking.languages.splice(data.index,1);
    }

    public statusChanged(value){
        if(value==statusOptions[2].value)
            this.$emit('cancel', this.booking, this.previousStatus)
    }

    public startTimeFormatter(time){ 
        time = time.toUpperCase()
        this.bookingStates.start = this.timeValid(time)
        this.timeConflict()
        return time
    }

    public endTimeFormatter(time){
        time = time.toUpperCase()
        this.bookingStates.end = this.timeValid(time)
        this.timeConflict()
        return time
    }

    public modifyTime(time){     
        if(time.slice(5,6)!=' '){
            time = time.slice(0,5)+' '+ time.slice(5)
        }
        return time
    }

    public timeValid(time){        
        const timeFormat =/^(1[0-2]|[0][0-9]):([0-5][0-9])([ ]?)([AP]M|[ap]m)$/; 
        
        if(time && timeFormat.test(time)){ 
            this.errorMsg=''
            return null
        }else{            
            this.errorMsg='Invalid Time Format!  Valid format is \"nn:nn AM/PM\".  e.g. 12:00 PM'
            return false        
        }
    }

    public timeConflict(){
        Vue.nextTick(()=>{
            if(this.bookingStates.start==null && this.bookingStates.end==null){

                this.booking.startTime =  this.modifyTime(this.booking.startTime)
                this.booking.finishTime=  this.modifyTime(this.booking.finishTime)
                this.updateTime++;

                const start = moment(this.booking.startTime, "hh:mm A").format()   
                const end = moment(this.booking.finishTime, "hh:mm A").format()
                if(start >= end){
                    this.errorMsg='Start Time is equal to or after the Finish Time. '
                    return
                }

                for(const eachBooking of this.allBookings){
                    
                    if( eachBooking.booking.status != statusOptions[2].value && 
                        eachBooking.date.slice(0,10)==this.booking.date.slice(0,10) &&
                        this.booking.id != eachBooking.booking.id
                    ){  
                        const existingStart = moment(eachBooking.time.start, "hh:mm A").format()   
                        const existingEnd = moment(eachBooking.time.end, "hh:mm A").format()
                        if(!((start>=existingEnd && end >existingEnd)||(start<existingStart && end <=existingStart))){
                            this.errorMsg='The Start/Finish Times Conflict with: '+
                                eachBooking.beautyDate+ ' ('+ 
                                eachBooking.time.start +') to ('+ 
                                eachBooking.time.end+')'
                            this.bookingStates.conflict=false
                            return
                        }
                    }
                }
                this.errorMsg=''
                this.bookingStates.conflict=null
                this.$emit('timeChanged', this.booking)
            }
        })
    }
    

}

</script>


<style lang="scss" scoped>
    .labels {        
        margin:0 0 0rem 0;        
        line-height: 1rem;
    }
    ::v-deep label{        
        margin:0 0 0.5rem 0;
    }

    .custom-radio{
        margin-top: 0.45rem;
    }
</style>