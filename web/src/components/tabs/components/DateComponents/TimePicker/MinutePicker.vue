<template>            
    <div style="margin:1rem 0 0 0rem; width:23%;">
        <b-form-input
            :tabindex="type=='end'?5:2"
            @focus ="focus()"
            v-model="selectedTime.minute"
            :formatter="minuteFormatter"                    
            style="font-size:12pt; margin:0; padding:0.2rem; width:1.75rem; height:1.75rem;" />  
        <b-card v-if="selectedTime.focusMinute" style="margin:0.2rem 0.1rem; height:15.35rem; width:1.5rem;" no-body>        
            <b-button
                v-for="minute in minutes" :key="minute"
                @click="clicked(minute)" 
                style="font-size:8pt; margin:0.07rem 0.1rem; padding:0 0rem" 
                variant="info" 
                size="sm" 
                :disabled="selectedTime.minute==minute">
                    {{minute}}
            </b-button>
        </b-card>
    </div>     
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class MinutePicker extends Vue {
    
    @Prop({required: true})
    selectedTime!: any;  

    @Prop({required: true})
    type!: string;

    minutes=['00','05','10','15','20','25','30','35','40','45','50','55']


    mounted(){
        // console.log(this.pickedTimes)
    }
   
    public minuteFormatter(value){
        if(isNaN(Number(value.slice(-1)))) return value.slice(0,-1)
        if(value.length>2) return value.slice(0,2);
        if(value.length==1 && value>5) return value.slice(0,-1);
        if(value.length==2 && value.slice(1,2)!=0 && value.slice(1,2)!=5) return value.slice(0,-1);
        return value
    }  
    
    public focus(){
        this.selectedTime.focusAmPm = false         
        this.selectedTime.focusHour = false  
        this.selectedTime.focusMinute = true 
        this.$emit('focusChanged', this.type)   
    }

    public clicked(minute){
        this.selectedTime.minute = minute
    }
   
}
</script>
