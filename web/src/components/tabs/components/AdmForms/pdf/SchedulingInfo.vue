<template>
    <div v-if="dataReady" class="mt-2">       
        <b-row class="m-0 p0">
                <table class="flexsize border border-dark m-0 p-0">
                    <tr style="font-size:9pt; " class="m-0 p-0">
                        <td class="m-0 p-0"><div style="font-size:12pt;" class="ml-1 font-weight-bold">2 Scheduling Information</div></td>                        
                    </tr> 
                    <tr style="font-size:7pt; line-height:1.25rem;" >
                        <td style="width:42%;"><b class="ml-1">Registry Location</b></td>                                              
                        <td style="width:1%;" />
                        <td style="width:29%;"><b class="">Name of person booking interpreter</b></td>
                        <td style="width:1%;" />
                        <td style="width:13%;"><b class="">Clerk Phone</b></td>
                        <td style="width:1%;" />
                        <td style="width:13%;"><b class="">Date of booking</b></td>
                    </tr>
                    <tr style="font-size:5pt; height:0.1rem; line-height:0.1rem;" >
                        <td colspan="6"></td>
                        <td colspan="1"><i class="ml-3">YYYY-MM-DD</i></td>
                    </tr>
                    <tr style="height:1.5rem;" >
                        <td><div class="answer ml-1">{{courtLocationName}}</div> </td>
                        <td />
                        <td><div class="answer">{{clerkName}}</div> </td>
                        <td />
                        <td><div class="answer">{{clerkPhone}}</div> </td>
                        <td />
                        <td><div class="answer">{{bookingDate}}</div> </td>
                    </tr>
                    
                </table>
        </b-row>           
    </div>    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { bookingSearchResultInfoType } from '@/types/Bookings/json';
import { locationsInfoType } from '@/types/Common/json';


@Component
export default class SchedulingInfo extends Vue {

    @Prop({required: true})
    booking!: bookingSearchResultInfoType;

    @Prop({required: true})
    public searchLocation!: locationsInfoType;
    
    dataReady = false;
    courtLocationName=""
    clerkName=""
    clerkPhone=""
    bookingDate=""

    mounted(){
        this.dataReady = false;
        this.courtLocationName = this.searchLocation.name
        this.clerkName = this.booking.updated_by
        this.clerkPhone = this.booking.clerkPhone
        this.bookingDate = this.booking.createdDate
        this.dataReady = true;        

    }
    
}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
