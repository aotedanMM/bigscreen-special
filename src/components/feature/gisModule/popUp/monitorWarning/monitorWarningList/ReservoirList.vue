<template>
  <!-- 水库列表 -->
  <div class="RiverListBox listDistrict-specil">
    <div
      class="minimize-position"
      v-show="!isUnfold"
      @click="isUnfold = !isUnfold"
    ></div>
    <div class="RiverListBoxMain" :class="$store.state.mapTools.showReservoirList.location?'RiverListBoxMainLeft':''">
      <div class="listDistrict_body popupPanelBottom_bg" v-show="isUnfold">
        <div class="header">
          <div class="title">{{ title }}</div>

          <div class="headerRightBox">
            <span class="minimize" @click="isUnfold = !isUnfold"></span>
            <span class="close" @click="handleClosePop"></span>
          </div>
        </div>
        <div class="listDistrict filter" style="height:42px;">
          <!-- 区市下拉 -->
          <div style="width: 300px; height: 40px; margin-right: 20px">
            <Select
              :selectdata="cityCodeList"
              @select="changeCity"
              :selectedtitle="currentCity"
            ></Select>
          </div>

          <!-- 乡镇下拉 -->
          <!-- <div style="width: 300px; height: 40px; margin-right: 20px">
            <Select
              :selectdata="townCodeList"
              @select="changeTown"
              :selectedtitle="currentTown"
            ></Select>
          </div> -->
          <!-- 是否头顶库 -->
          <!-- <div
            v-if="filter.type[0].name === '告警水库'"
            style="width: 300px; height: 40px; margin-right: 20px"
          >
            <Select
              :selectdata="reservoirTypeList"
              @select="changeReservoirType"
              :selectedtitle="currentReservoirType"
              :isCheckbox="true"
              :checkAll="true"
              :width="270"
            ></Select>
          </div> -->
          <el-input
            class="csmMyInput"
            type="text"
            placeholder="名称"
            v-model.trim="inputValue"
            @input="serach(inputValue)"
          >
            <i slot="suffix" class="iconSelf_search"></i>
          </el-input>
        </div>
        <div class="lodingTwo" v-if="loading">
          <span></span>
        </div>
        <div class="tableContainerTwo" v-else>
          <el-table
            :data="tableList"
            stripe
            @row-click="handleShowDetail"
            size="small"
            highlight-current-row
            :header-row-class-name="headerRowStyleFunc"
            :row-class-name="rowStyleFunc"
            style="width: 100%;"
            class="tabBox"
          >
            <template slot="empty">
              <div class="nothingData--bg nothingData-size"></div>
            </template>
            <el-table-column
              align="center"
              width="100"
              type="index"
              :index="indexMethod"
              label="序号"
            ></el-table-column>

            <el-table-column
              v-for="titem of tableConfig"
              :key="titem.key"
              :width="titem.width"
              :label="titem.title"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span class="f-txt-com fontHeight">
                  {{ scope.row[titem.key] ? scope.row[titem.key] : '' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="!loading">
          <el-pagination
            class="full-list-page"
            :current-page.sync="nowPage"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import Select from '@/components/feature/flood/MonitorWarning/Select.vue';
import { waterSituationServer } from '@/api/feature/monitorwarning/installServer';
import publishObjectPath from '@/util/configRegistry';
import { districtServer } from '@/api/installServer';
import { nomalLeftServer } from '@/api/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
@Component({
  name: 'RiverListBox',
  components: {
    Select,
    // MultipleSelect,
  },
  // mixins: [EventConfigRegistry, GisAreaSelectEvent],
})
export default class RiverListBox extends Vue {
  public loading: boolean = true;
  private tableConfig: any = [
    {
      key: 'name',
      title: '名称',
      // width: 180,
    },
    {
      key: 'address',
      title: '地址',
    },
    // {
    //   key: 'trend',
    //   title: '水势',
    // },
    // {
    //   key: 'waterlimit',
    //   title: '汛限水位',
    // //   width: 200,
    // },
    // {
    //   key: 'catchmentarea',
    //   title: '集水面积(km³)',
    //   // width: 160,
    // },
    {
      key: 'scalename',
      title: '水库类型',
      width: 150,
    },
  ];
  private filter: any = {
    fullname: '',
    nowPage: 1,
    pageSize: 5,
    regionCode: '',
  };
  private nowPage: number = 1; // 当前页
  private pageSize: number = 5; // 每页显示多少条
  private inputValue: any = ''; // 名称搜索
  private timer: any = ''; // 延时搜索
  private title: string = ''; // 标题
  private total: number = 0; // 列表总条数
  private isUnfold: boolean = true; // 是否最小化
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  private tableList = []; // 河流列表数据
  private cityDistrictData: any = {};
  // 区市下拉
  private rootDistrictCode: any = publishObjectPath.value.district.root;
  private cityCodeList: any = [
    {
      shortname: '全部市区',
      fullname: this.rootDistrictCode,
      longitude: '121.37990',
      latitude: '37.53560',
    },
  ];
  private currentCity: any = this.cityCodeList[0].shortname;
  private currentCityCode: any = this.cityCodeList[0].fullname;
  public created() {
    this.updatetype();
    this.city();
  }
  public mounted() {
    this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().load();
    this.getStationsList();
  }
  public indexMethod(index: number) {
    return (this.nowPage - 1) * this.pageSize + (index + 1);
  }
  public async getStationsList(flag: boolean = true) {
    if (flag) {
      // 地图点位更新
      this.updateGIS(this.filter);
    }
    this.filter.nowPage = this.nowPage;
    this.filter.pageSize = this.pageSize;
    const resData: any = await waterSituationServer.getStationsList(JSON.parse(JSON.stringify(this.filter)));
    this.tableList = resData.data;
    // console.log(this.tableList);
    this.total = resData.total;
    this.loading = false;
  }
    /**
   * 关闭弹框
   */
  public handleClosePop() {
    this.messsageBus.emit('delriver');
    const params = {
      isShow: false,
      type: null,
      name: '',
    };
    this.$store.commit('mapTools/changeShowReservoirList', params);
    this.$store.commit('mapTools/changeShowReservoirCountdxList', params);
    this.$store.commit('mapTools/changeShowReservoirCountzxList', params);
    this.$store.commit('mapTools/changeShowReservoirCountxxList', params);
  }
  private headerRowStyleFunc(row: any) {
    return 'headerRowStyle';
  }
  private rowStyleFunc(row: any) {
    // // hasgeo  是否有空间数据 0-无 1-有
    // if (row.row.hasgeo === '0'){
    //   return 'gray';
    // }
    const rowIndex = row.rowIndex;
    if (rowIndex % 2 === 0) {
      return 'dbRow';
    } else {
      return 'defaultRow';
    }
  }
  // 销毁
  private beforeDestroy() {
    // 清空水库类型选中
    if (!this.$store.state.mapTools.showReservoirList.location) {
      this.getComponent().removeResource('water');
      this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
      this.getComponent().unload();
      this.messsageBus.emit('colseReservoirList');
    }
    // this.messsageBus.emit('closeRiverPanel');
    clearTimeout(this.timer); // 清除延时搜索
  }

  /**
   * 监听水库类型
   */
  // @Watch('$store.state.mapTools.showReservoirList.type')
  @Watch('$store.state.mapTools.showReservoirCountdxList.scalename')
  private a111111dddddd() {
    this.updatetype();
  }
  @Watch('$store.state.mapTools.showReservoirCountzxList.scalename')
  private a222222kkkkkk() {
    this.updatetype();
  }
  @Watch('$store.state.mapTools.showReservoirCountxxList.scalename')
  private a333333444444ggg() {
    this.updatetype();
  }
  private updatetype() {
    if (this.$store.state.mapTools.showReservoirCountdxList.scalename === '大型') {
      this.title = '大型水库';
      this.filter.scalename = '大型';
      this.getStationsList();
      this.nowPage = 1;
    }
    if (this.$store.state.mapTools.showReservoirCountzxList.scalename === '中型') {
      this.title = '中型水库';
      this.filter.scalename = '中型';
      this.getStationsList();
      this.nowPage = 1;
    }
    if (this.$store.state.mapTools.showReservoirCountxxList.scalename === '小型') {
      this.title = '小型水库';
      this.filter.scalename = '小型';
      this.getStationsList();
      this.nowPage = 1;
    }
  }
  /**
   * 监听水库列表查询条件
   */
  @Watch('filter', { deep: true })
  private updateTableList() {
    this.getStationsList();
  }

  // 获取行政区划
  private city() {
    // 获取城市信息
    nomalLeftServer.getCitySelected().then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      const allObj: any = {
        gbCode: this.rootDistrictCode,
        name: '全部市区',
        longitude: '121.37990',
        latitude: '37.53560',
      };
      res.data.unshift(allObj);
      this.cityCodeList = res.data;
    });
  }
  /**
   * 切换区市
   */
  private changeCity(item: any, index: any) {
    // this.activeIndex = index;
    this.currentCity = item.name;
    this.currentCityCode = item.gbCode;
    this.filter.fullname =
      item.gbCode === this.rootDistrictCode ? '' : item.gbCode;
    // this.getStationsList();
  }

  /**
   * 名称搜索
   */
  private serach(value: any) {
    if (this.filter.fullname === value) {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.nowPage = 1;
      this.filter.fullname = value;
    }, 800);
  }
  /**
   * 水库列表点击
   */
  private handleShowDetail(e: any) {
    // console.log('列表点击事件参数e', e);
    this.getComponent().locate('reservoir', 'id', e.id);
    this.getComponent().locate('reservoirCountdx', 'id', e.id);
      // console.log('大型水库的id', this.id);
    this.getComponent().locate('reservoirCountzx', 'id', e.id);
    this.getComponent().locate('reservoirCountxx', 'id', e.id);
    this.isUnfold = false;
  }
  // 分页点击
  private handleCurrentChange(val: number) {
    this.nowPage = val;
    this.getStationsList(false);
  }
  // 获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
  }
  // 地图定点回调
  private popupData(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'waterMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    // if (!event.data.waterLevel || event.data.waterLevel === '满库') {
    //   event.type = 'reservoirBrief';
    // }
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
    // }
  }

  // 展示地图定点
  private updateGIS(opts: any = {}) {
    //  console.log('qqqqqqqqqqq', JSON.parse(JSON.stringify(opts)));
    //  移除图层
     this.getComponent().removeResource('water');
    //  加载图层
    //  this.getComponent().addResource_ReservoirCountdx(JSON.parse(JSON.stringify(opts)));
     switch (JSON.parse(JSON.stringify(opts)).scalename) {
       case '大型':
         this.getComponent().addResource_ReservoirCountdx(JSON.parse(JSON.stringify(opts)));
         break;
       case '中型':
         this.getComponent().addResource_ReservoirCountzx(JSON.parse(JSON.stringify(opts)));
         break;
       case '小型':
         this.getComponent().addResource_ReservoirCountxx(JSON.parse(JSON.stringify(opts)));
         break;
     }
  }
}
</script>

<style lang="less">
.fontHeight {
  line-height: 1;
}
.el-tooltip__popper {
  // width: 300px;
  font-size: 24px !important;
  // padding:10px 15px!important;
  line-height: 1.25 !important;
}
.el-select__tags {
  white-space: nowrap;
  overflow: hidden;
  flex-wrap: inherit !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  background: none !important;
}
.listDistrict .full-list-page.el-pagination .el-input__inner {
  font-size: 22px;
}
.el-pagination__editor.el-input {
  font-size: 22px;
}
.el-tooltip__popper {
  max-width: 1000px;
  padding-left: 20px !important;
  padding-right: 10px !important;
}
</style>
<style lang="less">
// background-image: url(../../../../../assets/img/gisModule/tankpng.png);
@import url('../../../../../../assets/css/variable.less');
@commonPath: '../../../../../../assets/img/gisModule/common'; // 定义路径
@path: '../../../../../../assets/img/gisModule/districtDialog/'; // 定义路径
@tableTdHover: '../../../../../../assets/img/default/table/tableTdHover_bg.png';
.nothingData-size {
  width: 165px !important;
  height: 165px !important;
  margin-left: 30%;
}
/deep/.el-tooltip__popper {
  font-size: 26px;
  padding: 10px;
}
.listDistrict-specil {
  .closed-container {
    position: absolute;
    right: -30px;
    cursor: pointer;
    font-size: 22px;
    white-space: nowrap;
    vertical-align: top;
    // background: url('@{commonPath}/tablelistbgblue_close_bg.png') no-repeat 0 0;
    height: 45px;
    width: 119px;
    padding-left: 26px;
    margin-top: -3px;
    box-sizing: border-box;
    padding-top: 5px;
  }
}
.RiverListBox {
  &_body {
    height: 350px;
    width: 1000px;
    padding: 15px 22px;
  }
  // &_toMinify {
  //   position:absolute;
  //   bottom:-29px;;
  //   left:50%;
  //   width:110px;;
  //   height:36px;
  //   background: url('@{commonPath}/toMinifyBtn.png') no-repeat 50% 0;
  //   background-size:100% 100%;
  //   cursor: pointer;
  // }
  &_close {
    display: inline-block;
    width: 53px;
    height: 30px;
    cursor: pointer;
    vertical-align: top;
    text-align: center;
    &::after {
      content: '\2716';
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  &_minifyBtn {
    display: inline-block;
    width: 53px;
    height: 30px;
    cursor: pointer;
    text-align: center;
    vertical-align: top;
    font-weight: bold;
    &:after {
      content: '\2013';
      display: inline-block;
      width: 100%;
      line-height: 36px;
    }
  }

  .full-list-page.el-pagination {
    margin-top: 38px;
    button,
    button:disabled {
      background-color: transparent;
      color: #fff;
    }
    span {
      color: #fff;
      font-size: 22px;
    }
    /*.el-pager {
            li.active {
                color: #00e4ff;
            }
        }*/
    .el-pager li {
      background: rgba(255, 255, 255, 0);
      color: #fff;
      font-size: 22px;
    }
    .el-pager li.active {
      color: #409eff;
      cursor: default;
      font-size: 22px;
    }
    .el-input__inner {
      background-color: rgba(20, 212, 250, 0);
      color: #fff;
      border: none;
      border-bottom: 1px solid #fff;
    }
  }

  .function-container {
    width: 100%;
    display: flex;
    align-items: center;
    .title-container {
      color: #fda100;
      padding: 0 30px;
      font-size: 30px;
    }
    .select-container {
      margin-left: 5%;
      height: 38px;
      padding: 0;
      border: 1px solid #0ceff5;
      .el-select {
        margin: 0;
        float: left;
        .el-input {
          border-radius: 4px;
        }
        .el-input__inner {
          background: none;
          border-radius: 4px;
          border: none;
          font-size: 20px;
          color: #fff;
        }
      }
      .el-button {
        float: left;
        height: 38px;
        padding: 0 20px;
        background: none;
        border: none;
        font-size: 20px;
        color: #fff;
      }
    }

    .input-container {
      width: 25%;
      display: flex;
      align-items: center;

      .search-out-line {
        border: 1px solid #0ceff5;
        border-radius: 4px;
        .el-input__inner {
          background: none;
          border-radius: 4px;
          border: 1px solid transparent;
          font-size: 20px;
          color: #fff;
        }
      }
      .el-input-group__append {
        background: none;
        border-radius: 4px;
        border: 1px solid transparent;
        color: #fff;
        font-size: 20px;
      }
    }

    .sort-container {
      margin-left: 20px;
      span {
        font-size: 18px;
      }
      .el-button {
        padding: 0;
        width: 80px;
        height: 40px;
        background-color: #fff;
        color: #000;
        border-color: transparent;
      }
      .el-button:focus,
      .el-button:hover {
        background: #0172a1;
        color: #fff;
      }
      .el-button.is-disabled,
      .el-button.is-disabled:focus,
      .el-button.is-disabled:hover {
        background: #0172a1;
        color: #fff;
      }
    }
  }
  .lodingTwo {
    height: 277px;
    width: 100%;
    position: absolute;
    background: url('../../../../../../assets/img/default/panel/half_bg1.png')
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    z-index: 20;
    margin-top: -30px;
    span {
      display: inline-block;
      width: 300px;
      height: 220px;
      background: url('../../../../../../assets/img/halfScreen/halflist/loading.gif')
        no-repeat;
      background-size: 100% 100%;
      margin-top: 29px;
    }
  }
  .tableContainerTwo {
    height: 235px;
    min-height: 235px;

    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: transparent;
    }
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: 0;
      cursor: pointer;
    }

    /deep/ .tabBox {
      background: transparent;
      font-weight: 900;
      text-align: center;
      font-size: 26px;
      color: #fff;
    }
    /deep/ .dbRow {
      background: rgba(1, 35, 62, 0.6) !important;
      border: none;
      td {
        color: #fff;
      }
    }
    /deep/ .defaultRow {
      background: transparent;
      border: none;
      td {
        background: transparent;
        color: #fff;
      }
    }
    /deep/ .gray {
      background: transparent;
      border: none;
      td {
        background: transparent;
        color: gray;
      }
    }
    /deep/ .headerRowStyle {
      background: transparent;
      height: 50px;
      th {
        background: transparent;
        color: #00e4ff;
        font-size: 28px;
        line-height: 1;
        padding: 5px 0;
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr {
      background: none;
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover,
    .el-table__body tr.current-row {
      background: url(@tableTdHover);
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:active {
      background: url(@tableTdHover);
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    .el-table::before {
      height: 0;
    }
    .el-table .cell {
      line-height: 29px;
    }
  }
}
</style>
<style lang="less" scoped>
@import url('../../../../../../assets/css/variable.less');
@imgPath: '../../../../../../assets/img/halfScreen/halflist';
@popPath: '../../../../../../assets/img/gisModule/gisLayerPanel/layerPopup';
@tableTdHover: '../../../../../../assets/img/default/table/tableTdHover_bg.png';
@commonPath: '../../../../../../assets/img/gisModule/common'; // 定义路径
@path: '../../../../../../assets/img/gisModule/districtDialog/'; // 定义路径
@url: '../../../../../../assets/img/darkgreen';
.RiverListBox {
  .minimize-position {
    bottom: 0;
    z-index: 300!important;
  }
  .tableContainerTwo {
    margin-top: -42px;
  }
}
.listDistrict_body {
  pointer-events: all;
}
.RiverListBoxMainLeft{
    left: 25%!important;
}
.RiverListBoxMain {
  position: absolute;
  left: 15%;
  bottom: 36px;
  width: 1000px;
  pointer-events: none;
  height: 380px;
  z-index: 300;
  box-sizing: border-box;
  .header {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 42px;
    box-sizing: border-box;
    //  padding: 29px 20px 0 55px;
    .title {
      font-size: 30px;
      color: #fda100;
      margin-left: 50px;
      margin-top: 6px;
    }
    .headerRightBox {
      position: absolute;
      top: -1px;
      right: -8px;
      width: 120px;
      height: 45px;
      background: url('@{popPath}/listCloseBtn.png') no-repeat 0 0;
      background-size: 100% 100%;
      color: #00e4ff;
      cursor: pointer;
      z-index: 1;
      span {
        display: inline-block;
        width: 45px;
        height: 45px;
        line-height: 35px;
        cursor: pointer;
        text-align: center;
        vertical-align: middle;
        font-weight: bold;
        font-size: 20px;
      }
      .minimize {
        margin-left: 25px;
        &::after {
          content: '\2014';
          width: 100%;
        }
      }
      .close::after {
        content: '\2716';
        width: 100%;
      }
    }
  }
  .filter {
    position: relative;
    top: -38px;
    left: 200px;
    display: flex;
    align-items: center;
    width: 700px;
    > div {
      flex: 1;
      /deep/.select_container {
        .down_title {
          background-color: transparent;
          border: 1px solid rgba(43, 246, 254, 0.5);
          &:hover {
            width: calc(100% + 2px);
            height: 36px;
            border: none;
            > span {
              line-height: 36px;
              padding-left: 1px;
            }
            > .arrow-down {
              top: 3px;
              right: 2px;
            }
          }
        }
      }
    }
    /deep/.csmMyInput {
      height: 41px;
      .el-input__inner {
        background: transparent !important;
      }
    }
    input::-webkit-input-placeholder {
      color: #c4d7da;
    }
    input:-ms-input-placeholder {
      color: #c4d7da;
    }
  }
  .body {
    width: 100%;
    box-sizing: border-box;
    margin-top: -27px;
    // .filter {
    //   height: auto;
    //   .listDistrict-flex-box {
    //     display: flex;
    //     width: 100%;
    //     .listDistrict-input {
    //       margin-right: 20px;
    //     }
    //     .listDistrict-select {
    //       display: flex;
    //       position: relative;
    //     }
    //     .selectList {
    //       position: absolute;
    //       top: 55px;
    //       z-index: 20;
    //       width: 60%;
    //       height: 400px;
    //       box-shadow: 4px 6px 16px 0px #001931;
    //       background: #071022 url('@{popPath}/select_bg.png') no-repeat;
    //       background-size: 100% 100%;
    //       padding: 15px 0 15px 20px;
    //       box-sizing: border-box;
    //       &.city {
    //         left: -30px;
    //       }
    //       &.town {
    //         left: 225px;
    //       }
    //     }
    //     .listDistrict-input-content {
    //       clear: both;
    //       margin-bottom: 15px;
    //       margin-right: 20px;
    //       width: 100%;
    //       display: flex;
    //       justify-content: center;
    //       align-items: center;
    //       cursor: pointer;
    //       &:nth-child(2) {
    //         margin-right: 0;
    //       }
    //     }

    //     .selcetIconTop {
    //       display: inline-block;
    //       width: 35px;
    //       height: 30px;
    //       background: url('@{imgPath}/select2bg.png') no-repeat;
    //       background-size: 100% 100%;
    //       margin: 5px 5px 0 0;
    //       cursor: pointer;
    //     }
    //     .selcetIconBot {
    //       display: inline-block;
    //       width: 35px;
    //       height: 30px;
    //       background: url('@{imgPath}/selcet1bg.png') no-repeat;
    //       background-size: 100% 100%;
    //       margin: 5px 5px 0 0;
    //       cursor: pointer;
    //       transform: rotate(180deg);
    //     }
    //     input::-webkit-input-placeholder {
    //       color: #c4d7da;
    //     }
    //     input:-moz-placeholder {
    //       color: #c4d7da;
    //     }
    //     input:-ms-input-placeholder {
    //       color: #c4d7da;
    //     }
    //   }
    // }
    .content {
      height: 252px;
      .tableHeader {
        height: 50px;
        li {
          display: flex;
          align-items: center;
          height: 100%;
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #00e4ff;
            font-size: 28px;
            font-weight: 600;
            padding: 0 10px;
            &:nth-child(1) {
              width: 100px;
            }
            &:nth-child(2) {
              width: 450px;
              justify-content: left;
            }
            &:nth-child(3) {
              width: 450px;
              justify-content: left;
            }
          }
        }
      }
      .bodyScroll {
        height: 225px;
      }
      .tableBody {
        li {
          display: flex;
          align-items: center;
          // height: 45px;
          line-height: 45px;
          cursor: pointer;
          &:nth-of-type(odd) {
            background: rgba(1, 35, 62, 0.6);
          }
          &.active,
          &:hover {
            background: url(@tableTdHover);
            background-size: 100% 100%;
          }
          span {
            display: flex;
            align-items: center;
            height: 100%;
            color: #fff;
            font-size: 26px;
            font-weight: 900;
            padding: 0 10px;
            &:nth-child(1) {
              width: 100px;
              justify-content: center;
            }
            &:nth-child(2) {
              width: 450px;
              height: 45px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
              white-space: nowrap;
            }
            &:nth-child(3) {
              width: 450px;
              // width: calc(100% - 300px);
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 32px;
    .full-list-page.el-pagination {
      margin-top: 17px;
      margin-left: 22px;
      button,
      button:disabled {
        background-color: transparent;
        color: #fff;
      }
      span {
        color: #fff;
        font-size: 22px;
      }
      .el-pager li {
        background: rgba(255, 255, 255, 0);
        color: #fff;
        font-size: 22px;
      }
      .el-pager li.active {
        color: #409eff;
        cursor: default;
        font-size: 22px;
      }
      .el-input__inner {
        background-color: rgba(20, 212, 250, 0);
        color: #fff;
        border: none;
        border-bottom: 1px solid #fff;
      }
    }
  }
}
</style>

function opts(arg0: string, opts: any) {
  throw new Error('Function not implemented.');
}
