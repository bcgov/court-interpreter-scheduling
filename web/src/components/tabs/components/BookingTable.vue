<template>
    <b-card class="bg-white border-white">                
            
        <loading-spinner color="#000" v-if="searching || !dataReady" waitingText="Loading Results ..." /> 
        <div v-else> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!bookings.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content border-white p-0" body-class="pt-0">
                <custom-pagination 
                    v-if="bookings.length>5"
                    :key="'pagination-top-'+paginationKey"                                        
                    :pages="[10,20,30]"
                    :totalRows="bookings.length"
                    :initCurrentPage="currentPage"
                    :initItemPerPage="itemsPerPage"
                    @paginationChanged="paginationChanged"/>

                <b-table
                    :items="bookingItems"
                    :fields="bookingFields"
                    class="border-info" 
                    sort-by="date"                                   
                    small
                    :currentPage="currentPage"
                    :perPage="itemsPerPage"                    
                    sort-icon-left
                    responsive="sm">

                    <template v-slot:cell(interpreter)="data" >                                            
                        <b-button style="font-size:18px; border: white; text-decoration: underline;" 
                            size="sm"                        
                            @click="displayInterpreterInfo(data.value);" 
                            class="text-primary bg-transparent text-left"
                            v-b-tooltip.hover.left.noninteractive.v-info
                            :title="userRole.includes('super-admin')? data.item.location_name: ''"

                            >{{data.value.lastName}}, {{data.value.firstName}}
                        </b-button>

                    </template>

                    <template v-slot:cell(dates)="data" >                        
                        <div
                            v-for="dateInfo,inx in sortByDate(data.item.dates)" 
                            :key="'date'+inx"
                            > 
                            <b style="font-size:11pt;">{{dateInfo.date | beautify-date-weekday}}</b> 
                            <span style="margin-left:0.5rem; font-size:11pt;">{{dateInfo.startTime}}-{{dateInfo.finishTime}}</span>                                                    
                        </div>
                    </template> 

                    <template v-slot:cell(file)="data" >                    
                        <div
                            v-for="dateInfo,inx in sortByDate(data.item.dates)" 
                            :key="'file'+inx"
                            v-b-tooltip.hover.left.noninteractive.v-info
                            :title="getCaseField(dateInfo.cases,'file')"
                            > 
                            {{getCaseField(dateInfo.cases,'file')|truncate-text(10)}}
                        </div>
                    </template>

                    <template v-slot:cell(caseName)="data" >                    
                        <div
                            v-for="dateInfo,inx in sortByDate(data.item.dates)" 
                            :key="'case'+inx"
                            v-b-tooltip.hover.left.noninteractive.v-info
                            :title="getCaseField(dateInfo.cases,'caseName')"
                            > 
                            {{getCaseField(dateInfo.cases,'caseName')|truncate-text(10)}}
                        </div>
                    </template>

                    <template v-slot:cell(language)="data" >                    
                        <div
                            v-for="dateInfo,inx in sortByDate(data.item.dates)" 
                            :key="'language'+inx"
                            v-b-tooltip.hover.left.noninteractive.v-info
                            :title="getCaseLanguage(dateInfo.cases)"
                            >                             
                            {{getCaseLanguage(dateInfo.cases)|truncate-text(30)}}
                        </div>
                    </template>                                     

                    <template v-slot:cell(status)="data" >
                         <div
                            v-for="dateInfo,inx in sortByDate(data.item.dates)" 
                            :key="'status'+inx"
                            >                             
                            <b-badge v-if="dateInfo.status == 'Booked'" class="p-1" variant="success">Booked</b-badge> 
                            <b-badge v-else-if="dateInfo.status == 'Cancelled'" class="p-1" variant="danger">Cancelled</b-badge>
                            <b-badge v-if="dateInfo.status == 'Pending'" class="p-1" variant="warning">Pending</b-badge>                                       
                        </div> 
                   </template> 

                    <template v-slot:cell(comment)="data" >                    
                        <div
                            v-for="dateInfo,inx in sortByDate(data.item.dates)" 
                            :key="'comment'+inx"
                            > 
                            <span v-if="dateInfo.comment" v-b-tooltip.hover :title="dateInfo.comment" >{{dateInfo.comment|truncate-text(commentLength)}}</span>
                            <span v-else class="text-white">-</span>
                        </div>
                    </template>     

                    <template v-slot:cell(courtDistance)="data" >
                        <div>{{data.item.court.distance|meter-to-km}} km</div>
                        <div class="text-primary">{{data.item.court.duration|sec-to-hour}}</div>
                    </template>             

                    <template v-slot:cell(edit)="data">                        
                        <b-row v-if="searchLocation.id" style="float: right;" class="mr-1">
                            <span                           
                                :title="areRecordsOnlyPendings(data.item)? 'All Bookings are Pending !':(data.item.recordsApproved?'Adm322 Forms Approved':'Adm322 Forms')"
                                v-b-tooltip.hover.top.noninteractive>
                                <!--  disabled="areRecordsOnlyPendings(data.item)"  -->
                                <b-button style="font-size:11px;"
                                    disabled                                                               
                                    @click="openAdm(data.item);" 
                                    :class="data.item.recordsApproved? 'text bg-approved my-1 px-1':'text bg-select border-info my-1 px-1' " 
                                    size="sm">
                                    <img 
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHaADAAQAAAABAAAAHAAAAADjGz/hAAAC2klEQVRIDe1Wy0uUURQ/9442PTaJLWqaiiCjqP6AwEAhwgja6cCMizaWIwW1aqM0QS1aGjRDERWlU1kpvWmjFhG0aBMFolCUj15ibULS8Z5+99Mr1++bme4IbaJvMfe87u93zrmvIfr//cUOCD/22nj6EpM4QMQBnz/WrwtBN6uqtjb2p2pzfp+tS1vR8mIJvblMsaGhges1qb4yP66tB6qJxNM8F3BGCPHcDi4mM/P9eb8QPWtWyNirC4em522WUJAUjobRbMstK7aoaCXrxSHheyurKuvfphqm/BMD7fUH5NN1+7alupagukDSJh6+/T+Gxrs3HXkUNjYzLop0cHAg831w/Ne6xkydAco3MtO+yYkPPX5f0QX3BxtdCpIKK68ElRsb2vnJyN7IvBQhFah47wI7lJJIo4nzOxSpc4p5lwek6E4kke4NUVnrcOfBiA2Oo1cPvcu2Gdm5vevj6QrFqpdAiIWcFCQmiEQIQLtnhNpuAF1GZ9KcJFTHqzxQKXeOZpOVMhSqRadjYx3Nl13ITIxze0NCvJvB1aE/ZnUXR+QGiZnu0c7kbQNmj3PHLe/udq50+FryDRDa0FLNvQEEx1WOX2JNn0SPdS2zCf8kO5NqIGR/isLhjVLKo0jgqQfOtIe/jiMZ98+5vRoymkjH5fTUt48dze1Q21HlY1Rdh7dhs58y2pipUYr7tF1KUTvSkew3Mc6kADmsFJ3FDhaReGYAL8pnnMFqDcRSPDSALqN7e2XZMxL0YhaUt4CwRsu4FE6XunudSUeuNr0e60xWh5eXr0aVXmUSxwW7t3U2EfdfZ1ID+f5i0xfIw7gcpkSIfxp7KWPgHJknCo6SnjZNinVPYfOcKJYANtXJkistBogdmtKghWK0T8cUrBQTS/rngLV9YMjyVWwIdUwe0ozCIQjYDWChcSzbsmCOTWwT6vmB9griK8hl9pItxOBgN632EzpM/YdCfgOczgLVckVGfAAAAABJRU5ErkJggg==" 
                                        alt="">                                                                                  
                                </b-button>
                            </span>
                            <b-button 
                                style="font-size:11px;" 
                                size="lg"
                                v-b-tooltip.hover.top.noninteractive
                                title="Edit Booking"        
                                @click="editBooking(data.item);" 
                                class="text-primary bg-info border-info my-1 px-2 ml-2" >
                                <b-icon-pencil-fill class="mx-1" scale="1.35"/>                                                       
                            </b-button>
                        </b-row> 
                    </template>                   
                    
                </b-table>

                <custom-pagination
                    :key="'pagination-bottom-'+paginationKey"                                         
                    :pages="[10,20,30]"
                    :totalRows="bookings.length"
                    :initCurrentPage="currentPage"
                    :initItemPerPage="itemsPerPage"
                    @paginationChanged="paginationChanged"/>
            
            </b-card>
        </div>

        <b-modal size="xl" footer-class="d-none" v-model="showBookingWindow" no-close-on-backdrop header-class="bg-primary text-white" >
            <template v-slot:modal-title>
                <h1 class="my-2 ml-2">Update Court Interpreter Request</h1> 
            </template>

            <edit-booking-modal
                :interpreter="currentInterpreter"
                :bookingDates="currentBooking"
                :bookingId="currentBookingId"
                :registryLocationId="currentBookingRegistryId"
                @close="closeBookingWindow"
                />

            <template v-slot:modal-header-close>
                <b-button
                    variant="outline-dark"
                    class="close-button"
                    @click="closeBookingWindow"
                    >&times;</b-button
                >
            </template>
        </b-modal>     

        <b-modal v-model="showInterpreterDetailsWindow" id="bv-modal-interpreter-details" header-class="bg-white text-primary" centered hide-footer>            
            <template v-slot:modal-title>
                <h2 class="my-2">{{interpreterDetails.firstName}} {{interpreterDetails.lastName}}</h2>
            </template>

            <b-row>
                <b-col style="font-weight: 700;">Phone</b-col>
                <b-col>{{interpreterDetails.phone | beautify-phone-no}}</b-col>
            </b-row>
            <b-row>
                <b-col style="font-weight: 700;">Email Address</b-col>
                <b-col>{{interpreterDetails.email}}</b-col>
            </b-row>            
                       
            <template v-slot:modal-header-close>                 
                 <b-button variant="outline-white" style="padding-bottom:0;" class="text-primary close-button" @click="$bvModal.hide('bv-modal-interpreter-details')"
                 >&times;</b-button>
            </template>
        </b-modal>

        <b-modal size="xl xxl" v-model="showAdmWindow" header-class="none" >
            <template v-slot:modal-title>
                <b-row class="ml-1">
                    <img class="img-fluid d-none d-md-block"
                        src="@/images/bcid-logo-text-en.svg"
                        width="60"
                        height="60"                    
                        alt="B.C. Government Logo"/>
                    <div style="font-size:16pt; margin:1rem 0 0 1rem;" >ADM-322</div>
                </b-row>
            </template>
            <adm-forms :bookingId="currentAdmId" />
            <template v-slot:modal-header-close>
                <b-button variant="outline-white" style="padding-bottom:0;" class="text-primary close-button" @click="closeBookingWindow">&times;</b-button>
            </template>
            <template v-slot:modal-footer>                
                <b-button class="mr-auto" variant="dark" @click="closeBookingWindow">Close</b-button>
            </template>
        </b-modal> 

        <b-modal v-model="showApprovedWarningWindow" header-class="bg-warning" title-class="h3" title="Approved ADM322 Warning">
            This booking's ADM322 Invoice has already been approved. By editing it, the approval will require amendment.
            <template v-slot:modal-footer>                
                <b-button class="mr-auto" variant="dark"    @click="showApprovedWarningWindow=false;showBookingWindow=false;">Back</b-button>
                <b-button class="ml-auto" variant="warning" @click="showApprovedWarningWindow=false;showBookingWindow=true;">Continue</b-button>
            </template>
        </b-modal>

        
    
    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';
import * as _ from 'underscore';

import EditBookingModal from "./EditBookingModal/EditBookingModal.vue"

import InterpreterDetails from "./InterpreterDetails.vue";
import CustomPagination from "./CustomComponents/CustomPagination.vue"
import AdmForms from "./AdmForms/AdmForms.vue"

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");


import {bookingInfoType, bookingInterpreterInfoType, bookingSearchResultInfoType} from '@/types/Bookings/json';
import { locationsInfoType } from '@/types/Common/json';

@Component({
    components:{
        EditBookingModal,
        InterpreterDetails,        
        AdmForms,
        CustomPagination
    }
})
export default class BookingTable extends Vue {

    @Prop({required: true})
    bookings!: bookingSearchResultInfoType[];
    
    @Prop({required: true})
    searching!: boolean;

    @Prop({required: true})
    public searchLocation!: locationsInfoType;

    @commonState.State
    public courtLocations!: locationsInfoType[];

    @commonState.State
    public userRole!: string[];
 

    showBookingWindow = false;
    showInterpreterDetailsWindow = false;
    showApprovedWarningWindow = false;

    showAdmWindow = false;

    interpreterDetails = {} as bookingInterpreterInfoType;

    currentBooking = {} as bookingInfoType;
    currentInterpreter = {} as bookingInterpreterInfoType
    currentBookingId = 0
    currentBookingRegistryId = 0;

    currentAdmId = null
    
    bookingItems = []
    dataReady=false
    commentLength =5;

    currentPage = 1;
    itemsPerPage = 10;// Default
    paginationKey = 0;

    bookingFields = [        
        {key:'dates',          label:'Date Range',    sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle,', tdClass:'align-middle',          thStyle:' width:20%'},
        {key:'file',           label:'Court File #',  sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle,', tdClass:'align-middle',          thStyle:' width:9%'},
        {key:'caseName',       label:'Case Name',     sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle',           thStyle:' width:12%'},
        {key:'language',       label:'Language',      sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle',           thStyle:' width:20%'},
        {key:'interpreter',    label:'Interpreter',   sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle text-left', thStyle:' width:11%'},
        {key:'status',         label:'Status',        sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle',           thStyle:' width:4%'},
        {key:'comment',        label:'Comment',       sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle',           thStyle:' width:11%'},
        {key:'courtDistance',  label:'Distance',      sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle',           thStyle:'width:6%'},       
        {key:'edit',           label:'',              sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle',           thStyle:' width:7%'}
    ];

    @Watch('searching')
    public getBookingItems(){
        this.dataReady = false;
        this.bookingItems = []
        for(const booking of this.bookings){
            const dates = this.sortByDate(booking.dates)
            // console.log(dates)
            // booking['file'] = dates[0].file
            // booking['caseName'] = dates[0].caseName
            // booking['language'] = this.getLanguages(dates[0].languages)           
            booking['date'] = dates[0].date 
            booking['court'] = booking.interpreter.courts.filter(court => court.court_id == booking.location_id)[0];
            this.bookingItems.push(booking)
        }
        this.dataReady = true;        
    }

    mounted() {        
        this.showApprovedWarningWindow = false;
        this.showBookingWindow = false; 
        this.getBookingItems()
        window.addEventListener('resize', this.getWindowWidth);
        this.getWindowWidth()
    }

    public getWindowWidth(){
        const windowWidth = document.documentElement.clientWidth
        this.commentLength = -3 + (-6.92932859e-9*Math.pow(windowWidth,3))+(3.4768992747e-5*Math.pow(windowWidth,2))-(0.03922*windowWidth)+16.528
    }    
    
    public displayInterpreterInfo(interpreterInfo: bookingInterpreterInfoType){
        this.interpreterDetails = interpreterInfo;
        this.showInterpreterDetailsWindow = true;
    }    
    
    public closeBookingWindow(){
        this.showAdmWindow = false;
        this.showBookingWindow = false;
        this.$emit('find');
    }    
    
    public editBooking(bookingToEdit: bookingSearchResultInfoType){
        //console.log(bookingToEdit)       
        this.currentBooking = JSON.parse(JSON.stringify(bookingToEdit.dates));
        this.currentInterpreter = bookingToEdit.interpreter
        this.currentBookingId = bookingToEdit.id
        this.currentBookingRegistryId = bookingToEdit.location_id
        if(bookingToEdit.recordsApproved) 
            this.showApprovedWarningWindow = true
        else
            this.showBookingWindow = true;        
    }

    public openAdm(bookingToADM: bookingSearchResultInfoType){
        // console.log(bookingToADM);        
        this.currentAdmId = bookingToADM.id;
        this.showAdmWindow = true;
    }

    public areRecordsOnlyPendings(data){
        for(const date of data.dates)
            if(date.status=='Booked' || date.status=='Cancelled') return false
        return true
    }


    public sortByDate(data){
        return _.sortBy(data, function(data){            
            const startTime = data.startTime
            return (data.date.slice(0,10) + startTime.slice(6,8)+ startTime.slice(0,5))+data.status
        })
    }
    
    public getCaseLanguage(data){
        const languages = data.map(i=>(i.language.languageName))
        return _.uniq(languages).join(', ')

    }

    public getCaseField(data, field){ 
        const caseField = data.map(i=>(i[field]))         
        return  _.uniq(caseField).join(', ')
    }

    public paginationChanged(currentPage, itemsPerPage){
        this.currentPage = currentPage
        this.itemsPerPage = itemsPerPage
        this.paginationKey++;
    }

}
</script>
<style lang="scss">
    .modal-dialog.modal-xl.xxl .modal-content{
        width: 125% !important;
        margin-left:-12%;
    }
</style>

<style scoped lang="scss">
    .labels {
        font-size: 16px; font-weight:600; line-height: 1rem; color: rgb(12, 82, 114);
    }

    .input-line {
        font-size: 14px; font-weight:600;
    }
    .close-button {
        background-color: transparent !important;
        color: white;
        border: white;
        font-weight: 700;
        font-size: 2rem;
        padding-top: 0;
        margin-top: 0;
    }

</style>