<template>
    <b-card :name="section_name"  class="my-5">
        <h3 class="text-dark p-0 mt-n2 mb-4">This <b class="text-primary">Invoice</b> has been Emailed to the interpreter.</h3>

        <b-row class="my-n2">
            <div style="width:1%" />
            <div style="width:34%">                    
                <b>Sent By:</b> {{sentBy}} 
                <div>({{senderEmail}})</div>
            </div>

            <div style="width:44%">
                <b>Recipient(s):</b> {{recipientEmail}}
            </div>

            <div style="width:12%">
                <b>Date:</b> {{sentDate|iso-date}}
                <div class="text-danger" v-if="daysago>0">
                    ( {{daysago}} days ago )
                </div>
                <div class="text-danger" v-else-if="hoursago>0">
                    ( {{hoursago}} hours ago )
                </div>
                <div class="text-danger" v-else>
                    ( {{minsago}} minutes ago )
                </div>
            </div>
            
            <div style="width:9%">
                <b>Sent File: </b>
                    <b-button size="sm" variant="transparent" class="my-0 py-0  border-0"
                    @click="viewInvoicePdf()"
                    v-b-tooltip.hover.noninteractive.left.v-success
                    title="View/Download the Sent Invoice">
                        <span style="font-size:25px; padding:0; cursor:pointer; transform:translate(3px,1px);" class="far fa-file-pdf btn-icon-left text-primary"/>
                    </b-button>
            </div>

        </b-row>
    </b-card>       
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingSearchResultInfoType } from '@/types/Bookings/json';
import moment from 'moment';



@Component
export default class AdmSentInvoiceInfo extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType; 
    
    section_name="adm-email"
    
    sentBy = ""
    sentDate = ""
    senderEmail = ""
    recipientEmail = ""
    daysago = 0
    hoursago = 0
    minsago = 0
    errorMsg=''

    mounted(){
        this.sentBy = this.booking.invoiceSender
        this.sentDate = this.booking.invoiceSentDate
        this.senderEmail = this.booking.invoiceSenderEmail
        this.recipientEmail = this.booking.invoiceRecipientEmail
        const today = moment() 
        const lastDay = moment(this.booking.invoiceSentDate)
        
        this.daysago = 0
        this.hoursago = 0
        this.minsago = 0
        this.daysago = today.diff(lastDay, 'days')
        if (this.daysago==0) this.hoursago =  today.diff(lastDay, 'hours')
        if (this.hoursago==0) this.minsago =  today.diff(lastDay, 'minutes') 
    }


    public viewInvoicePdf(){    
        
        const options = {
            responseType: "blob",
            headers: {
            "Content-Type": "application/json",
            }
        }  
        const url = '/adm/pdf/'+this.booking.id+'?type=invoice'
        
        this.$http.get(url, options)
        .then(res => {                       
            const blob = res.data;
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.download = "Adm322_invoice.pdf";
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);

        },err => {
            // console.error(err);            
            const reader = new FileReader();
            reader.readAsText(err.response.data)
            reader.onload = ()=> this.errorMsg = JSON.parse(String(reader.result))["detail"];
            Vue.filter('scrollToLocation')('alert-msg')                   
        });
    }

    
}
</script>

    
<style scoped lang="scss">
    @import "~@fortawesome/fontawesome-free/css/all.min.css";

    .card{
        background: rgb(182, 221, 213);
        box-shadow: 2px 5px 5px 2px #DDD;
    }

    .subtext{
        font-size: 11px;        
        color: red;
        //margin-top: 1rem;
        transform:translate(0,10px);
    }

    .labels {
        font-size: 12px; font-weight:600; line-height: 0.025rem; color: rgb(50, 50, 50);
    }

</style>