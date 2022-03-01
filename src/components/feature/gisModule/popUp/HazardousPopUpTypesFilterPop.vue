<template>
  <div
    class="eventInfoPop expert"
    ref="eventInfoPop"
    :style="'height: ' + popHeight + 'px;'"
  >
    <input id="eventPopdata" type="hidden" :value="data" />
    <div class="eventInfoPop_title">
      <div
        class="eventInfoPop_title_txt title-panel"
        :title="name"
        :style="{ 'font-size: 16px': name.length > 22 }"
      >
        {{ removeSpaces(name) }}
      </div>
      <div class="eventInfoPop_title_close" @click="close()"></div>
    </div>
    <div class="eventInfoPop_content">
      <ul>
        <el-scrollbar
          class="scrollbar"
          :wrap-style="'height:100%;max-height: ' + (popHeight - 180) + 'px;'"
        >
          <li v-for="item of dataFilter" :key="item">
            <template
              v-if="
                list[item] === 0 || filterNumFixed(item, labelObj[item], list)
              "
            >
              <span>{{ labelObj[item] }}</span>
              <!-- 改变冗余结构，解决电话弹窗内拨打电话显示object的问题  毕东方 2021.12.6 -->
              <span :title="filterNumFixed(item, labelObj[item], list)" >
                {{ filterNumFixed(item, labelObj[item], list) }}
                <span
                  class="unit"
                  v-show="filterNumFixed(item, labelObj[item], list) !== '- -'"
                  >{{ unitObj[item] || '' }}</span
                >
                 <img
                  v-if="list[item] && telobj[item] && list[item] !== ' '"
                  src="../../../../assets/img/eventInfo/telphoon.png"
                  class="callPhoneCur"
                  @click.stop="
                    handleClickCallup(list, list[item], $event, telPelope)
                  "
                />
              </span>
              <!-- v-if="list[item] && telobj[item] && unitObj[item]" -->
            </template>
            <template v-else>
              <span>{{ labelObj[item] }}</span>
              <span>无</span>
            </template>
          </li>
        </el-scrollbar>
        <li class="popBtn">
          <popButtonList
            :btnFilter="btnFilter"
            :listData="list"
            v-if="btnOnOff"
            @buttonListClick="buttonListClick"
          ></popButtonList>
          <InEventInfo
            :closeFunc="closeFunc"
            :vueThis="vueThis"
            v-if="data.isEventBtn"
            :popupData="data"
          ></InEventInfo>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import { Draggable } from 'draggable-vue-directive';
import popDataDealRight from './dataDeal/popDataDealRight';
import { dataDeal } from './dataDeal/dataDeal';
import equipmentList from '@/components/feature/gisModule/popUp/equipmentList.vue';
import popButtonList from '@/components/feature/gisModule/popUp/popButtonList.vue';
import { buttonList } from './dataDeal/buttonList';
import InEventInfo from '@/components/feature/gisModule/popUp/btnComponent/inEventInfo.vue';
import {
  baseDataServer,
  detailInfoServer,
  emerSourceServer,
  riskSourceServer,
  nomalLeftServer,
} from '@/api/installServer';

@Component({
  name: 'HazardousPopUpTypesFilterPop',
  components: {
    equipmentList,
    popButtonList,
    InEventInfo,
  },
  mixins: [popDataDealRight],
  directives: {
    Draggable,
  },
  //   filters: {
  //     // 小数点过滤
  //     filterNumFixed(value: any) {
  //       debugger
  //       var label = this.labelObj(value);
  //       debugger
  //       return 'Hello filter';
  //     },
  //   },
})
export default class HazardousPopUpTypesFilterPop extends Vue {
  // 要显示的按钮
  public btnFilter = [
    // 'pathPlanningBtn', // 路径规划
    // 'aroundAnalysisBtn', // 周边分析
    // 'aroundVideoBtn', // 周边分析
    /* 'videoMonitoringBtn', // 视频监控
    'hazardousChemicalsBtn', // 危化物联 */
  ];
  public name: any = '暂无标题';
  public styles: any = {};
  public popUpType: any;
  public geometry: any;
  public coordinates: any;
  public geoPoint: any = [];
  public dataObj: any;
  public list: [] = []; // 当前生产企业详情的数据
  public dataAttributes: any;
  public dataChild: any;
  public dataTag: any;
  public dataDeal: any = dataDeal;
  public popHeight: any = 0;
  // 拖拽
  private draggableValue: any = {
    onPositionChange: this.onPosChanged,
  };
  public buttonListClick(item: any) {
        /*// 如果点击周边分析按钮, 隐藏当前弹框
        if (item === 'aroundAnalysisBtn') {
          (this.$refs.eventInfoPop as any).style.display = 'none';
        }*/
        // console.log(item);
    // 触发点击的回调方法
    if ( item === 'companyVideoBtn') {
      // debugger;
      // console.log(this.list); // 当前生产企业详情数据
      this.messsageBus.emit('openCompanyVideopop', this.list);
      this.messsageBus.emit('showVideoMapPop');
      this.messsageBus.emit('showleftList' , true);
    } else {
       buttonList[item].btnClick(this);
    }
  }
  public beforeDestroy() {
    const that: any = this;
  }

  public mounted() {
    const that: any = this;
    that.popUpType = that.type;
    if (
      ['bundpitch', 'dianpaizhan', 'chuanzha', 'dianzhan', 'shuizha'].includes(
        that.data.type,
      )
    ) {
      that.popUpType = that.data.type;
    } else if (that.data.b_type === 'shuizha') {
      that.popUpType = that.data.b_type;
    }
    console.log(that.data);
    // 左侧地震事件态工贸企业数据区分显示
    if (
      that.popUpType === 'metallurgical' &&
      that.event.featureType &&
      that.event.featureType ===
        'disaster_judge_resource__metallurgical__0'
    ) {
      that.popUpType = 'ANJIAN_ENT_WHSMYHBZ※07';
      that.type = 'ANJIAN_ENT_WHSMYHBZ※07';
    }
    // console.log('ww', JSON.parse(JSON.stringify(that.data)));
    // 吴恩2020/8/18解决一开始进来没有数据的问题
    this.list = that.data;
    // tslint:disable-next-line:no-debugger
    that.name = '';
    this.matchPopUpName(that.popUpType, that);
    that.setGeomPoint(); // 设置当前点位经纬度给geoPoint
    /*  that.geometry = that.data && that.data.geometry ? that.data.geometry : [];
        that.coordinates = that.data && that.data.geom && that.data.geom.coordinates ? that.data.geom.coordinates : [];
        that.geoPoint = that.geometry ? [that.geometry.x, that.geometry.y] : [];
        that.geoPoint = that.coordinates ? that.coordinates : []; */
    if (that.styleObj) {
      that.styles = that.styleObj;
    }
    /*// 判断是否存在路径规划
    if (that.getPathTypeFilter(that.popUpType)) {
                that.isShowPathPlanning();
            }
    // 判断是否存在周边分析
    if (that.getAroundTypeFilter(that.popUpType)) {
                that.isShowAroundAnalysis();
            }*/
    /* 此处针对应急资源弹框 专家弹框 灾情信息员 的都用专家的ts文件*/
    if (that.popUpType === 'DisasterPer※01') {
      that.popUpType = 'disinfoper';
    }
    /*地灾隐患弹窗*/
    const hdsTypeArr = [
      'landslide',
      'debrisflow',
      'emptysubside',
      'mountaincollapse',
      'bottomcollapse',
      'groundfissure',
      'landsubsidence',
      'unstableslopes',
    ];
    // 旧左侧滑坡
    // if (hdsTypeArr.includes(that.popUpType)) {
    //   that.popUpType = "hiddendisastersites"
    // }

    if (dataDeal[that.popUpType]) {
      that.popHeight = dataDeal[that.popUpType].popHeight;
      that.name = dataDeal[that.popUpType].name
        ? dataDeal[that.popUpType].name
        : that.name;
      that.unitObj = dataDeal[that.popUpType].unitObj;
      that.dataFilter = dataDeal[that.popUpType].dataFilter;
      console.log('7777', that.dataFilter);
      that.labelObj = dataDeal[that.popUpType].labelObj;
      that.telobj = dataDeal[that.popUpType].telobj
        ? dataDeal[that.popUpType].telobj
        : that.telobj;
      // that.telobj = that.telobj.trim();

      that.telPelope = dataDeal[that.popUpType].telPelope;
      that.btnFilter = dataDeal[that.popUpType].btnFilter
        ? dataDeal[that.popUpType].btnFilter
        : that.btnFilter;
      if (
        this.name !== '火点信息' &&
        that.btnFilter.indexOf('fireCreep') > 0
      ) {
        that.btnFilter.splice(that.btnFilter.findIndex((item: any) => item === 'fireCreep'), 1);
      }
      dataDeal[that.popUpType].cb(that);
    } else {
      if (that.data) {
        that.getpopData(that.data);
      }
    }
  }
  // 进入处置 关闭弹窗
  private closeFunc() {
    const self: any = this;
    self.close();
  }
  private onPosChanged(positionDiff: any, absolutePosition: any, event: any) {
    if (event.target.closest('[draggable-state]')) {
      event.target.closest('[draggable-state]').style.position = 'absolute';
    }
  }

  private formatterPhone(key: any, label: any, list: any) {
    var resultVal: any = JSON.parse(JSON.stringify(list))[key];
    // 这里先把现在数据和元数据进行解地址引用，之后调用了removeSpace方法，这个原因不是很确定，原来的就调用了，于是我没有改动
    if (resultVal !== null && resultVal !== undefined) {
      resultVal = this.removeSpaces(resultVal + ''.trim());
      if (typeof resultVal === 'string') {
        if (resultVal.trim()) {
          return resultVal.indexOf(',') > 0 ? resultVal.split(',') : resultVal.split('、');
        }
      }
    }
    return '- -';
  }
  // 数字过滤
  private filterNumFixed(key: any, label: any, list: any) {
    var resultVal: any = JSON.parse(JSON.stringify(list))[key];
    // 这里先把现在数据和元数据进行解地址引用，之后调用了removeSpace方法，这个原因不是很确定，原来的就调用了，于是我没有改动
    if (resultVal !== null && resultVal !== undefined) {
      resultVal = this.removeSpaces(resultVal + ''.trim());
      if (typeof resultVal === 'string') {
        resultVal = resultVal.trim() ? resultVal : '- -';
      }
    } else {
      resultVal = '- -';
    }

    /*const tempVal: any = JSON.parse(JSON.stringify(list))[key];
        if (tempVal !== null && tempVal !== undefined) {
          resultVal = this.removeSpaces(tempVal + ''.trim());
        }*/
    // 对数据进行两位小数保留，如果后期需要三位的话，就注释掉这里，在switch中写。
    // 同时，这里会有隐患，例如以数字开头的文字描述回被强制转换。如果真的有这个情况的话,还是在switch中使用，或者用正则吧
    const pattern = /^(\-|\+)?\d+(\.\d+)?$/;

    if (pattern.test(resultVal)) {
      // 判断是否为纯数
      // resultVal = Math.round(resultVal * 100) / 100;
    }
    // 处理所有电话号码的字段的空格
    switch (key) {
      case 'phone':
      case 'KSFZRBGSDH':
      case 'KSFZRYDDH':
      case 'ZYFZRBGDH':
      case 'ZYFZRYDDH':
      case 'CONCATEMOBTEL':
      case 'legalpersonphone':
      case 'controlphone':
      case 'telephone':
      case 'TEL':
      case 'DUTYTEL':
      case 'duty_phone':
      case 'on_duty_phone':
      case 'office_phone':
      case 'cell_phone':
        if (list.hasOwnProperty(key)) {
          resultVal = list[key] ? list[key].trim() || '- -' : '- -';
        }
        // if (tempVal !== null && tempVal !== undefined) {
        //   resultVal = tempVal.trim();
        //   debugger
        // }
        break;
    }
    switch (label) {
      case '人口数量':
        // resultVal = Math.round(resultVal / 10000 * 100 ) / 100;
        break;
    }
    return resultVal;
  }

  private removeSpaces(val: any) {
    // tslint:disable-next-line:no-debugger
    if (typeof val === 'string') {
      // const str = val.replace(/(^[\s\n\t]+|[\s\n\t\0]+$)/g, '');
      // console.log('str,val:' , str , val);
      return val.replace(/(^[\s\n\t]+|[\s\n\t\0]+$)/g, '');
    } else {
      return val;
    }
  }

  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any, name: any) {
    //  改变冗余结构，解决电话弹窗内拨打电话显示object的问题  毕东方 2021.12.6
    // console.log('打印参数:',
    // 'listObj:', listObj,
    // 'val:', val,
    // 'event:', event,
    // 'name:', name )
    let telName = '';
    const list = Object.values(listObj);
    const objList = Object.keys(listObj);
    list.forEach((item: any, index: any) => {
      if (item === val) {
        const key: any = objList[index];
        const telKey = name[key];
        telName = listObj[telKey] || '';
      }
    });
    this.messsageBus.emit('showCallup', true, listObj, val, event, telName);
  }
  // 左侧点击标题事件name为POP弹窗名字
  private matchPopUpName(popUpType: any, that: any) {
    const contListAll: any = {};
    // 递归构造配置文件map{codKey：title}
    const handleCons = (item: any) => {
      item.forEach((item1: any) => {
        contListAll[item1.codeKey] = item1.title;
        if (item1.list && item1.list instanceof Array) {
          handleCons(item1.list);
        } else {
          return;
        }
      });
    };
    //  风险隐患的初始数据
    nomalLeftServer.getInitDataFxyh().then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      handleCons(res.data);
      if (!contListAll[that.type]) {
        return;
      }
      that.name = contListAll[that.type] + '详情';
    });

    // 应急资源资源初始数据
    nomalLeftServer.getInitDataYjzy().then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      if (that.name === '专家') {
        that.name = that.name + '详情';
        return;
      }

      handleCons(res.data);
      if (!contListAll[that.type]) {
        return;
      }
      that.name = contListAll[that.type] + '详情';
    });

    // 防护目标初始数据
    nomalLeftServer.getInitDataFhmb().then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      handleCons(res.data);
      if (!contListAll[that.type]) {
        return;
      }
      that.name = contListAll[that.type] + '详情';
    });
  }
}
</script>
<style lang="less" scoped>
@url: '../../../../assets/img/eventInfo';
@popdialog: '../../../../assets/img/popdialog';
@closebg: '../../../../assets/img/halfScreen/eventAndTopics';

.eventInfoPop {
  width: 560px;
  height: 400px;
  z-index: 4;
  cursor: default;
  color: #fff;
  margin-left: 500px;

  // 组件内样式调整
  .buttonListCon {
    padding-top: 16px;
  }
  &_title {
    background: url('@{popdialog}/popdialog-title.png') no-repeat;
    background-size: 100% 65px;
    height: 65px;
    line-height: 65px;
    &_close {
      position: absolute;
      top: 2px;
      right: 8px;
      width: 80px;
      height: 35px;
      background: url('@{closebg}/eventAndTopics_close.png') no-repeat 0 -3px;
      background-size: 100% 100%;
    }
    &_close:hover {
      background: url('@{closebg}/eventAndTopics_close_h.png') no-repeat 0 -3px;
    }
    &_txt {
      text-overflow: ellipsis;
      overflow: hidden;
      padding-left: 28px;
    }
  }
  &_content {
    background: url('@{popdialog}/businessImgBackContent.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    padding: 20px 0 0 2px;
    height: calc(100% - 90px);
    ul {
      position: relative;
      padding-bottom: 50px;
      box-sizing: border-box;
      padding-left: 20px;
      height: 100%;
      width: 95%;
      li {
        font-size: 28px;
        padding: 2px;
        display: flex;
        cursor: default;
        align-items: center; // 居中
        .unit {
          color: #fff;
        }
        > span:nth-child(1) {
          display: inline-block;
          color: #0edbe4;
          line-height: 50px;
          width: 140px;
          margin-right: 26px;
        }
        > span:nth-child(2) {
          width: 340px;
        }
        .callPhoneCur {
          cursor: pointer;
          margin-left: 5px;
        }
      }
      li:nth-child(2n-1) {
        background: url('@{popdialog}/list_nowNew.png') no-repeat;
        background-size: 100% 100%;
      }
      li.popBtn {
        background: none;
        position: absolute;
        bottom: 36px;
        right: 0;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
<style lang="less">
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
.expert {
  .popBtn {
    .infoManagementBtn {
      background: none !important;
      display: block;
      float: right;
      width: 118px !important;
      height: 40px !important;
      border: solid 1px #02e9d5;
      color: white !important;
      padding: 0 5px;
      margin: 10px 1px 1px 10px;
      line-height: 40px !important;
      cursor: pointer;
      background: transparent;
    }
  }
}
</style>
