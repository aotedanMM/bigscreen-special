<template>
  <GoodsNeed :goodsNeedList="goodNeed"></GoodsNeed>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import GoodsNeed from '@/components/feature/common/goodsNeed/GoodsNeed.vue';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'KeyMaterialDemand',
  components: {
    GoodsNeed,
  },
})
export default class KeyMaterialDemand extends Vue {
  private goodNeed: any = [];
  private flag: boolean = false;

  private goodReady: any = [
    {
      type: 'tent',
      name: '救灾帐篷',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'quilt',
      name: '救灾被服',
      total: 0,
      unit: '套',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'food',
      name: '救灾食品',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'daily',
      name: '生活用品',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'lightTool',
      name: '照明用具',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'energy',
      name: '能源动力',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'firstAidKit',
      name: '应急救生',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'trafficTool',
      name: '交通工具',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'tent',
      name: '彩条苫布',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'tent',
      name: '卫生设施',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'tent',
      name: '生活家具',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'tent',
      name: '装备工具',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
    {
      type: 'tent',
      name: '折叠床',
      total: 0,
      unit: '顶',
      notdispatch: 0,
      dispatching: 0,
    },
  ];

  private goodSplit(index: any, item: any) {
    this.goodReady[index].unit = item.unit;
    if (item.status === 'placed') {
      this.goodReady[index].total += Number(item.num);
    } else if (item.status === 'placing') {
      this.goodReady[index].total += Number(item.num);
      this.goodReady[index].notdispatch += Number(item.num);
    } else if (item.status === 'unplaced') {
      this.goodReady[index].total += Number(item.num);
      this.goodReady[index].dispatching += Number(item.num);
    }
  }

  private async getData() {
    const goodNeed1: any = [];
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'goods_dispatch'; // 物资id
    const { data }: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      processId,
    );
    const jsonData = JSON.parse(data.content)[0].data;
    const newData = JSON.parse(jsonData).event.list;
    const goodList: any = [];
    for (const i of this.goodReady) {
      i.total = 0;
      i.notdispatch = 0;
      i.dispatching = 0;
    }

    for (const k of newData) {
      for (const i of k.placed) {
        i.status = 'placed';
        goodList.push(i);
      }
      for (const i of k.placing) {
        i.status = 'placing';
        goodList.push(i);
      }
      for (const i of k.unplaced) {
        i.status = 'unplaced';
        goodList.push(i);
      }
      for (const i of goodList) {
        switch (i.code) {
          case 'TP001':
            this.goodSplit(0, i);
            break;
          case 'TP002':
            this.goodSplit(1, i);
            break;
          case 'TP003':
            this.goodSplit(2, i);
            break;
          case 'TP004':
            this.goodSplit(3, i);
            break;
          case 'TP005':
            this.goodSplit(4, i);
            break;
          case 'TP006':
            this.goodSplit(5, i);
            break;
          case 'TP007':
            this.goodSplit(6, i);
            break;
          case 'TP008':
            this.goodSplit(7, i);
            break;
        }
      }
    }

    for (const i of this.goodReady) {
      if (i.total > 0) {
        goodNeed1.push(i);
      }
    }
    this.goodNeed = goodNeed1;
  }

  private created() {
    if (this.$store.state.eventPushStore.goods_dispatch > -1) {
      this.getData();
    }
  }

  @Watch('$store.state.eventPushStore.goods_dispatch')
  private eventChange(val: any) {
    if (val > 0) {
      this.getData();
    } else if (val < 0) {
      for (const i of this.goodReady) {
        i.total = 0;
        i.notdispatch = 0;
        i.dispatching = 0;
      }
    }
  }
}
</script>