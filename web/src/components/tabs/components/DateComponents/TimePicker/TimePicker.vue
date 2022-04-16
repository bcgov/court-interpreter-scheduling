<template>
                        
    <b-card border-variant="primary" body-class="m-0 px-2 py-0">        

        <b-card class="mt-0" border-variant="white" body-class="m-0 p-0 text-center" >
            <b-button style="width:5.5rem;font-size:9pt" class="float-left m-1 px-0 py-1" variant="dark" @click="addTime('cancel')">Cancel</b-button>
            <b-row      
                v-b-tooltip.hover                         
                :title="duplicateTime=='conflict'?'This time already has been included. Please change the time!':(duplicateTime=='after'? 'The Start Time is after or equal to the End Time. Please change the time!':'')"
                style="margin:0; padding:0;"
                >
                <b-button 
                    tabindex="7"
                    style="width:5.6rem;font-size:9pt" 
                    class="float-right m-1 px-0 py-1" 
                    :variant="duplicateTime=='add'?'success':'danger'" 
                    @click="addTime('add')" 
                    :disabled="duplicateTime !='add'"                    
                >
                    <span v-if="duplicateTime=='after'" style="font-size:7.5pt;">
                        Start after End
                    </span>
                     <span v-else-if="duplicateTime=='conflict'" style="font-size:7.5pt;">
                        Already Included
                     </span>
                    <span  v-else>
                        Add Time
                    </span>
                </b-button>
            </b-row>
            
        </b-card>

       
        <b-row class="mt-1">
            <b-card style="width:6rem; height:19.5rem; margin-left: 0.75rem;" no-body header="Start Time" header-class="bg-primary text-white text-center h4 m-0 p-1">
                <b-row>
                    <hour-picker @focusChanged="focusChanged" type="start" :selectedTime="selectedStartTime"  />           
                    <div style="margin:0.75rem 0 0 0rem; width:5%; padding-left:0.06rem;"  class="" >
                        :
                    </div>
                    <minute-picker @focusChanged="focusChanged" type="start" :selectedTime="selectedStartTime"  />     
                    <am-pm-picker @focusChanged="focusChanged" type="start" :selectedTime="selectedStartTime"  /> 
                </b-row>
            </b-card>       

            <b-card style="width:6rem; height:19.5rem; margin-left:0.25rem;" no-body header="End Time" header-class="bg-time text-white text-center h4 m-0 p-1">
                <b-row>                    
                    <hour-picker @focusChanged="focusChanged" type="end" :selectedTime="selectedEndTime"  />     
                    <div style="margin:0.75rem 0 0 0rem; width:5%; padding-left:0.06rem;"  class="" >
                        :
                    </div>
                    <minute-picker @focusChanged="focusChanged" type="end" :selectedTime="selectedEndTime"  />
                    <am-pm-picker @focusChanged="focusChanged" type="end" :selectedTime="selectedEndTime"  />                    
                </b-row>
            </b-card>

        </b-row>

    </b-card>
                        
                 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import HourPicker from "./HourPicker.vue"
import MinutePicker from "./MinutePicker.vue"
import AmPmPicker from "./AmPmPicker.vue"
import moment from 'moment';
import { bookingTimeInfoType } from '@/types/Bookings/json';

@Component({
    components:{
        HourPicker,
        MinutePicker,
        AmPmPicker
    }
})
export default class TimePicker extends Vue {
    
    @Prop({required: true})
    pickedTimes!: bookingTimeInfoType[];
   

    selectedStartTime = { 
        hour:'09', focusHour:false,
        minute:'00',focusMinute:false,
        ampm:'AM', focusAmPm:false,
    } 
    selectedEndTime = { 
        hour:'04', focusHour:false,
        minute:'00',focusMinute:false,
        ampm:'PM', focusAmPm:false,
    }

   


    mounted(){        
        //console.log(this.pickedTimes)
    }

    get duplicateTime(){

        const time = this.getTime()
        const start = moment(time.start, "hh:mm A").format()   
        const end = moment(time.end, "hh:mm A").format()
        if(start >= end) return 'after'

        for(const pickedTime of this.pickedTimes){
            const pickedStart = moment(pickedTime.start, "hh:mm A").format()   
            const pickedEnd = moment(pickedTime.end, "hh:mm A").format()
            if(!((start>=pickedEnd && end >pickedEnd)||(start<pickedStart && end <=pickedStart)))
                return 'conflict'

        }
        return 'add'
    }

    public getTime(){
        const start = this.selectedStartTime.hour+':'+ this.selectedStartTime.minute+' '+this.selectedStartTime.ampm 
        const end = this.selectedEndTime.hour+':'+ this.selectedEndTime.minute+' '+this.selectedEndTime.ampm 
        return {start:start, end:end}
    }
    
    public addTime(type){        

        const time = type=='cancel'? {start:'', end:''} : this.getTime()

        this.$emit('addTime',time)
    }

    public focusChanged(type){

        if(type=='end'){
            this.selectedStartTime.focusHour=false;
            this.selectedStartTime.focusMinute=false;
            this.selectedStartTime.focusAmPm=false;
        }else if(type=='start'){
            this.selectedEndTime.focusHour=false;
            this.selectedEndTime.focusMinute=false;
            this.selectedEndTime.focusAmPm=false;
        }
        
        this.selectedStartTime.hour = this.autoCorrectTime(this.selectedStartTime.hour) 
        this.selectedStartTime.minute = this.autoCorrectTime(this.selectedStartTime.minute) 
        this.selectedStartTime.ampm = this.autoCorrectAmPm(this.selectedStartTime.ampm)
        
        this.selectedEndTime.hour = this.autoCorrectTime(this.selectedEndTime.hour) 
        this.selectedEndTime.minute = this.autoCorrectTime(this.selectedEndTime.minute)
        this.selectedEndTime.ampm = this.autoCorrectAmPm(this.selectedEndTime.ampm)
    }

    public autoCorrectTime(value){
        if(value.length==0) return '00'
        if(value.length==1) return value+'0'
        return value
    }

    public autoCorrectAmPm(value){
        if(value.length==0) return 'AM'
        if(value.length==1) return value+'M'
        return value
    }

   
}
</script>
