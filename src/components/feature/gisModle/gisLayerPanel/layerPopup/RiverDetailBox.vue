<template>
  <!-- 河流详情 -->
  <div class="RiverDetailBox" id="RiverDetailBoxPop">
    <div class="header">
      <span>河流详情</span>
      <div class="headerRightBox">
        <span class="close" @click="handleClosePop"></span>
      </div>
    </div>
    <div class="body">
      <div>
        <div class="title">{{ detailData.name }}</div>
        <div class="bodyScroll">
          <div class="row">
            <span class="label">河流级别：</span>
            <span class="text">{{ detailData.levelCode }}</span>
          </div>
          <div class="row">
            <span class="label">跨界属性：</span>
            <span class="text">{{ detailData.prop }}</span>
          </div>
          <div class="row">
            <span class="label">所属河流：</span>
            <span class="text">{{ detailData.belongRiver }}</span>
          </div>
          <div class="row">
            <span class="label">河流长度：</span>
            <span class="text">{{
              detailData.length ? detailData.length + '公里' : ''
            }}</span>
          </div>
          <div class="row">
            <span class="label">流域面积：</span>
            <span class="text" v-if="detailData.isLargeArea === '是'"
              >大于50km²</span
            >
            <span class="text" v-else-if="detailData.isLargeArea === '否'"
              >大于50km²</span
            >
            <span class="text" v-else-if="!detailData.isLargeArea"></span>
          </div>
          <div class="row">
            <span class="label">水库名称：</span>
            <span class="text" :title="detailData.reservoirName">{{
              detailData.reservoirName
            }}</span>
          </div>
          <div class="row">
            <span class="label">起点（河源）位置：</span>
            <span class="text" :title="detailData.startLocation">{{
              detailData.startLocation
            }}</span>
          </div>
          <div class="row">
            <span class="label">讫点（河口）位置：</span>
            <span class="text" :title="detailData.endLocation">{{
              detailData.endLocation
            }}</span>
          </div>
          <div class="row">
            <span class="label">流经区市：</span>
            <span class="text" :title="detailData.throughCity">{{
              detailData.throughCity
            }}</span>
          </div>
          <div class="row">
            <span class="label">流经乡镇：</span>
            <span class="text" :title="detailData.throughTown">{{
              detailData.throughTown
            }}</span>
          </div>
          <div class="row">
            <span class="label">流经村庄：</span>
            <span class="text" :title="detailData.throughVillage">{{
              detailData.throughVillage
            }}</span>
          </div>
        </div>
        <div class="inputBox" v-show="showAnalyzeStudy">
          <div class="rangeBox">
            <p>河流两岸范围</p>
            <input type="text" v-model="radius" @keyup="clearNoNum" />
            <p>公里</p>
          </div>
          <span class="btn" @click="handleAnalyzeStudy">分析研判</span>
        </div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';
import { riverWaterSystemServe } from '@/api/installServer';
@Component({
  name: 'RiverDetailBox',
  components: {},
  mixins: [GisAreaSelectEvent],
})
// @Watch('$store.state.mapModule.SetRiveRadius')
export default class RiverDetailBox extends Vue {
  private detailParams: any = {};
  private showAnalyzeStudy: boolean = true;
  private radius: any = 1; // 河流两岸范围 （注意类型使用，number 类型不要在定义成 any 类型）
  private detailData: any = {};
  private geometryLine: any = {};
  private sourceData: any = {};

  public mounted() {
    this.popDrag();
    // 监听是否触发详情里的方法
    this.messsageBus.on('updateRiverDetail', (data: any) => {
      this.detailParams = data;
      if (data.params.id) {
        this.getRiverDetail();
      }
    });
  }

  // 获取河流详情
  public async getRiverDetail() {
    this.showAnalyzeStudy = false;
    const resData: any = await riverWaterSystemServe.getRiverDetail(
      this.detailParams.params.id,
    );
    resData.data.throughCity = JSON.parse(resData.data.throughCity).join('、');
    resData.data.throughTown = JSON.parse(resData.data.throughTown).join('、');
    resData.data.throughVillage = JSON.parse(resData.data.throughVillage).join(
      '、',
    );
    this.detailData = resData.data;
    if (this.detailParams.params.geom) {
      // 从地图点击河流进来
      this.geometryLine = this.detailParams.params.geom;
    } else {
      // 从列表点击河流进来
      this.geometryLine = JSON.parse(this.detailData.geometry);
    }
    this.radius = this.$store.state.mapModule.SetRiveRadius;
    if (this.geometryLine) {
      this.showAnalyzeStudy = true;
      if (this.detailParams.isEntranceList) {
        this.handleAnalyzeStudy();
      } else {
        // 状态值记录
        this.drawAndLocate1(
          this.geometryLine,
          this.detailParams.params,
          'RiverLayer',
          false,
          Number(this.radius) * 1000,
        );
      }
    } else {
      this.showAnalyzeStudy = false;
      this.$message.error('该河流无几何信息');
    }
  }
  // 分析研判
  public handleAnalyzeStudy() {
    // 分析研判时 存储当前的研判数值，防止地图点击时恢复到默认值状态（注意类型使用，number 类型不要在定义成 any 类型）
    this.$store.commit('mapModule/MapSetRiveRadius', this.radius);
    this.radius = this.$store.state.mapModule.SetRiveRadius;
    // this.$store.commit('mapModule/MapSetRiveRadius',this.radius)
    // 根据地图河流两岸范围更改河流范围
    this.drawAndLocate1(
      this.geometryLine,
      this.detailParams.params,
      'RiverLayer',
      false,
      Number(this.radius) * 1000,
    );
    this.sourceData = this.getComponent_AreaSelectJudgement().getMapData();

    // 触发综合研判-河流研判
    // 往DataFilterControl.ts 的geometry中存放数据
    const geoStrObj = {
      filter: {
        districtCode: '', // "370686"
        geometry: JSON.stringify(this.sourceData.geometry),
      },
      zhypGeoType: {
        key: 'hlyp',
      },
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
    // 关闭详情弹框
    const params = {
      isShow: false,
      isEntranceList: false, // 是否列表入口
      params: {
        id: this.detailParams.id,
        name: this.detailParams.name,
        geom: this.geometryLine, // 线
        // geometry: this.sourceData.geometry // 面
      },
    };
    this.messsageBus.emit('updateRiverDetail', params);
  }
  // 关闭弹框
  public handleClosePop() {
    const params = {
      isShow: false,
      params: {},
    };
    this.messsageBus.emit('updateRiverDetail', params);
  }
  // 验证文本输入
  public clearNoNum() {
    this.radius = this.radius.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
    this.radius = this.radius.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
    this.radius = this.radius
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.');
    this.radius = this.radius.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
    if (this.radius.indexOf('.') < 0 && this.radius !== '') {
      // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      this.radius = String(parseFloat(this.radius));
    }
  }
  // 弹框拖拽
  public popDrag() {
    const eMapPanelDrag: any = new Drag('#RiverDetailBoxPop', '.header', {
      container: '.layoutMain',
    });
    eMapPanelDrag.toDrag();
  }
}
</script>

<style lang="less" scoped>
@popPath: '../../../../../assets/img/gisModule/gisLayerPanel/layerPopup';
.RiverDetailBox {
  position: absolute;
  right: 400px;
  top: 100px;
  width: 690px;
  z-index: 200;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url('@{popPath}/popHeader_bg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 70px;
    box-sizing: border-box;
    padding: 15px 20px 0 40px;
    cursor: all-scroll;
    span {
      background-image: -webkit-linear-gradient(top, #fffd73 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 30px;
      font-weight: bold;
    }
    .headerRightBox {
      position: relative;
      top: -8px;
      right: -15px;
      cursor: pointer;
      z-index: 1;
      .close {
        display: inline-block;
        width: 80px;
        height: 35px;
        background: url('@{popPath}/iconClose.png') no-repeat;
        background-size: 100% 100%;
        &:hover {
          background: url('@{popPath}/iconClose_hover.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  .body {
    width: 100%;
    height: 670px;
    background: url('@{popPath}/popBody_bg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 15px 35px 5px 40px;
    .title {
      height: 55px;
      color: #92edf6;
      font-size: 28px;
      font-weight: 600;
    }
    .bodyScroll {
      .row {
        display: flex;
        align-items: center;
        height: 50px;
        font-size: 26px;
        padding: 0 15px;

        &:nth-of-type(odd) {
          background-color: rgba(100, 219, 251, 0.1);
        }

        .label {
          display: inline-block;
          color: #92edf6;
          font-weight: 600;
        }
        .text {
          display: inline-block;
          flex: 1;
          color: #e8f4fe;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .inputBox {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 70px;
      padding: 15px 15px 0 15px;
      .rangeBox {
        display: flex;
        align-items: center;
        color: #d2e1ec;
        font-size: 24px;
        font-weight: 600;
        input {
          width: 100px;
          height: 50px;
          background: url('@{popPath}/input_bg.png') no-repeat;
          background-size: 100% 100%;
          color: #ffffff;
          text-align: center;
          font-size: 24px;
          border: none;
          outline: none;
          line-height: 35px;
          box-sizing: border-box;
          padding: 0 20px;
          margin: 0 10px;
        }
      }

      .btn {
        display: inline-block;
        width: 146px;
        height: 60px;
        line-height: 60px;
        font-size: 26px;
        color: #a0f4fd;
        text-align: center;
        background: url('@{popPath}/btn_bg.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        &:hover {
          color: #fffabe;
          background: url('@{popPath}/btn_hover_bg.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 81px;
    background: url('@{popPath}/popFooter_bg.png') no-repeat;
    background-size: 100% 100%;
    .constomMyElPage.el-pagination {
      margin-top: 0;
    }
  }
}
</style>
