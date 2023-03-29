<template>
    <b-card bg-variant="white" border-variant="white">
        <b-overlay :show="dismissCountDown>0" style="width:20rem; margin:0 auto;"> 
            <div style="width:20rem; font-size:24pt; font-weight:600; margin:0 auto;" class="text-center">Rates</div>
            <template v-slot:overlay>               
                <b-alert style="margin: auto 0; width:20rem" :variant="alertType" :show="dismissCountDown"  @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">
                    <b v-if="alertType=='success'" class="pl-4 ml-5"> Rate Saved <b-icon-check-square-fill class="ml-2"/> </b>
                    <b v-else class="pl-5 ml-5"> Error <b-icon-exclamation-circle-fill class="ml-2"/> </b>
                </b-alert>            
            </template> 
        </b-overlay> 
            
        <loading-spinner color="#000" v-if="!dataLoaded" waitingText="Loading ..." />        
        <b-card no-body v-else class="home-content border-white p-0">

            <b-card-group deck>
                <rate-box :rate="allRates[rates.spkl1]" unit="/hour" name="Spoken Language" level="1" @rateChanged="rateChanged"/>
                <rate-box :rate="allRates[rates.spkl2]" unit="/hour" name="Spoken Language" level="2" @rateChanged="rateChanged"/>
                <rate-box :rate="allRates[rates.spkl3]" unit="/hour" name="Spoken Language" level="3" @rateChanged="rateChanged"/>
                <rate-box :rate="allRates[rates.spkl4]" unit="/hour" name="Spoken Language" level="4" @rateChanged="rateChanged"/>
            </b-card-group>
            
            <b-card-group deck class="mt-4">
                <rate-box :rate="allRates[rates.asl1]" unit="/hour" name="ASL" level="1" @rateChanged="rateChanged"/>
                <rate-box :rate="allRates[rates.asl2]" unit="/hour" name="ASL" level="2" @rateChanged="rateChanged"/>
                <b-card class="border-0 bg-white" style="width:23%; margin:0 0.5rem;" />
                <rate-box :rate="allRates[rates.cart]" unit="/hour" name="CART" level="" @rateChanged="rateChanged"/>
            </b-card-group>

            <b-card-group deck class="mt-4">
                <rate-box :rate="allRates[rates.breakfast]" unit="/day" name="Breakfast" level="" @rateChanged="rateChanged"/>
                <rate-box :rate="allRates[rates.lunch]" unit="/day" name="Lunch" level="" @rateChanged="rateChanged"/>
                <rate-box :rate="allRates[rates.dinner]" unit="/day" name="Dinner" level="" @rateChanged="rateChanged"/>
                <rate-box :rate="allRates[rates.mileage]" unit="/km" name="Mileage" level="" @rateChanged="rateChanged"/>
            </b-card-group>
            

            <b-row class="mt-5">
                <b-col cols="2" class="h4 my-auto">
                    <b-button style="float: right;" variant="secondary" @click="cancelChanges">Cancel Changes</b-button> 
                </b-col>

                <b-col cols="6"></b-col>
                
                <b-col cols="3" class="ml-0 pl-0 my-auto py-0">
                    <b-button v-if="enableSaveButton" style="float: right;" variant="success" @click="saveChanges">
                        <spinner color="#FFF" v-if="savingData" style="margin:0; padding: 0; height:1.9rem; transform:translate(0px,-25px);"/>
                        <span v-else> Save Changes</span>
                    </b-button>
                </b-col>
            </b-row>  
           
        </b-card>

    </b-card>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import { namespace } from "vuex-class";
import moment from 'moment';
import "@/store/modules/common";
const commonState = namespace("Common");

import { rateJsonInfoType, ratesInfoType } from '@/types/Common';
import {getRatesIndices} from "./RateFunctions"
import Spinner from '@/components/utils/Spinner.vue'

import RateBox from './components/RateBox.vue'

@Component({
    components:{
        Spinner,
        RateBox
    }
})
export default class Rates extends Vue {

    @commonState.Action
    public UpdateRates!: (newRates: rateJsonInfoType[]) => void

    dataLoaded = false; 
    savingData = false;
    enableSaveButton = false;
    
    dismissCountDown =0
    alertType="danger"
    allRates: rateJsonInfoType[] = []
    rates = {} as ratesInfoType;
    
    mounted() { 
        this.savingData = false;
        this.loadAllRates()        
    }

    public countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    }

    public loadAllRates(){
        this.dataLoaded = false;
        
        this.$http.get('/rate')
        .then((response) => {
            if(response?.data){

                this.allRates = response.data
                this.UpdateRates(this.allRates)
                this.allRates.forEach(rate=>rate.valueChangedDate=rate.valueChangedDate?.slice(0,10))

                this.rates = getRatesIndices(this.allRates) 
                this.enableSaveButton = false;
                this.dataLoaded = true;                                 
            }
        },(err) => {
            this.alertType="danger"
            this.dismissCountDown=1     
        });
    }

    public cancelChanges() {
        this.loadAllRates()
    }

    public saveChanges() {           
                
        const allRates = JSON.parse(JSON.stringify(this.allRates))
        allRates.forEach(rate=>rate.valueChangedDate=moment(rate.valueChangedDate).format())
        this.savingData = true;
        this.$http.put('/rate', allRates).then(res=>{
            if(res?.status==202){
                this.alertType="success"
                this.dismissCountDown=2
            }
            this.savingData = false;
            this.loadAllRates()
        },error => {
            this.savingData = false;
            this.alertType="danger"
            this.dismissCountDown=2           
        })
        
    }

    public rateChanged(status){
        this.enableSaveButton = status
    }


}
</script>

<style scoped lang="scss">
</style>