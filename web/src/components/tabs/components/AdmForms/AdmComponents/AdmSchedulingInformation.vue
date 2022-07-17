<template>
        <b-card class="my-5">
            <h3 class="text-dark p-0 mt-n2 mb-4">Scheduling Information</h3>
            <b-row class="my-n2">
                <b-col cols="4">                    
                    <b-form-group
                        class="labels"                
                        label="Registry Location">
                        <b-form-input                             
                            size="sm"
                            disabled  
                            v-model="searchLocation.name">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                           
                <b-col cols="4">                    
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
                            v-model="booking['createdDate']">
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-card>       
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingSearchInfoType } from '@/types/Bookings/json';
import { locationsInfoType } from '@/types/Common/json';



@Component
export default class AdmSchedulingInformation extends Vue {

    @Prop({required: true})
    booking!: bookingSearchInfoType; 

    @Prop({required: true})
    public searchLocation!: locationsInfoType;

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