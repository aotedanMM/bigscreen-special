<template>
    <div style="height: 100%;">
        <div class="listDistrict">
            <div class="listDistrict_title">
              <span class="f-tit-h2">{{ title }}列表</span>
              <i @click="FnMinimize" :class="minimize? 'panel_switch': 'panel_switch panel-switch-reverse'"></i>
            </div>
        
          <div v-show="minimize" style="height: calc(100% - 60px);">
            <!-- 输入框 -->
            <div class="listDistrict-flex-box">
              <div class="listDistrict-input">
                <div class="listDistrict-input-content">
                  <el-input class="csmMyInput" type="text" v-model.trim="keyWord" placeholder='请输入'>
                    <i slot="suffix"  class="iconSelf_search"></i>
                  </el-input>
                </div>
              </div>
            </div>
            <!-- 暂无数据 -->
            <div class="nodata"  v-if="!tableData.length">
                <img style="margin-top:-20%" src="../../../assets/img/default/panel/noData.png" alt srcset />
            </div>
            <!-- 表格有数据 -->
            <div v-show="tableData.length"  style="margin-bottom:5px; height: calc(100% - 40px);">
              <el-scrollbar class="cmp-scrollbar-y">
                <ul class="listBox">
                  <li class="f-txt-com"
                    v-for="(item, index) of tableData"
                    :key="index + 1"
                    @click="clickRow(item, index)"
                    @mouseenter="hoverRow(item,index)"
                    @mouseleave="hoverLeaveRow(item,index)">
                    <p class="labelTitle">
                      <i class="orderNum">{{(currentPage - 1) * pageSize + (index + 1)}}</i>
                      {{item.tag.name || '--'}}
                    </p>
                    <p class="labelcol1" v-show="title!=='影响区市'">
                      <font class="labelKey">
                        所属区市：
                      </font>
                      {{item.tag.xianName || '--'}}
                    </p>
                    <p class="labelcol1" v-show="title ==='影响区市'">
                      <font class="labelKey">
                        辖区乡镇：
                      </font>
                      <font class="labelNum">
                        {{(item.tag.xiangnumber >= 0 && item.tag.xiangnumber !== null) ? item.tag.xiangnumber : '--'}}
                      </font>
                    </p>
                    <p class="labelcol1">
                      <font class="labelKey">
                        人口：
                      </font>
                      <font class="labelNum">
                        {{(item.tag.pouplationNum>=0 && item.tag.pouplationNum!== null) ? ((item.tag.pouplationNum/ 10000).toFixed(2)) : '--' }}
                      </font> 
                      万
                    </p>
                    <p class="labelcol1">
                      <font class="labelKey">
                        密度：
                      </font>
                      <font class="labelNum">
                        
                        {{ ((item.tag.pouplationNum>=0) && (item.tag.arear)) ? (item.tag.pouplationNum / item.tag.arear * 1000000).toFixed(2) : '--'}}
                      </font> 
                      人 / km²
                    </p>
                  </li>
                </ul>
                <!-- 数据来源不再是人口热力，去掉，后期改为人口热力解开注释 -->
                <!-- <div class="felx_box_statistics" v-if="sourceTypeCodeObj && sourceTypeCodeObj.isShow">
                            <div class="f-txt-com">
                                <span>人口热力数据来源：{{(sourceTypeCodeObj && sourceTypeCodeObj.sourceData && sourceTypeCodeObj.sourceData.attrOrgin)||('暂无数据')}}</span>
                                <br />
                                <span>人口热力数据更新时间：{{(sourceTypeCodeObj && sourceTypeCodeObj.sourceData && sourceTypeCodeObj.sourceData.attrTime.split(' ')[0])||('暂无数据')}}</span>
                            </div>
                            <div class="f-txt-com">
                                <span>行政区划数据来源：{{(sourceTypeCodeObj1 && sourceTypeCodeObj1.sourceData && sourceTypeCodeObj1.sourceData.attrOrgin)||('暂无数据')}}</span>
                                <br />
                                <span>行政区划数据更新时间：{{(sourceTypeCodeObj1 && sourceTypeCodeObj1.sourceData && sourceTypeCodeObj1.sourceData.attrTime.split(' ')[0])||('暂无数据')}}</span>
                            </div>
                  </div> -->
              </el-scrollbar>
              <el-pagination v-if="total" 
                class="constomMyElPage constomMyElPageNew"
                small
                :pager-count="5"
                @current-change="currentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>  
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import filterUtil from '@/util/filter/FormatFilter';
@Component({
  name: 'MultiTable',
  components: {
  },
  // mixins: [
  //   filterUtil,
  // ],
})
export default class MultiTable extends Vue {
  // 组件标题
  @Prop({
    type: String,
    default() {
      return '';
    },
  }) private title?: string;
  // 父组件处理keyWord改变的方法
  @Prop({
    type: Function,
    default() {
      return {};
    },
  }) private handleKeywordChange?: any;
  @Prop({
    type: Array,
    default() {
      return [];
    },
  }) private tableData!: any;
  // 父组件处理行点击的方法
  @Prop({
    type: Function,
    default() {
      return {};
    },
  }) private clickHandler?: any;
  // 父组件处理行hover的方法
  @Prop({
    type: Function,
    default() {
      return {};
    },
  }) private hoverHandler?: any;
  // 父组件处理行hover leave的方法
  @Prop({
    type: Function,
    default() {
      return {};
    },
  }) private hoverLeaveHandler?: any;
  @Prop({
    type: Number,
    default() {
      return 5;
    },
  }) private pageSize?: number;
  @Prop({
    type: Number,
    default() {
      return 0;
    },
  }) private total?: number;
  // 父组件处理当前页改变的方法
  @Prop({
    type: Function,
    default() {
      return {};
    },
  }) private handleCurrentChange?: any;
  // 获取父级页面传过来的当前页页数
  @Prop({
    type: Number,
    default() {
      return 1;
    },
  })  private getParentCurrentPage?: number;
  // 传来数据来源
  @Prop({ default: '' }) private sourceTypeCodeObj?: any;
  // 传来数据来源行政区划
  @Prop({ default: '' }) private sourceTypeCodeObj1?: any;
  private currentPage: number = 1;
  private minimize = true; // 展开缩起的状态
  private keyWord  = ''; // 关键字

  @Watch('getParentCurrentPage')
  private parentPageNum(val: number) {
    this.currentPage = val;
  }
  @Watch('keyWord')
  private keywordChange(newVal: any, oldVal: any) {
    this.currentPage = 1;
    this.handleKeywordChange(newVal, oldVal);
  }
  private currentChange(curPage: number) {
    this.handleCurrentChange(curPage);
  }

  // 展开缩起
  private FnMinimize() {
    this.minimize = !this.minimize;
  }

  // 行点击
  private clickRow(item: any, index: number) {
    this.clickHandler(item, index);
  }

  // 行hover
  private hoverRow(item: any, index: number) {
    this.hoverHandler(item, index);
  }

  // 行hover leave
  private hoverLeaveRow(item: any, index: number) {
    this.hoverLeaveHandler(item, index);
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
    // width: 26px;
    // height: 26px;
    line-height: 23px;
  }
  .el-scrollbar {
    height: calc(100% - 40px) !important;
  }
</style>
