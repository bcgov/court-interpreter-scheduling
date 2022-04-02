<template>
                        
    <b-card border-variant="primary" body-class="m-0 px-2 py-1">        

        <b-card class="mt-0 mb-1" border-variant="white" body-class="m-0 p-0 text-center" >
            <b-button style="width:4.5rem;font-size:9pt" class="float-left m-1 px-0 py-1" variant="dark" @click="addTime('cancel')">Cancel</b-button>
            <b-row      
                v-b-tooltip.hover                         
                :title="duplicateTime?'This time already has been included. Please change the time!':''"
                style="margin:0; padding:0;"
                >
                <b-button 
                    style="width:5.6rem;font-size:9pt" 
                    class="float-right m-1 px-0 py-1" 
                    :variant="duplicateTime?'danger':'success'" 
                    @click="addTime('add')" 
                    :disabled="duplicateTime"                    
                >
                    <span v-if="!duplicateTime">
                        Add Time
                    </span>
                    <span style="font-size:7.5pt;" v-else>
                        Already Included
                    </span>
                </b-button>
            </b-row>
            
        </b-card>

        <b-card  class="mt-1" body-class="m-0 p-0 text-center" header="Time" header-class="bg-primary text-white text-center h4 m-0 p-1">
            <div style="display:inline-block; font-size:20pt;">
                <b-badge class="m-1 p-1" variant="warning">{{selectedHour}}</b-badge>
                <b-badge class="m-0 p-0" variant="white">:</b-badge>  
                <b-badge class="m-1 p-1" variant="warning">{{selectedMinute}}</b-badge>
                <b-badge class="m-1 p-1" variant="warning">{{selectedAmPm}}</b-badge> 
                                      
            </div>
        </b-card>
        
        <b-card class="mt-2" body-class="m-0 p-0 text-center" header="Hour" header-class="bg-select text-center h4 m-0 p-0">
            <div style="display:inline-block" v-for="hour in hours" :key="hour">
                <b-button @click="selectedHour=hour" style="margin:0.1rem 0.15rem; padding:0 0.15rem" variant="info" size="sm" :disabled="selectedHour==hour">
                    {{hour}}
                </b-button>
            </div>
        </b-card>
        <b-card class="mt-1" body-class="m-0 p-0 text-center" header="Minute" header-class="bg-select text-center h4 m-0 p-0">
            <div style="display:inline-block" v-for="minute in minutes" :key="minute">
                <b-button @click="selectedMinute=minute" style="margin:0.1rem 0.15rem; padding:0 0.15rem" variant="info" size="sm" :disabled="selectedMinute==minute">
                    {{minute}}
                </b-button>
            </div>
        </b-card>
        <b-card class="mt-1" body-class="m-0 p-0 text-center" header="AM/PM" header-class="bg-select text-center h4 m-0 p-0">
            <div style="display:inline-block" v-for="ampm in ampms" :key="ampm">
                <b-button @click="selectedAmPm=ampm" class="m-1 py-0 px-1" variant="info" size="sm" :disabled="selectedAmPm==ampm">
                    {{ampm}}
                </b-button>
            </div>
        </b-card>
        

    </b-card>
                        
                 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class TimePicker extends Vue {
    
    @Prop({required: true})
    pickedTimes!: string[];

   
    hours=  ['01','02','03','04','05','06','07','08','09','10','11','12']
    minutes=['00','05','10','15','20','25','30','35','40','45','50','55']
    ampms=['AM','PM']
    selectedHour = '09'
    selectedMinute ='00'
    selectedAmPm = 'AM'  

    mounted(){
        // console.log(this.pickedTimes)
    }

    get duplicateTime(){
        const time = (this.selectedHour +':'+ this.selectedMinute +' '+ this.selectedAmPm);       
        return this.pickedTimes.includes(time)
    }
    
    public addTime(type){
        const time = type=='cancel'? '' : (this.selectedHour +':'+ this.selectedMinute +' '+ this.selectedAmPm);
        this.$emit('addTime',time)
    }
   
}
</script>
