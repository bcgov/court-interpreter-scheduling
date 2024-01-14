<template>

    <div style="margin:1rem 0 0 0rem; width:25%;">
        <b-form-input
            :tabindex="type=='end'?6:3"
            @focus ="focus"
            :class="selectedTime.focusAmPm?'focused':'unfocused'"
            v-model="selectedTime.ampm"
            :formatter="amPmFormatter"                    
            style="font-size:11pt; margin:0; padding:0.1rem; width:1.75rem; height:1.75rem;" />           
        <b-card 
            tabindex="-1"
            v-if="this.selectedTime.focusAmPm" 
            style="margin:0.2rem 0.15rem 0.2rem -3.8rem; height:6rem; width:5.5rem;" no-body>
            <b style="font-size:14pt; line-height:1.45rem; color:#552" class="text-center">AM/PM</b>
            <b-button
                tabindex="-1"
                v-for="ampm in ampms" :key="ampm"
                @click="clicked(ampm)" 
                style="font-size:15pt; margin:0.12rem 0.15rem; padding:0 0rem"
                variant="primary" 
                size="sm" 
                :disabled="selectedTime.ampm==ampm">
                    <b>{{ampm}}</b>
            </b-button>
        </b-card>
    </div>          
                 
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';


@Component
export default class AmPmPicker extends Vue {
    
    @Prop({required: true})
    selectedTime!: any;
    
    @Prop({required: true})
    type!: string;

    ampmHistory='';
    ampms=['AM','PM']
   
    mounted(){
        // console.log(this.pickedTimes)
    }

    @Watch('selectedTime.focusAmPm')
    ampmFocused(){
        this.ampmHistory=this.selectedTime.ampm;
    }

    public amPmFormatter(ampm){
        let result=''
        const value = ampm.toLowerCase()
        if(value.length>2) result = value.slice(0,2).toUpperCase();
        else if(value.length==1 && (value=='a' || value=='p')&&(this.ampmHistory=='AM' || this.ampmHistory=='PM')) result='';
        else if(value.length==1 && value!='a' && value!='p') result = value.slice(0,-1).toUpperCase();
        else if(value.length==1 && (value=='a' || value=='p')) result = (value.toUpperCase()+'M');
        else if(value.length==2 && value.slice(1,2)!='m') result = value.slice(0,-1).toUpperCase();
        else result = value.toUpperCase()
        this.ampmHistory = result;
        return result
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

<style scoped lang="scss">
    .focused {
        border: 2px solid #f0bc1e !important;
        position:relative;
        font-size: 15pt !important;
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