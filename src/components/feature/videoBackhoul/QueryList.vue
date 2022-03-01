<template>
  <div style="height: 100%;" class="queryList">
    <div class="queryList-select">
      <div>
        <el-select v-model="valueText" filterable @change="changeSelectEvents">
          <el-option
            v-for="(item,key) in optionsData"
            :key="key"
            :label="item.lable"
            :value="item.value"
          >
            <span style="float: left">{{ item.lable }}</span>
            <!-- <span style="float: right">{{ item.value }}</span> -->
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="queryList-wrap">
      <!-- <ul class="queryList-ul scroll-style">
        <li v-for="(list, index) in listData" :key="index">
          <span class="text">{{ list.content }}</span>
          <span class="time">{{ list.time }}</span>
        </li>
      </ul>-->
      <div style="height:100%">
        <el-scrollbar style="height:100%">
        <ul v-for="(list, index) in listData" :key="index">
          <li class="QueryList-li" @click.stop="clickResourceItem(list)">
            <div
              :class="(resourceDataListArr[0] === list.codeKey) ? 'isCheckOut QueryList-list' : 'QueryList-list'"
            >
              <div class="QueryList-list-felx-left">{{ list.content }}</div>
              <div class="QueryList-list-felx-right">
                <div class="QueryList-list-time">{{ list.time }}</div>
                <div class="QueryList-list-pie">人</div>
              </div>
            </div>
          </li>
        </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import { rescueTeamServer, rescueSuppliesServer } from '@/api/installServer.ts';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
@Component({
  name: 'QueryList',
  mixins: [MapCommon],
})
export default class QueryList extends Vue {
  @Prop() public optionsData!: any;
  @Prop(Array) public listData!: any;
  @Prop() private districtCode: any;
  private valueText: string = '北京市';
  private resourceDataListArr: any = [];
  private popUpTemplate = new renderpopUpTemplate();
  // @Watch('listData')
  private created() {
    // alert(JSON.stringify(this.listData), 'adadada');
  }
  private mounted() {
    (this as any).resolveMap.call(this, 'map').then(() => {
      this.getComponent().off('popup', this.onShowPopup, this);
      this.getComponent().on('popup', this.onShowPopup, this);
      // this.getComponent().showEvents(this.eventInfoData);
    });
    if ( this.listData === []) {
      this.listData = [
        {content: '暂无数据'},
      ];
    }
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.rescueHelpFactory.getComponent(
      'rescueTeamInfo',
    );
    return component;
  }
  private changeSelectEvents(val: any) {
    this.$emit('changeSelectEvent', val);
  }
  // 救援列表的点击
  private clickResourceItem(item: any) {
    // 救援队列表
    const opts1 = { districtCode: this.districtCode  ? this.districtCode : '110000', resourceKey: item.codeKey };
    if (item.codeKey === this.resourceDataListArr[0]) {
      this.resourceDataListArr = [];
    } else {
      this.resourceDataListArr = [];
      this.resourceDataListArr.push(item.codeKey);
    }
    // rescueTeamServer.getRescueTeamList(opts1).then((data: any) => {
    //   // debugger;
    //   console.log(data);
    // });
    if (this.resourceDataListArr.length > 0) { // 选中
      this.getComponent().clearAll();
      this.getComponent().addResource(opts1);
    } else { // 反选
      this.getComponent().clearAll();
    }
  }
  private onShowPopup(event: any) {
    // tslint:disable-next-line:no-debugger
    // debugger;
    // console.log(event);
     // add popUp start ，弹出层引用
    if (!event.type && event.featureType) {
       event.type = event.featureType;
       const eventType = event.featureType;
     }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'rescueTeamInfo', // 实体类资源模块id，必须
      styleObj: {// 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
        },
      // getComponenContext: this.getComponent(),
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
      // add popUp end
  }
  private beforeDestroy() {
    this.getComponent().off('popup', this.onShowPopup, this);
    this.getComponent().clearAll();
    this.getComponent().unload();
  }
}
</script>
<style lang="less" scoped>
@url: '../../../../assets/img/layout/';
.queryList-select {
  padding: 5px 0px;
  background: url('../../../assets/img/layout/jiuyuanlilianginputbg.png')
    no-repeat;
  background-size: 100% 100%;
  margin-bottom: 10px;
  >div{
    width: 92%;
    padding-left: 3%;
  }
}
.el-input {
  margin-top: 0;
}
.queryList-wrap {
  height: calc(100% - 80px);
  overflow-y: auto;
}
.queryList-ul {
  padding: 10px 0px;
  pointer-events: auto;
  & > li {
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 24px;
  }
  .text {
    display: block;
  }
  .time {
    display: block;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 5px 0;
    border-radius: 5px;
    color: #999;
  }
}

/deep/ .el-input__inner {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 24px;
  line-height: 45px;
}
/deep/ .popper__arrow {
  /deep/ .popper__arrow::after {
    border-bottom-color: #40a0ff9d;
    display: none;
  }
}
/deep/ .el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  // width: 96%;
}
/deep/ .el-select {
  width: 100% !important;
  margin: 0 auto;
  padding-top: 3px;
}
</style>
<style lang="less" scoped>
.queryList {
  padding: 8px 16px 0px 10px;
  .el-select {
    height: 48px;
    position: relative;

    border: none;
    color: #dafbff;
    line-height: 48px;
    font-size: 24px;
    outline: none;
    // margin-left:5px;
  }
}
.QueryList-list {
  display: flex;
  justify-content: space-between;
}
.QueryList-list-felx-left {
  text-indent: 1em;
  color: #fff;
  font-size: 24px;
}
.QueryList-list-felx-right {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}
.QueryList-list-time {
  font-size: 30px;
  font-weight: bolder;
  margin-right: 10px;
  color: yellow;
  font-family: Impact;
  letter-spacing: 2px;
}
.QueryList-list-pie {
  color: #d2e1ec;
  font-size: 24px;
  // margin-right:30px;
}
.isCheckOut {
  background-image: url(../../../assets/img/gisModule/yujing_active.png);
  background-size: 100% 100%;
}
.QueryList-li {
  color: #fff;
  font-size: 24px;
  width: 100%;
  height: 56px;
  line-height: 56px;
  // padding: 0 5% 0;
  // margin-left: 1.5%;
  cursor: pointer;
  margin-bottom: 1%;
}
.QueryList-li:nth-child(2n-1) {
  width: 100%;
  height: 56px;
  background: url(../../../assets/img/layout/jiuyuanlilianglibg.png) no-repeat;
  background-size: 100% 100%;
  line-height: 56px;
  // margin-left: 1.5%;
  // padding: 0 5% 0;
}
//  .el-scrollbar {
//   background: rgba(3, 33, 69, 0.9);
//   li {
//     color: #fff;
//   }
//   li:hover {
//     color: #fff;
//   }
// }
</style>
<style lang="less">
  .queryList-wrap .el-scrollbar__wrap {
    margin-right: -20px!important;
  }
</style>