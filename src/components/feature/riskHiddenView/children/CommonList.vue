<template>
<div class="commonListBox">
    <div v-for="(item, index) in contListAll" :key="index" class="bigBox">
      <!-- <span class="icon yellowHover-cur" :class="item.icon"></span> -->
      <div
        @click.stop="isShowOpenFn(item, index)"
        class="cliickBox img_box bb"
        :class="item.tabNumber"
      >
        <p
          class="yellowHover"
          :class="item.checked && item.fatherId !== 1 ? 'activeFather' : ''"
        >
          <span class="icon_bg aa" :class="showKeyIcon"
            ><i :class="item.icon"></i
          ></span>
          <span
            v-if="item.list && item.list.length > 0"
            class="tempRight-title"
            :title="item.title"
          >
            {{ item.title }}
          </span>
          <span
            v-else
            @click.stop="addMapdotChecked(item)"
            class="tempRight-titleClick"
            :title="item.title"
            :class="{ titleClickWidth: item.textHighlighted }"
          >
            {{ item.title }}
          </span>
        </p>
       
        <p
          class="tempeRight-total"
          v-if="item.list && item.list.length > 0"
          style="right: 35px; top: 30%; padding: 0 8px"
        >
          <span class="f-number" v-if="!item.textHighlighted"> {{ item.tabNumber }}</span>
          <span class="childrenRight-unit" v-if="!item.textHighlighted">{{ item.unit }}</span>
        </p>
        <p
          class="tempeRight-total"
          v-else
          style="right: 35px; cursor: pointer; top: %; padding: 0 8px"
          @click.stop="changeNum(item, index)"
          :class="{
            numActive:
              numCheckedData.codeKey === item.codeKey && item.numChecked,
          }"
        >
          <span class="f-number" v-if="!item.textHighlighted"> {{ item.tabNumber }}</span>
          <span class="childrenRight-unit" v-if="!item.textHighlighted">{{  item.unit }}</span>
        </p>
         <i
          :class="
            item.checked
              ? 'tempRight-switch arrows'
              : 'tempRight-switch tempRight-switch-reverse arrows'
          "
          v-if="item.list && !item.select"
          @click.stop="isShowOpenFn(item, index)"
        ></i>
        <i
          :class="
            item.checked
              ? 'tempRight-switch arrows'
              : 'tempRight-switch tempRight-switch-select arrows'
          "
          v-if="item.select"
          @click.stop="isShowOpenFn(item, index)"
        ></i>
      </div>
      <div v-show="item.checked" class="childrenBox">
        <div
          v-for="(itemChildren, indexChildren) in item.list"
          :key="indexChildren"
          class="childrenDiv"
          :class="itemChildren.tabNumber > 0 ? '' : 'gray'"
        >
          <div
            @click.stop="isShowOpenFn(itemChildren, index)"
            class="cliickBox img_box"
            :class="itemChildren.tabNumber > 0 ? '' : 'gray'"
          >
            <p
              class="yellowHover"
              :class="
                itemChildren.checked && itemChildren.fatherId !== 1
                  ? 'activeFather'
                  : ''
              "
            >
              <span class="icon_bg bb" :class="showKeyIcon">
                <i :class="itemChildren.icon"></i>
                </span>
              <span
                v-if="itemChildren.list && itemChildren.list.length > 0"
                class="tempRight-title"
                :title="itemChildren.title"
              >
                {{ itemChildren.title }}
              </span>
              <span
                v-else
                @click.stop="addMapdotChecked(itemChildren)"
                class="tempRight-titleClick"
                :title="itemChildren.title"
              >
                {{ itemChildren.title }}
              </span>
            </p>
            <p
              class="tempeRight-total"
              v-if="itemChildren.list && itemChildren.list.length > 0"
              style="right: 35px; top: 30%; padding: 0 8px"
            >
              <span class="f-number"> {{ itemChildren.tabNumber }}</span>
              <span class="childrenRight-unit">{{ itemChildren.unit }}</span>
            </p>
            <p
              class="tempeRight-total"
              v-else
              style="right: 35px; cursor: pointer; top: %; padding: 0 8px"
              @click.stop="changeNum(itemChildren, index)"
              :class="{
                numActive:
                  numCheckedData.codeKey === itemChildren.codeKey &&
                  itemChildren.numChecked,
              }"
            >
              <span class="f-number"> {{ itemChildren.tabNumber }}</span>
              <span class="childrenRight-unit">{{ itemChildren.unit }}</span>
            </p>
            <i
              :class="itemChildren.checked ? 'tempRight-switch arrows': 'tempRight-switch tempRight-switch-reverse arrows'"
              v-if="itemChildren.list"
              @click.stop="isShowOpenFn(itemChildren, index)"
            ></i>
          </div>
          <div v-show="itemChildren.checked" class="childrenBox">
            <div
              v-for="(itemChildrens, indexChildrens) in itemChildren.list"
              :key="indexChildrens"
              class="childrenDivs"
              :class="itemChildrens.tabNumber > 0 ? '' : 'gray'"
            >
              <p
                class="yellowHover"
                :class="{
                  activeFather: itemChildrens.checked,
                }"
              >
                <span class="icon_bg cc" :class="showKeyIcon">
                  <i :class="itemChildrens.icon"></i
                ></span>
                <span
                  class="tempRight-titleClick children_title_bg"
                  @click="addMapdotChecked(itemChildrens)"
                  :title="itemChildrens.title"
                  >{{ itemChildrens.title }}</span
                >
              </p>
              <p
                class="childrenRight-total"
                style="cursor: pointer"
                @click.stop="changeNum(itemChildrens)"
                :class="{
                  numChildrenActive:
                    numCheckedData.codeKey === itemChildrens.codeKey &&
                    itemChildrens.numChecked,
                }"
              >
                <span class="f-numberT"> {{ itemChildrens.tabNumber }}</span>
                <span class="childrenRight-unit">{{ itemChildrens.unit }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'CommonList',
  components: {},
})
export default class CommonList extends Vue {
  // 文字高亮属性
  public curCheckedObj: any = {};
  // 数字选中属性
  public curCheckedNumObj: any = {};
  // 用于存储当前父级数据
  private fatherData: any = [];
  @Prop() private contListAll: any; // 从父级拿到的当前组件需要的参数
  @Prop() private showKeyIcon: any; // 从父级拿到的当前组件需要的参数匹配icon名
  private activeIndex: any = -1;
  private numCheckedData: any = '';
  private childrenIndex: any = -1;
  private copyData: any = '';
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
  @Watch('contListAll')
  private initChange() {
    // 如果是森防图层进来的莫能高亮第一个
    if (this.showKeyIcon === 'sftc') {
      this.addMapdotChecked(this.contListAll[0]);
      if (this.$store.state.configModel.contListAll.length) {
        this.$store.state.configModel.contListAll.forEach(
          (item: any, index: any) => {
            if (item.checked) {
              this.contListAll[index].checked = true;
            }
          },
        );
      }
    }
  }
  // 图标点击事件
  private isShowOpenFn(item: any, index: any) {
    if (item.select === 'jyzb' || item.select === 'zj') {
      this.$emit('changeBox', item);
    } else {
      if (item.fatherId) {
        item.checked = !item.checked;
      }
      this.activeIndex = index;
    }
    if (item.title === '工贸企业') {
      this.messsageBus.emit('showleftList' , true);
    } else {
      this.messsageBus.emit('showleftList' , false);
    }
  }
  // 文字点击事件
  private addMapdot(item: any) {
    let checkedFlag = false;
    if (this.curCheckedObj.codeKey === item.codeKey) {
      // 当前已选中
      this.curCheckedObj = {};
      this.curCheckedNumObj = {};
    } else {
      this.curCheckedObj = item;
      checkedFlag = true;
      this.curCheckedNumObj = {};
    }
    this.$emit('addMapdot', item, checkedFlag);
  }
  // 数字点击
  private changeKuang(data: any) {
    if (
      this.curCheckedObj.codeKey === data.codeKey &&
      this.curCheckedNumObj.codeKey === data.codeKey
    ) {
      // 取消number选中
      // 数字高亮
      this.curCheckedNumObj = {};
      // 关闭列表弹框
      this.$emit('changeKuang', data, false);
    } else if (this.curCheckedObj.codeKey === data.codeKey) {
      // 如果左侧选择的队伍名称与现在选择的一致,则显示弹窗
      this.curCheckedNumObj = data;
      this.$emit('changeKuang', data, true);
    } else {
      // 文字高亮
      this.curCheckedObj = data;
      // 数字高亮
      this.curCheckedNumObj = data;
      // 点位信息
      this.$emit('addMapdot', data, true);
      this.$emit('changeKuang', data, true, this.curCheckedObj.codeKey);
    }
    this.messsageBus.emit('selectnumpafeone', data); // 触发每次显示都为第一页
    this.messsageBus.emit('clearInput', ''); // 点击给列表发消息，清空input搜索框的内容，重新请求所有的数据
  }
  // 获取重点河流和站点组件
  private getImportantRiverComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent(
      'importantRiverAndStations',
    );
    return component;
  }
  // 获取河流监测站点组件
  private getComponentriver() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory.monitorWarningFactory.getComponent('WindWaterRainWork');
    return component;
  }
   // 获取雨量地图功能
  private raingetComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
  }
  // 多选文字点击事件
  private addMapdotChecked(item: any) {
    // debugger;
    // console.log('文字点击进来了', item)
    // 地震带
    switch (item.codeKey) {
        case 'rainNum':
          this.raingetComponent().addResource_Rain(
            { geometry: this.geoJsonData, districtCode: this.districtCode },
            false,
          );
          break;
        case 'riverNum':
          this.raingetComponent().addResource_River(
            { geometry: this.geoJsonData, districtCode: this.districtCode },
            false,
          );
          break;
      }
    if (!item.checked) {
      if (item.id === 'earthQuakeZone') {
        this.getComponent1().addLayer('EarthQuakeZoneLayer');
      }
      // 华北地震带
      if (item.id === 'EarthquakeRuptureBeltLayerTwo') {
        this.getComponent1().addLayer('EarthQuakeZoneLayerHB');
      }
      // 地震断裂带
      if (item.id === 'EarthquakeRuptureBeltLayer') {
        this.getComponent1().addLayer('EarthquakeRuptureBeltLayer');
      }
      // 地震监测台站
      if (item.id === 'SeismicSonitoringStationLayer') {
        this.messsageBus.emit('closeHight', 'monitorstation');
        this.getComponent_Resource().showResourceTip('monitorstation');
      }
    } else {
      // 移除图层地震带
      if (item.id === 'earthQuakeZone') {
        this.getComponent1().removeLayer('EarthQuakeZoneLayer');
      }
      // 华北地震带
      if (item.id === 'EarthquakeRuptureBeltLayerTwo') {
        this.getComponent1().removeLayer('EarthQuakeZoneLayerHB');
      }
      // 移除图层地震断裂带
      if (item.id === 'EarthquakeRuptureBeltLayer') {
        this.getComponent1().removeLayer('EarthquakeRuptureBeltLayer');
      }
      // 移除图层地震监测台站
      if (item.id === 'SeismicSonitoringStationLayer') {
        this.messsageBus.emit('closeHight', 'monitorstation');
        this.getComponent_Resource()._clearLayerByID('monitorstation');
      }
      // 移除图层避难场所
      if (item.id === 'ShelterLayer') {
        this.getComponent_Resource()._clearLayerByID('shelter');
      }
    }
    if (this.copyData) {
      this.copyData.numChecked = false;
    }
    this.copyData = item;
    if (this.numCheckedData !== '') {
      this.numCheckedData.numChecked = false;
    }
    item.checked = !item.checked;
    switch (item.specialType) {
      case 'codeStr':
        this.$emit('addMapdotChecked', item);
        break;
      case 'codeArr':
        item.codeKey.forEach((itemCodeKey: any) => {
          const obj = {
            title: item.title,
            tabTitle: item.tabTitle,
            specialType: item.specialType,
            codeKey: itemCodeKey,
            tabNumber: item.tabNumber,
            unit: item.unit,
            icon: item.icon,
            checked: false,
          };
          this.$emit('addMapdotChecked', obj);
        });
        break;
      default:
        break;
    }
  }
  //  地图组件
  private getComponent_Resource() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('ResourceComponent');
    return component;
  }
  //  地图组件
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('mapserviceIn');
    return component;
  }
  // 多选数字点击事件itemFather: any,
  private changeNum(item: any) {
    // console.log('点击了数字', item);
    this.numCheckedData = item;
    // 保证每次进来numChecked为false
    this.deepQueryTwo(this.contListAll, item);
    item.numChecked = !item.numChecked;
    if (!item.numChecked) {
      item.checked = !item.numChecked;
      this.$emit('addMapdotChecked', item);
    }
    if (item.numChecked) {
      // 点位信息
      item.checked = item.numChecked;
      this.$emit('changeNumChecked', item, item.codeKey);
    } else {
      item.checked = item.numChecked;
      this.$emit('addMapdotChecked', item);
    }
    this.messsageBus.emit('selectnumpafeone', item); // 触发每次显示都为第一页
    this.messsageBus.emit('clearInput', ''); // 点击给列表发消息，清空input搜索框的内容，重新请求所有的数据

    // this.numCheckedData = item;
    // // 保证每次进来numChecked为false
    // this.deepQueryTwo(this.childernList, item);
    // item.numChecked = !item.numChecked;
    // if (!item.checked) {
    //   item.checked = true;
    // }
    // if (item.numChecked) {
    //   // 点位信息
    //   this.$emit('changeNumChecked', item, item.codeKey);
    // } else {
    //   item.checked = false;
    //   this.$emit('changeNumChecked', item, item.codeKey);
    // }
    // this.messsageBus.emit('selectnumpafeone', item); // 触发每次显示都为第一页
    // this.messsageBus.emit('clearInput', ''); // 点击给列表发消息，清空input搜索框的内容，重新请求所有的数据
  }
  private closePanelFn() {
    this.curCheckedObj = {};
    this.curCheckedNumObj = {};
    this.$emit('addMapdotChecked', this.curCheckedObj);
    this.$emit('changeNumChecked', this.curCheckedObj, false);
    // this.deepQuery(this.contListAll);
  }
  private deepQuery(tree: any, lable: any) {
    // 递归匹配数据
    if (!tree.length) {
      return;
    }
    for (const item of tree) {
      if (item.codeKey === lable.codeKey && !item.fatherId) {
        item.checked = false;
        item.numChecked = false;
      }
      if (item.list && item.list.length > 0) {
        this.deepQuery(item.list, lable);
      }
    }
  }
  private deepQueryTwo(tree: any, lable: any) {
    // 递归匹配数据
    if (!tree.length) {
      return;
    }
    for (const item of tree) {
      if (item.codeKey !== lable.codeKey) {
        item.numChecked = false;
      }
      if (item.list && item.list.length > 0) {
        this.deepQueryTwo(item.list, lable);
      }
    }
  }
  private mounted() {
    const self = this;
    this.messsageBus.off('clickEmerencyResourcesNumPanelClosed');
    // 列表关闭弹框事件
    this.messsageBus.on(
      'clickEmerencyResourcesNumPanelClosed',
      (leftItemData: any, closeState: boolean) => {
        // 清理地图对应图层图标
        this.getComponent()._clearLayerByID(leftItemData.codeKey);
        // 清理地图对应图层图标
        self.deepQuery(self.contListAll, leftItemData);
        // 取消弹窗列表
        self.messsageBus.emit('clickEmerencyResourcesNum', null, false);
      },
    );
  }
  //  地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('ResourceComponent');
    return component;
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/css/decisionSupport/teamIcon.less";
@import "../../../../assets/css/decisionSupport/Statistic.half.less";
@import "../../../../assets/css/decisionSupport/teamIcon.less";
@import "../../../../assets/css/decisionSupport/DiscussTab.less";
@import "../../../../assets/css/decisionSupport/Statistic.half.less";
@imgUrl: "../../../../assets/img/emergencyResource/";
@icon: "../../../../assets/img/gisModule/gisLayerPanel/newLayerPanel";
@imgPath: "../../../../assets/img/monitorWarning";
@tabUrl: "../../../../assets/img/discuss";

.titleClickDisabledStyle {
  cursor: default !important;
}

.DefensiveCommonList {
  .team-ul .tempRight-itemNum .text-number {
    color: #7cf3fc;

    &:hover {
      color: #fbee06;
    }
  }

  .text-number-activeNone:hover {
    color: #7cf3fc !important;
  }
}

.cliickBox {
  width: 100%;
  cursor: pointer;
}

.bigBox {
  position: relative;
  width: 100%;
}

.childrenBox {
  position: relative;
  width: 100%;
  padding-left: 10px;
  box-sizing: border-box;

  .childrenDiv {
    // display: flex;
    align-items: center;
    margin: 15px 0;
  }
  .childrenDivs {
    display: flex;
    align-items: center;
    margin: 15px 0;
  }
  .childrenRight-total {
    height: 45px;
    line-height: 45px;
    padding: 0 8px;
    font-size: 24px;
    letter-spacing: 1px;
    color: #7cf3fc;
    font-family: "Impact";
    position: absolute;
    right: 35px;
  }

  .childrenRight-unit {
    font-size: 25px;
    font-family: "Impact" !important;
    color: #7cf3fc;
  }
  
}

.icon {
  display: inline-block;
  width: 45px;
  height: 45px;
  position: absolute;
  left: 10px;
  top: 0px;
}

.tempRight-title {
  &::after {
    display: none !important;
  }
}

.children_title_bg {
  background: url(../../../../assets/img/halfScreen/halflist/listbg.png)
    no-repeat;
  background-position-x: 5px;
  color: #daf2ff !important;
  padding-left: 20px !important;
}

.img_box {
  width: 100%;
  position: relative;
  height: 65px;
  padding-top: 15px;
  box-sizing: border-box;

  &:after {
    content: "";
    display: inline-block;
    background: url(../../../../assets/img/halfScreen/halflist/titleline.png)
      no-repeat;
    position: absolute;
    bottom: -30px;
    left: 0px;
    width: 100%;
    height: 26px;
  }
}

.tempRight-title,
.tempRight-titleClick {
  //   color: #00e3ff;
  color: #e8f4fe;
  text-align: left;
  line-height: 53px;
  height: 53px;
  position: relative;
  padding-left: 8px;
  width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 25px;
  font-family: "Impact";
}

.titleClickWidth {
  width: 300px;
}

.tempRight-titleClick {
  cursor: pointer;
}

.tempeRight-total {
  position: absolute;
  top: 22px;
  font-size: 25px;
  color: #7cf3fc;
  font-family: "Impact";
}

.displayNonBox {
  height: 0;
  width: 0;
  display: none;
}

.title_unit {
  color: #daf2ff;
}

.arrows {
  top: 43%;
}

.f-numberT {
  font-size: 31px !important;
  font-family: "Impact";
}

.numActive,
.numChildrenActive {
  background-image: url("@{imgUrl}/yingjidengicannum.png");
  background-size: 100% 100%;
}

.yellowHover {
  cursor: pointer !important;
  color: #e5f4ff;
  font-size: 28px;
  font-family: "myYahei";
  display: flex;
  align-items: center;
  padding-left: 16px;

  &:hover span {
    color: yellow !important;
  }
}

.activeFather {
  span {
    color: yellow !important;
  }

  .children_title_bg {
    background: url(../../../../assets/img/halfScreen/halflist/listbghover.png)
      no-repeat;
    background-position-x: 5px;
  }
}

.tempRight-switch-select {
  transform: rotate(90deg);
}

.icon_bg {
  display: inline-block;
  width: 50px;
  height: 50px;
  //   background: linear-gradient(to top, transparent, rgba(72, 223, 255, 0.73));
  background: url(../../../../assets/img/emergencyResource/potentialrisks/bg.png)
    no-repeat;
  //   border: 1px solid #119699;
  background-size: cover;
  border-radius: 5px;
  vertical-align: middle;

  i {
    display: inline-block;
    width: 50px;
    height: 42px;
    // background-size: cover;
    background-repeat: no-repeat;
  }

  &.fxyh {
    i {
      background-image: url(../../../../assets/img/emergencyResource/potentialrisks/potential-risks-icon.png);
    }

    .hwsx {
      background: url("@{icon}/hwsx-active.png") no-repeat center / 100% 100%;
    }
    .reservoirIcon {
      background: url("@{imgPath}/reservoirIcon.png") no-repeat center center;
      background-position-y: 11px;
    }
    .reservoir {
      background: url("@{imgPath}/reservoirLeft.png") no-repeat center center;
       background-position-y: 11px;
    }
    .reservoirCountdxIcon {
       background: url("@{imgPath}/reservoirCountdx.png") no-repeat center center;
        background-position-y: 11px;
    }
    .reservoirCountzxIcon {
       background: url("@{imgPath}/reservoirCountzx.png") no-repeat center center;
        background-position-y: 11px;
    }
    .reservoirCountxxIcon {
       background: url("@{imgPath}/reservoirCountxx.png") no-repeat center center;
        background-position-y: 11px;
    }
    .countweirGateWaterIcon {
      background: url("@{imgPath}/countweirGateWater.png") no-repeat center center;
      background-position-y: 0px;
    }
    .floodvillageIcon {
      background: url("@{imgPath}/floodvillage.png") no-repeat center center;
      background-position-y: 7px;
    }
    .teamIcon {
      /* /Users/dreamliu/Desktop/handan_newremodule/bigscreen-special/src/assets/img/discuss/teamIcon_42.png */
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAADRCAYAAACgqsAPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RUU2MzA3MUJGNzYxMUVBQTQ3OTlEMERFNzcxNThCNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RUU2MzA3MkJGNzYxMUVBQTQ3OTlEMERFNzcxNThCNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZFRTYzMDZGQkY3NjExRUFBNDc5OUQwREU3NzE1OEI3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZFRTYzMDcwQkY3NjExRUFBNDc5OUQwREU3NzE1OEI3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++ktNuQAACnRJREFUeNrsXQmQFcUZ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)
        no-repeat center center;
      background-position: 5px -52px;
    }

    /* /Users/dreamliu/Desktop/handan_newremodule/bigscreen-special/src/assets/img/emergencyResource/potentialrisks/potential-risks-icon.png */
    .riverIcon {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAADRCAYAAACgqsAPAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RUU2MzA3MUJGNzYxMUVBQTQ3OTlEMERFNzcxNThCNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RUU2MzA3MkJGNzYxMUVBQTQ3OTlEMERFNzcxNThCNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZFRTYzMDZGQkY3NjExRUFBNDc5OUQwREU3NzE1OEI3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZFRTYzMDcwQkY3NjExRUFBNDc5OUQwREU3NzE1OEI3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++ktNuQAACnRJREFUeNrsXQmQFcUZ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)
        no-repeat center center;
      background-position: 5px 8px;
    }

    .Trouble-icon-caikongtaxian {
      background-image: url(../../../../assets/img/emergencyResource/potentialrisks/potential-risks-icon.png);
      background-position-y: -1300px;
    }

    .Trouble-icon-nishiliu {
      background-image: url(../../../../assets/img/emergencyResource/potentialrisks/potential-risks-icon.png);
      background-position-y: -132px;
    }

    .Trouble-icon-huapo {
      background-image: url(../../../../assets/img/emergencyResource/potentialrisks/potential-risks-icon.png);
      background-position-y: -66px;
    }

    .Trouble-icon-bengta {
      background-image: url(../../../../assets/img/emergencyResource/potentialrisks/potential-risks-icon.png);
      background-position-y: -203px;
    }

    .binanchangsuo {
      background-image: url(../../../../assets/img/emergencyResource/emergencyresource/emergency-resource-icon.png);
      background-position-y: -2576px;
    }

    .dizhenjiancetai {
      background-image: url(data:image/png;base64,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) !important;
    }

    .dzdld {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAACuElEQVRIiY3WTahVVRQH8N+6XcqhUIIWbxAFlSlW0EOUVw2EahCNGmlfIA0iChKqUYE0iGaiFSQ8EHpIRQObPShe8iojhKhIwgSDsKhGhZX6znurwfm459x7rrrgsNdea+3//q+91t4ciqRIVqZ8pX/BSmbnKxp9fmw+8hd5SZGbG5w+7EoPFxIIVKqoxkS4X1oSovGPvK/jbeGstK7jHWF8LtyHHFs/ikH4p/KutQIGatvQwDfYYq2yl+N5a57CR1X8PJ5ucAYtrHL+DA539hm0/BhaaTLXw/hZhS0N+1Xwm8Iu4VQVf81ElkU3W6vewDHpD1Mk/Fnt3i5LqW8QTmP9GNHvhQWckK4V5qWZZm2NNZnYe3i8Q7jlD+fGj6GRw9g7zVnJEl6t4nZjeIX4Xfi0zxHO9hKZxQndavdluYSjOCWk9IFwU8/p1nIGW3FhHHPo4gSJAd7CoGnOSfkbP+AcZrARdxrYNCW+llsNvGTN/nHs8F2LclnbveoO75e/cEh5GsexHkelB8QVSwP/4nbpl4pBNZzMUXOVoKexoUXMZfQfpX3CzVjGEdzVu317PQvY07aHL7JdywPC81OvcyuDVsyqspQvCOuk1/CYcEvvA1lr4W58W9vCUnN9t+Gkdue334L+zNq2g9LLwn8V+A2YFe7Fw5iVokkwfIxH6/VhMestj2NuogRXT+gT/Ione/xPSEfGsBLb8TUMXQKPYK4DO2LeX6IupVfwprKJS9xwB27DZum5CUxC2o+HRP3EhxcbyC7rLonJZv1d2oeFav5T5ftM2tmbVHefB6U5LIf3cwY/G3+8Li9n8A7exfmW/TrsUN6KTVeJ9RV2DBX2dEiMl6I7XxQOYFH2PF3horQsXN/Y+q59F3+7tHto1Y34cGpPlCAFDklf9patu3YbjvUmMv2f557/AdFxMZ1FoSbNAAAAAElFTkSuQmCC)
        no-repeat 11px 75%;
    }

    .dzfxq {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAbCAYAAACAyoQSAAADbklEQVRIiY3WTahVVRQH8N+53ozAPqCIgifOSgcNgtDJ46EIFSHRB4FQVL4kMh0UDfqGFKSZGIEQah9IVvYQw8GDBgkRIcQbNJJCCiQb5EQy+rh773ManO2955x7nrrgsM7e67/+a+1z1tp7F0J1k8JrKre6mhSoGnq5OT3jWs7j3aHSE3i95XxZmsRQ5vfyKkldKVlOD5VWtsBVJ/OiZ66PuEveXEDb/7qh6gqZN8lcA67rswx+ICAhZl0/lWhRdGlsC1nXzxnRxcZ4whH9KDo7xne5IwNlHpQtwEmlh5T2j+fKMeZXyT2Sl6d8k7+V5iRbG/g2d8lQ1FeNR/In3TD+JhP7UZWEu3sq94TCn7i397tmjqFStzAu4iTuwOaeijyCAZ5szda4o3n0VG/QjKtX2syk8CX+w1as6FThEn7CJoXVHdsFha9V1ijMLRu06gat5fOc0eZWMrV8lvVm03IcQWGDqtXtUysdTFVfsjpX69OixVZ1RzNZ7xYdaPkmd0muFx0TbRP9261aCaHZMqOxPix5Q3BRtEWy10glIHhJckgwkOyUbBMy+cgm0bdGZgQfS2Yl58aJhUmMQXZoBl4h2Cs5Llhl5C3JY9KY/DmpQx78nlexXrIkmRMsCe4TfN/q2cBgavmThn9EsC8DT4hONTDrJZ+KCtGS6GDD7/Y8XiW6INrfDCj0Vy91O+/FnlxEOxXubyA/wi6VKs/vati+wPP4C2vxTvdE6qteKi8qfIBbcAiPN6z78ApWYA/eVPctLKhbDZ7F+1jVpe8Pyj9Zv9cJ2LTNK7zd2ThuyHpW/TVq6Wwwg8a/aP7T7VkvtOz1My8Zir4SjDp+D0hmRKdF51uV2+BoBw1jwKxorWBR9FtjnuhOI48K/hAdb/kFQyPzgij6pMM5fh9MraTOuhBtl0TR4XGFT0p/R8YdbPnVz7xkIDos5qOhc7xN70iT92dEK0UfSsrx8VbbNkrWiU5Jfu4EXiN6UPKL6Js+7uk+nZyNt+VN4Zzouw6uEL2gVEmOtWy1fXvWC32H+FByJdmNmxXW9dyL5nGWVv9elofxqsLGvvtUYaHagQN5VMvVr5J9TNO3xy5XLVsmK+3e3vpIroW0Dzu1I6XGRNlxrnrmuwGWI+9LKMtQ6QdcUrixN+truXY2cd07dFsu4Mz/diwQ4aYIOG8AAAAASUVORK5CYII=)
        no-repeat 11px 75%;
    }

    .dzd {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAbCAYAAACAyoQSAAADbklEQVRIiY3WTahVVRQH8N+53ozAPqCIgifOSgcNgtDJ46EIFSHRB4FQVL4kMh0UDfqGFKSZGIEQah9IVvYQw8GDBgkRIcQbNJJCCiQb5EQy+rh773ManO2955x7nrrgsM7e67/+a+1z1tp7F0J1k8JrKre6mhSoGnq5OT3jWs7j3aHSE3i95XxZmsRQ5vfyKkldKVlOD5VWtsBVJ/OiZ66PuEveXEDb/7qh6gqZN8lcA67rswx+ICAhZl0/lWhRdGlsC1nXzxnRxcZ4whH9KDo7xne5IwNlHpQtwEmlh5T2j+fKMeZXyT2Sl6d8k7+V5iRbG/g2d8lQ1FeNR/In3TD+JhP7UZWEu3sq94TCn7i397tmjqFStzAu4iTuwOaeijyCAZ5szda4o3n0VG/QjKtX2syk8CX+w1as6FThEn7CJoXVHdsFha9V1ijMLRu06gat5fOc0eZWMrV8lvVm03IcQWGDqtXtUysdTFVfsjpX69OixVZ1RzNZ7xYdaPkmd0muFx0TbRP9261aCaHZMqOxPix5Q3BRtEWy10glIHhJckgwkOyUbBMy+cgm0bdGZgQfS2Yl58aJhUmMQXZoBl4h2Cs5Llhl5C3JY9KY/DmpQx78nlexXrIkmRMsCe4TfN/q2cBgavmThn9EsC8DT4hONTDrJZ+KCtGS6GDD7/Y8XiW6INrfDCj0Vy91O+/FnlxEOxXubyA/wi6VKs/vati+wPP4C2vxTvdE6qteKi8qfIBbcAiPN6z78ApWYA/eVPctLKhbDZ7F+1jVpe8Pyj9Zv9cJ2LTNK7zd2ThuyHpW/TVq6Wwwg8a/aP7T7VkvtOz1My8Zir4SjDp+D0hmRKdF51uV2+BoBw1jwKxorWBR9FtjnuhOI48K/hAdb/kFQyPzgij6pMM5fh9MraTOuhBtl0TR4XGFT0p/R8YdbPnVz7xkIDos5qOhc7xN70iT92dEK0UfSsrx8VbbNkrWiU5Jfu4EXiN6UPKL6Js+7uk+nZyNt+VN4Zzouw6uEL2gVEmOtWy1fXvWC32H+FByJdmNmxXW9dyL5nGWVv9elofxqsLGvvtUYaHagQN5VMvVr5J9TNO3xy5XLVsmK+3e3vpIroW0Dzu1I6XGRNlxrnrmuwGWI+9LKMtQ6QdcUrixN+truXY2cd07dFsu4Mz/diwQ4aYIOG8AAAAASUVORK5CYII=)
        no-repeat 11px 75%;
    }

    /* Trouble-icon-nishiliu
      Trouble-icon-nishiliu */
  }

  &.yjzy {
    i {
      background-image: url(../../../../assets/img/emergencyResource/emergencyresource/emergency-resource-icon.png);
    }
  }

  &.fhmb {
    i {
      background-image: url(../../../../assets/img/emergencyResource/protectivegoal/protective-goal-icon.png);
    }
  }

  &.sftc {
    background: none;

    i {
      height: 50px !important;
      background-size: cover;
      background-image: url(../../../../assets/img/emergencyResource/sen1.png);
    }
  }
}

.bigBox:nth-child(6) {
  .icon_bg {
    background: url(../../../../assets/img/emergencyResource/potentialrisks/bg.png)
      no-repeat !important;
  }
}

// 更化后的样式
.Trouble-icon-dizhi {
  //   background: url('@{imgUrl}/dizhizaihai0.png') no-repeat center center;
  background-position-y: 0;
}

.Trouble-icon-bengta {
  background-position-y: -203px;
}

.Trouble-icon-huapo {
  background-position-y: -66px;
}

.Trouble-icon-nishiliu {
  background-position-y: -132px;
}

.Trouble-icon-dimiantaxian {
  background-position-y: -337px;
}

.Trouble-icon-weihua {
  //   background: url('@{imgUrl}/weihuaqiye0.png') no-repeat center center;
  background-position-y: -399px;
}

.Trouble-icon-shengchanqiye {
  background-position-y: -458px;
}

.Trouble-icon-jingyingqiye {
  background-position-y: -517px;
}

.Trouble-icon-shiyongqiye {
  background-position-y: -577px;
}

.Trouble-icon-qitaqiye {
  background-position-y: -399px;
}

// 全市国有林场
.FOR_qsgylc {
  background-image: url(../../../../assets/img/emergencyResource/qsgylc.png) !important;
}

// 防火自然保护地
.FOR_fhbhd {
  background-image: url(../../../../assets/img/emergencyResource/fhbhd.png) !important;
}

// 防火重点部位
.FOR_fhzdbw {
  background-image: url(../../../../assets/img/emergencyResource/fhzdbw.png) !important;
}

// 防火装备
.FOR_fhzb {
  background-image: url(../../../../assets/img/emergencyResource/fhzb.png) !important;
}

// 防火阻隔带信息
.FOR_fhzgdxx {
  background-image: url(../../../../assets/img/emergencyResource/fhzgdxx.png) !important;
}

// 防火气象监测站
.FOR_fhqxjcz {
  background-image: url(../../../../assets/img/emergencyResource/fhqxjcz.png) !important;
}

// 全市自然保护区
.FOR_qgzrbhq {
  background-image: url(../../../../assets/img/emergencyResource/qgzrbhq.png) !important;
}

// 全市森林防灭火重点乡镇
.qsfmhzdxz {
  background-image: url(../../../../assets/img/emergencyResource/fmhzdxz.png) !important;
}

.dizhenjiancetai {
  background-image: url(data:image/png;base64,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) !important;
}

// 防火检查站
.fhjcz {
  background-image: url(../../../../assets/img/emergencyResource/fhjcz.png) !important;
}

// 防火瞭望塔
.fhlwt {
  background-image: url(../../../../assets/img/emergencyResource/fhlwt.png) !important;
}
// 建材行业
.Trouble-icon-buildingmaterial {
  background-image: url(../../../../assets/img/emergencyResource/buildingmaterial.png) !important;
  background-position: 50% 68%;
}
// 轻工行业
.Trouble-icon-lightindustry {
  background-image: url(../../../../assets/img/emergencyResource/lightindustry.png) !important;
  background-position: 50% 68%;
}
// 纺织行业
.Trouble-icon-spin {
  background-image: url(../../../../assets/img/emergencyResource/spin.png) !important;
  background-position: 50% 68%;
}
// 烟草行业
.Trouble-icon-tobacco {
  background-image: url(../../../../assets/img/emergencyResource/tobacco.png) !important;
  background-position: 50% 68%;
}
// 商贸行业
.Trouble-icon-commerce {
  background-image: url(../../../../assets/img/emergencyResource/commerce.png) !important;
  background-position: 50% 68%;
}
// 政府救援队伍
.GovernmentRescueTeam {
   background-image: url(../../../../assets/img/emergencyResource/zfjydw.png) !important;
   background-position: 50% 68%;
}
// 其他救援队伍
.OtherRescueTeams {
  background-image: url(../../../../assets/img/emergencyResource/qtjy.png) !important;
   background-position: 50% 68%;
}
.Trouble-icon-zhongda {
  background-position-y: -637px;
}

.Trouble-icon-weikuang {
  background-position-y: -700px;
}

.Trouble-icon-caikongtaxian {
  background-position-y: -1300px;
}

.Trouble-icon-yanhua {
  background-position-y: -763px;
}

.Trouble-icon-feijinshu {
  background-position-y: -826px;
}

.Trouble-icon-meikuang {
  background-position-y: -888px;
}
// 尾矿库基本信息及包保信息
.Rescue-icon-wkkxx {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-wkkxx.png) no-repeat center center!important;
}
.Trouble-icon-gongmao {
  background-position-y: -951px;
}

.Trouble-icon-yejin {
  background-position-y: -1012px;
}

.Trouble-icon-youse {
  background-position-y: -1073px;
}

.Trouble-icon-jixiezz {
  background-position-y: -1132px;
}

.Trouble-icon-fenchen {
  background-position-y: -1194px;
}

.Trouble-icon-sheanzl {
  background-position-y: -1252px;
}

.ResourceTrouble-icon-jiuyuandui {
  background-position-y: 6px;
}

.ResourceTrouble-icon-fxkhjiuyuandui {
  background-position-y: -61px;
}

.ResourceTrouble-icon-xiaofangjiuyuan {
  background-position-y: -193px;
}

.ResourceTrouble-icon-senlinjiuyuandui {
  background-position-y: -272px;
}

.ResourceTrouble-icon-whbjiuyuandui {
  background-position-y: -341px;
}

.ResourceTrouble-icon-ksjiuyuandui {
  background-position-y: -414px;
}

// .ResourceTrouble-icon-fksjiuyuandui {
//   background-position-y: -479px;
// }

.ResourceTrouble-icon-smjiuyuandui {
  background-position-y: -546px;
}

.ResourceTrouble-icon-jtysjiuyuandui {
  background-position-y: -606px;
}

.ResourceTrouble-icon-yjgdjiuyuandui {
  background-position-y: -671px;
}

.ResourceTrouble-icon-ydtxjiuyuandui {
  background-position-y: -737px;
}

.ResourceTrouble-icon-rqjiuyuandui {
  background-position-y: -801px;
}

.ResourceTrouble-icon-hjjiuyuandui {
  background-position-y: -864px;
}

.ResourceTrouble-icon-dljiuyuandui {
  background-position-y: -924px;
}

.ResourceTrouble-icon-hsjiuyuandui {
  background-position-y: -988px;
}

.ResourceTrouble-icon-cbyyjiuyuandui {
  background-position-y: -1053px;
}

.ResourceTrouble-icon-yiliaoweishen {
  background-position-y: -3524px;
}

.ResourceTrouble-icon-gkmtqxd {
  background-position-y: -3640px;
}

.ResourceTrouble-icon-gkkyczyjd {
  background-position-y: -3700px;
}

.ResourceTrouble-icon-gksgaqd {
  background-position-y: -3760px;
}

.ResourceTrouble-icon-jzyjjyd {
  background-position-y: -3827px;
}

.ResourceTrouble-icon-kyyjjyd {
  background-position-y: -3890px;
}

.ResourceTrouble-icon-yjyld {
  background-position-y: -3950px;
}

.ResourceTrouble-icon-qxdw {
  background-position-y: -4014px;
}

.ResourceTrouble-icon-jxsbshll {
  background-position-y: -4076px;
}

.ResourceTrouble-icon-mjjyd {
  background-position-y: -4204px;
}

.Rescue-icon-jiuyuanzhuangbei {
  background-position-y: -1121px;
}

.ResourceTrouble-icon-chubeiku {
  background-position-y: -2010px;
}

// 森林防火物资储备库
.sen-slfhwzcbk {
  background-image: url(../../../../assets/img/emergencyResource/emergencyresource/emergency-resource-icon.png) !important;
  background-position-y: -2164px;
}

.ResourceTrouble-icon-tyfjhchubeiku {
  background-position-y: -6906px;
}

.ResourceTrouble-icon-fxkhwzk {
  background-position-y: -6243px;
}

.ResourceTrouble-icon-csfxwzk {
  background-position-y: -6304px;
}

.ResourceTrouble-icon-xiaofangchubeiku {
  background-position-y: -6364px;
}

.ResourceTrouble-icon-fhwzk {
  background-position-y: -6424px;
}

.ResourceTrouble-icon-dlsswzk {
  background-position-y: -6484px;
}

.ResourceTrouble-icon-txwzk {
  background-position-y: -6546px;
}

.ResourceTrouble-icon-swfywzk {
  background-position-y: -6606px;
}

.ResourceTrouble-icon-jcxfwzk {
  background-position-y: -6846px;
}

.ResourceTrouble-icon-yyfzwzk {
  background-position-y: -6789px;
}

.ResourceTrouble-icon-fkjywzk {
  background-position-y: -6726px;
}

.ResourceTrouble-icon-fzwzk {
  background-position-y: -2010px;
}

.ResourceTrouble-icon-shehuichubeiku {
  background-position-y: -2010px;
}

.ResourceTrouble-icon-difangchubeiku {
  background-position-y: -1922px;
}

.ResourceTrouble-icon-zhonyangchubeiku {
  background-position-y: -1922px;
}

.ResourceTrouble-icon-senlinxiaofangju {
  background-position-y: -1922px;
}

.ResourceTrouble-icon-binan {
  background-position-y: -2576px;
}

.ResourceTrouble-icon-zhuanjia {
  background-position: 2px -2643px;
}

.Database-icon-portwharf {
  background-position-y: 6px;
}

.Database-icon-airport {
  background-position: 4px -55px;
}

.Database-icon-station {
  background-position: 4px -114px;
}

.Database-icon-qichezhan {
  background-position: 4px -174px;
}

.ResourceTrouble-icon-school {
  background-position: 4px -236px;
}

.Database-icon-hospital {
  background-position: 3px -294px;
}

.Database-icon-resrrvoir {
  background-position-y: -2002px;
}

.Database-icon-wenwubaohu {
  background-position: 3px -598px;
}

.Database-icon-danzhenjiguan {
  background-position: 3px -353px;
}

.Database-icon-zhengfujiguan {
  background-position: 3px -353px;
}

.Database-icon-xingwenguanbo {
  background-position: 3px -415px;
}

.Database-icon-dianshitai {
  background-position: 5px -1984px;
}

.Database-icon-guanbodiantai {
  background-position: 5px -2113px;
}

.Database-icon-tongxunse {
  background-position: 5px -2050px;
}

.Database-icon-keyanjigou {
  background-position: 3px -476px;
}

.Database-icon-guofangkeji {
  background-position: 5px -2174px;
}

.Database-icon-keyandanwei {
  background-position: 5px -2236px;
}

.Database-icon-yinhangjinrong {
  background-position: 3px -535px;
}

.Database-icon-qitazhian {
  background-position-y: -722px;
}

.Database-icon-gongzhongjuji {
  background-position: 2px -774px;
}

.Database-icon-binguanfandian {
  background-position: 2px -1200px;
}

.Database-icon-danganguan {
  background-position: 3px -1912px;
}

.Database-icon-daxingshangmao {
  background-position: 2px -1260px;
}

.Database-icon-jimaoshichang {
  background-position: 2px -1320px;
}

.Database-icon-daxinwenhua {
  background-position: 2px -1380px;
}

.Database-icon-lvyoujingqu {
  background-position: 2px -1438px;
}

.Database-icon-wenhuachangguan {
  background-position: 2px -1508px;
}

.Database-icon-smxsheshi {
  background-position: 2px -836px;
}

.Database-icon-gongdianshebei {
  background-position: 4px -1638px;
}

.Database-icon-gongshuishebei {
  background-position: 4px -1708px;
}

.Database-icon-ranqishebei {
  background-position: 5px -1780px;
}

.Database-icon-daxingnengyuan {
  background-position: 5px -1842px;
}

.Database-icon-shuizhagongcheng {
  background-position: 2px -954px;
}

.Database-icon-haiyangmuchang {
  background-position: 2px -1076px;
}

.Database-icon-yangzhichang {
  background-position: 2px -1136px;
}

.Database-icon-jiayouzhan {
  background-position: 2px -1014px;
}

.Database-icon-nuclearinfo {
  background-position-y: -901px;
}

.yjzy-icon-airport {
  background-position-y: -8850px;
}

.Specialist-icon-wxhxp {
  background-position-y: -3083px;
}

.Specialist-icon-gsm {
  background-position-y: -3209px;
}

.Specialist-icon-hzfz {
  background-position-y: -2960px;
}

.Specialist-icon-xjyxxh {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/xjyxxhzj.png)
    no-repeat center center !important;
  background-size: 100% 100%;
}

.Specialist-icon-fxkh {
  background-position-y: -2708px;
}

.Specialist-icon-dzdzzh {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/dzdzzj.png)
    no-repeat center center !important;
  background-size: 100% 100%;
}

// 全市森林防火重点区域
.qsslfhzdqy {
  background-position-y: 2px;
}

// 全市森林资源分布图
.qsslzyfbt {
  background-position-y: -78px;
}

// 全市树种结构分布图
.qsszjgfbt {
  background-position-y: -158px;
}

// 森林消防应急队伍
// 修改图标偏下 毕东方 2021.10.30
.sen-slxfjyd {
  background-position-y: -233px; 
}
// 市级森林消防应急队伍
.city-slxfjyd {
 background-image: url(../../../../assets/img/emergencyResource/city_slxfyjd.png) !important;
 background-size: 100% 100% !important;
}
// 区县级森林消防应急队伍
.county-slxfjyd {
 background-image: url(../../../../assets/img/emergencyResource/country_slxfyjd.png) !important;
 background-size: 100% 100% !important;
}


// 直升机取水点
.sen-zsjqsd {
  background-position-y: -395px;
  background-position-x: 1px;
}

.sen-qsmt {
  background-position-y: -475px;
}

.sen-qsd {
  background-position-y: -553px;
}

// 直升机起降点/停机坪
.sen-zsjqjd {
  background-position-y: -628px;
}
.ResourceTrouble-icon-bdwzk {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/localrepository.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.ResourceTrouble-icon-wtwzk {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/entrustrepository.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
// 森防
.ischeckout {
  color: yellow;
}
.Specialist-icon-aq {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/aq.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-gs {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/gs.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-mk {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/mk.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-fmks {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/fmks.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-hx {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/hx.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-yjjy {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/yjjy.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-hz{
  background: url(../../../../assets/img/emergencyResource/emergencyresource/hz.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-yhbz {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/yhbz.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-jz {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/jz.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-zhaq {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/zhaq.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-dz {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/dz.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-fx {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/fx.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-xx {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/xx.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-jypg {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/jypg.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.Specialist-icon-ty {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/ty.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}

.Specialist-icon-zcfg {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/zc.png)
    no-repeat center center !important;
  background-size: 100% 100%;
  background-position-y: 70%!important;
}
.ResourceTrouble-icon-zhuanjiag {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/zhuanjiag.png)
    no-repeat center center !important;
  background-size: 100% 100%;
}
.ResourceTrouble-icon-zhuanjiaprovince {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/zhuanjiaprovince.png)
    no-repeat center center !important;
  background-size: 100% 100%;
}
.ResourceTrouble-icon-zhuanjias {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/zhuanjias.png)
    no-repeat center center !important;
  background-size: 100% 100%;
}
.ResourceTrouble-icon-professionalzhuanjia {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/professionalzhuanjia.png)
    no-repeat center center !important;
  background-size: 100% 100%;
}
</style>
