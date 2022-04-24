<template>
    <b-card bg-variant="white" border-variant="white">
        <b-overlay :show="dismissCountDown>0" style="width:20rem; margin:0 auto;"> 
            <div style="width:20rem; font-size:24pt; font-weight:600; margin:0 auto;" class="text-center">Rates</div>
            <template v-slot:overlay>               
                <b-alert style="margin: auto 0; width:20rem" :variant="alertType" :show="dismissCountDown"  @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">
                    <b v-if="alertType=='success'" class="pl-4 ml-5">{{dismissCountDown}} Role Saved <b-icon-check-square-fill class="ml-2"/> </b>
                    <b v-else class="pl-5 ml-5"> Error <b-icon-exclamation-circle-fill class="ml-2"/> </b>
                </b-alert>            
            </template> 
        </b-overlay> 
            
        <loading-spinner color="#000" v-if="!dataLoaded" waitingText="Loading ..." />        
        <b-card no-body v-else class="home-content border-white p-0">
            
            <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                <b-card-header style="border-radius: 15px;" class="text-primary h2 my-auto bg-info">
                    Meal allowance: 
                </b-card-header>
                <b-card-body>
                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Breakfast: 
                        </b-col>
                        <b-col class="p-0" cols="3">                    
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.meals.breakfast"
                                placeholder="breakfast allowance">
                            </b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Lunch: 
                        </b-col>
                        <b-col cols="3" class="p-0">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.meals.lunch"
                                placeholder="lunch allowance">
                            </b-form-input>
                        </b-col>
                        
                    </b-row>
                    <b-row>
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Dinner: 
                        </b-col>
                        
                        <b-col cols="3" class="p-0">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.meals.dinner"
                                placeholder="dinner allowance">
                            </b-form-input>
                        </b-col>                    
                    </b-row>
                </b-card-body>
            </b-card>
            <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                <b-card-header style="border-radius: 15px;" class="text-primary h2 my-auto bg-info">
                    Spoken language:
                </b-card-header>
                <b-card-body>
                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Level 1: 
                        </b-col>
                        <b-col class="p-0" cols="3">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.spokenLanguage.level1"
                                placeholder="level 1">
                            </b-form-input>
                        </b-col>
                    </b-row>

                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Level 2: 
                        </b-col>
                        <b-col class="p-0" cols="3">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.spokenLanguage.level2"
                                placeholder="level 2">
                            </b-form-input>
                        </b-col>
                    </b-row>

                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Level 3: 
                        </b-col>
                        <b-col class="p-0" cols="3">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.spokenLanguage.level3"
                                placeholder="level 3">
                            </b-form-input>
                        </b-col>
                    </b-row>

                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Level 4: 
                        </b-col>
                        <b-col class="p-0" cols="3">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.spokenLanguage.level4"
                                placeholder="level 4">
                            </b-form-input>
                        </b-col>
                    </b-row>
                </b-card-body>

            </b-card>
            <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                <b-card-header style="border-radius: 15px;" class="text-primary h2 my-auto bg-info">
                    ASL:
                </b-card-header>
                <b-card-body>                    
                    <b-row>
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Level 1: 
                        </b-col>
                        <b-col cols="3" class="p-0">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.aslLanguage.level1"
                                placeholder="level 1">
                            </b-form-input>
                        </b-col>
                    </b-row>

                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Level 2: 
                        </b-col>                    
                        <b-col cols="3" class="p-0">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.aslLanguage.level2"
                                placeholder="level 2">
                            </b-form-input>
                        </b-col>                    
                    </b-row>   
                </b-card-body>             

            </b-card>
            <b-card class="w-100 mx-auto my-4 bg-light border-light">                
                <b-card-header style="border-radius: 15px;" class="text-primary h2 my-auto bg-info">
                    Other Rates:
                </b-card-header>
                <b-card-body>
                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Lounge: 
                        </b-col>
                        <b-col cols="3" class="p-0">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.lounge"
                                placeholder="lounge">
                            </b-form-input>
                        </b-col>
                    </b-row>

                    <b-row class="p-0">
                        <b-col cols="3" class="text-primary h4 my-auto">
                            Mileage: 
                        </b-col>                    
                        <b-col cols="3" class="p-0">
                            <b-form-input                             
                                style="display:inline"
                                v-model="rates.mileage"
                                placeholder="mileage">
                            </b-form-input>
                        </b-col>                    
                    </b-row>                         
                </b-card-body>     

            </b-card>

            <b-row>
                <b-col cols="2" class="h4 my-auto">
                    <b-button style="float: right;" variant="secondary" @click="cancelChanges">Cancel</b-button> 
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
import { aslInfoType, mealAllowanceInfoType, ratesInfoType, spokenLanguageInfoType } from '@/types/Common';
const commonState = namespace("Common");

@Component
export default class Rates extends Vue {

    @commonState.State
    public rates!: ratesInfoType;

    @commonState.Action
    public UpdateRates!: (newRates: ratesInfoType) => void

    dataLoaded = false;    
    
    dismissCountDown =0
    alertType="danger"
    
    mounted() { 
       
        this.dataLoaded = false;
        // this.loadAllRates()
        //TODO: remove the next lines once we have data and db setup
        this.rates = {} as ratesInfoType;
        this.rates.meals = {} as mealAllowanceInfoType;
        this.rates.spokenLanguage = {} as spokenLanguageInfoType;
        this.rates.aslLanguage = {} as aslInfoType;
        this.dataLoaded = true;       
    }

    public countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    }

    public saveChanges() {
        console.log('save changes')
    }

    public cancelChanges() {
        console.log('cancel changes')
    }

    public loadAllRates(){
        // this.$http.get('/role/all')
        // .then((response) => {
        //     if(response?.data){
        //         // console.log(response.data)
        //         this.allRoles = response.data
        //         this.filterRoles = this.allRoles.concat(this.filterRoles)
        //         this.loadAllUsers()
        //     }
        // },(err) => {
        //     this.dataLoaded = true;            
        // });
    }

    // public RolesChanged(user){

    //     this.tempUser=user
        
    //     if(user?.id && user.role){

    //         const originalUser = this.allUsersOriginal.filter(usr => usr.id == user.id)[0]
    //         const originalRoles = originalUser.role.map(role => role.role_name)
    //         const currentRoles = user.role.map(role => role.role_name)
                        
    //         if(currentRoles.includes('cis-admin') && originalRoles.includes('cis-admin')==false){                
    //             this.showConfirmAssignAdmin=true
    //             return                
    //         }
    //         this.AssignRole(user)
    //     }
    // }


    // public CancelAssignRole(){
    //     this.showConfirmAssignAdmin = false; 
    //     this.loadAllUsers()
    // }


    // public AssignRole(user){
        
    //     this.showConfirmAssignAdmin=false 
        
    //     if(user?.id && user.role){

    //         const roles = user.role.map(role=>{return role.id})
    //         const data = {
    //             "user_id":user.id,
    //             "roles": roles
    //         }

    //         this.$http.put('/role/assign', data).then(res=>{
    //             if(res?.status==202){
    //                 this.alertType="success"
    //                 this.dismissCountDown=1
    //             }
    //             this.loadAllUsers()
    //         },error => {
    //             this.alertType="danger"
    //             this.dismissCountDown=1
    //             this.loadAllUsers()
    //         })
    //     }
    // }

}
</script>

<style scoped lang="scss">
</style>