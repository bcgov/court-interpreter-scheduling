<template>
    <div>
        <b-row>
            <b-col cols="8">
                <h3 v-if="name=='same-location'" class="my-1 ml-2">
                    Same Bookings for an Interpreter in the Same Location but Separate ADMs
                </h3>
                <h3 v-else class="my-1 ml-2">
                    Same Bookings for an Interpreter in Different Locations with Separate ADMs
                </h3>
            </b-col>
            <b-col>
                <custom-pagination class="mt-n1"                    
                    :key="'pagination-top-'+paginationKey"                                        
                    :pages="[10,20,30]"
                    :totalRows="bookings.length"
                    :initCurrentPage="currentPage"
                    :initItemPerPage="itemsPerPage"
                    @paginationChanged="paginationChanged"/>
            </b-col>
        </b-row>
        
        <b-table
            :items="bookings"
            :fields="bookingFields"
            class="border-info"                                                
            sort-by="date"
            small
            sort-icon-left
            :sort-compare="sortCompare"
            :currentPage="currentPage"
            :perPage="itemsPerPage"                                
            responsive="sm">
            <template v-slot:cell(date)="data" >
                <div>{{data.item[0]['date']}}</div>
            </template>
            <template v-slot:cell(time)="data" >
                <div style="font-size:10pt"
                    v-for="dateInfo,inx in sortByDate(data.item)" 
                    :key="'time-'+data.index+'-'+name+'-'+inx"
                    >{{dateInfo['time']}}
                </div>
            </template>
            <template v-slot:cell(actualTime)="data" >
                <div style="font-size:10pt"
                    v-for="dateInfo,inx in sortByDate(data.item)" 
                    :key="'act-time-'+data.index+'-'+name+'-'+inx"
                    >{{dateInfo['actualTime']}}
                </div>
            </template>
            <template v-slot:cell(courtLocation)="data" >
                <div v-if="name=='same-location'">{{data.item[0]['courtLocation']}}</div>
                <div v-else>
                    <div v-for="dateInfo,inx in sortByDate(data.item)" 
                        :key="'court-location-'+data.index+'-'+name+'-'+inx"
                        >{{dateInfo['courtLocation']}}
                    </div>
                </div>
            </template>
            <template v-slot:cell(interpreterName)="data" >                
                <div>{{data.item[0]['interpreterName']}}</div>
            </template>
            <template v-slot:cell(invoiceTotal)="data" >
                <div v-for="dateInfo,inx in sortByDate(data.item)" 
                    :key="'total-'+data.index+'-'+name+'-'+inx"
                    >{{dateInfo['invoiceTotal']}} $
                </div>
            </template>
            <template v-slot:cell(invoiceDate)="data" >
                <div v-for="dateInfo,inx in sortByDate(data.item)" 
                    :key="'invoice-date-'+data.index+'-'+name+'-'+inx"
                    >{{dateInfo['invoiceDate']}}
                </div>
            </template>
            <template v-slot:cell(invoiceNumber)="data" >
                <div v-for="dateInfo,inx in sortByDate(data.item)" 
                    :key="'invoice-num-'+data.index+'-'+name+'-'+inx"
                    >{{dateInfo['invoiceNumber']}}
                </div>
            </template>
            <template v-slot:cell(clerk)="data" > 
                <div v-for="dateInfo,inx in sortByDate(data.item)" 
                    :key="'clerk-'+data.index+'-'+name+'-'+inx"
                    >{{dateInfo['clerk']}}
                </div>
            </template>
        </b-table>
        
        <custom-pagination
            :key="'pagination-bottom-'+paginationKey"                                         
            :pages="[10,20,30]"
            :totalRows="bookings.length"
            :initCurrentPage="currentPage"
            :initItemPerPage="itemsPerPage"
            @paginationChanged="paginationChanged"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import * as _ from 'underscore';
import CustomPagination from "@/components/tabs/components/CustomComponents/CustomPagination.vue"

@Component({
    components:{  
        CustomPagination
    }
})
export default class AuditBookingTable extends Vue {

    bookingFields = [        
        {key:'date',           label:'Date',          sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:7%'},
        {key:'time',           label:'Time',          sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:10%'},
        {key:'actualTime',     label:'Actual Time',   sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:10%'},        
        {key:'courtLocation',  label:'Court Location',sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:18%'},        
        {key:'interpreterName',label:'Interpreter',   sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:17%'},
        {key:'invoiceTotal',   label:'Total',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:7%'},
        {key:'invoiceDate',    label:'Invoice Date',  sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:7%'},
        {key:'invoiceNumber',  label:'Invoice #',     sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:10%'},
        {key:'clerk',          label:'Clerk',         sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:14%'},               
    ];

    @Prop({required: true})    
    bookings!: any[];    

    @Prop({required: true})    
    name!: string;

    currentPage = 1;
    itemsPerPage = 10;// Default
    paginationKey = 0;

    public sortByDate(data){
        return _.sortBy(data, 'dateSort')
    }
    
    public sortCompare(aRow, bRow, key, sortDesc, formatter, compareOptions, compareLocale) {
        const a = aRow[0][key]
        const b = bRow[0][key]
        if (
            (typeof a === 'number' && typeof b === 'number') ||
            (a instanceof Date && b instanceof Date)
        ) {            
            return a < b ? -1 : a > b ? 1 : 0
        } else {           
            return this.toStringFunction(a).localeCompare(this.toStringFunction(b), compareLocale, compareOptions)
        }
    }

    public toStringFunction(value) {
        if (value === null || typeof value === 'undefined') {
            return ''
        } else if (value instanceof Object) {
            return Object.keys(value)
            .sort()
            .map(key => this.toStringFunction(value[key]))
            .join(' ')
        } else {
            return String(value)
        }
    }

    public paginationChanged(currentPage, itemsPerPage){
        this.currentPage = currentPage
        this.itemsPerPage = itemsPerPage
        this.paginationKey++;
    }
}
</script>