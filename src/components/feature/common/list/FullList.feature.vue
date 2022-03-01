<template>
  <div class="listDistrict listDistrict-specil">
    <div class="minimize-position" @click.stop="toMinify" v-if="isShow"></div>
    <div class="listDistrict_body popupPanelBottom_bg" v-else>
      <div class="closed-container">
        <span @click.stop="toMinify" class="panel_btnMinify has"></span>
        <span @click.stop="closeCurPanel" class="panel_btnClose"></span>
      </div>

      <div class="function-container">
        <template v-if="listTitle">
          <div class="title-container">{{ listTitle }}</div>
        </template>
        <!-- 区市下拉 -->
        <div style="width: 180px; height: 38px; margin-right: 30px;margin-left: 20px;">
          <Select
            :selectdata="cityCodeList"
            @select="changeCity"
            :selectedtitle="currentCity"
          ></Select>
        </div>
        <template v-if="inputConfig.length">
          <div class="input-container">
            <el-input
              type="text"
              v-model.trim="inputData"
              class="search-out-line"
              clearable
              :placeholder="placeholder"
              @change="inputhange"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click.stop="getDataByKeywords"
              ></el-button>
            </el-input>
          </div>
        </template>
        <!-- <div class="select-container" v-if="isselectvideo">
          <el-select v-model="btnflags" placeholder="请选择" >
            <el-option
              v-for="item in btnlist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div> -->
        <div class="select-container" v-if="isselectContainer">
          <el-select v-model="selectTypeClass" placeholder="请选择" multiple>
            <el-option
              v-for="item in selectContainerClass[parentData.codeKey].list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            @click.stop="
              () => {
                queryFn(selectTypeClass);
              }
            "
          ></el-button>
        </div>
      </div>
      <div class="loding" v-if="loading">
        <span></span>
      </div>
      <div class="tableContainer" v-else>
        <!--<div>
            <span>序号</span>
            <span v-for="(titem) of tableConfig" :key="titem.key">{{titem.title}}</span>
        </div>
        <ul>
            <li v-for="(rowData,rowIndex) of curTableData" :key="rowIndex" @click.stop="handleRowClick(rowData,rowIndex)">
                <span>{{(currentPage - 1) * curPageSize + (rowIndex + 1)}}</span>
                <span v-for="(titem) of tableConfig" :key="titem.key">
                    {{rowData[titem.key]}}
                </span>
            </li>
        </ul>-->

        <el-table
          :data="curTableData"
          stripe
          @row-click="handleRowClick"
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
                {{
                  (scope.row[titem.key] && scope.row[titem.key] !== null) ||
                  scope.row[titem.key] === 0
                    ? scope.row[titem.key]
                    : "- -"
                }}
              </span>
              <img
                v-if="titem.key === 'TEL' && scope.row[titem.key]"
                src="../../../../assets/img/eventInfo/telphoon.png"
                class="callPhoneCur"
                @click.stop="
                  handleClickCallup(
                    scope.row,
                    scope.row['TEL'],
                    $event,
                    scope.row['name']
                  )
                "
              />
              <!-- <el-tooltip  placement="bottom">
              <div slot="content" class="f-txt-com">{{ scope.row[titem.key] }}</div>
              </el-tooltip>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="hasPage && !loading">
        <el-pagination
          class="full-list-page"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="curPageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalNum"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import Select from '@/components/feature/flood/MonitorWarning/Select.vue'; // 区市下拉
import publishObjectPath from '@/util/configRegistry';
import { nomalLeftServer, multiuleInterfaceServer } from '@/api/installServer';
import {
  baseDataServer,
  detailInfoServer,
  emerSourceServer,
  riskSourceServer,
} from '@/api/installServer';
@Component({
  name: 'FullListFeatrue',
  mixins: [MapCommon],
  components: {
    Select,
  },
})
export default class ListDistrict extends Vue {
  @Prop({
    default: () => {
      return [];
    },
  })
  public inputConfig?: any[];
  @Prop({
    default: '',
  })
  public listTitle?: string; // 定义title
  @Prop({
    default: false,
  })
  public fullListFeatrueIsShow!: boolean;
  @Prop({
    default: () => {
      return [];
    },
  })
  public tableConfig?: any[];

  @Prop({
    default: true,
  })
  public hasPage?: boolean;
  // @Prop() public getDetailDataFn: any;
  @Prop() public parentData: any;
  @Prop() public placeholder: any;
  @Prop() public btnlist: any;
  public isShow: boolean = false;
  public loading: boolean = true;
  public curPageSize: number = 5;
  public curTableData: any[] = [];
  public copyCurTableData: any[] = [];
  public btnflags: any = '';
  // @Watch('handleCurrentChange')
  public inputData: any = ''; // 定义 input框取过来的值
  public currentPage: number = 1;
  public totalNum: number = 0;
  // 是否显示下拉框
  @Prop({ default: false })
  private isselectContainer?: boolean;
  @Prop({ default: false })
  private isselectvideo?: boolean;
  // 获取分类的类型数据
  @Prop()
  private selectContainerClass?: any;
  private selectTypeClass: any[] = [];

  // 区市下拉
  private rootDistrictCode: any = publishObjectPath.value.district.root;
  private cityCodeList: any = [
    {
      shortname: '全部市区',
      districtcode: this.rootDistrictCode,
      longitude: '121.37990',
      latitude: '37.53560',
    },
  ];
  private currentCity: any = this.cityCodeList[0].shortname;
  private currentCityCode: any = this.cityCodeList[0].districtcode;
  @Watch('parentData')
  public handlerParentDataChange(val: any) {
    this.currentPage = 1;
    this.inputData = '';
    // 切换列表类型后行政区划还原到全部市区
    this.currentCity = this.cityCodeList[0].shortname;
    this.currentCityCode = this.cityCodeList[0].districtcode;
    this.getCurTableData();
  }

  // 根据列表是否打开判断 是否清空select查询条件
  @Watch('fullListFeatrueIsShow')
  public initSelectTypeClass(val: boolean): void {
    if (!val) {
      this.selectTypeClass = [];
    }
  }

  // 通过监听 tableConfig 来实现 点击常态左侧应急资源数字默认打开数据列表的操作
  @Watch('tableConfig')
  public checkoutList() {
    this.isShow = false;
    this.getCurTableData();
  }
  @Watch('this.$store.state.configModel.ischeck')
  public btnflagsList(val: any) {
    this.getCurTableData();
  }
  /* 监听经验圈有无 王智 2021/1/17 */
  @Watch('$store.state.dataFilterControl.filter.geometry', {deep: true, immediate: true})
  public circleList(val: any) {
    this.getCurTableData();
  }
  // 数据查询方法
  public getCurTableData(filter?: any[]) {
    // 每次请求前清空一次数据，避免出现在请求过程中列表title改变数据局还没发生改变
    const self = this;
    this.loading = true;
    this.messsageBus.on('selectnumpafeone', (data: any) => {
      if (data.codeKey !== this.parentData.codeKey) {
        this.currentPage = 1;
      }
    });
    let typeCodeKey: any = '';
    if (this.parentData.codeKey.indexOf('v_equipmenterwrer') !== -1) {
      typeCodeKey =
        this.parentData.codeKey.slice(0, 11) +
        '_list' +
        this.parentData.codeKey.slice(11, 14);
      console.log(typeCodeKey, 888888888);
    } else {
      typeCodeKey = this.parentData.codeKey;
    }
    const opts: any = {
      pageSize: this.curPageSize,
      pageIndex: this.currentPage,
      resourceKey: typeCodeKey,
      keyword: this.inputData,
      districtCode:
        this.currentCityCode === this.rootDistrictCode
          ? ''
          : this.currentCityCode,
      btnflags: this.$store.state.configModel.ischeck,
    };

    this.getComponent()._clearLayerByID(this.parentData.codeKey);

    // this.getComponent().showResourceTip(this.parentData.codeKey, opts.districtCode, opts.keyword);
    if (this.isselectContainer) {
      const namecode: string = this.selectContainerClass[typeCodeKey]
        .filterName;
      if (filter) {
        if (filter.length === 0) {
          filter = undefined;
        }
      }
      opts.filter = {
        [namecode]: filter,
      };
    }
    // 请求分页数据
    /* 对经验圈数据处理 王智 2021/1/17 */
    const sourceOpt = JSON.parse(JSON.stringify(this.$store.state.dataFilterControl.filter));
    if (sourceOpt.geometry) {
      opts.geometry = sourceOpt.geometry;
      opts.polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(
        JSON.parse(this.$store.state.dataFilterControl.filter.geometry),
      ).asWkt();
      opts.type = '2';
    }
    multiuleInterfaceServer.getDataList(opts).then((res: any) => {
        // console.log(opts);
          // this.getComponent_new()._clearLayerByID(this.parentData.codeKey)
          // this.getComponent_new()._showPoint(res.list,this.parentData.codeKey,'',);
        // this.parentData.codeKey.split("_")[0]
        this.curTableData = res.list;
        this.curTableData.map((item: any) => {
          // 如果电话有两个就只取手机号
          if (item.tel && item.tel.split('、').length > 1) {
            const phoneStr = item.tel;
            phoneStr.split('、').forEach((element: any, index: number) => {
              if (element.length > 7) {
                item.tel = element;
              }
            });
          }
          if (!item.address) {
            item.address = '- -';
          }
        });
        this.totalNum = res.total;
        this.loading = false;
        this.MapRender(opts);
      });

    // }


  }
  // select框点击事件
  public queryFn(val: any) {
    this.currentPage = 1;
    this.getCurTableData(val);
  }
  public indexMethod(index: number) {
    return (this.currentPage - 1) * this.curPageSize + (index + 1);
  }
  public handleCurrentChange(val: number) {
    this.currentPage = val;
    this.getCurTableData(this.selectTypeClass);
  }
  // 查询按钮事件
  public getDataByKeywords() {
    this.currentPage = 1;
    this.getCurTableData();
  }
  // 输入框输入回车事件
  public inputhange(val: any) {
    if (val === '') {
      this.currentPage = 1;
      this.getCurTableData();
    }
  }
  //  周边查询
  public getAroundComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory &&
      factory.commonFactory &&
      factory.commonFactory.getComponent('nearQuery'); //  newsEventLocate,ResourceComponent
    return component;
  }

  public closeCurPanel() {
    this.$emit('handleClickClosedPanel', false);
    // 救援装备在弹框点击关闭的时候需要特殊处理，调用老方法
    this.getComponent_new()._clearLayerByID(this.parentData.codeKey);
    this.getAroundComponent().unload();
  }

  public handleRowClick(row: any, rowIndex: any) {
    // debugger;
    const self = this;
    setTimeout(() => {
      this.getComponent_new().locationCenter(this.parentData.codeKey, row.id);
    }, 500);
    this.isShow = !this.isShow;
    // setCurrentRow
  }

  public created() {
    this.handlerParentDataChange(this.parentData);
    this.messsageBus.on('clearInput', (data: any) => {
      this.inputData = '';
    });
    this.city();
    // this.handlerTotalDataChange(this.totalDataFromParent);
    // this.messsageBus.on('clickItemNumber', (data: any) => {
    //     this.currentTotal = data.total;
    // });
    // this.messsageBus.on('gsmapvisible', (res: any) => {
    //    this.gsmapsvisible = res;
    // });
  }
  public beforeDestroy() {
    // this.getComponent().unload();
  }
  private MapRender(queryParam: any) {
    queryParam.pageSize = '9999';
    queryParam.pageIndex = '1';
    let featureType: any = '';
    let equipCode: any = '';
    if (this.parentData.codeKey.split('_')[0] === 'equipment') {
       featureType = this.parentData.codeKey.split('_')[0] ? this.parentData.codeKey.split('_')[0] : this.parentData.codeKey;
       equipCode = this.parentData.codeKey.split('_')[1] ? this.parentData.codeKey.split('_')[1] : '';
    } else {
        featureType = this.parentData.codeKey;
        equipCode = '';
    }
    multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
        this.getComponent_new()._clearLayerByID(featureType);
        if (res.list.length > 0) {
          this.getComponent_new()._showPoint(res.list, featureType, equipCode);
        } else {
          this.getComponent_new()._clearLayerByID(this.parentData.codeKey);

          // this.getComponent_new().showExtentData(this.parentData.codeKey)
        }
      });
  }
  //  地图组件
  private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent',
    );
    return component;
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
    this.currentPage = 1;
    this.currentCity = item.name;
    this.currentCityCode = item.gbCode;
    this.getCurTableData();
  }
  private getselectType(val: any) {
    this.getCurTableData(val);
  }
  //  地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('ResourceComponent');
    return component;
  }
  // this.srcDAYMS = require(`../../../../../assets/img/weather/${(val as any).icon}.png`);

  private headerRowStyleFunc(row: any) {
    return 'headerRowStyle';
  }
  private handleClickCallup(phoneData: any, val: any, event: any, name: any) {
    // console.log(phoneData,'电话数据')
    this.messsageBus.emit('showCallup', true, phoneData, val, event, name);
  }
  private rowStyleFunc(row: any) {
    const rowIndex = row.rowIndex;
    if (rowIndex % 2 === 0) {
      return 'dbRow';
    } else {
      return 'defaultRow';
    }
  }
  private toMinify() {
    this.isShow = !this.isShow;
  }

  //  地图组件
  // private getComponent_new() {
  //   const factory = this.$ioc.resolve("GISFactory-map");
  //   const component = factory.normalFactory.getComponent(
  //     "NewResourceComponent"
  //   );
  //   return component;
  // }
}
</script>
<style lang="less">
@import url("../../../../assets/css/variable.less");
@commonPath: "../../../../assets/img/gisModule/common"; // 定义路径
@path: "../../../../assets/img/gisModule/districtDialog/"; // 定义路径
@tableTdHover: "../../../../assets/img/default/table/tableTdHover_bg.png";
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
.el-tooltip__popper {
  max-width: 1000px;
  padding-left: 20px !important;
  padding-right: 10px !important;
}
// background-image: url(../../../../../assets/img/gisModule/tankpng.png);

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
.listDistrict {
  height: 100%;
  width: 100%;
  color: #fff;
  z-index: 99999;
  position: relative;

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
      content: "\2716";
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
      content: "\2013";
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
    padding-top: 3px;
    .title-container {
      color: #fda100;
      padding: 0 30px;
      font-size: 30px;
    }
    /deep/.select_container {
      .down_title {
        height: 36px;
        line-height: 36px;
        background-color: transparent;
        // border: 1px solid rgba(43, 246, 254, 0.5);
        border: 1px solid #0ceff5;
        border-radius: 4px;
        &:hover {
          width: calc(100% + 2px);
          height: 38px;
          border: none;
          > span {
            line-height: 38px;
            padding-left: 1px;
          }
          > .arrow-down {
            top: 3px;
            right: 2px;
          }
        }
      }
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
      width: 26%;
      display: flex;
      align-items: center;

      .search-out-line {
        border: 1px solid #0ceff5;
        border-radius: 4px;
        .el-input__inner {
          height: 36px;
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
  .loding {
    height: 277px;
    width: 100%;
    position: absolute;
    background: url("../../../../assets/img/default/panel/half_bg1.png")
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    z-index: 20;
    span {
      display: inline-block;
      width: 300px;
      height: 220px;
      background: url("../../../../assets/img/halfScreen/halflist/loading.gif")
        no-repeat;
      background-size: 100% 100%;
      margin-top: 29px;
    }
  }
  .tableContainer {
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
      background: rgba(1, 35, 62, 0.6);
      border: none;
    }
    /deep/ .defaultRow {
      background: transparent;
      border: none;
      td {
        background: transparent;
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
@tableTdHover: "../../../../assets/img/default/table/tableTdHover_bg.png";
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
</style>
