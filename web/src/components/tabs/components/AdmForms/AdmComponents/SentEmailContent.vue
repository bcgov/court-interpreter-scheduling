<template>
    <div class="py-5 email-content">
        <div class="ml-4"><h3>{{emailContent.subject}}</h3></div>
        <div class="ml-4"><b>From: </b> {{emailContent.from}}</div>
        <div class="ml-4 mt-2"><b>To: </b> {{emailContent.to}}</div>
        <div style="margin:2rem; white-space: pre-wrap;" >{{emailContent.body}}</div>
        <div class="text-center h4 text-danger">{{emailContent.attachments}}</div>     
    </div> 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { sentEmailContentInfoType } from '@/types/Bookings/json';

@Component
export default class SentEmailContent extends Vue {

    @Prop({required: true})
    emailContent!:sentEmailContentInfoType

}
</script>
<style scoped>
    .email-content{
        background: #cae2df;
    }
</style>