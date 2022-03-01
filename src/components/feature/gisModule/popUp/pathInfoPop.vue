<template>
<!-- :style = "{marginTop: -popHeight + 'px'}" -->
  <div class='eventInfoPop PathInfoPop' >
    <div class='eventInfoPop_title'>
      <div class='eventInfoPop_title_txt' :title='name'><span class="eventInfoPop_title_span"> {{name}} </span></div>
      <!--<div class='eventInfoPop_title_close' @click='close()'></div>-->
    </div>
    <div class='eventInfoPop_content'>
      <el-scrollbar style='height:100%'>
        <ul class='PathInfo'>
          <li :title=" '总里程约' + dataObj['length']/1000 + 'km'">总里程约<span class='number'>{{(dataObj['length']/1000).toFixed(2)}}</span>km</li>
          <li :title="'预计' + (dataObj.durationHourMinutes && dataObj.durationHourMinutes.hours ? dataObj.durationHourMinutes.hours + '小时' : '') + (dataObj.durationHourMinutes && dataObj.durationHourMinutes.minutes ? dataObj.durationHourMinutes.minutes : '') + '分钟后到达'">预计<span v-if="dataObj.durationHourMinutes && dataObj.durationHourMinutes.hours > 0"><span class='number'>{{dataObj.durationHourMinutes && dataObj.durationHourMinutes.hours ? dataObj.durationHourMinutes.hours : ''}}</span>小时</span><span class='number'>{{dataObj.durationHourMinutes && dataObj.durationHourMinutes.minutes ? dataObj.durationHourMinutes.minutes : ''}}</span>分钟后到达</li>
          <!--<li class='btn-li'><div id='querypath-more-button' class='btn-more' @click='updateShowPathPanel'>更多</div></li>-->
        </ul>
        </el-scrollbar>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
@Component({
  name: 'PathInfoPop',
})

export default class PathInfoPop extends Vue {
  public name: any = '摩托化推进';
  public styles: any = {};
  public popUpType: any;
  public dataObj: any = {};
  public list: [] = [];
  public dataAttributes: any;
  public dataChild: any;
  public dataTag: any;
  public popHeight: any = 0;
  private getData() {
    const self: any = this;
    // this.list = [];
    // console.log(this.list);
  }

  // 点击更多展示路径规划面板
  /*private updateShowPathPanel() {
      // this.$store.commit('updateShowPathPanel', true);
      // this.messsageBus.emit('Open_Router', {
      //       startPoint: [116.35, 39.83],
      //       endPoint: [117, 36.70],
      //       type: 0, // 判断打开哪个路径弹窗
      //     });
      // tslint:disable-next-line:no-debugger
      // debugger;
      this.messsageBus.emit('Show_PathAnalysis', true);
      // this.close();
  }*/

  private calcHeight() {
    // this.popHeight = $('.eventInfoPop.PathInfoPop').innerHeight();
    // this.popHeight += 40;
  }

  private mounted() {
    const that: any = this;
    that.popUpType = that.type;
    console.log(that.data);
    // tslint:disable-next-line:no-debugger
    if (that.data) {
       that.dataObj = that.data;
    }
    // this.updateShowPathPanel()
    this.calcHeight();
  }

}
</script>
<style lang='less' scoped>
@url: '../../../../assets/img/eventInfo';
.PathInfoPop{
  background:url('../../../../assets/img/gisModule/pathAnalysis/path_info_bg.png') no-repeat 0 0;
  // outline:1px solid red;
background-size:100% 100%;
.number{
  color:#ffec48;
  padding:0 10px;
}
}
.eventInfoPop {
  cursor: default !important;
  width: 290px;

  // max-width: 480px;
  // filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  // background: rgba(7, 25, 65, 0.8);
  border-radius: 1px;
  // box-shadow: 0 0 15px #071941;
  color: #fff;
  position: absolute;
  bottom: 0;
  padding:10px;
  // outline:1px solid red;
  // margin-bottom: 50px;
  // margin-left: -205px;
  left: 0;
  // padding-bottom: 10px;
  z-index: 1;
  &_title {
    // background: url('@{url}/title.png') no-repeat center / 100% 100%;
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    font-size: 28px;
    color: #fff;
    padding:10px;
    background:url('../../../../assets/img/gisModule/pathAnalysis/path_info_title_bg.png') no-repeat center bottom;
    &::before {
      content: '';
      width: 4px;
      height: 14px;
      background:linear-gradient(to bottom,#29ffcf,#7dc3fe);
      // outline:1px solid red;
      // background: url('@{url}/dotdefault.png') no-repeat center / 100% 100%;
      flex-shrink: 0;
      margin:0 10px;
    }
    &_span{
      line-height: 35px;
    padding-left: 10px;
    font-weight: bold;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.5);
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    // font-style: italic;
    }
    &_close {
      background: url('@{url}/maptooltipclose.png') no-repeat center / 100% 100%;
      width: 15px;
      height: 14px;
      cursor: pointer;
      flex-shrink: 0;
      position: absolute;
      right: 20px;
    }
    &_txt {
      color: #fff;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 24px;
      white-space: nowrap;
      // width: 300px;
      font-weight: normal;
      height: 55px;
      line-height: 55px;
    }
  }
  &_content {
    // padding: 0 15px 15px 15px;
    // margin-top:20px;
    // outline:1px solid red;
    padding: 10px 0  10px 20px;
    ul {
      position: relative;
      // max-height: 350px;
      li {
        font-size: 28px;
        width: 92%;
        margin-top: 10px;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .btn-more {
          position: absolute;
          bottom: 0;
          right: 30px;
          height: 40px;
          padding-right: 5px;
          padding-left: 5px;
          background: url('@{url}/more-btn.png') no-repeat center center;
          background-size: 100% 100%;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
          line-height: 40px;
        }
      }
    }
  }
  &_operation {
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      background: #3e97ef;
      color: #fff;
      padding: 6px 15px;
      border-radius: 5px;
      font-size: 20px;
      // cursor: pointer;
    }
  }

}
</style>
<style lang='less'>
  .el-scrollbar__wrap {
    margin-bottom: 0!important;
  }
</style>
