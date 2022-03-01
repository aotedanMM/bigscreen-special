<!--人员救助-->
<template>
<div class='ca-echart-loop-wrap'>
    <broken-line
        :id='id'
        :option='option'
    ></broken-line>
</div>
</template>
<script lang='ts'>
import {Component, Prop, Vue } from 'vue-property-decorator';
import BrokenLine from '@/components/common/chart/Line.common.vue';
import {IpersonalOption} from '@/interface/feature/earthquake/personalCasualty.interface';
/**
*   人员救助的组件
*/
@Component({
    name : 'PersonalAssistance',
    components : {
        BrokenLine,
    },
})
export default class PersonalAssistance extends Vue {
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