<template>
  <div class="DeploymentPop">
    <AccordionPop
      :title="title"
      :listData="testData"
      :groupClick="groupClick"
      :itemClick="itemClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AccordionPop from '@/views/theme/decisionSupport/common/AccordionPopModule.vue';
import { ITeamAssignment } from '@/interface/feature/earthquake/TeamAssignment.interface';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { pushDataRequestServe } from '@/api/installServer';
const teamAssignment = ['SEND_FIELDTEAM', 'SEND_HURRYTEAM']; // 队伍调派(0.现场队伍 1.赶赴队伍、待命队伍)

@Component({
  name: 'Deployment',
  components: {
    AccordionPop,
  },
})
export default class Deployment extends Vue {
  public testData: any[] = [];
  public queryDeploymentList: any[] = [];
  private title = '调度部署';
  private switchIds: any[] = [];
  private teamStatus = ['现场救援队', '赶赴救援队', '待命救援队'];
  private tempatePopUp: any = {
    teamDispatch: null,
  };
  private switchIdsPop: any = {};


  private groupClick(group: any) {
    const code = this.teamStatus.indexOf(group.title);
    this.switchIds = [];
    this.getComponent().removeTeam();
    this.getComponent().addTeam(
      code,
      group.children.map((item: any) => {
        return {
          typeCode: item.typeCode,
          data: item.pointList,
        };
      }),
    );
    this.queryDeploymentList = group.pointList.map(
      (item: any, index: number) => {
        return {
          serial: index,
          name: item.name,
          type: item.typeName,
          distance: item.distance,
          id: item.id,
          event: item,
        };
      },
    );
    this.sendListData(this.queryDeploymentList);
  }

  private itemClick(item: any, children: any, index: number) {
    const code = this.teamStatus.indexOf(item.title);
    if (children.isActive) {
      this.getComponent().addTeamByTypeCode(
        children.pointList[0].typeCode,
        // children.pointList,
        code,
      );
      this.childreListHandler(true, children.pointList);
    } else {
      this.getComponent().removeTeamByTypeCode(
        children.pointList[0].typeCode,
        code,
      );
      children.pointList.forEach((point: any) => {
        const i = this.switchIds.indexOf(point.id);
        if (i > -1) {
          this.switchIds.splice(i, 1);
        }
      });
      this.childreListHandler(false, children.pointList);
    }
  }

  private childreListHandler(bool: boolean, data: any[]) {
    const dataList = data.map((item: any, index: number) => {
      return {
        serial: index,
        name: item.name,
        type: item.typeName,
        distance: item.distance,
        id: item.id,
        event: item,
      };
    });
    if (bool) {
      this.queryDeploymentList = this.queryDeploymentList.concat(dataList);
    } else {
      for (const ite of dataList) {
        const res = this.queryDeploymentList.find((item: any) => {
          return item.id === ite.id;
        });
        if (res) {
          this.queryDeploymentList.splice(
            this.queryDeploymentList.indexOf(res),
            1,
          );
        }
      }
    }
    this.sendListData(this.queryDeploymentList);
  }

  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.rescueHelpFactory.getComponent('teamDispatch');
    return component;
  }

  private async getData(indexId: number) {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = teamAssignment[indexId]; // 位置id
    const res: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      locationId,
    );
    const tsData = JSON.parse(res.data.content)[0].data;
    const tsDataLast = JSON.parse(tsData).event.list;
    return tsDataLast;
  }

  private getChildren(index: number, single: any) {
    const data = this.testData[index] as any;
    (this.testData[index] as any).team++;
    const item = (data.children as any).find((tem: any) => {
      return tem.title === single.typeName;
    });
    const point = {
      ...single,
      county: {
        ...single.county,
        id: single.county._id,
      },
      distance: (+single.distance / 1000).toFixed(2),
    };
    if (item) {
      item.team++;
      item.persoanls += single.num;
      data.persoanls += single.num;
      item.pointList.push(point);
    } else {
      data.typeCode = single.typeCode;
      data.children.push({
        title: single.typeName,
        team: 1,
        persoanls: single.num,
        typeCode: single.typeCode,
        isActive: true,
        pointList: [point],
      });
      data.persoanls += single.num;
    }
    data.pointList.push(point);
    this.$set(this.testData, index, data);
  }

  private async setData(index: number) {
    // 2.赶赴队伍
    this.getComponent().unload();
    const tsData: any = await this.getData(index);
    this.getComponent().load();
    this.switchIds = [];
    this.testData.forEach((item: any) => {
      tsData.forEach((v: any) => {
        if (item.title === v.teamjc) {
          for (const key in item) {
            if (key === 'children' || key === 'pointList') {
              item[key] = [];
            } else if (key !== 'title') {
              item[key] = 0;
            }
          }
        }
      });
    });

    tsData.forEach((v: any) => {
      const item = (this.testData as any).find((tem: any) => {
        return v.teamjc === tem.title;
      });
      let i = 0;
      if (item) {
        i = this.testData.indexOf(item);
      } else if (this.teamStatus.indexOf(v.teamjc) > -1) {
        this.testData.push({
          title: v.teamjc,
          team: 0,
          persoanls: 0,
          children: [],
          pointList: [],
        });
        i = this.testData.length - 1;
      }
      this.getChildren(i, v);
    });
  }

  private sendListData(data: any[]) {
    this.messsageBus.emit('query_deployment_list', data);
  }

  // 监听现场队伍
  @Watch('$store.state.eventPushStore.SEND_FIELDTEAM')
  private getSEND_FIELDTEAM(val: any) {
    if (val > 0) {
      this.setData(0);
    }
  }

  // 监听可调队伍
  @Watch('$store.state.eventPushStore.SEND_HURRYTEAM')
  private getSEND_HURRYTEAM(val: any) {
    if (val > 0) {
      this.setData(1);
    }
  }

  private getDistanceTime(time: number) {
    const t = time * 1000;
    const h = Math.floor(t / 1000 / 60 / 60);
    const m = Math.floor((time / 60) % 60);
    return h + '小时' + m + '分钟';
  }

  private onShowPopup(event: any) {
    const index = this.teamStatus.indexOf(event.data.teamjc) > 0;
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
      popupId: event.data.id, // 监听id，必须
      moduleTypeID: 'teamDispatch', // 模块id，必须
      otherData: {
        name: event.data.name,
        list: [
          { label: '地址', value: event.data.address },
          { label: '调派人数', value: event.data.num },
          { label: '车辆数', value: carnum},
          { label: '类型', value: event.data.typeName },
          { label: '联系人', value: event.data.teamleader },
          { label: '电话', value: event.data.leadermtel },
        ],
        onOff: this.switchIds.indexOf(event.data.id) > -1,
        switchInfo: index ? switchInfo : null,
      },
    };
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup({
      ...event,
      type: 'teamDispatch',
    });
  }

  private switchPathPlanningHandler(bool: boolean, event: any) {
    if (bool) {
      this.switchIds.push(event.data.id);
      this.getComponent().on(
        'route',
        (data: any) => {
          this.tempatePopUp.switchInfo = {
            time: this.getDistanceTime(data.routeData.duration),
            distance: (data.routeData.distance / 1000).toFixed(2),
          };
          this.switchIdsPop[event.data.id] = this.tempatePopUp.switchInfo;
          this.getComponent().off('route');
        },
        this,
      );
      this.getComponent().openRoutePlan(event.data.id, event.data.typeCode);
    } else {
      this.getComponent().closeRoutePlan(event.data.id);
      const index = this.switchIds.indexOf(event.data.id);
      this.switchIds.splice(index, 1);
    }
  }

  private mounted() {
    this.getComponent().load();
    // this.getComponent().off('dispatch_team_point', this.onShowPopup, this);
    this.getComponent().on('team_popup', this.onShowPopup, this);
    this.messsageBus.on('openPopup', (event: any) => {
      // this.onShowPopup({data:event});
      // this.switchIds.push(event.id);
      this.getComponent().openPopup(event.id, event.typeCode);
    });
  }
  private created() {
    if (this.$store.state.eventPushStore.SEND_FIELDTEAM > -1) {
      this.setData(0);
    }
    if (this.$store.state.eventPushStore.SEND_HURRYTEAM > -1) {
      this.setData(1);
    }
  }

  private beforeDestroy() {
    this.getComponent().off('team_popup');
    this.getComponent().unload();
    this.messsageBus.off('openPopup');
    this.getComponent().closePopup();
  }
}
</script>

<style lang="less" scoped>
.DeploymentPop {
   position: absolute !important;
  top: 225px;
  left: 75px;
  z-index: 5;
}
</style>
