<template>
    <b-card bg-variant="light" border-variant="white">
        <h1 class="text-center">Update GEO Coordinates</h1>

        <b-card v-if="dataReady" bg-variant="white">
            <b-table
                    :items="updateInformation"
                    :fields="updateFields"
                    head-row-variant="primary"
                    borderless                                        
                    sort-by="name"
                    :sort-desc="true"
                    responsive="sm"
                >
                <template v-slot:cell(description)="data" >
                    <b>{{data.value}}</b>
                </template>

                <template v-slot:cell(updated_at)="data" >
                    <div>{{data.value | beautify-date-weekday-time}}</div>
                </template>

                <template v-slot:cell(update_service)="data" >
                    <div v-if="data.value.includes('Google')" class="text-success">{{data.value}}</div>
                    <div v-else class="text-danger">{{data.value}}</div>
                </template>

                <template v-slot:cell(manualUpdate)="data" >                    
                    <b-row>
                        <b-button @click="update(data.item.name,'free')"  class="ml-3 mt-2 mb-1"  variant="info" >Free Service</b-button>                
                    </b-row>
                    <b-row>
                        <b-button @click="update(data.item.name,'google')" class="ml-3 mt-1 mb-2 " variant="warning" >Google Map</b-button>
                    </b-row>                    
                </template>

                <!-- <template v-slot:cell(update_schedule)="data" >
                    <b-form-radio-group stacked>
                        <b-form-radio>Manual</b-form-radio>
                        <b-form-radio> <b-row style="margin:0rem 0 0 0;"> Every <b-form-input style="width:4.5rem" type="number" /> days at <b-form-input style="width:4rem" type="number" />: <b-form-input style="width:4rem" type="number" /> </b-row></b-form-radio>
                        <b-form-radio>Monthly</b-form-radio>
                    </b-form-radio-group>
                </template> -->
                
                <template v-slot:cell(progress)="data" >
                    <b-progress  :max="100" show-value height="2rem">
                        <b-progress-bar :value="data.value" variant="success"></b-progress-bar>
                    </b-progress>
                </template>
            </b-table>
        </b-card>
        
        <b-card bg-variant="white" v-else>
            <loading-spinner color="#000" waitingText="Loading ..." />
        </b-card>

         <b-alert class="mt-3" variant="danger" :show="dismissCountDown"  @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">            
            <b class="mr-2">Error: </b> {{errorMsg}} <b-icon-exclamation-circle-fill/>
        </b-alert>



        <loading-spinner color="#000" v-if="!dataReady" waitingText="Loading Results ..." /> 
        <div v-else class="mt-5"> 

            <b-card no-body border-variant="white" bg-variant="white" v-if="!interpreters.length">
                <span class="text-muted ml-4 mb-5">No records found.</span>
            </b-card>      

            <b-card v-else class="home-content  p-0">
                <b-table
                    :items="interpreters"
                    :fields="interpretersFields"
                    class="border-info"
                    head-row-variant="primary"                       
                    small
                    sort-icon-left
                    responsive="sm">
                   
                    <template v-slot:cell(updated_at)="data" > 
                        <span>{{data.value | beautify-date}}</span>
                    </template>
                    <template v-slot:cell(contractExtension)="data" > 
                        <b-icon-check v-if="data.value" font-scale="2" variant="success"/>
                        <b-icon-x v-else font-scale="2" variant="danger"/>                        
                    </template>
                    <template v-slot:cell(manual_update)="data" >                         
                        
                        <b-button
                        size="sm"
                        style="padding: 0.75rem 2rem; width: 100%;" 
                        :disabled="data.item.update_started"
                        variant="warning"
                         @click="updateOne(data.item)"
                        ><spinner color="#FFF" v-if="data.item.update_started" style="margin:0; padding: 0; height:1.5rem; transform:translate(0px,-28px);"/>
                        <span style="font-size: 12px;" v-else>Google Map</span>
                    </b-button>
                    </template>
                    <template v-slot:cell(geo_service)="data" >
                        <div v-if="data.value.includes('Google')" class="text-success">{{data.value}}</div>
                        <div v-else class="text-danger">{{data.value}}</div>
                    </template>


                </b-table>
            </b-card>
        </div>

       

    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { locationsInfoType } from "@/types/Common/json";
import Spinner from '@/components/utils/Spinner.vue'

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");



@Component({
    components:{
        Spinner
    }
})
export default class UpdateGeoPage extends Vue {

    @commonState.State
    public courtLocations!: locationsInfoType[];

    dataReady = false;  
    timeHandle1
    timeHandle2
    timeHandle3
    timeHandle4

    dismissCountDown=0
    errorMsg=''
    searching= false
    
    updateFields = 
    [   
        {key:'description',     label:'Name',              sortable:false, tdClass: 'border-top align-middle', }, 
        {key:'updated_at',      label:'Last Update',       sortable:false, tdClass: 'border-top align-middle',},
        {key:'update_service',  label:'Update Service',    sortable:false, tdClass: 'border-top align-middle',},
        {key:'manualUpdate',    label:'Manual Update',     sortable:false, tdClass: 'border-top',},
        {key:'update_schedule', label:'Updating Schedule', sortable:false, tdClass: 'border-top',},
        {key:'progress',        label:'Progress',          sortable:false, tdClass: 'border-top align-middle', thStyle:'width:12rem;' },
    ] 

    updateInformation = [
        {name:"locations", description:"All Locations", updated_at:'2020-02-02 10:50:00:000Z', update_service:'Google Map', progress: 100}
    ]

    interpretersFields =
    [ 
        {key:'firstName',        label:'First Name',     sortable:false, tdClass: 'border-top align-middle', thStyle:'width:10%'}, 
        {key:'lastName',         label:'Last Name',      sortable:true,  tdClass: 'border-top align-middle', thStyle:'width:10%'},
        {key:'address',          label:'Address',        sortable:false, tdClass: 'border-top align-middle', thStyle:'width:20%'},
        {key:'city',             label:'City',           sortable:false, tdClass: 'border-top align-middle', thStyle:'width:10%'},
        {key:'postal',           label:'Post Code',      sortable:false, tdClass: 'border-top align-middle', thStyle:'width:6%'},
        {key:'province',         label:'Province',       sortable:false, tdClass: 'border-top align-middle', thStyle:'width:6%'},
        {key:'updated_at',       label:'Last Update',    sortable:false, tdClass: 'border-top align-middle', thStyle:'width:8%'}, 
        {key:'contractExtension',label:'Valid Contract', sortable:true, tdClass: 'border-top align-middle', thStyle:'width:9%'}, 
        {key:'geo_service',      label:'Update Service', sortable:true, tdClass: 'border-top align-middle', thStyle:'width:9%'}, 
        {key:'manual_update',    label:'Update',         sortable:false, tdClass: 'border-top align-middle', thStyle:'width:12%'},    
    ] 

    interpreters = []
   
    mounted() {  
        this.dataReady = false; 
        this.timeHandle1 = window.setTimeout(this.getUpdatingInfo, 1);
        this.getInterpretersInfo()
    }
    
    beforeDestroy() {
        clearTimeout(this.timeHandle1);
        clearTimeout(this.timeHandle2);
        clearTimeout(this.timeHandle3);
        clearTimeout(this.timeHandle4);
    }

    public getInterpretersInfo(){
        this.$http.get('/geo/interpreters')
        .then((response) => { 
            if(response.data){
                this.interpreters = response.data.filter(interpreter => !interpreter.geo_service)// || !interpreter.geo_service.includes('google') )
            }

        },(err) => {
            this.dataReady = true;    
        });
    }

    public getUpdatingInfo(){
        this.$http.get('/geo/updating-status')
        .then((response) => { 
            if(response.data){
                this.updateInformation = response.data
                const progress = this.updateInformation.map(info =>info.progress==100)
                
                if(progress.includes(false))
                    this.timeHandle2 = window.setTimeout(this.getUpdatingInfo, 5000);
            }
            this.dataReady = true; 
        },(err) => {
            this.dataReady = true;    
        });
    }

    public update(name, service){
        
        let google_map='False'
        if(service.includes('google'))
            google_map='True'

        if(name?.includes('location'))
            this.updateLocations(google_map)
        else
            this.updateInterpretersGeoCoordinates(google_map)
    }

    public updateLocations(google_map){
        const locationsInfo = this.updateInformation.filter(info => info.name =='locations')[0]
        locationsInfo.progress = 0
        this.timeHandle3 = window.setTimeout(this.getUpdatingInfo, 10000);
    

        this.$http.get('/geo/update-locations?google_map='+google_map, {timeout: 2000})
        .then((response) => {            

        },(err) => {
            if(err.response.status==503){
                this.errorMsg = err.response?.data?.detail
                this.dismissCountDown = 10;
                this.getUpdatingInfo()
            }       
        });
    }


    public updateInterpretersGeoCoordinates(google_map){
        const interpretersInfo = this.updateInformation.filter(info => info.name =='interpreters')[0]
        interpretersInfo.progress = 0
        this.timeHandle4 = window.setTimeout(this.getUpdatingInfo, 10000);

        this.$http.get('/geo/update-geo-coordinates?google_map='+google_map, {timeout: 2000})
        .then((response) => {            

        },(err) => {
            if(err.response.status==503){
                this.errorMsg = err.response?.data?.detail
                this.dismissCountDown = 10;
                this.getUpdatingInfo()
            }

        });
    }

    public countDownChanged(dismissCountDown){
        this.dismissCountDown = dismissCountDown
    }

    public updateOne(data){
        console.log(data)
        const interpreter = this.interpreters.filter(interpreter => interpreter.id == data.id)[0]
        interpreter.update_started =  true;
        const google_map = false
        this.$http.put('/geo/update-geo-coordinates/'+data.id+'?google_map='+google_map, {timeout: 2000})
        .then((response) => {            
            this.interpreters = this.interpreters.filter(interpreter => interpreter.id != data.id)
        },(err) => {
              
        });
    }


}
</script>
