<template>
    <b-card class="bg-white border-white">           

        <loading-spinner color="#000" v-if="searching" waitingText="Loading Results ..." />
        <div v-else> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!interpreters.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content border-white p-0" body-class="pt-0">
                <custom-pagination                                         
                    :pages="[10,20,30]"
                    :totalRows="interpreters.length"
                    @paginationChanged="paginationChanged"/> 
                    
                <b-table
                    :items="interpreters"
                    :fields="interpreterFields"
                    class="border-info"
                    sort-icon-left                                    
                    small
                    :currentPage="currentPage"
                    :perPage="itemsPerPage"
                    responsive="sm">

                    <template v-slot:head(email)="data" >                    
                        <span class="mt-1">{{data.label}}</span>
                        <b-button style="font-size:14px" 
                            size="sm"                        
                            @click="copyEmails();" 
                            class="text-white bg-transparent border-primary ml-2"
                            v-b-tooltip.hover.top.noninteractive
                            title="Copy emails to clipboard" 
                            ><i class="fa fa-clone"></i>
                        </b-button>

                    </template>

                    <template v-slot:cell(lastName)="data" >                    
                        <b>{{data.item.lastName | capitalizefirst}}</b>, {{data.item.firstName | capitalizefirst}}                    
                    </template>

                    <template v-slot:cell(languages)="data" >    
                        <span 
                            v-for="lan,inx in data.item.languages.map(language => {return {name: language.languageName, level:language.level}})" 
                            :key="inx"
                            style="display: block;">
                            <b v-if="isSameLanguage(lan['name'],language)">{{lan['name']}} {{lan['level']}}</b>
                            <span v-else>{{lan['name']}} {{lan['level']}}</span>
                        </span>

                    </template>

                    <template v-slot:cell(fullAddress)="data">    
                        <div 
                            v-html="data.value" 
                            style="display:inline">
                            {{data.value}}
                        </div>
                        <a
                            style="margin-left:0.5rem; display:inline"
                            target="_blank"
                            rel="noopener noreferrer"
                            :href="'https://www.google.com/maps/dir/?api=1&origin='+data.value+' '+data.item.postal+'&destination='+data.item.city+' BC courthouse'"                            
                        >{{data.item.postal}} 
                        </a>           
                    </template>

                    <template v-slot:cell(phone)="data" >    
                        <span                            
                            v-if="data.value"                            
                            style="display: block;">
                            {{data.value | beautify-phone-no}} mobile
                        </span>    
                        <span 
                            v-if="data.item.businessPhone"                            
                            style="display: block;">
                            {{data.item.businessPhone | beautify-phone-no}} work
                        </span>
                        <span 
                            v-if="data.item.homePhone"                            
                            style="display: block;">
                            {{data.item.homePhone | beautify-phone-no}} home
                        </span>                                    
                    </template>

                    <template v-slot:cell(new)="data" >
                        <b-badge 
                            v-if="!data.item.new"
                            class="mt-0 text-success border py-2"                            
                            variant="white"
                            style="float: left;"
                            >New
                        </b-badge>                                        
                    </template>                    

                    <template v-slot:cell(edit)="data" >
                        <div
                            :id="'popover-button-variant'+data.index"
                            v-for="conflict,inx in [disableBookingButton(data.item.booking)]"
                            :key="inx"
                            v-b-tooltip.hover.left.noninteractive.v-warning
                            :title="data.item.contractExtension==false?'Contract Expired!':(bookingDates.length==0?'Please, first select the dates':'')" 
                        >
                            <b-button style="font-size:12px" 
                                size="sm" 
                                :disabled="conflict || (!userRole.includes('cis-admin')&& data.item.contractExtension==false)"
                                @click="bookInterpreter(data.item);"
                                :class="data.item.contractExtension?'text-primary bg-info border-info mt-0 px-3':'bg-danger px-3'" 
                                ><b>Book</b>
                            </b-button>
                            <b-popover
                                v-if="conflict && bookingDates.length>0"                                 
                                :target="'popover-button-variant'+data.index"
                                triggers="hover"
                                placement="left"
                                customClass="conflict-popover"                                              
                                >                                
                                    <scheduling-conflict-popup :bookings="data.item.booking" :bookingDates="bookingDates"/>
                            </b-popover>
                        </div>
                        
                    </template>

                    <template v-slot:cell(details)="data" >
                        
                        <b-button 
                            style="font-size:20px; border: none;" 
                            size="sm" 
                            @click="openDetails(data.item); data.toggleDetails();" 
                            class="text-primary bg-transparent">
                            <b-icon-caret-right-fill v-if="!data.item['_showDetails']"></b-icon-caret-right-fill>
                            <b-icon-caret-down-fill v-if="data.item['_showDetails']"></b-icon-caret-down-fill>                                                       
                        </b-button>
                        
                    </template>
                    <template v-slot:row-details>
                        <b-card bg-variant="inactive" class="mb-3" border-variant="white" body-class="px-1 pt-0 pb-1">                                                     
                            <interpreter-details :interpreterDirectory="false" :interpreterDetails="expandedInterpreter" />
                        </b-card>
                    </template>
                    
                </b-table>

                <custom-pagination                                           
                    :pages="[10,20,30]"
                    :totalRows="interpreters.length"
                    @paginationChanged="paginationChanged"/>                
            
            </b-card>
        </div>



        <b-modal body-class="py-0" size="xl" footer-class="d-none"  v-model="showBookingWindow" header-class="bg-primary text-white" >
            <template v-slot:modal-title>
                <h1 class="my-2 ml-2">Court Interpreter Request</h1> 
            </template>
            
            <interpreter-booking-modal
                @close="closeBookingWindow"
                :language="language"
                :interpreter="interpreter"
                :bookingDates="bookingDates"
                :searchLocation="searchLocation"/>           

            <template v-slot:modal-header-close>
                <b-button
                    variant="outline-dark"
                    class="closeButton"
                    @click="closeBookingWindow"
                    >&times;</b-button
                >
            </template>
        </b-modal>       
    
    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';

import InterpreterDetails from "./InterpreterDetails.vue";
import SchedulingConflictPopup from "./SchedulingConflictPopup.vue"
import InterpreterBookingModal from "./CreateBookingModal/InterpreterBookingModal.vue"

import CustomPagination from "./CustomComponents/CustomPagination.vue"

import { locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';
import { bookingDateTimesInfoType} from '@/types/Bookings/json';
import {statusOptions} from './BookingEnums'

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
    components:{       
        InterpreterDetails,
        SchedulingConflictPopup,
        InterpreterBookingModal,
        CustomPagination
    }
})
export default class SearchInterpretersTable extends Vue {

    @Prop({required: true})
    interpreters!: interpreterInfoType[];

    @Prop({required: true})
    searching!: boolean;

    @Prop({required: true})
    language!: string;

    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[]

    @Prop({required: true})
    public searchLocation!: locationsInfoType;

    @commonState.State
    public userLocation!: locationsInfoType;

    @commonState.State
    public userRole!: string[];

    updatedBookingInfo = 0;
    
    
    showBookingWindow = false;

    interpreter = {} as interpreterInfoType; 
      
    expandedInterpreter = {} as interpreterInfoType;
    
    currentPage = 1;
    itemsPerPage = 10;// Default
    
   
    interpreterFields = [
        {key:'details',             label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:5%'},
        {key:'lastName',            label:'Name',     sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:20%'},
        {key:'languages',           label:'Language', sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:14%'},
        {key:'fullAddress',         label:'Address',  sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:21%'},
        {key:'phone',               label:'Phone',    sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:14%'},
        {key:'email',               label:'Email',    sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:16%'},
        {key:'new',                 label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:5%'},
        {key:'edit',                label:'',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle', tdClass:'align-middle', thStyle:'width:5%'}
    ]; 

       

    public bookInterpreter(interpreterToBook: interpreterInfoType){
        // console.log(interpreterToBook)              
        this.interpreter = interpreterToBook;
        this.showBookingWindow = true;
                
    }

    public copyEmails(){        
        const emailList = this.interpreters.map( interpreter => {if (interpreter.email && interpreter.email.length)return interpreter.email});      

        let inputField =document.createElement('input');
        document.body.appendChild(inputField)
        inputField.value =emailList.toString();
        inputField.select();
        document.execCommand('copy',false);
        inputField.remove();
    }    

    public openDetails(newExpandedInterpreter: interpreterInfoType){
        this.expandedInterpreter = newExpandedInterpreter;
    }
        
    
    public closeBookingWindow(){
        this.showBookingWindow = false; 
    }

    public isSameLanguage(l1, l2){
        l1 = l1.replace(/\s\s+/g, ' ');
        l2 = l2.replace(/\s\s+/g, ' ');        
        return l1== l2
    }


    public disableBookingButton(booking){
        if(this.bookingDates.length==0) return true
        if(booking.length>0){
            const busyDates = _.flatten((booking.map(item=>item.dates?.map(bookedDate=>{
                if(bookedDate.status == statusOptions[2].value) return
                return bookedDate.date?.slice(0,10) 
            }))))
            for(const bookingDate of this.bookingDates)
                if(busyDates.includes(bookingDate.date.slice(0,10)))
                    return true
        }
        return false
    }

    public paginationChanged(currentPage, itemsPerPage){
        this.currentPage = currentPage
        this.itemsPerPage = itemsPerPage
    }

}
</script>

<style scoped lang="scss">

    .labels {
        font-size: 16px; font-weight:600; line-height: 1rem; color: rgb(12, 82, 114);
    }

    .input-line {
        font-size: 14px; font-weight:600;
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
