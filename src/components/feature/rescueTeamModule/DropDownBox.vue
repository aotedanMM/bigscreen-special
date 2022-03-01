<!--下拉框弹框-->
<template>
  <div class="listDistrict-option">
    <el-checkbox
      class="constomMyCheckbox"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <!-- :min="1" -->
    <el-checkbox-group
      v-model="checkedOption"
      @change="handleCheckedChange"
    >
      <el-checkbox
        class="constomMyCheckbox"
        v-for="item in selectData"
        :label="item.name"
        :key="item.id"
        :title="item.name"
        >{{ item.name }}</el-checkbox
      >
    </el-checkbox-group>
    <ul class="selectBtn">
      <li @click="canclehandle">关闭</li>
    </ul>
  </div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import { districtServer } from '@/api/installServer';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { dataSourcesServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
@Component({
  name: 'DropDownBox',
  components: {},
})
export default class DropDownBox extends Vue {
  // 下拉框选项数据处理

  get selectArr(): any {
    const res: any = [];
    this.selectData.map((item: any, index: number) => {
      (res as any).push(item.name);
    });
    return res;
  }
  // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
  @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法
  @Prop() private selectData: any; // 全部数据
  @Prop() private resetSelect?: any; // 重置选中的数据

  //   @Prop() public rescueTeamHomeData: any;
  private viewResData: any = {
    total: '0',
  };
  private loading: boolean = true;
  private viewRenderData: any = [];
  // 定义 input关键字
  private inputWord: string = '';
  private listDataAll: any = [
    {
      name: '矿山大队八角中队',
      typecode: '消防',
      lon: 121.117288,
      lat: 37.606615,
      id: 'RESSL00152',
      num: 1,
      level: '50',
      _distance: 5.73,
    },
    {
      name: '烟台经济技术开发区八角消防救援站',
      typecode: '消防',
      lon: 121.119069,
      lat: 37.606119,
      id: 'YTXFZ00020',
      num: 2,
      level: '50',
      _distance: 5.77,
    },
  ];
  private noData: any = true;
  private minimize: any = true;
  private factoryKey = '';
  private isSelectBol: boolean = false;
  private isSelectBol2: boolean = false;
  private showSub = false;
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
  private checkAll = false; // 默认非全选
  private moduleType: any = []; // 已选的队伍类型
  private checkedOption: any = []; // 已选的行政区划数据
  private curActiveTabIndex: any = []; // 已选索引
  private curActiveTabObj: any = {}; // 已选对象
  private selectWord = '';
  // private selectWordDis = ""; //选中得行政区划

  private isQIantu = '';
  private unit = '';

  private halflistHeight: any = '';
  private searchDomHeight: any = '';
  @Watch('resetSelect')
  public changeSelect(val: any) {
      this.checkAll = false;
      this.handleCheckAllChange(this.checkAll);
  }
  /*------公共------*/
  /*------公共------*/
  // gis方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      this.factoryKey,
    );
    return component;
  }
  private expandSublist() {
    this.showSub = !this.showSub;
  }

  // 列表点击
  private clickHandler(data: any) {
    if (this.parentHandleClickNumFn) {
      this.parentHandleClickNumFn(JSON.parse(JSON.stringify(data)));
    }
  }
  // 取消下拉弹窗
  private canclehandle() {
    this.$emit('canclehandlebox');
    // this.isSelectBol = !this.isSelectBol;
  }

  /*---------------列表相关------------*/
  // 行政区划
  private city() {
    districtServer
      .getDistrictTreeByCode({ id: publishObjectPath.value.district.root })
      .then((data: any) => {
        if (data.code === 0) {
          this.selectData = data.data.children;
        }
      });
    // console.log(res, 222222222);
  }
  // 获取已选数据
  @Watch('checkedOption', { deep: true })
  private dealmoduleType() {
    const res: any = [];
    this.selectWord = '';
    this.checkedOption.forEach((name: any, ind: number) => {
      this.selectData.forEach((item: any, index: number) => {
        if (name === item.name) {
          res.push(item.id);
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
    const obj = {
      selectWord: this.selectWord,
      selectId: res,
    };
    this.$emit('data', obj);

    //   this.opts.id = res.length > 0 ? res.toString() : ""; // 如果下拉框为全部未选 => 传 ['-']  所有的列表数据为0
  }

  // 下拉全选
  private handleCheckAllChange(val: any) {
    console.log(val);
    this.checkedOption = val ? this.selectArr : [];
  }
  // 下拉复选框
  private handleCheckedChange(value: any) {
    const checkedCount = value.length;
    this.checkAll = checkedCount === this.selectArr.length;
  }

  // 列表展开收起
  private FnMinimize() {
    this.minimize = !this.minimize;
  }
  // 下拉框展开/收起
  private isSelectBolFn() {
    // this.isShowSelect = !this.isShowSelect;
    this.isSelectBol = false;
    this.isSelectBol2 = !this.isSelectBol2;
  }
  // mounted() {
  //   console.log(this.resetSelect)

  // }
}
</script>

<style lang="less" scoped>
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
</style>
