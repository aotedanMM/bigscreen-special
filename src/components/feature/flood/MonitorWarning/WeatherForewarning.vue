<template>
  <!-- 气象预警面板 -->
  <div class="panelPublicDefault water-monitor-panel">
    <div class="panelPublicDefault_hd">
      <span class="title-panel">预警信息</span>
    </div>
    <!-- 数据统计 -->
    <div class="panelPublicDefault_bd">
      <div class="statisticList">
        <div
          class="statisticList_li f-tit-h2"
          :class="{ checkSty: currentTab === 0 }"
          @click="changeTab(0, { lable: '全部' })"
        >
          <span>全部</span>
          <div>
            <span class="statisticList_li_textWarning f-number">{{
              countDataTotal || 0
            }}</span
            >个
          </div>
        </div>
        <div class="statisticListEL">
          <!-- <el-scrollbar style="height:100%"> -->
          <div
            class="statisticList_li f-tit-h2"
            v-for="(item, index) in tabList"
            :key="index"
            :class="{ checkSty: currentTab === index + 1 }"
            @click="changeTab(index + 1, item)"
          >
            <span>{{ item.label }}</span>
            <div
              v-if="item.children && item.children.length > 0"
              class="iconBox"
            >
              <div
                v-for="(itemChild, indexChild) in item.children"
                :key="indexChild"
                @click.stop="
                  childrenClick(indexChild, itemChild, item, index + 1)
                "
              >
                <el-badge :value="itemChild.count" class="item">
                  <template>
                    <div
                      :class="
                        itemChild.checked
                          ? `active ${itemChild.levelEnglish + item.key}`
                          : itemChild.levelEnglish + item.key
                      "
                      class="icon"
                    ></div>
                  </template>
                </el-badge>
              </div>
            </div>
            <div v-else>暂无预警</div>
          </div>
          <!-- </el-scrollbar> -->
        </div>
      </div>
      <div class="statisticList-title">
        <span class="f-tit-h2">预警列表</span>
      </div>
      <!-- 搜索 end-->
      <div class="list">
        <div class="listBox" v-if="siteList && siteList.length > 0">
          <el-scrollbar style="height:100%">
            <ul class="listBoxSingle">
              <li
                class="f-txt-com weather_li listBoxSingle_li"
                :class="{ active: activeIndex === index }"
                v-for="(item, index) in siteList"
                :key="index"
                @click="openProp(item, index)"
              >
                <p
                  class="EventMessage-content-right-content"
                  style="display: flex;"
                >
                  <span
                    :class="item.levelEnglish + item.typeCodeChinese"
                    class="icon"
                  ></span>
                  <span class="f-txt-com f-txt-content" :title="item.cont">
                    {{ item.cont }}
                  </span>
                </p>
                <p class="EventMessage-content-right-p f-txt-com">
                  <span class="orderNum">{{
                   indexMethod(index)
                  }}</span>
                  <span class="EventMessage-content-right-location">{{
                    dateFormat('YYYY-mm-dd HH:MM', new Date(item.time))
                  }}</span>
                </p>
              </li>
            </ul>
            <div class="txt-com">
              <span>数据来源：中国气象局</span>
              <br />
              <span
                >数据更新时间：{{
                  dateFormat('YYYY-mm-dd HH:MM', new Date(siteList[0].time))
                }}</span
              >
            </div>
          <div class="pagination" v-show="siteList && siteList.length > 0">
            <el-pagination
              class="constomMyElPage"
              small
              :pager-count="5"
              :current-page.sync="optsData.nowPage"
              @current-change="handleCurrentChange"
              :page-size="optsData.pageSize"
              layout="prev, pager, next, total"
              :total="total"
            ></el-pagination>
          </div>
          </el-scrollbar>
        </div>
        <div class="nodata" v-else>
          <img src="../../../../assets/img/default/panel/noData.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { warningInfoServer } from '@/api/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import publishObjectPath from '@/util/configRegistry';
import { getDateFormat } from '@/util/tools';
/**
 * 监测预警
 */
@Component({
  name: 'WaterMonitor',
})
export default class WaterMonitor extends Vue {
  // 接收 检测总数
  @Prop() private count!: number;
  private tabList: any = [
    {
      label: '暴雨',
      checked: false,
      key: 'baoyu',
      type: '11B03',
      children: [],
    },
    {
      label: '大风',
      checked: false,
      key: 'dafeng',
      type: '11B06',
      children: [],
    },
    {
      label: '台风',
      key: 'taifeng',
      type: '11B01',
      checked: false,
      children: [],
    },
    {
      label: '雷电',
      key: 'leidian',
      type: '11B14',
      checked: false,
      children: [],
    },
    {
      label: '冰雹',
      key: 'bingbao',
      type: '11B15',
      checked: false,
      children: [],
    },
    {
      label: '地灾',
      checked: false,
      key: 'dizhai',
      type: '11B37',
      children: [],
    },
  ];
  // 父级栏选中的index
  private currentTab: number = 0;
  // 选中统计数用于判断
  private num: number = 0;
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  // 全部总数
  private countDataTotal: any = '';

  // 气象预报点列表数据
  private siteList: any[] = [];

  // 列表查询
  private optsData: any = {
    type: [],
    nowPage: 1,
    pageSize: 10,
    startTime: getDateFormat({ last: 'week' }), //  oneDay
    endTime: getDateFormat(),
    searchType: '1',
    districtCode: publishObjectPath.value.district.root,
  };
  private initType: any = [
        {
          code: '11B06',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B03',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B01',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B14',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B15',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B37',
          level: '红色,橙色,黄色,蓝色',
        },
      ];
  // 分页
  private total: any = 0;

  // 列表选中的项
  private activeIndex: any = -1;
  public indexMethod(index: number) {
    return (this.optsData.nowPage - 1) * this.optsData.pageSize + (index + 1);
  }
  private created() {
    this.getCountData();
    this.optsData.type = this.initType;
    this.getSiteList(this.optsData, true);
  }

  private mounted() {
    this.getComponent().on('weatherWarningLayer_popup', this.popupData, this);
    // console()
  }
  // 地图定点回调
  private popupData(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'weatherMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 离开页面清理地图
  private beforeDestroy() {
    this.getComponent().removeResource();
  }
  // 获取类型统计
  private async getCountData() {
    const opts = {
      type: '11B06,11B03,11B01,11B14,11B15,11B37',
      startTime: getDateFormat({ last: 'week' }), //  oneDay
      endTime: getDateFormat(),
      districtCode: publishObjectPath.value.district.root,
      searchType: '1',
    };
    const res: any = await warningInfoServer.getWeatherWarningStatic(opts);
    console.log(res, 'ressss22222222');
    this.countDataTotal = res.total;
    const mapLevel: any = {
      红色: 'red',
      橙色: 'orange',
      黄色: 'yellow',
      蓝色: 'blue',
    };
    for (const item of this.tabList) {
      if (res.data.hasOwnProperty(item.type)) {
        item.children = res.data[item.type];
        item.children.forEach((val: any) => {
          val.checked = false;
          val.levelEnglish = mapLevel[val.signallevel];
        });
      }
    }
    this.tabList.sort((a: any, b: any) => {
      const bNum = b.children ? b.children.length : 0;
      const aNum = a.children ? a.children.length : 0;
      return bNum - aNum; // 降序排列，return a-b; —>升序排列
    });
  }
  // 获取监测点列表数据
  private async getSiteList(opts: any, flag?: any) {
    console.log(opts, 1111);
    const mapLevel: any = {
      红色: 'red',
      橙色: 'orange',
      黄色: 'yellow',
      蓝色: 'blue',
    };
    const typeCodeList: any = {
      '11B06': 'dafeng',
      '11B03': 'baoyu',
      '11B01': 'taifeng',
      '11B14': 'leidian',
      '11B15': 'bingbao',
      '11B37': 'dizhai',
    };
    const res: any = await warningInfoServer.getWeatherWarningList(opts);
    if (flag) {
      this.getComponent().addResource(opts);
    }
    res.data.forEach((item: any) => {
      item.typeCodeChinese = typeCodeList[item.typeCode];
      item.levelEnglish = mapLevel[item.signallevel];
      switch (item.signallevel) {
        case '红色':
          item.levelNum = 4;
          break;
        case '橙色':
          item.levelNum = 3;
          break;
        case '黄色':
          item.levelNum = 2;
          break;
        case '蓝色':
          item.levelNum = 1;
          break;

        default:
          break;
      }
    });
    this.siteList = res.data;
    this.siteList.sort((a: any, b: any) => {
      return b.levelNum - a.levelNum; // 降序排列，return a-b; —>升序排列
    });
    this.total = res.total * 1;
    console.log(this.siteList, 11111111111);
  }

  // 父级栏点击效果
  private changeTab(index: number, item: any) {
    // 每次切换的时候还原数据checked状态
    this.tabList.forEach((itemKey: any) => {
      itemKey.checked = false;
      if (itemKey.children && itemKey.children.length > 0) {
        itemKey.children.forEach((key: any) => {
          key.checked = false;
        });
      }
    });
    // 每次点击还原optsData
    this.optsData = {
      type: [],
      nowPage: 1,
      pageSize: 10,
      startTime: getDateFormat({ last: 'week' }), //  oneDay
      endTime: getDateFormat(),
      districtCode: publishObjectPath.value.district.root,
      searchType: '1',
    };
    if (item.lable !== '全部') {
      item.checked = !item.checked;
      if (item.checked) {
        this.currentTab = index;
        let keyLevel = '';
        if (item.children && item.children.length > 0) {
          this.num = item.children.length;
          const len = item.children.length;
          for (let i = 0; i < len; i++) {
            item.children[i].checked = true;
            keyLevel += item.children[i].signallevel + ',';
          }
        }
        const opts = {
          code: item.type,
          level: keyLevel.substring(0, keyLevel.lastIndexOf(',')),
        };
        this.optsData.type = [];
        this.optsData.type.push(opts);
        this.getSiteList(this.optsData, true);
      }
      //  else {
      //   this.num = 0
      //   if(item.children&&item.children.length>0) {
      //     item.children.forEach((item: any)=>{
      //       item.checked = false
      //     })
      //   }
      // }
    } else {
      this.currentTab = index;
      this.optsData.type = this.initType;
      this.getSiteList(this.optsData, true);
    }
  }
  /**
   * 小图标点击方法
   * @param index 当前点击的index
   * @param item 当前子级单个类
   * @param itemAll 当前父级所有数据
   * @param fatherIndex 当前父级的index
   */
  private childrenClick(index: any, item: any, itemAll: any, fatherIndex: any) {
    this.optsData = {
      type: [],
      nowPage: 1,
      pageSize: 10,
      startTime: getDateFormat({ last: 'week' }), //  oneDay
      endTime: getDateFormat(),
      districtCode: publishObjectPath.value.district.root,
      searchType: '1',
    };
    item.checked = !item.checked;
    // 小图标点击不在同一个父节点上时逻辑
    if (fatherIndex !== this.currentTab) {
      // 清理选中的index
      this.currentTab = -1;
      // 修改选中状态及选中的个数
      this.tabList.forEach((itemKey: any) => {
        if (itemKey.children && itemKey.children.length > 0) {
          if (itemAll.label !== itemKey.label) {
            itemKey.children.forEach((key: any) => {
              if (key.checked) {
                this.num--;
              }
              key.checked = false;
            });
          }
        }
      });
    }
    if (item.checked) {
      ++this.num;
      if (this.num === itemAll.children.length) {
        itemAll.checked = true;
        this.currentTab = fatherIndex;
      }
    } else {
      this.num--;
      if (this.num === 0) {
        this.currentTab = -1;
      }
    }
    // 发送请求
    let keyLevel = '';
    const len = itemAll.children.length;
    for (let i = 0; i < len; i++) {
      if (itemAll.children[i].checked) {
        keyLevel += itemAll.children[i].signallevel + ',';
      }
    }
    if (this.num === 0) {
      this.changeTab(0, { lable: '全部' });
    } else {
      const opts = {
        code: itemAll.type,
        level: keyLevel.substring(0, keyLevel.lastIndexOf(',')),
      };
      this.optsData.type = [];
      this.optsData.type.push(opts);
      this.getSiteList(this.optsData, true);
    }
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
  // 分页点击
  private handleCurrentChange(val: number) {
    this.siteList = [];
    this.optsData.nowPage = val;
    this.getSiteList(this.optsData, true);
  }
  // 列表点击
  private openProp(item: any, index: any) {
    this.activeIndex = index;
    this.getComponent().locatePoint('id', item.id);
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'weatherWarning',
    );
    return component;
  }
}
</script>

<style lang="less">
@imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
.water-monitor-panel {
  .el-scrollbar__thumb {
    background-color: rgba(144, 147, 153, 0.5);
    &:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
  }
  .el-dialog__wrapper {
    width: 1920px !important;
  }
  .el-dialog {
    background: transparent;
    box-shadow: none;
  }
  .el-dialog__body {
    background: url('@{imgPath}/centerBg-.png') no-repeat center / 100% 100%;
    width: 100%;
    padding-bottom: 0px;
    padding-top: 10px;
  }
  .el-dialog__header {
    background: url('@{imgPath}/topbg-.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
  }
  .el-dialog__footer {
    background: url('@{imgPath}/botBg-.png') no-repeat;
    background-size: 100% 100%;
    width: 105.3%;
    height: 38px;
  }
  .el-dialog__title {
    font-weight: 600;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.2);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-left: 20px;
  }
  .el-dialog__headerbtn {
    background: url('@{imgPath}/closeBtn.png') no-repeat;
    background-size: 100% 100%;
    width: 86px;
    height: 41px;
    background-size: 100% 100%;
    right: -30px;
    top: 3px;
    &:hover {
      background: url('@{imgPath}/closeHover.png') no-repeat;
      background-size: 100% 100%;
    }
    .el-dialog__close {
      display: none;
      &:hover {
        color: transparent;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../../assets/img/monitorWarning';
@url: '../../../../assets/img/halfScreen/firePoint';
@imgUrl: '../../../../assets/img/weatherForewarning';
// @imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
@panel-padding: 10px;
.panelPublicDefault {
  height: 99% !important;
}
.c-sky {
  color: skyblue;
}
.c-orange {
  color: orange;
}
.c-tomato {
  color: tomato;
}
.c-red {
  color: red;
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
  .nodata {
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .updateTime {
    color: #abbfcb;
    position: absolute;
    right: 0px;
    margin-right: 20px;
    font-size: 20px;
  }
}
.statisticList {
  .statisticListEL {
    // height: 194px;
    overflow: hidden;
  }
}
.list {
  height: calc(100% - 520px);
}
.listBox {
  height: 100%;
 overflow: hidden;
  ul {
    .weather_li {
      height: 123px;
      margin-top: 14px;
      padding: 20px 10px 10px 10px;
      cursor: pointer;
      &.active {
        border-radius: 5px;
        background: url('@{imgUrl}/listbj.png');
        background-size: 100% 100%;
        .EventMessage-content-right-location {
          background: url('../../../../assets/img/eventInfo/jubg.png');
          background-size: 100% 100%;
          color: #e5f4ff;
        }
        p {
          color: #e5f4ff;
        }
      }
      .icon {
        display: inline-block;
        width: 58px;
        height: 48px;
        margin-right: 10px;
      }
      .EventMessage-content-right-p {
        position: relative;
        margin-top: 20px;
      }
      .orderNum {
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
      .EventMessage-content-right-location {
        display: inline-block;
        // background: url('../../../../assets/img/eventInfo/locationbg.png');
        // background-size: 100% 100%;
        line-height: 1.1;
        padding: 5px;
        margin-left: 20px;
        color: #bbd0dc;
      }
      .EventMessage-cont-hd-oTime {
        color: #52728c;
        white-space: nowrap;
      }
      .f-txt-content {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        width: 274px;
        height: 70px;
      }
    }
  }
  .txt-com {
    font-size: calc(20px * 1.3);
    color: #8cafd0;
  }
}
.statisticList_li {
  .iconBox {
    display: flex;
    align-items: center;
    padding-right: 12px;
    .icon {
      width: 44px;
      height: 38px;
      margin-left: 12px;
      margin-top: 6px;
      &.active {
        border: 1px solid yellow;
      }
    }
  }
}
.redbaoyu {
  background: url('@{imgUrl}/redbaoyu.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.yellowbaoyu {
  background: url('@{imgUrl}/yellowbaoyu.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.orangebaoyu {
  background: url('@{imgUrl}/orangebaoyu.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.bluebaoyu {
  background: url('@{imgUrl}/bluebaoyu.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.reddafeng {
  background: url('@{imgUrl}/reddafeng.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.yellowdafeng {
  background: url('@{imgUrl}/yellowdafeng.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.orangedafeng {
  background: url('@{imgUrl}/orangedafeng.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.bluedafeng {
  background: url('@{imgUrl}/bluedafeng.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.redtaifeng {
  background: url('@{imgUrl}/redtaifeng.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.yellowtaifeng {
  background: url('@{imgUrl}/yellowtaifeng.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.orangetaifeng {
  background: url('@{imgUrl}/orangetaifeng.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.bluetaifeng {
  background: url('@{imgUrl}/bluetaifeng.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.redleidian {
  background: url('@{imgUrl}/redleidian.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.yellowleidian {
  background: url('@{imgUrl}/yellowleidian.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.orangeleidian {
  background: url('@{imgUrl}/orangeleidian.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.blueleidian {
  background: url('@{imgUrl}/blueleidian.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.redbingbao {
  background: url('@{imgUrl}/redbingbao.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.yellowbingbao {
  background: url('@{imgUrl}/yellowbingbao.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.orangebingbao {
  background: url('@{imgUrl}/orangebingbao.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.bluebingbao {
  background: url('@{imgUrl}/bluebingbao.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.reddizhai {
  background: url('@{imgUrl}/reddizhai.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.yellowdizhai {
  background: url('@{imgUrl}/yellowdizhai.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.orangedizhai {
  background: url('@{imgUrl}/orangedizhai.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.bluedizhai {
  background: url('@{imgUrl}/bluedizhai.png') no-repeat 0 0;
  background-size: 100% 100%;
}
</style>
