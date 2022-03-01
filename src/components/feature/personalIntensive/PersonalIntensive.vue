<!--人员密集场所-->
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
import DoughnutPie from '../../common/chart/Doughnut.pie.common.vue';
@Component({
    name : 'Personal',
    components : {
        DoughnutPie,
    },
})
export default class PersonalIntensive extends Vue {
    @Prop(String) public id!: string ;
    @Prop(Object) public option!: any;
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