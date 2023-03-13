<template>
    <b-card v-if="dataLoaded" bg-variant="light" class="mt-0 mb-0" border-variant="secondary" body-class="px-1 pt-0 pb-1">             
        <b-row class="">
            <b-col cols="12">  
                <b-table
                    class="mt-3 mr-1 border"
                    style="font-size:9pt;"
                    :items="recordDetails.cases"
                    :fields="caseFields"                    
                    small
                    borderless
                    striped
                    responsive="sm">
                        <template v-slot:cell(language)="data" >
                            {{data.value.languageName+' ('+data.value.level+')'}}
                        </template>
                        <template v-slot:cell(courtClass)="data" >
                            {{data.value |truncate-text(22,true)}}
                        </template>
                        <template v-slot:cell(federal)="data" >
                            {{data.value?'Yes':'No'}}
                        </template>
                        <template v-slot:cell(interpretationMode)="data" >                            
                            {{data.item.bilingual? data.value:'No'}}
                        </template>
                </b-table>
            </b-col>
        </b-row> 
    </b-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';


@Component
export default class RecordDetails extends Vue {

    @Prop({required: true})
    recordDetails!: any; 

    @Prop({required: false, default:'bg-primary'})
    headerColor!: string; 
    
    // recordDetail = [];
    dataLoaded = false;

    caseFields=[
        {key:'file',           label:'File#',        thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'caseName',       label:'Case Name',    thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'room',           label:'Room',         thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'language',       label:'Language',     thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'interpretFor',   label:'Intpr. For',   thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'caseType',       label:'Type',         thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'courtLevel',     label:'Court Level',  thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'courtClass',     label:'Court Class',  thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'requestedBy',    label:'Req. By',      thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},      
        {key:'reason',         label:'Rsn.',         thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},      
        {key:'methodOfAppearance',label:'Appearance',thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},        
        {key:'federal',        label:'Fed.',         thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'prosecutor',     label:'Prosecutor',   thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'interpretationMode',label:'Bilingual', thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
        {key:'remoteRegistry', label:'Remote',       thClass:'bg-primary text-white align-middle text-center', tdClass:'align-middle text-center'},
    ]
   

    
    mounted(){       
        this.dataLoaded = false;         
        for(const casefield of this.caseFields){
            casefield.thClass = this.headerColor+' text-white align-middle text-center'
        }
        Vue.nextTick(() => this.dataLoaded = true);        
    }


    
    
}
</script>

