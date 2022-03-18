<template>
    <b-card class="my-5">
        <h3 class="text-dark p-0 mt-n2 mb-4">CancellationInformation</h3>
        <b-row class="my-n2">
            <b-col cols="2">                    
                <b-form-group
                    class="labels"                
                    label="Appearance Cancelled">
                    <b-form-input 
                        size="sm"
                        disabled                              
                        v-model="booking.date">
                    </b-form-input>
                </b-form-group>
            </b-col>
            
            <b-col cols="2">                    
                <b-form-group
                    class="labels"                
                    label="Time">
                    <b-form-input 
                        size="sm"
                        disabled                                        
                        v-model="booking.date">
                    </b-form-input>
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
                
            <b-col cols="3">                    
                <b-form-group
                    class="labels"                
                    label="Reason for Cancellation">
                    <b-form-input 
                        size="sm"
                        disabled                             
                        v-model="booking.date">
                    </b-form-input>
                </b-form-group>
            </b-col>

            <b-col cols="3">                    
                <b-form-group
                    class="labels"                
                    label="Cancellation Fee Applicable">
                    <b-form-input 
                        size="sm"
                        disabled                             
                        v-model="booking.date">
                    </b-form-input>
                </b-form-group>
            </b-col>

        </b-row>

        <b-row class="my-n3">
            <b-col cols="12">                    
                <b-form-group
                    class="labels"                
                    label="Notes">
                    <b-form-input 
                        size="sm"
                        disabled 
                        v-model="booking.comment">
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
export default class AdmCancellationInformation extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType;
   
    mounted(){
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