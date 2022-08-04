<template>
    <b-card v-if="dataReady">
        <h3 class="text-dark p-0 mt-n2 mb-4">Interpreter Information</h3>
        <b-row class="my-n3">
            <b-col cols="3">                    
                <b-form-group
                    class="labels"                
                    label="Name / Agency">
                    <b-form-input 
                        size="sm"
                        disabled                              
                        v-model="booking.interpreter.fullName">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="4">
                <b-row>
                    <b-col cols="4">                    
                        <b-form-group
                            class="labels"                
                            label="Phone">
                            <b-form-input 
                                size="sm"
                                disabled                                        
                                v-model="booking.interpreter.phone">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col cols="8">                    
                        <b-form-group
                            class="labels"                
                            label="Email">
                            <b-form-input 
                                size="sm"
                                disabled
                                tooltip.hover
                                :title="fullEmail"                                      
                                v-model="email">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="5">                    
                <b-form-group
                    class="labels"                
                    label="Address">
                    <b-form-input 
                        size="sm"
                        disabled                             
                        v-model="booking.interpreter.fullAddress">
                    </b-form-input>
                </b-form-group>
            </b-col>

        </b-row>
        <b-row class="my-n3">
            <b-col cols="5">                    
                <b-form-group
                    class="labels"                
                    label="Language">
                    <b-form-input 
                        size="sm"
                        disabled 
                        v-model="booking.language">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="1">                    
                <b-form-group
                    class="labels"                
                    label="Level">
                    <b-form-input 
                        size="sm"
                        disabled 
                        v-model="booking.level">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="2">                    
                <b-form-group
                    class="labels"                
                    label="Multiple Languages">
                    <b-form-input 
                        size="sm"
                        disabled 
                        v-model="booking.multipleLanguages">
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>            
    </b-card>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingSearchResultInfoType} from '@/types/Bookings/json';

@Component
export default class AdmInterpreterInformation extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;
    
    dataReady = false;
    email=''
    fullEmail=''

    mounted(){
       this.dataReady = false; 
       this.email = Vue.filter('truncate-text')(this.booking.interpreter.email, 31)
       this.fullEmail = this.booking.interpreter?.email?.length>31? this.booking.interpreter.email :''
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
        font-size: 12px; 
        font-weight:600; 
        line-height: 0.025rem; 
        color: rgb(50, 50, 50);
        margin-top: 1rem;
    }

</style>