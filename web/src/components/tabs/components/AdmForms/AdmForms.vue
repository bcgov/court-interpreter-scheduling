<template>
    <div :key="update">
        <adm-interpreter-information :booking="booking"/>
        <adm-scheduling-information :booking="booking" :searchLocation="searchLocation"/>
        <adm-record :booking="booking" :searchLocation="searchLocation" @approved="recordsReadyForApproval=true;"/>
        <adm-cancellation-information v-if="!booking.recordsApproved" :booking="booking" :searchLocation="searchLocation"/>
        <adm-payment-details v-if="!booking.recordsApproved" :booking="booking"/>
        <adm-authorizations v-if="booking.recordsApproved" :booking="booking"/>
        <adm-office-use-only v-if="booking.recordsApproved"  :booking="booking"/>
        
        <div v-if="!booking.recordsApproved && recordsReadyForApproval" class="text-right mr-1 mb-5">
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
                <adm-header />
                <interpreter-info />
                <scheduling-info />
                <record />
                <cancellation-info />
                <payment-details />
            </b-card>
        </b-modal> 

    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingSearchInfoType } from '@/types/Bookings/json';
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
    }
})
export default class AdmForms extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType;
    update = 0

    @Prop({required: true})
    public searchLocation!: locationsInfoType;

    recordsReadyForApproval = false
    showPrintWindow = false

    mounted(){
        this.showPrintWindow = false
        this.recordsReadyForApproval = false       
    }


    public recordsApproved(){
        this.booking.recordsApproved = true;
        this.update++;
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
