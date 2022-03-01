<!--自然灾害容器组件-->
<template>
  <div>
    <div class="tempRight-title f-tit-h2">
      <span>自然灾害损失情况</span>
    </div>
    <div class="disaster_list panelPublicDefault_bd">
      <ul class="statisticList">
        <li
          class="statisticList_li f-tit-h2"
          v-for="(item, index) in disasterCatgory"
          :key="index"
        >
          <!-- @click="changeRainType(item, index)"
          :class="rainTypeIndex == index ? 'checkSty' : ''" -->
          <span> <span :class="item.icon"></span> {{ item.name }}</span>
          <span>
            <span class="statisticList_li_textWarning f-number"
              >{{ item.value }} <span class="unit">{{ item.unit }}</span></span
            >
          </span>
        </li>
      </ul>
    </div>
    <div class="tempRight-title f-tit-h2">
      <span>救灾工作情况</span>
    </div>
    <div class="disaster_list panelPublicDefault_bd">
      <ul class="statisticList">
        <li
          class="statisticList_li f-tit-h2"
          v-for="(item, index) in disasterCatgoryRelief"
          :key="index"
        >
          <!-- @click="changeRainType(item, index)"
          :class="rainTypeIndex == index ? 'checkSty' : ''" -->
          <span> <span :class="item.icon"></span> {{ item.name }}</span>
          <span>
            <span class="statisticList_li_textWarning f-number"
              >{{ item.value }} <span class="unit">{{ item.unit }}</span>
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {
  riskServer,
  protectTargetServer,
} from '@/api/feature/defensiveprepation/installServer';
import { disasterSituationServer } from '@/api/feature/disasterStatistics/installServer';
@Component({
  name: 'CommonList',
  components: {},
})
export default class CommonList extends Vue {
  // @Prop() private compParam: any; // 从父级拿到的当前组件需要的参数
  @Prop() private handleClick: any; // 父组件处理子组件点击的方法
  @Prop() private handleTitleClick: any; // 父组件处理子组件一级标题的点击事件
  @Prop() private handleSubTitleClick: any; // 父组件处理子组件二级标题的点击事件
  private curCompParam: any = {}; // compParam的转换
  private disasterCatgory: any = [
    {
      name: '人口情况',
      icon: 'rk',
      unit: '人',
      value: '1',
    },
    {
      name: '房屋情况',
      icon: 'fw',
      unit: '户',
      value: '',
    },
    {
      name: '农业情况',
      icon: 'ny',
      unit: '公顷',
      value: '',
    },
    {
      name: '经济情况',
      icon: 'jj',
      unit: '万元',
      value: '',
    },
  ];
  private disasterCatgoryRelief: any = [
    {
      name: '',
      icon: 'yantai',
      unit: '万元',
      value: '',
    },
    {
      name: '下级单位',
      icon: 'qx',
      unit: '万元',
      value: '',
    },
  ];
  // // 当前列表
  // private servObj: any = {
  //   riskServer,
  //   protectTargetServer,
  //   disasterSituationServer,
  // };
  private clickItem(item: any, index: number) {
    const param: any = {
      ...item,
    };
    this.handleClick(item.nextCompName, param);
  }

  /**
   * 展开或者收起当前的子数组面板
   */
  private expandSublist(curCompParam: any) {
    this.curCompParam.showSub = !curCompParam.showSub;
  }

  // 通过服务获得数据，因为风险隐患和防护目标公用一个vue，所以这里要做参数等处理
  // private async getDataByServ() {
  //   const result = await this.servObj[this.compParam.serveName].getStatistics();
  //   console.log(result, 'resultresult');
  // const statisticsObj = this.handleResResult(
  //   JSON.parse(JSON.stringify(result)),
  // );

  // this.curList = statisticsObj.curListTmp;
  // this.curCompParam.count = statisticsObj.statisticNum;
  // }

  // 处理从接口返回的结果，并且计算总数
  // private handleResResult(resResult: any) {
  //   const statisticNum = resResult.total || 0;
  //   const curListTmp: any = [];
  //   resResult.forEach((item: any, index: number) => {
  //     if (item.code) {
  //       // statisticNum += item.value;
  //       const obj = {
  //         ...item,
  //         parentParam: this.compParam,
  //         ...this.dictMap[item.code],
  //         isChecked: false, // 子标题高亮
  //       };
  //       curListTmp.push(JSON.parse(JSON.stringify(obj)));
  //     }
  //   });
  //   return {
  //     statisticNum,
  //     curListTmp,
  //   };
  // }

  /**
   * 更新当前选中（上图）的情况，针对一级标题
   */
  // private handleClickStatisticsTitle(curCompParam: any) {
  //   if (!curCompParam.count) {
  //     // 当统计值为0的时候，点击没有任何意义
  //     return;
  //   }
  //   const curCompParamTmp = JSON.parse(JSON.stringify(curCompParam));
  //   this.curCompParam.titleActive = !curCompParamTmp.titleActive;

  //   if (this.curCompParam.titleActive) {
  //     // 当前标题是从不高亮到高亮，那么要清除当前子标题的高亮状态
  //     const a = this.curList;
  //     this.curList.forEach((item: any, index: number) => {
  //       item.isChecked = false;
  //     });
  //   }

  //   this.handleTitleClick(JSON.parse(JSON.stringify(this.curCompParam)));
  // }

  /**
   * 点击二级标题
   */
  // private handleClickSubitemTitle(item: any, index: number) {
  //   item.isChecked = !item.isChecked; // 反选
  //   // 要把一级高亮去掉
  //   this.curCompParam.titleActive = false;
  //   const itemTmp = JSON.parse(JSON.stringify(item));
  //   const subList = JSON.parse(JSON.stringify(this.curList));
  //   const curCompParamTpm = JSON.parse(JSON.stringify(this.curCompParam));
  //   this.handleSubTitleClick(itemTmp, index, subList, curCompParamTpm);
  // }

  // // 主要是为了应对防护目标和危险隐患的互斥
  // @Watch('compParam')
  // private updateCurCompParam(val: any) {
  //   const compParamNew = JSON.parse(JSON.stringify(val));
  //   if (compParamNew.updateTitleChecked) {
  //     // 例如： 防护目标的被点击成了高亮，那么危险隐患的要取消高亮
  //     this.curCompParam.titleActive = false;
  //     // this.curList.forEach((item: any, index: number) => {
  //     //     item.isChecked = false;
  //     // });
  //   }
  //   if (compParamNew.updateSubTitleChecked) {
  //     this.curList.forEach((item: any, index: number) => {
  //       item.isChecked = false;
  //     });
  //   }
  // }

  // private initCurCompParam() {
  //   this.curCompParam = {
  //     showSub: true, // 默认展开二级
  //     titleActive: false, // 当前子组件的一级标题是否选中
  //     ...JSON.parse(JSON.stringify(this.compParam)),
  //   };
  // }

  private async created() {
    // this.initCurCompParam();
    // await this.getDataByServ();
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../../assets/css/decisionSupport/Statistic.half.less';
@urlPath: '../../../../../assets/img/flood/disasterStatistics';
.DefensiveCommonList {
  .team-ul {
    .tempRight-itemTitle {
      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(7) {
        display: none;
      }
    }
    .teamIcon {
      height: 53px;
    }
  }
  .team-ul .tempRight-itemNum .text-number {
    color: #7cf3fc;
    &:hover {
      color: #fbee06;
    }
    right: 60px;
  }
}
.disaster_list {
  .rk {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/rk.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .fw {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/fw.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .ny {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/ny.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .jj {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/jj.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .yantai {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/yantai.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .qx {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/qx.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
}
</style>
