<template>
    <b-card bg-variant="white" border-variant="white">
        <b-overlay :show="dismissCountDown>0" style="width:20rem; margin:0 auto;"> 
            <div style="width:20rem; font-size:24pt; font-weight:600; margin:0 auto;" class="text-center">User Roles</div>
            <template v-slot:overlay>               
                <b-alert style="margin: auto 0; width:20rem" :variant="alertType" :show="dismissCountDown"  @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">
                    <b v-if="alertType=='success'" class="pl-4 ml-5">{{dismissCountDown}} Role Saved <b-icon-check-square-fill class="ml-2"/> </b>
                    <b v-else class="pl-5 ml-5"> Error <b-icon-exclamation-circle-fill class="ml-2"/> </b>
                </b-alert>            
            </template> 
        </b-overlay> 
            
        <loading-spinner color="#000" v-if="!dataLoaded" waitingText="Loading ..." />        
        <b-card no-body v-else class="home-content border-white p-0">
            
            <b-card class="w-75 mx-auto my-4 bg-light">                
                <b-row>
                    <b-col md="3" class="text-primary h2 my-auto">
                        Filter Results By: 
                    </b-col>
                    <b-col class="text-primary my-auto mr-0 pr-0 py-2" >
                        <b-form-radio-group                                                        
                            v-model="filterUsersBy"
                            :options="filterRoles"
                            text-field="role_name"
                            value-field="role_name"                          
                        >                    
                        </b-form-radio-group>
                    </b-col>
                    <b-col v-if="filterUsersBy=='Keyword:'" md="4" class="ml-0 pl-0 my-auto py-0">
                        <b-form-input                             
                            style="display:inline"
                            v-model="filterKeyword"
                            placeholder="name or email"
                        >
                        </b-form-input>
                    </b-col>
                    
                </b-row>
            </b-card>

            <b-table
                :items="filteredUsers"
                :fields="userFields"
                head-row-variant="primary"
                borderless
                striped
                sort-icon-left
                sort-by="last_name"
                :sort-desc="true"
                responsive="sm"
            >
            <template v-slot:cell(location)="data" >
                <div>{{data.value.name}}</div>
            </template>            

            <template v-slot:cell(role)="data" >
                <b-row>                  
                    <b-col>
                        <b-form-checkbox-group
                            v-model="data.item.role"
                            @change="RolesChanged(data.item)"
                        >
                        <b-checkbox v-for="role,inx in allRoles" :key="inx" :value="role">
                            {{role.role_name}}
                        </b-checkbox>
                        </b-form-checkbox-group>
                    </b-col>
                </b-row>
            </template>
            </b-table>
        </b-card>

        <b-modal size="lg" v-model="showConfirmAssignAdmin" header-class="bg-warning text-light">
            
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

        </b-modal>
    </b-card>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';

import { allUsersInfoType, roleInfoType } from '@/types/Admin';
import { locationsInfoType } from '@/types/Common/json';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");


@Component
export default class UserRolePage extends Vue {

    @commonState.State
    public courtLocations!: locationsInfoType[];

    @commonState.State
    public userEmail!: string;

    dataLoaded = false;    
    allUsers: allUsersInfoType[]= []
    allUsersOriginal: allUsersInfoType[]= []
    filterUsersBy="All"
    filterKeyword=""
    filterRoles = [{id:-1, role_name:"All"},{id:-2, role_name:"No Role"},{id:-3, role_name:"Keyword:"},]

    allRoles: roleInfoType[] = []
    dismissCountDown =0
    alertType="danger"

    assignedRoles=[]
    tempUser: allUsersInfoType ={id:0, display_name:'', email:'', first_name:'', last_name:'', location: null, role:[]}
    showConfirmAssignAdmin=false

    userFields = 
    [   
        {key:'last_name', label:'Last Name', sortable:true, tdClass: 'border-top', }, 
        {key:'first_name', label:'First Name', sortable:true, tdClass: 'border-top', },
        {key:'email', label:'Email', sortable:false, tdClass: 'border-top', },
        {key:'location', label:'Location', sortable:false, tdClass: 'border-top', },
        {key:'role', label:'Role', sortable:false, thClass:'', tdClass: 'border-top', },

    ]  

    
    mounted() { 
        this.showConfirmAssignAdmin=false 
        this.dataLoaded = false;
        this.loadAllRoles()
       
    }

    public countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    }

    public loadAllRoles(){
        this.$http.get('/role/all')
        .then((response) => {
            if(response?.data){
                // console.log(response.data)
                this.allRoles = response.data
                this.filterRoles = this.allRoles.concat(this.filterRoles)
                this.loadAllUsers()
            }
        },(err) => {
            this.dataLoaded = true;            
        });
    }        
    

    public loadAllUsers(){
        this.$http.get('/user-info/all')
        .then((response) => {            
            if(response?.data){                
                // console.log(response.data)
                this.allUsers = response.data
                const currentUser = this.allUsers.filter(usr => usr.email == this.userEmail)[0]
                currentUser['_rowVariant']="warning"

                this.allUsersOriginal=JSON.parse(JSON.stringify(response.data))
            }
            this.dataLoaded = true;
        },(err) => {
            this.dataLoaded = true;            
        });
    }


    public getRoleIds(data){
        this.assignedRoles[data.index]= data.value.map(role=>{return role.id})
    }


    public RolesChanged(user){

        this.tempUser=user
        
        if(user?.id && user.role){

            const originalUser = this.allUsersOriginal.filter(usr => usr.id == user.id)[0]
            const originalRoles = originalUser.role.map(role => role.role_name)
            const currentRoles = user.role.map(role => role.role_name)
                        
            if(currentRoles.includes('cis-admin') && originalRoles.includes('cis-admin')==false){                
                this.showConfirmAssignAdmin=true
                return                
            }
            this.AssignRole(user)
        }
    }


    public CancelAssignRole(){
        this.showConfirmAssignAdmin = false; 
        this.loadAllUsers()
    }


    public AssignRole(user){
        
        this.showConfirmAssignAdmin=false 
        
        if(user?.id && user.role){

            const roles = user.role.map(role=>{return role.id})
            const data = {
                "user_id":user.id,
                "roles": roles
            }

            this.$http.put('/role/assign', data).then(res=>{
                if(res?.status==202){
                    this.alertType="success"
                    this.dismissCountDown=1
                }
                this.loadAllUsers()
            },error => {
                this.alertType="danger"
                this.dismissCountDown=1
                this.loadAllUsers()
            })
        }
    }


    get filteredUsers(){
        if(this.filterUsersBy=="No Role")
            return this.allUsers.filter(user=>{return user.role.length==0})
        else if(this.filterUsersBy=="All")
            return this.allUsers
        else if(this.filterUsersBy=="Keyword:" && this.filterKeyword)
            return this.allUsers.filter(user=>{
                return (
                    user.first_name.toLowerCase().includes(this.filterKeyword.toLowerCase()) ||
                    user.last_name.toLowerCase().includes(this.filterKeyword.toLowerCase()) ||
                    user.email.toLowerCase().includes(this.filterKeyword.toLowerCase())
                )
            })
        else if(this.filterUsersBy)
            return this.allUsers.filter(user=>{
                const roles = user.role.map(role=>{return role.role_name})                
                return roles.includes(this.filterUsersBy) 
            })
        else
            return this.allUsers
    }

}
</script>