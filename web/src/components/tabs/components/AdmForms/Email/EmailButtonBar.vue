<template>
    <div>
        <hr v-if="position=='bottom'"/>
        <div class="border-0 row">
            <div style="width:1%;"/>
            <div style="width:60%;">
                <b-button class="float-left ml-2" variant="dark" @click="closePrint">
                    <spinner color="#FFF" v-if="printingPDF" style="margin:0; padding: 0; height:1.9rem; transform:translate(0px,-25px);"/>
                    <b style="font-size: 18px;" v-else>Cancel</b>
                </b-button>
            </div>            
            <div style="width:38%;">
                <b-button class="float-right mr-2" variant="primary" @click="savePrint(false)" :disabled="printingPDF">                    
                    <spinner color="#FFF" v-if="printingPDF" style="margin:0; padding: 0; height:1.9rem; transform:translate(0px,-25px);"/>
                    <span style="font-size: 18px;" v-else>
                        <i class="h3 mdi mdi-email"></i>
                        <b class="ml-2" >Send Email</b>
                    </span>
                </b-button>
            </div>
        </div>
        <hr v-if="position=='top'" />
        
    </div> 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Spinner from '@/components/utils/Spinner.vue'

@Component({
    components:{
        Spinner,
    }
})

export default class EmailButtonBar extends Vue {


    @Prop({required: true})
    position!:string

    @Prop({required: true})
    pdfType!: string;

    @Prop({required: true})
    printingPDF!: boolean

    public savePrint(emailIt){
        this.$emit('savePrint', emailIt)
    }

    public closePrint(){
        this.$emit('closePrint')
    }
}
</script>