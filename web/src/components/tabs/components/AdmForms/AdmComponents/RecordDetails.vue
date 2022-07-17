<template>
    <b-card v-if="dataLoaded" bg-variant="light" class="mt-n3 mb-0" border-variant="secondary" body-class="px-1 pt-0 pb-1">             
        <b-row>
            <b-col cols="9">
                <b-table-simple  borderless style="width:100%;font-size:10pt;" class="mt-1 mb-0">
                    <tr>
                        <td class="m-1 p-1" style="width:38%;"><b>Registry:</b> {{recordDetails.registry}} <b-icon-exclamation-triangle-fill v-if="recordDetails.registryWarning" class="ml-1" v-b-tooltip.hover.v-warning title="This Booking corresponds to a different location." font-scale="1.3" variant="warning"/> </td>
                        <td class="m-1 p-1" style="width:18%;"><b>Requested By:</b> {{recordDetails.requestedBy}} </td>
                        <td class="m-1 p-1" style="width:17%;"><b>Bilingual:</b> {{recordDetails.bilingualYN}} </td>
                        <td class="m-1 p-1" style="width:27%;"><b>Court Level:</b> {{recordDetails.courtLevel}} </td>
                        
                    </tr> 
                    <tr>
                        <td class="m-1 p-1"><b>Method Of Appearance:</b> {{recordDetails.methodOfAppearance}} </td>
                        <td class="m-1 p-1"><b>Case Type:</b> {{recordDetails.caseType}} </td>                        
                        <td class="m-1 p-1" colspan="2"><b>Court Class:</b> {{recordDetails.courtClassDesc}} </td>                                        
                    </tr>
                    <tr>
                        <td class="m-1 p-1"><b>Prosecutor:</b> {{recordDetails.prosecutor}}</td>
                        <td class="m-1 p-1"><b>Reason Code:</b> {{recordDetails.reasonCd}} </td>
                        <td class="m-1 p-1" colspan="2"><b>Reason Desc:</b> {{recordDetails.reasonDesc}} </td>                        
                    </tr>
                    <tr>
                        <td class="m-1 p-1" colspan="4"><b>Comment:</b> {{recordDetails.comment}} </td>
                    </tr>

                </b-table-simple >
            </b-col>
            <b-col cols="3">
                <b-table
                    class="mt-3 mr-1 border"
                    style="font-size:9pt;"
                    :items="recordDetails.languages"
                    :fields="languageFields"                    
                    small
                    borderless
                    striped
                    responsive="sm">

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
    
    // recordDetail = [];
    dataLoaded = false;
    

    languageFields = [
        {key:'language',     label:'Language',      thStyle:'width:60%', cellStyle:'', thClass:'align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},
        {key:'level',        label:'Level',         thStyle:'width:10%', cellStyle:'', thClass:'align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},        
        {key:'interpretFor', label:'Interpret For', thStyle:'width:30%', cellStyle:'', thClass:'align-middle text-center m-0 p-0', tdClass:'align-middle text-center m-0 p-0'},               
    ];
   

//    "comment": "Update Court Interpreter Request Federal Prosecutor Name Method Of Appearance", 
   
//    "registry": "100 Mile House Law Courts",
//    "requestedBy": "Court", 
//    "prosecutor": "pr1", 
//    "bilingual": null,
//    "methodOfAppearance": "In-Person",
//    "caseType": null, 
//    "courtLevel": null, 
//    "courtClass": "family1", 


//    "languages": [ { "language": "Arabic", "level": 3, "interpretFor": "Witness" } ], 
   


    
    mounted(){       
        this.dataLoaded = false;       
        this.extractDetails();        
        this.dataLoaded = true;        
    }

    public extractDetails(){
        // this.recordDetail = [];
       
        // this.recordDetail.push();

    }
    
    
}
</script>

