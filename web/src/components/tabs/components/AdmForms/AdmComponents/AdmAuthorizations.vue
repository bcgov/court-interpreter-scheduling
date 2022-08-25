<template>
    <b-card :name="section_name" v-if="dataReady" class="my-5" :key="update" >
        <h3 class="text-dark p-0 mt-n2 mb-4">Authorizations</h3>
        
        <b-row class="mt-n2 mb-2">
            <b-col cols="2">
                <b-form-checkbox 
                    class="labels"
                    @change="signingChanges($event,'interpreter')"
                    style="margin-top:1rem; line-height:1.65rem;" 
                    v-model="interpreterSigned">
                        Interpreter Signed
                </b-form-checkbox>
            </b-col>
            <b-col cols="1">                   
                <div
                    style="margin-top:1rem; line-height:1.65rem; float:right;"
                    class="labels"> Signing Date:                    
                </div>
            </b-col>
            <b-col cols="2">
                <b-form-input
                    style="margin-top:0.9rem;"
                    type="date"
                    :min="minDate"
                    :max="maxDate"
                    @input="dateChanged=true;" 
                    size="sm"                                                         
                    v-model="interpreterSigningDate">
                </b-form-input>
            </b-col>

            <b-col cols="2">
                <div class="text-center"> 
                <b-button size="sm"             
                    v-if="dateChanged" 
                    @click="saveAuthorizationChanges()"                                 
                    variant="success" 
                    style="margin:0.90rem 0 0 0; width:5rem;"> Save 
                </b-button>
                </div>
            </b-col>

            <b-col cols="2">
                <b-form-checkbox 
                    class="labels"
                    @change="signingChanges($event,'qualifiedReceiver')"
                    style="margin-top:1rem; line-height:1.65rem;" 
                    v-model="qualifiedReceiverSigned">
                        Qualified Receiver Signed
                </b-form-checkbox>
            </b-col>
            <b-col cols="1">                   
                <div
                    style="margin-top:1rem; line-height:1.65rem; float:right;"
                    class="labels"> Signing Date:                    
                </div>
            </b-col>
            <b-col cols="2">
                <b-form-input
                    style="margin-top:0.9rem;"
                    type="date"
                    disabled 
                    size="sm"                                                         
                    v-model="qualifiedReceiverSigningDate">
                </b-form-input>
            </b-col>
        </b-row>

        <b-row class="">
            <b-col cols="5">                    
                <b-form-group
                    class="labels"                
                    label="Interpreter’s Signature">
                    <b-form-input                                                                       
                        size="sm"
                        disabled                              
                        v-model="interpreterName">
                    </b-form-input>
                </b-form-group>
                <div style="margin-top:-1rem; font-size:9.75pt;">
                    I certify this is a true statement of disbursements made a entitled as a result of 
                    travel on government business as have not been and will not be reimbursed by any other party.
                </div>            
            </b-col>            
            
            <b-col cols="2"/>           

            <b-col cols="5">                    
                <b-form-group
                    class="labels"                
                    label="Qualified Receiver Name">
                    <b-form-input 
                        size="sm"
                        disabled                             
                        v-model="qualifiedReceiverName">
                    </b-form-input>
                </b-form-group>
            </b-col>            
        </b-row>              
    </b-card>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment-timezone'
import { bookingSearchResultInfoType } from '@/types/Bookings/json';

import { namespace } from "vuex-class";   
import "@/store/modules/common";
const commonState = namespace("Common");

@Component
export default class AdmAuthorizations extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;

    @commonState.State
    public userName!: string;

    section_name="adm-authorization"

    dataReady = false;
    dateChanged = false;
    update=1;
    maxDate="2025-01-01"
    minDate="2022-01-01"

    interpreterName = ""
    interpreterSigned = false    
    interpreterSigningDate = ""
    qualifiedReceiverSigned = false
    qualifiedReceiverName = ""
    qualifiedReceiverSigningDate =""
    
        
   
    mounted(){
        this.dataReady = false;
        this.dateChanged = false; 
        this.extractInfo();
        this.dataReady = true;
    }

    public extractInfo(){
        this.interpreterSigned = this.booking.interpreterSigned
        this.interpreterName = this.interpreterSigned? this.booking.interpreter.fullName :''
        this.interpreterSigningDate = this.interpreterSigned? this.booking.interpreterSigningDate :''

        this.qualifiedReceiverSigned = this.booking.qualifiedReceiverSigned
        this.qualifiedReceiverSigningDate =this.qualifiedReceiverSigned? this.booking.qualifiedReceiverSigningDate :''
        this.qualifiedReceiverName = this.qualifiedReceiverSigned? this.booking.approverName:''
        this.maxDate = moment().add(3,'year').format("YYYY-MM-DD")
    }

    public signingChanges(checked, name){
        
        if(name=='interpreter'){
            if(checked){
                this.interpreterSigningDate = moment().format("YYYY-MM-DD")
                this.interpreterName = this.booking.interpreter.fullName                
            }
            else{
                this.interpreterSigningDate =''
                this.interpreterName = ''
            }
        }
        else if(name=='qualifiedReceiver'){
            if(checked){
                this.qualifiedReceiverSigningDate = moment().format("YYYY-MM-DD")
                this.qualifiedReceiverName = this.booking.approverName
            }
            else{
                this.qualifiedReceiverSigningDate =''
                this.qualifiedReceiverName =''
            }
        }        
        this.update++
        this.dateChanged = true;
    }

    public saveAuthorizationChanges(){
        this.dateChanged = false;
        if(this.interpreterSigningDate < this.minDate || this.interpreterSigningDate > this.maxDate)
            this.interpreterSigningDate=''
        const authorizationChanges =[
            {name:'interpreterSigned', value:this.interpreterSigned},    
            {name:'interpreterSigningDate', value:this.interpreterSigningDate},
            {name:'qualifiedReceiverSigned', value:this.qualifiedReceiverSigned},            
            {name:'qualifiedReceiverSigningDate', value:this.qualifiedReceiverSigningDate}
        ]
        this.$emit('saveAuthorizations',authorizationChanges, this.section_name)
    }

}
</script>

<style scoped lang="scss">
    .card{
        background: rgb(182, 210, 221);
        box-shadow: 2px 5px 5px 2px #DDD;
    }

    .labels {
        font-size: 12px; 
        font-weight:600; 
        line-height: 0.025rem; 
        color: rgb(50, 50, 50);
        margin-top: 1rem;        
    }

</style>