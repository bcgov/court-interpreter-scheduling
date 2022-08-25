<template>
        <b-card :name="section_name" class="my-5">
            <h3 class="text-dark p-0 mt-n2 mb-4">Scheduling Information</h3>
            <b-row class="my-n2">
                <b-col cols="4">                    
                    <b-form-group
                        class="labels"                
                        label="Registry Location">
                        <b-form-input                             
                            size="sm"
                            disabled  
                            v-model="registryLocation">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                           
                <b-col cols="3">                    
                    <b-form-group
                        class="labels"                
                        label="Name of Interpreter Scheduling Clerk">
                        <b-form-input 
                            size="sm"
                            disabled  
                            v-model="updated_by">
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
                            v-model="createdDate">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="2">      
                    <b-form-group
                        class="labels"                
                        label="Clerk Phone">
                        <b-form-input 
                            size="sm"
                            :state="phoneState"
                            @input="phoneChanged=true"  
                            v-model="clerkPhone">
                        </b-form-input>
                        <div v-if="phoneState==false" class="subtext" >eg. 800-123-1234</div>
                    </b-form-group>
                </b-col>
                <b-col cols="1">
                    <b-button size="sm"                    
                        v-if="phoneChanged" 
                        @click="applyPhoneChanges()"                                 
                        variant="success" 
                        style="margin-top:1.65rem;"> Save 
                    </b-button>
                </b-col>                    
                
                
            </b-row>
        </b-card>       
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingSearchResultInfoType } from '@/types/Bookings/json';




@Component
export default class AdmSchedulingInformation extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType; 
    
    section_name="adm-schedule"
    
    updated_by = ""
    createdDate = ""
    clerkPhone = ""
    registryLocation = ""
    
    phoneChanged =false
    phoneState = null

    mounted(){
        this.phoneState = null
        this.phoneChanged=false
        this.updated_by = this.booking.updated_by
        this.createdDate = this.booking.createdDate
        this.clerkPhone = this.booking.clerkPhone
        this.registryLocation = this.booking.location_name
    }

    public applyPhoneChanges(){

        if(Vue.filter('verifyPhone')(this.clerkPhone)){
            this.phoneState = null
            this.phoneChanged=false
            this.$emit('saveClerkPhone',[{name:'clerkPhone', value:this.clerkPhone}], this.section_name)
        }else{
            this.phoneState =false
        }              
    }

}
</script>

<style scoped lang="scss">
    .card{
        background: rgb(182, 210, 221);
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