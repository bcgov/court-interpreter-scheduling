<template>
    <div v-if="dataReady">
        <b-row>
            <b-col cols="8">
                <h3 class="my-1 ml-2">
                    An interpreter booked in multiple sessions during one day.
                </h3>                
            </b-col>
            <b-col>
                <custom-pagination class="mt-n1"                    
                    :key="'pagination-top-'+paginationKey"                                        
                    :pages="[10,20,30]"
                    :totalRows="multiSessionInfo.length"
                    :initCurrentPage="currentPage"
                    :initItemPerPage="itemsPerPage"
                    @paginationChanged="paginationChanged"/>
            </b-col>
        </b-row>

        <b-table
            :items="multiSessionInfo"
            :fields="bookingFields"
            class="border-info"                                                
            sort-by="date"
            small
            sort-icon-left
            :sort-compare="sortCompare"
            :currentPage="currentPage"
            :perPage="itemsPerPage"                                
            responsive="sm">
            <template v-slot:cell(detail)="data">
                <b-button                     
                    size="sm"
                    v-b-tooltip.hover.noninteractive.v-warning
                    title="View Details"
                    class="px-0"
                    @click="data.toggleDetails();" 
                    variant="info">
                    <b-icon-caret-down-fill v-if="data.item['_showDetails']" />                             
                    <b-icon-caret-right-fill v-else /> 
                </b-button>                            
            </template> 
            <template v-slot:row-details="row">
                <b-card body-class="pt-2 pb-0">
                    <b-table
                        :items="row.item.dates"
                        :fields="dateFields"
                        class="border-info"                                                
                        small                             
                        responsive="sm">
                    </b-table>
                </b-card>
            </template>          
            <template v-slot:cell(invoiceTotal)="data" >
                <div>{{data.value}} $ </div>
            </template> 
             <template v-slot:cell(paidAmount)="data" >
                <b>{{data.value}} $ </b>
            </template>
            <template v-slot:cell(overpaid)="data" >
                <b class="text-danger">{{data.value}} $ </b>
            </template>          
        </b-table>
        
        <custom-pagination
            :key="'pagination-bottom-'+paginationKey"                                         
            :pages="[10,20,30]"
            :totalRows="multiSessionInfo.length"
            :initCurrentPage="currentPage"
            :initItemPerPage="itemsPerPage"
            @paginationChanged="paginationChanged"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import * as _ from 'underscore';
import moment from 'moment-timezone';
import CustomPagination from "@/components/tabs/components/CustomComponents/CustomPagination.vue"

@Component({
    components:{  
        CustomPagination
    }
})
export default class MultipleSessionBookingTable extends Vue {

    bookingFields = [
        {key:'detail',         label:'',              sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:2%'},        
        {key:'date',           label:'Date',          sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:6%'},
        {key:'courtLocation',  label:'Court Location',sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:12%'},        
        {key:'interpreterName',label:'Interpreter',   sortable:true,  cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:12%'},
        {key:'totalHours',     label:'Total Hours',   sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:6%'},        
        {key:'actualHours',    label:'Actual Hours',  sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:6%'},       
        {key:'paidAmount',     label:'Paid Amount',   sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:7%'},
        {key:'overpaid',       label:'Overpaid',      sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:6%'},   
        {key:'invoiceTotal',   label:'Invoice Total', sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:6%'},
        {key:'invoiceDate',    label:'Invoice Date',  sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:6%'},
        {key:'invoiceNumber',  label:'Invoice #',     sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:9%'},
        {key:'approver',       label:'Approver',      sortable:false, cellStyle:'', thClass:'bg-primary text-white align-middle',  tdClass:'align-middle', thStyle:'width:12%'},               
    ];

    dateFields = [        
        {key:'actualStartTime',  label:'Actual Start Time',    sortable:false,  cellStyle:'', thClass:'bg-info text-dark align-middle',  tdClass:'align-middle', thStyle:'width:15%'},        
        {key:'actualFinishTime', label:'Actual Finish Time',   sortable:false,  cellStyle:'', thClass:'bg-info text-dark align-middle',  tdClass:'align-middle', thStyle:'width:15%'},
        {key:'methodOfAppearance',label:'Method of Appearance',sortable:false,  cellStyle:'', thClass:'bg-info text-dark align-middle',  tdClass:'align-middle', thStyle:'width:20%'},
        {key:'comment',          label:'Comment',              sortable:false,  cellStyle:'', thClass:'bg-info text-dark align-middle',  tdClass:'align-middle', thStyle:'width:50%'},
    ]

    @Prop({required: true})    
    bookings!: any[];    

    multiSessionInfo =[];
    dataReady = false;
    currentPage = 1;
    itemsPerPage = 10;// Default
    paginationKey = 0;
    
    mounted(){
        this.dataReady = false;
        this.extractInfo()
        this.dataReady = true;
    }

    public extractInfo(){
        for(const booking of this.bookings){
            const timezone = booking?.location?.timezone?? 'America/Vancouver';
            for(const auditItem of booking.admDetail){
                const auditDates = booking.dates.filter( record => moment(record.date).tz(timezone).format('YYYY-MM-DD')==auditItem.date);
                this.multiSessionInfo.push({
                    dates: auditDates,
                    date: auditItem.date,
                    courtLocation: booking.location.name,
                    interpreterName: booking.interpreter.lastName +', '+ booking.interpreter.firstName,
                    totalHours: auditItem.totalHours,
                    actualHours: auditItem.actualHours,
                    paidAmount: auditItem.total,
                    overpaid: this.getOverpaidAmount(auditItem),
                    invoiceTotal: booking.invoiceTotal?? '0.00',
                    invoiceDate: booking.invoiceDate?? '-',
                    invoiceNumber: booking.invoiceNumber?? '-',
                    approver: booking.approverName?? '-',
                    "_showDetails": false
                })
            }
        } 
        console.log(this.multiSessionInfo)
    }

    public getOverpaidAmount(auditItem){
        const hr = Math.max(Number(auditItem.actualHours), 5);
        const rate = Number(auditItem.rate);
        const overpaid = (Number(auditItem.total)-(hr*rate))
        return overpaid>0 ? (overpaid.toFixed(2)) : '0.00'
    }

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