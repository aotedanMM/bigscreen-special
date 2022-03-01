<template>
  <div class="listDistrict popupPanelRight_bg" v-show = "closeFlag">
    <!-- 头的位置-->
    <div class="listDistrict_hd">
      <span class="listDistrict_close" @click="FnClose()">X</span>
      <div class="listDistrict_title">
       <span class="f-tit-h2">{{ title }}</span>
      </div>
    </div>
    <div class="listDistrict-flex-box">
      <div class="listDistrict-input">
        <div class="listDistrict-input-content">
            <!-- <input type="text" v-model.trim="inputWord" /> -->
             <el-input class="csmMyInput" type="text" v-model.trim="inputWord" >
            <i slot="suffix"  class="iconSelf_search"></i>
          </el-input> 

        </div>
        <!-- <div class="listDistrict-icon">
          <i class="el-icon-search"></i>
        </div> -->
      </div>
      <div class="lestDistrict-select" v-if="SelectFlag">
        <el-select class="constomMySelect"  v-model="selectSchoolClass" placeholder="请选择">
          <el-option
            v-for="item in SelectClass"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    
    <!-- 列表di位置-->
    <div class="headBox">
      <span class="f-tit-h2" v-for="(each, index) in header" :key="index">
        {{ each[filexed[index]] }}
      </span>
    </div>
    <!-- 列表每一行-->
    <div class="nodata" v-if="noData">暂无数据</div>
    <ul class="listBox" v-if="!noData">
      <li class="listBox_li"
        v-for="(each, index) in listDataAll"
        :key="index"
        @click="itemClick(each, index)"
        :class="[index % 2 !== 0 ? 'doubleLi' : '', listCheck === index ? 'checkSty' : '']"
      >
        <!-- 序号开始 -->
        <span
          v-for="(item, indexItmeNum) in filexed"
          :key="indexItmeNum"
          @mouseenter="itmeMouse(each, $event)"
          @mouseleave="itemiMouout"
          :class="{ indexSpan: item === 'num' }"
          v-show="item === 'num'"
        >
          {{
            (paginationObj.currentPage - 1) * paginationObj.pageSize + index + 1
          }}
        </span>
        <!-- 序号结束 -->

        <!-- 名称开始 -->
        <span
          v-for="(item, indexItmeName) in filexed"
          :key="indexItmeName + 'indexItmeName'"
          @mouseenter="itmeMouse(each, $event)"
          @mouseleave="itemiMouout"
          :class="{ indexSpan: item === 'num' }"
          v-show="item === 'name'"
        >
          {{ each[item] }}
        </span>
        <!-- 名称结束 -->
        <!-- 类型开始 -->
        <span
          v-for="(item, indexItmeArea) in filexed"
          :key="indexItmeArea + 'indexItmeArea'"
          @mouseenter="itmeMouse(each, $event)"
          @mouseleave="itemiMouout"
          :class="{ indexSpan: item === 'num' }"
          v-show="item === 'type'"
        >
          {{ each[item] }}
        </span>
        <!-- 类型结束 -->
        <!-- 距离开始 -->
        <span
          v-for="(item, indexItmeLocation) in filexed"
          :key="indexItmeLocation + 'indexItmeLocation'"
          @mouseenter="itmeMouse(each, $event)"
          @mouseleave="itemiMouout"
          :class="{ indexSpan: item === 'num' }"
          v-show="item === 'distance'"
        >
          {{ each[item] | FiltersLocation }}
        </span>
        <!-- 距离结束 -->
        <!-- 受损开始 -->
        <span
          v-for="(item, indexItmePopeleNum) in filexed"
          :key="indexItmePopeleNum + 'indexItmePopeleNum'"
          @mouseenter="itmeMouse(each, $event)"
          @mouseleave="itemiMouout"
          :class="{ indexSpan: item === 'num' }"
          v-show="item === 'damage'"
        >
          {{ each[item] }}
        </span>
        <!-- 受损结束 -->
        <!-- 恢复开始 -->
        <span
          v-for="(item, indexHappenWhere) in filexed"
          :key="indexHappenWhere + 'indexHappenWhere'"
          @mouseenter="itmeMouse(each, $event)"
          @mouseleave="itemiMouout"
          :class="{ indexSpan: item === 'num' }"
          v-show="item === 'restore'"
        >
          {{ each[item] === '0' ? '未恢复' : each[item] === '1' ? '已恢复' : '暂无数据' }}
        </span>
        <!-- 恢复结束 -->
      </li>
    </ul>
    <!-- <div></div> -->
    <!-- 分页-->
    <!-- <div> -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="paginationObj.currentPage"
        :page-size="paginationObj.pageSize"
        layout="prev, pager, next, jumper"
        :total="paginationObj.total"
      >
      </el-pagination>
    <!-- </div> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'AreaList',
  filters: {
    // 过滤面积
    FiltersArea(val: any): any {
      if (val === '' || val === undefined || val === null || val === 0) {
        return '暂无数据';
      } else {
        return Math.floor(val * 100) / 100 + '平方公里';
      }
    },
    // 过滤距事发地距离
    FiltersLocation(val: any): any {
      if (val === '' || val === undefined || val === null) {
        return '暂无数据';
      } else {
        return Math.floor(val * 100) / 100 + '千米';
      }
    },
    // 过滤人口数量
    FiltersPopeleNum(val: any): any {
      if (val === '' || val === undefined || val === null || val === 0) {
        return '暂无数据';
      } else {
        return val + '人';
      }
    },
  },
})
export default class AreaList extends Vue {
  // 定义分页的对应
  @Prop() public paginationObj!: any;
  // 定义对应的表头信息
  @Prop() public header!: any;
  // 对应的数据
  @Prop() public listData!: any;
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
  // 点击事件
  @Prop() private listCheck: any;
  // 定义 接收学校分类的信息
  @Prop() private SelectClass: any;
  // 定义 学校分类下拉栏是否显示
  @Prop({default: false}) private SelectFlag: any;
  // 定义 input关键字
  private inputWord: any = '';
  // 定义 通过inputWord 查出来的数据
  private inputData: any = [];
  // hover 延迟执行
  private hover: any;
  // 定义 下拉确定的学校分类信息
  private selectSchoolClass: any = '';
  // 定义 下拉菜单后重组的数组
  private selectSchoolClassData: any = [];
  private listDataAll: any = [];
  private noData: any = true;
  private closeFlag: any = true;
  private handleSizeChange() {
    this.listDataAll = [];
  }

  @Watch('inputWord')
  private FnInputData(): void {
    this.inputData = [];
    for (const iterator of this.listData) {
      if (iterator.name.includes(this.inputWord)) {
        this.inputData.push(iterator);
      }
    }
  }

  @Watch('selectSchoolClass')
  private FnSelectSchoolData(): void {
    this.selectSchoolClassData = [];
    for (const iterator of this.listData) {
      if (iterator.typecode === this.selectSchoolClass || iterator.level === this.selectSchoolClass) {
        this.selectSchoolClassData.push(iterator);
      }
    }
  }

  @Watch('listData')
  private FnlistData(): void {
    this.selectSchoolClass = '';
    this.noData = false;
    this.inputWord = '';
    this.closeFlag = true;
  }

  // 计算属性
  get COMdata(): any {
    if (this.inputWord !== '') {
      return this.inputData;
    } else if (this.selectSchoolClass !== '') {
      return this.selectSchoolClassData;
    } else {
      return this.listData;
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

  private itmeMouse() {
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
  }

}
</script>
<style lang="less" scoped>
@import url('../../../assets/css/decisionSupport/AreaList.less');
</style>
