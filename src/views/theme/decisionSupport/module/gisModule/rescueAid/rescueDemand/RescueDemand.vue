<template>
  <div class="rescue-demand">
    <AccordionPop
      :title="title"
      :listData="list"
      :groupClick="groupClick"
      :itemClick="itemClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import AccordionPop from '@/views/theme/decisionSupport/common/AccordionPopModule.vue';
import { pushDataRequestServe } from '@/api/installServer';
import data from '../../../../../../common/gisModules/disasterSta/sta/data';
const knownDisasterSituation = ['SEND_RESCUEDEMAND']; // 队伍需求（需求队伍人数）
@Component({
  name: 'RescueDemand',
  components: {
    AccordionPop,
  },
})
export default class RescueDemand extends Vue {
  public testData = [
    // 渲染的数据
    {
      title: '现场队伍',
      persoanls: 0,
      children: [],
    },
  ];
  private title = '救援需求';
  private list: any = [];
  private listTs: any = [];
  private rightListData: any = [];
  private switchIds: any[] = [];
  private tempatePopUp: any = {
    teamDispatch: null,
  };
  private switchIdsPop: any = {};
  private groupClick(obj: any) {
    this.gisPoint(obj.id);
  }
  private itemClick(item: any, current: any) {
    if (current.isActive) {
      this.gisPoint2nd(current.typeCode);
    } else {
      this.gisUnPoint2nd(current.typeCode);
      // 取消时删除路径
      current.list.forEach((val2nd: any) => {
        const idIndex = this.switchIds.indexOf(val2nd.id);
        if (idIndex > -1) {
          this.getComponent().closeRoutePlan(val2nd.id);
          this.switchIds.splice(idIndex, 1);
        }
      });
    }
    const listView: any = [];
    item.children.forEach((val: any, key: number) => {
      if (val.isActive) {
        this.rightListData.forEach((rightData: any) => {
          if (rightData.typeCode === val.typeCode) {
            listView.push(rightData);
          }
        });
      }
    });
    this.messsageBus.emit('query_team_point', listView); // 右侧列表数据联动
  }

  private async getData(indexId: number) {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = knownDisasterSituation[indexId]; // 位置id
    const res: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      locationId,
    );
    const tsData = JSON.parse(res.data.content)[0];
    const tsDataLast = JSON.parse(tsData.data).event.list;
    const tsDataLast1 = [
      {
        x: '116.346032',
        y: '39.869639',
        district: '应急管理部消防救援局',
        workers: [
          {
            typeCode: 'T005',
            typeName: '地震救援队',
            typetitle: '应急管理部消防救援局',
            num: '1',
          },
          {
            typeCode: 'T005',
            typeName: '地震救援队',
            typetitle: '应急管理部消防救援局',
            num: '2',
          },
          {
            typeCode: 'T001',
            typeName: '矿山救援队',
            typetitle: '应急管理部消防救援局',
            num: '8',
          },
          {
            typeCode: 'T001',
            typeName: '矿山救援队',
            typetitle: '应急管理部消防救援局',
            num: '1',
          },
          {
            typeCode: 'T001',
            typeName: '矿山救援队',
            typetitle: '应急管理部消防救援局',
            num: '1',
          },
          {
            typeCode: 'T005',
            typeName: '地震救援队',
            typetitle: '应急管理部消防救援局',
            num: '3',
          },
          {
            typeCode: 'T005',
            typeName: '地震救援队',
            typetitle: '应急管理部消防救援局',
            num: '4',
          },
          {
            typeCode: 'T005',
            typeName: '地震救援队',
            typetitle: '应急管理部消防救援局',
            num: '5',
          },
          {
            typeCode: 'T001',
            typeName: '矿山救援队',
            typetitle: '应急管理部消防救援局',
            num: '8',
          },
        ],
      },
      {
        x: '115.346032',
        y: '34.869639',
        district: '白纸坊小型消防站',
        workers: [
          {
            typeCode: 'T005',
            typeName: '地震救援队',
            typetitle: '白纸坊小型消防站',
            num: '6',
          },
          {
            typeCode: 'T003',
            typeName: '消防救援队',
            typetitle: '白纸坊小型消防站',
            num: '7',
          },
        ],
      },
    ];
    return tsDataLast;
  }
  // 重组workers数组
  private setArry(arr: any) {
    const newArr = arr.workers;
    const newWorkers: any = [];
    newArr.forEach((item: any) => {
      const idx: any = newWorkers.findIndex(
        (o: any) => o.typeCode === item.typeCode,
      );
      if (idx === -1) {
        newWorkers.push(item);
      } else {
        newWorkers[idx].num =
          Number(newWorkers[idx].num) + Number(item.num) + '';
      }
    });
    return newWorkers;
  }

  private async setData() {
    const tsData: any = await this.getData(0);
    tsData.forEach((val: any, ind: number) => {
      val.workers = this.setArry(val);
      val.id = 'need_' + ind; // 增加id标识
      val.title = val.district;
      val.persoanls = val.workers
        .map((item: any) => Number(item.num))
        .reduce((t: number, c: number) => t + c); // 计算一级列表总数
      val.workers.forEach((value: any) => {
        value.title = value.typeName;
        value.persoanls = value.num;
        if (ind === 0) {
          value.isActive = true;
        } else {
          value.isActive = false;
        }
      });
      val.children = val.workers;
    });
    this.listTs = tsData;
    this.getComponent().unload(); // 清空点位
    this.getComponent().load(tsData); // 显示地图点位
    if (tsData.length) {
      this.gisPoint(tsData[0].id); // 默认选择第一个
    }
  }
  // 点击勾选需求点（1级）时
  private gisPoint(id: string) {
    this.getComponent().removeNeedPoint(); // 清空点位
    this.getComponent().needPointClick(id); // 设置点位
  }
  // 点击勾选队伍点(2级)时
  private gisPoint2nd(typeCode: string) {
    this.getComponent().addRescureTeamByCode(typeCode);
  }
  // 点击反选队伍点(2级)时
  private gisUnPoint2nd(typeCode: string) {
    this.getComponent().removeRescureTeamByCode(typeCode);
  }
  // 获取路径规划的信息
  private onNeedRoute(id: any) {
    // this.getComponent().off('need_route');
    this.getComponent().on('need_route', (gisData: any) => {
      this.tempatePopUp.switchInfo = {
        time: this.getDistanceTime(gisData.routeData.duration),
        distance: (gisData.routeData.distance / 1000).toFixed(2),
      };
      this.switchIdsPop[id] = this.tempatePopUp.switchInfo;
      this.getComponent().off('need_route');
    });
  }
  // 联动gis方法 开始
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.rescueHelpFactory.getComponent('rescueNeed');
    return component;
  }
  // 监听后台数据推送
  // @Watch('$store.state.eventPushStore.SEND_RESCUEDEMAND')
  // private getSEND_RESCUEDEMAND(val: any) {
  //   if (val > 0) {
  //     this.setData();
  //   }
  // }
  private dealListTs(list: any, gisList: any) {
    // 把gis的数据加入到菜单里
    list.forEach((item: any, index: number) => {
      if (item.id === gisList.id) {
        // 找到同一大类
        item.children.forEach((val: any, ind: number) => {
          gisList.data.forEach((val2nd: any) => {
            if (val.typeCode === val2nd.type) {
              val.list = val2nd.list;
            }
          });
        });
      }
    });
  }
  // 右侧列表数据
  private getRightlist() {
    // this.getComponent().off('query_team_point');
    this.getComponent().on('query_team_point', (gisData: any) => {
      this.dealListTs(this.listTs, gisData);
      this.list = this.listTs;
      this.rightListData = gisData.data.map((item: any) => item.list).flat();
      this.rightListData.forEach((val: any) => {
        val.distance = (val.distance / 1000).toFixed(2);
      });
      this.messsageBus.emit('query_team_point', this.rightListData);
    });
  }

  private getDistanceTime(time: number) {
    const t = time * 1000;
    const h = Math.floor(t / 1000 / 60 / 60);
    const m = Math.floor((time / 60) % 60);
    return h + '小时' + m + '分钟';
  }

  private onShowPopup(event: any) {
    const switchInfo = this.switchIdsPop[event.data.id]
      ? this.switchIdsPop[event.data.id]
      : {
          time: '',
          distance: '',
        };
    let carnum: number | string = '无';
    if (event.data.carnum === 0) {
      carnum = 0;
    } else if (event.data.carnum) {
      carnum = event.data.carnum;
    }
    const param = {
      that: this,
      popupId: event.content.id, // 监听id，必须
      moduleTypeID: 'rescueNeed', // 模块id，必须
      otherData: {
        name: event.data.name,
        list: [
          { label: '地址', value: event.data.address },
          { label: '调派人数', value: event.data.num },
          { label: '车辆数', value: carnum},
          { label: '类型', value: event.data.typeName },
          { label: '联系人', value: event.data.contact },
          { label: '电话', value: event.data.tel },
        ],
        onOff: this.switchIds.indexOf(event.data.id) > -1,
        switchInfo,
      },
    };
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup({
      ...event,
      type: 'teamDispatch',
    });
  }
  // 路径规划开关
  private switchPathPlanningHandler(bool: boolean, event: any) {
    if (bool) {
      this.switchIds.push(event.data.id);
      this.onNeedRoute(event.data.id);
      this.getComponent().openRoutePlan(event.data.id, event.data.typeCode);
    } else {
      this.getComponent().closeRoutePlan(event.data.id);
      const index = this.switchIds.indexOf(event.data.id);
      this.switchIds.splice(index, 1);
    }
  }
  // 右侧列表点击弹窗
  private onRightListClick() {
    // this.messsageBus.off('teamPointClickRescue');
    this.messsageBus.on('teamPointClickRescue', ([id, typeCode]: any) => {
      this.getComponent().teamPointClick(id, typeCode); // 地图弹窗
    });
  }
  private mounted() {
    // this.getComponent().off('popup');
    this.getComponent().on('popup', this.onShowPopup, this);
    this.getRightlist();
  }
  private created() {
    if (this.$store.state.eventPushStore.SEND_RESCUEDEMAND > -1) {
      this.setData();
    }
    this.onRightListClick();
  }
  private beforeDestroy() {
    // this.getComponent().off('need_route');
    this.messsageBus.off('teamPointClickRescue');
    this.getComponent().off('popup');
    this.getComponent().off('query_team_point');
    this.getComponent().unload();
    this.getComponent().closePopup();
  }
}
</script>

<style lang="less" scoped>
.rescue-demand {
  position: absolute !important;
  top: 225px;
  left: 75px;
  z-index: 5;
}
</style>
