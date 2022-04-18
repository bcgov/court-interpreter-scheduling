<template>
                        
    <b-card border-variant="white" body-class="mx-1 px-2 py-0">        

        <div class="my-0 pb-0" style="line-height:1rem; font-size:14pt; color:#AB0">
            <b>Time Options</b>           
        </div>

        <div>
            <b-form-radio-group
                v-model="period" 
                @change="periodChanged"                       
                size="lg"
                class="text-primary"
            >
                <b-form-radio 
                    v-for="option,inx in bookingPeriodOptions"                     
                    :key="'radio'+inx" 
                    :value="option.value" 
                    class="mt-0">
                        {{option.text}}
                </b-form-radio>
            </b-form-radio-group>
            
        </div>

    </b-card>
                        
                 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import moment from 'moment';
import { bookingTimeInfoType } from '@/types/Bookings/json';

@Component
export default class DefaultTimeSelector extends Vue {
    
    @Prop({required: true})
    pickedTimes!: bookingTimeInfoType[];
   
    period = {start:'' , end:''} as bookingTimeInfoType
    selectedTime = {} as bookingTimeInfoType

    bookingPeriodOptions=[
        {text:'Morning', value:{start:'09:30 AM',end:'12:30 PM'}},
        {text:'Afternoon', value:{start:'01:30 PM',end:'04:00 PM'}},
        {text:'Full Day', value:{start:'09:30 AM',end:'04:00 PM'}}
    ]


    mounted(){     
        this.initiatePickedTime()
    }

  
    public initiatePickedTime()
    {
        for(const pickedTime of this.pickedTimes){
            for(const option of this.bookingPeriodOptions){
                if(option.value.start == pickedTime.start && option.value.end == pickedTime.end){
                    this.period = option.value
                    return 
                }
            }
        }
        this.period = {start:'' , end:''} as bookingTimeInfoType
    }

    public duplicateTime(time){

        const start = moment(time.start, "hh:mm A").format()   
        const end = moment(time.end, "hh:mm A").format()

        for(const pickedTime of this.pickedTimes){
            const pickedStart = moment(pickedTime.start, "hh:mm A").format()   
            const pickedEnd = moment(pickedTime.end, "hh:mm A").format()
            if(!((start>=pickedEnd && end >pickedEnd)||(start<pickedStart && end <=pickedStart)))
                return true

        }
        return false
    }


    public removeDefaultPickedTime()
    {
        const inxToRemove = []
        for(const index in this.pickedTimes){
            const pickedTime = this.pickedTimes[index]
            for(const option of this.bookingPeriodOptions){
                if(option.value.start == pickedTime.start && option.value.end == pickedTime.end){
                    inxToRemove.push(index)
                    break
                }
            }
        }

        for (let i = inxToRemove.length -1; i >= 0; i--)
            this.pickedTimes.splice(inxToRemove[i],1);
    }

    public periodChanged(){

        this.removeDefaultPickedTime()
        
        if(this.duplicateTime(this.period))
            this.initiatePickedTime()
        else
            this.$emit('addTime',this.period)
    }
   
}
</script>
