<template>            
    <div style="margin:1rem 0 0 0rem; width:23%;">
        <b-form-input
            :tabindex="type=='end'?5:2"
            @focus ="focus()"
            :class="selectedTime.focusMinute?'focused':'unfocused'"
            v-model="selectedTime.minute"
            :formatter="minuteFormatter"                    
            style="font-size:12pt; margin:0; padding:0.2rem; width:1.75rem; height:1.75rem;" />  
        <b-card 
            tabindex="-1"
            v-if="selectedTime.focusMinute" 
            style="margin:0.2rem 0.1rem 0.2rem -2.03rem; height:14.9rem; width:5.5rem;" no-body>        
            <b style="font-size:14pt; line-height:1.45rem; color:#552" class="text-center">Minute</b>
            <b-row class="mx-1 mt-n1">
                <b-button
                    tabindex="-1"
                    v-for="minute in minutes" :key="minute"
                    @click="clicked(minute)" 
                    style="font-size:15pt; margin:0.12rem 2%; padding:0 0.24rem; width:46%" 
                    variant="primary" 
                    size="sm" 
                    :disabled="selectedTime.minute==minute">
                        <b>{{minute}}</b>
                </b-button>
            </b-row>
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

<style scoped lang="scss">
    .focused {
        border: 2px solid #f0bc1e !important;
        position:relative;
        font-size: 18pt !important;
        margin-top: -0.25rem !important;
        margin-left:-0.5rem !important;
        width: 2.5rem !important;
        height: 2rem !important;
        box-shadow: 2px 2px 6px #f0bc1e !important; 
    }
    .unfocused {
        cursor: pointer;
    }
    button.disabled {
        color: rgb(255, 0, 0);
        background: #f0bc1e;
    }
</style>