
<!--救援救助-队伍需求-->
<template>
<div class='ca-echart-loop-wrap'>
    <TeamDemand
        :id='id'
        :option='personalOption'
    ></TeamDemand>
</div>
</template>
<script lang='ts'>
import {Component, Prop, Vue } from 'vue-property-decorator';
import TeamDemand from '@/components/feature/earthquake/personalCasualty/PersonalCasualty.vue';
import {IpersonalOption} from '@/interface/feature/earthquake/personalCasualty.interface';
@Component({
    name : 'TeamNeedView',
    components : {
        TeamDemand,
    },
})
export default class TeamNeedView extends Vue {

    public id = 'teamDemand-echart';
    public originData = [{ name: '需要队伍人数', value: 1072},
        { name: '现场队伍人数', value: 618}];
    public personalOption = {
        color: ['#0187d9', '#15b873'],
        dataset: {
            source: [{name: '医院', value: 12}],
        },
        series: [
            {
                type: 'pie',
                radius: ['47%', '57%'],
                label: {
                    padding: [5, -115],
                    formatter(params: any) {
                      const name = params.data.name;
                      const value = params.data.value ? params.data.value : '--';
                      return `{aa|${value}人\n${name}}`;
                    },
                    rich: {
                        aa: {
                            fontSize: 22,
                            padding: [7, 10],
                        },
                    },
                },
                labelLine: {
                    length: 25,
                    length2: 100,
                },
            },
            {
                z: 0,
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['37%', '57%'],
                data: [1],
                itemStyle: {
                    color: '#071c44',
                },
                hoverAnimation: false,
                label: {
                    padding: 10,
                    formatter: '',
                    position: 'center',
                    color: '#00d2ff',
                    fontSize: 30,
                    // borderRadius: 100,
                    // backgroundColor: '#1c2a3e',
                },
            }],
    };
    public sum1 = this.originData.reduce( (pre: any, cur: any) => {
        return pre + cur.value;
    }, 0);


    public created() {
        this.personalOption.dataset.source = this.originData;
        // this.personalOption.series[1].label.formatter = this.sum1 + '';
    }
}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.ca-echart-loop-wrap{
    padding:10px;
    height: 230px;
    margin-left:-15px;
}
</style>