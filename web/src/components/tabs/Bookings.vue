<template>
    <b-card bg-variant="light" border-variant="white">
        <h1>BOOKINGS</h1>
        <!-- <div class="alert alert-danger mt-4" v-if="error">{{error}}</div>
        <loading-spinner color="#000" v-if="!dataLoaded" waitingText="Loading ..." />
        
        <b-card no-body v-else class="home-content border-white p-0">          
            <my-documents-table 
                v-bind:enableActions="false" 
                v-bind:title="'Submissions'">
            </my-documents-table>
            <b-row no-gutters class="bg-white pt-0">
                <b-button 
                    class="ml-5 mb-3 bg-primary outline-dark"
                
                    @click="navigateToDocumentsPage">
                    View All Submissions
                </b-button>
            </b-row>
        </b-card> -->
    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as _ from 'underscore';
import { languagesInfoType, locationsInfoType } from "@/types/Common/json";

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");



@Component({
    components:{
        // MyDocumentsTable,
    }
})
export default class BookingsPage extends Vue {

    @commonState.Action
    public UpdateCourtLocations!: (newCourtLocations: locationsInfoType[]) => void

    @commonState.Action
    public UpdateLanguages!: (newLanguages: languagesInfoType[]) => void

    @commonState.State
    public courtLocations!: locationsInfoType[];

    dataLoaded = false;    
   
    mounted() {  
        this.dataLoaded = false;
        this.loadCourtLocations();
       
    }

    public loadCourtLocations(){
        this.$http.get('/location')
        .then((response) => {            
            if(response?.data){                
                this.UpdateCourtLocations(response.data);
                this.loadLanguages();
            }
            
        },(err) => {
            console.log(err)            
        });
    }

    public loadLanguages(){
        this.$http.get('/language')
        .then((response) => {            
            if(response?.data){ 
                const languages = _.sortBy(response.data,'name')               
                this.UpdateLanguages(languages);                
            }
            this.dataLoaded = true;
        },(err) => {
            this.dataLoaded = true;            
        });
    }

    get sortedCourtLocations(){
        return _.sortBy(this.courtLocations,'name')
    }

}
</script>
