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

                <template v-slot:cell(updateByFree)="data" >
                    <b-button @click="update(data.item.name,'free')"  class="ml-4"  :disabled="data.item.progress!=100" variant="warning" >Manual Update</b-button>
                </template>
                <template v-slot:cell(updateByGoogle)="data" >
                    <b-button @click="update(data.item.name,'google')" class="ml-4" :disabled="data.item.progress!=100" variant="warning" >Manual Update</b-button>
                </template>
                
                <template v-slot:cell(progress)="data" >
                    <b-progress class="mt-2" :max="100" show-value height="2rem">
                        <b-progress-bar :value="data.value" variant="success"></b-progress-bar>
                    </b-progress>
                </template>
            </b-table>
        </b-card>
        
        <b-card bg-variant="white" v-else>
            <loading-spinner color="#000" waitingText="Loading ..." />
        </b-card>

       

    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { locationsInfoType } from "@/types/Common/json";

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");



@Component({
    components:{
        // MyDocumentsTable,
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
    
    updateFields = 
    [   
        {key:'description',    label:'Name',           sortable:false, tdClass: 'border-top', }, 
        {key:'updated_at',     label:'Last Update',    sortable:false, tdClass: 'border-top',},
        {key:'update_service',  label:'Update Service', sortable:false, tdClass: 'border-top',},
        {key:'updateByGoogle', label:'Update by Google Map',     sortable:false, tdClass: 'border-top',}, 
        {key:'updateByFree',   label:'Update by Free Service',     sortable:false, tdClass: 'border-top',},
        {key:'update_schedule', label:'Updating Schedule', sortable:false, tdClass: 'border-top',},
        {key:'progress',       label:'Progress',       sortable:false, tdClass: 'border-top', thStyle:'width:12rem;' },
    ] 

    updateInformation = [
        {name:"locations", description:"All Locations", updated_at:'2020-02-02 10:50:00:000Z', update_service:'Google Map', progress: 100}
    ]
   
    mounted() {  
        this.dataReady = false; 
        this.timeHandle1 = window.setTimeout(this.getUpdatingInfo, 1);        
    }
    
    beforeDestroy() {
        clearTimeout(this.timeHandle1);
        clearTimeout(this.timeHandle2);
        clearTimeout(this.timeHandle3);
        clearTimeout(this.timeHandle4);
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
        if(name?.includes('location'))
            this.updateLocations(service)
        else
            this.updateInterpretersGeoCoordinates(service)
    }

    public updateLocations(service){
        const locationsInfo = this.updateInformation.filter(info => info.name =='locations')[0]
        locationsInfo.progress = 0
        this.timeHandle3 = window.setTimeout(this.getUpdatingInfo, 10000);
    

        this.$http.get('/update-locations')
        .then((response) => {            

        },(err) => {
                        
        });
    }


    public updateInterpretersGeoCoordinates(service){
        const interpretersInfo = this.updateInformation.filter(info => info.name =='interpreters')[0]
        interpretersInfo.progress = 0
        this.timeHandle4 = window.setTimeout(this.getUpdatingInfo, 10000);

        this.$http.get('/interpreter/update-geo-coordinates')
        .then((response) => {            

        },(err) => {
                        
        });
    }



}
</script>
