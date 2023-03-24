<template>
    <div>
        <loading-spinner color="#000" v-if="!dataReady" waitingText="Loading ..." />
        
        <div v-else :key="update">
            
            <adm-interpreter-information :booking="booking"/>
            <adm-scheduling-information :booking="booking" @saveClerkPhone="saveBookingFields"/>
            <adm-record :booking="booking" @approved="recordsWaitingForApproval"/>
            <adm-sent-form-info v-if="formEmailed" :booking="booking" />
            <adm-cancellation-information v-if="bookingRecordsApproved" :booking="booking" @saveChanges="saveRecordChanges"/>
            <adm-payment-details v-if="bookingRecordsApproved" :booking="booking" :form="paymentDetailsForm" @savePaymentDetail="saveBookingFields" @cancelChanges="getBooking()" @change="paymentChanged"/>
            <adm-authorizations  v-if="bookingRecordsApproved" :booking="booking" @saveAuthorizations="saveBookingFields"/>
            <adm-office-use-only v-if="bookingRecordsApproved" :booking="booking" @saveOfficeUse="saveBookingFields"/>
            <adm-sent-invoice-info v-if="invoiceEmailed" :booking="booking" />
            
            <div v-if="!bookingRecordsApproved && recordsReadyForApproval" class="text-right mr-1 mb-5">
                <b-button @click="IApproveAllRecords(true)" variant="warning">
                    I approve all Records<b-icon-calendar-check class="ml-2"/>
                </b-button>
            </div>

            <b-alert name='alert-msg' style="margin-top:0.8rem" variant="danger" :show="errorMsg !=''"  >Error: {{errorMsg}}</b-alert>           
            
            <div style="transform:translate(-20px,70px);float:right;">
                <div v-b-tooltip.hover.top.v-danger
                    :title="disablePrint?'Save changes first':''">
                    <b-button 
                        :disabled="disablePrint"                        
                        @click="errorMsg='';showPrintWindow=true;" 
                        variant="primary">
                        <b-icon-printer-fill class="mx-1" variant="white" scale="1"/> Print / Email 
                    </b-button>
                </div>
            </div>

            <b-modal size="xl" v-model="showPrintWindow" hide-header hide-footer>
                <button-bar :pdfType="pdfType" position="top" :printingPDF="printingPDF" @savePrint="savePrint" @closePrint="showPrintWindow=false" />
                <b-card id="print" style="border:1px solid; border-radius:5px;" bg-variant="white" class="my-4 container" no-body>   
                    <adm-header :booking="booking" class="court-header"/>
                    <interpreter-info :booking="booking"/>
                    <scheduling-info :booking="booking" />
                    <record :booking="booking" :lastPageAdmItemsNum="lastPageAdmItemsNum"/>
                    <cancellation-info :booking="booking" :lastPageAdmItemsNum="lastPageAdmItemsNum"/>
                    <payment-details :booking="booking" :form="paymentDetailsForm"/>
                    <authorizations :booking="booking"/>
                    <office-use-only :booking="booking"/>
                </b-card>
                <button-bar :pdfType="pdfType" position="bottom" :printingPDF="printingPDF" @savePrint="savePrint" @closePrint="showPrintWindow=false" />
            </b-modal>

            <b-modal size="xl" v-model="showSentEmail" title-class="h1 text-success" ok-only title="Email Sent Successfully">
                <sent-email-content :emailContent="emailContent" />                
            </b-modal> 

        </div>   

    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import * as _ from 'underscore';

import { namespace } from "vuex-class";   
import "@/store/modules/common";
const commonState = namespace("Common");

import { bookingSearchResultInfoType, calculationVars, sentEmailContentInfoType } from '@/types/Bookings/json';


import Spinner from '@/components/utils/Spinner.vue'

import AdmRecord from "./AdmComponents/AdmRecord.vue"
import AdmInterpreterInformation from "./AdmComponents/AdmInterpreterInformation.vue"
import AdmSchedulingInformation from "./AdmComponents/AdmSchedulingInformation.vue"
import AdmSentFormInfo from "./AdmComponents/AdmSentFormInfo.vue"
import AdmCancellationInformation from "./AdmComponents/AdmCancellationInformation.vue"
import AdmPaymentDetails from "./AdmComponents/AdmPaymentDetails.vue"
import AdmAuthorizations from "./AdmComponents/AdmAuthorizations.vue"
import AdmOfficeUseOnly from "./AdmComponents/AdmOfficeUseOnly.vue"
import AdmSentInvoiceInfo from "./AdmComponents/AdmSentInvoiceInfo.vue"
import ButtonBar from './AdmComponents/ButtonBar.vue'
import SentEmailContent from './AdmComponents/SentEmailContent.vue'

import AdmHeader from "./pdf/AdmHeader.vue"
import InterpreterInfo from './pdf/InterpreterInfo.vue'
import SchedulingInfo from './pdf/SchedulingInfo.vue' 
import Record from './pdf/Record.vue'
import CancellationInfo from './pdf/CancellationInfo.vue'
import PaymentDetails from './pdf/PaymentDetails.vue'
import Authorizations from './pdf/Authorizations.vue'
import OfficeUseOnly from './pdf/OfficeUseOnly.vue'

import {getTotalInterpretingHours} from './AdmCalculations/TotalInterpretingHours'
import {travelInformation} from './AdmCalculations/TravelInfo'
import {paymentDetails} from './AdmCalculations/PaymentCalculation'
import {cancellationCalculation} from './AdmCalculations/CancellationCalculation'
import {paymentDetailsInfoType} from '@/types/Bookings';
import { locationsInfoType } from '@/types/Common/json';


@Component({
    components:{
        Spinner,
        AdmRecord,
        AdmInterpreterInformation,
        AdmSchedulingInformation,
        AdmSentFormInfo,
        AdmCancellationInformation,
        AdmAuthorizations,
        AdmOfficeUseOnly,
        AdmPaymentDetails,
        AdmSentInvoiceInfo,
        ButtonBar,
        SentEmailContent,

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


    booking = {} as bookingSearchResultInfoType;
    update = 0

    @commonState.State
    public userName!: string;

    @commonState.State
    public userRole!: string[];

    @commonState.State
    public courtLocations!: locationsInfoType[];

    paymentDetailsForm = {} as paymentDetailsInfoType

    dataReady = false;
    recordsReadyForApproval = false
    printingPDF=false
    formEmailed=false
    invoiceEmailed=false
    pdfType=''
    errorMsg = ''
    showPrintWindow = false
    bookingRecordsApproved = false;
    sectionName=''
    emailContent = {} as sentEmailContentInfoType
    showSentEmail = false
    disablePrint=false

    lastPageAdmItemsNum = {num:0}

    mounted(){
        this.printingPDF=false        
        this.recordsReadyForApproval = false  
        this.getBooking()
    }

    public getBooking(){
        this.errorMsg =''
        this.dataReady = false;
        this.showPrintWindow = false
        this.disablePrint=false
        

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
        // console.log(this.booking)        
        const languages =[]
        const levels: number[] = []
        const cancelledLanguages =[]
        const cancelledLevels = []
        this.paymentDetailsForm = {} as paymentDetailsInfoType
        let recordApprovalRequired = false;
        for(const date of this.booking.dates){
            for(const bookingcase of date.cases)
                if(date.status != 'Cancelled'){
                    if(!languages.includes(bookingcase.language.languageName))
                        languages.push(bookingcase.language.languageName)
                    if(!levels.includes(bookingcase.language.level))
                        levels.push(bookingcase.language.level)
                }else{
                    if(!cancelledLanguages.includes(bookingcase.language.languageName))
                        cancelledLanguages.push(bookingcase.language.languageName)
                    if(!cancelledLevels.includes(bookingcase.language.level))
                        cancelledLevels.push(bookingcase.language.level)
                }
            if(date.status=='Booked') recordApprovalRequired = true;
        }        
        
        const interp = this.booking.interpreter
        interp.fullName = Vue.filter("fullName")(interp.firstName, interp.lastName)
        interp.fullAddress = Vue.filter('fullAddress')(interp.address, interp.city, interp.province, interp.postal)
        
        this.booking.createdDate = Vue.filter('iso-date')(this.booking.created_at)
        this.booking.language= languages.length>0? languages.join(', '):cancelledLanguages.join(', ')
        this.booking.level= levels.length>0? Math.min(...levels) : Math.min(...cancelledLevels)
        this.booking.multipleLanguages=languages.length>0? (languages.length>1? "Yes" :"No") :(cancelledLanguages.length>1? "Yes" :"No")

        this.bookingRecordsApproved = this.booking.recordsApproved? true : false;

        let saveRequired = false

        if(recordApprovalRequired == false && this.bookingRecordsApproved == false){
            this.IApproveAllRecords(false)
            saveRequired = true;
        }

        if(this.bookingRecordsApproved){
            saveRequired = this.getpaymentDetailsForm(false)            
        }
        
        this.getEmailStatus()
        
        this.dataReady = this.getInvoiceInfo(saveRequired)
        Vue.filter('scrollToLocation')(this.sectionName)
    }


    public recordsWaitingForApproval(approved, saveChanges, records){
        // console.log(approved)
        this.disablePrint=false        
        this.recordsReadyForApproval=true;            
        this.booking.dates = JSON.parse(JSON.stringify(records))
        // console.log(this.booking)
        if(approved==false){ 
            this.recordsReadyForApproval=false;
            this.bookingRecordsApproved = false;
            if(saveChanges)
                this.saveBookingFields([{name:'recordsApproved', value:false}],'adm-schedule')
        }        
    }


    public getInvoiceInfo(saveRequired){
        
        let sortedDates = [];
        let location = [];

        if(!this.booking.invoiceDate || !this.booking.invoiceNumber){
            let dates = this.booking.dates.filter(date => date.status=='Booked')
            if(dates.length==0) dates = this.booking.dates.filter(date => date.status=='Cancelled')
            sortedDates = _.sortBy(dates,'date')
        }

        if(!this.booking.invoiceDate && sortedDates.length>0){
            const lenDates = sortedDates.length
            const invoiceDate = sortedDates[lenDates-1]?.date?.slice(0,10)       
            this.booking.invoiceDate = invoiceDate 
            saveRequired = true;                   
        }

        if((!this.booking.location_name || !this.booking.invoiceNumber) && this.booking.location_id){
            location = this.courtLocations.filter(loc => loc.id==this.booking.location_id)
        }

        if(!this.booking.location_name && location.length==1){
            this.booking.location_name = location[0].name;
        }

        if(!this.booking.invoiceNumber && sortedDates.length>0 && location.length==1){                        
            const firstBookingDate = sortedDates[0]?.date?.slice(0,10)
            this.createInvoiceNumber(location[0],firstBookingDate)
            return false                 
        }

        if(saveRequired){
            this.saveBooking(this.booking)
            return false
        }
        
        return true
    }


    public createInvoiceNumber(location: locationsInfoType, date:string){
        const locationCode = ''; //location.shortDescription
        const firstBookingDate = moment(date).format("DDMMMYY").toUpperCase()        
        //__Name
        let name=''
        const first = this.booking.interpreter.firstName
        const last = this.booking.interpreter.lastName
        if(last?.length>=3 && first?.length>=1)
            name = last.slice(0,3)+first.slice(0,1)
        else if(last?.length>=2 && first?.length>=2)
            name = last.slice(0,2)+first.slice(0,2)
        else if((!last || last?.length==0) && first?.length>=2)
            name = first.slice(0,4)
        else if((!first || first?.length==0) && last?.length>=2)
            name = last.slice(0,4)
        else
            name = (last+first).slice(0,4)
        
        if(name.length==3) name += '*'
        if(name.length==2) name += '**'

        const invoiceNumber = (locationCode+name+firstBookingDate).toUpperCase()        
        // console.log(invoiceNumber)
        // console.log(this.bookingId)

        this.$http.get('/booking/invoice-number/' + invoiceNumber)
        .then((response) => {
            if(response.data){
                // console.log(response.data)
                if(response.data.length>0){
                    const currentIndices = response.data.map(booking => Number(booking.invoiceNumber?.split('#')[1]))
                    const maxIndex = Math.max(...currentIndices)
                    // console.log(currentIndices)
                    // console.log(maxIndex)
                    this.booking.invoiceNumber = invoiceNumber+'#'+(maxIndex+1)
                }
                else{
                    this.booking.invoiceNumber = invoiceNumber+'#1'
                }
                this.saveBooking(this.booking)               
            }
            else
                this.dataReady = true                          
        },(err) => {                        
            this.errorMsg=err.response.data.detail
            this.dataReady = true            
        });
    }


    public getpaymentDetailsForm(saveIfRequired){
        this.paymentDetailsForm = paymentDetails(this.booking)
        let saveRequired = false;
        if(this.booking.expenseGST != Number(this.paymentDetailsForm.GSTifApplic)){
            this.booking.expenseGST = Number(this.paymentDetailsForm.GSTifApplic)
            saveRequired = true;
        }
        if(this.booking.expenseTotal != Number(this.paymentDetailsForm.totalExpenses)){
            this.booking.expenseTotal = Number(this.paymentDetailsForm.totalExpenses)
            saveRequired = true;
        }
        if(this.booking.feesGST != Number(this.paymentDetailsForm.feesGST)){
            this.booking.feesGST = Number(this.paymentDetailsForm.feesGST)
            saveRequired = true;
        }
        if(this.booking.feesTotal != Number(this.paymentDetailsForm.feesTotal)){
            this.booking.feesTotal = Number(this.paymentDetailsForm.feesTotal)
            saveRequired = true;
        }

        if(this.booking.invoiceTotal != Number(this.paymentDetailsForm.totalPayable)){
            this.booking.invoiceTotal = Number(this.paymentDetailsForm.totalPayable)
            saveRequired = true;
        }
        
        // console.log(this.booking.expenseGST)
        // console.log(this.booking.expenseTotal)
        // console.log(this.booking.feesGST)
        // console.log(this.booking.feesTotal)
        // console.log(this.booking.invoiceTotal)
        // console.log("Saving Fees Required",saveRequired)
        if(saveRequired && saveIfRequired)
            this.saveBooking(this.booking)
        return saveRequired
    }

    public IApproveAllRecords(save){
        this.calculations()
        this.booking.recordsApproved = true;
        this.booking.approverName = this.userName;
        if(save)
            this.saveBooking(this.booking)        
    }

    public calculations(){
        const calculations = {} as calculationVars;
        calculations.cancellation = cancellationCalculation(this.booking)
        calculations.totalInterpretingHours = getTotalInterpretingHours(this.booking)
        calculations.travelInformation = travelInformation(this.booking)

        const admDetail = this.booking.admDetail? JSON.parse(JSON.stringify(this.booking.admDetail)) :{}
        admDetail.calculations = calculations
        this.booking.admDetail = admDetail
    }

    public saveRecordChanges(records, section_name){
        this.sectionName = section_name
        this.booking.dates = JSON.parse(JSON.stringify(records))
        this.getpaymentDetailsForm(false)
        this.saveBooking(this.booking)
    }

    public saveBookingFields(fields, section_name){
        this.sectionName = section_name
        for(const field of fields){
            this.booking[field.name] = field.value
        }
        if(section_name=='adm-payment') 
            this.getpaymentDetailsForm(false)
        this.saveBooking(this.booking)
    }

    public saveBooking(booking: bookingSearchResultInfoType){
        this.errorMsg =''
        this.$http.put('/booking/adm/' + booking.id, booking)
        .then((response) => {                                    
            this.getBooking();
        },(err) => {            
            this.errorMsg=err.response.data.detail
            Vue.filter('scrollToLocation')('alert-msg')
        });               
    }    

    public savePrint(email) {

        this.showSentEmail = false
        this.printingPDF=true;
        const el= document.getElementById("print");
        const bottomLeftText = `" ADM 322 ";`;
        const bottomRightText = `" "`;
        const url = '/adm/pdf?email='+(email?'true':'false')
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
            if(!email){                      
                const blob = res.data;
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.download = "Adm322.pdf";
                link.click();
                setTimeout(() => URL.revokeObjectURL(link.href), 1000);
            }else{
                const reader = new FileReader();
                reader.readAsText(res.data)
                reader.onload = ()=> {
                    this.emailContent=JSON.parse(String(reader.result))
                    // console.log(this.emailContent)
                    this.showSentEmail = true
                }
                this.printingPDF=false;
                this.sectionName = 'adm-email'
                this.getBooking()                
            }
            this.printingPDF=false
            this.showPrintWindow=false 
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

    public getEmailStatus(){
        if (this.booking.formSenderEmail && 
            this.booking.formSender && 
            this.booking.formSentDate && 
            this.booking.formRecipientEmail &&
            !this.bookingRecordsApproved
        )
            this.formEmailed = true;
        else
            this.formEmailed = false

        if (this.booking.invoiceSenderEmail && 
            this.booking.invoiceSender && 
            this.booking.invoiceSentDate && 
            this.booking.invoiceRecipientEmail &&
            this.bookingRecordsApproved
        )
            this.invoiceEmailed = true;
        else
            this.invoiceEmailed = false
        
        this.pdfType=this.bookingRecordsApproved?'Invoice':'Form' 
    }

    public paymentChanged(value){
        this.disablePrint=value
    }
}
</script>
<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
