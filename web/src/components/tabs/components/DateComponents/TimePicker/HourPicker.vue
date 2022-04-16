<template>
    <div style="margin:1rem 0 0 1rem; width:23%;" >
        <b-form-input
           :tabindex="type=='end'?4:1"
            @focus ="focus"
            v-model="selectedTime.hour"
            :formatter="hourFormatter"
            style="font-size:12pt; margin:0; padding:0.2rem; width:1.75rem; height:1.75rem;" /> 
        <b-card 
            v-if="selectedTime.focusHour" 
            style="margin:0.2rem 0.1rem; height:15.35rem; width:1.5rem;" no-body >                            
            <b-button 
                v-for="hour in hours" :key="hour" 
                @click="clicked(hour)" 
                style="font-size:8pt; margin:0.07rem 0.1rem; padding:0 0rem" 
                variant="info" 
                size="sm" 
                :disabled="selectedTime.hour==hour">
                    {{hour}}
            </b-button>
        </b-card>
    </div>          
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class TimePicker extends Vue {
    
    @Prop({required: true})
    selectedTime!: any;

    @Prop({required: true})
    type!: string;
   
    hours=  ['01','02','03','04','05','06','07','08','09','10','11','12']

    mounted(){
        //console.log(this.selectedTime)
    }
    

    public hourFormatter(value){
        if(isNaN(Number(value.slice(-1)))) return value.slice(0,-1)
        if(value.length>2) return value.slice(0,2);
        if(value.length==1 && value>1) return value.slice(0,-1);
        if(value.length==2 && value>12) return value.slice(0,-1);
        return value
    }

    public focus(){
        this.selectedTime.focusAmPm = false
        this.selectedTime.focusMinute = false
        this.selectedTime.focusHour = true 
        this.$emit('focusChanged', this.type)       
    }

    public clicked(hour){
        this.selectedTime.hour = hour
    }
   
}
</script>
