<template>
  <div class="New_Tree_Details" :class="treeLine">
    <div class="New_Tree_Details_tree">
      <ul>
        <li
          class="list_btn_mapsC"
          :class="{'treeDotAct': item.flag}"
          v-for="(item,index) of originData"
          :key="index"
          @click="treeDetailClick(item,index)"
        >
          {{item.eventTypeName}}
          <span>{{item.eventNumber}}</span>
        </li>
      </ul>
    </div>
    <div class="list_dialong_new">
      <h3 class="close_list_dialong_new"></h3>
      <h2 class="close_list_dialong_new_ad"></h2>
      <ul class="map_ulList"></ul>
    </div>
    <div class="start-wrap">
      <div>
        <div class="start1 start"></div>
        <div class="start2 start"></div>
        <div class="start3 start"></div>
        <div class="start4 start"></div>
        <div class="start5 start"></div>
      </div>
    </div>
    <div class="linebar linebar1"></div>
    <div class="linebar linebar2"></div>
    <div class="linebar linebar3"></div>
    <div class="linebar linebar4"></div>
    <div class="lunbo_date">
      <span
        :value="itm.value"
        :class="{ 'dateAct': curIndex===idx}"
        v-for="(itm,idx) of dateTypes"
        @click="clickDate(idx)"
        :key="idx"
      >{{itm.name}}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { treeDetailServerServer } from '@/api/installServer';
// GIS 点击地图给本页面反馈
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
// 地图组件
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'TreeAnimate',
  mixins: [MapCommon], // GIS 将地图组件混入当前组件
  components: {
    EventInfoPop,
  },
})
export default class TreeAnimate extends Vue {
  /**
   * sum: 当前轮播页是否有树节点高亮, 值为0,就没有树节点高亮。
   */
  public timer: any;
  public tiemeout: any;
  private curIndex: number = 0;
  private originData: any = [
    { eventTypeCode: '自然灾害', eventTypeName: '自然灾害', eventNumber: 0 },
    { eventTypeCode: '事故灾难', eventTypeName: '事故灾难', eventNumber: 0 },
    {
      eventTypeCode: '公共卫生事件',
      eventTypeName: '公共卫生事件',
      eventNumber: 0,
    },
    {
      eventTypeCode: '社会安全事件',
      eventTypeName: '社会安全事件',
      eventNumber: 0,
    },
  ];
  private sum: number = 0;
  private treeLine: string = '';
  private treeLineShow: any = [
    {
      name: '自然灾害',
      list: ['地震灾害', '地质灾害', '森林火灾', '草原火灾', '洪涝灾害'],
      class: 'treeline3',
    },
    {
      name: '事故灾难',
      list: [
        '交通事故',
        '危化工贸事故',
        '火灾事故',
        '煤矿事故',
        '非煤矿山事故',
      ],
      class: 'treeline2',
    },
    {
      name: '社会安全事件',
      list: ['其他', '涉外突发事件'],
      class: 'treeline1',
    },
    {
      name: '公共卫生事件',
      list: ['公共卫生事件'],
      class: 'treeline4',
    },
  ];
  private gisHandle: any = {};
  private dateTypes: any = [
    {
      name: '周',
      value: 'week',
      isAction: false,
    },
    {
      name: '月',
      value: 'month',
      isAction: false,
    },
    {
      name: '季',
      value: 'season',
      isAction: false,
    },
    {
      name: '年',
      value: 'year',
      isAction: false,
    },
  ];
  private oDataRange = {
    startTime: '',
    endTime: '',
  };

  /*时间转化类型*/
  private timeChange(dates: number | string) {
    const oDate = new Date(dates);
    const year = oDate.getFullYear();
    let mouth: string | number = oDate.getMonth() + 1;
    mouth = mouth < 10 ? '0' + mouth : mouth;
    let days: string | number = oDate.getDate();
    days = days < 10 ? '0' + days : days;
    let hours: string | number = oDate.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minute: string | number = oDate.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    let second: string | number = oDate.getSeconds();
    second = second < 10 ? '0' + second : second;
    const str =
      year +
      '-' +
      mouth +
      '-' +
      days +
      ' ' +
      hours +
      ':' +
      minute +
      ':' +
      second;
    return str;
  }
  // 参数为一个时间周期， 请求数据;
  private queryData(dateRange: any) {
    const that = this;
    treeDetailServerServer.getData(dateRange).then((res: any) => {
      if (res.data) {
        this.originData = res.data.map((item: any) => {
          return {
            eventTypeCode: item.eventTypeCode,
            eventTypeName: item.eventTypeName,
            eventNumber: item.eventNumber,
            flag: false,
          };
        });
      }
    });
  }
  // 点击日期的当前选中状态;
  private hasAction(cur: number) {
    this.curIndex = cur;
    // if (this.interVal) {
    clearInterval(this.timer);
    this.toLoop(this.curIndex);
    // this.interVal = false;
    // }
  }
  // 点击日期（周，月，季，年）
  private clickDate(idx: number) {
    const curItem = this.dateTypes[idx];
    // 添加当前项样式
    this.hasAction(idx);
    if (!curItem) {
      return false;
    }
    if (!curItem.value) {
      curItem.value = 'week';
    }
    switch (curItem.value) {
      case 'week':
        this.oDataRange.startTime = this.timeChange(
          new Date().getTime() - 604800000,
        );
        this.oDataRange.endTime = this.timeChange(new Date().getTime());
        break;

      case 'month':
        this.oDataRange.startTime = this.timeChange(
          new Date().getTime() - 2592000000,
        );
        this.oDataRange.endTime = this.timeChange(new Date().getTime());
        break;

      case 'season':
        this.oDataRange.startTime = this.timeChange(
          new Date().getTime() - 2592000000 * 3,
        );
        this.oDataRange.endTime = this.timeChange(new Date().getTime());
        break;

      case 'year':
        this.oDataRange.startTime = this.timeChange(
          new Date().getTime() - 2592000000 * 12,
        );
        this.oDataRange.endTime = this.timeChange(new Date().getTime());
        break;
    }
    this.queryData(this.oDataRange);
    this.cleartGis();
  }

  // 点击日期轮播
  private toLoop(index: number) {
    const that = this;
    let curNum = index;
    this.timer = setInterval(() => {
      if (curNum >= 3) {
        curNum = 0;
      } else {
        curNum++;
      }
      that.clickDate(curNum);
    }, 10000);
  }
  // 清除定时器
  private destroyed() {
    if (!this.timer) {
      clearInterval(this.timer);
    }
  }

  private created() {
    this.toLoop(this.curIndex);
    console.log(this.oDataRange, 333);

    this.queryData(this.oDataRange);
  }

  private treeDetailClick(item: any, index: number) {
    item.flag = !item.flag;
    this.treeNodeConnect(item);
  }

  // 树节点高亮多选
  private treeNodeConnect(item: any) {
    if (item.flag) {
      this.sum++;
      clearInterval(this.timer);
      // this.interVal = true;
      if (item.eventNumber > 0) {
        this.gisHandleLighte(item.eventTypeCode);
      }
    } else {
      this.sum--;
      if (this.sum === 0) {
        this.toLoop(this.curIndex);
        // this.interVal = false;
      }
      this.gisHandleDark(item.eventTypeCode);
    }
  }

  /**
   * 以下时和GIS的交互
   */

  // 树节点高亮时
  private gisHandleLighte(item: string) {
    this.gisHandle = this.oDataRange;
    this.gisHandle.eventType = item;
    this.getComponent().addAccidentDataToMap(this.gisHandle);
  }
  // 树节点取消高亮时
  private gisHandleDark(item: string) {
    this.getComponent().removeAccidentdata(item);
    this.getComponent().closePopup();
  }

  // 切换日期 清除所有地图
  private cleartGis() {
    if (this.sum > 0) {
      this.sum = 0;
      this.gisHandleDark('自然灾害');
      this.gisHandleDark('公共卫生事件');
      this.gisHandleDark('社会安全事件');
      this.gisHandleDark('事故灾难');
    }
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'queryAndShowAccident',
    );
    return component;
  }
  private mounted() {
    (this as any).resolveMap.call(this, 'map').then(() => {
      this.getComponent().on('AccidentPopup', this.onShowPopup, this);
    });
    this.messsageBus.on('EventInfoToTree', (itemE: any) => {
      clearTimeout(this.tiemeout);
      this.treeLineShow.forEach((element: any) => {
        // item.eventType;
        element.list.forEach((itemF: string) => {
          if (itemF === itemE.eventType) {
            this.treeLine = element.class;
            return;
          }
        });
      });
      this.tiemeout = setTimeout(() => {
        this.treeLine = '';
        clearTimeout(this.tiemeout);
      }, 10000);
    });
  }
  private onShowPopup(event: any) {
    // console.log(event.data); // 用于获取返回的信息
    const tit = event.data.attributeSet.find('title').value;
    const reportTime = event.data.attributeSet.find('reportTime').value;
    const cont = tit;
    const self = this;
    const data = this.gisHandle;
    const popup = new EventInfoPop({
      el: '#' + event.containerId,
      data() {
        return {
          data: {
            head: tit,
            cont,
            time: reportTime,
          },
          config: {
            title: 'head',
            content: 'cont',
            time: 'time',
          },
        };
      },
      methods: {
        // 这个是关闭操作
        close() {
          self.getComponent().closePopup();
        },
      },
    });
  }

  private beforeDestroy() {
    this.getComponent().off('AccidentPopup', this.onShowPopup, this);
    this.getComponent().unload();
    clearInterval(this.timer);
  }
}
</script>
<style lang="less">
@import '../../../../../assets/css/decisionSupport/TreeDetail.css';
</style>
