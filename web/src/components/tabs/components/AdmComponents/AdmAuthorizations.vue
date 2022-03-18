<template>
    <b-card v-if="dataReady" class="my-5" >
        <h3 class="text-dark p-0 mt-n2 mb-4">Authorizations</h3>
        <b-row class="my-n2">
            <b-col cols="5">                    
                <b-form-group
                    class="labels"                
                    label="Interpreter’s Signature">
                    <b-form-textarea                        
                        rows="3"                        
                        size="sm"
                        disabled                              
                        v-model="booking.interpreter['sign']">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
            
            
            <b-col cols="2">                    
                <b-form-group
                    class="labels"                
                    label="Date">
                    <b-form-input 
                        size="sm"
                        disabled                                      
                        v-model="booking.date">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="2"></b-col>

            <b-col cols="3">                    
                <b-form-group
                    class="labels"                
                    label="Qualified Receiver">
                    <b-form-input 
                        size="sm"
                        disabled                             
                        v-model="booking.date">
                    </b-form-input>
                </b-form-group>
            </b-col>

        </b-row>              
    </b-card>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingSearchInfoType } from '@/types/Bookings/json';

@Component
export default class AdmAuthorizations extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType;
    dataReady = false;
   
    mounted(){
        this.dataReady = false;
        this.booking.interpreter['sign'] = "I certify this is a true statement of disbursements made a entitled as a result of travel on government business as have not been and will not be reimbursed by any other party"
        this.dataReady = true;
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