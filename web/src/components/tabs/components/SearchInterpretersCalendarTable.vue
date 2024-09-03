<template>
    <b-card class="bg-white border-white">           

        <loading-spinner color="#000" v-if="searching" waitingText="Loading Results ..." />
        <div v-else> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!interpreters.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content border-white p-0" body-class="pt-0">   
                <b-row>
                    <b-col>
                        <custom-pagination
                            :key="'pagination-top-'+paginationKey"                                         
                            :pages="[3, 6, 10]"
                            :totalRows="totalRecords"
                            :initCurrentPage="initCurrentPage"
                            :initItemPerPage="initItemsPerPage"
                            @paginationChanged="paginationChanged"/>
                    </b-col>
                </b-row>
                <div v-if="interpreters.length==0" class="h3 text-info my-5"> No records matching interpreter's name filter.</div>
                <b-table
                    :key="'pagination-table-'+paginationKey"
                    :items="interpreters"
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
                            :interpreter="data.item" 
                            :bookings="data.item.booking" 
                            :bookingDates="bookingDates"
                            :searchLocation="searchLocation"
                            style="margin:3rem 0 2rem 0"/>
                    </template>                    
                </b-table>
                <b-row>
                    <b-col class="my-2 pt-3 border rounded">    
                        <b>Calendar Color Guide:</b>
                        <div class="multi-location badge">0</div>
                        <span>Busy in Multiple Locations</span>

                        <div class="busy badge">0</div>
                        <span>Busy</span>
                        
                        <div class="selected-date badge">0</div>
                        <span>Selected Dates</span>
                    </b-col>
                    <b-col class="float-right">       
                        <custom-pagination
                            :key="'pagination-bottom-'+paginationKey"                                         
                            :pages="[3, 6, 10]"
                            :totalRows="totalRecords"
                            :initCurrentPage="initCurrentPage"
                            :initItemPerPage="initItemsPerPage"
                            @paginationChanged="paginationChanged"/>
                    </b-col>
                </b-row>
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
    
    @Prop({required: true})
    public totalRecords!: number;

    @Prop({default: 1})
    initCurrentPage!: number;

    @Prop({default: 3})
    initItemsPerPage!: number;

    currentPage = 1;
    itemsPerPage = 3;// Default
    paginationKey = 0;

    mounted(){ }

    public paginationChanged(currentPage, itemsPerPage){
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        this.paginationKey++;

        this.$emit('paginationChanged', currentPage, itemsPerPage);
    }

}
</script>
<style scoped lang="scss">

    .badge {        
        display: inline;
        margin:0 0.5rem 0 1.7rem;
        border-radius: 20px;
        padding:0.3rem 0.65rem;
        font-size: 11pt;
    }
    .multi-location {
        background: rgb(237, 19, 19);
        color: rgb(237, 19, 19);
    }
    .busy {
        background: rgb(245, 163, 21);
        color: rgb(245, 163, 21);
    }
    .selected-date {
        background: rgb(56, 90, 171);
        color: rgb(56, 90, 171);
    }
</style>