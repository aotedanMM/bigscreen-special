<template>
  <div>
    <div class="listDistrict popupPanelRight_bg" v-show="closeFlag">
      <div class="closed-container-box">
        <div class="listDistrict_title">
          <span class="f-tit-h2">{{ title }}</span>
          <i
            @click="FnMinimize"
            :class="
              minimize ? 'panel_switch' : 'panel_switch panel-switch-reverse'
            "
          ></i>
        </div>
      </div>
      <div v-show="minimize" class="listDistrict-content-box">
        <div class="listDistrict-flex-box">
          <div class="listDistrict-input">
            <div class="listDistrict-input-content">
              <el-input class="csmMyInput" type="text" v-model.trim="inputWord">
                <i slot="suffix" class="iconSelf_search"></i>
              </el-input>
            </div>
          </div>
          <div class="lestDistrict-select" v-if="SelectFlag">
            <el-select class="constomMySelect" v-model="selectSchoolClass" placeholder="请选择">
              <el-option
                style=" width:360px;"
                v-for="item in SelectClass"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <!-- 列表每一行-->
        <div class="nodata" v-if="noData === true || !listDataAll.length">
          <img
            style="margin-top:-20%"
            src="../../../assets/img/default/panel/noData.png"
            alt
            srcset
          />
        </div>
        <div v-show="!(noData === true || !listDataAll.length)" style="margin-bottom:5px; flex: 1;">
          <el-scrollbar class="cmp-scrollbar-y">
            <ul class="listBox">
              <li
                class="listBox_li f-txt-com"
                v-for="(item, index) in listDataAll"
                :key="index"
                @click="clickHandler(index)"
                @mouseenter="hoverHandler(index)"
                @mouseleave="hoverHandlerLeave"
              >
                <span
                  v-for="(field, key) in item.data"
                  :key="key"
                  :class="field.name"
                  class="tooltip"
                  @mouseenter="itmeMouse()"
                  @mouseleave="itemiMouout"
                  :title="(field.value + ',' + field.name) | FiltersCondition"
                  v-show="
                    ((field.name !== 'level' && $store.state.controlMoudle.mapCircleQueryType == 0) ||
                      $store.state.controlMoudle.mapCircleQueryType == 1) && (field.name !== '_distance' || $store.state.eventPushStore.eventId)
                  "
                >
                  <em class="typeTitles">{{ typeTitles[field.name] }}</em>
                  {{ (field.value + ',' + field.name) | FiltersCondition }}
                </span>
              </li>
            </ul>
            <!-- <div
              class="felx_box_statistics"
              v-if="dataResouce && dataResouce.isShow"
            >-->
            <!-- 需求要求取消这个字段 -->
            <div class="felx_box_statistics" v-if="false">
              <div class="f-txt-com">
                <span>
                  数据来源：{{
                  (dataResouce &&
                  dataResouce.sourceData &&
                  dataResouce.sourceData.attrOrgin) ||
                  '暂无数据'
                  }}
                </span>
                <br />
                <span>
                  数据更新时间：{{
                  (dataResouce &&
                  dataResouce.sourceData &&
                  dataResouce.sourceData.attrTime.split(' ')[0]) ||
                  '暂无数据'
                  }}
                </span>
              </div>
            </div>
          </el-scrollbar>
          <!-- 分页-->
          <!-- @size-change="handleSizeChange" -->
          <el-pagination
            v-if="noData === false || listDataAll.length === 0"
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
import store from '@/store/index';
export const vueBus: any = new Vue({ store });

@Component({
  name: 'AreaList',
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
              return parseFloat(objStr.val).toFixed(2) + 'km²';
            } else if (objStr.val === 'null') {
              return '暂无数据';
            } else {
              return parseFloat(objStr.val) + 'km²';
            }
            break;
          case 'popeleNum': // 人口数量
            if (
              objStr.val !== 'null' &&
              parseFloat(objStr.val) !== 0 &&
              objStr.val !== '暂无数据'
            ) {
              // const popeleNum = parseFloat(objStr.val) / 10000;
              const popeleNum = parseFloat(objStr.val);
              return popeleNum.toFixed(2) + '万人';
            } else if (objStr.val === 'null') {
              return '暂无数据';
            } else if (objStr.val === '暂无数据') {
              return '--';
            } else {
              return parseFloat(objStr.val) + '万人';
            }
            break;
          case '_distance': // 事发距离
            if (
              vueBus.$store.state.eventPushStore.eventLocation.geometry &&
              vueBus.$store.state.eventPushStore.eventLocation.EventType !==
                '10'
            ) {
              return '--';
            } else {
              if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
                return parseFloat(objStr.val).toFixed(2) + 'm';
              } else if (objStr.val === 'null') {
                return '暂无数据';
              } else {
                return parseFloat(objStr.val) + 'm';
              }
            }
            break;
          case 'location': // 事发距离
            if (
              vueBus.$store.state.eventPushStore.eventLocation.geometry &&
              vueBus.$store.state.eventPushStore.eventLocation.EventType !==
                '10'
            ) {
              return '--';
            } else {
              if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
                return parseFloat(objStr.val).toFixed(2) + 'm';
              } else if (objStr.val === 'null') {
                return '暂无数据';
              } else {
                return parseFloat(objStr.val) + 'm';
              }
            }
            break;
          case 'population': // 行政区划人口密度
            if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
              return parseFloat(objStr.val).toFixed(2) + '人/km²';
            } else if (objStr.val === 'null') {
              return '暂无数据';
            } else {
              return parseFloat(objStr.val) + '人/km²';
            }
            break;
          case 'level':
            if (objStr.val !== 'null') {
              if (objStr.val === '5') {
                return (objStr.val = 'Ⅴ');
              } else if (objStr.val === '6') {
                return (objStr.val = 'Ⅵ');
              } else if (objStr.val === '7') {
                return (objStr.val = 'Ⅶ');
              } else if (objStr.val === '8') {
                return (objStr.val = 'Ⅷ');
              } else if (objStr.val === '9') {
                return (objStr.val = 'Ⅸ');
              } else if (objStr.val === '10') {
                return (objStr.val = 'X');
              }
            }
            break;
          case 'dangerlevel':
            if (objStr.val !== 'null') {
              if (objStr.val === '4') {
                return (objStr.val = '小型');
              } else if (objStr.val === '3') {
                return (objStr.val = '中型');
              } else if (objStr.val === '2') {
                return (objStr.val = '大型');
              } else if (objStr.val === '1') {
                return (objStr.val = '特大型');
              } else {
                return (objStr.val = '暂无数据');
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
export default class AreaList extends Vue {
  // 计算属性
  get COMdata(): any {
    this.paginationObj.currentPage = 1;
    if (this.inputWord.length === 0 && this.selectSchoolClass.length === 0) {
      return this.getDataList;
    } else {
      return this.getFiltrateData;
    }
  }
  // 获取表格主体数据（输入框数据）
  private get getFiltrateData() {
    this.cacheListTotalData = JSON.parse(JSON.stringify(this.filtrateData)); // 这个地方是为了当搜索后，点击一行，可以找到源数据
    return this.filtrateData.map((item: any, index: number) => {
      const res = {
        data: [],
        style: {
          width: '0',
        },
      };
      // 设置索引
      (res.data as any).push({
        value: index + 1,
      });
      this.filexed.forEach((key: any, i: number) => {
        if (i) {
          (res.data as any).push({
            value: item[key],
            name: key,
          });
        }
      });
      return res;
    });
  }
  // 获取表格主体数据（原数据）
  private get getDataList() {
    this.cacheListTotalData = JSON.parse(JSON.stringify(this.listData)); // 把prop拿过来的源数据进行引用地址解引用，点击一行，可以找到源数据
    return this.listData.map((item: any, index: number) => {
      const res = {
        data: [],
        style: {
          width: '0',
        },
      };
      // 设置索引
      (res.data as any).push({
        value: index + 1,
      });
      this.filexed.forEach((key: any, i: number) => {
        if (i) {
          (res.data as any).push({
            value: item[key],
            name: key,
          });
        }
      });
      return res;
    });
  }
  // 定义分页的对应
  @Prop() public paginationObj!: any;
  // 对应的数据
  @Prop() public listData!: any[];
  // 对应后端接口树形
  @Prop() public filexed!: any;
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
  private listDataAll: any = []; // 当前页的表格数据
  private cacheListTotalData: any = []; // 当前分页的总数据
  private noData: any = true;
  private closeFlag: any = true;
  private indexActive: number = -1;
  private dataResouce: any = '';
  private typeTitles: any = {
    num: '',
    name: '',
    typecodeName: '类型 : ',
    level: '所在烈度区 : ',
    _distance: '距离 : ',
    safetylevel: '风险等级 : ',
    location: '距事发地 : ',
    dangerlevel: '险情等级 ：',
    distrctname: '行政区划 ：',
    seatype: '汽油类型 ：',
    seaname: '所属海域 ：',
    population: '人口密度：',
    popeleNum: '人口：',
    area: '面积：',
    address: '地址：',
  };
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

  // 筛选过滤
  private changeFiltrate(): void {
    const val: any[] = [this.inputWord, this.selectSchoolClass];
    this.filtrateData = [];
    if (val[0].length > 0 && val[1].length > 0 && val[1] !== 'all') {
      // 如果都有条件,且过滤不是全选
      for (const iterator of this.listData) {
        //       (iterator.typecode === val[1] || // 且typecode或者level 复合筛选
        // iterator.level === val[1]) 以前得判断
        if (
          iterator.name.includes(val[0]) && // 名字包含文本
          (iterator.typecodeName === val[1] || iterator.safetylevel === val[1]) // 且typecodeName或者safetylevel 复合筛选
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
          // if (iterator.typecode === val[1] || iterator.level === val[1]) {
          //   this.filtrateData.push(iterator);
          // }
          if (
            iterator.typecodeName === val[1] ||
            iterator.safetylevel === val[1]
          ) {
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

  private hoverHandler(index: number) {
    if (this.FnHoverItemEvent) {
      this.FnHoverItemEvent(
        this.cacheListTotalData[
          index +
            (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize
        ],
      );
    }
  }
  private hoverHandlerLeave() {
    if (this.FnHoverItemEvent) {
      this.FnMouserLeave();
    }
  }

  private FnMinimize() {
    this.minimize = !this.minimize;
  }
  private clickHandler(index: number) {
    this.itemClick(
      this.cacheListTotalData[
        index +
          (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize
      ],
    );
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
  private itmeMouse(val: any) {
    this.hover = setTimeout(() => {
      return false;
    }, 1000);
  }

  private FnClose() {
    this.closeFlag = !this.closeFlag;
  }

  private itemiMouout() {
    this.hover = null;
  }

  private created() {
    this.handleCurrentChange();
    this.paginationObj.pageSize = 10;
    this.dataResouce = this.sourceTypeCodeObj;
  }
}
</script>
<style lang="less" scoped>
@import url('../../../assets/css/decisionSupport/AreaList.less');
.listDistrict {
  display: flex;
  flex-direction: column;
  .listDistrict-content-box {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
.listDistrict_title {
  color: #67e1fb;
  letter-spacing: 1px;
  font-weight: normal;
  line-height: 60px;
  display: flex;
  &:after {
    content: '';
    background: url(../../../assets/img/halfScreen/halflist/titlexian.png) 50% 0
      no-repeat;
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
    background: url('../../../assets/img/halfScreen/halflist/open.png') 50% 50%
      no-repeat;
    transition: transform 0.3s;
  }
  .panel_switch.panel-switch-reverse {
    transform: scale(1, -1);
  }
}
/deep/.el-scrollbar {
  height: calc(100% - 37px) !important;
  display: table;
  width: 100%;
}
</style>
