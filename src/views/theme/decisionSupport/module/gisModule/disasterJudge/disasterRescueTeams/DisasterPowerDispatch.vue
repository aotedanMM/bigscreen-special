<!--力量调度&物资库下钻-->
<template>
    <div class='DisasterPowerDispatch'>
        <span class='halflist-back' @click='backParent'></span>
        <div class='loading' v-if='loading'>
            <p class='title-panel' style='font-style:italic;'>{{ title }}分布</p>
        </div>
        <div v-else>
            <!--统计-->
            <div id='MapDialog'>
                <div class='detail'>
                    <div class='half-title title-panel'>{{ title }}分布</div>
                    <ul class='statisticCount f-tit-h2'>
                        <li>
                            共
                            <span class='f-number'>{{ nteamtotal?nteamtotal:'0' }}</span>
                            支
                        </li>
                    </ul>
                    <div v-show='isEnterDispose'>
                        <ul
                                class='statisticList'
                                v-if='(!this.$store.state.configModel.config.quickStudy.notShowTabFlag
                    && 
                    !this.$store.state.eventPushStore.eventLocation.geometry)
                    ||
                    (this.$store.state.eventPushStore.eventId
                    && 
                    !this.$store.state.eventPushStore.eventLocation.geometry)'
                        >
                            <li
                                    class='statisticList_li f-tit-h2'
                                    v-for='(i, index) in viewRenderData'
                                    :key='index'
                                    :class='{ checkSty: i.isChecked }'
                                    @click='
                clickFeatureList(
                  i.isChecked,
                  index,
                  viewRenderData,
                  i,
                )
              '
                            >
              <span>
                <span class='statisticList_li_textWarning f-number'>{{ i.title }}</span>
                <span
                        v-show="$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp'"
                >{{i.levelUnit}}</span>
              </span>
                                <span>
                <span class='statisticList_li_textWarning f-number'>{{ i.quantity }}</span>
                <span>
                  <slot name='unit'>{{unit}}</slot>
                </span>
              </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!--列表-->
            <div class='listDistrict'>
                <div class='listDistrict_title'>
                    <span class='f-tit-h2'>{{ title }}列表</span>
                    <i
                            @click='FnMinimize'
                            :class="minimize? 'panel_switch': 'panel_switch panel-switch-reverse'"
                    ></i>
                </div>
                <div v-show='minimize'>
                    <div class='listDistrict-flex-box'>
                        <div class='listDistrict-input'>
                            <div class='listDistrict-input-content'>
                                <el-input class='csmMyInput' type='text' v-model.trim='inputWord'>
                                    <i slot='suffix' class='iconSelf_search'></i>
                                </el-input>
                            </div>
                        </div>
                        <div class='listDistrict-select'>
                            <div @click.stop='isShowSelect = !isShowSelect'>
                                <div class='listDistrict-input-content' @click='isSelectBolFn'>
                                    <el-input
                                            class='csmMyInput'
                                            type='text'
                                            :class="{' csmMyInput-cur': isSelectBol }"
                                            readonly
                                            v-model.trim='selectWord'
                                    >
                                        <i slot="suffix' :class='isSelectBol? 'selcetIconBot':  'selcetIconTop'"></i>
                                    </el-input>
                                </div>
                            </div>
                            <el-scrollbar class='cmp-scrollbar-y selectList' v-show='isShowSelect'>
                                <div class='listDistrict-option'>
                                    <el-checkbox
                                            class='constomMyCheckbox'
                                            v-model='checkAll'
                                            @change='handleCheckAllChange'
                                    >全选
                                    </el-checkbox>
                                    <el-checkbox-group v-model='checkedOption' @change='handleCheckedChange' :min='1'>
                                        <el-checkbox
                                                class='constomMyCheckbox'
                                                v-for='name in selectArr'
                                                :label='name'
                                                :key='name'
                                                :title='name'
                                        >{{name}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                    <ul class='selectBtn'>
                                        <li @click='canclehandle'>关闭</li>
                                    </ul>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                    <!-- 列表每一行-->
                    <div class='nodata' v-if='noData === true || !listDataAll.length'>
                        <img src='../../../../../../../assets/img/default/panel/noData.png' alt srcset/>
                    </div>
                    <div v-else>
                        <div class='listBoxScrollbar'>
                            <ul class='listBoxSingle'>
                                <li
                                        class='f-txt-com listBoxSingle_li'
                                        v-for='(item, index) in listDataAll'
                                        :key='index'
                                        @click='clickHandler(item,index)'
                                        :class="[listBgClick === index ? 'classList' : '']"
                                >
                                    <p class='teamName listBox_li'>
                                        <span class='tooltip' :title='indexMethod(index)'>{{indexMethod(index)}}</span>
                                        {{item.name}}
                                    </p>
                                    <p class='teamDistance'>
                    <span>
                      <span style='color:#80adcf'>类型：</span>
                      <span
                              style='max-width: 120px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;'
                              :title='item.typecode'
                      >{{item.typecode}}</span>
                    </span>
                                        <span style='float: right;margin-right: 5px;'>
                      <font class='f-number'>{{item._distance}}</font>km
                    </span>
                                    </p>
                                </li>
                            </ul>
                            <div class='felx_box_statistics' v-if='sourceTypeCodeObj && sourceTypeCodeObj.isShow'>
                                <div class='f-txt-com'>
                                    <span>数据来源：{{(sourceTypeCodeObj && sourceTypeCodeObj.sourceData && sourceTypeCodeObj.sourceData.attrOrgin)||('暂无数据')}}</span>
                                    <br/>
                                    <span>数据更新时间：{{(sourceTypeCodeObj && sourceTypeCodeObj.sourceData && sourceTypeCodeObj.sourceData.attrTime.split(' ')[0])||('暂无数据')}}</span>
                                </div>
                                <div class='f-txt-com' v-if='false'>
                                    <span>空间数据来源：{{(sourceTypeCodeObj && sourceTypeCodeObj.sourceData && sourceTypeCodeObj.sourceData.spaceOrgin)||('暂无数据')}}</span>
                                    <br/>
                                    <span>空间数据更新时间：{{(sourceTypeCodeObj && sourceTypeCodeObj.sourceData && sourceTypeCodeObj.sourceData.spaceTime.split(' ')[0])||('暂无数据')}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- 分页-->
                        <!-- @size-change='handleSizeChange' -->
                        <el-pagination
                                v-if='noData === false || listDataAll.length === 0'
                                class='constomMyElPage'
                                small
                                :pager-count='5'
                                :current-page.sync='paginationObj.currentPage'
                                @current-change='handleCurrentChange'
                                :page-size='paginationObj.pageSize'
                                layout='prev, pager, next'
                                :total='paginationObj.total'
                        ></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import {
    populationSetUnit,
    populationSetTitle,
  } from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
  import {dataSourcesServer} from '@/api/installServer';
  import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  import {initGeometry} from '../../../../../../../components/feature/EmergencyPower/gemoJson';
  import { nomalLeftServer, multiuleInterfaceServer } from '@/api/installServer';
  @Component({
    name: 'DisasterPowerDispatch',
    components: {
      renderpopUpTemplate,
    },
  })
  export default class DisasterPowerDispatch extends Vue {
    // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
    @Prop({default: false}) public isShow!: boolean;
    @Prop() public rescueTeamHomeData: any;
    private viewResData: any = {
      total: '0',
    };
    private loading: boolean = true;
    private viewRenderData: any = [];
    private title: string = '';
    private sourceTypeCodeObj: any;
    // 定义 input关键字
    private inputWord: string = '';
    private listDataAll: any = [];
    private noData: any = true;
    private minimize: any = true;
    private factoryKey = '';
    private executeBol: boolean = false;
    private isSelectBol: boolean = false;
    private listData = [
      {
        num: '暂无数据',
        name: '暂无数据',
        typecode: '暂无数据',
        level: '暂无数据',
        _distance: '暂无数据',
      },
    ];
    private listBgClick: any = -1;
    private isShowSelect: boolean = false;
    private selectData = []; // 全部队伍数据
    private checkAll = false; // 默认非全选
    private moduleType: any = ''; // 已选的队伍类型
    private checkedOption: any = []; // 已选的队伍名称
    private curActiveTabIndex: any = []; // 已选索引
    private curActiveTabObj: any = {}; // 已选对象
    private selectWord = '';
    private halflistHeight: any = '';
    private searchDomHeight: any = '';
    private opts: any = {
      keyWord: this.inputWord,
      typeArr: this.moduleType,
      levelArr: [],
      pageSize: 10,
      pageIndex: 1,
    };
    private isQIantu = '';
    private Mapkey: any = '';
    private nteamtotal: number = 0;
    private Maplist: any = '';
    private unit = '';
    private index = '';
    private item = '';
    // 分页
    private paginationObj: any = {
      currentPage: this.opts.pageIndex,
      pageSize: this.opts.pageSize,
      total: 0,
    };

    private indexMethod(index: number) {
      return (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize + (index + 1);
    }


    /*------公共------*/

    // gis方法
    private getComponent() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent(
        'disasterJudgeNewRepertory',
      );
      return component;
    }

    // 返回一级页面
    private backParent() {
      this.$emit('backParent');
    }

    // 判断是否进入处置模式，显示经验圈和列表高度配置
    get isEnterDispose() {
      return (
        this.$store.state.dataFilterControl.zhypGeoType &&
        (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ||
          this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp')
      );
    }

    // 取消下拉弹窗
    private canclehandle() {
      this.isShowSelect = !this.isShowSelect;
      this.isSelectBol = !this.isSelectBol;
    }

    /*------统计相关---------*/

    // 获取统计数据
    private getData() {
      const component = this.getComponent();
      this.getComponent_new().getMultiuleOneNum(this.Mapkey[0]).then((res: any) => {
            this.Maplist = res;
            const temp: any = [];
            const tempTotal: any = [];
            Object.keys(res).forEach((item) => {
                temp.push({
                    codeKey: item,
                    tabNumber: res[item],
                });
            });
            temp.map((item: any) => {
                this.nteamtotal = item.tabNumber.count + this.nteamtotal;
                tempTotal.push(...item.tabNumber.list);
            });
            // this.initData(tempTotal);
            this.renderList('');
            this.listDataAll = tempTotal;
            this.viewResData = temp;
            this.dealViewRenderData();
        });
    }
private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent_left',
     );
    return component;
  }
    // 处理统计数据
    private dealViewRenderData() {
      this.opts.levelArr = [];
      this.viewRenderData = this.viewResData.map(
        (item: any, index: number) => {
          let retIsChecked = false;
          if (this.curActiveTabIndex.includes(index)) {
            // 添加高亮状态
            retIsChecked = true;
            this.opts.levelArr.push(item.codeKey);
          }
          return {
            levelTitle: populationSetUnit(
              item.codeKey,
              this.$store.state.controlMoudle.mapCircleQueryType,
            ),
            levelUnit: populationSetTitle(
              this.$store.state.controlMoudle.mapCircleQueryType,
            ),
            level: item.codeKey,
            title: item.tabNumber.title,
            quantity: item.tabNumber.count,
            isChecked: retIsChecked,
          };
        },
      );
    }

    // 点击统计数据
    private clickFeatureList(
      bol: boolean, // 当前是否选中
      ind: number, // 下标
      data: any, // 全部数据
      item: any, // 当前点击的一条数据
    ) {
      this.opts.pageIndex = 1;
      this.paginationObj.currentPage = 1;
      // 关闭路径导航
      this.messsageBus.emit('Close_Router', {});
      // 隐藏常态模式事件分布
      this.messsageBus.emit('eventInfoMapShow', false);
      if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
        // this.getComponent().hideResource(
        //   this.moduleType,
        //   this.opts.levelArr,
        //   this.isQIantu,
        // );
        // 单选
        if (bol) {
          item.isChecked = false;
          this.noData = true;
        } else {
          data.forEach((forItem: any, forIndex: any, forData: any) => {
            forItem.isChecked = false;
          });
          item.isChecked = true;
          this.opts.levelArr = [item.level];
        }
      } else {
        // 多选
        if (bol) {
          this.viewRenderData[ind].isChecked = false;
          // this.getComponent().hideResource(
          //   this.moduleType,
          //   [item.level],
          //   this.isQIantu,
          // );
        } else {
          this.viewRenderData[ind].isChecked = true;
        }
        const tempLevel: any = [];
        this.viewRenderData.forEach(function(res: any) {
          if (res.isChecked === true) {
            tempLevel.push(res.level);
          }
        });
        this.opts.levelArr = tempLevel;
      }
    }

    /*---------------列表相关------------*/

    // 下拉框选项数据处理
    get selectArr(): any {
      const res: any = [];
      this.selectData.map((item: any, index: number) => {
        (res as any).push(item.name);
      });
      return res;
    }
    // 获取已选队伍类型
    @Watch('checkedOption', {deep: true})
    private dealmoduleType() {
      const res: any = [];
      this.selectWord = '';
      this.checkedOption.forEach((name: any, ind: number) => {
        this.selectData.forEach((item: any, index: number) => {
          if (name === item.name) {
            res.push(item.codeType);
            if (
              this.checkedOption.length === 1 ||
              this.checkedOption.length === ind + 1
            ) {
              this.selectWord += item.name;
            } else {
              this.selectWord += item.name + '，';
            }
          }
        });
      });
      this.moduleType = res.length > 0 ? res : ['-']; // 如果下拉框为全部未选 => 传 ['-']  所有的列表数据为0
      this.opts.typeArr = this.moduleType;
      this.getData();
      this.getWordType();
    }

    // 搜索框
    @Watch('inputWord')
    private getInputWordListData() {
      this.opts.keyWord = this.inputWord;
      this.opts.pageIndex = 1;
      this.renderList('');
    }

    // 下拉全选
    private handleCheckAllChange(val: any) {
      if (!val) {
        // this.getComponent().hideResource(
        //   this.moduleType,
        //   this.opts.levelArr,
        //   this.isQIantu,
        // );
      }
      this.checkedOption = val ? this.selectArr : [];
    }

    // 下拉复选框
    private handleCheckedChange(value: any) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.selectArr.length;
    }

    // 获取列表数据
    private FnListData(opts: any) {
      this.getComponent().clear();
      for (let i = 0; i < opts.levelArr.length; i++) {
        opts.levelArr[i] = opts.levelArr[i] + '';
      }
      const requestMeath: any = '';
      const eventInfoWrapper: any = this.$ioc.resolve('eventInfo');
      const eventData = eventInfoWrapper.getRanges();
      // 标点
      if (this.$store.state.dataFilterControl.zhypGeoType.key === 'hcqyp' || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') { // 当是缓冲圈查询时的情况传入空间参数
        for (const k of eventData) {
          if (k.level === opts.levelArr[0]) {
            this.renderList(k.geometry);
          }
        }
      } else if (this.$store.state.dataFilterControl.zhypGeoType.key === '') {
        for (const k of eventData) {
          if (k.level === opts.levelArr[0]) {
            this.renderList(k.geometry);
          }
        }
      } else {
        for (const k of eventData) {
          if (k.level === opts.levelArr[0]) {
            this.renderList(k.geometry);
          }
        }
      }
    }

    private initData(res: any) {
      this.loading = false;
      this.executeBol = true;
      this.listData = [];
      const listData = [];
      const item = res.list ? res.list : res;
      this.paginationObj.total = res.total ? res.total : res.length;
      for (let index = 0; index < item.length; index++) {
        const element = item[index];
        let Letname = '暂无数据';
        let Lettype = '暂无数据';
        let Letlevel = '暂无数据';
        const Letdistance = '';
        element.type = element.type || element.rescuetypename; // 力量调度和物资保障的类型的字段不一样
        if (element.name !== null) {
          Letname = element.name;
        }
        if (element.type !== null || element.type !== undefined) {
          Lettype = element.type;
        }
        if (element.level !== null) {
          Letlevel = element.level;
        }
        if (element.distance !== null) {
            // Letdistance = element.distance;
          }
        const data = {
          name: Letname,
          typecode: Lettype,
          lon: element.latitude || '',
            lat: element.longitude || '',
            id: element.id,
          num: index + 1,
          level: Letlevel,
          _distance: Letdistance,
        };
        listData.push(data);
      }
      this.$set(this, 'listData', listData);
      this.listDataAll = this.listData;
      this.noData = false;
      this.ListHeightFn();
    }

    // 数据加载完成,dom更改后发送事件设置列表高度
    private updated() {
      this.ListHeightFn();
    }

    private ListHeightFn() {
      this.$nextTick(() => {
        this.halflistHeight = $('#MapDialog').height(); // 统计面板高
        this.searchDomHeight = $('.listDistrict-flex-box').height(); // 搜索/下拉的高
        // 滚动条的高 = 总高-统计面板高-标题/搜索/分页的高
        $('.listDistrict .listBoxScrollbar').css(
          'height',
          702 - this.halflistHeight - this.searchDomHeight - 100 + 'px',
        );
      });
    }

    // 当展开的时候重新加载高度信息
    @Watch('isShow')
    private initListHeightFn(val: any): void {
      if (val) {
        this.ListHeightFn();
      }
    }

    // 列表点击
    private clickHandler(item: any, index: number) {
      this.getComponent().openPopup(item.typecode, item.id);
      this.getComponent_new().locationCenter(this.Mapkey[0], item.id);
    }

    // 分页点击
    private handleCurrentChange(val: number) {
      this.opts.pageIndex = val;
      this.renderList('');
    }
    private getWordType() {
      const curSelecttypeArrArr: any = this.moduleType || [];
      curSelecttypeArrArr.forEach((element: any, i: any) => {
        curSelecttypeArrArr[i] = '\'' + curSelecttypeArrArr[i] + '\'';
      });
      this.moduleType = curSelecttypeArrArr.length > 0 ? curSelecttypeArrArr.toString()  : ''; // 如果下拉框为全部未选 => 传 ['-']  所有的列表数据为0
    }
    private renderList(circle: any) {
      const queryParam: any = {
        pageSize: '10',
        pageIndex: this.opts.pageIndex,
        keyword: this.inputWord,
        districtCode: this.$store.state.dataFilterControl.filter.districtCode ? this.$store.state.dataFilterControl.filter.districtCode : '',
        typecode: this.moduleType,
        resourceKey: 'rescueteam',
        polygon: circle ? g2.sfs.GeometryFactory.createGeometryFromGeoJson(
        JSON.parse(JSON.stringify(circle)),
      ).asWkt() : g2.sfs.GeometryFactory.createGeometryFromGeoJson(
        JSON.parse(this.$store.state.dataFilterControl.filter.geometry),
      ).asWkt(),
        type: '2',
      };
      const showResourceOpts: any = {
        keyword: this.inputWord,
        districtCode: this.$store.state.dataFilterControl.filter.districtCode,
      };
      if (this.$store.state.dataFilterControl.filter.geometry) {
        const jsonObj = JSON.parse(
          this.$store.state.dataFilterControl.filter.geometry,
        );
        showResourceOpts.geometry = jsonObj;
        queryParam.geometry = jsonObj;
      }
      multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
        this.initData(res);
      });
      queryParam.pageSize = '99999';
      multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
        this.getComponent_new()._clearLayerByID(this.Mapkey[0]);
        this.getComponent_new()._showPoint(res.list, this.Mapkey[0], '');
        this.nteamtotal = res.total;
      });
    }

    // 列表数据变化时更新状态
    @Watch('opts', {deep: true})
    private updateList(): void {
      if (this.executeBol) { // 第一次进来不执行这个方法
        this.FnListData(JSON.parse(JSON.stringify(this.opts)));
      }
    }

    // 监听烈度圈或经验圈修改时重新请求数据
    @Watch('$store.state.dataFilterControl.zhypGeoType.key')
    private updateTeam() {
      this.getComponent().clear();
      this.opts.pageIndex = 1;
      this.opts.keyWord = '';
      this.getEventInfoWrapper();
    }

    // 获取烈度圈、经验圈对应数值
    private async getEventInfoWrapper() {
      const eventInfoWrapper: any = this.$ioc.resolve('eventInfo');
      if (eventInfoWrapper) {
        const eventData = eventInfoWrapper.getRanges(); // 这个方法执行之前，地图必须绘制了圈（烈度或者经验）
        const jyqNumber = eventData[eventData.length - 1].level;
        this.opts.levelArr = [jyqNumber];
        this.curActiveTabIndex = [eventData.length - 1];
        this.$forceUpdate(); // 强制刷新页面选中效果
        this.getData();
        if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') { // 经验圈
            // const jyqNumber = eventData[eventData.length - 1].level;
            this.opts.levelArr = [jyqNumber];
            this.curActiveTabIndex = [eventData.length - 1];
            this.$forceUpdate(); // 强制刷新页面选中效果
        } else if ( this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp' ) { // 烈度圈
            // 初始化烈度圈全部选中
            this.$forceUpdate(); // 强制刷新页面选中效果
        }
      }
    }

    // 获取数据来源
    private FnSourceTypeCode() {
      this.sourceTypeCodeObj = dataSourceConfig('DisasterRescueTeamsList');
      dataSourcesServer
        .getDataSourceServer({typeCode: this.sourceTypeCodeObj.typeCode})
        .then((data: any) => {
          const res = data;
          this.sourceTypeCodeObj.sourceData = res.data[0];
        });
    }

    // 列表展开收起
    private FnMinimize() {
      this.minimize = !this.minimize;
    }

    // 下拉框展开/收起
    private isSelectBolFn() {
      this.isSelectBol = !this.isSelectBol;
    }

    private getComponent_Pop() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent(
        'disasterJudgePop',
      );
      return component;
    }

    private mounted() {
      this.updateList();
      const self = this;
      this.messsageBus.off('ranges-refresh');
      this.messsageBus.on('ranges-refresh', (event: any) => {
        // 监听设置经验圈, 人口热力
        this.getComponent_Pop().load(0);
        if (this.$store.state.controlMoudle.mapCircleQueryType === 0) {
          if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
            const len = event.eventInfo.affactRadius.length - 1;
            self.curActiveTabIndex = [len];
          } else {
            self.viewRenderData.forEach((item: any, index: number) => {
              if (item.isChecked === true) {
                self.curActiveTabIndex.push(index);
              }
            });
          }
          self.loading = true;
          self.getData();
        }
      });
    }

    private created() {
      // 初始化参数
      this.opts.pageIndex = 1;
      this.selectData = this.rescueTeamHomeData.curStatisticsItem.subList;
      this.checkedOption = [this.rescueTeamHomeData.curNumItem.name];
      this.Mapkey = [this.rescueTeamHomeData.curNumItem.mapkey];
      this.moduleType = [this.rescueTeamHomeData.curNumItem.codeType];
      this.opts.typeArr = [this.rescueTeamHomeData.curNumItem.codeType];
      this.factoryKey = this.rescueTeamHomeData.curMapParam;
      this.unit = this.rescueTeamHomeData.unit;
      this.curActiveTabObj = this.rescueTeamHomeData.curActiveTab;
      if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
        this.rescueTeamHomeData.curActiveTab.map((item: any, index: number) => {
          if (item.checked) {
            this.opts.levelArr.push(item.level);
            this.curActiveTabIndex.push(index);
          }
        });
      } else if (this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp') {
        this.rescueTeamHomeData.curActiveTab.map((item: any, index: number) => {
          if (item.checked) {
            item.checked = false;
          }
        });
        this.rescueTeamHomeData.curActiveTab[this.rescueTeamHomeData.curActiveTab.length - 1].checked = true;
        this.opts.levelArr.push(this.rescueTeamHomeData.curActiveTab[this.rescueTeamHomeData.curActiveTab.length - 1].level);
        this.curActiveTabIndex.push(this.rescueTeamHomeData.curActiveTab.length - 1);
      }

      this.title =
        this.rescueTeamHomeData.curStatisticsItem.title.indexOf('分布') > 0
          ? this.rescueTeamHomeData.curStatisticsItem.title.replace('分布', '')
          : this.rescueTeamHomeData.curStatisticsItem.title;
      this.isQIantu = this.rescueTeamHomeData.curStatisticsItem.qiantuFlag
        ? this.rescueTeamHomeData.curStatisticsItem.qiantuFlag
        : '';
      this.FnListData(JSON.parse(JSON.stringify(this.opts)));
      // 数据来源
      this.FnSourceTypeCode();
    }

    private destroyed() {
      this.getComponent().clear();
      this.getComponent_new()._clearLayerByID(this.Mapkey[0], '');
    }
  }
</script>
<style lang='less' scoped>
    .DisasterPowerDispatch {
        width: 365px;
        height: 855px;
        padding: 5px 15px;
        border-radius: 5px;
        position: relative;

        .tooltip {
            background: rgba(71, 215, 162, 0.2);
            border: 1px #47d7a2 solid;
            border-radius: 5px;
            color: #fff;
            font-size: 24px;
            padding: 0 5px;
            display: inline-block;
            font-style: normal;
            margin-right: 10px;
        }

        * {
            margin: 0;
            padding: 0;
        }

        /* 统计总数 start*/

        .statisticCount {
            padding-left: 10px;
            margin: 5px 0 0 0;
            background: url('../../../../../../../assets/img/halfScreen/halflist/totalbg.png') 0 0 no-repeat;
            background-size: 100% 100%;

            li {
                list-style: none;
                cursor: pointer;
                color: #ffffff;
                font-weight: bolder;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                span {
                    cursor: pointer;
                    margin: 0 10px;
                    color: yellow;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
            }
        }

        .loading {
            color: #fff;
            background: url(../../../../../../../assets/img/halfScreen/halflist/loading.gif) no-repeat 33px 255px;
            color: #d2e1ec;
            height: 100%;

            p {
                padding-left: 5px;
                margin: 0;
                transform: translateY(-8px);
            }

            center {
                margin-top: 120%;
            }
        }

        /* 统计列表样式  start*/

        .statisticList {
            padding-top: 5px;

            &_li {
                display: flex;
                justify-content: space-between;
                color: #ffffff;
                background: url('../../../../../../../assets/img/halfScreen/halflist/listbg.png')
                    no-repeat -5px 50%;
                background-size: 100% 100%;
                padding: 10px;
                box-sizing: border-box;
                margin: 5px 0;
                cursor: pointer;

                &.checkSty,
                &:hover {
                    background-image: url('../../../../../../../assets/img/halfScreen/halflist/listbghover.png');
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
            background: url('../../../../../../../assets/img/default/panel/toBack.png') no-repeat 0px 70%;
            background-size: 100% 100%;

            &:hover {
                background-image: url('../../.././../../../../assets/img/default/panel/toBack_h.png');
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
        .listDistrict-flex-box {
            display: block;
            width: 100%;

            .selcetIconTop {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../../../../assets/img/halfScreen/halflist/select2bg.png') no-repeat;
                background-size: 100% 100%;
                margin: 5px 5px 0 0;
                cursor: pointer;
            }

            .selcetIconBot {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../../../../assets/img/halfScreen/halflist/selcet1bg.png') no-repeat;
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
            background: url(../../../../../../../assets/img/halfScreen/halflist/selcetHoverbg.png) no-repeat;
            background-size: 100% 100%;
            color: #3cc0ec;
            margin: 10px 0;

            .selcetIconTop {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../../../../assets/img/halfScreen/halflist/select2bg.png') no-repeat;
                background-size: 100% 100%;
                margin: 5px 5px 0 0;
                cursor: pointer;
            }

            .selcetIconBot {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../../../../assets/img/halfScreen/halflist/selcet1bg.png') no-repeat;
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

        .selectList {
            height: 319px !important;
            position: absolute;
            top: 164px;
            z-index: 20;
            background-color: #071022 !important;
            box-shadow: 4px 6px 16px 0px #001931;
            background: url('../../../../../../../assets/img/halfScreen/eventAndTopics/select_bg.png') no-repeat;
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
                    background-image: linear-gradient(180deg,
                    rgba(249, 216, 72, 0.54) 0%,
                    rgba(243, 177, 61, 0.54) 100%),
                    linear-gradient(#061418, #061418);
                    background-blend-mode: normal, normal;
                    box-shadow: 0px 2px 4px 0px rgba(95, 59, 16, 0.45);
                    border-radius: 3px;
                    border: solid 1px #fbe663;
                    opacity: 0.8;
                    color: #fefefe;
                }

                li:nth-of-type(2) {
                    background-image: linear-gradient(-3deg,
                    #357ac1 0%,
                    rgba(72, 161, 204, 0.29) 53%,
                    rgba(91, 199, 214, 0.55) 100%),
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
            content: '';
            background: url(../../../../../../../assets/img/halfScreen/halflist/titlexian.png) 50% 0 no-repeat;
            // background: url(../../../../../../../assets/img/halfScreen/halflist/titlebg.png) 50% 0 no-repeat;
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
            background: url('../../../../../../../assets/img/halfScreen/halflist/open.png') 50% 50% no-repeat;
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

    .listBoxScrollbar {
        overflow: hidden;
        overflow-y: scroll;
    }

    .listBoxSingle {
        &_li {
            cursor: pointer;
            color: #ffffff;
            padding: 10px 0px;
            margin: 10px 0 0 0;
            background: url('../../../../../../../assets/img/halfScreen/halflist/boxListBgIcon.png') no-repeat 0 0;
            background-size: 100% 100%;

            .teamName {
                font-family: MicrosoftYaHei;
                font-weight: normal;
                font-stretch: normal;
                color: #e8f4fe;
                padding-bottom: 10px;
            }

            .teamDistance {
                font-weight: normal;
                color: #e8f4fe;

                font {
                    font-family: Impact;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 1;
                    color: #27e8ff;
                    padding-right: 10px;
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
            background: url(../../../../../../../assets/img/halfScreen/halflist/listbghover.png) no-repeat;
        }
    }
</style>
<style lang='less'>
    .DisasterPowerDispatch .el-scrollbar__bar.is-vertical > div {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }

    .DisasterPowerDispatch .el-scrollbar__thumb:hover {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }

    /*修改滚动条样式*/
    .listBoxScrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        /**/
    }

    .listBoxScrollbar::-webkit-scrollbar-thumb {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
        border-radius: 5px;
    }

    .listBoxScrollbar::-webkit-scrollbar-thumb:hover {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }

    .listDistrict-input-content .el-input--suffix .el-input__inner {
        padding-right: 45px;
    }
</style>


