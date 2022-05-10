<template>
    <b-card bg-variant="white" border-variant="white">
        <b-overlay :show="dismissCountDown>0" style="width:20rem; margin:0 auto;"> 
            <div style="width:20rem; font-size:24pt; font-weight:600; margin:0 auto;" class="text-center">Rates</div>
            <template v-slot:overlay>               
                <b-alert style="margin: auto 0; width:20rem" :variant="alertType" :show="dismissCountDown"  @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">
                    <b v-if="alertType=='success'" class="pl-4 ml-5"> Rate Saved <b-icon-check-square-fill class="ml-2"/> </b>
                    <b v-else class="pl-5 ml-5"> Error <b-icon-exclamation-circle-fill class="ml-2"/> </b>
                </b-alert>            
            </template> 
        </b-overlay> 
            
        <loading-spinner color="#000" v-if="!dataLoaded" waitingText="Loading ..." />        
        <b-card no-body v-else class="home-content border-white p-0">
            <b-row>
                <b-col cols="4">
                    <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                        <b-card-header style="border-radius: 8px;" class="text-primary h2 my-auto bg-info">
                            Spoken Language:
                        </b-card-header>
                        <b-card-body>
                            <b-row class="p-0 my-1">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Level 1: 
                                </b-col>
                                <b-col class="p-0" cols="6">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.spkl1].value"
                                        placeholder="hourly rate">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /hour
                                </b-col>
                            </b-row>

                            <b-row class="p-0 my-1">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Level 2: 
                                </b-col>
                                <b-col class="p-0" cols="6">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.spkl2].value"
                                        placeholder="hourly rate">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /hour
                                </b-col>
                            </b-row>

                            <b-row class="p-0 my-1">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Level 3: 
                                </b-col>
                                <b-col class="p-0" cols="6">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.spkl3].value"
                                        placeholder="hourly rate">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /hour
                                </b-col>
                            </b-row>

                            <b-row class="p-0">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Level 4: 
                                </b-col>
                                <b-col class="p-0" cols="6">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.spkl4].value"
                                        placeholder="hourly rate">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /hour
                                </b-col>
                            </b-row>
                        </b-card-body>

                    </b-card>
                </b-col>

                <b-col cols="4">
                    <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                        <b-card-header style="border-radius: 8px;" class="text-primary h2 my-auto bg-info">
                            ASL:
                        </b-card-header>
                        <b-card-body>                    
                            <b-row>
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Level 1: 
                                </b-col>
                                <b-col cols="6" class="p-0 my-1">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.asl1].value"
                                        placeholder="hourly rate">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /hour
                                </b-col>
                            </b-row>

                            <b-row class="p-0">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Level 2: 
                                </b-col>                    
                                <b-col cols="6" class="p-0">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.asl2].value"
                                        placeholder="hourly rate">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /hour
                                </b-col>                    
                            </b-row>   
                        </b-card-body>
                    </b-card>
                </b-col>

                <b-col cols="4">
                    <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                        <b-card-header style="border-radius: 8px;" class="text-primary h2 my-auto bg-info">
                            CART:
                        </b-card-header>
                        <b-card-body>                    
                            <b-row>
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Level 1: 
                                </b-col>
                                <b-col cols="6" class="p-0">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.cart].value"
                                        placeholder="hourly rate">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /hour
                                </b-col>
                            </b-row>                            
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="4">
                    <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                        <b-card-header style="border-radius: 8px;" class="text-primary h2 my-auto bg-info">
                            Meal Allowance: 
                        </b-card-header>
                        <b-card-body>
                            <b-row class="p-0 my-1">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Breakfast: 
                                </b-col>
                                <b-col class="p-0" cols="6">                    
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.breakfast].value"
                                        placeholder="rate/day">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /day
                                </b-col>
                            </b-row>
                            <b-row class="p-0 my-1">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Lunch: 
                                </b-col>
                                <b-col cols="6" class="p-0">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.lunch].value"
                                        placeholder="rate/day">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /day
                                </b-col>
                                
                            </b-row>
                            <b-row>
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Dinner: 
                                </b-col>
                                
                                <b-col cols="6" class="p-0">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.dinner].value"
                                        placeholder="rate/day">
                                    </b-form-input>
                                </b-col> 
                                <b-col cols="2" class="h4 my-auto">
                                    $ /day
                                </b-col>                   
                            </b-row>
                        </b-card-body>
                    </b-card>
                </b-col>

                <b-col cols="4">
                    <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                        <b-card-header style="border-radius: 8px;" class="text-primary h2 my-auto bg-info">
                            Other Rates:
                        </b-card-header>
                        <b-card-body>
                            <!-- <b-row class="p-0">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Lodge: 
                                </b-col>
                                <b-col cols="6" class="p-0">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.lodge].value"
                                        placeholder="rate/day">
                                    </b-form-input>
                                </b-col>
                                <b-col cols="3" class="h4 my-auto">
                                    $ /day
                                </b-col>
                            </b-row> -->

                            <b-row class="p-0">
                                <b-col cols="3" class="text-primary h4 my-auto">
                                    Mileage: 
                                </b-col>                    
                                <b-col cols="6" class="p-0">
                                    <b-form-input                             
                                        style="display:inline"
                                        :formatter="rateFormatter"
                                        v-model="allRates[rates.mileage].value"
                                        placeholder="rate/km">
                                    </b-form-input>                                    
                                </b-col>           
                                <b-col cols="3" class="h4 my-auto">
                                    $ /km
                                </b-col>
                            </b-row>                         
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="2" class="h4 my-auto">
                    <b-button style="float: right;" variant="secondary" @click="cancelChanges">Cancel Changes</b-button> 
                </b-col>

                <b-col cols="6"></b-col>
                
                <b-col cols="3" class="ml-0 pl-0 my-auto py-0">
                    <b-button style="float: right;" variant="success" @click="saveChanges">Save Changes</b-button>
                </b-col>
            </b-row>  
           
        </b-card>

        <!-- <b-modal size="lg" v-model="showConfirmAssignAdmin" header-class="bg-warning text-light">
            
            <template v-slot:modal-title>
                <h2 class="mb-0 text-light">Confirm Assign Admin Role</h2>                    
            </template>			
            <div>
                <h3 class="text-danger" >Admin Role is very sensitive.</h3> 
                <h4> Are you sure you want to assign the <b>Admin Role</b> to <b class="text-danger">{{tempUser.display_name}} "{{tempUser.email}}"</b>?</h4>
            </div>
            <template v-slot:modal-footer>
                <b-button variant="primary" @click="CancelAssignRole">Cancel</b-button>
                <b-button variant="danger" @click="AssignRole(tempUser)">Confirm</b-button>                
            </template>            
            <template v-slot:modal-header-close>                 
                <b-button variant="outline-warning" class="text-light closeButton" @click="CancelAssignRole"
                >&times;</b-button>
            </template>

        </b-modal> -->
    </b-card>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import { namespace } from "vuex-class";

import "@/store/modules/common";
const commonState = namespace("Common");

import { rateJsonInfoType, ratesInfoType } from '@/types/Common';
import {getRatesIndices} from "./RateFunctions"

@Component
export default class Rates extends Vue {

    @commonState.Action
    public UpdateRates!: (newRates: ratesInfoType) => void

    dataLoaded = false;    
    
    dismissCountDown =0
    alertType="danger"
    allRates: rateJsonInfoType[] = []
    rates = {} as ratesInfoType;
    
    mounted() { 
        this.loadAllRates()        
    }

    public countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    }

    public loadAllRates(){
        this.dataLoaded = false;
        
        this.$http.get('/rate')
        .then((response) => {
            if(response?.data){
                // console.log(response.data)
                this.allRates = response.data
                this.rates = getRatesIndices(this.allRates) 
                this.dataLoaded = true;                 
            }
        },(err) => {
            this.alertType="danger"
            this.dismissCountDown=1     
        });
    }

    public cancelChanges() {
        this.loadAllRates()
    }

    public saveChanges() {           

        this.$http.put('/rate', this.allRates).then(res=>{
            if(res?.status==202){
                this.alertType="success"
                this.dismissCountDown=2
            }
            this.loadAllRates()
        },error => {
            this.alertType="danger"
            this.dismissCountDown=2           
        })
        
    }

    public rateFormatter(value){
        if(!isNaN(Number(value))) return value
        if(isNaN(Number(value.slice(-1)))) return value.slice(0,-1)
        if(isNaN(Number(value))) return ''
        return value
    }


}
</script>

<style scoped lang="scss">
</style>