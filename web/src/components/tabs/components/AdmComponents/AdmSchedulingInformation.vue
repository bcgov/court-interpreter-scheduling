<template>
        <b-card class="my-5">
            <h3 class="text-dark p-0 mt-n2 mb-4">Scheduling Information</h3>
            <b-row class="my-n2">
                <b-col cols="3">                    
                    <b-form-group
                        class="labels"                
                        label="Registry Location">
                        <b-form-input                             
                            size="sm"
                            disabled  
                            v-model="booking.registry">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="1">                    
                    <b-form-group
                        class="labels"                
                        label="Interpreter for">
                        <b-form-input                            
                            size="sm"
                            disabled  
                            v-model="booking.interpretFor">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="1">                    
                    <b-form-group
                        class="labels"                
                        label="Requested by">
                        <b-form-input                            
                            size="sm"
                            disabled  
                            v-model="booking.requestedBy">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="2">                    
                    <b-form-group
                        class="labels"                
                        label="Method of Appearance">
                        <b-form-input
                            size="sm"
                            disabled  
                            v-model="booking.methodOfAppearance">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="1">                    
                    <b-form-group
                        class="labels"                
                        label="Federal Matter">
                        <b-form-input                            
                            size="sm"
                            disabled
                            v-model="booking.federalYN">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="4">                    
                    <b-form-group
                        class="labels"                
                        label="Federal Prosecutor Name">
                        <b-form-input
                            size="sm"
                            disabled  
                            v-model="booking.prosecutor">
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="my-n3">
                <b-col cols="3">                    
                    <b-form-group
                        class="labels"                
                        label="Name of Interpreter Scheduling Clerk">
                        <b-form-input 
                            size="sm"
                            disabled  
                            v-model="booking.updated_by">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="2">                    
                    <b-form-group
                        class="labels"                
                        label="Clerk Phone">
                        <b-form-input 
                            size="sm"  
                            v-model="booking.clerkPhone">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="2">                    
                    <b-form-group
                        class="labels"                
                        label="Date of Booking">
                        <b-form-input 
                            size="sm"
                            disabled  
                            v-model="booking.created_at">
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
export default class AdmSchedulingInformation extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType; 

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