<template>
  <!-- :style = "{marginTop: -popHeight + 'px'}" -->
  <div class="repersityDetailPop" v-if="repersityShow">
    <div
      class="common-detailContainer sy-repersity-detaileContainer"
      id="sy-reposity-detail-container"
    >
      <div class="sy-repersity-detaileTitle title-title-title">
        <span :title="name">{{ name }}</span>
        <a
          @click="close()"
          href="javascript:;"
          class="detail-container-close"
          name="detailclose"
        ></a>
      </div>
      <div class="common-detailContent">
        <div class="sy-reposity-content">
          <div class="sy-repersity-detailListBox box-box-box">
            <el-scrollbar wrap-style="height:100%;max-height: 450px;">
              <ul
                :class="['list-ul', materials.length ? 'borderTop' : '']"
                v-if="list"
              >
                <li class v-for="item of dataFilter" :key="item">
                  <span class="risk_level fulllabel">
                    {{ labelObj[item] }}:
                    <b
                      :class="
                        labelObj[item] &&
                        labelObj[item].indexOf('安全风险等级') !== -1
                          ? 'enterprise_basic_right_0' + list[item]
                          : ''
                      "
                      :title="list[item] + unitObj[item]"
                    >
                      {{ list[item] || '暂无数据' }} {{ unitObj[item] }}
                      <!-- src="../../../../assets/img/eventInfo/icon_phone.png" -->
                      <img
                        v-if="list[item] && telobj[item]"
                        src="../../../../assets/img/eventInfo/telphoon.png"
                        class="callPhoneCur principalCall"
                        @click.stop="
                          handleClickCallup(list, list[item], $event)
                        "
                      />
                    </b>
                  </span>
                </li>
              </ul>
              <ul
                class="content-content-content clearfloat"
                v-if="materials.length !== 0"
              >
                <li class="halfLi" v-for="(item, key) in materials" :key="key">
                  <span>
                    <b>{{ item.name }}:</b>
                    <b :title="item.value + item.unit"
                      >{{ item.value }} {{ item.unit }}</b
                    >
                  </span>
                </li>
              </ul>
              <div
                class="sy-repersity-detailListRight"
                id="rep_dis"
                style="display: none;"
              >
                <p>
                  距离事发地:
                  <span></span>
                </p>
              </div>
            </el-scrollbar>
            <div class="managementBtn">
              <InEventInfo
                :closeFunc="closeFunc"
                :vueThis="vueThis"
                v-if="data.isEventBtn"
                :popupData="data"
              ></InEventInfo>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { rescueTeamServer } from '@/api/installServer';
import { getDateFormat } from '@/util/tools';
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
import searchReosurce from '@/api/feature/searchresource/installSearchReosurce';
import InEventInfo from '@/components/feature/gisModule/popUp/btnComponent/inEventInfo.vue';
import MultiuleQueryParamConfigList_yt from '@/gis/normal/resource/MultiuleQueryParamConfigList_yt';
import { nomalLeftServer, multiuleInterfaceServer } from '@/api/installServer';
type NewType = undefined;

@Component({
  name: 'RepersityDetailPop',
  mixins: [popDataDeal],
  components: {
    InEventInfo,
  },
})
export default class RepersityDetailPop extends Vue {
  @Prop() public repersityDetailPop: any;
  public name: any;
  public dataFilter: any = [
    'NAME',
    'ADDRESS',
    'DISTRICT',
    'ORGNAME',
    'CONCATEMOBTEL',
    'CONCATEPER',
    'CAPACITY',
    'LEVELNAME',
  ];
  public dataObj: any;
  public list: [] = [];
  public dataAttributes: any;
  public styles: any = {};
  public popUpType: any;
  public geometry: any;
  public coordinates: any;
  public geoPoint: any = [];
  public dataChild: any;
  public dataTag: any;
  public materials: any = [];
  public popHeight: any = 0;
  public dataDeal: any = dataDeal;
  public repersityShow: boolean = false;
  private getDataFilter(val: any) {
    return this.dataFilter.includes(val);
  }
//  地图组件
  private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent_left',
     );
    return component;
  }
  private getData() {


    const that = this;
    this.dataAttributes.forEach(function(item: any, index: any) {
      that.dataObj = {};
      if (item.name && item.name === 'NAME') {
        that.name = item.value;
      }
      that.dataObj.name = item.name;
      that.dataObj.value = item.value;
      that.$set(that.list, index, that.dataObj);
    });
  }
   // gis方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewRepertory',
    );
    return component;
  }
  private getDataList() {
    const text: any = null;
    const typeArr: any = null;
    const objname = 'repository';
    const showResourceOpts: any = {
      keyword: '',
      districtCode: this.$store.state.dataFilterControl.filter.districtCode,
    };
    // 前端分页列表的参数，其中行政区划过滤和geometry过滤
    const queryParam: any = {
      pageSize: '999',
      pageIndex: 1,
      resourceKey: 'meterialinfo',
      id: this.data.id,
    };
    if (this.$store.state.dataFilterControl.filter.geometry) {
      const jsonObj = JSON.parse(
        this.$store.state.dataFilterControl.filter.geometry,
      );
      showResourceOpts.geometry = jsonObj;
      queryParam.geometry = jsonObj;
    }
    multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
      this.messsageBus.emit('tableData', res.list);
      this.messsageBus.emit('rescueTeamHomeData', this.data);
      this.materials = res.list;
    });
    // searchReosurce.resourceServer
    //   .getMaterialByReposityId({
    //     pageSize: '999',
    //     pageIndex: 1,
    //     resourceKey: "meterialinfo",
    //     id:this.data.id
    //   })
    //   .then((result: any) => {
    //     debugger
    //     this.materials = result;
    //   });
  }
  private calcHeight() {
    this.popHeight = $('.rescueForcesPop').innerHeight();
    this.popHeight += 40;
  }
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any) {
    this.messsageBus.emit('showCallup', true, listObj, val, event);
  }
  private mounted() {
    // debugger;
    const that: any = this;
    that.popUpType = that.type;
    this.calcHeight();
    that.setGeomPoint(); // 设置当前点位经纬度给geoPoint
    if (that.styleObj) {
      that.styles = that.styleObj;
    }
    if (that.getPathTypeFilter(that.popUpType)) {
      that.isShowPathPlanning();
    }
    if (that.getAroundTypeFilter(that.popUpType)) {
      that.isShowAroundAnalysis();
    }
    if (dataDeal[that.popUpType]) {
      that.popHeight = dataDeal[that.popUpType].popHeight;
      that.unitObj = dataDeal[that.popUpType].unitObj;
      that.dataFilter = dataDeal[that.popUpType].dataFilter;
      that.labelObj = dataDeal[that.popUpType].labelObj;
      that.telobj = dataDeal[that.popUpType].telobj
        ? dataDeal[that.popUpType].telobj
        : that.telobj;
      that.btnFilter = dataDeal[that.popUpType].btnFilter
        ? dataDeal[that.popUpType].btnFilter
        : that.btnFilter;
      dataDeal[that.popUpType].cb(that);
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
  }

  private created() {
    // debugger;
    this.getDataList();
  }
}
</script>
<style lang="less" scoped>
@popdialog: '../../../../assets/img/popdialog';
@eventInfo: '../../../../assets/img/eventInfo';
a,
a:link {
  color: #333;
  text-decoration: none;
}
ul,
li {
  list-style: none;
}
em,
i,
b,
strong {
  font-weight: normal;
  font-style: normal;
}
.repersityDetailPop {
  color: #fff;
  font-size: 20px;
  // margin-left: -290px;
  .title-title-title {
    width: 584px;
    height: 68px;
    line-height: 80px;
    font-size: 28px;
    font-weight: bold;
    color: #ffde00;
    background: url('@{eventInfo}/headRescue.png') no-repeat;
    padding-left: 61px;
    position: relative;
    span {
      display: inline-block;
      width: 86%;
      height: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .common-detailContent {
    width: 584px;
    background: url('@{eventInfo}/contentRescue.png') repeat-y;
    min-height: 320px;
    max-height: 480px;
  }

  .sy-repersity-detaileContainer:after {
    content: '';
    height: 44px;
    width: 584px;
    background: url('@{eventInfo}/footRescue.png') no-repeat;
    display: block;
  }

  .sy-reposity-content {
    padding: 0 25px;
  }

  .list-ul {
    width: 530px;
    li:nth-child(even) {
      background: rgba(43, 191, 252, 0.1);
    }
    li {
      color: #00e8fd;
      font-size: 28px;
      padding-left: 10px;
      line-height: 51px;
      display: flex;
      span {
        display: inline-block;
        b {
          color: #fbffff;
          padding-left: 10px;
        }
      }

      .callPhoneCur {
        cursor: pointer;
      }
    }
  }
  .content-content-content {
    width: 530px;
    li:nth-child(even) {
      background: rgba(43, 191, 252, 0.1);
    }
    li {
      color: #00e8fd;
      font-size: 28px;
      padding-left: 10px;
      line-height: 51px;
      display: flex;
      span {
        display: inline-block;
        b {
          color: #fbffff;
          padding-left: 10px;
        }
      }
    }
    .halfLi {
      width: calc(50% - 10px);
      float: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        width: 100%;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        b:first-child {
          color: #00e8fd;
          padding-left: 0px;
        }
        b:last-child {
          color: #fbffff;
          padding-left: 10px;
        }
      }
    }
    .halfLi:nth-child(even) {
      background: rgba(43, 191, 252, 0);
    }
    .halfLi:nth-child(4n) {
      background: rgba(43, 191, 252, 0.1);
    }
    .halfLi:nth-child(4n-1) {
      background: rgba(43, 191, 252, 0.1);
    }
  }
  .clearfloat:after {
    display: block;
    clear: both;
    content: '';
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    zoom: 1;
  }

  .sy-allphone {
    position: relative;
    top: 2px;
    left: 13px;
  }

  .detail-container-close {
    position: absolute;
    right: 70px;
    top: 11px;
    width: 101px;
    height: 51px;
    background: url('@{eventInfo}/close.png') no-repeat;
    cursor: pointer;
  }
  .sy-repersity-detailListRight {
    position: absolute;
    right: 40px;
    bottom: -10px;
  }
  .managementBtn {
    text-align: right;
    margin-right: 10px;
  }
}
</style>
