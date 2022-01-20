<template>
    <b-card no-body v-if="dataLoaded" class="bg-white border-white">       

        <b-table            
            :items="interpreterRecordDetail"
            :fields="detailedFields"
            class="my-0"            
            borderless
            small 
            responsive="sm"
            >
            <template v-slot:cell(criminalRecordCheckDate)="row" >
                <span v-if="row.item.criminalRecordCheckDate">{{ row.item.criminalRecordCheckDate | beautify-date}}</span>
            </template>

            <template v-slot:cell(address)="row" >
                <span>{{ fullAddress }}</span>
            </template>
        </b-table>    
        
    </b-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { interpreterInfoType } from '@/types/Interpreters/json';

@Component
export default class InterpreterDetails extends Vue {

    @Prop({required: true})
    interpreterDetails!: interpreterInfoType; 
    
    interpreterRecordDetail: interpreterInfoType[] = [];
    dataLoaded = false;
    fullAddress = '';
   
    detailedFields = [
              
        {
            key: "address",
            label: "Address",
            sortable: false
        },
        {
            key: "supplier",
            label: "Supplier #",
            sortable: false
        },
        {
            key: "siteCode",
            label: "Site Code",
            sortable: false
        },        
        {
            key: "gst",
            label: "GST #",
            sortable: false
        },
        {
            key: "criminalRecordCheckDate",
            label: "Record Check",
            sortable: false
        },        
        {
            key: "comments",
            label: "Comments",
            sortable: false
        }
    ];

    mounted(){
        this.dataLoaded = false;
        this.extractDetails();
        
        this.dataLoaded = true;        
    }

    public extractDetails(){
        this.interpreterRecordDetail = [];
        const address = this.interpreterDetails.address?this.interpreterDetails.address:'';
        const city = this.interpreterDetails.city?this.interpreterDetails.city:'';
        const province = this.interpreterDetails.province?this.interpreterDetails.province:'';
        const postalCode = this.interpreterDetails.postal?this.interpreterDetails.postal:'';
        this.fullAddress = address + ' ' + city + ' ' + province + ' ' + postalCode;
        this.interpreterRecordDetail.push(this.interpreterDetails);

    }
    
    
}
</script>

