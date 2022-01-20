<template>
    <b-card bg-variant="light" border-variant="white">
        <h1>UPDATE GEO COORDINATES</h1>
    
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

    dataLoaded = false;    
   
    mounted() {  
        this.dataLoaded = false;       
    }



}
</script>
