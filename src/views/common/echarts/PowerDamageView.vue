
<!--灾损统计-电力受损-->
<template>
    <div style="width:100%;height:100%">
      <PowerDamage :data="severelyAffectedAreaData" v-if="afectedAreaFlag"
                          :geoJson="geoJson" :nodata="nodata"></PowerDamage>
      <div v-else class="nothingData--bg"></div>
    </div>
    
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import {pushDataRequestServe, staticDataRequestServer} from '@/api/installServer.ts';

import PowerDamage from '@/components/feature/earthquake/severelyAffectedArea/SeverelyAffectedArea.feature.vue';

@Component({
    name: 'PowerDamageView',
    components: {
        PowerDamage,
    },
})
export default class PowerDamageView extends Vue  {

    private afectedAreaFlag: boolean = false;
    private severelyAffectedAreaData: any = [
        // { name: '东城区', value: [116.393028, 39.878327] },
        // { name: '海淀区', value: [116.305958, 39.966051] },
        // { name: '大兴区', value: [116.351089, 39.728513] },
    ];
    private amapData: any = {};
    private geoJson: any = null;
    private nodata: boolean = false;

    private created() {
        if (this.$store.state.eventPushStore.power > -1) {
            staticDataRequestServer.getEchartsMapJson(this.$store.state.eventPushStore.district.code).then((res: any) => {
                this.geoJson = res.data;
                this.initData();
            });
        } else {
            this.nodata = false;
        }
    }
    private initData() {
        const vm = this;
        const eventId = vm.$store.state.eventPushStore.eventId; // 事件id
        const locationId = 'power';  // 位置id
        const reqData = pushDataRequestServe.getPushDataByIds(eventId, locationId);
        // const url = "10.10.10.151:8081/api/msg/test1215/zqypyc-rymjcs/v1";
        reqData.then((res: any) => {
            if (res.code === 0) {
                const jsonData = JSON.parse(res.data.content)[0].data;
                const severelyAffectedAreaData = JSON.parse(jsonData).data;  // 获取请求到的数据
                vm.severelyAffectedAreaData = severelyAffectedAreaData.map((item: any, index: any) => {
                    return {name: item.parentName, value: [item.x, item.y]};
                });
                vm.afectedAreaFlag = true; // 设置模块显示
            }
        });
    }
    @Watch('$store.state.eventPushStore.power')
        private eventChange(val: any) {
            if (val > 0) {
                staticDataRequestServer.getEchartsMapJson(this.$store.state.eventPushStore.district.code).then((res: any) => {
                    this.geoJson = res.data;
                    this.initData();
                });
            } else if (val < 0) {
                this.severelyAffectedAreaData = [];
            }
        }
}
</script>
