<template>
    <div>
        <div class="listDistrict" v-show="closeFlag">
            <div class="listDistrict_title">
              <span class="f-tit-h2">{{ title }}列表</span>
              <i @click="FnMinimize" :class="minimize? 'panel_switch': 'panel_switch panel-switch-reverse'"></i>
            </div>
            <div v-show="minimize">
                <div class="listDistrict-flex-box">
                    <div class="listDistrict-input">
                        <div class="listDistrict-input-content">
                          <el-input class="csmMyInput" type="text" v-model.trim="inputWord" placeholder='请输入'>
                              <i slot="suffix"  class="iconSelf_search"></i>
                          </el-input>
                        </div>
                    </div>
                </div>
                <!-- 列表每一行-->
                <div class="nodata"  v-if="noData === true || !listDataAll.length">
                    <img style="margin-top:-20%" src="../../../assets/img/default/panel/noData.png" alt srcset />
                </div>
                <div v-show="!(noData === true || !listDataAll.length)"  style="margin-bottom:5px;">
                    <el-scrollbar class="cmp-scrollbar-y">
                      <!-- <ul class="listBox"  v-if="title === '乡镇'">
                        <li class="f-txt-com"
                            v-for="(item, index) in listDataAll"
                            :key="index"
                            @click="clickHandler(item, index, 'town')"
                            @mouseenter="hoverHandler(index,item.id)"
                            @mouseleave="hoverHandlerLeave">
                          <p class="labelTitle"><i class="orderNum">{{(paginationObj.currentPage - 1 )* 10 + (index + 1)}}</i>{{item.name}}</p>
                          <p class="labelcol1" v-show="($store.state.controlMoudle.mapCircleQueryType == 1)"><font class="labelKey">所处烈度区：</font>{{item.level}}</p>
                          <p class="labelcol1" v-show="isShowNew"><font class="labelKey">人口：</font><font class="labelNum">{{item.peopleNum}}</font> 万</p>
                          <p class="labelcol1" v-show="isShowNew"><font class="labelKey">面积：</font><font class="labelNum">{{item.area}}</font> 人 / km²</p>
                        </li>
                      </ul> -->
                      <ul class="listBox">
                        <li class="f-txt-com"
                            v-for="(item, index) in listDataAll"
                            :key="index"
                            @click="clickHandler(item, index, sourceObj)"
                            @mouseenter="hoverHandler(index,item.id)"
                            @mouseleave="hoverHandlerLeave">
                          <p class="labelTitle"><i class="orderNum">{{(paginationObj.currentPage - 1 )* 10 + (index + 1)}}</i>{{item.name}}</p>
                          <!-- <p class="labelcol1" v-show="($store.state.controlMoudle.mapCircleQueryType == 1)"><font class="labelKey">所处烈度区：</font>{{item.level}}</p> -->
                          <!-- <p class="labelcol1"><font class="labelKey">距离：</font><font class="labelNum">{{item.distance}}</font> <a v-if="item.distance!=='暂无数据'">km</a></p> -->
                          <p class="labelcol1" v-show="sourceObj.name!=='区县'"><font class="labelKey">所属区市：</font>{{item.xianname}}</p>
                          <p class="labelcol1" v-show="sourceObj.name ==='区县'"><font class="labelKey">辖区乡镇：</font><font class="labelNum">{{item.xiangnumber}}</font></p>
                          <p class="labelcol1" v-show="sourceObj.name!=='村庄'" ><font class="labelKey">人口：</font><font class="labelNum">{{item.peopleNum}}</font> 万</p>
                          <p class="labelcol1" v-show="sourceObj.name!=='村庄'" ><font class="labelKey">密度：</font><font class="labelNum">{{item.peopleDensity}}</font> 人 / km²</p>
                          <!-- <p class="labelcol1" v-show="$store.state.eventPushStore.eventLocation.EventType === '10'" ><font class="labelKey">风险等级：</font><font class="labelNum">{{getdangerLevel(item.riskLevel) || getdangerLevel(riskLevelname) || '暂无数据'}}</font></p> -->
                        </li>
                      </ul>
                        <div class="felx_box_statistics" v-if="dataResouce && dataResouce.isShow">
                            <div class="f-txt-com">
                                <span>人口热力数据来源：{{(dataResouce && dataResouce.sourceData && dataResouce.sourceData.attrOrgin)||('暂无数据')}}</span>
                                <br />
                                <span>人口热力数据更新时间：{{(dataResouce && dataResouce.sourceData && dataResouce.sourceData.attrTime.split(' ')[0])||('暂无数据')}}</span>
                            </div>
                            <div class="f-txt-com">
                                <span>行政区划数据来源：{{(dataResouce1 && dataResouce1.sourceData && dataResouce1.sourceData.attrOrgin)||('暂无数据')}}</span>
                                <br />
                                <span>行政区划数据更新时间：{{(dataResouce1 && dataResouce1.sourceData && dataResouce1.sourceData.attrTime.split(' ')[0])||('暂无数据')}}</span>
                            </div>
                            <!-- <div class="f-txt-com" v-show="isShowNew">
                                <span>房屋数据来源：{{(dataResouce2 && dataResouce2.sourceData && dataResouce2.sourceData.attrOrgin)||('暂无数据')}}</span>
                                <br />
                                <span>房屋数据更新时间：{{(dataResouce2 && dataResouce2.sourceData && dataResouce2.sourceData.attrTime.split(' ')[0])||('暂无数据')}}</span>
                            </div> -->
                        </div>
                    </el-scrollbar>
                    <!-- 分页-->
                    <!-- @size-change="handleSizeChange" -->
                    <el-pagination v-if="noData === false || listDataAll.length === 0" 
                                   class="constomMyElPage"
                                   small
                                   :pager-count="5"
                                   @current-change="handleCurrentChange"
                                   :current-page.sync="paginationObj.currentPage"
                                   :page-size="paginationObj.pageSize"
                                   layout="prev, pager, next"
                                   :total="paginationObj.total"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { dataSourcesServer } from '@/api/installServer';
import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
@Component({
  name: 'AreaListdistrict',
  filters: {
    // 条件过滤
    FiltersCondition(val: any): any {
      const arrStr = val.split(',');
      const objStr = {
        val: arrStr[0],
        name: arrStr[1],
      };
      if (objStr.name !== 'undefined') {
        switch (objStr.name) {
          case 'area':
            if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
              return parseFloat(objStr.val).toFixed(2);
            } else if (objStr.val === 'null') {
              return '暂无数据';
            } else {
              return parseFloat(objStr.val);
            }
            break;
          case 'peopleNum': // 人口数量
            if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0 && objStr.val !== '暂无数据') {
               return objStr.val;
            } else if (objStr.val === 'null') {
              return '暂无数据';
            } else {
              return parseFloat(objStr.val);
            }
            break;
          case 'distance': // 事发距离
            if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
              return parseFloat(objStr.val).toFixed(2) + 'km';
            } else if (objStr.val === 'null') {
              return '暂无数据';
            } else {
              return parseFloat(objStr.val) + 'km';
            }
            break;
          case 'population': // 行政区划人口密度
            if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
              return parseFloat(objStr.val).toFixed(2);
            } else if (objStr.val === 'null') {
              return '暂无数据';
            } else {
              return parseFloat(objStr.val);
            }
            break;
          case 'level':
              if (objStr.val !== 'null') {
                  if (objStr.val === '5') {
                      return objStr.val = 'Ⅴ';
                  } else if (objStr.val === '6') {
                      return objStr.val = 'Ⅵ';
                  } else if (objStr.val === '7') {
                      return objStr.val = 'Ⅶ';
                  } else if (objStr.val === '8') {
                      return objStr.val = 'Ⅷ';
                  } else if (objStr.val === '9') {
                      return objStr.val = 'Ⅸ';
                  } else if (objStr.val === '10') {
                      return objStr.val = 'X';
                  }
              }
              break;
          default:
            return objStr.val;
            break;
        }
      } else {
        return objStr.val;
      }
    },
  },
})
export default class AreaListdistrict extends Vue {
  @Prop() public sourceObj: any;
  // 计算属性
  get COMdata(): any {
    this.paginationObj.currentPage = 1;
    if (this.inputWord.length === 0 && this.selectSchoolClass.length === 0) {
      this.cacheListTotalData = JSON.parse(JSON.stringify(this.listData));
      if (this.listData.length > 1) {
        const j = this.listData.length;
        for (let i = 0; i < j; i++) {
              for (let k = i + 1; k < j; k++) {
                if (this.listData[k]) {
                  if (this.listData[i].name === this.listData[k].name) {
                      // 第一个等同于第二个，splice方法删除第二个
                      this.listData[i].level = this.listData[i].level + '，' + this.listData[k].level;
                      this.listData.splice(k, 1);
                      k--;
                  }
                }
              }
        }
        return this.listData;
      } else {
        return this.listData;
      }
    } else {
      this.cacheListTotalData = JSON.parse(JSON.stringify(this.filtrateData));
      return this.filtrateData;
    }
  }

  // 获取表格主体数据（输入框数据）
  private get getFiltrateData() {
     // 这个地方是为了当搜索后，点击一行，可以找到源数据
    return this.filtrateData.map((item: any, index: number) => {
      const res = {
        data: [],
        style: {
          width: '0',
        },
      };
      return res;
    });
  }
  // 定义分页的对应
  @Prop() public paginationObj!: any;
  // 对应的数据
  @Prop() public listData!: any[];
  // 前端分页  还是后端分页  为true，则是前端分支，
  @Prop() public IsPagination: boolean = true;
  // 标题传入
  @Prop() public title: any;
  // 绑定所有的事件的信息
  @Prop() public eventObject: any;
  // 发送事件
  @Prop() private itemClick: any;
  // 定义 接收学校分类的信息
  @Prop() private SelectClass: any;
  // 定义 学校分类下拉栏是否显示
  @Prop({ default: false }) private SelectFlag: any;
  // 定义 筛选的关键字在第几个索引
  @Prop({ default: 1 }) private searchKeyIndex: any;
  // 定义 暴漏hover联动GIS的方法
  @Prop({ default: '' }) private FnHoverItemEvent: any;
  // 鼠标移出销毁方法
  @Prop() private FnMouserLeave: any;
  // 传来数据来源
  @Prop({ default: '' }) private sourceTypeCodeObj: any;
  // 传来数据来源行政区划
  @Prop({ default: '' }) private sourceTypeCodeObj1: any;
  // 传来房屋数据来源
  @Prop({ default: '' }) private sourceTypeCodeObj2: any;
  // 最小化判断
  private minimize: any = true;
  // 定义 input关键字
  private inputWord: string = '';
  // 定义 下拉确定的分类信息
  private selectSchoolClass: string = '';
  // 定义 通过inputWord 查出来的数据
  private filtrateData: any = [];
  // hover 延迟执行
  private hover: any;
  private headIndex: any = '';
  private listDataAll: any = []; // 当前页的表格数据
  private cacheListTotalData: any = []; // 当前分页的总数据
  private noData: any = true;
  private listBgClick: any = '';
  private closeFlag: any = true;
  private indexActive: number = -1;
  private dataResouce: any = '';
  private dataResouce1: any = '';
  private dataResouce2: any = '';
  private isShowNew: any = true;
  private riskLevelname: any = '';

  @Watch('inputWord')
  public getInputWordListData(val: string) {
    if (val.length === 0) {
      this.$nextTick(() => {
        this.$store.commit('panelPositionChangeModule/setHalflistHeight');
      });
    }
    this.changeFiltrate();
  }
  @Watch('selectSchoolClass')
  public getSelectSchoolClassListData() {
    this.changeFiltrate();
    this.messsageBus.emit('selectChange');
  }

   // 获取等级
  private getdangerLevel(level: any) {
    let levelname: any = '';
    switch (level) {
        case '0':
        case 'low':
        levelname = '低风险';
        break;
        case '1':
        case 'middle':
        levelname = '中风险';
        break;
        case '2':
        case 'high':
        levelname = '高风险';
        break;
        default:
        levelname = null;
        break;
      }
    return levelname;
  }

  // 筛选过滤
  private changeFiltrate(): void {
    const val: any[] = [this.inputWord, this.selectSchoolClass];
    this.filtrateData = [];
    if (val[0].length > 0 && val[1].length > 0 && val[1] !== 'all') {
      // 如果都有条件,且过滤不是全选
      for (const iterator of this.listData) {
        if (
          iterator.name.includes(val[0]) && // 名字包含文本
          (iterator.typecode === val[1] || // 且typecode或者level 复合筛选
            iterator.level === val[1])
        ) {
          this.filtrateData.push(iterator);
        }
      }
    } else if (val[1].length > 0 && val[0].length === 0) {
      // 如果选择框有条件
      if (val[1] === 'all') {
        // 判断是不是all 全选处理
        this.filtrateData = JSON.parse(JSON.stringify(this.listData));
      } else {
        // 单个处理
        for (const iterator of this.listData) {
          if (iterator.typecode === val[1] || iterator.level === val[1]) {
            this.filtrateData.push(iterator);
          }
        }
      }
    } else if (val[0].length > 0 && (!val[1] || val[1] === 'all')) {
      // 只有input有值
      for (const iterator of this.listData) {
        if (iterator.name.includes(val[0])) {
          this.filtrateData.push(iterator);
        }
      }
    } else {
      // 都没有
      this.cacheListTotalData = JSON.parse(JSON.stringify(this.listData));
    }
  }
  @Watch('listData')
  private FnlistData(val: any): void {
    this.minimize = false;
    this.selectSchoolClass = '';
    this.noData = false;
    this.inputWord = '';
    this.closeFlag = true;
    this.$nextTick((): void => {
      this.minimize = true;
    });
    this.handleCurrentChange();
  }

  private hoverHandler(index: number, id: any) {
    if (this.FnHoverItemEvent) {
      this.FnHoverItemEvent(
        this.cacheListTotalData[
        index +
        (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize
          ],
      );
    }
    // 水库溃坝鼠标划过有hover效果
    // if (!this.isShowNew) {
    //   this.getComponent1().addHover('district_point_cun', id);
    // }
  }

  // 村庄划过效果
  private getComponent1() {
      let component1 = null;
      const factory1 = this.$ioc.resolve('GISFactory-map');
      if (factory1) {
          component1 = factory1.commonFactory.getComponent('commonInteract');
      }
      return component1;
  }

  private hoverHandlerLeave() {
    // return ;
    if (this.FnHoverItemEvent) {
      this.FnMouserLeave();
    }
     // 水库溃坝鼠标划过有hover效果
    // if (!this.isShowNew) {
    //   this.getComponent1().clearHover();
    // }
  }
  private FnMinimize() {
    this.minimize = !this.minimize;
  }
  private clickHandler(item: any, index: number, type: any) {
    // 除水库溃坝外其他有下钻
    // if (this.isShowNew) {
    this.itemClick(
        this.cacheListTotalData[
        index +
        (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize
          ],
      );
    this.listBgClick = index;
      // if (type === 'town') {
      //   this.getComponent().openPopup('Town', item.id);
      // } else {
      //   this.getComponent().openPopup('County', item.id);
      // }
    // }
  }

  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private eventTypeShuiku() {
    const eventType: any = this.$store.state.eventPushStore.eventLocation.EventType;
    if ((eventType === '20') || (eventType === 20) || (eventType === '17') || (eventType === 17)) {
      // 当前是水库溃坝类型，部分数据不展示
      this.isShowNew = false;
    } else {
      this.isShowNew = true;
    }
  }

  @Watch('COMdata')
  private handleCurrentChange() {
    // 前端分页
    if (this.IsPagination) {
      this.frentPag();
    } else {
      // 后端分页
      this.backPag();
    }
  }
  @Watch('$store.state.controlMoudle.mapCircleQueryType')
  private FnMapCircleQuery(): void {
    console.log(
      '当前烈度圈，0经验圈，1烈度圈',
      this.$store.state.controlMoudle.mapCircleQueryType,
    );
  }
  private frentPag() {
    this.paginationObj.total = this.COMdata.length;
    this.listDataAll = this.COMdata.slice(
      (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize,
      this.paginationObj.pageSize * this.paginationObj.currentPage,
    );

    // 前端分页处理
  }

  private backPag() {
    // 后端分页处理，直接调用某一个接口
    this.listDataAll = [];
  }
  private FnClose() {
    this.closeFlag = !this.closeFlag;
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('districtComp');
    return component;
  }


  private created() {
    this.eventTypeShuiku();
    this.handleCurrentChange();
    this.FnMapCircleQuery();
    this.paginationObj.pageSize = 10;
    this.dataResouce = this.sourceTypeCodeObj;
    this.dataResouce1 = this.sourceTypeCodeObj1;
    this.dataResouce2 = this.sourceTypeCodeObj2;
    this.riskLevelname = sessionStorage.getItem('riskLevel');

  }
}
</script>
<style lang="less" scoped>
  @import url('../../../assets/css/decisionSupport/AreaList.less');
    .listDistrict_title {
    color: #67e1fb;
    letter-spacing: 1px;
    font-weight: normal;
    line-height: 60px;
    display: flex;
    &:after{
        content: '';
        background: url(../../../assets/img/halfScreen/halflist/titlexian.png) 50% 0 no-repeat;
        position: absolute;
        width: 100%;
        height: 23px;
        top: 54px;
        left: 0;
    }
    .panel_switch{
          width: 34px;
        height:29px;
        background-size: 100% 100%;
        position: absolute;
        right: 0px;
        top: 15px;
        cursor: pointer;
        background: url("../../../assets/img/halfScreen/halflist/open.png") 50% 50% no-repeat;
        transition: transform .3s;
    }      
    .panel_switch.panel-switch-reverse{
      transform: scale(1,-1);
    }
  }
  .labelTitle {
    font-family: MicrosoftYaHei;
    font-stretch: normal;
    color: #e8f4fe;
    padding-top:10px;
    font-size:26px;
    margin-bottom:10px;
  }
  .labelKey {
      font-weight: normal;
      color: rgb(128, 173, 207);
  }
  .labelNum {
      font-size:28px;
      height: 24px;
      line-height:24px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 2px;;
      color: #27e8ff;
      padding:0 8px;
  }
  .orderNum{
    background:rgba(71,215,162,0.2);
    border:1px #47d7a2 solid;
    border-radius:5px;
    color:#fff;
    font-size:24px;
    padding:0 5px;
    display: inline-block;
    font-style: normal;
    margin-right:10px;
  }
</style>
