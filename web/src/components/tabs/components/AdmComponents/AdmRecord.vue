<template>
    <div v-if="dataReady">
        <b-card class="my-5">
            <h3 class="text-dark p-0 mt-n2 mb-4">Record</h3>
            <b-table
                :items="records"
                :fields="recordFields"
            >
                <template v-slot:cell(date)="data" >
                    <span>{{data.value|iso-date}}</span>
                </template>

                <template v-slot:cell(actualStartTime)="data" >                    
                    <b-form-input 
                        size="sm"
                        :disabled="data.item.recordsApproved==true"
                        @change="recordChanged(data.item)"                       
                        v-model="data.item.actualStartTime"
                        :state="data.item.actualStartTimeState">
                    </b-form-input>
                </template>

                <template v-slot:cell(finishTime)="data" > 
                    <b-form-input 
                        size="sm"
                        :disabled="data.item.recordsApproved==true"
                        @change="recordChanged(data.item)"                     
                        v-model="data.item.finishTime"
                        :state="data.item.finishTimeState">
                    </b-form-input>
                </template>

                <template v-slot:cell(approversInitials)="data" >                    
                    <b-form-input 
                        size="sm"
                        :disabled="data.item.recordsApproved==true"
                        @change="recordChanged(data.item)"                     
                        v-model="data.item.approversInitials"
                        :state="data.item.approversInitialsState">
                    </b-form-input>
                </template>

                <template v-slot:cell(federal)="data" >
                    <span>{{data.item.federalYN}}</span>
                </template>

            </b-table>
        </b-card>
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as _ from 'underscore';

import { bookingAdmInfoType, bookingSearchInfoType } from '@/types/Bookings/json';



@Component
export default class AdmRecord extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType;
    

    recordFields=[
        {key:'date',           label:'Date',              sortable:false, thStyle:' width:7%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'file',           label:'Court File Number', sortable:false, thStyle:' width:10%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'caseName',       label:'Case Name',         sortable:false, thStyle:' width:10%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'language',       label:'Language',          sortable:false, thStyle:' width:10%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'reason',         label:'Reason',            sortable:false, thStyle:' width:5%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},      
        {key:'federal',        label:'Federal',           sortable:false, thStyle:' width:5%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'prosecutor',label:'Federal Prosecutor Name',sortable:false, thStyle:' width:14%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},        
        {key:'room',           label:'Court Room',        sortable:false, thStyle:' width:7%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'time',           label:'Booking Time',      sortable:false, thStyle:' width:5%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'actualStartTime',label:'Actual Start Time', sortable:false, thStyle:' width:8%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'finishTime',     label:'Finish Time',       sortable:false, thStyle:' width:8%', cellStyle:'', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'approversInitials',label:'Approvers Initials',sortable:false,thStyle:'width:11%',cellStyle:'',thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'}
    ]
    dataReady = false;
    records: bookingAdmInfoType[] = []

    mounted(){

        this.records = []
        for(const date of this.booking.dates){
            const record: bookingAdmInfoType = JSON.parse(JSON.stringify(this.booking))            
            record.date=date.date;
            record.dateId=date.id;  
            record.actualStartTime=date.actualStartTime;
            record.actualStartTimeState=null;
            record.finishTime=date.finishTime;
            record.finishTimeState=null;
            record.approversInitials=date.approversInitials;
            record.approversInitialsState=null;
            // Vue.filter('initials')(this.booking.updated_by)

            this.records.push(record)
        }        
        this.dataReady = true;
        this.checkAllApproved()
    }

    public recordChanged(record){
        //console.log(record)
        record.actualStartTimeState = this.checkTimeFormat(record.actualStartTime);
        record.finishTimeState = this.checkTimeFormat(record.finishTime);
        const bookingDate = this.booking.dates.filter(date => date.id == record.dateId)
        if (bookingDate.length==1){
            bookingDate[0].actualStartTime = record.actualStartTimeState!=false? record.actualStartTime :'';
            bookingDate[0].finishTime = record.finishTimeState!=false? record.finishTime: '';
            bookingDate[0].approversInitials = record.approversInitials;
        } 
        this.checkAllApproved()  
    }

    public checkAllApproved(){
        //TODO
        let allApproved = true;
        for(const record of this.records){
            if(!record.actualStartTime    || record.actualStartTimeState==false ||
                !record.finishTime        || record.finishTimeState==false      ||
                !record.approversInitials || record.approversInitialsState==false
            ){
                allApproved = false;
                break;
            }        
        }

        if(allApproved) this.$emit('approved')
    }


    // public saveBooking(){        
            
    //     this.$http.put('/booking/' + this.booking.id, this.booking)
    //     .then((response) => {            
    //         if(response?.data){                
    //             this.$emit('find');                
    //         }                
    //     },(err) => {
    //         // console.log(err.response.data.detail)
    //         this.errorMsg=err.response.data.detail
    //     });               
    // } 




    public checkTimeFormat(time){
        const timeFormat =/^(2[0-3]|[01]?[0-9]):([0-5][0-9])$/; 
        
        if(time && !timeFormat.test(time)) return false
        return null
    }

}
</script>

<style scoped lang="scss">
    .card{
        background: rgb(182, 210, 221);
        box-shadow: 2px 5px 5px 2px #DDD;
    }

    .labels {
        font-size: 12px; font-weight:600; line-height: 0.025rem; color: rgb(50, 50, 50);
    }

</style>