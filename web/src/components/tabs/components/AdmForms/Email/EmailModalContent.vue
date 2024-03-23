<template>
    <b-card v-if="dataReady" style="border:none;" bg-variant="white">
        <b-row>
            <b-col>				
                <b-form-group class="mr-1"><label for="recipient">To<span class="text-danger">*</span></label>
                    <b-form-input id="recipient" type="email" v-model="emailContent.to" placeholder="Enter Recipient" :state="recipientState?null:false"></b-form-input>
                    <div v-if="!recipientState" class="text-danger">Please enter a valid email address(es), separated by a comma (",").</div>
                </b-form-group>        
            </b-col>        
        </b-row>
        <b-row>					
            <b-col>				
                <b-form-group class="mr-1"><label for="subject">Subject<span class="text-danger">*</span></label>
                    <b-form-input id="subject" v-model="emailContent.subject" placeholder="Enter Subject" :state = "subjectState?null:false"></b-form-input>
                </b-form-group>        
            </b-col>					
        </b-row>
        <b-row>					
            <b-col>				
                <b-form-group class="mr-1"><label for="email-body">Content<span class="text-danger">*</span></label>
                    <b-form-textarea
                        id="email-body"
                        v-model="emailContent.body" 
                        placeholder="Enter Content"
                        rows="10" 
                        :state = "contentState?null:false"></b-form-textarea>
                </b-form-group>        
            </b-col>					
        </b-row>
        <email-button-bar :pdfType="pdfType" position="bottom" :printingPDF="false"  @savePrint="sendEmail" @closePrint="closeEmail" />				
    </b-card>          
                 
</template>

<script lang="ts">
import { bookingSearchResultInfoType, sentEmailContentInfoType } from '@/types/Bookings/json';
import { Component, Vue, Prop } from 'vue-property-decorator';
import EmailButtonBar from './EmailButtonBar.vue'
import { namespace } from "vuex-class";   
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
    components:{
        EmailButtonBar
    }
})
export default class EmailModalContent extends Vue {
    
    @Prop({required: true})
    emailContent!: sentEmailContentInfoType;
    
    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    
    @Prop({required: true})
    pdfType!: string;

    @commonState.State
    public userName!: string;

    @commonState.State
    public userEmail!: string;

    recipientState = true;
    subjectState = true;
    contentState = true;
    interpreterName = '';
    interpreterEmail = ''
    dataReady = false
    
    mounted(){
        this.dataReady = false
        this.interpreterName = this.booking?.interpreter?.fullName
        this.interpreterEmail = this.booking?.interpreter?.email
        this.emailContent.to = this.interpreterEmail
        this.emailContent.subject =`Court Interpreter's ADM ${this.pdfType}`
        this.emailContent.body = this.getAdmEmailBody()
        this.dataReady = true
    }

    public getAdmEmailBody(){
        let body = ''
        if(this.pdfType=='Invoice')
            body = `Please find the attachment, a copy of the Invoice for your court interpreting session.\nIf you see any issues in the information, please let me know through email at '${this.userEmail}'.`
        else{
            body = `Please find attached, a copy of the invoice as a confirmation for your booking.\nIf you have any questions or concerns, please contact me at '${this.userEmail}'.`
        }
        
        return  `Dear ${this.interpreterName}, \n\n${body}\n\nRegards,\n${this.userName}\n${this.userEmail}\nCourt Services Branch`
    }

    public sendEmail(){
        if(this.checkErrors())
            this.$emit('sendEmail', true)
    }

    public closeEmail(){
        this.$emit('close')
    }

    public checkErrors(){
        this.recipientState = this.verifyEmails();
        this.subjectState = !!this.emailContent.subject;
        this.contentState = !!this.emailContent.body;
        return this.recipientState && this.subjectState && this.contentState
    }

    public verifyEmails(){
        const emails = this.emailContent?.to?.replace(/\s+/g,'').split(',')
        for(const email of emails){
            if(!Vue.filter('verifyEmail')(email))
                return false
        }
        return true
    }
   
}
</script>

<style scoped lang="scss">
    label{
        font-size: 15pt;
        font-weight: 600;
    }
    textarea{
        font-size: 14pt;
    }
    input{
        font-size: 14pt;
    }
</style>