<template>
  <div class="CompanyDetail VideoRights">
    <div class="listDistrict popupPanelRight_bg" v-show="closeFlag">
      <template v-if="minimize">
        <div class="closed-container-box">
          <div class="listDistrict_title ">
           <span class="f-tit-h2 title-panel">{{ title }}</span>
          </div>
          <div class="closed-container">
            <span @click="FnMinimize()"  v-if="false" class="panel_btnMinify"></span>
            <span @click="FnClose()" class="panel_btnClose"></span>
          </div>
        </div>
        <!-- 列表每一行-->
        <div class="nodata" v-if="listDataAll.length <= 0">暂无数据</div>

        <ul class="tableList" v-else>
          <el-scrollbar wrap-style="height:240px;">
            <li  class="tableList_li f-txt-com"
                    v-for="(item, index) in listDataAll"
                    :key="index"
                    @click="clickHandler(index,item)"
                    :title="item.cameraindexcode"
                    :class="{ bgcolor : item.bg }"
            >
             
              <span class="flex-item">
                <span :class="['indexSpan']">{{ item.num }}</span>
                <span class="tooltip" :title="item.name">{{ item.name }}</span>
                <!-- <span class="tooltiptext">{{item.name}}</span> -->
              </span>
            </li>
          </el-scrollbar>
        </ul>
        <div id="playWnd" class="videoSurveillance"></div>
      </template>
    </div>
    <!--  style="height:990px;width:1012px;color:#fff;font-size:40px;" -->
    <template  v-if="!minimize">
      <div class="minimize-position" @click="FnMinimize()"></div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// require('../../../../public/deps/jsencrypt.min.js');
// require('../../../../public/deps/jsWebControl-1.0.0.min.js');
/* import jsWebControl from 'jsWebControl-1.0.0.min';
import jsencrypt.min from 'jsencrypt.min'; */
@Component({
  name: 'VideoRight',
})
export default class VideoRight extends Vue {
  // 对应的数据
  @Prop() public listData!: any;
  // 标题传入
  @Prop() public title: any;
  // 发送事件
  @Prop() private itemClick: any;
  // 最小化判断
  private minimize: any = true;
  // 定义 通过inputWord 查出来的数据
  private inputData: any = [];
  // hover 延迟执行
  private hover: any;
  private listDataAll: any = [];
  private noData: any = true;
  private listBgClick: any = '';
  private closeFlag: any = true;
  private indexActive: number = -1;
  private oWebControl: any;
  private initCount: number = 0;
  private pubKey: string = '';
  private obj: any;
  private clickListArr: any = [];
  @Watch('listData')
  private FnlistData(val: any): void {
    this.noData = false;
    if (val.length) {
      // this.initPlugin();
    }
    // this.closeFlag = true;
  }

  private FnMinimize() {
    this.minimize = !this.minimize;
    this.FnClose();
  }
  private clickHandler(index: number, item: any) {
    this.listBgClick = index;
    if (item.bg === true) {
      Vue.set(item, 'bg', false);
    } else {
      Vue.set(item, 'bg', true);
    }
    this.clickListArr.push(item);
    const arrData: any[] = [];
    const obj: any = {};
    for (const ele of this.clickListArr) {  // 去重
      if (!obj[ele.cameraindexcode]) {
        obj[ele.cameraindexcode] = ele.cameraindexcode;
        arrData.push(item);
      }
    }
    this.yulan(arrData);
  }
  // 关闭
  private FnClose() {
    this.closeFlag = !this.closeFlag;
    this.messsageBus.emit('openVideoMonitor', '', {});
    this.closeControl();
  }
  private mounted() {
    this.listDataAll = this.listData;
    // if (this.listDataAll.length > 0) {
    this.initPlugin();
    // }
  }

  // 预览
  private yulan(cameraIndexCode: any) {
    console.debug('开始进入预览，参数为：', cameraIndexCode);
    // cameraIndexCode = ['42081002201320000011', '42081002201320000011'];
    const that = this;   // 获取输入的监控点编号值，必填
    const streamMode = 0;                           // 主子码流标识：0-主码流，1-子码流
    const transMode = 1;                         // 传输协议：0-UDP，1-TCP
    const gpuMode = 0;                           // 是否启用GPU硬解，0-不启用，1-启用
    const wndId = -1;                          // 播放窗口序号（在2x2以上布局下可指定播放窗口）
    //      cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, "");
    //      cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, "");
    if (typeof cameraIndexCode === 'string') {
      console.debug('进入预览string，参数为：', cameraIndexCode);
      const strObj = {
          cameraIndexCode,               // 监控点编号 cameraIndexCode: '42081002201320000011',
          streamMode,                         // 主子码流标识
          transMode,                           // 传输协议
          gpuMode,                               // 是否开启GPU硬解
          wndId,                                     // 可指定播放窗口
        };
      console.debug('进入预览string，制作后的参数为：', strObj);
      that.oWebControl.JS_RequestInterface({
        funcName: 'startPreview',
        argument: JSON.stringify(strObj),
      }).then((res: any) => {
        console.debug('这是视频监控yulan中字符串的执行结果：', res);
      }).catch((res: any) => {
        console.debug('这是视频监控yulan中字符串的执行结果err：', res);
      });
    } else {
      console.debug('进入预览arr，参数为：', cameraIndexCode);
      cameraIndexCode.forEach(function(item: any, index: number) {
        const tmpObj = {
            cameraIndexCode: item.cameraindexcode,                // 监控点编号
            streamMode,                         // 主子码流标识
            transMode,                           // 传输协议
            gpuMode,                               // 是否开启GPU硬解
            wndId,                                    // 可指定播放窗口
          };
        console.debug('进入预览arr,', index, tmpObj);
        that.oWebControl.JS_RequestInterface({
          funcName: 'startPreview',
          argument: JSON.stringify(tmpObj),
        }).then((res: any) => {
          console.debug('这是视频监控yulan中数组的执行结果：', res);
        }).catch((res: any) => {
          console.debug('这是视频监控yulan中数组的执行结果err：', res);
        });
      });
    }

  }

  // 创建播放实例
  private initPlugin() {
    const that = this;
    that.oWebControl = new window.WebControl({
      szPluginContainer: 'playWnd', // 指定容器id
      iServicePortStart: 15900, // 指定起止端口号，建议使用该值
      iServicePortEnd: 15909,
      szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11', // 用于IE10使用ActiveX的clsid
      cbConnectSuccess() {
        // 创建WebControl实例成功
        that.oWebControl
                .JS_StartService('window', {
                  // WebControl实例创建成功后需要启动服务
                  dllPath: './VideoPluginConnect.dll', // 值"./VideoPluginConnect.dll"写死
                })
                .then(
                        function() {
                          // 启动插件服务成功
                          that.oWebControl.JS_SetWindowControlCallback({
                            // 设置消息回调
                            cbIntegrationCallBack: that.cbIntegrationCallBack,
                          });

                          that.oWebControl
                                  .JS_CreateWnd('playWnd', 1000, 600)
                                  .then(function() {
                                    // JS_CreateWnd创建视频播放窗口，宽高可设定
                                    that.init(); // 创建播放实例成功后初始化
                                  });
                        },
                        function() {
                          // 启动插件服务失败
                        },
                );
      },
      cbConnectError() {
        // 创建WebControl实例失败
        that.oWebControl = null;
        $('#playWnd').html('插件未启动，正在尝试启动，请稍候...');
        window.WebControl.JS_WakeUp('VideoWebPlugin://'); // 程序未启动时执行error函数，采用wakeup来启动程序
        that.initCount++;
        if (that.initCount < 3) {
          setTimeout(function() {
            that.initPlugin();
          }, 3000);
        } else {
          $('#playWnd').html('插件启动失败，请检查插件是否安装！<a class="downloadplug" style="width: 60px;display: inline-block;height: 30px;text-decoration: none;text-align: center;background: #ccc;line-height: 30px;font-weight: bold;" href="./videoplug/VideoWebPlugin.exe" download="VideoWebPlugin.exe">安装</button>');
        }
      },
      cbConnectClose(bNormalClose: any) {
        // 异常断开：bNormalClose = false
        // JS_Disconnect正常断开：bNormalClose = true
        that.oWebControl = null;
      },
    });
  }

  // 推送消息
  private cbIntegrationCallBack(oData: any) {
    // window.showCBInfo(JSON.stringify(oData.responseMsg));
  }

  // 初始化
  private init() {
    const that = this;
    const videourl = {
      appkey: '29396328',  //  23346084
      secret: 'SLkhY179mIlPzdayVYrE',  //  MAqvuJfwyOCEs2M2tGR2
      ip: '10.18.18.94', //   183.95.190.107
    };
    that.getPubKey(function() {
      const obj = {
        // a: 1,
        appkey: videourl.appkey, // // 综合安防管理平台提供的appkey，必填
        secret: that.setEncrypt(videourl.secret), // 综合安防管理平台提供的secret，必填
        ip: videourl.ip, // 综合安防管理平台IP地址，必填
        playMode: 0, // 初始播放模式：0-预览，1-回放
        port: 443, // 端口 1443
        snapDir: 'D:\\SnapDir', // 抓图存储路径
        videoDir: 'D:\\VideoDir', // 紧急录像或录像剪辑存储路径
        layout: '2x2', // playMode指定模式的布局
        enableHTTPS: 1, // 是否启用HTTPS协议与综合安防管理平台交互，是为1，否为0
        showToolbar: 1, // 是否显示工具栏 0-不显示，非0-显示
        showSmart: 1, // 是否显示智能信息 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        buttonIDs: '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769', // 自定义工具条按钮
        encryptedFields: 'secret', // 加密字段，默认加密领域为secret
      };
      that.oWebControl
              .JS_RequestInterface({
                funcName: 'init',
                argument: JSON.stringify(obj),
              })
              .then(function(oData: any) {
                that.oWebControl.JS_Resize(944, 600); // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
              });
    });
  }

  // 获取公钥
  private getPubKey(callback: any) {
    const that = this;
    this.oWebControl
            .JS_RequestInterface({
              funcName: 'getRSAPubKey',
              argument: JSON.stringify({
                keyLength: 1024,
              }),
            })
            .then(function(oData: any) {
              if (oData.responseMsg.data) {
                that.pubKey = oData.responseMsg.data;
                callback();
              }
            });
  }

  // RSA加密
  private setEncrypt(value: any) {
    const encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(this.pubKey);
    return encrypt.encrypt(value);
  }

  // 关闭
  private closeControl() {
    if (this.oWebControl != null) {
      this.oWebControl.JS_HideWnd(); // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
      this.oWebControl.JS_Disconnect().then(
              function() {
                // 断开与插件服务连接成功
              },
              function() {
                // 断开与插件服务连接失败
              },
      );
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../../assets/css/decisionSupport/AreaList.less');
  .VideoRights{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    .closed-container-box::after{
      content:none;
    }
    .listDistrict{
      width: 976px !important;
      height: 910px !important;
    // outline:1px solid red;
      padding:20px;
      box-sizing:border-box;
      .listDistrict_title{
        // font-size: 28px !important;
        // color: #00e4ff !important;
        // line-height: 58px;
        padding-left: 26px;
        padding-top:12px;
      }
      .tableList{
        width: 95%;
        margin: 20px;
        // display: table;
        border: solid 1px #4daff8;
        // .bgcolor{
        //   background:rgba(215,185,64,0.15);
        //   border: 1px solid #fef551;
        //   color: #fffabe;
        // }
        &_li{
          border-bottom: 1px solid #55bef9;
          width: 50%;
          // display:table-cell;
          border-right: 1px solid #55bef9;
          vertical-align: middle;
          background: none !important;
          display: flex;
          align-items: stretch;
          // outline:1px solid red;
          &::before{
            content: ' ';
            height:100%;
            // width:5px;
            border-right: 1px solid #55bef9;
            // background-color: #55bef9;
            margin-left:50px;
            display: inline-block;
          }
          .flex-item{
            display:flex;
            flex-direction:row;
            align-items:top;
          }

          .indexSpan{
            display: inline-block;
            background: none !important;
            // border-right: 1px solid #55bef9;
            width:50px;
            text-align:center;
            height:100%;
            margin: 0;
            margin-left:-50px;
            // outline:1px solid red;
          }
          .tooltip{
            padding-left:10px;
            display: inline-block;
            width:100%;
          }
        }
        li:nth-of-type(odd){
          background: rgba(85,190,249,0.3)
        }
      }
    }
    .popupPanelRight_bg{
      background: url("../../../assets/img/darkgreen/panel/videoBg.png") no-repeat !important;
      background-size: 100% 100% !important;
      .closed-container{
        width: 90px !important;
        height: 48px !important;
        background: url("../../../assets/img/halfScreen/eventAndTopics/eventAndTopics_close.png") no-repeat !important;
        background-size: 100% 100%;
        position: absolute;
        right: 10px;
        top: 17px;
      }
      .panel_btnClose:after {
        content: '\2716';
        display: none !important;
        width: 100%;
      }
    }
    .videoSurveillance{
      text-align: center;
    }
  }
</style>
<style>
 .VideoRights .el-scrollbar__view{
    display: flex;
    flex-wrap: wrap;
  }
  .VideoRights .listDistrict .listBox li span:nth-child(1){
    width: 50px;
  }
   .VideoRights .listDistrict .listBox li span:nth-child(2){
    width:80%;
  }

</style>
