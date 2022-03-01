<template>
  <!--工情监测  -->
  <div class="panelPublicDefault EngineeringMonitor">
    <div class="panelPublicDefault_hd">
      <!-- ({{ count }}) -->
      <span class="title-panel">工情监测</span>
    </div>
    <div class="panelPublicDefault_bd">
      <ul class="statisticList">
        <li
          class="statisticList_li f-tit-h2"
          :class="[{ checkSty: activeType == item.name }, 'item']"
          v-for="(item, index) in typeList"
          :key="index"
          @click="tab(item)"
        >
          <div>{{ item.name }}</div>
          <div class="total">
            <span class="statisticList_li_textWarning f-number">{{
              item.total ? item.total : 0
            }}</span
            >个
          </div>
        </li>
      </ul>
      <div class="statisticList-title">
        <span class="f-tit-h2"> 工程列表 </span>
        <!-- <span class="echartIcon"></span> -->
      </div>
      <!-- 搜索 start-->
      <el-input
        class="csmMyInput"
        type="text"
        v-model.trim="searchValue"
        @input="search(searchValue)"
      >
        <i
          slot="suffix"
          class="iconSelf_search"
          @click="search(searchValue)"
        ></i>
      </el-input>
      <!-- 搜索 end-->

      <div class="dataList">
        <div class="nodata" v-if="!tableData.length">
          <img src="../../../../assets/img/default/panel/noData.png" />
        </div>
        <div v-else class="ulBox">
          <el-scrollbar>
            <ul class="listBoxSingle">
              <li
                class="f-txt-com listBoxSingle_li"
                v-for="(item, index) in tableData"
                :key="item.id"
                @click="openProp(item, index)"
                :class="{ checkSty: activeIndex === item.id }"
              >
                <p class="teamName">
                  <span class="orderNum">{{
                   indexMethod(index)
                  }}</span>
                  {{ item.name }}
                  </p>
                <p class="teamDistance">
                  <span
                    >地址：<span>{{
                      item.address ? item.address : '- -'
                    }}</span></span
                  >
                </p>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="pagination" v-if="tableData.length">
            <el-pagination
              class="constomMyElPage"
              small
              :pager-count="5"
              :current-page.sync="paginationObj.currentPage"
              @current-change="handleCurrentChange"
              :page-size="paginationObj.pageSize"
              layout="prev, pager, next, total"
              :total="paginationObj.total"
            ></el-pagination>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { engineeringSituationServer } from '@/api/feature/monitorwarning/installServer';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
/**
 * 监测预警
 */
@Component({
  name: 'EngineeringMonitor',
  mixins: [MapCommon],
})
export default class EngineeringMonitor extends Vue {
  // 接收 检测总数
  // @Prop() private count!: number;
  private typeList: any = [
    { name: '全部', total: 0, type: 'all' },
    // { name: '堤防', total: 0, type: 'bundpitch' },
    { name: '泵站', total: 0, type: 'dianpaizhan' },
    { name: '船闸', total: 0, type: 'chuanzha' },
    { name: '水电站', total: 0, type: 'shuidianzhan' },
    { name: '水闸', total: 0, type: 'shuizha' },
  ];
  private activeType = '全部'; // 选择的类型的序号
  private searchValue: string = '';
  private activeIndex: any = false;
  private tableData: any = [];
  // 分页
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();

  // 获取列表数据服务的参数
  private requestData: any = {
    keyWord: '',
    nowPage: 1,
    pageSize: 10,
    type: '',
  };
  private timer: any = ''; // 延时搜索

  public indexMethod(index: number) {
    return (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize + (index + 1);
  }

  private showJsl1(val: any) {
    // const data = {
    //   key: 'LiftMonitoring',
    //   isShow: true,
    // };
    // this.$store.dispatch('configModel/updateLegendItem', data);
    this.$store.commit('mapTools/addSelectedLayer', {
      id: val,
      name: '工情监测站',
      play: false,
      legend: { component: val },
    });
  }
  private created() {
    this.getStat();
    this.getStationsList();
    this.showJsl1('LiftMonitoring');
  }

  private mounted() {
    (this as any).resolveMap('map').then(() => {
      this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
      this.getComponent().load();
    });
  }

  private beforeDestroy() {
    //  清除工情图层
    this.getComponent().removeResource('work');
    this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().unload();
    clearTimeout(this.timer); // 清除延迟搜索的定时器
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
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
      moduleTypeID: 'workMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  private async getStat() {
    // 获取工情描述信息
    const res: any = await engineeringSituationServer.getStat({});
    this.typeList.forEach((item: any) => {
      item.total = res.data[item.type];
    });
    this.paginationObj.total = res.data.all;
  }
  private async getStationsList(flag: any = true) {
    if (flag) {
      this.getComponent().addResource_Work({
        keyWord: this.requestData.keyWord,
        type: this.requestData.type,
        overThreshold: this.requestData.overThreshold,
      });
    }
    // 获取工情列表数据
    const res: any = await engineeringSituationServer.getStationsList(
      this.requestData,
    );
    this.tableData = res.data;
    this.paginationObj.total = res.total;
    console.log(res, 'resresres');
  }
  private tab(item: any) {
    if (this.activeType === item.name) {
      return;
    }
    this.searchValue = '';
    this.activeType = item.name;
    this.requestData.nowPage = 1;
    this.paginationObj.currentPage = 1;
    this.requestData.keyWord = '';
    if (item.type === 'all') {
      this.requestData.type = '';
    } else {
      this.requestData.type = item.type;
    }
    this.getStationsList();
  }
  private search(val: any) {
    // 搜索
    if (this.requestData.keyWord === val) {
      return;
    }
    this.requestData.keyWord = val;
    this.requestData.nowPage = 1;
    this.paginationObj.currentPage = 1;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getStationsList();
    }, 800);
  }

  private openProp(item: any, index: any) {
    this.activeIndex = item.id;
    this.getComponent().locate('work', 'id', item.id);
  }
  // 分页点击
  private handleCurrentChange(val: number) {
    this.paginationObj.currentPage = val;
    this.requestData.nowPage = val;
    this.getStationsList(false);
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../../assets/img/monitorWarning';
@url: '../../../../assets/img/halfScreen/firePoint';
.panelPublicDefault {
  height: 99% !important;
}
.EngineeringMonitor {
  // width: 100%;
  .nodata {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-scrollbar {
    width: 100%;
    height: 100%;
  }
  .pagination {
    display: flex;
    justify-content: center;
  }
  .dataList{
        height: calc(100% - 488px);
    overflow: hidden;
  }
  .ulBox{
    height: 100%;
    overflow: hidden;
  }
  .influenceList_innr_before{
    height: calc(100% - 486px);
    overflow: hidden;
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
}
</style>
