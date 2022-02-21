<template>
    <div>
        <b-row class="my-1"> 
            <b-form-radio-group  v-model="selectedMethod" stacked @change="ScheduleChanged" >
                <b-form-radio value="manual">Manual</b-form-radio>
                
                <b-form-radio value="daily" class="my-3"> 
                    <b-row class="m-0" >
                        Every 
                        <b-form-select :disabled="selectedMethod!='daily'" v-model="selectedDays" @change="ScheduleChanged" :options="dayOptions" style="margin:-0.25rem 0.75rem 0 0.75rem; width:4rem;" ></b-form-select>
                        <b>day</b><b v-if="selectedDays>1">s</b> <span class="ml-2">at</span> 
                        <b-form-select :disabled="selectedMethod!='daily'" v-model="selectedHours" @change="ScheduleChanged" :options="hourOptions" style="margin:-0.25rem 0.5rem 0 0.75rem; width:4rem;" ></b-form-select>
                        : 
                        <b-form-select :disabled="selectedMethod!='daily'" v-model="selectedMin" @change="ScheduleChanged" :options="minOptions" style="margin:-0.25rem 0.5rem 0 0.5rem; width:4.2rem;" ></b-form-select>
                        <b-form-select :disabled="selectedMethod!='daily'" v-model="selectedAmpm" @change="ScheduleChanged" :options="ampmOptions" style="margin:-0.25rem 0rem 0 0.25rem; width:4.5rem;" ></b-form-select>                    
                    </b-row>
                </b-form-radio>

                <b-form-radio value="monthly">
                    <b-row class="m-0" >
                        Every 
                        <b-form-select :disabled="selectedMethod!='monthly'" v-model="selectedMonths" @change="ScheduleChanged" :options="monthOptions" style="margin:-0.25rem 0.75rem 0 0.75rem; width:4rem;" ></b-form-select>
                        <b>month</b><b v-if="selectedMonths>1">s</b><span class="ml-2">on day</span>
                        <b-form-select :disabled="selectedMethod!='monthly'" v-model="selectedMonthDays" @change="ScheduleChanged" :options="dayOptions" style="margin:-0.25rem 0.75rem 0 0.75rem; width:4rem;" ></b-form-select>
                        <span class="ml-2">at</span> 
                        <b-form-select :disabled="selectedMethod!='monthly'" v-model="selectedMonthHours" @change="ScheduleChanged" :options="hourOptions" style="margin:-0.25rem 0.5rem 0 0.75rem; width:4rem;" ></b-form-select>
                        : 
                        <b-form-select :disabled="selectedMethod!='monthly'" v-model="selectedMonthMin" @change="ScheduleChanged" :options="minOptions" style="margin:-0.25rem 0.5rem 0 0.5rem; width:4.2rem;" ></b-form-select>
                        <b-form-select :disabled="selectedMethod!='monthly'" v-model="selectedMonthAmpm" @change="ScheduleChanged" :options="ampmOptions" style="margin:-0.25rem 0rem 0 0.25rem; width:4.5rem;" ></b-form-select>                    
                    </b-row>
                </b-form-radio>
            </b-form-radio-group>
        
            <b-button v-if="saveRequire" @click="SaveSchedule" variant="danger" class="ml-2 my-2"  style="height:8rem">Save</b-button>
            
        </b-row>
    </div>
</template>

<script lang="ts">
import { range } from 'underscore';
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment-timezone'

@Component
export default class UpdateSchedule extends Vue {
    @Prop({required: true})
    id!: number;
    
    @Prop({required: true})
    schedule!: string; 

    selectedMethod='manual'

    selectedDays=1
    selectedHours=12
    selectedMin="45"
    selectedAmpm="AM"
    dayOptions=[]
    hourOptions=[]
    minOptions=['00','15','30','45']
    ampmOptions=['AM','PM']

    selectedMonths=1
    selectedMonthDays=1
    selectedMonthHours=12
    selectedMonthMin="45"
    selectedMonthAmpm="AM"
    monthOptions=[]
    
    saveRequire= false

    mounted(){
        this.dayOptions=range(1,29)
        this.hourOptions=range(1,13)
        this.monthOptions=range(1,13)
        this.extractInfo()
    }

    public extractInfo(){

        if(this.schedule){
            const sch = JSON.parse(this.schedule)
            const timeH = this.convertTime(Number(sch.hour))
            if(sch.months ==0){
                this.selectedMethod = 'daily'
                this.selectedDays = sch.days
                this.selectedHours = timeH.hour
                this.selectedMin = sch.minute
                this.selectedAmpm = timeH.ampm
            }
            else{
                this.selectedMethod = 'monthly'
                this.selectedMonths = sch.months
                this.selectedMonthDays = sch.days
                this.selectedMonthHours = timeH.hour
                this.selectedMonthMin = sch.minute
                this.selectedMonthAmpm = timeH.ampm
            }
        }
    }

    public convertTime(hour: number){
        if(hour==0) return {hour:12, ampm:"AM"}
        if(hour==12)return {hour:12, ampm:"PM"}
        if(hour>12)return {hour:(hour-12), ampm:"PM"}
        return {hour:hour, ampm:"AM"}
    }

    public ScheduleChanged(){
        this.saveRequire = true
    }


    public GetTime(months, days, hour, ampm, minute){

        const timedifference = moment().utcOffset()/60;

        if(hour==12) hour=0;
        if(ampm=="PM") hour=(hour+12)%24;

        const time = {
            "reftime":moment().format(),
            "months":months,            
            "days": days,
            "hour":hour,
            "minute":minute,
            "tz":timedifference
        }

        return JSON.stringify(time)
    }


    public SaveSchedule(){

        let schedule = null

        if(this.selectedMethod=='daily') 
            schedule = this.GetTime(0,this.selectedDays, this.selectedHours, this.selectedAmpm, this.selectedMin)    
        else if(this.selectedMethod=='monthly') 
            schedule = this.GetTime(this.selectedMonths, this.selectedMonthDays, this.selectedMonthHours, this.selectedMonthAmpm, this.selectedMonthMin)
       
        const body = {"update_schedule":schedule}
        const url = '/geo/update-schedule/'+this.id
        this.$http.put(url, body)
        .then((response) => {
            this.saveRequire= false
            this.$emit('reload')
        },(err) => {            
        });
    }

}
</script>