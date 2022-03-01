<template>
  <div class="DiscussList">
    <div class="tempRight-cont">
      <div class="influenceList">
        <div class="tempRight-title f-tit-h2" v-if="titleName">
          <span>{{titleName}}</span>
        </div>
        <div
          class="influenceList_innr"
          v-if="Object.keys(tabShow).length"
          :class="titleName!== '人口' ? 'tab-font_active':''"
        >
          <div class="influenceList_innr_before" v-if="beforeData.length>0">
            <dl class="influenceList_innr_item" v-for="(item, index) of beforeData" :key="index">
              <dt class="item_dt" @click="isShowOpenFnNew(item.name,item,index,beforeData)">
                <span class="item_icon item_icon-left" :class="'item_icon_'+item.icon"></span>
                <p class="tab-font">
                  <span class="f-tit-h2" :class="item.active ? 'itemName-active':''">{{item.title}}</span>
                </p>
              </dt>
              <dd>
                <p class="instake" v-if="!isNaN(parseInt(item.num))">
                  <span class="inse">
                    <span class="f-number">{{parseInt(item.num)}}</span>
                  </span>
                  <span class="f-txt-com">{{item.danwei}}</span>
                  <span
                    class="instake_cont"
                    v-show="item.clickKey && parseInt(item.num)"
                    @click="changeKuang(item)"
                  ></span>
                </p>
                <p class="instake" v-else>
                  <span class="inse">
                    <span class="f-number">--</span>
                  </span>
                </p>
              </dd>
            </dl>
          </div>
        </div>
        <!-- <div v-else class="noData">暂无数据</div> -->
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
@Component({
  name: 'DiscussList',
})
export default class DiscussList extends Vue {
  @Prop() private tabShow: any;
  @Prop() private levelArr: any;
  private originData: any = [];
  private beforeData: any = [];
  private afterData: any = [];
  private titleName: string = '';
  private isShowOpen: boolean = false; // 是否显示行政区划面
  private isShowOpenNew: boolean = false;
  private isShowNew: boolean = false; // 是否显示村庄

  // 当数据发生改变的时候重新处理数据
  @Watch('tabShow', {
    deep: true,
  })
  public initConfig(): void {
    this.originData = [];
    this.beforeData = [];
    this.afterData = [];
    // 把源始json数据转成数组对象
    this.dataThansformArray();
    // 过滤出排头的数据
    this.filterPlatoon();
    this.destroyDistricts();
  }

  // 点击数字进入下钻
  private changeKuang(item: any) {
    if (!item.clickKey) {
      return;
    } else {
      this.$emit('changeKuang', item);
    }
  }

  // 过滤数据，根据platoon（是否排头）来分组；
  private filterPlatoon() {
    if (this.originData.length > 0) {
      this.originData.forEach((item: any, index: number) => {
        // if (item.platoon === true) {
        this.beforeData.push(item);
        // } else {
        //   this.afterData.push(item);
        // }
      });
    }
  }

  // 点击文字叠加点位
  private isShowOpenFnNew(title: any, item: any, index: any, beforeData: any) {
    if (!item.active) {  // 不属于激活的字段，不能点击
      return;
    }
    this.destroyDistricts(); // 去掉行政区划面
    beforeData.forEach((sitem: any, sindex: any) => {
      if (item.key === sitem.key) {
        sitem.active = !sitem.active;
      } else {
        sitem.active = false;
      }
      if (sitem.active) {
        this.addDistricts(sitem); // 叠加行政区划面 // 注释默认叠加的行政区划
      }
    });
    this.beforeData = JSON.parse(JSON.stringify(beforeData));
  }
  // 把源始json数据转成数组对象。
  private dataThansformArray() {
    const that = this;
    const quickStudyConfigJson = JSON.parse(
      JSON.stringify(this.$store.state.configModel.config.quickStudy),
    );
    this.titleName = quickStudyConfigJson.tabShowTitle.title;
    const data: any = JSON.parse(JSON.stringify(that.tabShow));
    const arrKeys = Object.keys(data);
    if (!arrKeys.length) {
      return false;
    } else {
      arrKeys.forEach((item: any, index: number) => {
        this.originData.push(data[item]);
      });
    }
  }

  private mounted() {
    this.originData = [];
    this.beforeData = [];
    this.afterData = [];
    // 把源始json数据转成数组对象
    this.dataThansformArray();
    // 过滤出排头的数据
    this.filterPlatoon();
  }
  // 组件销毁
  private beforeDestroy() {
    this.destroyDistricts();
  }
  // 叠加行政区划
  private async addDistricts(item: any) {
    const self = this;
    // 制作参数
    const param: any = {
      // point: [116.35, 39.87],
      pac: this.$store.state.dataFilterControl.filter.districtCode, // 区县、乡镇、村庄用
    };
    if (this.$store.state.dataFilterControl.filter.geometry) {
      param.geometry = JSON.parse(
        this.$store.state.dataFilterControl.filter.geometry,
      );
    }
    const eventPushStore = this.$store.state.eventPushStore.eventLocation;
    if (eventPushStore.EventLon && eventPushStore.EventLat) {
      param.point = [eventPushStore.EventLon, eventPushStore.EventLat];
    }
    let promiseResult: any = null;
    switch (item.key) {
      // 区县所有数据
      case 'countyCount':
        param.returnWKT = true;
        param.returnXiangNum = true;
        promiseResult = await installDisasterJudgeServer.quickJudgeServer.getCountiesInfo(
          JSON.parse(JSON.stringify(param)),
        );
        break;
      // 乡镇所有数据
      case 'townCount':
        param.returnWKT = true;
        promiseResult = await installDisasterJudgeServer.quickJudgeServer.getTownsInfo(
          JSON.parse(JSON.stringify(param)),
        );
        break;
      // 村庄所有数据
      case 'cunCount':
        promiseResult = await installDisasterJudgeServer.quickJudgeServer.getCunInfo(
          JSON.parse(JSON.stringify(param)),
        );
        break;
    }
    if (item.key === 'cunCount') {
      this.getComponent()._showDistrictPointsCun(promiseResult, item.key);
    }
    if (!promiseResult) {
      return;
    } else {
      this.getComponent().load(promiseResult, item.key); // 区县countyCount 乡镇townCount 村庄cunCount
    }
  }
  // 取消  区县乡镇图层+高亮
  private destroyDistricts() {
    this.getComponent().unload();
  }

  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const districtComp = factory.disasterJudgeFactory.getComponent(
      'districtCompYT',
    );
    return districtComp;
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/css/decisionSupport/Statistic.half.less';

* {
  margin: 0;
  padding: 0;
}

.noData {
  text-align: center;
  color: rgb(0, 227, 255);
  font-size: 30px;
}

.tempRight-title {
  padding-left: 10px;
}

.DiscussList {
  width: 100%;

  .title-t {
    position: relative;
    line-height: 35px;
    text-align: left;
    margin-bottom: 30px;
    font-style: italic;

    p {
      display: block;
      margin: 0;
      padding-left: 10px;
    }
  }

  .influenceList {
    width: 100%;

    &_innr {
      background: url('../../../../assets/img/discuss/hover2.png') no-repeat 50%
        0px;
      background-size: 100% 100%;
      margin-left: 10px;

      &_before {
        // background:url('../../../../assets/img/discuss/bg.png') no-repeat 50% 0px;
        padding: 16px 11px 0px;
        // height:100px;
        // box-sizing: border-box;
        background-size: 100% 100%;
        margin: 10px 0px 0 5px;

        // &:hover {
        //     // background-image:url('../../../../assets/img/discuss/bg_h.png') ;
        // }

        // .influenceList_innr_item {
        //     // cursor:pointer;
        // }
      }

      &_after {
        // background:url('../../../../assets/img/discuss/hover2.png') no-repeat 50% 0px;
        padding: 0px 16px 15px 11px;
        // box-sizing: border-box;
        background-size: 100% 100%;
        margin: 0px 0px 0 5px;

        // &:hover {
        //     // background-image:url('../../../../assets/img/discuss/hover2_h.png') ;
        // }

        .influenceList_innr_item:last-child {
          //width:100%;
          margin-bottom: 0px;
        }
      }

      &_item {
        display: inline-block;
        // padding-left:80px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        vertical-align: top;
        margin-bottom: 10px;
        background: url('../../../../assets/img/discuss/bg_dot.png') 0 50%
          no-repeat;

        .item_dt {
          padding-left: 60px;
          height: 55px;

          .item_icon_rk + .tab-font,
          .item_icon_rkmd + .tab-font,
          .item_icon_zzhb + .tab-font,
          .item_icon_fw + .tab-font {
            color: rgba(255, 255, 255, 0.6);
            cursor: default;
          }

          .tab-font {
            color: #f5f8ff;
            padding-top: 9px;
            white-space: nowrap;
            cursor: pointer;
          }
        }

        .instake {
          color: rgb(182, 202, 217);
          white-space: nowrap;
          padding-left: 10px;
          display: flex;
          align-items: center;
          justify-content: space-around;

          // margin: -21px 35px;
          .inse {
            // padding-right: 8px;
            // font-size: 28px;
            color: rgb(255, 240, 0);
            font-weight: bold;
            font-family: 'Impact';
            padding-right: 5px;
          }

          .instake_cont {
            display: inline-block;
            cursor: pointer;
            width: 32px;
            height: 32px;
            background: url('../../../../assets/img/discuss/icon_cont.png') 0
              50% no-repeat;

            &:hover {
              background: url('../../../../assets/img/discuss/icon_cont_hover.png')
                0 50% no-repeat;
            }
          }
        }
      }

      &_item:last-child {
        padding-bottom: 20px;
      }
      &_item_wrap {
        background: url('../../../../assets/img/discuss/icon_bg_new.png')
          no-repeat 100% 100%;
      }

      &_cunzhuang {
        display: flex;
        margin-top: 20px;
      }
    }

    .item_icon-left {
      float: left;
      margin-left: -60px;
    }

    .item_icon {
      width: 55px;
      height: 55px;
      background: url('../../../../assets/img/discuss/item_icon.png');
    }

    .item_icon_no {
      display: none;
    }

    .item_icon_no + .tab-font {
      margin-left: -50px;
    }

    .item_icon_qx {
      background-position: -16px -13px;
    }

    .item_icon_xz {
      background-position: -108px -13px;
    }

    .item_icon_rk {
      background-position: -200px -13px;
    }

    .item_icon_mj {
      background-position: -384px -13px;
    }

    .item_icon_zzhb {
      background: url('../../../../assets/img/discuss/zhenzhonghaiba.png')
        no-repeat;
    }

    .item_icon_rkmd {
      background-position: -292px -13px;
      // display: none;
    }

    .item_icon_fw {
      background-position: -475px -13px;
      // display: none;
    }

    .item_icon_fwmd {
      background-position: -568px -13px;
      // display: none;
    }

    .item_icon_cz {
      background-position: -660px -13px;
    }

    .item_icon_zzld {
      background: url('../../../../assets/img/discuss/zhenzhongshefang.png')
        no-repeat;
      background-size: 100% 100%;
    }
  }

  .itemName-active {
    color: yellow;
  }

  .itemName-active-new {
    cursor: pointer;
  }

  // .tab-font_active{
  //   cursor:pointer;
  //   &:hover{
  //     background-image:url('../../../../assets/img/discuss/hover2_h.png') ;
  //   }
  // }
}
</style>
