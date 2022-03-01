<template>
  <div class="panel-emergency-resource">
    <!-- <span @click="clickItemType('卫华企业')" :title="弹出层按钮">弹出层按钮</span> -->
    <el-scrollbar style="height:100%" class="cmp-scrollbar-y">
      <ul class="emergencyResource">
        <li
          :codekey="item.codeKey"
          class="ResourceTroubleLi33"
          v-for="item of dataArr"
          :key="item.codeKey"
        >
         <!-- :class="(curCheckedObj[panelType] && (curCheckedObj[panelType].codeKey === item.codeKey))? 'ischeckout yellowHover' : 'yellowHover'" -->
          <p 
            :class="(curCheckedObj.codeKey === item.codeKey)? 'ischeckout yellowHover  yellowHover-cur' : 'yellowHover'"
            @click.stop="clickText(item)">
           <span class="icon_bg"> <i :class="[ fliterClass(item.codeKey),'ResourceTrouble-icon']"></i></span>
            {{item.tabTitle}}
          </p>
          <!-- ResourceTrouble-num-isActive -->
          <p
            :class="(curCheckedNumObj.codeKey === item.codeKey)? 'ResourceTrouble-num-isActive' : 'ResourceTrouble-num'"
            @click.stop="clickNumber(item)"
          >{{item.tabNumber}}
            <span class="company">{{item.tabTitle.indexOf('救援队') != -1 ? '支' : item.tabTitle.indexOf('专家') != -1 ? '人' : item.tabTitle.indexOf('学校') != -1 ? '所':item.tabTitle.indexOf('医院') != -1 ? '家':item.tabTitle.indexOf('工贸企业') != -1 ? '家':item.tabTitle.indexOf('煤矿企业') != -1 ? '家':item.tabTitle.indexOf('烟花爆竹') != -1 ? '家':item.tabTitle.indexOf('非煤矿山') != -1 ? '家':item.tabTitle.indexOf('危化企业') != -1 ? '家':'个' }}</span>
          </p>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { messsageBus } from '@/util/message';
import { nomalLeftServer } from '@/api/installServer';
import { Switch } from 'element-ui';
// 暂时注释
// import baseMapComponent from '../../common/baseMap/misc/gisMethodNew';
// import GisListPanel from '@/components/feature/emergencyResource/GisListPanel.feature.vue';
// 暂时注释

@Component({
  name: 'EmergencyResource',
  components: {
    // 暂时注释
    //    GisListPanel,
    // 暂时注释
  },
})
export default class EmergencyResource extends Vue {
  @Prop() public dataArr: any;
  @Prop() public clickTextHandler: any;
  @Prop() public clickNumberHandler: any;
  @Prop() public panelType: any;
  // 文字高亮属性
  public curCheckedObj: any = {

  };
  // 数字选中属性
  public curCheckedNumObj: any = {

  };
  // 点位加载是否完成
  public popIsSure: boolean = false;
  public title: any = [];
  public fliterClass(param: any) {
    let res = '';
    this.title.forEach((item: any) => {
      if (item.codeKey === param) {
        res = item.iconName;
      }
    });
    return res;
  }
  public clickText(data: any) {
      let checkedFlag = false;
    // if ( this.curCheckedObj[this.panelType] && this.curCheckedObj[this.panelType].codeKey === data.codeKey) { // 当前已选中
      if ( this.curCheckedObj.codeKey === data.codeKey) { // 当前已选中
      this.curCheckedObj = {};
      this.curCheckedNumObj = {};
    } else {
      // this.$set(this.curCheckedObj, this.panelType, data);
      this.curCheckedObj = data;
      checkedFlag = true;
      this.curCheckedNumObj = {};
    }
      this.clickTextHandler(data, checkedFlag);
  }
  // 监听定位-关闭弹框
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  public onEventLocate() {
    this.clickText(this.curCheckedObj); // 等于再次点击左侧名称取消点和列表
  }
  // 生命变量控制搜索显隐private visibleflag = false;
  // 复写点击事件
  private clickNumber(data: any) {
    if (this.curCheckedObj.codeKey === data.codeKey && this.curCheckedNumObj.codeKey === data.codeKey) { // 取消number选中
      // 数字高亮
      this.curCheckedNumObj = {};
      // 关闭列表弹框
      this.clickNumberHandler(data, false);
    } else if (this.curCheckedObj.codeKey === data.codeKey) { // 如果左侧选择的队伍名称与现在选择的一致,则显示弹窗
      this.curCheckedNumObj = data;
      this.clickNumberHandler(data, true);
    } else {
      // 文字高亮
      this.curCheckedObj = data;
      // 数字高亮
      this.curCheckedNumObj = data;
      // 点位信息
      this.clickTextHandler(data, true);
      this.clickNumberHandler(data, true, this.curCheckedObj.codeKey);
    }
    this.messsageBus.emit('selectnumpafeone', data);  // 触发每次显示都为第一页
    this.messsageBus.emit('clearInput', '');  // 点击给列表发消息，清空input搜索框的内容，重新请求所有的数据
  }
  private closePanelFn() {
      this.curCheckedObj = {};
      this.curCheckedNumObj = {};
      this.clickText(this.curCheckedObj);
      this.clickNumberHandler(this.curCheckedObj, false, 'close');
  }
  // 暂时注释
  private created() {
    // 请求 icon 的json
    nomalLeftServer.getIcon().then((res: any) => {
      this.title = res.iconData;
    });
  }
}
</script>

<style lang="less" scoped>
@imgUrl:'../../../../assets/img/emergencyResource/';
    * {
        margin: 0;
        padding: 0;
    }

    .panel-RiskAndResourceModule {
        bottom: 0;
        right: 10px;
        background:url('@{imgUrl}/yingjizyyhbg.png') no-repeat;
        background-size: 128% 100%;
        margin-left: -35px;
        position: relative;
        width: 484px;
        height: 280px;
        top: 730px;
    }

    .modulePanel-style {
        margin-left: 40px;
        margin-left: 40px;
        width: calc(100% - 40px);
        height: 100%;
        padding-left: 0;
    }

    .panel-emergency-resource {
        width: 100%;
        height: 100%;
    }

    .emergencyResource{
        padding-top:10px;
    }
    .emergencyResource li {
        // height: 50px;
        display: flex;
        // line-height: 50px;
        // margin:5px 0;
        padding:6px 10px;
        box-sizing: border-box;
        // outline:2px solid red;
    }

    .emergencyResource li p:last-of-type {
        font-family: 'Impact';
        font-size:30px;
        color: #2cf7ff;
        letter-spacing: .1rem;
        font-weight: bold;
    }

    .yellowHover {
        cursor: pointer;
        color: #e5f4ff;
        font-size: 28px;
        font-family: 'myYahei';   
        &:hover{
            color:yellow
        }
        
    }
    

    // .yellowHover span {
    //     background-size: 100% 100%;
    //     width: 30px;
    //     height: 30px;
    //     vertical-align: middle;
    //     // margin-right: 2%;
    // }
    .icon_bg{
        
         display: inline-block;
        width: 32px;
        height: 32px;        
        background:linear-gradient(to top, transparent, rgba(72,223,255,.73));
        border:1px solid #119699;
        border-radius: 5px;
        vertical-align: middle;
    }

    .panel-emergency-resourc li p:first-of-type:hover {
        color: yellow;
        cursor: pointer;
    }

    .emergencyResource li.ResourceTroubleLi33 p:nth-of-type(1) {
        width: 70%;
        // line-height: 50px;
    }

    li.ResourceTroubleLi33 p:nth-of-type(2) {
        text-align: right;
        width: 50%;
    }

    // li.ResourceTroubleLi33 span {
    //     display: inline-block;
    //     color: #fff;
    //     font-size: 28px;
    // }
    li.ResourceTroubleLi33 .company {
        font-family: 'myYahei';
        font-size: 28px;
        color: #83b0d3;
        font-weight: normal;
        margin-right: 10px;
    }
    .ResourceTrouble-icon {
         display: inline-block;
        width: 32px;
        height: 32px;
        text-align: center;
        // line-height: 32px;
        background-position: 0 0;
        background-repeat: no-repeat;
        // margin-top:-16px;
    }

    li .ResourceTrouble-icon-jiuyuandui {
         background: url('@{imgUrl}/jiuyuanduibgqwe.png') no-repeat 0 0;
        background-size: 100% 100%;
        // width: 30px;
        // height: 30px;
        // vertical-align: middle;
        // margin-right: 2%;
    }

    /deep/.cmp-scrollbar-y .el-scrollbar__wrap {
        overflow-x: hidden;
        margin-right:-20px!important;
    }

    /*默认点位的图标*/
    .ResourceTrouble-icon-jiuyuandui {
         background-image: url('@{imgUrl}/jiuyuanduibgqwe.png');

    }
    
    .ResourceTrouble-num {        
        font-family: 'Impact';
        font-size: 30px;
        &:hover {
            background-image: url('@{imgUrl}/yingjidengicannum.png');
            background-size: 100% 100%;
            cursor: pointer;
        }
        .company {
            font-family: 'myYahei';
            font-size: 28px;
            color: #83b0d3;
            font-weight: normal;
            margin-right: 10px;
        }
    }

    .ResourceTrouble-num-isActive {        
        font-family: 'Impact';
        font-size: 30px;
        background-image: url('@{imgUrl}/yingjidengicannum.png');
        background-size: 100% 100%;
        cursor: pointer;  
    }

    .yellowHover-cur,
    .yellowHover:hover {
        .ResourceTrouble-icon-jiuyuandui{
            background-image: url('@{imgUrl}/jiuyuandui0hover.png')
        }
         .ResourceTrouble-icon-zhuanjia {
            background-image: url('@{imgUrl}/zhaunjia0hover.png');
        }        
        .ResourceTrouble-icon-chubeiku {
            background-image: url('@{imgUrl}/wuzichubeiku0hover.png');
        }

        .ResourceTrouble-icon-jidi {
            background-image: url('@{imgUrl}/zhanbaojidi0hover.png');
        }

        .ResourceTrouble-icon-school {
            background-image: url('@{imgUrl}/school0hover.png');
        }

        .ResourceTrouble-icon-binan {
            background-image: url('@{imgUrl}/binanchangsuo0hover.png');
        }

        .Trouble-icon-weihua {
            background-image: url('@{imgUrl}/weihuapinqiye0hover.png');
        }
        .Trouble-icon-meikuang {
            background-image: url('@{imgUrl}/meikuangqiye0hover.png');
        }
        .Trouble-icon-weikuang {
            background-image: url('@{imgUrl}/feimeikuangshanqiye0hover.png');
        }
        .Trouble-icon-yanhua {
            background-image: url('@{imgUrl}/yanhuabaozhu0hover.png');
        }


        .Trouble-icon-dizhi {
            background-image: url('@{imgUrl}/dizhizaihai0hover.png');
        }


        .Trouble-icon-gongmao {
            background-image: url('@{imgUrl}/gongmaoqiye0hover.png');
        }

        .Trouble-icon-zhongda {
            background-image: url('@{imgUrl}/zhongdaweixianyuan0hover.png');
        }
        .Trouble-icon-feijinshu {
            background-image: url('@{imgUrl}/feijinshuhover.png');
        }
        .Trouble-icon-luyou {
            background-image: url('@{imgUrl}/luyouhover.png');
        }
        .Trouble-icon-haiyou {
            background-image: url('@{imgUrl}/haiyouhover.png');
        }
        .Database-icon-school {
            background-image: url('@{imgUrl}/school0hover.png');
        }

        .Database-icon-hospital {
            background-image: url('@{imgUrl}/hospital0hover.png');
        }

        .Database-icon-airport {
            background-image: url('@{imgUrl}/airport0hover.png');
        }

        .Database-icon-station {
            background-image: url('@{imgUrl}/station0hover.png');
        }

        .Database-icon-resrrvoir {
            background-image: url('@{imgUrl}/shuikudaba0hover.png');
        }


        .Database-icon-nuclearinfo {
            background-image: url('@{imgUrl}/hesheshi0hover.png');
        }
        .Database-icon-portwharf {
            background-image: url('@{imgUrl}/matou0hover.png');
        }
    }

    .ResourceTrouble-icon-jiuyuandui-active {
        background-image: url('@{imgUrl}/jiuyuandui0hover.png');
    }
    .ResourceTrouble-icon-zhuanjia {
        background-image: url('@{imgUrl}/zhuanjia0.png');
    }   

    .ResourceTrouble-icon-zhuanjia-active {
        background-image: url('@{imgUrl}/zhaunjia0hover.png');
    }

    .ResourceTrouble-icon-chubeiku {
        background-image: url('@{imgUrl}/wuzichubeiku0.png');
    }


    .ResourceTrouble-icon-chubeiku-active {
        background-image: url('@{imgUrl}/wuzichubeiku0hover.png');
    }

    .ResourceTrouble-icon-jidi {
        background-image: url('@{imgUrl}/zhanbaojidi0.png');
    }
    .ResourceTrouble-icon-jidi-active {
        background-image: url('@{imgUrl}/zhanbaojidi0hover.png');
    }

    .ResourceTrouble-icon-school {
        background-image: url('@{imgUrl}/school0.png');
    }
    .ResourceTrouble-icon-school-active {
        background-image: url('@{imgUrl}/school0hover.png');
    }

    .ResourceTrouble-icon-binan {
        background-image: url('@{imgUrl}/binanchangsuobg.png');
    }
    .ResourceTrouble-icon-binan-active {
        background-image: url('@{imgUrl}/binanchangsuo0hover.png');
    }
    .Trouble-icon-weihua {
        background-image: url('@{imgUrl}/weihuaqiye0.png');
    }
    .Trouble-icon-weihua-active {
        background-image: url('@{imgUrl}/weihuapinqiye0hover.png');
    }
    .Trouble-icon-meikuang {
        background: url('@{imgUrl}/meikuangqiyebg.png');
    }
    .Trouble-icon-meikuang-active {
        background: url('@{imgUrl}/meikuangqiye0hover.png');
    }

    .Trouble-icon-weikuang {
        background: url('@{imgUrl}/feimeikuangshanbgqwe.png');
    }



    .Trouble-icon-weikuang-active {
        background: url('@{imgUrl}/feimeikuangshanqiye0hover.png');
    }

    .Trouble-icon-yanhua {
        background: url('@{imgUrl}/yanhuabaozhu0.png');
    }
    .Trouble-icon-yanhua-active {
        background: url('@{imgUrl}/yanhuabaozhu0hover.png');
    }

    .Trouble-icon-dizhi {
        background: url('@{imgUrl}/dizhizaihai0.png');
    }

    .Trouble-icon-gongmao {
        background: url('@{imgUrl}/gongmaoqiyebg.png');
    }

    .Trouble-icon-gongmao-active {
        background: url('@{imgUrl}/gongmaoqiye0hover.png');
    }

    .Trouble-icon-zhongda {
        background: url('@{imgUrl}/zhongdaweixianyuan0.png');
    }
    .Trouble-icon-feijinshu {
        background-image: url('@{imgUrl}/feijinshu.png');
    }
    .Trouble-icon-luyou {
        background: url('@{imgUrl}/luyou.png');
    }
    .Trouble-icon-haiyou {
        background: url('@{imgUrl}/haiyou.png');
    }
    .Trouble-icon-zhongda-active {
        background: url('@{imgUrl}/zhongdaweixianyuan0hover.png');
    }


    .Database-icon-school {
        background-image:url('@{imgUrl}/school0.png');
    }
    .Database-icon-hospital {
        background-image:url('@{imgUrl}/hospital0.png');
    }


    .Database-icon-airport {
        background-image:url('@{imgUrl}/airport0.png');
    }


    .Database-icon-station {
        background-image:url('@{imgUrl}/station0.png');
    }

    .Database-icon-station-active {
        background-image:url('@{imgUrl}/station0hover.png');
    }

    .Database-icon-resrrvoir {
        background-image:url('@{imgUrl}shuikudaba0.png');
    }
    .Database-icon-nuclearinfo {
        background-image:url('@{imgUrl}/hesheshi0.png');
    }

    .Database-icon-portwharf {
        background-image:url('@{imgUrl}/matou0.png');
    }
    .ischeckout{
      color: yellow;
    }
</style>
