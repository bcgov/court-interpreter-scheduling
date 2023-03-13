<template>
    <div v-if="dataReady" class="border p-1" style="border-radius:0 0 5px 5px;" :key="updateCaseFrame">
        <!-- {{caseStates}} -->
        <!-- {{bookingStatus}} -->
        <!-- {{bookingCase}} -->
<!-- <ROW - 1> -->
        <b-row style="margin:0 -0.5rem;">
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Court File Number" 
                    label-for="file-number">
                    <b-form-input
                        id="file-number"
                        @input="checkStates()"
                        :disabled="disableEdit" 
                        :state="caseStates.file"                                        
                        v-model="bookingCase.file">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    class="labels"                
                    label="Case Name" 
                    label-for="case-name">
                    <b-form-input
                        id="case-name"
                        @input="checkStates()" 
                        :disabled="disableEdit" 
                        :state="caseStates.caseName"                                        
                        v-model="bookingCase.caseName">
                    </b-form-input>
                </b-form-group>
            </b-col>             
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Court Room" 
                    label-for="room">
                    <b-form-input 
                        :state="caseStates.room"
                        :disabled="disableEdit"
                        id="room"                                         
                        v-model="bookingCase.room">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="3">
               <b-form-group                
                    class="labels"                
                    label="Language" 
                    label-for="language">                    
                    <b-form-select
                        id="language"
                        :state="caseStates.language"
                        :disabled="disableEdit"
                        @input="checkStates()"                                                           
                        v-model="bookingCase.language">
                        <b-form-select-option v-for="lang in languages" :key="lang.id" :value="lang">
                            {{lang.languageName}} (L{{lang.level}})
                        </b-form-select-option>
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="2">
               <b-form-group                
                    class="labels"                
                    label="Interpret For" 
                    label-for="interpret-for">                    
                    <b-form-select
                        id="interpret-for"
                        :disabled="disableEdit" 
                        :options="interpretForOptions"
                        v-model="bookingCase.interpretFor">                        
                    </b-form-select>
                </b-form-group>
            </b-col>
            
        </b-row>

<!-- <ROW - 2> -->
        <b-row style="margin:0 -0.5rem;">
            <b-col cols="2">
                <b-form-group
                    class="labels"                
                    label="Case Type" 
                    label-for="case-type">
                    <b-form-select 
                        :options="caseTypeOptions"
                        :disabled="disableEdit"                    
                        :state="caseStates.caseType"
                        @change="bookingCase.courtClass='';"
                        id="case-type"                                         
                        v-model="bookingCase.caseType">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    class="labels"                
                    label="Court Level" 
                    label-for="court-level">
                    <b-form-select 
                        :options="courtLevelOptions"
                        :disabled="disableEdit"
                        :state="caseStates.courtLevel"
                        @change="checkStates()"
                        id="court-level"                                         
                        v-model="bookingCase.courtLevel">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col :cols="bookingCase.courtClass=='OTHER'? 2: 5">
                <b-form-group
                    class="labels"                
                    label="Court Class" 
                    label-for="court-class">
                    <b-form-select 
                        :options="bookingCase.caseType=='Civil'? civilCourtClassOptions: criminalCourtClassOptions"
                        :disabled="disableEdit"
                        :state="caseStates.courtClass"
                        id="court-class"                                         
                        v-model="bookingCase.courtClass">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col v-if="bookingCase.courtClass=='OTHER'" cols="3">
                <b-form-group v-if="bookingCase.courtClass=='OTHER'"
                    class="labels"                
                    label="Other Court Class" 
                    label-for="other-court-class">
                    <b-form-input
                        id="other-court-class" 
                        :disabled="disableEdit"
                        @change="checkStates()"                                                                       
                        :state="caseStates.courtClassOther"                             
                        v-model="bookingCase.courtClassOther">
                    </b-form-input>
                </b-form-group>
            </b-col>

            <b-col cols="2">
                <b-form-group                        
                    label="Requested By" 
                    class="labels"
                    label-for="requested-by">
                    <b-form-select 
                        id="requested-by"
                        :disabled="disableEdit"                      
                        style="display:inline"
                        :options="requestOptions"
                        :state="caseStates.request"
                        v-model="bookingCase.requestedBy">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col> 
        </b-row>
        
<!-- <ROW - 3> -->
        <b-row style="margin:0 -0.5rem;">
            <b-col :cols="bookingCase.reason=='OTHER'? 2: 5">
                <b-form-group                
                    class="labels"                
                    label="Reason Code" 
                    label-for="reason-code">
                    <b-form-select
                        id="reason-code"
                        :disabled="disableEdit"
                        :options="reasonCodeClassOptions"                          
                        :state="caseStates.reason"
                        @input="checkStates()"                                   
                        v-model="bookingCase.reason">
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col v-if="bookingCase.reason=='OTHER'" cols="3">
                <b-form-group v-if="bookingCase.reason=='OTHER'"
                    class="labels"                
                    label="Other Reason Code " 
                    label-for="other-reason-code">
                    <b-form-input
                        id="reason-code"
                        @input="checkStates()"
                        :disabled="disableEdit"                                                                          
                        :state="caseStates.reasonOther"                               
                        v-model="bookingCase.reasonOther">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="3">
                <b-form-group
                    :key="appearanceMethodKey"                         
                    label="Method of Appearance" 
                    class="labels"
                    label-for="appearance-method">
                    <b-form-select 
                        id="appearance-method"
                        :disabled="disableEdit"                           
                        style="display:inline"
                        @input="checkStates()"                                
                        :options="bookingMethodOfAppearanceOptions"
                        :state="caseStates.methodOfAppearance"
                        v-model="bookingCase.methodOfAppearance">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col>
            <b-col cols="2" >
                <b-form-group>
                    <label class="labels mb-1" style="display:block;" >Bilingual (FR, EN)</label>
                    <b-form-radio-group                                                
                        :class="caseStates.bilingual==false?'border rounded border-danger pb-3 pt-1 px-2':'' "                           
                        style="display:inline"
                        @input="checkStates()"
                        :disabled="disableEdit"                                     
                        :state="caseStates.bilingual"
                        v-model="bookingCase.bilingual"> 
                        <b-form-radio :value="true">Yes</b-form-radio> 
                        <b-form-radio :value="false">No</b-form-radio>                                  
                    </b-form-radio-group> 
                </b-form-group>
            </b-col>
            <b-col cols="2">
                <b-form-group
                    v-if="bookingCase.bilingual"                                            
                    label="Interpretation Mode" 
                    class="labels ml-n4"
                    label-for="interpretation-mode">
                    <b-form-select 
                        id="interpretation-mode"
                        :disabled="disableEdit"                           
                        style="display:inline"
                        @change="checkStates()"                                
                        :options="bookingInterpretationModeOptions"
                        :state="caseStates.interpretationMode"
                        v-model="bookingCase.interpretationMode">                                    
                    </b-form-select> 
                </b-form-group>
            </b-col>
            
        </b-row>
        
<!-- <ROW - 4> -->
        <b-row style="margin:0 -0.5rem;">
            <b-col cols="2" >
                <b-form-group>
                    <label class="labels mb-1" style="display:block;" >Federal</label>
                    <b-form-radio-group                                                
                        :class="caseStates.federal==false?'border rounded border-danger pb-3 pt-1 px-2':'' "                           
                        style="display:inline"
                        @input="checkStates()"
                        :disabled="disableEdit"                                     
                        :state="caseStates.federal"
                        v-model="bookingCase.federal"> 
                        <b-form-radio :value="true">Yes</b-form-radio> 
                        <b-form-radio :value="false">No</b-form-radio>                                  
                    </b-form-radio-group> 
                </b-form-group>
            </b-col>
            <b-col cols="3" >
                <b-form-group
                    v-if="bookingCase.federal"
                    class="labels ml-n4"                
                    label="Federal Prosecutor Name" 
                    label-for="prosecutor-name">
                    <b-form-input
                        :disabled="disableEdit" 
                        id="prosecutor-name" 
                        @input="checkStates()"
                        :state="caseStates.prosecutor"                                                 
                        v-model="bookingCase.prosecutor">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col cols="4" >
                <b-form-group class="m-0 p-0" >
                    <b-form-checkbox
                        :disabled="disableEdit"
                        class="title-label"
                        v-model="remoteLocation" 
                        @change="addRemoteLocation"
                        > Remote Court Location
                    </b-form-checkbox>
                    <b-form-select 
                        id="remote-location"
                        :disabled="disableEdit"                                                 
                        @change="changeRemoteLocation"
                        v-if="remoteLocation"
                        :state="caseStates.remoteLocation"
                        v-model="bookingCase.remoteLocationId"> 
                        <b-form-select-option
                            v-for="courtLocation,inx in courtLocations" 
                            :key="inx"
                            :value="courtLocation.id">
                                {{courtLocation.name}}
                        </b-form-select-option>
                    </b-form-select> 
                </b-form-group>
            </b-col>
            <b-col cols="3">                              
                <b-form-group
                    v-if="isVanCourt()"                        
                    label="Court Location" 
                    class="labels"
                    label-for="location">
                    <b-form-select 
                        id="location"
                        :disabled="disableEdit"                                                                                               
                        style="display:inline"
                        @change="changeVanLocation"                      
                        v-model="bookingCase.vanLocationId"> 
                        <b-form-select-option
                            v-for="courtLocation,inx in vanCourtLocations" 
                            :key="inx"
                            :value="courtLocation.id">
                                {{courtLocation.name}}
                        </b-form-select-option>
                    </b-form-select> 
                </b-form-group>       
            </b-col>
        </b-row>

    </div>   
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';

import {bookingCaseInfoType } from '@/types/Bookings/json';
import {interpreterLanguageInfoType } from '@/types/Interpreters/json';

import {interpretForOptions, bookingInterpretationModeOptions, requestOptions, bookingMethodOfAppearanceOptions, caseTypeOptions, courtLevelOptions, civilCourtClassOptions, criminalCourtClassOptions, reasonCodeClassOptions} from '../BookingEnums'
import { bookingCaseStatesInfoType} from '@/types/Bookings';

import { namespace } from "vuex-class";
import "@/store/modules/common";
import { locationsInfoType } from '@/types/Common/json';
const commonState = namespace("Common");



@Component
export default class CaseFields extends Vue {
    

    @Prop({required: true})
    bookingCase!: bookingCaseInfoType

    @Prop({required: true})
    disableEdit!: boolean

    @Prop({required: true})
    caseStates!: bookingCaseStatesInfoType;

    @Prop({required: true})
    registry!: any;
    
    @Prop({required: true})
    languages: interpreterLanguageInfoType[]

    @commonState.State
    public courtLocations!: locationsInfoType[];

    
    dataReady = false   
    updateCaseFrame=0
    remoteLocation=false
    appearanceMethodKey = 0;
    
    vanCourtLocations: locationsInfoType[] = []

    requestOptions
    bookingMethodOfAppearanceOptions
    interpretForOptions
    caseTypeOptions
    courtLevelOptions 
    civilCourtClassOptions
    criminalCourtClassOptions
    reasonCodeClassOptions
    bookingInterpretationModeOptions

    created(){
        this.interpretForOptions=interpretForOptions        
        this.requestOptions=requestOptions 
        this.bookingMethodOfAppearanceOptions=bookingMethodOfAppearanceOptions
        this.caseTypeOptions=caseTypeOptions
        this.courtLevelOptions=courtLevelOptions
        this.civilCourtClassOptions=civilCourtClassOptions
        this.criminalCourtClassOptions=criminalCourtClassOptions
        this.reasonCodeClassOptions=reasonCodeClassOptions
        this.bookingInterpretationModeOptions=bookingInterpretationModeOptions
    }
   

    mounted() { 
        this.dataReady = false
        this.vanCourtLocations = this.courtLocations.filter(court => court.shortDescription=="2040" || court.shortDescription=="2042")        

        this.remoteLocation = (this.bookingCase.remoteLocationId && this.bookingCase.remoteLocationId !=this.registry.id) ? true: false
        this.dataReady = true        
    }

    public addRemoteLocation(checked){
        Vue.nextTick(()=>{
            if(checked){
                this.bookingCase.remoteLocationId = this.registry.id
                this.changeRemoteLocation()
                this.bookingMethodOfAppearanceOptions = bookingMethodOfAppearanceOptions.filter(method => method.text != "In Person")
                this.bookingCase.methodOfAppearance = bookingMethodOfAppearanceOptions[1].value
                this.appearanceMethodKey++;
            }
            else{
                this.bookingCase.remoteLocationId = null
                this.bookingCase.remoteRegistry = null
                this.bookingMethodOfAppearanceOptions = bookingMethodOfAppearanceOptions
                this.bookingCase.methodOfAppearance = bookingMethodOfAppearanceOptions[0].value
                this.appearanceMethodKey++;
            }
        })
    }

    public changeRemoteLocation(){     

        const location = this.courtLocations.filter(loc => loc.id==this.bookingCase.remoteLocationId)

        if(location.length==1){
            const bookingCase= this.bookingCase
            bookingCase.remoteRegistry = location[0].name
        }
    }

    public isVanCourt(){
        const location = this.courtLocations.filter(loc => loc.id==this.registry.id)[0]
        return (location?.shortDescription=="2040"||location?.shortDescription=="2042")
    }

    public changeVanLocation(){     

        const location = this.courtLocations.filter(loc => loc.id==this.bookingCase.vanLocationId)

        if(location.length==1){
            const bookingCase= this.bookingCase
            bookingCase.vanRegistry = location[0].name
        }
    }
    
    

    public checkStates(){

        for(const field of Object.keys(this.caseStates)){
            if(this.caseStates[field]==false && field!='tabNumber' && field!='tmpId'){
                // console.log(this.caseStates[field])
                this.$emit('checkStates')                
                break
            }
        }
    }  
    
}

</script>


<style lang="scss" scoped>
    ::v-deep .labels {        
        margin:1rem 0 0rem 0;        
        line-height: 1rem;
        color:rgb(67, 93, 119);
        font-weight: 600;
        font-size: 11.75pt;
    }
    
    .title-label {        
        margin:0.7rem 0 -0.4rem 0;        
        line-height: 1.7rem;
        color:rgb(67, 93, 119);
        font-weight: 600;
        font-size: 11.8pt;
    }
    ::v-deep label{        
        margin:0 0 0.5rem 0;
    }

    .custom-radio{
        margin-top: 0.45rem;
        margin-bottom: -1rem;
    }

</style>