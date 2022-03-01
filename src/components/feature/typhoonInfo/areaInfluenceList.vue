

<!--台风影响区域列表-->
<template>
  <div class="areaInfluenceList" v-show="$store.state.TyphoonModule.viewConfig.isTyphoonShow" >
    <p class="title-name">
      <span>影响区域</span>
      </p>
    <i :class="showHeight?'narrow-on':'smallIcon'"  @click="smallIcon"></i>
    <div class="areaInfluenceListBox" v-loading="loading" :class="showHeight?'smallHeight':''">
      <div class="statisticsData" v-if="statisticsData">
        <ul>
          <li>
            台风中心当前位置：
            <span class="address">{{currentLocation || '暂无数据'}}</span>
          </li>
        </ul>
        <ul>
          <!-- <li>
            预测影响省份：
            <span>{{statisticsData.provincenum}}</span>
            <span>个</span>
          </li> -->
          <!-- <li>
            预测影响地市：
            <span>{{statisticsData.citynum}}</span>
            <span>个</span>
          </li> -->
          <li v-show="false">
            预测影响的县：
            <span>{{statisticsData.countynum}}</span>
            <span>个</span>
          </li>
          <li v-show="false">
            预测影响人口：
            <span>{{statisticsData.totalpeoplenum ? statisticsData.totalpeoplenum/10000 : 0}}</span>
            <span>万</span>
          </li>
        </ul>
        <ul>
          <li>
            高风险区域：
            <span>{{highRiskList.length}}</span>
            <span>个</span>
          </li>
          <li>
            中风险区域：
            <span>{{MediumRisk.length}}</span>
            <span>个</span>
          </li>
          <li>
            低风险区域：
            <span>{{lowRisk.length}}</span>
            <span>个</span>
          </li>
        </ul>
      </div>
      <div class="fluenceListContent">
        <div v-if="!loading && !status">
          <div class="highRiskList riskList">
            <div class="list-title">
              高风险区域
              <p>
                <span>{{highRiskList.length}}</span>
                <span>个</span>
                <i
                        @click="isHighOpenFn"
                        :class="isHighOpen? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'"
                ></i>
              </p>
            </div>
            <ul v-for="(item, index) in highRiskList" @click="infoListFn(item)" v-show="isHighOpen" :key="index" >
              <li class="cityName">{{item.name}}(当前区域)</li>
              <li class="provincenum">
                所属省份：
                <span>{{item.shengname}}</span>
              </li>
              <li class="distance">
                距离台风中心距离：
                <span>{{item._distance}}</span>
                <span>KM</span>
              </li>
              <li class="population">
                人口：
                <span>{{Number(item.population).toFixed(4)}}</span>
                <span>万</span>
              </li>
              <li class="popdensity">
                人口热力：
                <span>{{item.popdensity || '暂无数据'}}</span>
                <span>万</span>
              </li>
            </ul>
          </div>
          <div class="MediumRisk riskList">
            <div class="list-title">
              中风险区域
              <p>
                <span>{{MediumRisk.length}}</span>
                <span>个</span>
                <i
                        @click="isMediumOpenFn"
                        :class="isMediumOpen? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'"
                ></i>
              </p>
            </div>
            <ul v-for="(item, index) in MediumRisk" @click="infoListFn(item)" v-show="isMediumOpen" :key="index" >
              <li class="cityName">{{item.name}}(预测区域)</li>
              <li class="provincenum">
                所属省份：
                <span>{{item.shengname}}</span>
              </li>
              <li class="distance">
                距离台风中心距离：
                <span>{{item._distance}}</span>
                <span>KM</span>
              </li>
              <li class="population">
                人口：
                <span>{{Number(item.population).toFixed(4)}}</span>
                <span>万</span>
              </li>
              <li class="popdensity">
                人口热力：
                <span>{{item.popdensity || '暂无数据'}}</span>
                <span>万</span>
              </li>
            </ul>
          </div>
          <div class="lowRisk riskList">
            <div class="list-title">
              低风险区域
              <p>
                <span>{{lowRisk.length}}</span>
                <i
                        @click="islowOpenFn"
                        :class="islowOpen? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'"
                ></i>
              </p>
            </div>
            <ul v-for="(item, index) in lowRisk" @click="infoListFn(item)" v-show="islowOpen" :key="index" >
              <li class="cityName">{{item.name}}(已经过区域)</li>
              <li class="provincenum">
                所属省份：
                <span>{{item.shengname}}</span>
              </li>
              <li class="distance">
                距离台风中心距离：
                <span>{{item._distance}}</span>
                <span>KM</span>
              </li>
              <li class="population">
                人口：
                <span>{{Number(item.population).toFixed(4)}}</span>
                <span>万</span>
              </li>
              <li class="popdensity">
                人口热力：
                <span>{{item.popdensity || '暂无数据'}}</span>
                <span>万</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="nothingData--bg" v-if="status"></div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'AreaInfluenceList',
  mixins: [MapCommon],
})
export default class AreaInfluenceList extends Vue {
  private statisticsData: any = ''; // 统计数据
  private highRiskList: any = ''; // 高风险
  private MediumRisk: any = ''; // 中风险
  private lowRisk: any = ''; // 低风险
  private currentLocation: any = ''; // 当前中心位置
  private loading: boolean = false;
  private isHighOpen: boolean = true;
  private isMediumOpen: boolean = true;
  private islowOpen: boolean = true;
  private status: boolean = true;
  private showHeight: any = false;
  // 监听点击台风展示影响范围列表
  // @Watch('$store.state.TyphoonModule.id')
  // private infoTyphoon() {
  //
  // }
  private queryList() {
    this.loading = true;
    this.$store.dispatch('TyphoonModule/setAreaInfluenceListLoading', this.loading);
    this.statisticsData = [];
    this.highRiskList = []; // 高风险
    this.MediumRisk = []; // 中风险
    this.lowRisk = []; // 低风险
    this.status = true;
    const component = this.getComponent();
    component
      .load({ geoms: this.$store.state.TyphoonModule.geoms })
      .then((res: any) => {
        this.loading = false;
        this.$store.dispatch('TyphoonModule/setAreaInfluenceListLoading', this.loading);
        if (res) {
          this.status = false;
          this.highRiskList = res.high;
          this.MediumRisk = res.middle;
          this.lowRisk = res.low;
          this.statisticsData = res.statics;
          this.currentLocation = res.centerpoint;
        } else {
          this.status = true;
        }
      });
  }
  private infoListFn(item: any) {
    // this.getComponent().clickDistrictItem(item.id);
    // this.messsageBus.emit('influenceListInfo');
    // this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
    //   largeLeftPanel: { showFlag: true },
    // });
    // const geometryObj = {
    //   districtCode: item.tag.adcode, // "110000"
    //   districtName: item.tag.name, // "北京市"
    // };
    // // const filter = {
    // //   districtCode: item.tag.adcode,
    // // };
    // // this.$store.commit('eventPushStore/updateFilter', filter);
    // // this.$store.commit('eventPushStore/updateGeometry', JSON.parse(JSON.stringify(geometryObj)));
    //  // 往DataFilterControl.ts 的geometry中存放数据
    // const geoStrObj = {
    //   filter: {
    //     districtCode: item.tag.adcode, // "370686"
    //     geometry: '',
    //   },
    //   zhypGeoType: {
    //     key: 'tfyp',
    //   },
    // };
    // this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
    // this.$store.commit('eventPushStore/updateGeometryShareObj', JSON.parse(JSON.stringify(geometryObj)));
  }
  // 高中低展开收起
  private isHighOpenFn() {
    this.isHighOpen = !this.isHighOpen;
  }
  private smallIcon() {
    this.showHeight = !this.showHeight;
  }
  private isMediumOpenFn() {
    this.isMediumOpen = !this.isMediumOpen;
  }
  private islowOpenFn() {
    this.islowOpen = !this.islowOpen;
  }
  private created() {
    const self: any = this;
    self.resolveMap('map').then((res: any) => {
      self.messsageBus.off('positioningOperation');
      self.messsageBus.on('positioningOperation', () => {
        // self.getComponent().showhideCircle(false);
        self.$store.dispatch('TyphoonModule/setIsShow', true);
        this.$store.dispatch('TyphoonModule/setTyphoonIsShow', true);
        self.$store.commit('panelPositionChangeModule/setrightPanelPosition', {TyphoonLocation: 'right: 990px;'} );
        self.queryList();
      });
      self.messsageBus.off('closeAndBack');
      self.messsageBus.on('closeAndBack', (data: any) => {
        self.$store.dispatch('TyphoonModule/setIsShow', true);
        this.$store.dispatch('TyphoonModule/setTyphoonIsShow', true);
        self.getComponent().showhideDistricts(true);
        self.getComponent().showhideCircle(false);
      });
      self.getComponent().off('clickForhandle');
      self.getComponent().on('clickForhandle', (data: any) => {
        self.$store.dispatch('TyphoonModule/setIsShow', false);
        self.$store.dispatch('eventPushStore/UpdateGeometry', data);
        this.$store.commit('TyphoonModule/SET_TYPHOON_ISSHOW', true);
        this.$nextTick(() => {
          this.$store.commit('TyphoonModule/SET_TYPHOON_ISSHOW', false);
        });
      });
    });
    self.messsageBus.off('updateAreaInfluenceList');
    self.messsageBus.on('updateAreaInfluenceList', (boo: boolean) => {
      if (boo) {
        this.$store.dispatch('TyphoonModule/setTyphoonIsShow', true);
        self.$store.dispatch('TyphoonModule/setIsShow', true);
        self.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
          largeLeftPanel: { showFlag: false },
        });
        setTimeout(() => {
          self.$store.commit('panelPositionChangeModule/setrightPanelPosition', {TyphoonLocation: 'right: 990px;'} );
        });
        self.getComponent().showhideDistricts(true);
        self.getComponent().showhideCircle(false);
      } else {
        this.$store.dispatch('TyphoonModule/setTyphoonIsShow', true);
        self.$store.dispatch('TyphoonModule/setIsShow', false);
        self.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
          largeLeftPanel: { showFlag: true },
        });
        self.$nextTick(() => {
          self.getComponent().showhideCircle(true);
          this.$store.dispatch('TyphoonModule/setTyphoonIsShow', false);
          setTimeout(() => {
            self.getComponent().fitcircle();
          }, 1000);
        });
      }
    });
  }

  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStaFactory.getComponent(
        'typhoonDistricts',
    );
    return component;
  }

  // 台风组件
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('typhoon');
    return component;
  }

  // 事件定位组件
  private getComponentLocat() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('locateComp');
    return component;
  }
  private destroyed() {
    this.getComponent().unload();
   // this.getComponent1().unload();
    this.getComponentLocat().unload();
    this.messsageBus.off('updateAreaInfluenceList');
    this.getComponent().off('clickForhandle');
    this.messsageBus.off('closeAndBack');
    this.messsageBus.off('positioningOperation');

  }
}
</script>
<style scoped lang="less">
@btn: "../../../assets/img/gisPlot";
.areaInfluenceList {
  position: absolute;
  left: 14px;
  top: 104px;
  z-index: 3;
  height: calc(100% - 175px);
  box-sizing: border-box;
  width: 440px;
  padding-left: 14px;
  .title-name {
    // position: absolute;
    // top: 0px;
    // left: 25px;
    width: 100%;
    background: url('../../../assets/img/default/panel/half_bg_top.png') no-repeat;
    background-size: 100% 100%;
    span{
    font-weight: 600;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.5);
    color: #00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    font-style: italic;
    width: 200px;
    display: inline-block;
    padding: 0 0 0 16px;
    height: 46px;
    line-height: 46px;
    }
  }
  .smallIcon {
        position: absolute;
        right: 3px;
        width: 68px;
        height: 48px;
        top: 7px;
        cursor: pointer;
        background: url('@{btn}/eventAndTopics_down_normal.png') no-repeat
          center / 100% 100%;
        &:hover {
          background: url('@{btn}/eventAndTopics_down_highlight.png') no-repeat
            center / 100% 100%;
        }
      }
      .narrow-on {
        position: absolute;
        right: 3px;
        width: 68px;
        height: 48px;
        top: 7px;
        cursor: pointer;
        background: url('@{btn}/eventAndTopics_up_normal.png') no-repeat center /
          100% 100%;
        &:hover {
          background: url('@{btn}/eventAndTopics_up_highlight.png') no-repeat
            center / 100% 100%;
        }
      }
  .areaInfluenceListBox{
    height: 94%;
    background: url('../../../assets/img/default/panel/half_bg_bottom.png') no-repeat;
    background-size: 100% 100%;
    padding: 0 12px;
  }
  .smallHeight{
    height: 0px!important;
    overflow: hidden;
  }
  .statisticsData {
    // margin-top: 45px;
    padding: 10px 0;
    ul {
      color: #8cafd0;
      font-size: 26px;
      line-height: 40px;
      background: url('../../../assets/img/halfScreen/halflist/boxListBgIcon.png')
        no-repeat;
      background-size: 100% 100%;
      margin-bottom: 6px;
      span:nth-of-type(1) {
        color: #27e8ff;
      }
      span:nth-of-type(2) {
        color: #e8f4fe;
      }
      .address {
        color: #e8f4fe !important;
      }
    }
  }
  .fluenceListContent {
    height: calc(100% - 238px);
    overflow: auto;
    padding-top: 20px;
    .riskList {
      ul {
        background: url('../../../assets/img/halfScreen/halflist/boxListBgIcon.png')
          no-repeat;
        background-size: 100% 100%;
        padding-bottom: 5px;
        margin-bottom: 6px;
        line-height: 40px;
        li {
          color: #8cafd0;
          font-size: 26px;
          span:nth-of-type(1) {
            color: #27e8ff;
            font-size: 28px;
          }
          span:nth-of-type(2) {
            color: #e8f4fe;
            font-size: 28px;
          }
        }
        .cityName {
          font-size: 26px;
          letter-spacing: 1px;
          color: #e8f4fe;
        }
      }
    }
    .list-title {
      font-family: MicrosoftYaHei;
      font-size: 28px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 46px;
      letter-spacing: 1px;
      color: #67e1fb;
      display: flex;
      position: relative;
      &:after {
        content: '';
        background: url('../../../assets/img/halfScreen/halflist/titlexian.png')
          50% 0 no-repeat;
        position: absolute;
        width: 100%;
        height: 23px;
        top: 45px;
      }
      justify-content: space-between;
      margin-bottom: 15px;
      p {
        margin: 0 8px 0 0;
        span:nth-of-type(1) {
          font-family: Square721BT-Roman;
          font-size: 28px;
          font-weight: normal;
          font-style: italic;
          font-stretch: normal;
          line-height: 36px;
          letter-spacing: 1px;
          color: #fff000;
        }
        span:nth-of-type(2) {
          font-family: MicrosoftYaHei;
          font-style: italic;
          font-size: 24px;
          font-weight: normal;
          letter-spacing: 1px;
          color: #b3f4ff;
          margin-left: 5px;
        }
        .tempRight-switch {
          display: inline-block;
          width: 34px;
          height: 29px;
          background-size: 100% 100%;
          cursor: pointer;
          background: url('../../../assets/img/halfScreen/halflist/open.png')
            50% 50% no-repeat;
          transition: transform 0.3s;
          vertical-align: middle;
        }
        .tempRight-switch-reverse {
          transform: scale(1, -1);
        }
      }
    }
    ul {
      cursor: pointer;
    }
    .nothingData--bg {
      background: url('../../../assets/img/default/panel/noData.png') no-repeat
        50% 50%;
      width: 100%;
      height: 100%;
    }
  }
  /*修改滚动条样式*/
  .fluenceListContent::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    /**/
  }
  .fluenceListContent::-webkit-scrollbar-thumb {
    background-image: linear-gradient(
      0deg,
      #0a7ccc 0%,
      #06b4d1 52%,
      #02ebd5 100%
    );
    border-radius: 5px;
  }
  .fluenceListContent::-webkit-scrollbar-thumb:hover {
    background-image: linear-gradient(
      0deg,
      #0a7ccc 0%,
      #06b4d1 52%,
      #02ebd5 100%
    );
  }
}
</style>
<style>
.areaInfluenceList .el-loading-mask {
  /*background: url('../../../assets/img/default/panel/half_bg.png') no-repeat;*/
  background-color: rgba(7,16,34,.8);
  background-size: 100% 100%;
  width: 406px;
  /*border-top-left-radius: 20px;*/
  /*border-top-right-radius: 20px;*/
}
.areaInfluenceList .el-loading-spinner {
  background: url(../../../assets/img/halfScreen/halflist/loading.gif) no-repeat
    center;
  margin: auto;
  margin-top: -100px;
  height: 270px;
}
.areaInfluenceList .el-loading-spinner .circular {
  display: none;
}
</style>
