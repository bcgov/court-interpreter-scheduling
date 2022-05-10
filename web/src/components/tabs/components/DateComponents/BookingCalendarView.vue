<template>
    <div v-if="dataReady">
        <b-row class="py-0 vuetify" style="margin-top:-3rem;">

                <v-app style="height:24rem; padding:0; margin:0 0 -2.5rem 0; overflow:hidden;">                    
                    <v-date-picker
                        class="calendar-left"
                        v-model="dates"
                        multiple
                        readonly
                        color="success"
                        :allowed-dates="allowedDates"                         
                        :picker-date.sync="pickerDateL"                        
                    ></v-date-picker>                            
                </v-app>

                <v-app style="height:24rem; padding:0; margin:0 0 -2.5rem 0; overflow:hidden;">                        
                    <v-date-picker
                        class="calendar-middle"
                        v-model="dates"
                        multiple
                        readonly
                        color="success"
                        :allowed-dates="allowedDates"                         
                        :picker-date.sync="pickerDateM"                                
                    ></v-date-picker>                            
                </v-app>

                <v-app style="height:24rem; padding:0; margin:0 0 -2.5rem 0; overflow:hidden;">                        
                    <v-date-picker
                        class="calendar-right"
                        v-model="dates"
                        multiple
                        readonly
                        color="success"
                        :allowed-dates="allowedDates"                             
                        :picker-date.sync="pickerDateR"                                
                    ></v-date-picker>                            
                </v-app>

        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment-timezone'
import {bookingDateTimesInfoType} from '@/types/Bookings/json';


@Component
export default class BookingCalendarView extends Vue {
    
    @Prop({required: true})
    bookings!: any;

    @Prop({required: true})
    bookingDates!: bookingDateTimesInfoType[]

    dates = []

    pickedDates=""
    pickerDateL=""
    pickerDateM=""
    pickerDateR=""

    dataReady=false
    conflictDates=[]

    @Watch('pickerDateL')
    monthChange(newValue){
        this.pickerDateM = moment(newValue).add(1,'months').format("YYYY-MM")
        this.pickerDateR = moment(newValue).add(2,'months').format("YYYY-MM")
    }


    @Watch('pickerDateR')
    monthChangeR(newValue){
        this.pickerDateM = moment(newValue).add(-1,'months').format("YYYY-MM")
        this.pickerDateL = moment(newValue).add(-2,'months').format("YYYY-MM")
    }
   

    mounted(){
        this.dataReady=false
        this.extractInfo()
        this.dataReady=true
    }

    public extractInfo(){
        this.conflictDates=[]       
        
        for(const booking of this.bookings){
            for(const bookingdate of booking.dates){                 
                this.conflictDates.push(bookingdate.date.slice(0,10))
            }
        } 
        
        this.dates = this.bookingDates.map(date=>date.date.slice(0,10))
    }

    public allowedDates(date){
        if(this.conflictDates.includes(date)) 
            return false        
        else 
            return true
    }
}
</script>

<style scoped lang="scss">
    ::v-deep .vuetify{
        @import "@/styles/vuetify.scss";
        @import "@/styles/_custom_vuetify.scss";    

        .v-date-picker-header .success--text button[type="button"]{
            pointer-events: none;
        }

        .calendar-left .v-date-picker-header button[aria-label="Next month"]{
            display: none;
        }

        .calendar-middle .v-date-picker-header .v-btn{
            display: none;
        }

        .calendar-right .v-date-picker-header button[aria-label="Previous month"]{
            display: none;
        }

        td>button.v-btn.v-btn--flat.v-btn--text.v-btn--rounded.v-btn--disabled.theme--light{
        
            background: rgb(233, 108, 108) !important; 
            color:white !important;
            pointer-events: auto !important; 

            :hover::before{
                content:"Busy"; 
                position:absolute;
                transform:translate(-10%,-120%);
                margin-left:10px;
                font-size: 10pt;                
                width:3.5rem;
                padding:5px;
                border-radius:10px;
                background:#000;
                color: #fff;
                text-align:center;
            }
        }
       
    }

</style>