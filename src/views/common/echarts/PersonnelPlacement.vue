<!--救援救助-人员安置-->
<template>
<div class='ca-echart-loop-wrap'>
    <PersonnelPlacing
    ></PersonnelPlacing>
</div>
</template>
<script lang='ts'>
import {Component, Prop, Vue } from 'vue-property-decorator';
import PersonnelPlacing from '@/components/feature/earthquake/radarChart/radarChart.feature.vue';
@Component({
    name : 'PersonnelPlacement',
    components : {
        PersonnelPlacing,
    },
})
export default class PersonnelPlacement extends Vue {}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.ca-echart-loop-wrap{
    padding:10px;
    height: 100%;
    margin-left:-20px;
}
</style>