<template>
  <!-- 辅助决策 -->
  <div class="panelPublicDefault rainCont">
     <ZoomBtn></ZoomBtn>
    <div class="panelPublicDefault_hd">
      <span class="title-panel">
        辅助决策
      </span>
    </div>
    <div class="panelPublicDefault_tableTitle">
      <p class="panelPublicDefault_tableName">名称</p>
      <div class="panelPublicDefault_tablejj">
        <p>精简</p>
        <p>完整</p>
      </div>
    </div>
    <div class="panelPublicDefault_content">
      <ul class="panelPublicDefault_ul">
      <el-scrollbar style="height:100%">
        <li v-for="(item,index) in initList" :key="index">
          <p class="panelPublicDefault_name">{{item.name}}</p>
          <p :class="item.show==='default'?'panelPublicDefault_icon':'panelPublicDefault_wzicon'">
            <i @click="down(item,itemChild.type)"  v-for="(itemChild,indexChild) in item.typeList" :key="indexChild" :title="itemChild.titleName"></i>
          </p>
        </li>
      </el-scrollbar>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import { downloadFile } from '@/util/tools';
import publishObjectPath from '@/util/configRegistry';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
@Component({
  name: 'AidDecisionMaking',
  components: {
    ZoomBtn,
  },
})
export default class AidDecisionMaking extends Vue {
  private EpicentralIntensity: any = 0; // 震中设防烈度
  private initList: any = [
    {
      name: '地震速报', // 名称
      schemeType: '', // 方案类型可不填
      typeList: [ // 显示对应下载图标
        {
          titleName: '完整模式',
          type: '', // 传对应type可不传
        },
      ],
      eventClick: 'getFileDownload', // 对应tab下下载的方法
    },
    {
      name: '地震灾情简报',
      schemeType: '12',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'getFileForBulletin',
      show: 'default',
    },
    {
      name: '地震基本信息',
      schemeType: '1',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'downloadFile',
      show: 'default',
    },
    {
      name: '震区风险隐患',
      schemeType: '2',
      eventClick: 'downloadFile',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      show: 'default',
    },
    {
      name: '震区应急力量',
      schemeType: '3',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'downloadFile',
      show: 'default',
    },
    {
      name: '震区应急资源',
      schemeType: '4',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'downloadFile',
      show: 'default',
    },
    {
      name: '地震辅助决策报告',
      schemeType: '5',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'getFileForBulletin', // 对应tab下下载的方法
      show: 'default',
    },
    {
      name: '震区烈度图模型',
      schemeType: '6',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'getFileForBulletin', // 对应tab下下载的方法
      show: 'default',
    },
    {
      name: '指挥决策模型',
      schemeType: '7',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'getFileForBulletin',
      show: 'default',
    },
    {
      name: '各种救灾事项的重要性和实时判断模型',
      schemeType: '8',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'getFileForBulletin',
      show: 'default',
    },
    {
      name: '堤坝应急抢险救援对策模型',
      schemeType: '9',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'getFileForBulletin',
      show: 'default',
    },
    {
      name: '交通管制路线和管制措施模型',
      schemeType: '10',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'getFileForBulletin',
      show: 'default',
    },
    {
      name: '救灾需求及救援调度方案模型',
      schemeType: '11',
      typeList: [
        {
          titleName: '精简模式',
          type: 2,
        },
        {
          titleName: '完整模式',
          type: 1,
        },
      ],
      eventClick: 'getFileForBulletin',
      show: 'default',
    },
  ];
  private getFileDownload(item: any) {
    // 地址速报
    const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(JSON.parse(this.$store.state.dataFilterControl.filter.geometry), 4326);
    const wkt = polygon.asWkt().toLocaleUpperCase();
    const params = { eventId: this.$store.state.eventPushStore.eventId, polygon: wkt};
    installDisasterJudgeServer.quickJudgeServer
      .getFileDownload(params)
      .then((res: any) => {
        const data: any = publishObjectPath.value.UploadUrl + '/api/file/download/v2?url=' + res.data.filePath;
        window.open(data, '_self');
      });
  }
  // 灾损报告导出
  private getFileForBulletin(item: any, type?: any) {
    // 判断是否模型计算以及烈度圈计算，二者都操作之后方可下载
    if (
      !this.$store.state.earthQuake.substanceData.Model_Infos ||
      this.$store.state.dataFilterControl.zhypGeoType.key !== 'ldqYp'
    ) {
      this.$message('请灾损预估模型计算之后再导出下载');
      return;
    }
    const eventPushData: any = this.$store.state.eventPushStore.eventLocation;
    const sourceOpt = JSON.parse(
      JSON.stringify(this.$store.state.dataFilterControl.filter),
    );
    const params: any = {
      eqLevel: String(eventPushData.EqLevel), // 震级
      eventAddr: eventPushData.EventAddr, // 事发地点
      eventLat: String(eventPushData.EventLat), // 纬度
      eventLon: String(eventPushData.EventLon), // 经度
      eventId: this.$store.state.eventPushStore.eventId, // 事件id
      eventTime: eventPushData.EventTime, // 发震时间，格式：yyyy年MM月dd日HH时mm分
      eventTit: eventPushData.EventTit, // 地震事件标题
      isList: type, // 1-带列表-完整模式，2-带列表-精简模式（列表最多显示50条）
      schemeType: item.schemeType, // 方案类型，1-基本信息，2-风险隐患，3-应急力量，4-应急资源
      modelResult: JSON.stringify(
        this.$store.state.earthQuake.earthQuakeIntensityData,
      ), // 模型数据
      materialModelResult: JSON.stringify(
        {Model_Infos: this.$store.state.earthQuake.substanceData.Model_Infos},
      ),
      fortifyLevel: this.EpicentralIntensity, // 震中设防烈度
      pac: sourceOpt.districtCode || '370600', // 行政区划编码
      geoJsonArray: JSON.stringify(
        this.$store.state.dataFilterControl.zhypGeoType.value.rangeArr,
      ),
    };
    installDisasterJudgeServer.quickJudgeServer
    .GetFileForSubstance(params)
    .then((res: any) => {
      const fileName =
        `${item.name}` +
        (type === '2' ? `精简版` : `完整版`) +
        (item.schemeType === '5' ? `.pptx` : `.docx`);
      downloadFile(fileName, res.data);
    });
  }
  private down(item: any, type?: any) {
    if (item.eventClick) {
      (this as any)[item.eventClick](item, type);
    } else {
      this.$message.success('功能待开发尽请期待');
    }
  }
    // 导出
  private downloadFile( item: any, type: any) {
    // 判断是否模型计算以及烈度圈计算，二者都操作之后方可下载
    if (
      !this.$store.state.earthQuake.earthQuakeIntensityData.Model_Infos ||
      this.$store.state.dataFilterControl.zhypGeoType.key !== 'ldqYp'
    ) {
      this.$message('请烈度圈和模型计算之后再导出下载');
      return;
    }
    const eventPushData: any = this.$store.state.eventPushStore.eventLocation;
    const sourceOpt = JSON.parse(
      JSON.stringify(this.$store.state.dataFilterControl.filter),
    );
    if (!item.schemeType) {
      return;
    }
    // TODO：缺少震中设防烈度
    const params: any = {
      eqLevel: String(eventPushData.EqLevel), // 震级
      eventAddr: eventPushData.EventAddr, // 事发地点
      eventLat: String(eventPushData.EventLat), // 纬度
      eventLon: String(eventPushData.EventLon), // 经度
      eventId: this.$store.state.eventPushStore.eventId, // 事件id
      eventTime: eventPushData.EventTime, // 发震时间，格式：yyyy年MM月dd日HH时mm分
      eventTit: eventPushData.EventTit, // 地震事件标题
      isList: type, // 1-带列表-完整模式，2-带列表-精简模式（列表最多显示50条）
      schemeType: item.schemeType, // 方案类型，1-基本信息，2-风险隐患，3-应急力量，4-应急资源
      modelResult: JSON.stringify(
        this.$store.state.earthQuake.earthQuakeIntensityData,
      ), // 模型数据
      fortifyLevel: this.EpicentralIntensity, // 震中设防烈度
      pac: sourceOpt.districtCode || '370600', // 行政区划编码
      geoJsonArray: JSON.stringify(
        this.$store.state.dataFilterControl.zhypGeoType.value.rangeArr,
      ),
    };
    installDisasterJudgeServer.quickJudgeServer
      .getIntensityExport(params)
      .then((res: any) => {
        const fileName =
          `${item.name}` +
          (type === '2' ? `精简版` : `完整版`) +
          `.docx`;
        downloadFile(fileName, res.data);
      });
  }
  private getEarthquakeDistrictIntensity() { // 获取震中设防烈度
          // 震中坐标
          const zzzbEventLat =
            this.$store.state.eventPushStore.eventLocation.EventLat || '0';
          const zzzbEventLon =
            this.$store.state.eventPushStore.eventLocation.EventLon || '0';
          // 震中设防烈度参数
          const zzhbParam = {
            lat: zzzbEventLat,
            lon: zzzbEventLon,
          };
          // 震中设防烈度
          installDisasterJudgeServer.quickJudgeServer
            .getEarthquakeDistrictIntensity(JSON.parse(JSON.stringify(zzhbParam)))
            .then((res: any) => {
              this.EpicentralIntensity = (res.data && res.data.intensity) || 0;
          });
    }
  private created() {
    this.getEarthquakeDistrictIntensity();
  }
}
</script>

<style lang="less" scoped>
@import url('../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../assets/css/popUp/statistic.less');
@import url('../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../assets/img/monitorWarning';
@btn: '../../../assets/img/gisPlot';
.panelPublicDefault {
  height: 99% !important;
  .panelPublicDefault_bd {
  height: calc(100% - 40px);
  }
  .panelPublicDefault_tableTitle{
    padding: 0 16px;
    width: 92%;
    height: 50px;
    display: flex;
    p{
      display: inline-block;
      font-size: 22px;
      line-height: 46px;
      font-family: "Microsoft Ya Hei";
      color: #00e4ff;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .panelPublicDefault_tableName {
      width: 68%;
    }
    .panelPublicDefault_tablejj {
      flex: 1;
      display: flex;
      p{
        display: inline-block;
        cursor: pointer;
        width: 46px;
        height: 34px;
        margin-left: 35px;
        &:nth-child(1){
          margin-left: 0;
        }
      }
    }
  }
  .panelPublicDefault_content {
    height: calc(100% - 120px);
    .panelPublicDefault_ul {
      width: 100%;
      height: 100%;
      overflow: hidden;
      li {
        width: 92%;
        display: flex;
        margin-top: 16px;
        padding: 0 16px;
        &:nth-child(1){
          margin-top: 0;
        }
        &:nth-child(2n-1) {
          background: url('@{imgPath}/bjk.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .panelPublicDefault_name{
          width: 68%;
          font-size: 24px;
          letter-spacing: 0px;
          line-height: 36px;
          color: #e8f4fe;
          font-family: "Microsoft Ya Hei UI";
        }
        .panelPublicDefault_wzicon{
            flex: 1;
            display: flex;
            flex-direction: row-reverse;
            line-height: 36px;
            i{
              display: inline-block;
              cursor: pointer;
              width: 46px;
              height: 34px;
              margin-right: 4px;
              background: url('@{imgPath}/wz.png') no-repeat 100% 100%;
              &:hover {
                background: url('@{imgPath}/wz_hover.png') no-repeat 100% 100%;
              }
            }
        }
        .panelPublicDefault_icon {
            flex: 1;
            display: flex;
            line-height: 36px;
            i{
              display: inline-block;
              cursor: pointer;
              width: 46px;
              height: 34px;
              &:nth-child(1) {
                background: url('@{imgPath}/jj.png') no-repeat 100% 100%;
                &:hover {
                  background: url('@{imgPath}/jj_hover.png') no-repeat 100% 100%;
                }
              }
              &:nth-child(2) {
                margin-left: 35px;
                background: url('@{imgPath}/wz.png') no-repeat 100% 100%;
                &:hover {
                  background: url('@{imgPath}/wz_hover.png') no-repeat 100% 100%;
                }
              }
            }
        }
      }
    }
  }
}
</style>
