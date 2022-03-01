<!--甜甜圈-->
<template>
<div class='ca-echart-loop-wrap'>
    <doughnut-pie 
        :id='id'
        :option='option'
    ></doughnut-pie>
</div>
</template>
<script lang='ts'>
import {Component, Prop, Vue } from 'vue-property-decorator';
import DoughnutPie from '@/components/common/chart/Doughnut.pie.common.vue';
import {IpersonalOption} from '@/interface/feature/earthquake/personalCasualty.interface';
/**
*   人员密集场所的组件
*/
@Component({
    name : 'PersonalCasualty',
    components : {
        DoughnutPie,
    },
})
export default class PersonalCasualty extends Vue {
    /**
    *   eChart的ID;
    */
    @Prop(String) public id!: string ;
     /**
    *   echarts的 options;
    */
    @Prop(Object) public option!: IpersonalOption;
}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.ca-echart-loop-wrap{
    padding:10px;
    height: 430px;
    margin-left:-20px;
}
</style>