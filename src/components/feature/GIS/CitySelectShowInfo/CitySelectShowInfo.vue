<template>
  <div
    id="citySelectedMonitorPop"
    class="distric_box"
    v-if="$store.state.mapTools.citySelectVisible"
  >
    <h1 class="distric_title">
      <p class="title-panel">{{cityList[0]}}区市列表</p>
      <div class="btn_conceal" @click="conceal"></div>
      <div class="btn_close" @click="close"></div>
    </h1>
    <div class="contnet" v-show="contentShow">
      <ul>
        <li
          @click="selectedCity($event,item)"
          :class="{'designation_long': item.name.length > 4}"
          v-for="(item, index) in cityList[1]"
          :key="index"
        >
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import { nomalLeftServer } from '@/api/installServer';
@Component({
  name: 'CitySelectShowInfo',
  components: { MapCommon },
  mixins: [MapCommon],
})
export default class CitySelectShowInfo extends Vue {
  @Prop() public option: any;

  private cityList: any[] = [];

  // 被选择程序列表
  private citySelectedList: any[] = [];

  // 控制窗口是否隐藏
  private contentShow: boolean = true;

  // 隐藏窗口
  private close() {
    // this.$store.commit('mapTools/changeCitySelectVisible', false);
    this.messsageBus.emit('CitySelectShow', false);
  }
  // 折叠窗口
  private conceal() {
    this.contentShow = !this.contentShow;
  }
  private handleStooreGeometry(districtCode: any) {
    // 往DataFilterControl.ts 的geometry中存放数据
    const geoStrObj = {
      filter: {
        districtCode: districtCode || '',
        // districtCode: this.citySelectedList.length ? '' : distirctCode, // "370686"
        // geometry: geometry ? JSON.stringify(geometry) : '',
        geometry: '',
      },
      zhypGeoType: {
        key: 'xzqhyp',
      },
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
    if (this.citySelectedList.length > 0) {
       this.$store.commit('eventPushStore/changeChecked', 'district');
    } else {
      this.$store.commit('eventPushStore/changeChecked', 'no_district');
    }
  }
  // GIS相关组件0
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'regionSelection',
    );
    return component;
  }

  private initVuexFilter() {
    const geoStrObj = {
      filter: {
        districtCode: '', // "370686"
        geometry: '',
      },
      zhypGeoType: {},
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
  }

  // 城市信息请求位置
  private created() {
    this.cityList = [
      '邯郸市',
    ];
    this.$store.commit('mapTools/changeNearbyQueryVisible', false);
    this.initVuexFilter();
    // 获取城市信息
    nomalLeftServer.getCitySelected().then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      this.cityList.push(res.data);
    });
  }

  private mounted() {
    // 拖拽
    const eMapPanelDrag: any = new Drag(
      '#citySelectedMonitorPop',
      '.distric_title',
      {
        container: '.layoutMain',
      },
    );
    eMapPanelDrag.toDrag();
    // GIS调用组件1
    this.getComponent().load();
  }

  private beforeDestroy() {
    // 这句话执行的时机应该是，当前的key为hcqyp
    if (this.$store.state.dataFilterControl.zhypGeoType && this.$store.state.dataFilterControl.zhypGeoType.key === 'xzqhyp') {
      this.initVuexFilter();
    }
    this.$store.commit('eventPushStore/changeChecked', 'no_district');
  }

  private destroyed() {
    // 销毁GIS组件
    this.getComponent().unload();
  }

  // 点击进行对多选判断
  private selectedCity(e: any, item: any) {
    // 城市名称是否多长，调整样式
    if (this.citySelectedList.some((i: any) => item.name === i.name)) {
      const index = this.citySelectedList.indexOf(item);
      if (index !== -1) {
        this.citySelectedList.splice(index, 1);
        e.target.classList.remove(
          (item.name.length > 4 ? 'is-checked-long' : 'is-checked'),
        );
      }
      const distirctCode = this.getSelectedGbCodes();
      // this.handleStoreDistrictCode(distirctCode);
      this.handleStooreGeometry(distirctCode);
      // 取消地图标点
      this.getComponent().removeRegion(item.gbCode).then((geometry: any) => {
        // geometry = (geometry && geometry.type) ? geometry : null;
        // this.handleStooreGeometry(distirctCode, geometry);
      });
    } else {
      this.citySelectedList.push(item);
      const distirctCode = this.getSelectedGbCodes();
      // this.handleStoreDistrictCode(distirctCode);
      this.handleStooreGeometry(distirctCode);
      e.target.classList.add(
        (item.name.length > 4 ? 'is-checked-long' : 'is-checked'),
      );
      // 添加地图标点
      this.getComponent().drawRegion(item.gbCode).then((geometry: any) => {
        // this.handleStooreGeometry(distirctCode, geometry);
      });
    }
  }
  private getSelectedGbCodes() {
    const gbcodes: any = [];
    this.citySelectedList.forEach((element: any) => {
      if (element.gbCode) {
        gbcodes.push(element.gbCode);
      }
    });
    return gbcodes.join(',');
  }
}


</script>
<style lang='less' scoped>
@url: '../../../../assets/img/halfScreen/eventAndTopics';
@btn: '../../../../assets/img/gisPlot';
.distric_box {
  width: 480px;

  .distric_title {
    background: url('@{url}/provinces_title_bg.png') no-repeat center / 100%
      100%;

    div {
      position: absolute;
      width: 68px;
      height: 48px;
      cursor: pointer;
      top: -4px;
    }
    .title-panel {
      margin-left: 40px;
      line-height: 72px;
      height: 72px;
      user-select: none;
      cursor: pointer;
    }
    .btn_conceal {
      right: 68px;
      background: url('@{btn}/eventAndTopics_up_normal.png') no-repeat center /
        100% 100%;
      &:hover {
        top: -3px;
        background: url('@{btn}/eventAndTopics_up_highlight.png') no-repeat
          center / 100% 100%;
      }
    }
    .btn_close {
      right: 0;
      background: url('@{btn}/eventAndTopics_close_normal.png') no-repeat center /
        100% 100%;
      &:hover {
        top: -3px;
        background: url('@{btn}/eventAndTopics_close_highlight.png') no-repeat
          center / 100% 100%;
      }
    }
  }
  .contnet {
    background: url('@{url}/provinces_bg.png') no-repeat center / 100% 100%;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 16px 0 32px 28px;
      li {
        width: 120px;
        margin: 11px;
        border: none;
        text-align: center;
        font-size: 24px;
        color: #cff4ff;
        user-select: none;
        box-shadow: none;
        height: 48px;
        line-height: 48px;
        cursor: pointer;
        background: url('@{url}/provinces_text_bg_.png') no-repeat center / 100%
          100%;
      }
      .is-checked {
        background: url('@{url}/provinces_text_bg_active.png') no-repeat center /
          100% 100%;
        color: #fffabe;
      }
      .is-checked-long {
        background: url('@{url}/provinces_text_long_active_bg_.png') no-repeat
          center / 100% 100%;
        color: #fffabe;
      }
      .designation_long {
        width: 406px;
        background: url('@{url}/provinces_text_long_bg_.png') no-repeat center /
          100% 100%;
      }
    }
  }
}
</style>
