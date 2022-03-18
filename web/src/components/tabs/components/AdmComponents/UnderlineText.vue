<template>
    <div 
        :style="{
            borderBottom:'0.7px solid #313132', 
            margin:'0rem 0 0rem 0rem', 
            fontSize: '11pt', 
            color:'#000000', 
            minHeight:'1.55rem', 
            textAlign: 'center'
        }">
        {{text}}
    </div> 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class UnderlineText extends Vue {

    @Prop({required: true})
    text!: string;
}
</script>