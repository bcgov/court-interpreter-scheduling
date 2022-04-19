<template>

    <div style="margin:1rem 0 0 0rem; width:25%;">
        <b-form-input
            :tabindex="type=='end'?6:3"
            @focus ="focus"
            v-model="selectedTime.ampm"
            :formatter="amPmFormatter"                    
            style="font-size:11pt; margin:0; padding:0.1rem; width:1.75rem; height:1.75rem;" />           
        <b-card v-if="this.selectedTime.focusAmPm" style="margin:0.2rem 0.15rem; height:2.7rem; width:1.5rem;" no-body>
            <b-button
                v-for="ampm in ampms" :key="ampm"
                @click="clicked(ampm)" 
                style="font-size:7.5pt; margin:0.07rem 0.1rem; padding:0 0rem"
                variant="info" 
                size="sm" 
                :disabled="selectedTime.ampm==ampm">
                    {{ampm}}
            </b-button>
        </b-card>
    </div>          
                 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class AmPmPicker extends Vue {
    
    @Prop({required: true})
    selectedTime!: any;
    
    @Prop({required: true})
    type!: string;

    ampms=['AM','PM']
   
    mounted(){
        // console.log(this.pickedTimes)
    }

    public amPmFormatter(ampm){
        const value = ampm.toLowerCase()
        if(value.length>2) return value.slice(0,2).toUpperCase();
        if(value.length==1 && value!='a' && value!='p') return value.slice(0,-1).toUpperCase();
        if(value.length==2 && value.slice(1,2)!='m') return value.slice(0,-1).toUpperCase();
        return value.toUpperCase()
    }

    public focus(){
        this.selectedTime.focusHour = false
        this.selectedTime.focusMinute = false
        this.selectedTime.focusAmPm = true
        this.$emit('focusChanged', this.type)
    }

    public clicked(ampm){
        this.selectedTime.ampm = ampm
    }
   
}
</script>
