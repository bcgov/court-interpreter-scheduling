<template>
    <b-card   class="border-0 bg-light" header-class="h3 bg-select text-primary" style="width:23%; margin:0 0.5rem;">
        <template #header>
            {{name}} <b v-if="level" class="h4">( Level {{level}} ) </b>
        </template>
        <b-row class="mt-n2">
            <b-col cols="6" class="px-2">
                <label class="labels">Previous Rate:</label>
                <b-input-group
                    prepend="$"
                    :append="unit"
                    size="sm">
                    <b-form-input                               
                        :formatter="rateFormatter"
                        v-model="rate.previousValue"
                        @input="previousRateChanged"
                        :state="previousRateState"
                    />
                </b-input-group>
            </b-col> 
            <b-col cols="6" />
        </b-row>
        <b-row class="mt-2">
            <b-col cols="6" class="px-2">
                <label class="labels">New Rate:</label>
                <b-input-group
                    prepend="$"
                    :append="unit"
                    size="sm">
                    <b-form-input 
                        :formatter="rateFormatter"
                        v-model="rate.value"
                        @input="rateChanged"
                        :state="rateState"
                    />
                </b-input-group>
            </b-col>                   
        
            <b-col  cols="6" class="px-2">
                <label class="labels">Effective Date:</label>
                <b-form-input
                    v-model="rate.valueChangedDate"
                    size="sm"
                    @input="dateChanged"
                    type="date"
                    :min="minDate"
                    :max="maxDate"
                    :state="dateState"
                />
            </b-col>
        </b-row>
    </b-card>
           
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { rateJsonInfoType } from '@/types/Common';

@Component
export default class RateBox extends Vue {
    @Prop({required: true})
    rate!: rateJsonInfoType;
    
    @Prop({required: true})
    name!: string;

    @Prop({required: true})
    unit!: string;
    
    @Prop({required: true, default:''})
    level!: string;

    previousRateState = null
    rateState = null
    dateState = null
    minDate="2020-01-01"
    maxDate="2040-01-01"

    mounted(){
        this.dateState= null
        this.previousRateState = null
        this.rateState = null
    }

    public dateChanged(date){
        if(!date || (date<this.minDate) || (date>this.maxDate)){
            this.dateState = false
            this.changes(false)
        }
        else{
            this.dateState = null
            this.changes(true)
        }
    }
    
    public previousRateChanged(rate){
        if(!rate || Number(rate)<=0){
            this.previousRateState = false
            this.changes(false)
        }
        else{
            this.previousRateState = null
            this.changes(true)
        }
    }

    public rateChanged(rate){
        if(!rate || Number(rate)<=0){
            this.rateState = false
            this.changes(false)
        }
        else{
            this.rateState = null
            this.changes(true)
        }
    }

    public changes(status){
        this.$emit('rateChanged', status)
    }


    public rateFormatter(value){
        const max = 1000;        
        const lastChar =  value.slice(-1);
        if(lastChar != '.' && isNaN(Number(lastChar))) return value.slice(0,-1)
        if(lastChar =='.' && value.slice(0,-1).includes('.')) return value.slice(0,-1)
        // if(value.length>len) return value.slice(0,-1)
        const dotInx = value.indexOf('.')
        if(dotInx==0) return ('0'+value)
        if(dotInx>-1 && value.length-dotInx>3)return value.slice(0,-1)
        if(Number(value)>max) return '0'
        return value    
    }


    

}
</script>

<style scoped lang="scss">
    .labels {
        font-size: 14px; 
        font-weight: 600;
        margin-bottom: 0rem ;
    }
</style>

