<template>
    <div v-if="dataReady" :key="update">
        <adm-interpreter-information :booking="booking"/>
        <adm-scheduling-information :booking="booking" :searchLocation="searchLocation"/>
        <adm-record :booking="booking" :searchLocation="searchLocation" @approved="recordsWaitingForApproval"/>
        <adm-cancellation-information v-if="bookingRecordsApproved" :booking="booking" :searchLocation="searchLocation" @saveChanges="saveRecordChanges"/>
        <adm-payment-details v-if="bookingRecordsApproved" :booking="booking"/>
        <adm-authorizations v-if="bookingRecordsApproved" :booking="booking"/>
        <adm-office-use-only v-if="bookingRecordsApproved"  :booking="booking"/>
        
        <div v-if="!bookingRecordsApproved && recordsReadyForApproval" class="text-right mr-1 mb-5">
            <b-button @click="recordsApproved" variant="warning">
                <b-icon-calendar-check class="mr-2"/>Records Approved
            </b-button>
        </div>
        
        <div style="transform:translate(-20px,70px);float:right;">
            <b-button @click="showPrintWindow=true" variant="primary">Print 
                <b-icon-printer-fill class="mx-1" variant="white" scale="1" ></b-icon-printer-fill>
            </b-button>
        </div>

        <b-modal size="xl" v-model="showPrintWindow" hide-header hide-footer>
            <div class="border-0">                
                <b-button class="mr-auto" variant="dark" @click="showPrintWindow=false">Cancel</b-button>
                <!-- <b-button class="mx-auto" variant="warning" @click="showPrintWindow=false">Email</b-button> -->
                <b-button class="float-right" variant="success" @click="savePrint">Save PDF</b-button>
            </div>
            <hr/>

            <b-card id="print" style="border:1px solid; border-radius:5px;" bg-variant="white" class="my-4 container" no-body>   
                <adm-header class="court-header"/>
                <interpreter-info />
                <scheduling-info />
                <record />
                <cancellation-info />
                <payment-details />
                <authorizations />
                <office-use-only />
            </b-card>
        </b-modal> 

    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { namespace } from "vuex-class";   
import "@/store/modules/common";
const commonState = namespace("Common");

import { bookingSearchResultInfoType } from '@/types/Bookings/json';
import { locationsInfoType } from '@/types/Common/json';

import AdmRecord from "./AdmComponents/AdmRecord.vue"
import AdmInterpreterInformation from "./AdmComponents/AdmInterpreterInformation.vue"
import AdmSchedulingInformation from "./AdmComponents/AdmSchedulingInformation.vue"
import AdmCancellationInformation from "./AdmComponents/AdmCancellationInformation.vue"
import AdmPaymentDetails from "./AdmComponents/AdmPaymentDetails.vue"
import AdmAuthorizations from "./AdmComponents/AdmAuthorizations.vue"
import AdmOfficeUseOnly from "./AdmComponents/AdmOfficeUseOnly.vue"

import AdmHeader from "./pdf/AdmHeader.vue"
import InterpreterInfo from './pdf/InterpreterInfo.vue'
import SchedulingInfo from './pdf/SchedulingInfo.vue' 
import Record from './pdf/Record.vue'
import CancellationInfo from './pdf/CancellationInfo.vue'
import PaymentDetails from './pdf/PaymentDetails.vue'
import Authorizations from './pdf/Authorizations.vue'
import OfficeUseOnly from './pdf/OfficeUseOnly.vue'

@Component({
    components:{
        AdmRecord,
        AdmInterpreterInformation,
        AdmSchedulingInformation,
        AdmCancellationInformation,
        AdmAuthorizations,
        AdmOfficeUseOnly,
        AdmPaymentDetails,
        
        AdmHeader,
        InterpreterInfo,
        SchedulingInfo,
        Record,
        CancellationInfo,
        PaymentDetails,
        Authorizations,
        OfficeUseOnly
    }
})
export default class AdmForms extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    update = 0

    @Prop({required: true})
    public searchLocation!: locationsInfoType;

    @commonState.State
    public userName!: string;

    @commonState.State
    public userRole!: string[];

    dataReady = false;
    recordsReadyForApproval = false
    
    errorMsg = ''
    showPrintWindow = false
    bookingRecordsApproved = false;

    mounted(){
        this.errorMsg =''
        this.dataReady = false;
        this.showPrintWindow = false
        this.recordsReadyForApproval = false  
        this.extractInfo()     
    }

    public extractInfo(){
        console.log(this.booking)        
        const languages =[]
        const levels: number[] = []
        const cancelledLanguages =[]
        const cancelledLevels = []
        for(const date of this.booking.dates){
            for(const lang of date.languages)
                if(date.status != 'Cancelled'){
                    if(!languages.includes(lang.language))
                        languages.push(lang.language)
                    if(!levels.includes(lang.level))
                        levels.push(lang.level)
                }else{
                    if(!cancelledLanguages.includes(lang.language))
                        cancelledLanguages.push(lang.language)
                    if(!cancelledLevels.includes(lang.level))
                        cancelledLevels.push(lang.level)
                }
        }

        this.booking.language= languages.length>0? languages.join(', '):cancelledLanguages.join(', ')
        this.booking.level= levels.length>0? Math.min(...levels) : Math.min(...cancelledLevels)
        this.booking.multipleLanguages=languages.length>0? (languages.length>1? "Yes" :"No") :(cancelledLanguages.length>1? "Yes" :"No")

        this.bookingRecordsApproved = this.booking.recordsApproved? true : false;
        this.dataReady = true;
    }

    
    public recordsWaitingForApproval(approved, records){
        if(this.userRole.includes('super-admin')){ //TODO
            this.recordsReadyForApproval=true;            
            this.booking.dates = JSON.parse(JSON.stringify(records))
            console.log(this.booking)
            if(approved==false) this.bookingRecordsApproved = false;
        }
    }

    public recordsApproved(){
        this.booking.recordsApproved = true;
        this.booking.approverName = this.userName;
        this.saveBooking(this.booking)        
    }

    public saveRecordChanges(records){
        this.booking.dates = JSON.parse(JSON.stringify(records))
        this.saveBooking(this.booking)
    }

    public saveBooking(booking){        
            
        this.$http.put('/booking/' + booking.id, booking)
        .then((response) => {                        
            console.log(this.booking)
            this.bookingRecordsApproved = true;
            //TODO 
            
            this.update++;                      
        },(err) => {
            // console.log(err.response.data.detail)
            this.errorMsg=err.response.data.detail
        });               
    }

    public savePrint() { 
        
        const el= document.getElementById("print");

        const bottomLeftText = `" ADM 322 ";`;
        const bottomRightText = `" "`;        
        
        const url = '/adm/pdf' 
        
        const pdfhtml = Vue.filter('printPdf')(el.innerHTML, bottomLeftText, bottomRightText );

        const body = {
            'html':pdfhtml,            
        }       
        
        const options = {
            responseType: "blob",
            headers: {
            "Content-Type": "application/json",
            }
        }  

        this.$http.post(url,body, options)
        .then(res => {                       
            const blob = res.data;
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.download = "Adm322.pdf";
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
            //this.showPrintWindow=false 
        },err => {
            console.error(err);        
        });
    }
}
</script>
<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
