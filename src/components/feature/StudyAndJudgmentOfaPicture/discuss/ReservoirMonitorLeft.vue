<template>
  <!-- 水库面板 -->
  <div class="panelPublicDefault water-monitor-panel">
    <div class="tempRight-title f-tit-h2" @click="isShowOpenFn">
      <span
        :class="{
          'itemName-active': curcontList.clickKey && curcontList.active,
        }"
      >{{ curcontList.title }}</span>
      <span class="tempRight-total" style="right:45px">
        <span class="f-number">{{ curcontList.num }}</span>
      </span>
      <i
        :class="
          curcontList.showExpand
            ? 'tempRight-switch'
            : 'tempRight-switch tempRight-switch-reverse'
        "
      ></i>
    </div>
    <!-- 数据统计 -->
    <div class="panelPublicDefault_bd reservoirBox" v-if="curcontList.showExpand">
      <!-- <div class="count-container"> -->
      <div class="statisticList">
        <div
          v-for="(item, index) in resevoirType"
          :key="index"
          class="reservoirLeft"
        >
          <i :class="item.icon"></i>
          <div class="statisticList_li f-tit-h2 reservoirRight"  :class="item.checked || item.checkedNum ? 'checkSty' : ''">
            <span @click="changeTab(item)" class="reservoirTitle">{{ item.name }}</span>
            <div class="reservoirNum">
              <span class="statisticList_li_textWarning f-number">
                {{item.num || 0}}
              </span>
              <span>个</span>
            </div>
          </div>
          <span class="instake_cont" @click="changeNum(item)" :class="item.checkedNum ? 'checkStyNum' : ''"></span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { waterSituationServer } from '@/api/feature/monitorwarning/installServer';
import ReservoirPopup from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/ReservoirPopup.vue'; // 水库详情
import { nomalLeftServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
/**
 * 监测预警
 */
@Component({
  name: 'ReservoirMonitorLeft',
  components: {
    ReservoirPopup,
  },
})
export default class ReservoirMonitorLeft extends Vue {
  private curcontList: any = {
    title: '水库',
    num: 0,
    key: 'totalNum',
    showExpand: false,
  };
  // 水库类型
  private resevoirType: any = [
    {
      name: '大型水库',
      num: '',
      key: 'bigReservoirNum',
      type: 'bigReservoir',
      icon: 'reservoir',
      checked: false,
      checkedNum: false,
    },
    {
      name: '中型水库',
      num: '',
      key: 'middleReservoirNum',
      type: 'middleReservoir',
      icon: 'reservoir',
      checked: false,
       checkedNum: false,
    },
    {
      name: '小（1）型头顶库',
      num: '',
      key: 'smallOneTopReservoirYesNum',
      type: 'smallOneTopReservoir',
      icon: 'reservoir',
      checked: false,
       checkedNum: false,
    },
    {
      name: '小（1）型非头顶库',
      num: '',
      key: 'smallOneTopReservoirNoNum',
      type: 'smallOneReservoir',
      icon: 'reservoir',
      checked: false,
       checkedNum: false,
    },
    {
      name: '小（2）型头顶库',
      num: '',
      key: 'smallTwoTopReservoirYesNum',
      type: 'smallTwoTopReservoir',
      icon: 'reservoir',
      checked: false,
       checkedNum: false,
    },
    {
      name: '小（2）型非头顶库',
      num: '',
      key: 'smallTwoTopReservoirNoNum',
      type: 'smallTwoReservoir',
      icon: 'reservoir',
      checked: false,
       checkedNum: false,
    },
  ];

  // 统计数据
  private countData: any = {};

  // 饼图对象
  private echartsObj: any = null;

  // 饼图数据
  private pieData: any[] = [];

  // 监测点列表数据
  private siteList: any[] = [];

  // 搜索框数据
  private inputValue: any = '';

  // 列表查询
  private searchData: any = {
    keyWord: '',
    nowPage: 1,
    pageSize: 10,
    sortDesc: '',
    sortField: '',
    type: [{ type: 'warning' }],
    districtCode: '',
    townCode: '',
  };
  private searchType: any = [];
  private maxWaterData: any = {}; // 最大涨势站点信息
  private geometry: any =  this.$store.state.eventPushStore.eventLocation.geometry === '{"type":"Polygon","coordinates":[[[0,0],[0,90],[180,90],[180,0],[0,0]]]}' ? ''
      : this.$store.state.eventPushStore.eventLocation.geometry;
  private filter: any = {
    type: '', // 水库类型
    keyWord: '', // 名称
    districtCode: '', // 区域编码
    townCode: '',
    isOverHeadReservoir: '', // 是否头顶库 1 是， 0否
  };
  private showJsl1(val: any) {
    this.$store.commit('mapTools/addSelectedLayer', {
      id: val,
      name: '水库测站',
      play: false,
      legend: { component: val },
    });
  }
  // 监听 geometry
  @Watch('$store.state.dataFilterControl.filter', { deep: true})
  private changeGeometry(val: any) {
      this.getComponent().removeResource('water');
      this.resevoirType.forEach((item: any) => {
        item.num = 0;
      });
      if (val.geometry) {
        this.geometry = val.geometry;
      } else {
        this.geometry = '';
      }
      // 关闭弹框
      const params = {
        location: 'left',
        isShow: false,
      };
      this.$store.commit('mapTools/changeShowReservoirList', params);
      // 清空列表选中状态
      this.resevoirType.forEach((v: any) => {
        v.checked = false;
        v.checkedNum = false;
      });
      this.getCountData(this.geometry);
  }
    // 列表展开收起
  private isShowOpenFn() {
    this.curcontList.showExpand = !this.curcontList.showExpand;
  }
  private created() {
    this.changeGeometry(this.$store.state.dataFilterControl.filter);
    this.getMaxWaterInfo();
  }

  private mounted() {
    // 清空选中
    this.messsageBus.on('colseReservoirList', () => {
      this.resevoirType.forEach((v: any) => {
        v.checked = false;
        v.checkedNum = false;
      });
    });
  }

  // 离开页面清理地图
  private beforeDestroy() {
    // 销毁 水库图例
    this.$store.commit('mapTools/removeSelectedLayer', {
          id: 'normalReservoir',
        });
    const params = {
      // 关闭列表
      isShow: false,
      type: null,
      name: '',
    };
    this.$store.commit('mapTools/changeShowReservoirList', params);
    this.getComponent().removeResource('water');
  }
  // 时间格式化
  private dateFormat(fmt: any, date: any) {
    let ret;
    const opt: any = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (const k of Object.keys(opt)) {
      ret = new RegExp('(' + k + ')').exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'),
        );
      }
    }
    return fmt;
  }
  // 获取河道水库统计数据
  private async getCountData(key?: any) {
    this.curcontList.num = 0;
    let opts: any = '';
    if (key) {
      opts = {
        geometry: key,
      };
    } else {
      opts = {};
    }
    const res: any = await waterSituationServer.getCurrentReservoirInfo(opts);
    this.countData = res.data.data;
    this.countData.updateTime = this.dateFormat('YYYY-mm-dd', new Date());
    this.resevoirType.map((v: any) => {
      Object.keys(this.countData).map((k: any) => {
        if (v.key === k) {
          v.num = this.countData[k];
        }
      });
    });
    this.resevoirType.forEach((item: any) => {
      this.curcontList.num += item.num * 1;
    });
  }
  // 获取最大涨势站点信息
  private async getMaxWaterInfo() {
    const res: any = await waterSituationServer.getMaxReservoirInfo({});
    this.maxWaterData = res.data.data;
  }
  // 文字点击
  private changeTab(item: any) {
    this.showJsl1('normalReservoir'); // 初始new 水库图例
    const params = {
        location: 'left',
        isShow: false,
      };
    this.$store.commit('mapTools/changeShowReservoirList', params);
    item.checked = !item.checked;
    this.resevoirType.forEach((key: any) => {
        if (key.checkedNum) {
          key.checkedNum = false;
        }
      });
    this.searchType = this.resevoirType.filter((v: any) => {
      return v.checked;
    });
    if (this.searchType.length === 0) {
          // 销毁 水库图例
      this.$store.commit('mapTools/removeSelectedLayer', {
            id: 'normalReservoir',
          });
      this.getComponent().removeResource('water');
      return;
    }
    //  移除图层
    if (this.geometry) {
      this.filter.geometry = this.geometry;
    }
    this.filter.type = JSON.parse(JSON.stringify(this.searchType));
    this.getComponent().removeResource('water');
    //  加载图层
    this.getComponent().addResource_Water(this.filter);
  }
  // 数字后面图标点击事件
  private changeNum(item: any) {
      this.showJsl1('normalReservoir'); // 初始new 水库图例
      this.resevoirType.forEach((key: any) => {
          key.checked = false;
          key.checkedNum = false;
      });
      item.checkedNum = !item.checkedNum;
      if (this.searchData.type.length) {
        this.resevoirType.forEach((key: any) => {
          if (this.searchData.type[0].type === key.type) {
            key.checkedNum = false;
          }
        });
      }
      this.searchData.type = this.resevoirType.filter((v: any) => {
        return v.checkedNum;
      });
      if (this.searchData.type.length === 0) {
      // this.resevoirType[0].checked = true;
          // 销毁 水库图例
    this.$store.commit('mapTools/removeSelectedLayer', {
          id: 'normalReservoir',
        });
    const params = {
        isShow: false,
      };
    this.$store.commit('mapTools/changeShowReservoirList', params);
    return;
    }
      this.searchData.nowPage = 1;
      this.searchData.keyWord = '';
    // this.getSiteList();
      const params1 = {
      isShow: true,
      geometry: this.geometry ? this.geometry : '',
      location: 'left',
      type: JSON.parse(JSON.stringify(this.searchData.type)),
    };
      this.$store.commit('mapTools/changeShowReservoirList', params1);
  }
    // 获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
  }
}
</script>
<style lang="less" scoped>
@import '../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../../assets/img/monitorWarning';
@url: '../../../../assets/img/halfScreen/firePoint';
@panel-padding: 10px;
.panelPublicDefault {
  width: 370px!important;
  height: calc(100% - 50px) !important;
}
.riverSelect {
  height: 40px;
  margin-bottom: 10px;
  display: flex;
  div + div {
    margin-left: 30px;
  }
}
.reservoirBox{
  padding: 0!important;
}
.reservoirLeft{
  width: 370px;
  display: flex;
  align-items: center;
  i{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 4px;
    margin-right: 10px;
    &.reservoir {
        background: url('@{imgPath}/reservoirLeft.png') no-repeat center center;
      }
  }
  .instake_cont {
      display: inline-block;
      cursor: pointer;
      width: 32px;
      height: 32px;
      background: url("../../../../assets/img/discuss/icon_cont.png") 0 50% no-repeat;
      &.checkStyNum{
        background: url("../../../../assets/img/discuss/icon_cont_hover.png") 0 50% no-repeat;
      }
      &:hover {
          background: url("../../../../assets/img/discuss/icon_cont_hover.png") 0 50% no-repeat;
      }
  }
  .reservoirRight{
    flex:1;
    display: flex;
    align-items: center;
    .reservoirTitle{
      cursor: pointer;
    }
    .reservoirNum{
      display: flex;
    }
  }
}
.c-sky {
  color: #28dbee;
}
.c-orange {
  color: #eac60d;
}
.c-tomato {
  color: #fa6400;
}
.c-red {
  color: #d90c0c;
}
.water-monitor-panel {
  .waterDialog_word {
    width: 93%;
    margin-left: 3%;
    .spanDot {
      margin-left: 20px;
      margin-top: 15px;
      display: inline-block;
    }
    background: #091120;
    border: 1px solid #2b5461;
    border-radius: 8px;
    margin-top: 30px;
    font-size: 20px;
    color: #8de5eb;
    .redWord {
      color: #abbfcb;
    }
  }
  .count-container {
    width: 94%;
    margin: 0 auto;
    .echarts {
      // padding: 28px @panel-padding 0;
      height: 350px;
    }
  }
  .list {
    height: calc(100% - 625px);
    > div {
      height: 100%;
    }
  }
  .nodata {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-scrollbar {
    height: calc(100% - 20px);
  }
  .updateTime {
    color: #abbfcb;
    position: absolute;
    right: 0px;
    margin-right: 20px;
    font-size: 20px;
  }
}
</style>
