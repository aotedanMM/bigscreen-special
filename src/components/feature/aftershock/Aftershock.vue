<!-- @click="$emit('input',!value)"  v-draggable="draggableValue"-->
<!-- 余震 -->
<template>
  <div class="yuzhen-content popupPanelCenter_bg">
    <div class="yuzhen-content-title">
      <span class="yuzhen-content-title-txt">余震</span>
      <span class="closed-container closed-container-position" @click="closePop(true)">
        <span class="panel_btnClose"></span> 
      </span>
    </div>
    <div class="yuzhen-info">
      <div :class="str? 'yuzhen-infoDetail': 'yuzhen-infoDetail-noData'">
        <div class="yuzhen-infoDetail-title">余震序列</div>
        <div class="yuzhen-infoDetail-content" v-if="str">
          <el-scrollbar style="height:100%;">
            <div  v-html="str">
               {{str}}
            </div>
          </el-scrollbar>
        </div>
        <div class="nothingData--bg1" v-else></div>
      </div>
      <div class="yuzhen-table">
        <ul class="yuzhen-thead">
          <li>
            <span>序号</span>
            <span>发震日期</span>
            <span>发震时间</span>
            <span>
              <div>震源深度（KM）</div>
            </span>
            <span>
              <div>震级（M）</div>
            </span>
            <span>震中地点</span>
          </li>
        </ul>
        <div class="yuzhen-tbody" v-if="strList.length !== 0">
          <el-scrollbar style="height:100%;">
          <ul>
            <!--点击事件先注释，功能后续开发；需求叶姗<li v-for="(item, index) in strList" :key="item.id" @click="eventLi(item)">-->
            <li v-for="(item, index) in strList" :key="item.id">
              <span>{{index*1+1}}</span>
              <span>{{item.date}}</span>
              <span>{{item.time}}</span>
              <span>{{item.eDeep}}</span>
              <span>{{item.eClass}}</span>
              <span :title="item.address"><i>{{item.address}}</i></span>
            </li>
          </ul>
          </el-scrollbar>
        </div>
        <div class="nothingData--bg" v-else></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { pushDataRequestServe } from '@/api/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'AfterShock',
  components: {},
  mixins: [MapCommon],
})
export default class AfterShock extends Vue {
    private str = '';
    private strList: any = [];
    @Watch('$store.state.eventPushStore.SEND_AFTERSHOCK_INFO')
    private eventChange(val: any) {
        if　(val > 0) {
            this.getData();
        }
    }
    private close() {
        this.$emit('afterShockShowEmit', false);

    }
    private created() {
        if (this.$store.state.eventPushStore.SEND_AFTERSHOCK_INFO > -1) {
            this.getData();
        }
    }
    private eventLi(item: any) {
        this.getComponent().openPopup(item.id);
    }
    private closePop(isClose: boolean = false) {
        this.messsageBus.emit('ToolCompared', 'aftershock', isClose);
        this.$emit('aftershockShowEmit', false);
        this.getComponent().closePopup();
    }
    private async getData() {
        const eventId = this.$store.state.eventPushStore.eventId; // 事件id
        const processId = 'SEND_AFTERSHOCK_INFO';  // 余震
        const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
        const content = JSON.parse(data.content);
        if (content.length > 0) {
            const localListdata = JSON.parse(content[0].data);
            this.str = localListdata.event.str;
            this.strList = localListdata.event.list;
            this.getComponent().load(localListdata);
        }
    }
    // 联动gis方法 开始
    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('afterShock');
        return component;
    }
    private onShowPopup(event: any) {
        const  self = this;
        const param = {
            that: self,
            popupId: 'popup',  //  监听id，必须
            moduleTypeID: 'afterShock', //  实体类资源模块id，必须
        };
        const popUpTemplate = new renderpopUpTemplate();
        popUpTemplate.getParams(param);
        popUpTemplate.onShowPopup(event);
    }
    private mounted() {
        this.getComponent().off('popup');
        this.getComponent().on('popup', this.onShowPopup, this);
    }
    private destroyed(): void {
      // this.getComponent().off('popup');
    }
}
</script>
<style lang="less" scoped>
@imgUrl: '../../../assets/img/eventInfo';
.yuzhen-content {
  position: absolute;
  z-index: 1009;
  left: 25%;
  top: 24%;
  width: 969px;
  height: 724px;
  // background: url('@{imgUrl}/infolistimg.png') no-repeat 50% 50%;
  // background-size: 100% 100%;
  padding: 1% 1.5% 1.5% 1.8%;
  z-index: 4;
  box-sizing: border-box;
  /*  cursor: move; */
  &-title {
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    color: #ffde00;
    height: 60px;
    font-size: 28px;
    font-weight: 600;
    padding-left: 15px;
    line-height: 60px;
    margin-bottom: 20px;
    &-txt {
      position: absolute;
      left: 67px;
      top: 30px;
    }
    .closed-container-position{
      position: absolute;
      right: 56px;
      top: 30px;
    }
    // &-close {
    //   cursor: pointer;
    //   width: 92px;
    //   height: 66px;
    //   background: url('@{imgUrl}/infolistclose.png') no-repeat center / 100%
    //     100%;
    //   position: absolute;
    //   right: 45px;
    //   top: 35px;
    // }
  }
  .yuzhen-info {
    width: 90%;
    height: 80%;
    overflow: hidden;
    margin: 0 auto;
    .yuzhen-infoDetail {
      width: 100%;
      height: 180px;
      color: #fff;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 1% 2%;
      background: linear-gradient(
        rgba(97, 230, 253, 0.19),
        rgba(38, 222, 253, 0.4)
      );
      border-bottom: 2px solid #04c5ed;
      margin-bottom: 2%;
    }
    .yuzhen-infoDetail-noData{
      width: 100%;
      height: 180px;
      color: #fff;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 1% 2%;
      margin-bottom: 2%;
    }
    .yuzhen-infoDetail-title {
      font-size: 30px;
      text-align: center;
      color: #27ebff;
      letter-spacing: 2px;
      margin-bottom: 1%;
    }
    .yuzhen-infoDetail-content {
      font-size: 20px;
      line-height: 35px;
      letter-spacing: 2px;
      // overflow-y: auto;
      height: 103px;
      /deep/span {
        color: #27ebff;
        border-bottom: 1px solid #27ebff;
      }
    }
    .yuzhen-table {
      width: 100%;
      height: 100%;
      ul li {
        width: calc(100% - 7px);
        height: 55px;
        line-height: 55px;
        display: flex;
        text-align: center;
        & > span {
          background-color: rgba(4, 193, 210, 0.23);
          font-size: 20px;
          color: #abf5ff;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 15%;
          line-height: 23px;
          overflow: hidden;
          div {
            width: 100%;
            line-height: 23px;
          }
        }
        & > span:nth-child(5){
          width:8%;
        }
        & > span:last-child{
          width:39%;
          display: flex;
          align-items: center;
          justify-content: center;
          i{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-style:normal;
          }
        }
        & > span:nth-child(1) {
          width: 7%;
        }
        & > span:not(:last-child) {
          margin-right: 3px;
        }
      }

      .yuzhen-thead {
        width: 100%;
        display: flex;
      }
      .yuzhen-tbody {
        width: 100%;
        height: 62%;
        // overflow-y: auto;
        ul {
          width: 100%;
          height: 86%;
          overflow: hidden;
          overflow-y: auto;
          li {
            cursor: pointer;
            span {
              color: #fff;
            }
          }
          li:not(:last-child) {
            margin-bottom: 2px;
          }
          li:nth-child(odd) span {
            background-color: rgba(1, 79, 129, 0.3);
            font-size: 18px;
          }
        }
      }
      .nothingData--bg{
        margin-top: -12%;
      }
    }
  }
}
</style>
