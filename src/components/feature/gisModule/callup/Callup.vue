<template>
  <div class="container">
    <!-- 没服务 -->
    <template v-if="!serveState">
      <div class="serveError-container">请恢复电话功能</div>
    </template>
    <!-- 有服务时 -->
    <template v-else>
      <div class="serveSuccess-container" v-if="!showPhone">
        <div class="dialBox">
          <div class="dialClose" @click="closePhone"></div>
          <div class="bohao">
            <div class="iphoneheader">
              <div class="inputnumber">
                <el-input
                  v-model="iphonenumber"
                  style="color: white; font-size: 20px"
                  ref="contentArea"
                  id="emojiInput"
                ></el-input>
                <div class="bottomline"></div>
              </div>
            </div>
            <ul>
              <li class="iphonenumberli" @click="iphonename('1')">
                <div class="numebericon">1</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('2')">
                <div class="numebericon">2</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('3')">
                <div class="numebericon">3</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('4')">
                <div class="numebericon">4</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('5')">
                <div class="numebericon">5</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('6')">
                <div class="numebericon">6</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('7')">
                <div class="numebericon">7</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('8')">
                <div class="numebericon">8</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('9')">
                <div class="numebericon">9</div>
              </li>
              <li class="iphonenumberliss" @click="iphonename('*')">
                <div class="numebericon">*</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('0')">
                <div class="numebericon">0</div>
              </li>
              <li class="iphonenumberli" @click="iphonename('#')">
                <div class="numebericon">#</div>
              </li>
              <li class="iphonenumberlis" @click="tocall">
                <div class="iphoneicon">拨打</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="serveSuccess-container" v-if="showPhone">
        <div class="managerCallPhone">
          <div class="callPhoneUserHead" @click="closePhone"></div>
          <div class="callPhoneUserCompany" :title="telName ? telName : ''">
            {{ telName ? telName : "" }}
          </div>
          <div class="callPhoneUserNumber">
            {{ iphonenumber }}
          </div>
          <div class="callPhoneUserHangUpSpec callPhoneUserCommon">
            {{ phoneText }}
          </div>
          <div
            class="callPhoneUserHangUp callPhoneUserCommon"
            @click="closePhone"
          ></div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { jiesiruiServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
import { any } from 'core-js/fn/promise';
// import ICPSDK from '../../../../../public/deps/icpsdkall.js';
@Component({
  name: 'Callup',
})
export default class Callup extends Vue {
  @Prop() private sourceObj: any;
  private telObj: any = '';
  private telName: any = '';
  private telVal: any = '';
  private telEvent: any = '';
  private serveState = false; // false 为服务为开，true为有服务
  private timeData: any = null;
  private phoneText: string = '呼叫中…';
  private iphonenumber: any = '';
  private showPhone: boolean = false;
  private ICP: any = '';
  private cid: any = '';
  // 拨号面板
  private iphonename(iphone: string) {
    const elInput: any = document.getElementById('emojiInput'); // 根据id选择器选中对象
    const startPos = elInput.selectionStart; // input 第0个字符到选中的字符
    const endPos = elInput.selectionEnd; // 选中的字符到最后的字符
    if (startPos === undefined || endPos === undefined) {
      return;
    }
    const txt = elInput.value;
    // 将数值添加到选中的光标位置
    const result: any =
      txt.substring(0, startPos) + iphone + txt.substring(endPos);
    elInput.value = result; // 赋值给input的value
    // 重新定义光标位置
    elInput.focus();
    elInput.selectionStart = startPos + 1;
    elInput.selectionEnd = startPos + 1;
    this.iphonenumber = result; // 赋值给表单中的的字段
  }
  // 开始打电话服务
  private makeCall() {
    this.serveState = this.sourceObj.showFlag;
    this.telObj = this.sourceObj.telObj;
    this.telName = this.sourceObj.telName;
    this.telVal = this.sourceObj.telVal;
    this.telEvent = this.sourceObj.telEvent;
    this.iphonenumber = this.telVal;
  }
  private callPhone() {
    if (!this.serveState) {
      // 当打电话服务失败，则提示 请恢复电话功能
      this.handleServeError();
    } else {
      this.showPhone = true;
      this.handleServeSuccess(this.iphonenumber);
    }
  }
  // 拨号接口
  private async jiesiruiSingllCall(phoneNumber: any) {
    const opts = {
      mobilePhone: phoneNumber,
    };
    const res: any = await jiesiruiServer.jiesiruiSingllCall(opts);
    if (res.status === 200) {
      this.jiesiruiMemberStatus();
      let num: any = 0;
      this.timeData = setInterval(() => {
        num++;
        this.jiesiruiMemberStatus(num);
      }, 2000);
    }
  }
  // 获取当前状态
  private async jiesiruiMemberStatus(num?: any) {
    const self = this;
    const res: any = await jiesiruiServer.jiesiruiMemberStatus();
    if (res.status === 200) {
      const len = res.data.length;
      res.data.forEach((item: any) => {
        if (item.Status === 4 && item.OppNumber !== '') {
          self.phoneText = '已接通';
        } else if (
          // 接通电话后对方挂断后获取状态关闭电话面板
          len === 4 &&
          item.Status === 1 &&
          item.OppNumber === ''
        ) {
          clearInterval(this.timeData);
          self.messsageBus.emit('showCallup', false); // 关闭电话面板
        } else if (
          // 在50s内未接电话但是是服务器自动挂断电话的时候也调挂断接口
          num >= 25 &&
          len === 3 &&
          item.Status === 3 &&
          item.OppNumber !== ''
        ) {
          self.jiesiruiHangUp();
        } else if (
          // 在50s内未接电话就前端自动挂断电话
          num >= 25 &&
          len === 2 &&
          item.Status === 3 &&
          item.OppNumber !== ''
        ) {
          self.jiesiruiHangUp();
        }
      });
    }
  }
  // 挂断接口
  private async jiesiruiHangUp() {
    // const res: any = await jiesiruiServer.jiesiruiHangUp();
    this.releaseDialout();
    clearInterval(this.timeData);
    this.showPhone = false;
    this.iphonenumber = '';
    this.messsageBus.emit('showCallup', false); // 关闭面板
  }
  private closePhone() {
    this.jiesiruiHangUp();
  }
  // 处理服务成功
  private handleServeSuccess(key: any) {
    const that = this;
    this.serveState = true;
    this.jiesiruiSingllCall(key);
  }

  // 处理服务失败时
  private handleServeError() {
    this.serveState = false;
    setTimeout(() => {
      this.messsageBus.emit('showCallup', false); // 关闭电话面板
    }, 1000);
  }
  // 初始化ICP
  private ICPSDKs() {
    const that = this;
    const sdkStatusNotify = 'sdkStatusNotify';
    const config: any = {
      serverWSPort: publishObjectPath.value.sdkconfig.serverWSPort,
      serverAddress: publishObjectPath.value.sdkconfig.serverAddress,
      serverHttpPort: publishObjectPath.value.sdkconfig.serverHttpPort,
    };
    config[sdkStatusNotify] = function(data: any) {
      console.log('初始化返回' + JSON.stringify(data));
      that.sdklogin();
    };
    this.ICP = new (window as any).ICPSDK(config);
  }
  private created() {
    this.makeCall();
    this.ICPSDKs();
  }
  private sdklogin() {
    const that = this;
    const person = {
      user: publishObjectPath.value.sdkconfig.user,
      password: publishObjectPath.value.sdkconfig.password,
      force: 'true',
      callback(data: any) {
        console.log('登陆' + JSON.stringify(data));
        that.sdkregister();
      },
    };
    this.ICP.dispatch.auth.unifiedLogin(person);
  }
  private sdkregister() {
    const that = this;
    this.ICP.dispatch.event.register({
      eventType: 'VoiceNotify',
      eventName: 'OnDialOutProceeding',
      callback(data: any) {
        const calldata = data;
        that.cid = calldata.value.cid;
      },
    });
    this.ICP.dispatch.event.register({
      eventType: 'VoiceNotify',
      eventName: 'OnDialOutRinging',
      callback(data: any) {
        // console.log('呼出回铃事件注册' + JSON.stringify(data));
      },
    });
    this.ICP.dispatch.event.register({
      eventType: 'VoiceNotify',
      eventName: 'OnUserStatusNotify',
      callback(data: any) {
        console.log('用户状态事件注册' + JSON.stringify(data));
      },
    });
    this.ICP.dispatch.event.register({
      eventType: 'VoiceNotify',
      eventName: 'OnCallConnect',
      callback(data: any) {
        console.log('通话事件注册' + JSON.stringify(data));
      },
    });
    this.ICP.dispatch.event.register({
      eventType: 'VoiceNotify',
      eventName: 'OnDialOutFailure',
      callback(data: any) {
        // console.log('呼出失败事件注册' + JSON.stringify(data));
        const calldata = data;
        let message1: any = '';
        switch (calldata.rsp) {
          case '2013':
            message1 = '被叫用户正忙';
            break;
          case '2016':
            message1 = '没有权限外呼';
            break;
          case '2017':
            message1 = '没有应答，超时';
            break;
          case '2018':
            message1 = '被叫用户号码不存在';
            break;
          case '2024':
            message1 = '被叫用户号码未在线或被叫号码挂断呼叫';
            break;
          default:
            message1 = '呼出失败';
        }
        that.$message({
            message: message1,
            type: 'warning',
            duration: 1000,
          });
        that.closePhone();
      },
    });
    this.ICP.dispatch.event.register({
      eventType: 'VoiceNotify',
      eventName: 'OnCallRelease',
      callback(data: any) {
        that.showPhone = false;
      },
    });
  }
  private tocall() {
    const that = this;
    const iphonenumber = '0' + this.iphonenumber;
    const param: any = {
      // to: publishObjectPath.value.sdkconfig.to,
      to: this.iphonenumber,
      callback(data: any) {
        console.log('电话回调' + JSON.stringify(data));
        that.showPhone = true;
      },
    };
    this.ICP.dispatch.voice.dialout(param);
  }
  private releaseDialout() {
    const param: any = {
      cid: this.cid,
      callback(data: any) {
        console.log('挂断回调' + JSON.stringify(data));
      },
    };
    this.ICP.dispatch.voice.releaseDialout(param);
  }
  private beforeDestory() {
    clearInterval(this.timeData);
  }
}
</script>
<style lang="less">
.inputnumber {
  .el-input__inner {
    font-size: 32px !important;
    color: #fff !important;
    border: 0px !important;
    background-color: transparent;
  }
}
</style>
<style lang="less" scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;

  .serveError-container {
    width: 140 px;
    height: 50px;
    text-align: center;
    // background: #00e8fd;
    color: #4bf4fb;
    position: absolute;
    top: calc(50% - 25px);
    left: calc(50% - 70px);
    font-size: 30px;
    line-height: 50px;
    background: rgba(7, 25, 65, 0.8);
  }
  .serveSuccess-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.managerCallPhone {
  width: 386px;
  height: 551px;
  background: url(../img/callphoneBg.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.dialBox {
  width: 386px;
  height: 551px;
  background: url(../img/callPhone.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  .dialClose {
    width: 90px;
    height: 48px;
    position: absolute;
    right: 10px;
    top: 8px;
    background: url(../img/closetypecodebg.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    &:hover {
      background: url(../img/closetypecodebox.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  .bohao {
    width: 90%;
    margin: auto;
    height: calc(100% - 75px);
    padding-top: 100px;
    .iphoneheader {
      height: auto;
      width: 100%;
      .iphonename {
        margin-left: 20px;
        height: 25px;
        width: 156px;
        background: url("../img/citybt.png") no-repeat 0 0;
        background-size: 100% 100%;
        color: rgba(0, 227, 255, 1);
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        line-height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .inputnumber {
        height: 45px;
        width: 250px;
        margin: auto;
        .bottomline {
          height: 2px;
          width: 180px;
          margin: auto;
          background: url("../img/xuanzhong.png") no-repeat 0 0;
          background-size: 100% 100%;
        }
      }
    }
    ul {
      width: 100%;
      height: 100%;
      list-style: none;
      margin: 0;
      padding: 0 0 0 16px;
      .iphonenumberli {
        width: 30%;
        float: left;
        height: 15%;
        text-align: center;
        cursor: pointer;
        .numebericon {
          margin: auto;
          width: 64px;
          height: 64px;
          color: white;
          font-size: 36px;
          font-weight: bold;
          background: url("../img/circlebag.png") no-repeat 0 0;
          background-size: 100% 100%;
          text-align: center;
          line-height: 64px;
        }
      }
      .iphonenumberliss {
        width: 30%;
        float: left;
        height: 19%;
        text-align: center;
        cursor: pointer;
        .numebericon {
          margin: auto;
          width: 64px;
          height: 64px;
          color: white;
          font-size: 68px;
          font-weight: bold;
          background: url("../img/circlebag.png") no-repeat 0 0;
          background-size: 100% 100%;
          text-align: center;
          line-height: 90px;
        }
      }
      .iphonenumberlis {
        cursor: pointer;
        width: 100%;
        float: left;
        height: 24%;
        text-align: center;
        .iphoneicon {
          width: 135px;
          height: 56px;
          color: white;
          font-size: 26px;
          font-weight: bold;
          background: url("../img/dialicon.png") no-repeat 0 0;
          background-size: 100% 100%;
          text-align: center;
          line-height: 56px;
          padding-left: 36px;
          display: inline-block;
          margin-left: -34px;
        }
      }
    }
  }
}
.callPhoneUserHead {
  width: 90px;
  height: 48px;
  position: absolute;
  right: 10px;
  top: 8px;
  background: url(../img/closetypecodebg.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  &:hover {
    background: url(../img/closetypecodebox.png) no-repeat;
    background-size: 100% 100%;
  }
}
.callPhoneUserCommon {
  width: 66%;
  margin: 0px auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.callPhoneUserCompany {
  font-size: 30px;
  height: 50px;
  line-height: 50px;
  color: #ffffff;
  width: 96%;
  padding: 250px 0 0 0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.callPhoneUserNumber {
  font-size: 28px;
  height: 40px;
  line-height: 40px;
  color: #b9b5b5;
  width: 96%;
  margin: 10px 0 0 0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.callPhoneUserHangUp {
  margin-top: 30px;
  width: 80px;
  height: 80px;
  background: url(../img/closePhone.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.callPhoneUserHangUpSpec {
  font-size: 28px;
  height: 40px;
  line-height: 40px;
  color: #2e9dae;
  position: relative;
}
</style>
