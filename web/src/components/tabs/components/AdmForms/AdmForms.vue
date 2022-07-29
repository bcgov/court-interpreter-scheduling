<template>
    <div>
        <loading-spinner color="#000" v-if="!dataReady" waitingText="Loading ..." />
        
        <div v-else :key="update">
             
            <adm-interpreter-information :booking="booking"/>
            <adm-scheduling-information :booking="booking" :searchLocation="searchLocation" @saveClerkPhone="saveBookingFields"/>
            <adm-record :booking="booking" :searchLocation="searchLocation" @approved="recordsWaitingForApproval"/>
            <adm-cancellation-information v-if="bookingRecordsApproved" :booking="booking" :searchLocation="searchLocation" @saveChanges="saveRecordChanges"/>
            <adm-payment-details v-if="bookingRecordsApproved" :booking="booking" @savePaymentDetail="saveBookingFields"/>
            <adm-authorizations v-if="bookingRecordsApproved" :booking="booking" @saveAuthorizations="saveBookingFields"/>
            <adm-office-use-only v-if="bookingRecordsApproved"  :booking="booking" @saveOfficeUse="saveBookingFields"/>
            
            
            <div v-if="!bookingRecordsApproved && recordsReadyForApproval" class="text-right mr-1 mb-5">
                <b-button @click="recordsApproved" variant="warning">
                    <b-icon-calendar-check class="mr-2"/>Records Approved
                </b-button>
            </div>

            <b-alert name='alert-msg' style="margin-top:0.8rem" variant="danger" :show="errorMsg !=''"  >Error: {{errorMsg}}</b-alert>           
            
            <div style="transform:translate(-20px,70px);float:right;">
                <b-button @click="errorMsg='';showPrintWindow=true" variant="primary">Print 
                    <b-icon-printer-fill class="mx-1" variant="white" scale="1" ></b-icon-printer-fill>
                </b-button>
            </div>

            <b-modal size="xl" v-model="showPrintWindow" hide-header hide-footer>
                <div class="border-0">                
                    <b-button class="mr-auto" variant="dark" @click="showPrintWindow=false"><span style="font-size: 18px;">Cancel</span></b-button>
                    <!-- <b-button class="mx-auto" variant="warning" @click="showPrintWindow=false">Email</b-button> -->
                    <b-button class="float-right" variant="success" @click="savePrint" :disabled="printingPDF">                    
                        <spinner color="#FFF" v-if="printingPDF" style="margin:0; padding: 0; height:1.9rem; transform:translate(0px,-25px);"/>
                        <span style="font-size: 18px;" v-else>Save PDF</span>
                    </b-button>
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
                <hr/>
                <div class="border-0">                
                    <b-button class="mr-auto" variant="dark" @click="showPrintWindow=false"><span style="font-size: 18px;">Cancel</span></b-button>
                    <!-- <b-button class="mx-auto" variant="warning" @click="showPrintWindow=false">Email</b-button> -->
                    <b-button class="float-right" variant="success" @click="savePrint" :disabled="printingPDF">                    
                        <spinner color="#FFF" v-if="printingPDF" style="margin:0; padding: 0; height:1.9rem; transform:translate(0px,-25px);"/>
                        <span style="font-size: 18px;" v-else>Save PDF</span>
                    </b-button>
                </div>
            </b-modal> 

        </div>   

    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { namespace } from "vuex-class";   
import "@/store/modules/common";
const commonState = namespace("Common");

import { bookingSearchResultInfoType } from '@/types/Bookings/json';
import { locationsInfoType } from '@/types/Common/json';

import Spinner from '@/components/utils/Spinner.vue'

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
        Spinner,
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
    bookingId!: number;

    @Prop({required: true})
    public searchLocation!: locationsInfoType;

    booking = {} as bookingSearchResultInfoType;
    update = 0

    @commonState.State
    public userName!: string;

    @commonState.State
    public userRole!: string[];

    dataReady = false;
    recordsReadyForApproval = false
    printingPDF=false
    errorMsg = ''
    showPrintWindow = false
    bookingRecordsApproved = false;

    mounted(){
        this.printingPDF=false        
        this.recordsReadyForApproval = false  
        this.getBooking()
    }

    public getBooking(){
        this.errorMsg =''
        this.dataReady = false;
        this.showPrintWindow = false

        this.$http.get('/booking/' + this.bookingId)
        .then((response) => {
            if(response.data){
                this.booking = JSON.parse(JSON.stringify(response.data))
                this.extractInfo()
            }                           
        },(err) => {                        
            this.errorMsg=err.response.data.detail
            this.dataReady = true;
            Vue.filter('scrollToLocation')('alert-msg')
        });               
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

        
        
        const interp = this.booking.interpreter
        interp.fullName = Vue.filter("fullName")(interp.firstName, interp.lastName)
        interp.fullAddress = Vue.filter('fullAddress')(interp.address, interp.city, interp.province, interp.postal)
        
        this.booking.createdDate = Vue.filter('iso-date')(this.booking.created_at)
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
            if(approved==false){ 
                this.bookingRecordsApproved = false;
                this.saveBookingFields([{name:'recordsApproved', value:false}])
            }
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

    public saveBookingFields(fields){
        for(const field of fields){
            this.booking[field.name] = field.value
        }
        this.saveBooking(this.booking)
    }

    public saveBooking(booking: bookingSearchResultInfoType){
        this.errorMsg =''
        this.$http.put('/booking/adm/' + booking.id, booking)
        .then((response) => {                                    
            this.getBooking(); //TODO add
            //this.update++;//TODO remove
            //this.bookingRecordsApproved=true; //TODO remove
        },(err) => {            
            this.errorMsg=err.response.data.detail
            Vue.filter('scrollToLocation')('alert-msg')
        });               
    }    

    public savePrint() {

        this.printingPDF=true;
        const el= document.getElementById("print");
        const bottomLeftText = `" ADM 322 ";`;
        const bottomRightText = `" "`;
        const url = '/adm/pdf'
        const pdfhtml = Vue.filter('printPdf')(el.innerHTML, bottomLeftText, bottomRightText );

        const body = {
            'html':pdfhtml,
            'booking_id':this.bookingId
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
            this.printingPDF=false
            //this.showPrintWindow=false 
        },err => {
            // console.error(err);
            this.showPrintWindow=false
            this.printingPDF=false 
            const reader = new FileReader();
            reader.readAsText(err.response.data)
            reader.onload = ()=> this.errorMsg = JSON.parse(String(reader.result))["detail"];
            Vue.filter('scrollToLocation')('alert-msg')                   
        });
    }
}
</script>
<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
