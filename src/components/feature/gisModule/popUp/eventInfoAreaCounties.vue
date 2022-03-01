<template>
  <!-- 区县弹框详情 -->
  <div class="eventInfoPop expert" ref="eventInfoPop" :style="{height: popHeight + 'px'}">
    <input id="eventPopdata" type="hidden" :value="data" />
    <div class="eventInfoPop_title">
      <div
        class="eventInfoPop_title_txt eventInfoPop_title_txt title-panel"
        :title="name"
      >{{ removeSpaces(name) }}</div>
      <div class="eventInfoPop_title_close" @click="close()"></div>
    </div>
    <div class="eventInfoPop_content">
      <ul>
        <el-scrollbar wrap-style="height:100%; max-height: 608px;">
  
          <li
            v-for="(item, index) of dataFilter"
            :key="index"
            :class="filterNumFixed(item, labelObj[item], list ) === 'echarts' ? 'echartsClass' : ''"
          >
            <template v-if="list[item]===0 || filterNumFixed(item, labelObj[item], list )">
              <template v-if="filterNumFixed(item, labelObj[item], list ) === 'echarts'">
                <span>{{labelObj[item]}}</span>
                <div class="echartsLi" :id="list[item].objId"></div>
              </template>
              <template v-else>
                <span>{{ labelObj[item]}}</span>
                <span :title="filterNumFixed(item, labelObj[item], list ) || '- -'">
                  {{ filterNumFixed(item, labelObj[item], list ) || '- -' }}
                  <span
                    class="unit"
                    v-show="filterNumFixed(item, labelObj[item], list ) !== '- -'"
                  >{{unitObj[item] || ''}}</span>
                  <img
                    v-if="list[item] && telobj[item]"
                    src="../../../../assets/img/eventInfo/telphoon.png"
                    class="callPhoneCur"
                    @click.stop="handleClickCallup(list,list[item],$event,list.name,)"
                  />
                </span>
              </template>

              <!-- v-if="list[item] && telobj[item] && unitObj[item]" -->
            </template>
            <template v-else>
              <span>{{ labelObj[item] }}：</span>
              <span>无</span>
            </template>
          </li>
        </el-scrollbar>
        <li class="popBtn">
          <popButtonList :btnFilter="btnFilter" v-if="btnOnOff" @buttonListClick="buttonListClick"></popButtonList>
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
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
import equipmentList from '@/components/feature/gisModule/popUp/equipmentList.vue';
import popButtonList from '@/components/feature/gisModule/popUp/popButtonList.vue';
import { buttonList } from './dataDeal/buttonList';
import InEventInfo from '@/components/feature/gisModule/popUp/btnComponent/inEventInfo.vue';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';

// import * as echarts from 'echarts';
@Component({
  name: 'eventInfoAreaCounties',
  components: {
    equipmentList,
    popButtonList,
    InEventInfo,
  },
  mixins: [popDataDeal],
  directives: {
    Draggable,
  },
  //   filters: {
  //     // 小数点过滤
  //     filterNumFixed(value: any) {
  //       var label = this.labelObj(value);
  //       return 'Hello filter';
  //     },
  //   },
})
export default class EventInfoAreaCounties extends Vue {
  // 要显示的按钮
  public btnFilter = [
    // 'pathPlanningBtn', // 路径规划
    'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边分析
    // 'fireCreep', // 蔓延分析
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
  public list: any = [];
  public dataAttributes: any;
  public dataChild: any;
  public dataTag: any;
  public dataDeal: any = dataDeal;
  public popHeight: any = 0;

  private ehcartsObj: any;
  // 拖拽
  private draggableValue: any = {
    onPositionChange: this.onPosChanged,
  };
  public buttonListClick(item: any) {
    /*// 如果点击周边分析按钮, 隐藏当前弹框
        if (item === 'aroundAnalysisBtn') {
          (this.$refs.eventInfoPop as any).style.display = 'none';
        }*/
    // 触发点击的回调方法
    buttonList[item].btnClick(this);
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

  // 数字过滤
  private filterNumFixed(key: any, label: any, list: any) {
    var resultVal: any = JSON.parse(JSON.stringify(list))[key];
    if (resultVal && resultVal.dataType && resultVal.dataType === 'echarts') {
      return 'echarts';
    }
    // 这里先把现在数据和元数据进行解地址引用，之后调用了removeSpace方法，这个原因不是很确定，原来的就调用了，于是我没有改动
    // var  tempVal: any = JSON.parse(JSON.stringify(list))[key];
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
      // 判断是否为纯数字
      resultVal = Math.round(resultVal * 100) / 100;
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
        if (list.hasOwnProperty(key)) {
          resultVal = list[key] ? list[key].trim() || '- -' : '- -';
        }
        // if (tempVal !== null && tempVal !== undefined) {
        //   resultVal = tempVal.trim();
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
    if (typeof val === 'string') {
      return val.replace(/(^[\s\n\t]+|[\s\n\t\0]+$)/g, '');
    } else {
      return val;
    }
  }

  private calcHeight() {
    this.popHeight = $('.eventInfoPop.expert').innerHeight();
    this.popHeight += 40;
  }
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any, name: any) {
    this.messsageBus.emit('showCallup', true, listObj, val, event, name);
  }

  private getOption(res: any) {
    const that: any = this;
    if (!res) {
      return;
    }
    // brickconcretestructure: ""  // 砖混结构
    // intensity: "7"   // 烈度
    // otherstructure: ""  // 其他结构
    // pre90shouse: ""  // 90年代
    // singlestoryhouse: ""  // 单层房子
    // steelconcretestructure: ""  // 钢筋混凝土房子
    for (const key in that.list) {
      if (that.list[key].dataType && that.list[key].dataType === 'echarts') {
        var i: any = 0;
        const lineY: any = [];
        const color: any = that.list[key].color;
        const top10CityList: any = [];
        const top10CityData: any = [];
        for (const item of that.list[key].data) {
          if (res.data[item.key]) {
            item.value = parseFloat(res.data[item.key]);
          }
          top10CityList.push(item.name);
          top10CityData.push(item.value);
          var x: any = i;
          if (x > color.length - 1) {
            x = color.length - 1;
          }
          const data = {
            name: item.name,
            color: color[x] + ')',
            value: item.value,
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: color[x] + ', 0.6)',
                    },
                    {
                      offset: 1,
                      color: color[x] + ', 1)',
                    },
                  ],
                  false,
                ),
                barBorderRadius: 10,
              },
              emphasis: {
                shadowBlur: 15,
                shadowColor: 'rgba(0, 0, 0, 0.1)',
              },
            },
          };
          lineY.push(data);
          i++;
        }
        const option: any = {
          backgroundColor: 'transparent',
          title: {
            show: false,
          },
          tooltip: {
            trigger: 'item',
            formatter: (infos: any) => {
              const str: string = `<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${infos.data.color};'></span>${infos.marker}${infos.name}:${infos.value}%`;
              return str;
            },
          },
          grid: {
            borderWidth: 0,
            top: '6%',
            left: '0%',
            right: '22%',
            bottom: '0%',
          },
          color,
          yAxis: [
            {
              type: 'category',
              inverse: true,
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              axisLabel: {
                show: false,
                inside: false,
              },
              data: top10CityList,
            },
            {
              type: 'category',
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: true,
                inside: false,
                textStyle: {
                  color: '#b3ccf8',
                  fontSize: '28',
                  fontFamily: 'PingFangSC-Regular',
                },
                formatter(val: any) {
                  return `${val}%`;
                },
              },
              splitArea: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              data: top10CityData.reverse(),
            },
          ],
          xAxis: {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          series: [
            {
              name: '',
              type: 'bar',
              zlevel: 2,
              barWidth: '22px',
              data: lineY,
              animationDuration: 1500,
              label: {
                normal: {
                  color: '#b3ccf8',
                  show: true,
                  position: [0, '-30px'],
                  textStyle: {
                    fontSize: 28,
                  },
                  formatter(a: any, b: any) {
                    return a.name;
                  },
                },
              },
            },
          ],
          animationEasing: 'cubicOut',
        };
        const div = document.getElementById('echartsLi') as HTMLDivElement;
        const ehcartsObjs: any = (this as any).$echarts.init(div);
        ehcartsObjs.setOption(option);
      }
    }
  }
  private mounted() {
    this.calcHeight();
    const that: any = this;
    that.popUpType = that.type;

    // console.log(that.isShowPathPlanningBtn);
    // console.log(that.isAroundAnalysisBtn);

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
      'mountaincollapse',
      'bottomcollapse',
      'emptysubside',
      'groundfissure',
      'landsubsidence',
      'unstableslopes',
    ];
    if (hdsTypeArr.includes(that.popUpType)) {
      that.popUpType = 'hiddendisastersites';
    }

    /* 救援装备的都用 */
    if (that.popUpType.split('※')[0] === 'v_equipment') {
      that.popUpType = 'v_equipment';
    }
    if (dataDeal[that.popUpType]) {
      that.popHeight = dataDeal[that.popUpType].popHeight;
      that.unitObj = dataDeal[that.popUpType].unitObj;
      that.dataFilter = dataDeal[that.popUpType].dataFilter;
      that.labelObj = dataDeal[that.popUpType].labelObj;
      that.telobj = dataDeal[that.popUpType].telobj
        ? dataDeal[that.popUpType].telobj
        : that.telobj;
      // that.telobj = that.telobj.trim();
      that.btnFilter = dataDeal[that.popUpType].btnFilter ? dataDeal[that.popUpType].btnFilter : that.btnFilter;
      dataDeal[that.popUpType].cb(that);
      if (that.$store.state.configModel.config.isFores && that.popUpType !== 'townCount' && that.popUpType !== 'countyCount') {
        that.getForestFireDetail();
      } else {
        if (this.dataFilter.indexOf('HouseFlag') < 0 && that.popUpType !== 'townCount' && that.popUpType !== 'countyCount') {
          this.dataFilter.push('HouseFlag');
        }
      }
      if (!this.$store.state.eventPushStore.eventId && that.dataFilter.indexOf('Distance') !== -1) {
        that.dataFilter.splice(that.dataFilter.indexOf('Distance'), 1);
      }
    } else {
      if (
        that.data &&
        that.data.attributeSet &&
        that.data.attributeSet.attributes
      ) {
        that.dataAttributes = that.data.attributeSet.attributes;
        that.getData(that.dataAttributes);
      } else {
        that.getData(that.data);
      }
    }
    if (dataDeal[that.popUpType].HasEcharts) {
      this.$nextTick(() => {
        // 发起房屋数据请求
        that.addEarthquakeHouseInfo();
      });
    }
  }

  // 发起房屋数据请求
  private async addEarthquakeHouseInfo() {
    const that: any = this;
    const res: any = await installDisasterJudgeServer.quickJudgeServer.getEarthquakeHouseInfo({
      pac: (that.data.tag && that.data.tag.adcode) || '',
    });
    this.getOption(res);
  }

  // 发起林火相关区县详情
  private async getForestFireDetail() {
    const that: any = this;
    const res: any = await installDisasterJudgeServer.quickJudgeServer.getForestFireDetail({
      districtCode: (that.data.tag && that.data.tag.adcode) || '370600',
    });
    this.list = Object.assign(this.list, res.data);
    that.dataFilter.splice(that.dataFilter.findIndex((item: any) => item === 'HouseFlag'), 1);
    that.dataFilter = that.dataFilter.concat(dataDeal[this.popUpType].extendFilter);
  }
}
</script>
<style lang="less" scoped>
@url: '../../../../assets/img/eventInfo';
@popdialog: '../../../../assets/img/popdialog';
@closebg: '../../../../assets/img/halfScreen/eventAndTopics';

.eventInfoPop {
  width: 560px;
  height: 900px;
  z-index: 4;
  cursor: pointer;
  color: #fff;
  // 刘云梦2022/2/21-左侧面板默认不关闭，详情弹窗右移
  margin-left: 500px;

  .echartsLi {
    width: 100%;
    height: 360px;
  }
  .echartsClass {
    background: transparent !important;
    display: block;
  }
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
