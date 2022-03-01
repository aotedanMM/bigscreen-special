<template>
  <div id="TraffivControlGis">
    <DamageCommon :listData='listData' isblock='2' :allListNum="allListNum" :textType="'交通管制'"></DamageCommon>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch  } from 'vue-property-decorator';
import DamageCommon from '@/components/feature/gisModule/static/damage.common.vue';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'TraffivControlGis',
  components: {
    DamageCommon,
  },
})
export default class TraffivControlGis extends Vue {
  private listData: any = [];
  private allListNum: number = 0;
  private created() {
    if (this.$store.state.eventPushStore.traffic >= 0) {
      this.getData();
    }
  }

  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'traffic';  // 伤亡id
    const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
    const content = JSON.parse(data.content);
    if (content.length > 0) {
      const localListdata = JSON.parse(content[0].data).data;
      const arr: any = [];
      localListdata.forEach((ele: any, index: number) => {
        if (ele.isblock === 2 || ele.isblock === '2') {
          arr.push(ele);
        }
      });
      this.listData = arr;
      // this.messsageBus.emit('damageToolTable', this.listData, 'all');
      this.allListNum = 0;
      for (const i of this.listData) {
        this.allListNum += i.count;
      }
    }
  }

  @Watch('$store.state.eventPushStore.traffic')
  private eventChange(val: any) {
    if (val >= 0) {
      this.getData();
    }
  }

  // 联动gis方法 开始
  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.disasterJudgeFactory.getComponent('districtComp');
    }
    return component;
  }

  private mounted() {
    // (this as any).resolveMap.call(this, 'map').then(() => {
     // this.getComponent().on('EventPointspopup');
      // this.getComponent().on('EventPointspopup', this.onShowPopup, this);
      // this.getComponent().on('disasterXZDist', this.FnShowXZD, this); // 替换 列表数据 的监听
    // });
  }
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#TraffivControlGis {
  position: absolute!important;
  top: 200px;
  left: 60px;
  z-index: 9999;
}
</style>
