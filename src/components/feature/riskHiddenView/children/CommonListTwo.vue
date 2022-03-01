<template>
  <div class="commonListBox">
    <ul v-if="codeKey === 'zj'" class="ulBox">
      <li
        v-for="(itemBtn, indexBtn) in btnTable"
        :key="indexBtn"
        :class="{ btnActive: indexBtn === btnIndex }"
        @click="changeBtn(itemBtn, indexBtn)"
      >
        <p>
          {{ itemBtn.tabNumber }}
          <span class="people">人</span>
        </p>
        <p>
          {{ itemBtn.title }}
        </p>
      </li>
    </ul>
    <div v-for="(item, index) in childernList" :key="index" class="bigBox">
      <!-- <span class="icon yellowHover-cur" :class="item.icon"></span> -->
      <div
        @click.stop="isShowOpenFn(item, index)"
        class="cliickBox img_box"
        :class="item.tabNumber > 0 ? '' : 'gray'"
      >
        <p
          class="yellowHover"
          :class="item.checked && item.fatherId !== 1 ? 'activeFather' : ''"
        >
          <span class="icon_bg" :class="showKeyIcon"
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
          >
            {{ item.title }}
          </span>
        </p>
        <p
          class="tempeRight-total"
          v-if="item.list && item.list.length > 0"
          style="right:35px;top:30%;padding:0 8px;"
        >
          <span class="f-number"> {{ item.tabNumber }}</span>
          <span class="childrenRight-unit">{{ item.unit }}</span>
        </p>
        <p
          class="tempeRight-total"
          v-else
          style="right:35px;cursor: pointer;top:%;padding:0 8px;"
          @click.stop="changeNum(item, index)"
          :class="{
            numActive:
              numCheckedData.codeKey === item.codeKey && item.numChecked,
          }"
        >
          <span class="f-number"> {{ item.tabNumber }}</span>
          <span class="childrenRight-unit">{{ item.unit }}</span>
        </p>
        <i
          :class="
            item.checked
              ? 'tempRight-switch arrows'
              : 'tempRight-switch tempRight-switch-reverse arrows'
          "
          v-if="item.list"
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
          <p
            class="yellowHover"
            :class="{
              activeFather: itemChildren.checked,
            }"
          >
            <span class="icon_bg" :class="showKeyIcon">
              <i :class="itemChildren.icon"></i
            ></span>
            <span
              class="tempRight-titleClick children_title_bg"
              @click="addMapdotChecked(itemChildren)"
              :title="itemChildren.title"
              >{{ itemChildren.title }}</span
            >
          </p>
          <p
            class="childrenRight-total"
            style="cursor: pointer;"
            @click.stop="changeNum(itemChildren)"
            :class="{
              numChildrenActive:
                numCheckedData.codeKey === itemChildren.codeKey &&
                itemChildren.numChecked,
            }"
          >
            <span class="f-number"> {{ itemChildren.tabNumber }}</span>
            <span class="childrenRight-unit">{{ itemChildren.unit }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'CommonListTwo',
  components: {},
})
export default class CommonListTwo extends Vue {
  // 文字高亮属性
  public curCheckedObj: any = {};
  // 数字选中属性
  public curCheckedNumObj: any = {};
  @Prop() private childernList: any; // 从父级拿到的当前组件需要的参数
  @Prop() private showTitle: any;
  @Prop() private codeKey: any;
  @Prop() private btnTable: any;
  private numCheckedData: any = '';
  @Prop() private showKeyIcon: any; // 从父级拿到的当前组件需要的参数匹配icon名
  private activeIndex: any = -1;
  private btnIndex: any = 0;
  private copyData: any = 0;
  // 图标点击事件
  private isShowOpenFn(item: any, index: any) {
    item.checked = !item.checked;
    this.activeIndex = index;
  }
  // 文字点击事件
  // private addMapdot(item: any) {
  //   let checkedFlag = false;
  //   if (this.curCheckedObj.codeKey === item.codeKey) {
  //     // 当前已选中
  //     this.curCheckedObj = {};
  //     this.curCheckedNumObj = {};
  //   } else {
  //     this.curCheckedObj = item;
  //     checkedFlag = true;
  //     this.curCheckedNumObj = {};
  //   }
  //   this.$emit('addMapdot', item, checkedFlag);
  // }
  // 数字点击
  // private changeKuang(data: any) {
  //   if (
  //     this.curCheckedObj.codeKey === data.codeKey &&
  //     this.curCheckedNumObj.codeKey === data.codeKey
  //   ) {
  //     // 取消number选中
  //     // 数字高亮
  //     this.curCheckedNumObj = {};
  //     // 关闭列表弹框
  //     this.$emit('changeKuang', data, false);
  //   } else if (this.curCheckedObj.codeKey === data.codeKey) {
  //     // 如果左侧选择的队伍名称与现在选择的一致,则显示弹窗
  //     this.curCheckedNumObj = data;
  //     this.$emit('changeKuang', data, true);
  //   } else {
  //     // 文字高亮
  //     this.curCheckedObj = data;
  //     // 数字高亮
  //     this.curCheckedNumObj = data;
  //     // 点位信息
  //     this.$emit('addMapdot', data, true);
  //     this.$emit('changeKuang', data, true, this.curCheckedObj.codeKey);
  //   }
  //   this.messsageBus.emit('selectnumpafeone', data); // 触发每次显示都为第一页
  //   this.messsageBus.emit('clearInput', ''); // 点击给列表发消息，清空input搜索框的内容，重新请求所有的数据
  // }
  // 多选文字点击事件
  private addMapdotChecked(item: any) {
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
  // 多选数字点击事件itemFather: any,
  private changeNum(item: any) {
    this.numCheckedData = item;
    // 保证每次进来numChecked为false
    this.deepQueryTwo(this.childernList, item);
    item.numChecked = !item.numChecked;
    if (!item.checked) {
      item.checked = true;
    }
    if (item.numChecked) {
      // 点位信息
      this.$emit('changeNumChecked', item, item.codeKey);
    } else {
      item.checked = false;
      this.$emit('changeNumChecked', item, item.codeKey);
    }
    this.messsageBus.emit('selectnumpafeone', item); // 触发每次显示都为第一页
    this.messsageBus.emit('clearInput', ''); // 点击给列表发消息，清空input搜索框的内容，重新请求所有的数据
  }
  private closePanelFn() {
    this.curCheckedObj = {};
    this.curCheckedNumObj = {};
    this.$emit('addMapdotChecked', this.curCheckedObj);
    this.$emit('changeNumChecked', this.curCheckedObj, false, 'close');
  }
  private deepQuery(tree: any, lable: any) {
    // 递归匹配数据
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
  private changeBtn(item: any, index: any) {
    this.btnIndex = index;
    this.$emit('changeBtn', item);
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
        self.deepQuery(self.childernList, leftItemData);
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
@import '../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
@import '../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
@imgUrl: '../../../../assets/img/emergencyResource/';
@icon: '../../../../assets/img/gisModule/gisLayerPanel';
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
.ulBox {
  display: flex;
  align-items: center;
  li {
    width: 50%;
    height: 80px;
    text-align: center;
    cursor: pointer;
    position: relative;
    p {
      line-height: 36px;
      font-family: 'Microsoft Ya Hei';
      .people {
        font-size: 18px;
        line-height: 18px;
        color: #b5ebfd;
        font-family: 'Impact';
        filter: drop-shadow(0px 3px 3.5px rgba(0, 0, 0, 0.74));
      }
      &:nth-child(1) {
        font-size: 32px;
        color: yellow;
        font-weight: bold;
      }
      &:nth-child(2) {
        color: #b5ebfd;
        font-size: 25px;
      }
    }
    &.btnActive {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 1px;
        background: url('@{icon}/linebottom.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      p {
        &:nth-child(2) {
          color: #fbfeaf;
        }
      }
    }
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
  padding-left: 30px;
  box-sizing: border-box;
  .childrenDiv {
    display: flex;
    align-items: center;
    margin: 15px 0;
    .childrenRight-total {
      height: 45px;
      line-height: 45px;
      padding: 0 8px;
      font-size: 24px;
      letter-spacing: 1px;
      color: #7cf3fc;
      font-family: 'Impact';
      position: absolute;
      right: 35px;
    }
    .childrenRight-unit {
      font-size: 25px;
      font-family: 'Impact' !important;
      color: #7cf3fc;
    }
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
}
.img_box {
  width: 100%;
  position: relative;
  height: 65px;
  padding-top: 15px;
  box-sizing: border-box;
  &:after {
    content: '';
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
  color: #e8f4fe;
  text-align: left;
  line-height: 50px;
  height: 50px;
  position: relative;
  padding-left: 20px;
  width: 235px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 25px;
}
.tempRight-titleClick {
  cursor: pointer;
}
.tempeRight-total {
  position: absolute;
  top: 22px;
  font-size: 25px;
  color: #7cf3fc;
}
.tempRight-unit {
  color: #daf2ff;
}
.arrows {
  top: 37%;
}
.f-number {
  font-size: 31px !important;
  font-family: 'Impact';
}
.yellowHover {
  cursor: pointer !important;
  color: #e5f4ff;
  font-size: 28px;
  font-family: 'myYahei';
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
.icon_bg {
  display: inline-block;
  width: 50px;
  height: 50px;
  background: url(../../../../assets/img/emergencyResource/potentialrisks/bg.png)
    no-repeat;
  background-size: cover;
  vertical-align: middle;
  i {
    display: inline-block;
    width: 50px;
    height: 42px;
    background-size: cover;
    background-repeat: no-repeat;
  }
  &.fxyh {
    i {
      background-image: url(../../../../assets/img/emergencyResource/potentialrisks/potential-risks-icon.png);
    }
  }
  &.yjzy {
    i {
      background-image: url(../../../../assets/img/emergencyResource/emergencyresource/emergency-resource-icon.png);
    }
  }
}
.Rescue-icon-hkzb {
  background-position-y: -1221px;
}
// 救援装备--应急电力保障设备
.Rescue-icon-dlbz {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-dlbz.png) no-repeat center center!important;
}
// 应急救援吊装设备
.Rescue-icon-jydz {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-jydz.png) no-repeat center center!important;
}
// 防火设备
.Rescue-icon-fhsb {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-fhsb.png) no-repeat center center!important;
}
// 应急救援监测设备
.Rescue-icon-jyjc {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-jyjc.png) no-repeat center center!important;
}
// 应急救援破拆设备
.Rescue-icon-jypc {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-jypc.png) no-repeat center center!important;
}
// 应急救援人身防护设备
.Rescue-icon-rsfh {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-rsfh.png) no-repeat center center!important;
}
// 应急救援喷水设备
.Rescue-icon-jyps {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-jyps.png) no-repeat center center!important;
}
// 排水设备
.Rescue-icon-pssb {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-pssb.png) no-repeat center center!important;
}
// 应急局救援装备
.Rescue-icon-jjyzb {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-jjyzb.png) no-repeat center center!important;
}
// 传感器类型代码表
.Rescue-icon-dmb {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-dmb.png) no-repeat center center!important;
}
// 传感器
.Rescue-icon-cgq {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-cgq.png) no-repeat center center!important;
}
// 网关设备
.Rescue-icon-wgsb {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-wgsb.png) no-repeat center center!important;
}
// 减灾委成员
.Rescue-icon-jzwcy {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-jzwcy.png) no-repeat center center!important;
}
// 地震地质救援指挥部成员
.Rescue-icon-dzjy {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/Rescue-icon-dzjy.png) no-repeat center center!important;
}

.Rescue-icon-zsfj {
  background-position-y: -1296px;
}
.Rescue-icon-wrj {
  background-position-y: -1364px;
}
.Rescue-icon-gcqxzb {
  background-position-y: -6553px;
}
.Rescue-icon-wjjjx {
  background-position-y: -1431px;
}
.Rescue-icon-ttj {
  background-position-y: -1500px;
}
.Rescue-icon-dzsb {
  background-position-y: -1567px;
}
.Rescue-icon-zzj {
  background-position-y: -1638px;
}
.Rescue-icon-dllpssb {
  background-position-y: -1707px;
}
.Rescue-icon-fdsb {
  background-position-y: -1773px;
}
.Rescue-icon-jdcz {
  background-position-y: -1844px;
}
.Rescue-icon-xpt {
  background-position-y: -1910px;
}
.Rescue-icon-bence {
  background-position-y: -1976px;
}
.Rescue-icon-yscl {
  background-position-y: -2046px;
}
.Rescue-icon-xfcl {
  background-position-y: -6493px;
}
.Rescue-icon-xfc {
  background-position-y: -6493px;
}
.Rescue-icon-zhihuiche {
  background-position-y: -6613px;
}
.Rescue-icon-jgpsxfc {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/jgps.png) no-repeat center center!important;
  background-size:100% 100%;
}
.Rescue-icon-pmxfc {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/pmxfc.png) no-repeat center center!important;
  background-size:100% 100%;
}
.Rescue-icon-sgxfc {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/sgxfc.png) no-repeat center center!important;
  background-size:100% 100%;
}
.Rescue-icon-gfxfc {
  background: url(../../../../assets/img/emergencyResource/emergencyresource/gfxfc.png) no-repeat center center!important;
  background-size:100% 100%;
}
.Rescue-icon-yskqxfc {
  background-position-y: -6493px;
}
.Rescue-icon-pyxfc {
  background-position-y: -6493px;
}
.Rescue-icon-qxjyxfc {
   background: url(../../../../assets/img/emergencyResource/emergencyresource/gcqx.png) no-repeat center center!important;
  background-size:100% 100%;
}
.Rescue-icon-hybzc {
  background-position-y: -6131px;
}
.Rescue-icon-dgbt {
  background-position-y: -6374px;
}
.Rescue-icon-yunti {
  background-position-y: -6312px;
}
.Rescue-icon-yiliaojycl {
  background-position-y: -6257px;
}
.Rescue-icon-jiuhuche {
  background-position-y: -6257px;
}
.Rescue-icon-ksjiuhuche {
  background-position-y: -6257px;
}
.Rescue-icon-jiuhuzbc {
  background-position-y: -6257px;
}
.Rescue-icon-qtqxcl {
  background-position-y: -6131px;
}
.Rescue-icon-yjtxc {
  background-position-y: -5411px;
}
.Rescue-icon-yjfdc {
  background-position-y: -6188px;
}
.Rescue-icon-pdfdc {
  background-position-y: -6131px;
}
.Rescue-icon-rqqxc {
  background-position-y: -6131px;
}
.Rescue-icon-ryyxc {
  background-position-y: -6070px;
}
.Rescue-icon-bus {
  background-position-y: -6070px;
}
.Rescue-icon-keche {
  background-position-y: -6070px;
}
.Rescue-icon-qtcl {
  background-position-y: -5167px;
}
.Rescue-icon-ssc {
  background-position-y: -5228px;
}
.Rescue-icon-xwc {
  background-position-y: -5288px;
}

.Specialist-icon-fmks {
  background-position-y: -3424px;
}
.Specialist-icon-wxhxp {
  background-position-y: -3355px;
}
.Specialist-icon-gsm {
  background-position-y: -3492px;
}
.Specialist-icon-yjjy {
  background-position-y: -3014px;
}
.Specialist-icon-hzfz {
  background-position-y: -3220px;
}
.Specialist-icon-yhbz {
  background-position-y: -2877px;
}
.Specialist-icon-zcfg {
  background-position-y: -2877px;
}
.Specialist-icon-xjyxxh {
  background-position-y: -2877px;
}
.Specialist-icon-qxzy {
  background-position-y: -3082px;
}
.Specialist-icon-zrzh {
  background-position-y: -3152px;
}
.Specialist-icon-dlqx {
  background-position-y: -3765px;
}
.Specialist-icon-yljz {
  background-position-y: -3833px;
}
.Specialist-icon-fxkh {
  background-position-y: -2947px;
}
.Specialist-icon-txqx {
  background-position-y: -3695px;
}
.Specialist-icon-gcqx {
  background-position-y: -3286px;
}
.Specialist-icon-dzdz {
  background-position-y: -3627px;
}
.Specialist-icon-shjy {
  background-position-y: -2877px;
}
.ischeckout {
  color: yellow;
}
.numActive,
.numChildrenActive {
  background-image: url('@{imgUrl}/yingjidengicannum.png');
  background-size: 100% 100%;
}
</style>
