<template>
    <b-card v-if="dataLoaded" style="width:30rem; font-size:14pt; border:0px;">
        <b-row style="font-size:16pt; margin:1rem 0 0 0.1rem;">
            <b>{{interpreter.lastName | capitalizefirst}}</b>, {{interpreter.firstName | capitalizefirst}} 
        </b-row>
        <b-row class="mt-5">
            <b-col cols="3">
                <b>Level:</b>
            </b-col>
            <b-col cols="9">
                <b-row
                    v-for="lan,inx in interpreter.languages.map(language => {return {name: language.languageName, level:language.level}})" 
                    :key="inx"
                    style="display: block;">
                    <b v-if="isSameLanguage(lan['name'],language)">Lv {{lan['level']}} - {{lan['name']}}</b>
                    <span v-else>Lv {{lan['level']}} - {{lan['name']}}</span>
                </b-row>
            </b-col>
        </b-row>

        <b-row class="mt-5">            
            <div
                :id="'popover-button-variant'+interpreter.id"
                v-for="conflict,inx in [disableBookingButton(interpreter.booking)]"
                :key="inx"
                v-b-tooltip.hover.left.noninteractive.v-warning
                :title="interpreter.contractExtension==false?'Contract Expired!':(bookingDates.length==0?'Please, first select the dates':'')"                 
                class="ml-2">

                    <b-button style="font-size:16px" 
                        size="sm"
                        :disabled="conflict || (!userRole.includes('cis-admin')&& interpreter.contractExtension==false)"
                        @click="bookInterpreter();"        
                        :class="interpreter.contractExtension?'text-primary bg-info border-info mt-0 px-4':'bg-danger px-4'" 
                        ><b>Book</b>
                    </b-button>
                    <b-popover
                        v-if="conflict && bookingDates.length>0"                                 
                        :target="'popover-button-variant'+interpreter.id"
                        triggers="hover"
                        placement="left"
                        customClass="conflict-popover"                                              
                        >                                
                            <scheduling-conflict-popup :bookings="interpreter.booking" :bookingDates="bookingDates"/>
                    </b-popover>
            </div>
            <b-button variant="transparent" class="border-0 ml-3" @click="showInterpreterDetailsWindow = true">
                <b class="text-primary">
                    More Details
                </b>
            </b-button>
        </b-row>


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

        <b-modal body-class="py-0" size="lg" footer-class="d-none"  v-model="showInterpreterDetailsWindow" header-class="bg-white text-primary">
            <template v-slot:modal-title>
                <h2 class="my-0 ml-2">{{interpreter.lastName | capitalizefirst}}, {{interpreter.firstName | capitalizefirst}}</h2> 
            </template>

            <b-table
                small
                borderless
                :items="interpreterDetails"
                thead-class="d-none"
                >   
                <template v-slot:cell(text)="data" >
                    <b>{{data.value}}</b>
                </template>
            </b-table>

            
            <b-row class="mb-3 mt-5 ml-1">            
                <div                    
                    v-for="conflict,inx in [disableBookingButton(interpreter.booking)]"
                    :key="inx">
                        <b-button style="font-size:16px" 
                            size="sm"
                            :disabled="conflict || (!userRole.includes('cis-admin')&& interpreter.contractExtension==false)"                               
                            @click="showInterpreterDetailsWindow=false;bookInterpreter();"
                            :class="interpreter.contractExtension?'text-primary bg-info border-info mt-0 px-4':'bg-danger px-4'"                                                         
                            ><b>Book</b>
                        </b-button>
                </div>
            </b-row>
        </b-modal>

    </b-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as _ from 'underscore';
import { interpreterInfoType } from '@/types/Interpreters/json';
import { bookingDateTimesInfoType } from '@/types/Bookings/json';
import InterpreterBookingModal from "./CreateBookingModal/InterpreterBookingModal.vue"

import {statusOptions} from './BookingEnums'
import SchedulingConflictPopup from "./SchedulingConflictPopup.vue"
import { locationsInfoType } from '@/types/Common/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
    components:{ 
        SchedulingConflictPopup,
        InterpreterBookingModal
    }
})
export default class InterpreterDetailsCard extends Vue {

    @Prop({required: true})
    interpreter!: interpreterInfoType; 

    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[]

    @Prop({required: true})
    language!: string;

    @Prop({required: true})
    public searchLocation!: locationsInfoType;
    
    @commonState.State
    public userRole!: string[];

    dataLoaded = false

    showBookingWindow = false;
    showInterpreterDetailsWindow = false;

    interpreterDetails =[]

    mounted(){
        this.dataLoaded = false;        
        this.extractInterpreterDetails()
        this.dataLoaded = true;        
    }

    public extractInterpreterDetails(){
        this.interpreterDetails = [
            {text:'Address',   value:this.interpreter.address},   
            {text:'City',      value:this.interpreter.city},
            {text:'Province',  value:this.interpreter. province},
            {text:'Post Code', value:this.interpreter. postal},
            {text:'Home',      value:Vue.filter('beautify-phone-no')(this.interpreter. homePhone)},
            {text:'Business',  value:Vue.filter('beautify-phone-no')(this.interpreter. businessPhone)},
            {text:'Phone',     value:Vue.filter('beautify-phone-no')(this.interpreter. phone)},
            {text:'Email',     value:this.interpreter. email},
            {text:'Supplier',  value:this.interpreter. supplier},
            {text:'Site Code', value:this.interpreter. siteCode},
            {text:'GST#',      value:this.interpreter. gst},
            {text:'Comments',  value:this.interpreter.comments}
        ]        
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


    public bookInterpreter(){        
        this.showBookingWindow = true;                
    }

    public isSameLanguage(l1, l2){
        l1 = l1.replace(/\s\s+/g, ' ');
        l2 = l2.replace(/\s\s+/g, ' ');        
        return l1== l2
    }
    
    public closeBookingWindow(){
        this.showBookingWindow = false; 
    }
}
</script>
<style scoped lang="scss">

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
