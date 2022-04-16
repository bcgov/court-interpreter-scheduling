<template>
    <div :key="update">
        <adm-interpreter-information :booking="booking"/>
        <adm-scheduling-information :booking="booking"/>
        <adm-record :booking="booking" @approved="recordsReadyForApproval=true;"/>
        <adm-cancellation-information v-if="booking.recordsApproved" :booking="booking"/>
        <adm-payment-details v-if="booking.recordsApproved" :booking="booking"/>
        <adm-authorizations v-if="booking.recordsApproved" :booking="booking"/>
        <adm-office-use-only v-if="booking.recordsApproved"  :booking="booking"/>
        
        <div v-if="!booking.recordsApproved && recordsReadyForApproval" class="text-right mr-1 mb-5">
            <b-button @click="recordsApproved" variant="warning">
                <b-icon-calendar-check class="mr-2"/>Records Approved
            </b-button>
        </div>
        
        <div style="transform:translate(-20px,70px);float:right;">
            <b-button @click="showPrintWindow=true" variant="primary">Print / Email</b-button>
        </div>

        <b-modal size="xl" v-model="showPrintWindow" header-class="none" >
            <template v-slot:modal-title>
                <b-row class="ml-1">
                    <img class="img-fluid d-none d-md-block"
                        src="@/images/bcid-logo-text-en.svg"
                        width="60"
                        height="60"                    
                        alt="B.C. Government Logo"/>
                    <div style="font-size:16pt; margin:1rem 0 0 1rem;" >COURT INTERPRETER REQUEST AND RECORD</div>
                </b-row>
            </template>

            <div class="text-center h2 my-5">PRINTING CONTENT</div>
            
            <template v-slot:modal-footer>                
                <b-button class="mr-auto" variant="dark" @click="showPrintWindow=false">Cancel</b-button>
                <b-button class="mx-auto" variant="warning" @click="showPrintWindow=false">Email</b-button>
                <b-button class="ml-auto" variant="success" @click="showPrintWindow=false">Save PDF</b-button>
            </template>
        </b-modal> 

    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingSearchInfoType } from '@/types/Bookings/json';
import AdmRecord from "./AdmComponents/AdmRecord.vue"
import AdmInterpreterInformation from "./AdmComponents/AdmInterpreterInformation.vue"
import AdmSchedulingInformation from "./AdmComponents/AdmSchedulingInformation.vue"
import AdmCancellationInformation from "./AdmComponents/AdmCancellationInformation.vue"
import AdmPaymentDetails from "./AdmComponents/AdmPaymentDetails.vue"
import AdmAuthorizations from "./AdmComponents/AdmAuthorizations.vue"
import AdmOfficeUseOnly from "./AdmComponents/AdmOfficeUseOnly.vue"

@Component({
    components:{
        AdmRecord,
        AdmInterpreterInformation,
        AdmSchedulingInformation,
        AdmCancellationInformation,
        AdmAuthorizations,
        AdmOfficeUseOnly,
        AdmPaymentDetails 
    }
})
export default class AdmForms extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType;
    update = 0

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
}
</script>
