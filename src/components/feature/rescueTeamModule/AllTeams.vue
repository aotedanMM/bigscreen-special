<!--力量调度的所有队伍的列表-->
<template>
  <div class="listDistrict">
    <div class="listDistrict-flex-box">
      <div class="listDistrict-input">
        <div class="listDistrict-input-content">
          <el-input class="csmMyInput" type="text" placeholder="队伍名称、装备名称" v-model.trim="inputWord">
            <i slot="suffix" class="iconSelf_search"></i>
          </el-input>
        </div>
      </div>
      <div class="listDistrict-select">
        <div>
          <div class="listDistrict-input-content" @click="isSelectBolFn">
            <el-input
              class="csmMyInput"
              type="text"
              :class="{'csmMyInput-cur': isSelectBol }"
              readonly
              placeholder="行政区划"
              v-model.trim="selectWord"
            >
              <i slot="suffix" :class="isSelectBol? 'selcetIconBot':  'selcetIconTop'"></i>
            </el-input>
          </div>
          <div class="listDistrict-input-content" @click="isSelectBolFn2">
            <el-input
              class="csmMyInput"
              type="text"
              :class="{' csmMyInput-cur': isSelectBol2 }"
              readonly
              placeholder="队伍类型"
              v-model.trim="selectWordType"
            >
              <i slot="suffix" :class="isSelectBol2? 'selcetIconBot':  'selcetIconTop'"></i>
            </el-input>
          </div>
        </div>
        <el-scrollbar class="cmp-scrollbar-y selectList selectListDis" v-show="isShowSelect">
          <DropDownBox :selectData="selectData" @canclehandlebox="canclehandle" @data="getWord"></DropDownBox>
        </el-scrollbar>
        <el-scrollbar class="cmp-scrollbar-y selectList selectListType" v-show="isShowSelect2">
          <DropDownBox
            :selectData="selectDataType"
            @canclehandlebox="canclehandle"
            @data="getWordType"
          ></DropDownBox>
        </el-scrollbar>
      </div>
    </div>
    <!-- 列表每一行-->

    <div class="tempRight-title f-tit-h2">
      <span class="itemName">队伍合计</span>
      <span class="tempRight-total">
        <span class="f-number">{{paginationObj.total}}</span>
      </span>
      <span class="tempRight-unit">支</span>
      <i 
        :class="showSub? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'"
        @click.stop="expandSublist()"
      ></i>
    </div>
    <div v-if='!loadingState' class='listDataAll-outbox'>
        <div v-if="showSub" class='listDataAll-innerbox'>
             <div class="nodata" v-if="!listDataAll.length">
               <img src="../../../assets/img/default/panel/noData.png" alt srcset />
             </div>
            <div class="listBoxScrollbar" v-else>
              <ul class="listBoxSingle">
                <li
                  class="f-txt-com listBoxSingle_li"
                  v-for="(item, index) in listDataAll"
                  :key="index"
                  @click="clickHandler(item,index)"
                  :class="[listBgClick === index ? 'classList' : '']"
                >
                  <p class="teamName"> <span>{{index + 1 + paginationObj.pageSize * (paginationObj.pageIndex - 1)}}</span><span>{{item.name}}</span></p>
                  <p class="teamDistance">
                    <span class="spanBox">
                      <span  style="display: flex;">
                        <span style="color:#80adcf">管理单位：</span>
                        <span style="flex: 1;max-width: 365px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                          :title="item.chargedept"
                        >{{item.chargedept?item.chargedept:'- -'}}</span>
                      </span>
                    </span>
                  </p>
                  <p class="teamDistance">
                    <span class="spanBox">
                      <span style="color:#80adcf">现有人数：</span>
                      <span
                        style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                        :title="item.totalpernum"
                      >{{item.totalpernum?item.totalpernum+ '人':'- -'}}</span>
                    </span>
                  </p>

                  <p class="teamDistance">
                    <span class="spanBox">
                      <span style="color:#80adcf">负责人：</span>
                      <span
                        style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                        :title="item.captain"
                      >{{item.captain?item.captain:'- -'}}</span>
                    </span>
                  </p>
                  <p class="teamDistance">
                    <span class="spanBox">
                      <span style="color:#80adcf">值班电话：</span>
                      <span
                        style="max-width: 188px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block"
                        :title="item.dutytel"
                      >{{item.dutytel?item.dutytel:'- -'}}</span>
                      <b
                        v-if="item.dutytel"
                        class="callphonebgimg"
                        :title="item.dutytel ? item.dutytel : ''"
                        @click="handleClickCallup(item.dutytel,item.dutytel,$event,item.captain)"
                      ></b>
                    </span>
                  </p>
                  <p class="teamDistance">
                    <span class="spanBox">
                      <span style="color:#80adcf">手机：</span>
                      <span
                        style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                        :title="item.phone"
                      >{{item.phone?item.phone:'- -'}}</span>
                      <b
                        v-if="item.phone"
                        class="callphonebgimg"
                        :title="item.phone ? item.phone : ''"
                        @click="handleClickCallup(item.phone,item.phone,$event,item.captain)"
                      ></b>
                    </span>
                  </p>
                </li>
              </ul>
            </div>
    
            <el-pagination
              v-if="listDataAll.length"
              class="constomMyElPage"
              small
              :pager-count="5"
              :current-page.sync="paginationObj.currentPage"
              @current-change="handleCurrentChange"
              :page-size="paginationObj.pageSize"
              layout="prev, pager, next"
              :total="paginationObj.total"
            ></el-pagination>
        </div>
    </div>
    <div v-if='loadingState'>
      <div class="loading"></div>
    </div>
  </div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import { districtServer } from '@/api/installServer';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { dataSourcesServer, rescueTeamServer } from '@/api/installServer';
import DropDownBox from '@/components/feature/rescueTeamModule/DropDownBox.vue';
import publishObjectPath from '@/util/configRegistry';
import { nomalLeftServer, multiuleInterfaceServer} from '@/api/installServer';
@Component({
  name: 'AllTeams',
  components: {
    DropDownBox,
  },
})
export default class AllTeams extends Vue {

  @Prop() public rescueTeamHomeData: any;
  @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法
  private viewResData: any = {
    total: '0',
  };

  private loading: boolean = true;
  // 定义 input关键字
  private inputWord: string = '';
  private listDataAll: any = []; // 列表数据

  private factoryKey = '';
  private isSelectBol: boolean = false;
  private isSelectBol2: boolean = false;
  private showSub = true; // 列表得展开收起
   private loadingState: boolean = false;
  private listData = [
    {
      num: '- -',
      name: '- -',
      typecode: '- -',
      level: '- -',
      _distance: '- -',
    },
  ];
  private listBgClick: any = -1;
  private isShowSelect: boolean = false;
  private isShowSelect2: boolean = false; // 队伍类型

  private selectWord = ''; // 选中得行政区划
  private curSelectCityCache = {
    selectId: [], // 存放当前选中的行政区划的id
    selectWord: '',
  };
  private selectWordType = ''; // 选中得队伍类型
  private selectData: any = []; // 全部行政区划数据
  private selectDataType: any = []; // 全部得队伍类型得数据

  // 下面的都不可以注释，因为在created opts部分属性被重新初始化了，导致watch会被触发
  private opts: any = {
    resourceKey: 'rescueteam',
    typecode: '', // 队伍类型
    districtCode: '', // 行政区划
    keyWord: '',
    pageSize: 5,
    pageIndex: 1,
    geometry: this.$store.state.dataFilterControl.filter.geometry ? JSON.parse(
          this.$store.state.dataFilterControl.filter.geometry,
        ) : '',
  };
  // 分页
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 5,
    pageIndex: 1,
    total: 0,
  };
  // 默认队伍类型
  private defaulttypeArr: any[] = [];
  // 列表点击
  private childdata = {};
  // 列表点击codekey
  private codakeyname = '';
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any, name: any) {
    const self: any = this;
    self.messsageBus.emit('showCallup', true, listObj, val, event, name);
  }
  // 当vuex中filter中districtCode有数据的时候，和本组件的行政区划取交集，没有数据的时候，才是直接把行政区划都放进来
  private getWord(data: any) {
    this.selectWord = data.selectWord;
    this.curSelectCityCache = JSON.parse(JSON.stringify(data));
    this.handleCurSelectCity();
  }
  private getWordType(data: any) {
    const curSelecttypeArrArr: any = data.selectId || [];
    this.selectWordType = data.selectWord;
    curSelecttypeArrArr.forEach((element: any, i: any) => {
         curSelecttypeArrArr[i] = '\'' + curSelecttypeArrArr[i] + '\'';
        });
    this.opts.typecode = curSelecttypeArrArr.length > 0 ? curSelecttypeArrArr.toString()  : ''; // 如果下拉框为全部未选 => 传 ['-']  所有的列表数据为0
  }
  private destroyed() {
    this.getComponent_new()._showPoint([], 'rescueteam', '');
  }
   @Watch('$store.state.configModel.config.MaterialLibrary', { deep: true })
  private getType() {
    this.getRescueteamTypeList();
  }
  /*------公共------*/
  // gis方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('teamDispatch');
    return component;
  }
      //  地图组件
  private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent_left',
     );
    return component;
  }
  private expandSublist() {
    this.showSub = !this.showSub;
  }

  private clickHandler(data: any) {
    this.childdata = data;
    if (this.parentHandleClickNumFn) {
      this.parentHandleClickNumFn(
        JSON.parse(JSON.stringify(data)),
        'TeamDetailsPopup',
      );
    }
    // this.getComponent().openPopup(data.id);
    setTimeout(() => {
      this.getComponent_new().locationCenter('rescueteam', data.id, true);
    }, 500);
  }
  // 取消下拉弹窗
  private canclehandle() {
    this.isShowSelect = false;
    this.isShowSelect2 = false;
    this.isSelectBol = false;
    this.isSelectBol2 = false;
    // this.isSelectBol = !this.isSelectBol;
  }

  /*---------------列表相关------------*/
  // 行政区划
    private city() {
      // TODO
    nomalLeftServer.getCitySelected().then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      this.selectData = res.data;
      this.selectData.forEach((element: any, i: any) => {
        for (const j of Object.keys(this.selectData[i])) {
          if (j === 'gbCode') {
            this.selectData[i].id = this.selectData[i][j];
          }
          if (j === 'name') {
            this.selectData[i].name = this.selectData[i][j]; // 修改属性名为“name”
            // delete this.selectData[i]["districtname"]; //删除“name”
          }
        }
      });
    });
  }
  // private city() {
  //   districtServer
  //     .getDistrictTreeByCode({ districtcode: publishObjectPath.value.district.root })
  //     .then((data: any) => {
  //       if (data.code === 0) {
  //         this.selectData = data.data.children;
  //         if (this.selectData.length > 0) {
  //           this.selectData.forEach((element: any, i: any) => {
  //             for (const j of Object.keys(this.selectData[i])) {
  //               if (j === 'districtcode') {
  //                 this.selectData[i].id = this.selectData[i][j];
  //               }
  //               if (j === 'districtname') {
  //                 this.selectData[i].name = this.selectData[i][j]; // 修改属性名为“name”
  //                 // delete this.selectData[i]["districtname"]; //删除“name”
  //               }
  //             }
  //           });
  //         }
  //       }
  //     });
  // }
  // 队伍类型
  private getRescueteamTypeList() {
    // 如果专题json里有配置就使用josn里面的
    if (this.$store.state.configModel.config.rescueTeam && this.$store.state.configModel.config.rescueTeam.RescueteamTypeList) {
      this.selectDataType = this.$store.state.configModel.config.rescueTeam.RescueteamTypeList;
      this.defaulttypeArr = this.selectDataType.map((item: any) => {
        return '\'' + item.RESCUETYPECODE + '\'';
      });
      this.opts.typecode = this.defaulttypeArr.toString();
      this.setSelectDataType();
    } else {
      rescueTeamServer.getRescueteamType().then((data: any) => {
        this.selectDataType = data.list;
        this.setSelectDataType();
      });
    }
  }
  /**
   * 处理队伍类型数据
   */
  private setSelectDataType() {
    if (this.selectDataType.length > 0) {
        this.selectDataType.forEach((element: any, i: any) => {
          for (const j of Object.keys(this.selectDataType[i])) {
            if (j === 'RESCUETYPENAME') {
              this.selectDataType[i].name = this.selectDataType[i][j];
            }
            if (j === 'RESCUETYPECODE') {
              this.selectDataType[i].id = this.selectDataType[i][j];
            }
          }
        });
      }
  }
  // 搜索框
  @Watch('inputWord')
  private getInputWordListData() {
    const self = this;
    setTimeout(() => {
      self.opts.keyWord = self.inputWord;
    }, 600);
  }

  // 分页点击
  private handleCurrentChange(val: number) {
    this.paginationObj.pageIndex = val;
    // this.opts.pageIndex = val;
    this.FnListData(JSON.parse(JSON.stringify(this.opts)));
  }

  // 列表数据变化时更新状态
  @Watch('opts', { deep: true })
  private updateList(newVal: any, oldVal: any): void {
            this.loadingState = true;
            this.paginationObj.pageIndex = 1;
            this.paginationObj.currentPage = 1;
            this.FnListData(JSON.parse(JSON.stringify(this.opts)));
  }
  // 数据过滤条件发生更改
  @Watch('$store.state.dataFilterControl.filter')
  private updateGeometry(newVal?: any, oldVal?: any) {
    this.getComponent().clear();
    this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry
                        ? JSON.parse(this.$store.state.dataFilterControl.filter.geometry)
                        : '';
    this.handleCurSelectCity();
  }
  // 根据当前选中的行政区划编码的情况，制作this.opts.districtCode
  private handleCurSelectCity() {
    const curSelectCityCodeArr: any = this.curSelectCityCache.selectId || [];
    // 例如:['370602', '370611'],而当前行政区划研判的districtCode为"" 或者 "370600"
    if (!this.$store.state.dataFilterControl.filter.districtCode) {
        if (curSelectCityCodeArr.length <= 1) {
        curSelectCityCodeArr.forEach((element: any, i: any) => {
         curSelectCityCodeArr[i] = curSelectCityCodeArr[i];
        });
      } else {
        curSelectCityCodeArr.forEach((element: any, i: any) => {
                curSelectCityCodeArr[i] = '\'' + curSelectCityCodeArr[i] + '\'';
                });
      }
        this.opts.districtCode = curSelectCityCodeArr.length > 0 ? curSelectCityCodeArr.toString() : ''; // 如果下拉框为全部未选 => 传 ['-']  所有的列表数据为0
    } else { // 例如:['370602', '370611'],而当前行政区划研判的districtCode为"370686" 或者 '370611',"370686"
      // 行政区划研判，数据过滤条件有值,则取当前选中的和filter中的行政区划的交集
      const lnewArr = curSelectCityCodeArr.concat(this.$store.state.dataFilterControl.filter.districtCode.split(','));
      const res = new Map();
      const intersectArr = lnewArr.filter((districtCode: any) => !res.has(districtCode) && res.set(districtCode, 1));
      if (intersectArr.length <= 1) {
        intersectArr.forEach((element: any, i: any) => {
         intersectArr[i] = intersectArr[i];
        });
      } else {
        intersectArr.forEach((element: any, i: any) => {
                intersectArr[i] = '\'' + intersectArr[i] + '\'';
                });
      }
      this.opts.districtCode = intersectArr.length > 0 ? intersectArr.toString() : ''; // 传时间戳是为了，不传空。让查不出来数据。
    }
  }
  // 获取列表数据
  private FnListData(opts: any) {
    const optsObj = JSON.parse(JSON.stringify(opts));
    this.getComponent().clear();
    const showResourceOpts: any = {
      keyword: opts.keyword,
      districtCode: opts.districtCode,
    };
    const queryParam: any = {
      pageSize: optsObj.pageSize,
      // pageIndex: optsObj.pageIndex,
      pageIndex: this.paginationObj.pageIndex,
      keyword: optsObj.keyWord,
      districtCode: optsObj.districtCode,
      typecode: optsObj.typecode,
      resourceKey: 'rescueteam',
      polygon: '',
      type: '2',
    };
    if (this.$store.state.eventPushStore.eventId) {
      queryParam.polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(
          JSON.parse(this.$store.state.dataFilterControl.filter.geometry),
        ).asWkt();
      this.renderlist(queryParam);
      this.MapRender(queryParam);
    } else if (this.$store.state.dataFilterControl.filter.geometry) {
      const jsonObj = JSON.parse(this.$store.state.dataFilterControl.filter.geometry);
      showResourceOpts.geometry = jsonObj;
      queryParam.polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(
          JSON.parse(this.$store.state.dataFilterControl.filter.geometry),
        ).asWkt();
      queryParam.type = '2';
      // 列表请求翻页接口
      this.renderlist(queryParam);
      // 地图请求所有点位
      this.MapRender(queryParam);
    } else {
      queryParam.type = '3';
      // 列表请求翻页接口
      this.renderlist(queryParam);
      // 地图请求所有点位
      this.MapRender(queryParam);
    }
  }
  private MapRender(queryParam: any) {
    queryParam.pageSize = '9999';
    queryParam.pageIndex = '1';
    multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
          this.getComponent_new()._showPoint(
          res.list,
          'rescueteam',
          '',
        );
      });
  }
  private renderlist(queryParam: any) {
    console.log('queryParam', queryParam);
    queryParam.btnflags = ''; // 这里添加为空字符的btnflags 走getDataList方法else判断 否则走else if 会导致select失效 王智 2022年1月7日
    multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
          this.listDataAll = res.list;
          this.loadingState = false;
          this.paginationObj.total = res.total;
      });
  }
  // 下拉框展开/收起
  private isSelectBolFn() {
    this.isShowSelect2 = false;
    this.isShowSelect = !this.isShowSelect;
    this.isSelectBol2 = false;
    this.isSelectBol = !this.isSelectBol;
  }
  // 下拉框展开/收起
  private isSelectBolFn2() {
    this.isShowSelect = false;
    this.isShowSelect2 = !this.isShowSelect2;
    this.isSelectBol = false;
    this.isSelectBol2 = !this.isSelectBol2;
  }

  // opts赋初值，要放在created中，否则会触发opts的watchgetRescueteamTypeList
  private created() {
    // this.opts.districtCode = this.$store.state.dataFilterControl.filter.districtCode;
    // if (this.$store.state.dataFilterControl.filter.geometry) {
    //   this.opts.geometry = JSON.parse(
    //       this.$store.state.dataFilterControl.filter.geometry,
    //     );
    // }
  }
  //   private mounted() {}
  private mounted() {
    this.loadingState = true;
    // 调用行政区划接口
    this.city();
    this.getRescueteamTypeList();
    this.handleCurSelectCity();
    // this.getComponent().showResource(JSON.parse(JSON.stringify(this.opts)));
    this.FnListData(JSON.parse(JSON.stringify(this.opts)));
    this.messsageBus.emit('eventInfoMapShow', false);
    this.getComponent_new().unload();
    this.getComponent_new()._clearLayerByID('rescueteam');
  }

}
</script>

<style lang="less" scoped>
@import "../../../assets/css/decisionSupport/teamIcon.less";
@import "../../../assets/css/decisionSupport/Statistic.half.less";
@import "../../../assets/css/decisionSupport/DiscussTab.less";
.tempRight-cont {
  padding-right: 6px;
}
  .itemName{
  color: #67e1fb;
  font-size: 28px;
  font-style: normal;
  }
  .loading {
      color: #fff;
      background: url(../../../assets/img/halfScreen/halflist/loading.gif)
        no-repeat 33px 255px;
      color: #d2e1ec;
      height: 100%;
      margin-top: -120px;
      p {
        padding-left: 5px;
        margin: 0;
        transform: translateY(-8px);
      }
      center {
        margin-top: 120%;
      }
  }
.DisasterPowerDispatch {
  width: 365px;
  height: 855px;
  padding: 5px 15px;
  border-radius: 5px;
  position: relative;
  * {
    margin: 0;
    padding: 0;
  }
  /* 统计列表样式  start*/
  .statisticList {
    padding-top: 5px;
    &_li {
      display: flex;
      justify-content: space-between;
      color: #ffffff;
      background: url("../../../assets/img/halfScreen/halflist/listbg.png")
        no-repeat -5px 50%;
      background-size: 100% 100%;
      padding: 10px;
      box-sizing: border-box;
      margin: 5px 0;
      cursor: pointer;
      &.checkSty,
      &:hover {
        background-image: url("../../../assets/img/halfScreen/halflist/listbghover.png");
      }
      & + & {
        margin-top: 5px;
      }
      &_textWarning {
        color: yellow;
        padding-right: 5px;
      }
    }
  }
  /* 统计列表样式  end*/

  .halflist-back {
    width: 61px;
    height: 25px;
    position: absolute;
    top: 10px;
    right: 6px;
    color: #338af8;
    cursor: pointer;
    z-index: 1;
    background: url("../../../assets/img/default/panel/toBack.png") no-repeat
      0px 70%;
    background-size: 100% 100%;
    &:hover {
      background-image: url("../../../assets/img/default/panel/toBack_h.png");
    }
  }
}
// 统计面板
#MapDialog {
  height: auto;
  .half-title {
    height: 37px;
    font-style: italic;
    margin-top: -10px;
  }
}
// 列表
.listDistrict {
  .callphonebgimg {
    display: inline-block;
    width: 22px;
    height: 22px;
    background: url("../../../assets/img/realtimeTeam/phone.png") no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
    margin-left: 10px;
    cursor: pointer;
  }
  .listDistrict-flex-box {
    display: block;
    width: 100%;
    .selcetIconTop {
      display: inline-block;
      width: 35px;
      height: 30px;
      background: url("../../../assets/img/halfScreen/halflist/select2bg.png")
        no-repeat;
      background-size: 100% 100%;
      margin: 5px 5px 0 0;
      cursor: pointer;
    }
    .selcetIconBot {
      display: inline-block;
      width: 35px;
      height: 30px;
      background: url("../../../assets/img/halfScreen/halflist/selcet1bg.png")
        no-repeat;
      background-size: 100% 100%;
      margin: 5px 5px 0 0;
      cursor: pointer;
      transform: rotate(180deg);
    }
    input::-webkit-input-placeholder {
      color: #c4d7da;
    }
    input:-moz-placeholder {
      color: #c4d7da;
    }
    input:-ms-input-placeholder {
      color: #c4d7da;
    }
    .listDistrict-input-content {
      clear: both;
      margin-bottom: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .listDistrict-icon {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      cursor: pointer;
    }
  }
  .listDistrict-input {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    background-size: 100% 100%;
    color: #3cc0ec;
    margin: 10px 0;
  }
  .listDistrict-input-choose {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    background: url(../../../assets/img/halfScreen/halflist/selcetHoverbg.png)
      no-repeat;
    background-size: 100% 100%;
    color: #3cc0ec;
    margin: 10px 0;
    .selcetIconTop {
      display: inline-block;
      width: 35px;
      height: 30px;
      background: url("../../../assets/img/halfScreen/halflist/select2bg.png")
        no-repeat;
      background-size: 100% 100%;
      margin: 5px 5px 0 0;
      cursor: pointer;
    }
    .selcetIconBot {
      display: inline-block;
      width: 35px;
      height: 30px;
      background: url("../../../assets/img/halfScreen/halflist/selcet1bg.png")
        no-repeat;
      background-size: 100% 100%;
      margin: 5px 5px 0 0;
      cursor: pointer;
      transform: rotate(180deg);
    }
    input::-webkit-input-placeholder {
      color: #c4d7da;
    }
    input:-moz-placeholder {
      color: #c4d7da;
    }
    input:-ms-input-placeholder {
      color: #c4d7da;
    }
    .listDistrict-input-content {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .listDistrict-icon {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .selectListDis {
    height: 319px !important;
    position: absolute;
    top: 105px;
    z-index: 20;
    background-color: #071022 !important;
    box-shadow: 4px 6px 16px 0px #001931;
    background: url("../../../assets/img/halfScreen/eventAndTopics/select_bg.png")
      no-repeat;
    background-size: 100% 100%;
    width: 100%;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .selectListType {
    height: 319px !important;
    position: absolute;
    top: 155px;
    z-index: 20;
    background-color: #071022 !important;
    box-shadow: 4px 6px 16px 0px #001931;
    background: url("../../../assets/img/halfScreen/eventAndTopics/select_bg.png")
      no-repeat;
    background-size: 100% 100%;
    width: 100%;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .listDistrict-option {
    padding: 5px 0 0 10px;
    line-height: 30px;
    .selectBtn {
      display: flex;
      justify-content: space-around;
      li {
        width: 104px;
        height: 38px;
        font-family: MicrosoftYaHei;
        text-align: center;
        line-height: 38px;
        cursor: pointer;
      }
      li:nth-of-type(1) {
        background-image: linear-gradient(
            180deg,
            rgba(249, 216, 72, 0.54) 0%,
            rgba(243, 177, 61, 0.54) 100%
          ),
          linear-gradient(#061418, #061418);
        background-blend-mode: normal, normal;
        box-shadow: 0px 2px 4px 0px rgba(95, 59, 16, 0.45);
        border-radius: 3px;
        border: solid 1px #fbe663;
        opacity: 0.8;
        color: #fefefe;
      }
      li:nth-of-type(2) {
        background-image: linear-gradient(
            -3deg,
            #357ac1 0%,
            rgba(72, 161, 204, 0.29) 53%,
            rgba(91, 199, 214, 0.55) 100%
          ),
          linear-gradient(#061418, #061418);
        background-blend-mode: normal, normal;
        box-shadow: 1px 2px 4px 0px rgba(91, 199, 214, 0.82);
        border-radius: 3px;
        border: solid 1px #5bc7d6;
        color: #a0f4fd;
      }
    }
  }
}
.el-tree-node__content {
  padding-left: 0 !important;
}
.listDistrict_title {
  color: #67e1fb;
  letter-spacing: 1px;
  font-weight: normal;
  line-height: 60px;
  display: flex;
  &:after {
    content: "";
    background: url(../../../assets/img/halfScreen/halflist/titlexian.png) 50% 0
      no-repeat;
    // background: url(../../../assets/img/halfScreen/halflist/titlebg.png) 50% 0 no-repeat;
    position: absolute;
    width: 100%;
    height: 23px;
    top: 54px;
    left: 0;
  }
  .panel_switch {
    width: 34px;
    height: 29px;
    background-size: 100% 100%;
    position: absolute;
    right: 0px;
    top: 15px;
    cursor: pointer;
    background: url("../../../assets/img/halfScreen/halflist/open.png") 50% 50%
      no-repeat;
    transition: transform 0.3s;
  }
  .panel_switch.panel-switch-reverse {
    transform: scale(1, -1);
  }
}
.classList {
  color: yellow;
}
.nodata {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 125px;
}
.felx_box_statistics {
  width: 100%;
  display: block;
  color: #8cafd0;
  font-weight: 500;
  bottom: 40px;
  top: unset;
  position: unset;
}
.listDataAll-outbox{
  height:calc(100% - 219px);
  .listDataAll-innerbox{
    height:100%;
  }
}
.listBoxScrollbar {
  height: calc(100% - 44px);
  overflow: hidden;
  overflow-y: scroll;
}

.listBoxSingle {
  &_li {
    cursor: pointer;
    color: #ffffff;
    padding: 10px 0px;
    margin: 10px 0 0 0;
    background: url("../../../assets/img/halfScreen/halflist/boxListBgIcon.png")
      no-repeat 0 0;
    background-size: 100% 100%;

    .teamName {
      font-family: MicrosoftYaHei;
      font-weight: normal;
      font-stretch: normal;
      color: #e8f4fe;
      padding-bottom: 10px;
      font-size:26px;
      display:flex;
      span:first-child{
    background: rgba(71, 215, 162, 0.2);
    border: 1px #47d7a2 solid;
    border-radius: 5px;
    color: #fff;
    font-size: 24px;
    padding: 0 5px;
    display: inline-block;
    font-style: normal;
    margin-right: 10px;
    height:30px;
      }
    }

    .teamDistance {
      font-weight: normal;
      color: #e8f4fe;
      font-size:26px;
      font {
        font-family: Impact;
        font-weight: normal;
        font-stretch: normal;
        line-height: 1;
        color: #27e8ff;
        padding-right: 10px;
         
      }
      .spanBox{
        display: flex;
        align-items: center;
      }
    }
    .teamType {
      font-weight: normal;
      color: #f7fdff;
      font {
        height: 23px;
        font-family: MicrosoftYaHei;
        font-weight: normal;
        font-stretch: normal;
        color: #8cafd0;
      }
    }
  }
  .checkSty {
    background: url(../../../assets/img/halfScreen/halflist/listbghover.png)
      no-repeat;
  }
}
</style>
<style lang="less">
