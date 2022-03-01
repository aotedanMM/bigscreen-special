<template>
  <div class="layer-panel" id="videoMonitorPop">
    <!-- 图层 -->
    <div>
      <div class="titleTopTwo">
        <span>在线单兵</span>
        <div class="btn">
          <i
            v-if="expanded"
            class="narrow-on"
            @click="expanded = !expanded"
          ></i>
          <i v-else class="narrow" @click="expanded = !expanded"></i>
          <i class="close" @click="close"></i>
        </div>
      </div>
      <div class="content" v-if="expanded">
        <div class="videoListBox">
          <div class="videoListBox_content">
            <div class="searchBox">
              <input
                v-model="input"
                placeholder="请输入名称查询"
                @keyup.enter="search"
                maxlength="16"
              />
              <i class="searchBtn" @click="search"></i>
            </div>
            <div class="elCheckbox" v-show="videoList.length">
              <!-- <el-scrollbar style="height: 100%;"> -->
                <div
                  v-for="(item, index) in videoList"
                  :key="index"
                  :class="item.isOnline * 1 === 0 ? 'gray' : ''"
                >
                  <el-checkbox
                    v-model="item.checked"
                    @change="handleCheckedCitiesChange(item)"
                    :title="item.name"
                    >{{ item.name }}</el-checkbox
                  >
                </div>
              <!-- </el-scrollbar> -->
            </div>
            <div class="pagingBox" v-show="videoList.length">
              <el-pagination
                background
                @current-change="handlePageChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                :pager-count="5"
                layout="prev, pager, next, total"
                :total="total"
              >
              </el-pagination>
            </div>
            <div v-show="!videoList.length" class="zwsj"></div>
          </div>
        </div>
      </div>
      <div class="bottom" v-if="expanded"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { videoSituationServer } from '@/api/feature/monitorwarning/installServer';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import publishObjectPath from '@/util/configRegistry';
/**
 * 图层
 */
@Component({
  name: 'OnlinePawn',
  components: {},
})
export default class OnlinePawn extends Vue {
  @Prop() private positionAddress: any;
  // 点击地图时存储的数据
  private mapId: any = [];
  // 视频列表显示控制
  private showVideoBox: boolean = true;
  // 缩小按钮
  private expanded: boolean = true;
  // tab切换选中
  private activeIndex: any = -1;
  private input: any = '';
  // 分页总数量
  private total: any = 0;
  // 显示条数
  private pageSize: any = 10;
  // 当前页码
  private currentPage: any = 1;
  // 选中的视频数据
  private checkList: any = [];
  // 所有数据
  private searchList: any = [];
  // 分页查询后的数据
  private skipList: any = [];
  // 视频列表
  private videoList: any = [];
  private showNowcurrentPage: boolean = false;
  // 城市选项
  private options: any = [];
  // 当前选中的城市全部信息
  private cityData: any = '';
  // 城市对应的value
  private value: any = '';
  private rootDistrictCode: any = publishObjectPath.value.district.root;
  private timer: any = null;
  private created() {
   this.getVideoList();
   // 定时刷新数据
   this.timer = setInterval(() => {
     this.showNowcurrentPage = true;
     this.getVideoList();
     }, 10000);
  }
  private mounted() {
    // const eMapPanelDrag: any = new Drag('#videoMonitorPop', '.titleTopTwo', {
    //   container: '.layoutMain',
    // });
    // eMapPanelDrag.toDrag();
    this.getComponent().load();
    this.getComponent().on('VideoLayer_popup', this.showVideoPlayer, this);
    const that = this;
    // 监听地图弹框视频组件点击删除同步信息
    this.messsageBus.on('delectList', (data: any) => {
      // 删去数据
      that.checkList.forEach((key: any, index: any) => {
        if (key.id === data.id) {
          that.checkList.splice(index, 1);
          // Array
          this.mapId.splice(this.mapId.indexOf(data.id), 1);
        }
      });
      // 改变列表对应选中状态
      that.videoList.forEach((key: any, index: any) => {
        if (key.id === data.id) {
          that.videoList[index].checked = false;
        }
      });
    });
    // 弹窗关闭清空数据
    this.messsageBus.on('closeVideoMapPop', (data: any) => {
      that.checkList = [];
      this.mapId = [];
      that.videoList.forEach((key: any, index: any) => {
        key.checked = false;
      });
      this.getComponent().clearHighlight();
    });
  }
  private beforeDestroy() {
    this.getComponent().off('VideoLayer_popup', this.showVideoPlayer, this);
    this.getComponent().removeResource();
    this.messsageBus.emit('closeVideoMapPop');
    clearInterval(this.timer);
  }
  // 地图点击事件
  private showVideoPlayer(event: any) {
    if (!this.mapId.includes(event.data.id)) {
      this.mapId.push(event.data.id);
      this.videoList.forEach((item: any, index: any) => {
        if (event.data.id === item.id) {
          item.checked = true;
        }
      });
      this.searchVideoUrl(event.data);
    } else {
      this.messsageBus.emit('minimizeVideoMapPopShow', true); // 弹出视频播放最小化按钮
      this.getComponent().clearHighlight();
    }
  }
  /**
   * 右侧面板打开时面板最小化
   */
  @Watch(
    '$store.state.panelMutualExclusionMudule.panelMutualExclusion.largeRightPanel.showFlag',
  )
  private minimize(val: any) {
    if (val === true) {
      this.messsageBus.emit('closeVideoMapPop');
    }
  }
  // 关闭
  private close() {
    this.messsageBus.emit('closePawn', true);
    this.messsageBus.emit('closeVideoMonitorPop', false);
  }
  // 根据id查视频
  private searchVideoUrl(item: any) {
    if (this.checkList.length > 3) {
      this.$message({
        message: '最多只能播放四路视频，请关闭一路视频后再次点击播放',
        type: 'warning',
        duration: 1000,
      });
      this.mapId.splice(this.mapId.indexOf(item.id), 1);
      item.checked = false;
      // this.getComponent().removeHighlight();
      return;
    }
    this.checkList.push(item);
    if (item.x !== null && item.y !== null) {
      this.getComponent().locatResource1('id', item.id, this.checkList);
    }
    this.messsageBus.emit('showVideoMapPop', this.checkList);
    this.messsageBus.emit('minimizeVideoMapPopShow', true); // 最小化弹窗按钮隐藏
  }
    // 分页事件
  private handlePageChange(val: any) {
    this.currentPage = val;
    this.videoList = [];
    if (this.input === '') {
      this.changeListChecked(this.searchList);
    } else {
      this.changeListChecked(this.skipList);
    }
  }
  private changeListChecked(data: any) {
                // 添加属性
      data.forEach((item: any) => {
        item.checked = false;
      });
      this.videoList = data.slice(this.currentPage * this.pageSize - this.pageSize, this.currentPage * this.pageSize);
      // console.log(this.videoList);
          // 同步选中信息 是列表栏选中
      if (this.checkList.length > 0) {
        const len = this.checkList.length;
        const lenTwo = this.videoList.length;
        for (let i = 0; i < len; i++) {
          const checkedId = this.checkList[i].id;
          for (let j = 0; j < lenTwo; j++) {
            const checkedIdTwo = this.videoList[j].id;
            if (checkedId === checkedIdTwo) {
              this.videoList[j].checked = true;
            }
          }
        }
      }
  }
    // 输入框查询事件
  private search() {
    const list: any = [];
    this.total = 0;
    if (this.input === '') {
      // this.currentPage = 1;
      this.getVideoList();
    } else {
      this.searchList.forEach((item: any) => {
        if (item.name.includes(this.input)) {
          list.push(item);
        }
      });
      this.skipList = list;
      this.videoList = list;
      this.total = list.length ? list.length : 0;
    }
  }
  // 查询当前页视频监控
  private async getVideoList() {
    //  获取默认单兵数据
    const self = this;
    const res: any = await videoSituationServer.getOnlinePawnList();
    if (!res || !res.data) {
        return;
      }
    // console.log(res.data, 'res');
          // 添加属性
    const mapList: any = [];
    res.data.forEach((item: any) => {
      item.checked = false;
      if (item.isOnline * 1 === 1 && item.x !== null && item.y !== null) {
        mapList.push(item);
      }
    });
    this.searchList = res.data;
    if (!this.input) {
      this.total = res.data ? res.data.length * 1 : 0;
    } else {
       this.total = 0;
    }
    if (this.showNowcurrentPage && this.input) {
     this.search();
     } else {
      this.handlePageChange(this.currentPage);
    }
    this.getComponent().showPointOnMapDB(mapList);
  }
  // 视频列表事件
  private handleCheckedCitiesChange(item: any) {
    // console.log(item, 1111);
    if (item.checked) {
      this.mapId.push(item.id);
      this.searchVideoUrl(item);
    } else {
      const len = this.checkList.length;
      for (let i = 0; i < len; i++) {
        if (this.checkList[i].id === item.id) {
          this.mapId.splice(this.mapId.indexOf(item.id), 1);
          this.checkList.splice(i, 1);
        }
      }
      this.messsageBus.emit('showVideoMapPop', this.checkList);
      this.getComponent().removeHighlightById(item.id);
    }
  }
 //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent('videoLayer');
    return component;
  }
  // 最小化VideoMapPop图层
  private minimizeVideoMapPop() {
    this.$emit('minimizeVideoMapPop', true);
  }
}
</script>

<style lang="less">
// @imgUrl: "../../../../assets/img/jyImgCollect/";
@icons: '../../../../assets/img/gisModule/gisLayerPanel/';
.gray {
  .el-checkbox__label {
    color: red !important;
  }
}
.elCheckbox {
  .el-checkbox__inner {
    margin-left: 20px;
  }
  .el-checkbox {
    // margin-right: 0 !important;
    margin-top: 23px;
    display: flex;
    align-items: center;
  }
  .el-checkbox__label {
    padding-left: 20px;
    font-size: 26px;
    line-height: 25px;
    color: #fff;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 334px;
  }
  .el-checkbox__inner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 0px !important;
    background: url('@{icons}checked.png') no-repeat center center;
    background-size: 100% 100%;
    &::after {
      border: 0 !important;
    }
  }
  .is-checked {
    .el-checkbox__inner {
      background: url('@{icons}checked_active.png') no-repeat center center !important;
      background-size: 100% 100%;
    }
    .el-checkbox__label {
      color: #fffabe;
    }
  }
}
// 分页样式
.pagingBox {
  width: 100%;
  margin-top: 10px;
  text-align: center;
  .el-pagination.is-background .el-pager li.more {
    background-color: transparent;
    color: #ddfdfc;
    margin: 0px;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li.number {
    background-color: transparent;
    background: url('@{icons}page-bg.png') no-repeat center center / 100% 100%;
    width: 41px;
    height: 36px;
    font-size: 12px;
    letter-spacing: 1px;
    line-height: 36px;
    color: #ddfdfc;
    margin: 0px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: transparent;
    color: #fff;
    background: url('@{icons}fy_btnactive.png') no-repeat center center / 80%
      94%;
  }
  .el-pagination__total {
    line-height: 36px !important;
    color: #fff !important;
  }
}
</style>
<style lang="less" scoped>
@url: '../../../../assets/img/gisModule/PopulationFeverBox';
@btn: '../../../../assets/img/gisPlot';
@icon: '../../../../assets/img/gisModule/gisLayerPanel';
.layer-panel {
  width: 480px;
  // position: absolute;
  // top: 100px;
  // right: 20px;
  // z-index: 20;
  .zwsj{
  width: 165px;
  height: 163px;
  margin: auto;
  margin-top: 179px;
  background: url('../../../../assets/img/default/panel/noData.png') no-repeat center center;
  background-size: 100% 100%;
  }
  .titleTopTwo {
    position: relative;
    padding: 10px 40px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-weight: 600;
    height: 70px;
    background: url('@{url}/topbg-.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    span {
      display: block;
      width: 340px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;
    }
    .btn {
      position: absolute;
      display: flex;
      top: 5px;
      right: 0;
      .narrow {
        position: absolute;
        right: 68px;
        width: 68px;
        height: 48px;
        cursor: pointer;
        background: url('@{btn}/eventAndTopics_down_normal.png') no-repeat
          center / 100% 100%;
        &:hover {
          top: 1px;
          background: url('@{btn}/eventAndTopics_down_highlight.png') no-repeat
            center / 100% 100%;
        }
      }
      .narrow-on {
        position: absolute;
        right: 68px;
        width: 68px;
        height: 48px;
        cursor: pointer;
        background: url('@{btn}/eventAndTopics_up_normal.png') no-repeat center /
          100% 100%;
        &:hover {
          top: 1px;
          background: url('@{btn}/eventAndTopics_up_highlight.png') no-repeat
            center / 100% 100%;
        }
      }
      .close {
        position: absolute;
        right: 0;
        width: 68px;
        height: 48px;
        cursor: pointer;
        background: url('@{btn}/eventAndTopics_close_normal.png') no-repeat
          center / 100% 100%;
        &:hover {
          top: 1px;
          background: url('@{btn}/eventAndTopics_close_highlight.png') no-repeat
            center / 100% 100%;
        }
      }
    }
  }
  .content {
    height: 568px;
    padding: 10px 18px 10px 30px;
    // box-sizing: border-box;
    background: url('@{url}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    .el-scrollbar {
      height: 450px;
      color: #fff;
    }
    .address {
      display: flex;
      align-items: center;
      .addressTitle {
        width: 130px;
        height: 30px;
        font-size: 26px;
        line-height: 36px;
        color: #bbd0dc;
        font-family: 'Microsoft Ya Hei';
      }
      .selectBox {
        height: 42px;
        position: relative;
        .inputBox {
          position: relative;
          cursor: pointer;
          width: 268px;
          height: 42px;
          border-radius: 2px;
          background-color: rgba(118, 242, 251, 0.16862745098039217);
          border: 1px solid #76f2fb;
          p {
            font-size: 26px;
            line-height: 42px;
            color: #c4d8da;
            font-family: 'Microsoft Ya Hei';
            line-height: 40px;
            width: calc(100% - 40px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
          }
          i {
            position: absolute;
            right: 10px;
            top: 4px;
            display: block;
            width: 38px;
            height: 33px;
            &.arrow-down {
              background: url('@{icon}/sanjiao.png') no-repeat 0 0;
              background-size: 100% 100%;
            }
            &.arrow-up {
              background: url('@{icon}/sanjiao.png') no-repeat 0 0;
              background-size: 100% 100%;
              transform: rotate(180deg);
            }
          }
        }
        .select_ul {
          position: absolute;
          top: 50px;
          left: 0;
          width: 268px;
          height: 200px;
          padding-bottom: 10px;
          overflow: hidden;
          background: url('../../../../assets/img/halfScreen/eventAndTopics/select_bg.png')
            no-repeat 0 0;
          background-size: 100% 100%;
          z-index: 10;
          li {
            width: 100%;
            height: 40px;
            cursor: pointer;
            font-size: 26px;
            color: #c4d8da;
            font-family: 'Microsoft Ya Hei UI Light';
            font-weight: 300;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover {
              background: url('@{icon}/selectactive.png') no-repeat 0 0;
              background-size: 100% 100%;
              color: #fff7cd;
            }
            &.active {
              background: url('@{icon}/selectactive.png') no-repeat 0 0;
              background-size: 100% 100%;
              color: #fff7cd;
            }
          }
        }
      }
    }
    .tabBox {
      margin-top: 12px;
      .tabBoxTitle {
        width: 154px;
        height: 30px;
        font-size: 26px;
        line-height: 36px;
        color: #bbd0dc;
        font-family: 'Microsoft Ya Hei';
      }
      .tabBox_ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 6px;
        padding-right: 16px;
        li {
          position: relative;
          width: 202px;
          height: 52px;
          line-height: 52px;
          background: url('@{icon}/video_text_gb.png') no-repeat 0 0;
          background-size: 100% 100%;
          flex-direction: column;
          color: #fcf280;
          margin: 5px 0;
          cursor: pointer;
          font-size: 28px;
          color: #b6d1dd;
          font-family: 'Microsoft Ya Hei';

          // &:nth-child(3n - 2) {
          //   margin-left: -6px;
          // }
          &.active {
            background: url('@{icon}/video_text_active_gb.png') no-repeat 0 0;
            background-size: 100% 100%;
          }
          .tabBox_li_title {
            position: absolute;
            left: 14px;
          }
          .tabBox_li_total {
            position: absolute;
            right: 16px;
          }
        }
      }
    }
    .iconBox {
      width: 100%;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
      }
    }
    .videoListBox {
      .videoListBox_content {
        .searchBox {
          width: 95%;
          height: 40px;
          position: relative;
          margin-top: 10px;
          border-radius: 2px;
          background-color: rgba(118, 242, 251, 0.16862745098039217);
          border: 1px solid #76f2fb;
          input {
            width: 352px;
            height: 100%;
            border: none;
            background: transparent;
            font-size: 22px;
            padding-left: 10px;
            line-height: 42px;
            color: #c4d8da;
            font-family: 'Microsoft Ya Hei';
            outline: none;
          }
          .searchBtn {
            position: absolute;
            right: 0;
            top: 2px;
            display: inline-block;
            height: 41px;
            width: 34px;
            // background: url(../../../../assets/img/nav/searchIcon.png) no-repeat;
            // background-size: 100% 100%;
            // position: absolute;
            // right: 3.5%;
            // top: 25%;
            background: url(../../../../assets/img/nav/searchIcon.png) no-repeat
              50% 50%;
            cursor: pointer;
          }
        }

        .elCheckbox {
          height: 480px;
          overflow: hidden;
          width: 100%;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 49px;
    background: url('@{url}/botBg-.png') no-repeat;
    background-size: 100% 100%;
  }
  .border {
    margin-left: 13px;
    width: 474px;
    height: 2px;
    background: #143c5c;
  }

  .hwsx-as-prop {
    position: absolute;
    right: 15px;
    width: 470px;
    top: 567px;
    color: #fff;
    // z-index: 2;
  }
}
</style>
