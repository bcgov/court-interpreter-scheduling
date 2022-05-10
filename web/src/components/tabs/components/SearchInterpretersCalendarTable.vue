<template>
    <b-card class="bg-white border-white">           

        <loading-spinner color="#000" v-if="searching" waitingText="Loading Results ..." />
        <div v-else> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!interpreters.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content border-white p-0" body-class="pt-0">
                <custom-pagination                                         
                    :pages="[3,6,10]"
                    :totalRows="interpreters.length"
                    @paginationChanged="paginationChanged"/>

                <b-table
                    :items="currentPageInterpreters"
                    :fields="interpreterFields"
                    borderless
                    thead-class="d-none"
                    responsive="sm">

                    <template v-slot:cell(interpreter)="data" >                    
                        <interpreter-details-card 
                            :interpreter="data.item"
                            :bookingDates="bookingDates"
                            :searchLocation="searchLocation"
                            :language="language"/>
                    </template>

                    <template v-slot:cell(calendar)="data" > 
                        <booking-calendar-view 
                            :bookings="data.item.booking" 
                            :bookingDates="bookingDates"
                            style="margin:3rem 0 2rem 0"/>
                    </template>                    
                </b-table>
                
                <custom-pagination                                         
                    :pages="[3,6,10]"
                    :totalRows="interpreters.length"
                    @paginationChanged="paginationChanged"/>
            
            </b-card>
        </div>
    
    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';

import InterpreterDetailsCard from "./InterpreterDetailsCard.vue"
import BookingCalendarView from "./DateComponents/BookingCalendarView.vue"
import CustomPagination from "./CustomComponents/CustomPagination.vue"

import { locationsInfoType } from '@/types/Common/json';
import { interpreterInfoType } from '@/types/Interpreters/json';
import { bookingDateTimesInfoType} from '@/types/Bookings/json';


import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
    components:{ 
        BookingCalendarView,
        InterpreterDetailsCard,
        CustomPagination
    }
})
export default class SearchInterpretersCalendarTable extends Vue {

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

       

    interpreterFields = [        
        {key:'interpreter',   label:'',  sortable:false, cellStyle:'', tdClass:'align-top border-top'},        
        {key:'calendar',      label:'',  sortable:false, cellStyle:'', tdClass:'align-middle border-top'},
    ]; 
    
    currentPage = 1;
    itemsPerPage = 3;// Default

    public paginationChanged(currentPage, itemsPerPage){
        this.currentPage = currentPage
        this.itemsPerPage = itemsPerPage
    }
    
    get currentPageInterpreters(){
        return this.interpreters.slice((this.itemsPerPage)*(this.currentPage-1), (this.itemsPerPage)*(this.currentPage-1) + this.itemsPerPage);
    }

}
</script>
