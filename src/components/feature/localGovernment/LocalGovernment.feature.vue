<!-- 当地政府 -->
<template>
  <div class="ca-list-wrap">
    <!-- <div class="LocalGoverment-panelFlagBg" v-if="isFlash"></div> -->
    <dl class="ca-list-dl" v-for="item of laders" :key="item.infomationname">
      <dt class="ca-list-dt">{{ item.infomationwork }}</dt>
      <dd class="ca-list-dd">
        {{ item.infomationname }}
        <i class="ca-list-dd-icon" @click="clickOpenCallPhone(item)"></i>
      </dd>
    </dl>
    <div class="ca-panel-call" v-show="!isHide">
      <div class="ca-panel-call_close" @click="clickCloseCallPanel"></div>
      <div class="ca-panel-call_name">{{ lader.infomationname }}</div>
      <div class="ca-panel-call_calljob">{{ lader.infomationwork }}</div>
      <div class="ca-panel-call_callNumber">{{ lader.infomationphone }}</div>
      <div class="ca-panel-call-closeNumber" @click="clickCloseCallPanel"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SocketComponents from '@/util/Socketcomponents.js';
import { ILaders } from '@/interface/feature/earthquake/LocalGovernment.interface';

@Component({
  name: 'LocalGovernment',
})
export default class LocalGovernment extends Vue {
  @Prop({
    default: () => [],
  })
  public laders!: ILaders[];
  // 数据背景闪烁状态。
  // public isFlash: boolean = false;
  // 拨打电话面板的显示状态
  public isHide: boolean = true;

  public lader: ILaders = {
    work: '',
    infomationwork: '',
    infomationname: '',
    infomationphone: '',
  };
  // 打开拨打电话面板
  public clickOpenCallPhone(data: any) {
    this.lader = data;
    this.isHide = false;
  }
  // 关闭拨打电话面板
  public clickCloseCallPanel() {
    this.isHide = !this.isHide;
  }

  public created() {
    // if (this.laders.length > 0) {
    //     this.ladersData = this.laders;
    // }
    // const that = this;
    // SocketComponents.localGovernment((res: any) => {
    //     that.isFlash = !that.isFlash;
    //     const obj = JSON.parse(res);
    //     that.ladersData.unshift(JSON.parse(JSON.stringify(obj)));
    // });
  }
  // private callback() {
  //   this.isFlash = !this.isFlash;
  // }
}
</script>
<style lang="less" scoped>
// @import url(); 引入公共css类
.ca-list-wrap {
  padding: 15px 16px 0px 20px;
  height: 260px;
  overflow: hidden;
  margin-right: 10px;
}
.ca-list-dl {
  margin: 0;
  padding: 0;
  display: table;
  table-layout: fixed;
  width: 100%;
  font-size: 28px;
  position: relative;
}
.ca-list-dt {
  display: table-cell;
  vertical-align: middle;
  width: 70%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 5px 6px;
  margin: 0;
  color: #bde9ee;

  &:before {
    display: inline-block;
    content: '';
    margin-left: 10px;
    width: 10px;
    height: 10px;
    background-color: #00ffff;
    box-shadow: 0 0 0 4px rgba(0, 255, 255, 0.4);
    border-radius: 50%;
    margin-right: 20px;
    vertical-align: 5px;
  }
}
.ca-list-dd {
  display: table-cell;
  vertical-align: middle;
  padding: 0 5px 6px;
  text-align: right;
  color: rgba(0, 227, 255, 1);
  white-space: nowrap;
  cursor: default;
  .ca-list-dd-icon {
    vertical-align: middle;
    display: inline-block;
    width: 34px;
    height: 34px;
    background: url(../../../assets/img/localGovernment/phone.png) 50% 50%
      no-repeat;
    cursor: pointer;
    &:hover {
      // background-image: url(../../../assets/img/localGovernment/phone-active.png);
    }
  }
}
.ca-list-dl + .ca-list-dl {
  margin-top: 20px;
}
.ca-panel-call {
  position: absolute;
  right: 13%;
  top: 36%;
  width: 331px;
  height: 401px;
  border-radius: 5px;
  display: none1;
  background-image: url(../../../assets/img/localGovernment/phoneCallSpecial.gif);
  background-size: 100% 100%;
  z-index: 1;
}
.ca-panel-call-closeNumber{
  cursor: pointer;
  width: 20%;
  height: 20%;
  position: absolute;
  left: 42%;
  bottom: 11%;
  // background: red;
}
.ca-panel-call_close {
  width: 35px;
  height: 33px;
  position: absolute;
  cursor: pointer;
  right: 0;
  top: 0px;
}
.ca-panel-call_name {
  width: 100%;
  height: 100px;
  position: absolute;
  right: 0;
  top: 37%;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.ca-panel-call_calljob {
  width: 100%;
  height: 200px;
  position: absolute;
  right: 0;
  top: 50%;
  text-align: center;
  font-size: 18px;
  color: #cfcfcf;
}
.ca-panel-call_callNumber {
  width: 100%;
  height: 200px;
  position: absolute;
  right: 0;
  top: 62%;
  text-align: center;
  font-size: 24px;
  color: #b9b5b5;
}
/*.LocalGoverment-panelFlagBg {
  position: absolute;
  top: 51px;
  width: 455px;
  height: 275px;
  background-image: url(../../../assets/img/localGovernment/flagBg.png);
  background-size: 100% 100%;
  z-index: 0;
  animation: twinkling 3s alternate forwards;
}
@-webkit-keyframes twinkling {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes twinkling {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  70% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  90% {
    opacity: 0;
  }
  95% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}*/
// .noDataClass {
//     width: 100%;
//     text-align: center;
//     font-size: 28px;
//     color: #bdebef;
//     padding-top: 16%;
//   }
</style>
