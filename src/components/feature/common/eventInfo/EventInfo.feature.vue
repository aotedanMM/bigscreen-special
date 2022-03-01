<template>
  <div >
  <div class="cmpSelf" v-show="modulename==='collection' ? false: true">
    <el-input class="csmMyInput" v-model.trim="inputVal" placeholder="请输入事件名称"></el-input>
    <div class="timerbuttonhandle">
      <p :class="item.select?'selecttimerbghhhover':'selecttimerbghh'"
      v-for="(item, index) in selecttimebutton" 
      :key="index" 
      @click="selectbuttonhandle(item)">
      {{item.text}}
      </p>
      <!-- <p @click="threeDay" class="selecttimerbghhhover">三天</p>
      <p @click="onrWeek" class="selecttimerbghh">一周</p>
      <p @click="oneMonth" class="selecttimerbghh">一月</p>
      <p @click="oneYear" class="selecttimerbghh">一年</p> -->
    </div>
    <el-date-picker class="csmMyInput datapicker"
      v-model="TimeoptionsValue"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :editable='false'
      :clearable='false'
      @change="datapickerChange"
    >
  </el-date-picker>
  <div class="totalbgselectbg">查询结果 <span>{{datatotal}}</span> 条 </div>
    </div>
    <div class="EventMessage-cont" ref="EventMessage_cont_ref" v-if="eventInfoData.length" >
      <!-- <div class="EventMessage-content-left"></div>-->
      <div class="EventMessage-cont-hd" @click="clickPerItemData(listOld,'eventMessage')" :class="{eventInfo_active:index==='eventMessage'}">
        <p class="f-txt-com">
          <!-- <span class="EventMessage-content-right-locationdian"></span> -->
          <!-- <span class="">发布时间：</span> -->
          <span
            :data-time="listOld.reportTime"
            class="EventMessage-cont-hd-oTime EventMessage-content-right-locationbg"
          >{{listOld.reportTime || listOld.collectionTime}}</span>
        </p>
        <!-- <el-scrollbar class="cmp-scrollbar-y" wrap-style="max-height:calc(100% - 55px)"> -->
          <p class="EventMessage-content-right-content" >
            <span class="f-txt-com" v-html="listOld.title" :title="listOld.title"></span>
          </p>
        <!-- </el-scrollbar> -->
      </div>
      <!-- @mouseout="scollAreaOut" -->
  <!-- @mouseover="scollAreaOver" -->
      <div class="EventMessage-content-right">
        <el-scrollbar class="cmp-scrollbar-y" :style='isShowcollectionList'>
        <ul class="EventMessage-contentcontent-right-cont" ref="EventMessage_content_right_box">
          <li
            v-for="(item,key) of list"
            :key="key"
            ref="EventMessage_content_list"
            :class="{eventInfo_active:item.type}"
            @click="clickPerItemData(item)"
          >
            <p class="EventMessage-content-right-p f-txt-com">
              <span class="orderNum">{{(currentPage - 1) * pageSize + key + 1}}</span>
              <!-- <span class="EventMessage-content-right-location">发布时间：</span> -->
              <span class="EventMessage-content-right-location EventMessage-cont-hd-oTime"
                  :data-time="item.reportTime"
              >{{item.reportTime || item.collectionTime}}</span>
            </p>
        <!-- <el-scrollbar class="cmp-scrollbar-y" wrap-style="height:120px;"> -->
            <p class="EventMessage-content-right-content ">
              <span  class="f-txt-com" v-html="item.title" :title="item.title"></span>
            </p>
        <!-- </el-scrollbar> -->
          </li>
        </ul>
        </el-scrollbar>
      </div>
      <el-pagination
          v-show="modulename==='collection' ? false: true"
          small
          :pager-count="5"
          class="constomMyElPage"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
    </div>
    <!-- <div class="nocontBox" v-else>
      <p class="loading"></p>
    </div> -->
    <div class="nocontBox" v-else>
      <p class='noeventInfoDatabg' :class="isloading ? 'loading' : ''"></p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import { getDateFormat } from '@/util/tools';
/**
    事件信息组件
*/
@Component({
  name: 'EventInfo',
  components: {

  },
})
export default class EventInfo extends Vue {
  @Prop() public modulename: any;
    private TimeoptionsValue: any = [new Date().getTime() - 3600 * 1000 * 24 * 3, new Date()];
    private currentPage: number = 1;
    private pageSize: number = 10;
    private inputVal: string = '';
    private total: number = 0;
    private isShowcollectionList: any; // 事件面板的高度
    private selecttimebutton: any[] = [
      {
        text: '三天',
        clasname: 'selecttimerbghhhover',
        select: true,
      },
      {
        text: '一周',
        clasname: 'selecttimerbghh',
        select: false,
      },
      {
        text: '一月',
        clasname: 'selecttimerbghh',
        select: false,
      },
      {
        text: '一年',
        clasname: 'selecttimerbghh',
        select: false,
      },
    ];
  /**
   *  用于页面中展示事件信息的数据
   */
  @Prop({ default: () => [] }) private eventInfoData!: IEventinfo[];
  @Prop({ default: 0 }) private datatotal: any;
  /**
   *  点击每一项事件信息的回调函数
   */
  @Prop() private clickPerItemData: any;
  @Prop() private index: any;

  // 将prop传进来的数据进行save
  private list: IEventinfo[] = [];

  @Prop() private SwitchingData: any;
  private isloading: boolean = true;

  // 默认一下初始化数据
  private listOld: IEventinfo = {
    id: '',
    title: '',
    eventType: '',
    reportTime: '',
    location: '',
    longitude: '',
    latitude: '',
    collectionTime: '',
  };
  // 时间控制器
  private timerLoop: any = null;
  private timerSet: any = null;

  // private get modulename(){

  // }

  // 保证本地的list是最新的传进来的数据
  @Watch('eventInfoData')
  public watchInfoData(val: IEventinfo[], oldVal: IEventinfo[]) {
    this.list = val.concat([]);

    this.total = this.datatotal;
    if (val.length) {
      this.listOld = val[0];
    }
    this.isloading = false;
  }

  // 时间段搜索
  @Watch('TimeoptionsValue')
  private getTimeInfoData(val: any) {
    if (this.SwitchingData) {
      const obj = {
        timer: val,
        inputvalue: this.inputVal,
        current: 1,
        pageSize: this.pageSize,
      };
      this.SwitchingData(obj);
    }
  }

// 关键字搜索
  @Watch('inputVal')
  private searchinputVal(val: any) {
    if (this.SwitchingData) {
      const obj = {
        timer: this.TimeoptionsValue,
        inputvalue: val,
        current: 1,
        pageSize: this.pageSize,
      };
      this.SwitchingData(obj);

    }
  }

// datapicker 改变时间执行
private datapickerChange(val: any) {
  this.uncheckhandle();
}

// 所有的时间button取消选中
private uncheckhandle() {
    for (const ele of this.selecttimebutton) {
      ele.select = false;
    }
}
// 选择时间段
private selectbuttonhandle(item: any) {
  this.uncheckhandle();
  this.currentPage = 1;
  switch (item.text) {
      case'三天':
          this.TimeoptionsValue = [new Date().getTime() - 3600 * 1000 * 24 * 3, new Date()];
          item.select = true;
          break;
      case'一周':
          this.TimeoptionsValue = [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()];
          item.select = true;
          break;
      case'一月':
          this.TimeoptionsValue = [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date()];
          item.select = true;
          break;
      case'一年':
          this.TimeoptionsValue = [new Date().getTime() - 3600 * 1000 * 24 * 365, new Date()];
          item.select = true;
          break;
    }
  }


// 分页点击
private handleCurrentChange(val: any) {
  if (this.SwitchingData) {
      const obj = {
        timer: this.TimeoptionsValue,
        inputvalue: this.inputVal,
        current: val,
        pageSize: this.pageSize,
      };
      this.SwitchingData(obj);
    }
}

  // 滚动操作
  private scroll() {
    const dom = this.$refs.EventMessage_cont_ref as HTMLDivElement;
    if (dom && dom.style.display === 'none') {
      return;
    } else {
      const tempUl = this.$refs
        .EventMessage_content_right_box as HTMLDivElement;
      if (tempUl) {
        const parent = tempUl.parentNode as HTMLDivElement;
        if (tempUl.offsetHeight > parent.clientHeight) {
          const liHeight = this.$refs
            .EventMessage_content_list as HTMLDivElement;

          const { marginTop, marginBottom } = getComputedStyle(tempUl, null);
          let top = 0;

          if (marginTop) {
            top = +marginTop.split('px')[0];
          }

          if (tempUl.firstElementChild) {
            const firstHeight = (tempUl.firstElementChild as any).offsetHeight;
            tempUl.style.marginTop = top - 1 + 'px';

            if (Math.abs(top - 1) === firstHeight + 15) {
              tempUl.style.marginTop = '0px';
              this.list.push(this.list[0]);
              this.list.shift();
            }
          } else {
            this.scollAreaOver();
          }
        }
        // tempUl.style.top = `0`;
      }
    }
  }

  // 清除时间控制器
  private scollAreaOver() {
    // clearInterval(this.timerSet);
    clearInterval(this.timerLoop);
  }

  // 开启时间控制器
  private scollAreaOut() {
    this.timerLoop = setInterval(this.scroll, 16);
  }

  // 初始化复制
  private created() {
    this.changelargeRightPanel(this.$store.state.panelMutualExclusionMudule.panelMutualExclusion);
    this.list = this.eventInfoData.concat([]);
    if (this.eventInfoData.length) {
      this.listOld = this.eventInfoData[0];
    }
  }

  // 监听收藏夹面板的显隐 改变面板的的高度
  @Watch('$store.state.panelMutualExclusionMudule.panelMutualExclusion', {deep: true})
  private changelargeRightPanel(val: any) {
    if (val.EventCollection.showFlag) {
      this.isShowcollectionList = 'height:750px'; // 事件面板的高度
    } else {
      this.isShowcollectionList = 'height:485px'; // 事件面板的高度
    }

  }


  // 在dom元素都加载成功的时候执行
  private mounted() {
    // this.timerLoop = setInterval(this.scroll, 16);
  }


  // 组件销毁的时候执行，清除时间控制器
  private destroyed() {
    // clearInterval(this.timerSet);
    clearInterval(this.timerLoop);
  }
}
</script>
<style lang="less">

</style>
<style scoped lang="less">
.datapicker.el-date-editor.el-input__inner {
  width: 100%;
}
.nocontBox{
    position: relative;
    height: 632px;
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    .noeventInfoDatabg{
      width: 165px;
      height: 163px;
      background: url(../../../../assets/img/default/panel/noData.png) no-repeat;
      background-size: 100% 100%;
      // margin: 250px auto; 注释这句是为了兼容ie11.
    }
    .noeventInfoDatabg.loading{
      width: 365px;
      background: url(../../../../assets/img/halfScreen/halflist/loading.gif) no-repeat 33px 255px;
      margin: 250px auto;
      height:100%;
  }
}
.totalbgselectbg{
  width: 359px;
  height: 44px;
  background: url(../../../../assets/img/default/panel/totalbgselectbg.png) no-repeat;
  background-size: 100% 100%;
  color: #fff;
  font-size: 26px;
  padding-left: 25px;
  margin-top: 20px;
  line-height: 44px;
  span{
    font-family: 'Impact';
    color: #ffe615;
    font-size: 28px;
  }
}
.timerbuttonhandle{
  width: 100%;
  display: flex;
  height: 40px;
  margin: 15px 0;
  p{
    width: 24%;
    height: 100%;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 26px;
    cursor: pointer;
  }
  p:hover{
    background: url(../../../../assets/img/default/panel/selecttimerbghhhover.png) no-repeat;
    background-size: 100% 100%;
  }
  .selecttimerbghh{
    width: 84px;
    height: 37px;
    background: url(../../../../assets/img/default/panel/selecttimerbghh.png) no-repeat;
    background-size: 100% 100%;
    margin-left: 5px;
  }
  .selecttimerbghhhover{
    width: 84px;
    height: 37px;
    background: url(../../../../assets/img/default/panel/selecttimerbghhhover.png) no-repeat;
    background-size: 100% 100%;
    margin-left: 5px;
  }
}
.cmpSelf{
    margin-top: 20px;
    margin-right:22px;
}
@firstItemHeight:90px;
*{
  margin:0;
  padding:0;
}
.eventInfo_active{
  background:rgba(7, 25, 65, 0.8)!important;
}
.EventMessage-cont {
  position: relative;
  padding-top: @firstItemHeight;
  // background: url('../../../../assets/img/eventInfo/messageLine.png') repeat-y
  //   12px 0px;
  /*background-color:#0b1b48;*/
  height: calc(100% - 220px);
  margin-top:20px;
  margin-right:12px;
}
.EventMessage-content {
  width: 100%;
  height: 100%;
  display: flex;
  padding-bottom: 5px;
}
.EventMessage-content-left {
  position: absolute;
  width: 2px;
  /*height: 85.5%;
  background: url(../../../../assets/img/eventInfo/messageLine.png) no-repeat;*/
  background-size: 100% 100%;
  margin-left: 2.3%;
  margin-top: 5%;
}
.EventMessage-content-right {
  width: 100%;
  // width:370px;
  /*height: 432px;
  margin-top: 20px;*/
  height: 100%;
  overflow: hidden;
  // overflow-y: auto;
  position: relative;
}
.EventMessage-content-right-cont {
  position: relative;
  top: 0px;
  margin: 0;
  padding: 0;
  .checkout{
    background: red;
  }
}
.EventMessage-cont-hd {
  background-image:linear-gradient(to top ,rgba(72,223,255,.23) 10%, rgba(0,156,255,.18)) ;
  border:1px solid #088d91;
  cursor: pointer;
  margin-top: -@firstItemHeight;
  padding-right: 10px;
  border-radius: 5px;
   height:@firstItemHeight;
  // padding-top:5px;
  box-sizing: border-box;
  margin-left:10px;
  margin-right:10px;
 

  // outline:1px solid red;
  & > p {
    margin: 0;
    // padding-left: 10px;
    white-space: nowrap;
    padding:5px;
    // outline:1px solid red ;

  }
  .EventMessage-cont-hd-oTime {
    color: yellow;
  }
  .EventMessage-content-right-locationbg {
    color: yellow;
  }
  .EventMessage-content-right-content {
    color: yellow;
    overflow : hidden;
    text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    // font-size:26px;
    width:100%;
    // max-height:50px;
    // outline:1px solid red;
  }
}


.EventMessage-content-right li {
  cursor: pointer;
  padding:10px 0 10px 15px;;
  

  .EventMessage-content-right-p {
    padding-right: 10px;
    white-space: nowrap;
    // padding-top:10px;
  }
  .EventMessage-content-right-content {
    // padding-right: 10px;
    // text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin:0;
      color: #e5f4ff;
    // font-size: 20px;
    line-height: 1.1;
    // padding-left: 30px;
    // outline:1px solid red;
    padding:10px 10px 0px 0px;
  }
}

.EventMessage-content-right-dian {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url('../../../../assets/img/eventInfo/locationdianbg.png');
  background-size: 100% 100%;
  margin-left:-16px;
  // margin-right:15px;
    position: relative;
    z-index: 3;
    pointer-events: none;
}
.orderNum {
    background: rgba(71, 215, 162, 0.2);
    border: 1px #47d7a2 solid;
    border-radius: 5px;
    color: #fff;
    font-size: 24px;
    padding: 0 5px;
    display: inline-block;
    font-style: normal;
    margin-right: 10px;
}
.EventMessage-content-right-location {
  display: inline-block;
  /* width: 157px;*/
  // height: 42px;
  background: url('../../../../assets/img/eventInfo/locationbg.png');
  background-size: 100% 100%;
  color: #e5f4ff;
  // font-size: 22px;
  line-height:1.1;
  padding:5px;
}
.EventMessage-content-right-locationbg {
  display: inline-block;
  background: url('../../../../assets/img/eventInfo/jubg.png');
  background-size: 100% 100%;
  color: #e5f4ff;
  // font-size: 22px;
  line-height:1;
  padding: 5px;
  // width: 157px;
  // height: 42px;
  // margin-left:35px;
  // margin-top:10px;
}
.EventMessage-cont-hd-oTime {
  color: #52728c;
  white-space: nowrap;
  // font-size: 20px;
}

.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
  // margin-right: -18px!important; 
}
</style>

