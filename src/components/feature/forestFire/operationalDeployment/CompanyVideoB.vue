<template>
    <div :class="activeclass" id="companyVideoWrapper">
          <div class="companyVideo-content">
            <div class="videoListBox labelBox">
              <div class="videoListBox_content">
                <div class="elCheckbox" v-show="videoList.length">
                  <el-scrollbar style="height: 100%;">
                    <div
                      v-for="(item, index) in videoList"
                      :key="index"
                      class="video-data_list"
                      @mouseenter="enter(item)" @mouseleave="leave(item)">
                      <!-- <el-checkbox
                        v-model="item.checked"
                        @change="handleCheckedCitiesChange(item, index)"
                        :title="item.camName"
                        >{{ item.camName }}
                        </el-checkbox> -->
                        <span  :class="videoli == index ? 'videoliactive':'videoli'"  @click="handleCheckedCitiesChange(item, index)">{{ item.camName }}</span>
                    </div>
                  </el-scrollbar>
                </div>
                <!-- <div class="pagingBox" v-show="videoList.length">
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
                </div> -->
                <div v-if="!videoList.length" class="zwsj"></div>
              </div>
            </div>
          </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import {} from '@/api/feature/monitorwarning/installServer';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import publishObjectPath from '@/util/configRegistry';
import BaseVideo from '@/components/feature/vedio/Vedio.common.vue';
import { companyVideoServer } from '@/api/installServer';
/**
 * 图层
 */
@Component({
  name: 'CompanyVideoPop',
  components: {},
})
export default class CompanyVideoPop  extends Vue {
  // 视频列表
  private videoList: any = [];
  // 分页总数量
  private total: any = 0;
  // 显示条数
  private pageSize: any = 10;
  // 当前页码
  private currentPage: any = 1;
  // 选中的视频数据
  private checkList: any = [];
  private videoli: any = 0;
  private companyVideoPopList: any;
  private activeclass: any = 'companyVideo-wrapper';
  private mounted() {
    const companyVideoPanelDrag: any = new Drag('#companyVideoWrapper', '.titleTop', {
      container: '.layoutMain',
    });
    companyVideoPanelDrag.toDrag();
    console.log(this.companyVideoPopList);
    // debugger;
    const that = this;
    // 弹窗关闭清空数据
    this.messsageBus.on('closeVideoMapPop', (data: any) => {
      that.checkList = [];
      that.videoList.forEach((key: any, index: any) => {
        key.checked = false;
      });
    });
    this.messsageBus.on('openCompanyVideopop', (data: any) => {
      console.log(data);
      if (data) {
        // this.isshowcompanyVideoPop = true; // 视频窗口是否显示
        this.companyVideoPopList = data;
        this.getCompanyList();
      }
    });
    this.messsageBus.on('changeliststyle' , (name: any) => {
      if (name === 'enlarge') { // 放大后的列表样式
        this.activeclass = 'liststyle';
      } else {
        this.activeclass = 'companyVideo-wrapper';
      }
    });
  }
  private onPosChanged(positionDiff: any, absolutePosition: any, event: any) {
    if (event.target.closest('[draggable-state]')) {
      event.target.closest('[draggable-state]').style.position = 'absolute';
    }
  }
  private getCompanyList() {
    console.log('获取公司直播视频');
    let warningalert: any = false;
    const { name } = this.companyVideoPopList;
    // console.log(name);
    companyVideoServer.getCompanyVideo(name).then((res: any) => {
      // console.log(res);
      if ( res.status === 200 ) {
        if (res.data.length > 0) {
          res.data.map((item: any, index: any) => {
            item.checked = false;
          });
          this.videoList = res.data;
          this.videoList[0].checked = true;
          this.handleCheckedCitiesChange(this.videoList[0] , 0);
        } else {
          warningalert = true;
        }
      }
      if (warningalert) {
        this.$message({
            message: '暂无企业视频',
            type: 'warning',
            duration: 1000,
          });
    }
    });

  }

  private enter(item: any) {
    item.isshow = !item.isshow;
  }
  private leave(item: any) {
    item.isshow = !item.isshow;
  }

  // // 分页事件
  // private handlePageChange(val: any) {
  //   this.currentPage = val;
  //   // this.getVideoList(val);
  // }

  // 视频列表事件
  private handleCheckedCitiesChange(item: any, index: any) {
    this.videoli = index;
    this.checkList = [];
    this.checkList.push({
      id: item.camCode,
      name: item.camName,
    });
    this.messsageBus.emit('showVideoMapPop', this.checkList);
  }
  // 关闭
  private close() {
    this.messsageBus.emit('closeCompanyVideoPop', false);
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../assets/img/gisModule/PopulationFeverBox';
@icons: '../../../../assets/img/gisModule/gisLayerPanel/';
  .zwsj{
    width: 165px;
    height: 163px;
    margin: auto;
    margin-top: 179px;
    background: url('../../../../assets/img/default/panel/noData.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .companyVideo-wrapper {
    width: 300px;
    // background: url('@{url}/video_bg.png') no-repeat;
    // background-size: 100% 100%;
    height: 88%;
    position: absolute;
    left: 300px;
    top: 62px;
    left: 0;
    overflow-y: scroll;
    z-index: 99999!important; // 让现场弹窗层级在最顶层
    border-right: solid 1px #038ec2;
  }
  .liststyle{
    width: 300px;
    // background: url('@{url}/video_bg.png') no-repeat;
    // background-size: 100% 100%;
    height: 90%;
    position: absolute;
    left: 300px;
    top: 82px;
    left: 0;
    z-index: 99999!important; // 让现场弹窗层级在最顶层
    border-right: solid 1px #038ec2;
  }
  .btn {
    .close {
      position: absolute;
      right: 1px;
      top: -3px;
      width: 57px;
      height: 47px;
      cursor: pointer;
      background: url('@{url}/menu_magnify_bg_active_03.png') no-repeat center /
        100% 100%;
      &:hover {
        background: url('@{url}/menu_shrink_active_03.png') no-repeat center /
          100% 100%;
      }
    }
  }
  .titleCopy {
    position: relative;
    padding: 0px 40px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-weight: 600;
    height: 70px;
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
  }
.labelBox{
.elCheckbox {
  .img{
    width: 30px;
    height: 35px;
    display: inline-block;
    background: url('@{icons}points.png') no-repeat;
  }
  .el-checkbox__inner {
    margin-left: 20px;
  }
  .el-checkbox {
    margin-right: 0 !important;
    margin-top: 0px!important;
    display: flex;
    align-items: center;
    width: 100%;
    float: left;

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
    &:hover{
      color:#409EFF!important;
    }
    
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
  .videoli {
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    margin-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    &:hover{
      color:#409EFF!important;
    }
  }
  .videoliactive {
    color: #fffabe;
    font-size: 24px;
    cursor: pointer;
    font-size: 24px;
    cursor: pointer;
    margin-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
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
  .video-data_list{
      display: flex;
      position: relative;
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-top: 10px;
      box-sizing: border-box;
    .collection{
      display: inline-block;
      width: 16px;
      height: 16px;
      background: #fff;
      float: right;
      margin-top: 10px;
      margin-right: 10px;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 0;
      background: url('@{icons}collection.png') no-repeat;
    }
  }
  .video-data_list:nth-child(even) {
    background: url('@{icons}timebg.png') no-repeat;
  }
  .collection_select{
    background: url('@{icons}collection_select.png') no-repeat !important;
  }
  .labelBox .elCheckbox .el-checkbox__label:hover{
    color: #fffabe !important;
  }
}
}
</style>