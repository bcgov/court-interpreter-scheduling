<template> 
    <div >
        <img v-if="showExpanded" class="bg-white expand-step-icon"
            src="../../../public/icons/icon-minus.svg"
        />
        <img v-else class="bg-white expand-step-icon"
            src="../../../public/icons/icon-plus.svg"
        />
    </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ExpandIcon extends Vue {    

    @Prop({required: true})
    showExpanded!: boolean;     

}

</script>

<style>

</style>