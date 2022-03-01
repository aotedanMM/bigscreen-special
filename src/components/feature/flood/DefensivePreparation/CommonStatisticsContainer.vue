<!--风险隐患点的下钻页的容器组件-->
<template>
  <div class="CommonStatisticsContainer">
    <p class="title-panel">{{ compParam.name }}</p>
    <span class="halflist-back" @click="handleBackParent"></span>
    <div class="loading" v-if="loading"></div>
    <div v-else class="riskBoxDistrict_con">
      <div ref="riskBoxTop" class="riskBoxDistrict">
        <div class="riskBoxDistrict_title f-tit-h2">
          <span>各市区{{ compParam.name }}分布</span>
          <span class="f-number" @click="handleClickCityItem()">{{
            compParam.value
          }}</span>
          <span>{{ compParam.unit }}</span>
        </div>
        <el-scrollbar class="riskBoxDistrict_box">
          <ul>
            <li
              class="cityAreaList f-tit-h2"
              :class="item.isChecked ? 'active' : ''"
              v-for="(item, index) in riskCityList"
              :key="index"
              @click="handleClickCityItem(item)"
            >
              <span class="f-txt-com">{{ item.name }}</span>
              <span class="textWarning f-number">{{ item.count }}</span>
              <span>{{ compParam.unit }}</span>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div class="riskBoxDistrict">
        <div class="riskBoxDistrict_title f-tit-h2">
          <span>{{ compParam.name }}分布列表</span>
          <i
            @click="FnMinimize"
            :class="
              minimize ? 'panel_switch' : 'panel_switch panel-switch-reverse'
            "
          ></i>
        </div>
        <div v-show="minimize" class="riskBoxDistrict_main">
          <el-input
            class="csmMyInput"
            type="text"
            v-model.trim="inputValue"
            @input="search"
          >
            <i slot="suffix" class="iconSelf_search"></i>
          </el-input>
          <div class="riskBoxDistrict_list">
            <div class="nodata" v-if="!listDataAll.length" :style="{ height: listHeight + 'px' }">
              <img
                src="../../../../assets/img/default/panel/noData.png"
                alt
                srcset
              />
            </div>
            <div v-else>
              <el-scrollbar :style="{ height: listHeight + 'px' }">
                <div class="listBoxScrollbar">
                  <ul class="listBoxSingle">
                    <li
                      class="f-txt-com listBoxSingle_li"
                      v-for="(item, index) in listDataAll"
                      :key="index"
                      @click="handleClicAdress(item)"
                      :class="item.isChecked ? 'active' : ''"
                    >
                      <span class="li_index">{{
                        (pageData.page - 1) * pageData.size + (index + 1)
                      }}</span>
                      <span class="li_name" :title="item.name">{{
                        item.name
                      }}</span>
                    </li>
                  </ul>
                </div>
              </el-scrollbar>
              <el-pagination
                class="constomMyElPage"
                small
                :pager-count="5"
                :current-page.sync="pageData.page"
                @current-change="handleCurrentChange"
                :page-size="pageData.size"
                layout="prev, pager, next"
                :total="pageCount"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { riskServer } from '@/api/feature/defensiveprepation/installServer';
import { resourceServer } from '@/api/feature/defensiveprepation/installServer';
import { protectTargetServer } from '@/api/feature/defensiveprepation/installServer';
// import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'CommonStatisticsContainer',
  components: {},
  mixins: [MapCommon],
})
export default class CommonStatisticsContainer extends Vue {
  @Prop() private compParam: any;
  @Prop() private handleClick: any; // 父组件处理子组件的点击的方法
  private loading: boolean = true;
  private minimize: boolean = true;
  private listHeight: number = 315;
  private filters: any = {
    // 列表参数
    layerId: '',
    keyword: '',
    districtCode: '',
  };
  private pageData: any = {
    size: 10,
    page: 1,
  };
  private pageCount: number = 0; // f分页总条数
  private riskCityList: any = []; // 市区列表
  private listDataAll: any = []; // 市区分布列表
  private flag: boolean = false;
  private mapType: any = '';
  private timer: any = ''; // 延时搜索
  // 弹框模板
  // private popUpTemplate = new renderpopUpTemplate();
  private inputValue: any = '';

  private created() {
    console.log(this.compParam, 'propData');
    switch (this.compParam.name) {
      case '危险建筑':
        this.mapType = 'wxjz';
        break;
      case '地灾隐患':
        this.mapType = 'dzyh';
        break;
      case '山洪隐患':
        this.mapType = 'shyh';
        break;
      case '易涝路段':
        this.mapType = 'ylld';
        break;
      case '建筑工地':
        this.mapType = 'jzgd';
        break;
      case '涵闸':
        this.mapType = 'hz';
        break;
      case '内涝点':
        this.mapType = 'nld';
        break;
      case '电力设施':
        this.mapType = 'dlss';
        break;
      case '通讯设施':
        this.mapType = 'txss';
        break;
    }
    this.filters.layerId = this.compParam.code;
    if (this.compParam.parentParam.title === '防护目标') {
      this.flag = true;
    }
  }
  private mounted() {
    // this.getComponent().on('ResourceQuery_popup', this.popupData, this);
    this.getComponent().load();
    this.getRiskDetailData();
  }
  private beforeDestroy() {
    //  清除图层
    this.getComponent().removeResource(this.mapType);
    // this.getComponent().off('ResourceQuery_popup', this.popupData, this);
    this.getComponent().unload();
    clearTimeout(this.timer);  // 清除定时器
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.defensivePreparationFactory.getComponent(
      'ResourceQuery',
    );
    return component;
  }
  // 地图定点回调
  // private popupData(event: any) {
  //   if (!event.type && event.featureType) {
  //     event.type = event.featureType;
  //     const eventType = event.featureType;
  //   }
  //   const param = {
  //     that: this,
  //     popupId: 'ResourceQuery_popup_id', // 监听id，必须
  //     moduleTypeID: 'riskMonitor',
  //     styleObj: {
  //       // 选填
  //       'margin-bottom': '66px',
  //       'margin-left': '-205px',
  //     },
  //   };
  //   this.popUpTemplate.getParams(param);
  //   this.popUpTemplate.onShowPopup(event);
  // }
  // 获取市区数据
  private async getRiskDetailData() {
    const data: any = await resourceServer.getStaticByDistrict({
      layerId: this.filters.layerId,
    });
    // const data: any = await riskServer.getStatistics();
    console.log(data, '获取市区数据');
    this.loading = false;
    data.list.map((item: any) => {
      item.isChecked = false;
    });
    this.riskCityList = data.list.splice(0, 19);
    // this.getRiskDetailListData();
  }
  // 获取市区详情列表数据
  private async getRiskDetailListData(flag: any = true) {
    const param = {
      layerId: this.filters.layerId,
      keyword: this.filters.keyword,
      districtCode: this.filters.districtCode,
      page: this.pageData.page - 1,
      size: this.pageData.size,
    };
    console.log(param, '请求参数');
    if (flag) {
      this.getComponent().queryResource(this.mapType, this.filters);
    }
    let data: any = [];
    if (this.flag) {
      data = await protectTargetServer.getPageList(param);
    } else {
      data = await riskServer.getPageList(param);
    }
    console.log(data.list, '333333333');
    if (!data.list.length) {
      this.listDataAll = [];
      return;
    }
    data.list.map((item: any) => {
      item.isChecked = false;
    });
    // this.listHeight = 635 - (this.$refs.riskBoxTop as HTMLElement).offsetHeight;
    this.listDataAll = data.list;
    this.pageCount = data.count;
  }
  // 点击市区触发
  private handleClickCityItem(data: any) {
    this.riskCityList.map((item: any) => {
      item.isChecked = false;
    });
    if (data) {
      // 点击单个市区
      this.pageData.page = 1;
      this.filters.keyword = '';
      data.isChecked = true;
      this.filters.districtCode = data.code;
      this.inputValue = '';
    } else {
      // 点击总数
      this.pageData.page = 1;
      this.filters.districtCode = '';
      this.filters.keyword = '';
      this.inputValue = '';
    }
  }
  // 点击地址触发
  private handleClicAdress(data: any) {
    this.listDataAll.map((item: any) => {
      item.isChecked = false;
    });
    data.isChecked = true;
    this.getComponent().locate(this.mapType, 'id', data.id);
  }
  // 返回一级页面
  private handleBackParent() {
    // this.$emit("backParent");
    this.handleClick('DefensiveHome', JSON.parse(JSON.stringify({})));
  }
  // 列表展开收起
  private FnMinimize() {
    this.minimize = !this.minimize;
  }
  // 分页点击
  private handleCurrentChange(val: number) {
    this.pageData.page = val;
    this.getRiskDetailListData(false);
  }
  // 搜索
  private search(value: any) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.filters.keyword = value.trim();
      this.pageData.page = 1;
    }, 800);
  }
  // 列表参数更新
  @Watch('filters', { deep: true })
  private updateList(newVal: any, oldVal: any): void {
    this.getRiskDetailListData();
  }
}
</script>

<style lang="less" scoped>
.CommonStatisticsContainer {
  width: 365px;
  height: 855px;
  padding: 0px 15px 5px 15px;
  border-radius: 5px;
  position: relative;
  * {
    margin: 0;
    padding: 0;
  }
  .title-panel {
    font-style: italic;
    line-height: 35px;
  }
  .halflist-back {
    width: 61px;
    height: 25px;
    position: absolute;
    top: 10px;
    right: 6px;
    color: #338af8;
    cursor: pointer;
    z-index: 1;
    background: url('../../../../assets/img/default/panel/toBack.png') no-repeat
      0px 70%;
    background-size: 100% 100%;
    &:hover {
      background-image: url('../../../../assets/img/default/panel/toBack_h.png');
    }
  }
  .loading {
    color: #fff;
    background: url(../../../../assets/img/halfScreen/halflist/loading.gif)
      no-repeat 33px 255px;
    color: #d2e1ec;
    height: 100%;
  }

  .riskBoxDistrict_con {
    padding-top: 10px;
    height: calc(100% - 50px);
    .riskBoxDistrict {
      .riskBoxDistrict_title {
        position: relative;
        color: #67e1fb;
        letter-spacing: 1px;
        font-weight: normal;
        line-height: 60px;
        display: flex;
        &:after {
          content: '';
          background: url(../../../../assets/img/halfScreen/halflist/titlexian.png)
            50% 0 no-repeat;
          position: absolute;
          width: 100%;
          height: 23px;
          top: 54px;
          left: 0;
        }
        span:nth-child(1) {
          flex: 1;
        }
        span:nth-child(2) {
          font-style: italic;
          color: yellow;
          margin: 0 5px 0 10px;
          cursor: pointer;
        }
        span:nth-child(3) {
          color: #daf2ff;
        }
        .panel_switch {
          width: 34px;
          height: 29px;
          background-size: 100% 100%;
          position: absolute;
          right: 0px;
          top: 15px;
          cursor: pointer;
          background: url('../../../../assets/img/halfScreen/halflist/open.png')
            50% 50% no-repeat;
          transition: transform 0.3s;
        }
        .panel_switch.panel-switch-reverse {
          transform: scale(1, -1);
        }
      }
      .riskBoxDistrict_box {
        height: 250px;
        padding-top: 5px;
        .cityAreaList {
          display: flex;
          justify-content: space-between;
          color: #ffffff;
          background: url('../../../../assets/img/halfScreen/halflist/listbg.png')
            no-repeat -5px 50%;
          background-size: 100% 100%;
          padding: 10px;
          box-sizing: border-box;
          margin: 5px 0;
          cursor: pointer;
          &.active,
          &:hover {
            background-image: url('../../../../assets/img/halfScreen/halflist/listbghover.png');
          }
          .f-txt-com {
            flex: 1;
          }
          .textWarning {
            color: yellow;
            padding-right: 5px;
          }
        }
      }
      .riskBoxDistrict_main {
        display: block;
        width: 100%;
        .csmMyInput {
          margin: 5px 0;
        }
        input::-webkit-input-placeholder {
          color: #c4d7da;
        }
        input:-moz-placeholder {
          color: #c4d7da;
        }
        input:-ms-input-placeholder {
          color: #c4d7da;
        }
        .riskBoxDistrict_list {
          .nodata {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .constomMyElPage {
            margin-top: 15px;
          }
          .listBoxSingle {
            &_li {
              display: flex;
              height: 50px;
              line-height: 50px;
              cursor: pointer;
              color: #ffffff;
              margin: 10px 0 0 0;
              background: url('../../../../assets/img/halfScreen/halflist/boxListBgIcon.png')
                no-repeat 0 0;
              background-size: 100% 100%;
              color: #e8f4fe;

              &.active,
              &:hover {
                color: yellow;
              }
              .li_index {
                margin: 0 10px;
              }
              .li_name {
                flex: 1;
                align-items: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }
}
</style>
