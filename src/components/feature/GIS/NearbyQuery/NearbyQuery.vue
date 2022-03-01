<template>
  <div id="customDistrictPanelDrag8"
       class="customDistrictPanel nearByQuery-position">
    <div class="title-panel custom-flex customDistrictPanelDrag9">
      请选择范围
      <span class="customDistrictPanel_close"
            @click="onCloseBtnClick"></span>
    </div>
    <div class="customDistrictPanel_bd">
      <div class="custom-flex custom-flex_new">
        <div :class="[
              'resourcespecial-analysistitleImgActive',
              { analysistitleImgActive: item.isActive },
            ]"
             v-for="item in btnArr"
             :key="item.key"
             @click="onBtnClick(item)">
          <div :title="item.title"
               :code="item.code"
               :class="[item.childlass, 'resourcespecial-imgcs']"></div>
        </div>
      </div>
      <div class="resourcespecial-analysistitleradiuscs"
           v-show="!['polygon', 'sector', 'freePolygon'].includes(currentBtn)">
        <div class="resourcespecial-radiusword">查询半径</div>
        <input class="resourcespecial-radiusnums"
              type="text"
              v-model="distanceVal"
              min="0"
              maxlength="7"
              @keyup="clearNoNum"
              @keyup.enter.stop="onDistanceInput" />
        <span class="resourcespecial-unit">KM</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import EventConfigRegistry from '@/util/eventConfigRegistry';
@Component({
  name: 'NearByQuery',
  mixins: [MapCommon],
})
export default class NearByQuery extends Vue {
  // 默认半径取vuex全局配置活默认值10
  private distanceDefaultVal: number = this.$store.state.configModel.config.quickStudy.defaultRadius || 10;
  private distanceVal: any = null;
  private getPlotComponent: any = null;
  private currentBtn: any = null;
  private btnArr: any = [
    {
      title: '点周边',
      code: 'point',
      childlass: 'resourcespecial-imgOne',
      isActive: false,
    },
    {
      title: '线周边',
      code: 'line',
      childlass: 'resourcespecial-imgTwo',
      isActive: false,
    },
    {
      title: '自定义多边形',
      code: 'polygon',
      childlass: 'resourcespecial-imgThree',
      isActive: false,
    },
    {
      title: '自由绘面',
      code: 'freePolygon',
      childlass: 'resourcespecial-imgFour',
      isActive: false,
    },
    {
    title: '扇形',
    code: 'sector',
    childlass: 'resourcespecial-imgFive',
    isActive: false,
    },
  ];

  public clearNoNum() {
    this.distanceVal = this.distanceVal.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
    this.distanceVal = this.distanceVal.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
    this.distanceVal = this.distanceVal
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.');
    this.distanceVal = this.distanceVal.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
    if (this.distanceVal.indexOf('.') < 0 && this.distanceVal !== '') {
      // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      this.distanceVal = String(parseFloat(this.distanceVal));
    }
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

  private created() {
    this.messsageBus.emit('zhypClosedHlyp'); // 通知图层进行关闭河流
    this.messsageBus.emit('CitySelectShow', false); // 关闭行政区划
    this.initVuexFilter();
    (this as any).resolveMap('map').then((map: any) => {
      this.$store.commit(
        'mapTools/changeNearbyQueryRadius',
        this.distanceDefaultVal,
      );
      this.distanceVal =
        parseFloat(this.$store.state.mapTools.nearbyQueryRadius) || 0;
      this.getComponent().on('buffer', this.onBuffer, this);
      this.getComponent().on('error', this.onError, this);
    });
  }

  private mounted() {
    // 拖拽
    const eMapPanelDrag: any = new Drag(
      '#customDistrictPanelDrag8',
      '.customDistrictPanelDrag9',
      {
        container: '.layoutMain',
      },
    );
    eMapPanelDrag.toDrag();
  }

  private beforeDestroy() {
    this.clearOnClose();
    this.getComponent().off('buffer', this.onBuffer, this);
    this.getComponent().off('error', this.onError, this);
    this.$store.commit(
      'mapTools/changeNearbyQueryRadius',
      this.distanceDefaultVal,
    );
    this.messsageBus.emit('commonTools', 'PeripheralQuery', true);
    // 这句话执行的时机应该是，当前的key为hcqyp
    if (this.$store.state.dataFilterControl.zhypGeoType && this.$store.state.dataFilterControl.zhypGeoType.key === 'hcqyp') {
      this.initVuexFilter();
    }
  }

  private onBuffer(data: any) {
    if (data.radius && data.radius !== 0) {
      this.$store.commit(
        'mapTools/changeNearbyQueryRadius',
        parseFloat(Number(data.radius / 1000).toFixed(3)),
        // (data.radius / 1000).toFixed(3),
      );
    }
    this.distanceVal =
      parseFloat(this.$store.state.mapTools.nearbyQueryRadius) || 0;
    // 获取多边形
    const geometry: any = data.geometry;
    //
    this.$emit('change', {
      type: data.type, // 类型
      radius: data.radius,
      geometry,
    });
    // 往DataFilterControl.ts 的geometry中存放数据
    const geoStrObj = {
      filter: {
        districtCode: '', // "370686"
        geometry: JSON.stringify(geometry),
      },
      zhypGeoType: {
        key: 'hcqyp',
      },
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
    // 清空gis数据，事件态切换回常态是，ranges（经验圈）清空
    this.$ioc.resolve('eventInfo').setCurrentStatus(0);
  }

  private onError(err: any) {
    this.$message.error(err.message);
  }

  private onBtnClick(item: any) {
    this.initVuexFilter();
    this.btnArr.forEach((eachItem: any, index: any) => {
      eachItem.isActive = false;
      if (item.code === eachItem.code) {
        eachItem.isActive = true;
        this.currentBtn = item.code;
      }
    });
    // this.distanceVal = this.distanceDefaultVal;
    this.initMapData(this.$store.state.configModel.config.quickStudy.defaultRadius);
  }

  // 初始化地图数据
  private initMapData(radius: number) {
    switch (this.currentBtn) {
      case 'freePolygon':
        this.getComponent().plotPolygonBytype('FreePolygon');
        break;
      case 'sector':
        this.getComponent().plotPolygonBytype('Sector');
        break;
      default :
        const drawOptions: any = {};
        drawOptions.type = this.currentBtn;
        drawOptions.buffer = {};
        this.distanceVal = radius || 10;
        drawOptions.buffer.radius = this.distanceVal * 1000;
        this.getComponent().load(drawOptions);
        break;
    }
  }

  private onCloseBtnClick(close?: any) {
    this.$store.commit(
      'mapTools/changeNearbyQueryRadius',
      this.distanceDefaultVal,
    );
    if (!close) {
      this.$emit('close'); // 这个方法在layoutmain 的混入文件中
    }
    this.messsageBus.emit('PeripheralQuery', { isShow: false });
    // 清除高亮
    this.messsageBus.emit('GisPlotAroundBtn', 'PeripheralQuery' , true);
  }

  private onDistanceInput(val: any) {
    this.$store.commit('mapTools/changeNearbyQueryRadius', val.target.value);
    const radius: any = parseFloat(val.target.value) * 1000;
    this.initMapData(this.$store.state.mapTools.nearbyQueryRadius);
    this.getComponent().setRadius(radius);
    // this.distanceVal = this.distanceVal.replace(/[^\d|^\\.]/g, '');
  }

  private clearOnClose() {
    this.getComponent().unload();
  }

  private getComponent() {
    const modules = this.$ioc.resolve('GISFactory-map');
    const component = modules.commonFactory.getComponent('bufferDraw');
    return component;
  }
}
</script>
<style scoped lang="less">
@url: '../../../../assets/img/bufferquery/';
@urlimage: '../../../../assets/img/halfScreen/eventAndTopics';
@urlicon: '../../../../assets/img/halfScreen/eventAndTopics';
.nearByQuery-position {
  position: absolute;
  top: 100px;
  right: 20px;
  min-width: 260px;
  box-sizing: border-box;
}
.customDistrictPanel {
  // border: 1px solid #338af8;
  // background-color: #1E456B;
  // box-shadow: inset 0 0 30px #338af8;
  .title-panel {
    margin: 28px 0 0 44px;
    cursor: pointer;
  }
  &_hd {
    margin-top: 17px;
    width: 94%;
    height: 59px;
    line-height: 59px;
    border-radius: 4px;
    /* background: #03264A; */
    background-size: 100% 116%;
    color: #13e6fc;
    font-size: 28px;
    font-weight: bold;
    padding-left: 33px;
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    white-space: nowrap;
    transform: scale(0.95);
    background-image: -webkit-linear-gradient(top, #fffd73 10%, #1ae7ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  &_close {
    font-size: 23px;
    background: url('@{urlicon}/eventAndTopics_close.png') no-repeat 0 50%;
    background-size: 100% 100%;
    float: right;
    width: 80px;
    height: 36px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    z-index: 55;
    font-weight: 100;
    position: absolute;
    top: 8px;
    right: 15px;
    &:hover {
      background-image: url('@{urlicon}/eventAndTopics_close_h.png');
      background-size: 100% 100%;
    }
  }
  .custom-flex {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: space-between;
  }
  .custom-flex_new {
    height: 110px;
  }
  .customDistrictPanel_bd {
    width: 100%;
    /* background-color: rgba(0, 0, 0, 0.4); */
    padding: 10px 40px;
    box-sizing: border-box;

    .resourcespecial-analysistitleImgActive {
      cursor: pointer;
      padding: 10px 10px;
      margin-bottom: 10px;
      .resourcespecial-imgOne {
        width: 45px;
        height: 44px;
        background: url('@{url}/huanchongtu1.png') no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
      }
      .resourcespecial-imgTwo {
        margin: 0 auto;
        width: 45px;
        height: 44px;
        background: url('@{url}/huanchongtu2.png') no-repeat;
        background-size: 100% 100%;
      }
      .resourcespecial-imgThree {
        margin: 0 auto;
        width: 45px;
        height: 44px;
        background: url('@{url}/huanchongtu3.png') no-repeat;
        background-size: 100% 100%;
      }
      .resourcespecial-imgFour {
        margin: 0 auto;
        width: 45px;
        height: 44px;
        background: url('@{url}/huanchongtu4.png') no-repeat;
        background-size: 100% 100%;
      }
      .resourcespecial-imgFive {
        margin: 0 auto;
        width: 45px;
        height: 44px;
        background: url('@{url}/huanchongtu5.png') no-repeat;
        background-size: 100% 100%;
      }

    }
    .analysistitleImgActive {
      background: url('@{url}/huanchongactive.png') no-repeat 50% 50%;
      background-size: 100% 100%;
      // width: 56px;
      // height: 56px;
      // padding: 10px 20px;
    }
    .resourcespecial-analysistitleradiuscs {
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 18px;
      .resourcespecial-unit,
      .resourcespecial-radiusword {
        color: #d2e1ec;
        padding: 0 2px;
        font-size: 24px;
      }
      .resourcespecial-radiusnums {
        width: 98px;
        height: 46px;
        margin: 0 10px;
        color: #d2e1ec;
        font-size: 28px;
        /* line-height: 45px; */
        text-align: center;
        /* border-radius: 25px; */
        /* box-sizing: border-box; */
        // background: transparent;
        background: url('@{url}/huanchongactive_1.png') no-repeat;
        outline: none;
        border: none;
        background-size: 100% 100%;
        &:hover {
          outline: none;
          // border-color: #409EFF;
        }
      }
    }
  }
}
</style>
