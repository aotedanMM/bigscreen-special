<template>
  <div class="custom-detail-container" v-show="false">
    <div class="sy-fireTeam-detailTitle">
      <span :title="$store.state.gisMenuSearch.nameData.address">{{
        $store.state.gisMenuSearch.nameData.address
      }}</span>
      <div class="InEventInfoBtn">
        <InEventInfo :closeFunc="closeFunc" :popupData='$store.state.gisMenuSearch.nameData'></InEventInfo>
      </div>
<!--      <span-->
<!--        :title="-->
<!--          '(' +-->
<!--            parseFloat($store.state.gisMenuSearch.nameData.coords['x']).toFixed(2) +-->
<!--            ',' +-->
<!--            parseFloat($store.state.gisMenuSearch.nameData.coords['y']).toFixed(2) +-->
<!--            ')'-->
<!--        "-->
<!--      >-->
<!--        {{-->
<!--          '(' +-->
<!--            parseFloat($store.state.gisMenuSearch.nameData.coords['x']).toFixed(2) +-->
<!--            ',' +-->
<!--            parseFloat($store.state.gisMenuSearch.nameData.coords['y']).toFixed(2) +-->
<!--            ')'-->
<!--        }}-->
<!--      </span>-->
      <span v-if="false" class="event_handling_title">事件处置</span>
      <span class="detail-container-close" @click="closeEventPopup"></span>
    </div>
    <div class="sy-fireTeam-detailContent">
      <div
        :class="[item.isClass, { btnQueryTypeActive: item.isCur }]"
        v-for="item in tabArr"
        :key="item.key"
        @click="tabClickMenuFn(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="customDistrictPanel">
      <div class="customBufferPanel" v-show="isShowListOne">
        <div class="resourcespecial-analysistitle">请选择范围</div>
        <div class="resourcespecial-analysistitleImg">
          <div
            :class="[
              'resourcespecial-analysistitleImgActive',
              { analysistitleImgActive: item.isActive },
            ]"
            v-for="item in gisRangeArr"
            :key="item.key"
            @click="analysistListFn(item)"
          >
            <div
              :title="item.title"
              :code="item.code"
              :class="[item.childlass, 'resourcespecial-imgcs']"
            ></div>
          </div>
          <div
            class="resourcespecial-analysistitleradiuscs"
            v-show="isShowDistance"
          >
            <div class="resourcespecial-radiusword">缓冲距离</div>
            <input
              class="resourcespecial-radiusnums"
              type="text"
              v-model="distanceVal"
              min="0"
              maxlength="3"
              @input="handleInput"
            />
            <span class="resourcespecial-unit">km</span>
          </div>
        </div>
      </div>
      <div class="customTreePanel" v-show="isShowListTwo">
        <div id="customDistrictTree" class="ztree"></div>
      </div>
      <div class="customtextQuery" v-show="isShowListThree">
        <div class="Equipment-search-container" ignore="2">
          <input type="text" placeholder="请输入装备名称" />
          <div class="Equipment-search-button"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { resourceanalysisServer } from '@/api/feature/normal/installNormalServer.ts';
import InEventInfo from '@/components/feature/gisModule/popUp/btnComponent/inEventInfo.vue';
@Component({
  name: 'GisEventHanding',
  components: {
    InEventInfo,
  },
})
export default class GisEventHanding extends Vue {
  private isShowListOne = true;
  private isShowListTwo = false;
  private isShowListThree = false;
  private isShowDistance = true;
  private distanceVal: any = 50;
  private zTreeElement: any = '';
  private nodeList: any = '';
  private codes: any = '';
  private dataParame: any = {
    level: 1,
    name: '',
    adcode: '',
    sub: 2,
    polygon: false,
    eId: 'siptea',
  };
  private setting = {
    check: {
      enable: true,
      chkboxType: { Y: '', N: '' }, // 父子选中和不选中都不关联
    },
    view: {
      dblClickExpand: false,
    },
    data: {
      simpleData: {
        enable: true,
      },
    },
    callback: {
      beforeClick: this.beforeClick,
      onCheck: this.onCheck,
      filterFunc: this.filterFunc,
      searchNode: this.searchNode,
      updateNodes: this.updateNodes,
    },
  };
  private tabArr: any = [
    { name: '周边查询', isClass: 'queryBuffer_analysis', isCur: true },
    {
      name: '行政区划查询',
      isClass: 'queryAdministrative_analysis',
      isCur: false,
    },
    // { name: '装备查询', isClass: 'queryKeyword_analysis', isCur: false },
  ];
  private gisRangeArr: any = [
    {
      title: '点周边',
      code: 'DrawPoint',
      childlass: 'resourcespecial-imgOne',
      isActive: false,
    },
    {
      title: '线周边',
      code: 'DrawLine',
      childlass: 'resourcespecial-imgTwo',
      isActive: false,
    },
    {
      title: '自定义多边形',
      code: 'DrawPolygon',
      childlass: 'resourcespecial-imgThree',
      isActive: false,
    },
  ];
  private zNodes = [];
  private beforeClick(treeId: any, treeNode: any) {
    this.zTreeElement.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
  }

  // 查询半径只能输入整数或小数
  private handleInput(e: any) {
    this.distanceVal = this.distanceVal.replace(/[^\d|^\\.]/g, '');
    this.getComponent().setRadius(parseFloat(this.distanceVal + '') * 1000);
  }

  // 当前点击check的节点
  private onCheck(e: any, treeId: any, treeNode: any) {
    // 只要是选中，就要在地图上进行画图（ztree选中父子不关联）
    if (treeNode.checked) {
      this.getComponent().queryDistrict(treeNode.adcode);
    } else { // 只要是取消就要遍历所有改变的节点。 （ztree 不选中，关联子）
      this.getComponent().clearDistrict(treeNode.adcode);
      const nodes = this.zTreeElement.getCheckedNodes(true);
      const res = this.$store.state.gisMenuSearch.handResultData;
      this.handleDistrictCheck(nodes, res);
    }
    // treeNode.adcode;
    // const nodes = this.zTreeElement.getCheckedNodes(true);

    // for (let i = 0, l = nodes.length; i < l; i++) {
    //   if (!nodes[i].isParent) {
    //     this.codes += nodes[i].id + ',';
    //   } else {
    //     this.codes += nodes[i].id + ',';
    //   }
    // }
  }
  // 查找不符合条件的叶子节点
  private filterFunc(node: any) {
    console.log('1111');
  }
  private searchNode() {
    console.log('1111');
  }
  private updateNodes(highlight: any) {
    this.zTreeElement = ($.fn as any).zTree.getZTreeObj('customDistrictTree');
  }

  private analysistListFn(parame: any) {
    this.gisRangeArr.forEach((item: any, index: any) => {
      item.isActive = false;
      if (parame.title === item.title) {
        item.isActive = true;
      }
    });
    if (parame.title === '自定义多边形') {
      this.isShowDistance = false;
      this.getComponent().startPlot('polygon');
    } else {
      this.getComponent().setRadius(parseFloat(this.distanceVal + '') * 1000);
      this.isShowDistance = true;
      if (parame.title === '点周边') {
        const coords = {
          x: this.$store.state.gisMenuSearch.nameData.geom.coordinates[0],
          y: this.$store.state.gisMenuSearch.nameData.geom.coordinates[1],
        };
        this.getComponent().drawBufferPoint(coords);
      } else if (parame.title === '线周边') {
        this.getComponent().startPlot('line');
      }
    }
  }
  private tabClickMenuFn(parame: any) {
    this.getComponent().clear();
    this.tabArr.forEach((item: any, index: any) => {
      item.isCur = false;
      if (parame.name === item.name) {
        item.isCur = true;
      }
    });
    if (parame.name === '周边查询') {
      this.isShowListOne = true;
      this.isShowListTwo = false;
      this.isShowListThree = false;
    } else if (parame.name === '行政区划查询') {
      this.isShowListOne = false;
      this.isShowListTwo = true;
      this.isShowListThree = false;
      this.changeDistrictCode();
    } else if (parame.name === '装备查询') {
      this.isShowListOne = false;
      this.isShowListTwo = false;
      this.isShowListThree = true;
    }
    this.gisRangeArr.forEach((gitem: any) => {
        gitem.isActive = false;
    });
    this.gisRangeArr = this.gisRangeArr.concat([]);

  }
  // 进入处置关闭弹窗
  private closeFunc() {
    this.closeEventPopup();
  }
  private closeEventPopup() {
    this.$store.state.gisMenuSearch.isGisDetail = false;
    const obj = {
          districtCodeArrStr: '', // 行政区划的code数组的字符串
          curResultType: 'quanguo', // 点DrawPoint，线DrawLine，面DrawPolygon，行政区划districtCode 全国默认 quanguo
          type: '', // 点线面 buffer，行政区划 districtCode,
          buffer: '', //
          isRefeshData: true, // true，代表要输刷新数据
      };
    this.$store.commit('gisMenuSearch/changeHandResult', obj);
    this.getComponent().clear();
      // this.getComponent().
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component: any = factory.commonFactory.getComponent('search');
    return component;
  }
  // 监听事件的绑定
  private initEventListen() {
    // this.getComponent().off('searchComponentQueryResource');
    this.getComponent().on('searchComponentQueryResource', (res: any) => {
        if (res.type === 'buffer') { // 周边查询
           const curResultObj =   this.gisRangeArr.find((item: any) => {
                                        return (item.isActive);
                                    });
           const curResultType = curResultObj.code;
           res.curResultType = curResultType;
           this.getDistrictCodeByBuffer(res);
           res.isRefeshData = true;
        } else if (res.type === 'districtCode') { // 行政区划，我要获得所有选中的行政区划
            const nodes = this.zTreeElement.getCheckedNodes(true);
            res.curResultType = 'districtCode';
            this.handleDistrictCheck(nodes, res);
            // res.districtCodeArrStr = nodes.map((item: any) => {
            //     return item.adcode;
            // }).toString();
            // res.isRefeshData = true;
            // this.$store.commit('gisMenuSearch/changeHandResult', res);
        }


    });
    // this.getComponent().off('searchComponentRadiusChange');
    this.getComponent().on('searchComponentRadiusChange', (data: any) => {
      this.distanceVal = parseFloat((data.r / 1000).toFixed(2));
    });
  }

  // 处理行政区划勾选和取消勾选后，
  private handleDistrictCheck(nodes: any , res: any) {
      res.curResultType = 'districtCode';
      res.districtCodeArrStr = nodes.map((item: any) => {
          return item.adcode;
      }).toString();
      res.isRefeshData = true;
      this.$store.commit('gisMenuSearch/changeHandResult', res);
  }

  private getDistrictCodeByBuffer(resResult: any) {
      const opts = {
          // geometry: JSON.parse(resResult.buffer),
          geometry: resResult.buffer,
      };
      const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, 4326);
      const center = polygon.getBaryCenter();
      const point = [center.x, center.y];
      (window as any).EMapServerV2.queryservice._queryDistrictPolygon(point, opts.geometry, (data: any) => {
          resResult.districtCodeArrStr = data.COUNTY.map((item: any) => {
              return item.tag.adcode;
          }).toString();
          this.$store.commit('gisMenuSearch/changeHandResult', resResult);
      });
  }

  // 当搜索面板选点发生了变化时，要对这个面板的默认行政区划进行改变。这个以后要写在watch中的
  private changeDistrictCode() {
    const districtCode = this.$store.state.gisMenuSearch.nameData.districtObj.code;
    const node = this.zTreeElement.getNodeByParam('adcode', districtCode, null);
    this.zTreeElement.checkNode(node, true, true, true);
    const node2 = this.zTreeElement.getNodeByParam('adcode', districtCode.substring(0, 4) + '00', null);
    this.zTreeElement.expandNode(node2, true, false, true, false);
  }
  private created() {
    this.initEventListen();
  }
  private mounted() {
    resourceanalysisServer.getDistrict(this.dataParame).then((res: any) => {
      this.zNodes = res.reverse();
      ($.fn as any).zTree.init(
        $('#customDistrictTree'),
        this.setting,
        this.zNodes,
      );
      // 默认展开第一层树节点
      const zTree = ($.fn as any).zTree.getZTreeObj('customDistrictTree');
      const nodeList = zTree.getNodes();
      const nodes = zTree.transformToArray(zTree.getNodes());
      this.zTreeElement = zTree;
      // this.changeDistrictCode();
    });
  }

  private destroyed() {
    this.closeEventPopup();
    // this.getComponent().off('searchComponentQueryResource');
    // this.getComponent().off('searchComponentRadiusChange');
  }
}
</script>
<style scoped lang="less">
@import url('../../../../assets/plugins/ztree/css/zTreeStyle/zTreeStyle.css');
@url: '../../../../assets/img/navGis';
* {
  margin: 0;
  padding: 0;
}
.custom-detail-container {
  width: 435px;
  position: absolute;
  top: 20%;
  right: 115px;
  z-index: 201;
  background: url('@{url}/xingzheng_center.png') no-repeat;
  .sy-fireTeam-detailTitle {
    height: 36px;
    font-size: 22px;
    color: #eef9fd;
    padding-left: 27px;
    padding-right: 27px;
    margin-top: -29px;
    position: relative;
    display: flex;
    align-items: center;
    span:nth-child(1) {
      width: 58%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 30px;
    }
    .event_handling_title {
      width: 84px;
      height: 30px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      text-align: center;
      line-height: 30px;
      padding: 0px 3px;
      background: url('@{url}/event_click.png') no-repeat;
      background-size: 100% 100%;
    }
    .detail-container-close {
      position: absolute;
      right: 4%;
      top: 16%;
      width: 15px;
      height: 15px;
      cursor: pointer;
      background-image: url('@{url}/maptooltipclose.png');
      background-size: 100% 100%;
    }
    .InEventInfoBtn{
      position: absolute;
      right: 37px;
      top: -21px;
      .infoManagementBtn{
        background: url('@{url}/xingzheng.png') no-repeat !important;
      }
    }
  }
  .sy-fireTeam-detailTitle:after {
    content: '';
    display: inline-block;
    width: 365px;
    height: 4px;
    background: url('@{url}/xinzheng_title.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    bottom: 0px;
  }
  .sy-fireTeam-detailContent {
    width: 390px;
    height: 35px;
    margin-left: 26px;
    margin-top: 10px;
    display: flex;
    /*justify-content: space-between;*/
    color: #fff;
    div {
      height: 33px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0px;
      background: url('@{url}/xingzheng.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      padding: 0 12px;
      margin-right: 50px;
      .queryBuffer_analysis {
        width: 115px;
        font-size: 20px;
        color: #fff;
      }
      .queryAdministrative_analysis {
        width: 135px;
        margin: 0 10px;
        font-size: 20px;
        color: #fff;
      }
      .queryKeyword_analysis {
        width: 115px;
        font-size: 20px;
        color: #fff;
      }
    }
    .btnQueryTypeActive {
      background: url('@{url}/xingzheng_active.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .customDistrictPanel {
    padding: 0 25px;
    .resourcespecial-analysistitle {
      margin-top: 6px;
      width: 94%;
      height: 38px;
      line-height: 34px;
      border-radius: 4px;
      background: url('@{url}/resoursespecialtitlebg.png') no-repeat;
      background-size: 100% 100%;
      color: #13e6fc;
      font-size: 22px;
      padding-left: 25px;
    }
    .resourcespecial-analysistitleImg {
      display: flex;
      width: 100%;
      background: #03264a;
      padding-top: 5px;
      .resourcespecial-analysistitleImgActive {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        height: 56px;
        width: 56px;
        .resourcespecial-imgOne {
          width: 32px;
          height: 32px;
          background: url('@{url}/huanchongtu1.png') no-repeat;
          background-size: 100% 100%;
        }
        .resourcespecial-imgTwo {
          width: 32px;
          height: 32px;
          background: url('@{url}/huanchongtu2.png') no-repeat;
          background-size: 100% 100%;
        }
        .resourcespecial-imgThree {
          width: 32px;
          height: 32px;
          background: url('@{url}/huanchongtu3.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .analysistitleImgActive {
        background: url('@{url}/huanchongactive.png') no-repeat;
        background-size: 100% 100%;
        width: 56px;
        height: 56px;
      }
      .resourcespecial-analysistitleradiuscs {
        display: flex;
        align-items: center;
        .resourcespecial-unit,
        .resourcespecial-radiusword {
          color: #d2e1ec;
          font-size: 20px;
        }
        .resourcespecial-radiusnums {
          width: 75px;
          height: 30px;
          margin: 0 5px 0 5px;
          background: rgba(19, 68, 84, 0.8);
          font-size: 20px;
          border: 1px solid #00f0ea;
          color: #d2e1ec;
          /* line-height: 45px; */
          text-align: center;
          border-radius: 25px;
        }
      }
    }
  }
  .customTreePanel {
    #customDistrictTree {
      margin-top: 20px;
      width: 100%;
      background: #03264a;
      margin: 6px 0;
      overflow: auto;
      height: 305px;
      li {
        a {
          color: #fff;
        }
      }
    }
  }
  .customtextQuery {
    .Equipment-search-container {
      width: 100%;
      height: 51px;
      z-index: 1;
      line-height: 45px;
      text-align: left;
      background: url('@{url}/querydataSearch111.png') left center no-repeat;
      background-size: 100% 100%;
      input[type='text'] {
        width: calc(100% - 92px);
        display: inline-block;
        height: 35px;
        line-height: 35px;
        margin-left: 10px;
        border: none;
        font-size: 18px;
        background: transparent;
        padding-left: 5px;
        outline: none;
        color: #fff;
        position: relative;
        top: 4%;
      }
      ::-webkit-input-placeholder {
        color: #ffffff;
      }
      :-moz-placeholder {
        color: #ffffff;
      }
      :-ms-input-placeholder {
        color: #ffffff;
      }
      .Equipment-search-button {
        float: right;
        height: 100%;
        width: 10%;
        background: url('@{url}/searchIcon.png') no-repeat -3px bottom;
        height: 33px;
        width: 40px;
        cursor: pointer;
        height: 47px;
      }
    }
  }
}
.custom-detail-container:before {
  position: absolute;
  content: '';
  display: block;
  width: 435px;
  height: 47px;
  background: url('@{url}/xingzheng_top.png') no-repeat;
  background-size: 100% 100%;
  top: -47px;
}

.custom-detail-container:after {
  position: absolute;
  content: '';
  display: block;
  width: 435px;
  height: 50px;
  background: url('@{url}/xingzheng_bot.png') no-repeat;
  background-size: 100% 100%;
  bottom: -50px;
}
</style>
