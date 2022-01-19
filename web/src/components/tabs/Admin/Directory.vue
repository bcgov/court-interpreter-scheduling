<template>
    <b-card bg-variant="light" border-variant="white">
        <h1>DIRECTORY</h1>
    
    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { locationsInfoType } from '@/types/Common';

import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");



@Component({
    components:{
        // MyDocumentsTable,
    }
})
export default class DirectoryPage extends Vue {

    @commonState.State
    public courtLocations!: locationsInfoType[];

    dataLoaded = false;    
   
    mounted() {  
        this.dataLoaded = false;       
    }



}
</script>
