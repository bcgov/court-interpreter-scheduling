<template>
                        
    <b-card border-variant="white" body-class="mx-1 px-1 py-0">        

        <div class="my-1 pb-0" style="line-height:1rem; font-size:14pt; color:#AB0">
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
   
    period = {start:'' , end:'', start1:'', end1:''}
    selectedTime = {} as bookingTimeInfoType

    bookingPeriodOptions=[
        {text:'Morning', value:{start:'09:30 AM',end:'12:30 PM', start1:'', end1:''}},
        {text:'Afternoon', value:{start:'01:30 PM',end:'04:00 PM', start1:'', end1:''}},
        {text:'Morning&Afternoon', value:{start:'09:30 AM',end:'12:30 PM', start1:'01:30 PM', end1:'04:00 PM'}}
    ]


    mounted(){     
        this.initiatePickedTime()
    }

  
    public initiatePickedTime()
    {
        let bookingOptions=[]
        for(const option of this.bookingPeriodOptions){
            for(const pickedTime of this.pickedTimes){            
                if(option.value.start == pickedTime.start && option.value.end == pickedTime.end){
                    bookingOptions.push(option.text)                    
                }
                // if(option.value.start1 && option.value.end1 && option.value.start1 == pickedTime.start && option.value.end1 == pickedTime.end){
                //     bookingOptions.push(option.text)                    
                // }
            }
        }
        if(bookingOptions.length>0){
            console.log(bookingOptions)
            
            if(bookingOptions.includes('Morning') && bookingOptions.includes('Afternoon'))
                this.period = this.bookingPeriodOptions.filter(opt => opt.text=='Morning&Afternoon')[0].value
            else if(bookingOptions.includes('Morning'))
                this.period = this.bookingPeriodOptions.filter(opt => opt.text=='Morning')[0].value
            else if(bookingOptions.includes('Afternoon'))
                this.period = this.bookingPeriodOptions.filter(opt => opt.text=='Afternoon')[0].value                

            //console.log(this.period)
        }else
            this.period = {start:'' , end:'', start1:'', end1:''} 
    }

    public duplicateTime(time){

        const start = moment(time.start, "hh:mm A").format()   
        const end = moment(time.end, "hh:mm A").format()
        const start1 = time.start1? moment(time.start1, "hh:mm A").format():''   
        const end1 = time.end1? moment(time.end1, "hh:mm A").format():''

        for(const pickedTime of this.pickedTimes){
            const pickedStart = moment(pickedTime.start, "hh:mm A").format()   
            const pickedEnd = moment(pickedTime.end, "hh:mm A").format()
            if(!((start>=pickedEnd && end >pickedEnd)||(start<pickedStart && end <=pickedStart)))
                return true
            if(start1 && end1 && !((start1>=pickedEnd && end1>pickedEnd)||(start1<pickedStart && end1<=pickedStart)))
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
        else{
            if(this.period.start1 && this.period.end1){
                this.$emit('addTime',[
                    {start:this.period.start , end:this.period.end },
                    {start:this.period.start1, end:this.period.end1}
                ], true)
            }else
                this.$emit('addTime',[{start:this.period.start , end:this.period.end }], true)
        }
    }
   
}
</script>
