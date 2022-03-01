<template>
<!-- 视频监控组件 -->
  <div class="layer-panel" :class="!expanded ? 'heightShow': ''" id="videoMonitorPop">
    <!-- 图层 -->
    <div class="layerBox">
      <div class="titleTop">
        <span>视频监控</span>
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
        <div class="address">
          <p class="addressTitle">行政区划：</p>
          <div class="selectBox">
            <div class="inputBox" @click="select">
              <p :title="value">{{ value }}</p>
              <i :class="selectShow ? 'arrow-up' : 'arrow-down'"></i>
            </div>
            <ul class="select_ul" v-show="selectShow">
              <el-scrollbar style="height: 100%;">
                <li
                  v-for="(item, index) in options"
                  :key="index"
                  @click="changeCity(item, index)"
                  :class="{ active: selectIndex === index }"
                  :title="item.name"
                >
                  {{ item.name }}
                </li>
              </el-scrollbar>
            </ul>
          </div>
        </div>
        <div class="tabBox" ref="tabBox">
          <p class="tabBoxTitle">接入视频：</p>
          <ul class="tabBox_ul">
            <li
              class="tabBox_li"
              v-for="(item, index) in tabList"
              :key="index"
              @click="changeTab(item, index)"
              :class="{ active: activeIndex === index }"
            >
              <span class="tabBox_li_title">{{ item.name }}</span>
              <span class="tabBox_li_total">{{ item.value }}</span>
            </li>
          </ul>
        </div>
        <div class="videoListBox labelBox">
          <div class="iconBox" v-if="showVideoBox">
            <p>请选择行政区划</p>
          </div>
          <div v-else class="videoListBox_content">
            <div class="searchBox">
              <input
                v-model="input"
                placeholder="请输入视频监控名称"
                @keyup.enter="search"
                maxlength="16"
              />
              <i class="searchBtn" @click="search"></i>
            </div>
            <div class="elCheckbox" v-show="videoList.length">
              <el-scrollbar style="height: 100%;">
                <div
                  v-for="(item, index) in videoList"
                  :key="index"
                  :class="item.isOnline * 1 === 0 ? 'gray' : ''"
                  class="video-data_list"
                  @mouseenter="enter(item)" @mouseleave="leave(item)">
                  <!-- <el-checkbox
                    v-model="item.checked"
                    @change="handleCheckedCitiesChange(item)"
                    :title="item.name"
                    >{{ item.name }}
                    </el-checkbox> -->
                    <span  
                    @click="handleCheckedCitiesChange(item, index)"
                    :title="item.name"
                    :class="videoli == index ? 'videoliactive':'videoli'"
                    >{{ item.name }}</span>
                   
                    <!-- <span 
                   :key="item"
                   class="collection"
                   :class="{ collection_select : iscollection === index}"
                    @click="collection(item,index)"></span> -->
                    <!-- <span 
                   :key="index"
                   class="collection"
                   v-show="item.isshow"
                   :class="{'collection_select':spanIndex.indexOf(index)>-1}"
                    @click="collection(item,index)">  </span> -->
                </div>
              </el-scrollbar>
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
            <div v-if="!videoList.length" class="zwsj"></div>
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
import { districtServer } from '@/api/installServer';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import { nomalLeftServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
/**
 * 图层
 */
@Component({
  name: 'VideoMonitorView',
  components: {},
})
export default class VideoMonitorView extends Vue {
  private videoli: any = -1;
  // 下拉框
  private selectShow: boolean = false;
  // 下拉框选中的对应index
  private selectIndex: any = 0;
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
  // 视频列表
  private videoList: any = [];
  // tab菜单
  private tabList: any = [];
  // 城市选项
  private options: any = [];
  // 当前选中的城市全部信息
  private cityData: any = '';
  // 城市对应的value
  private value: any = '';
  // 列表的高度
  private listHeight: any = '400';
  // icon收藏
  private iscollection: any = '';
  // 收藏所用数组
  private spanIndex: any = [];
  // 判断是否调用列表
  private Iftab: boolean = true;
  private videoIndex: number = 0;
  // 专题对应的 themecode 值
  private themeCode: any = '';
  private selectType: boolean = false;
  private tabCode: string = '';
  private rootDistrictCode: any = publishObjectPath.value.district.root;
  private mounted() {
    const eMapPanelDrag: any = new Drag('#videoMonitorPop', '.titleTop', {
      container: '.layoutMain',
    });
    eMapPanelDrag.toDrag();
    // 调用行政区划接口
    this.city();
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
      // that.videoList.forEach((key: any, index: any) => {
      //   if (key.id === data.id) {
      //     that.videoList[index].checked = false;
      //   }
      // });
    });
    // 弹窗关闭清空数据
    this.messsageBus.on('closeVideoMapPop', (data: any) => {
      that.checkList = [];
      this.mapId = [];
      that.videoList.forEach((key: any, index: any) => {
        key.checked = false;
      });
      // this.getComponent().removeHighlight();
    });
  }
  private beforeDestroy() {
    this.getComponent().off('VideoLayer_popup', this.showVideoPlayer, this);
    this.getComponent().removeResource();
    this.messsageBus.emit('closeVideoMapPop');
  }
  @Watch('value')
  private changeShow(val: any) {
    this.showVideoBox = false;
    this.getTabList();
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
      this.getComponent().removeHighlight();
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
      this.expanded = false;
      this.messsageBus.emit('closeVideoMapPop');
    }
  }
  // 输入框查询事件
  private search() {
    // console.log
    // 联动地图上图
       const pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？%]');
       const result = this.input.match(pattern);
       if (!result) {
        const obj = {
          keyWord: this.input,
          districtCode:
            this.cityData.gbCode === this.rootDistrictCode
              ? ''
              : this.cityData.gbCode,
          type: this.tabList[this.activeIndex].code,
        };
        this.getComponent().addResourceSPJK(obj);
        this.getVideoList(1);
      } else {
        this.$message({
          message: '请输入汉字及数字查询',
          type: 'warning',
        });
      }
  }
  // 关闭
  private close() {
    this.messsageBus.emit('closeVideoMonitorPop', false);
  }
  private enter(item: any) {
    item.isshow = !item.isshow;
  }
  private leave(item: any) {
    item.isshow = !item.isshow;
  }
  private collection(item: any, index: any) {
    // 判断是否为 通用 || 专题 收藏 ，以这两个定义收藏以及非收藏数组 当tab为 通用收藏 时 themeCode = 0
    if (this.$store.state.forestFireModule.ProjectType === '') {
      this.themeCode = 1;
    } else {
      this.themeCode = this.$store.state.forestFireModule.ProjectType;
    }
    const opts = {
      themeCode: this.$store.state.forestFireModule.ProjectType,
      videoId: item.id,
    };
    if (opts.themeCode === '') {
      opts.themeCode = '1';
    }
    if (this.tabList[this.activeIndex].code === 'zhuantishoucang' || this.tabList[this.activeIndex].code === 'tongyongshoucang') {
      if (this.tabList[this.activeIndex].code === 'tongyongshoucang') {
        opts.themeCode = '0';
      }
      this.videoIndex--;
      for (const value of this.spanIndex) {
        const arrIndex = this.spanIndex.indexOf(index);
        if (arrIndex > -1) {
            // item.ifShowList = !item.ifShowList
            // this.$set(this.list[index],'showing',false);
            this.spanIndex.splice(arrIndex, 1);
          }
      }
      const res: any = videoSituationServer.getFavoriteDel(opts);
      // this.getVideoList(1);
      // 点击收藏时设置当前列表是否刷新
      this.Iftab = false;
      if (res.data) {
        this.getVideoList(1);
      }
    } else {
      const arrIndex = this.spanIndex.indexOf(index);
      this.iscollection = index;
      this.spanIndex.push(index);
      this.videoIndex = this.spanIndex.length;
      const res: any = videoSituationServer.getFavoriteSave(opts);
      // 点击收藏时设置当前列表是否刷新
      this.Iftab = false;
    }
    this.getTabList();
    // 加入定时器 为留出服务器 删除数据 响应时间
    if (this.videoIndex === 0) {
      setTimeout(() => {
        this.getVideoList(1);
      }, 100);
    } else {
      setTimeout(() => {
        this.getVideoList(this.currentPage);
      }, 100);
    }
    // 收藏或取消收藏后，都回调一下 tab接口 与 列表接口
  }
  // tab切换事件
  private changeTab(item: any, index: any) {
    this.spanIndex = [];
    this.videoli = -1;
    this.activeIndex = index;
    this.checkList = [];
    if (this.$store.state.forestFireModule.ProjectType === '') {
      this.themeCode = '1';
    } else {
      this.themeCode = this.$store.state.forestFireModule.ProjectType;
    }
    // 联动地图上图
    const obj = {
      keyWord: this.input,
      districtCode:
        this.cityData.gbCode === this.rootDistrictCode ? '' : this.cityData.gbCode,
      type: this.tabList[this.activeIndex].code,
      themeCode: this.themeCode,
    };
    this.getComponent().addResourceSPJK(obj);
    this.getVideoList(1);
  }
  // 行政区划
  private city() {
    //  获取城市信息
    nomalLeftServer.getCitySelected().then((res: any) => {
      console.log( '城市信息', res );
      if (!res || !res.data) {
        return;
      }
      console.log(res.data, '城市信息');
      const cityObj = {
        gbCode: this.rootDistrictCode,
        name: '全市',
      };
      res.data.unshift(cityObj);
      this.options = res.data;
      this.cityData = res.data[0];
      this.value = res.data[0].name;
    });
    // districtServer
    //   .getDistrictTreeByCode({ districtcode: this.rootDistrictCode })
    //   .then((data: any) => {
    //     // console.log(data, 1111111);
    //     if (data.code === 0) {
    //       this.value = data.data.districtname;
    //       this.options = data.data.children;
    //       const cityObj = {
    //         districtcode: data.data.districtcode,
    //         districtname: data.data.districtname,
    //         latitude: data.data.latitude,
    //         longitude: data.data.longitude,
    //         parentcode: data.data.parentcode,
    //         shortname: data.data.shortname,
    //         spelling: data.data.spelling,
    //         ssx: data.data.ssx,
    //         wkt: data.data.wkt,
    //       };
    //       this.options.unshift(cityObj);
    //       this.cityData = data.data;
    //     }
    //   });
    // console.log(res, 222222222);
  }
  // 根据id查视频
  private async searchVideoUrl(item: any) {
    const opts = {
      id: item.id,
    };
    const res: any = await videoSituationServer.getVideoStationDetail(opts);
    if (this.checkList.length > 3) {
      this.$message({
        message: '最多只能播放四路视频，请关闭一路视频后再次点击播放',
        type: 'warning',
        duration: 1000,
      });
      this.mapId.splice(this.mapId.indexOf(item.id), 1);
      item.checked = false;
      this.getComponent().removeHighlight();
      return;
    }
    if (item.x !== null && item.y !== null) {
        this.getComponent().locatResource('id', item.id);
     }
    this.checkList.push(res.data);
    this.messsageBus.emit('showVideoMapPop', this.checkList);
    this.messsageBus.emit('minimizeVideoMapPopShow', true); // 最小化弹窗按钮隐藏
  }
  // 查询当前页视频监控
  private async getVideoList(page: any) {
    // 查询条件
    if (this.tabList[this.activeIndex].code === 'tongyongshoucang') {
      this.themeCode = 0;
    } else {
      this.themeCode = this.$store.state.forestFireModule.ProjectType ? this.$store.state.forestFireModule.ProjectType : '1';
    }
    const opts = {
      pageSize: 10,
      nowPage: page,
      keyWord: this.input,
      districtCode:
        this.cityData.gbCode === this.rootDistrictCode
          ? ''
          : this.cityData.gbCode,
      type: this.tabList[this.activeIndex].code,
      themeCode: this.themeCode,
    };
    // tongyongshoucang  zhuantishoucang

    const res: any = await videoSituationServer.getVideoStationsList(opts);
    res.data.forEach((item: any) => {
      item.checked = false;
      item.isshow = false;
      item.ifShowList = true;
    });
    // 添加属性
    if (this.tabList[this.activeIndex].code === 'zhuantishoucang' || this.tabList[this.activeIndex].code === 'tongyongshoucang') {
      for (var i = 0; i < res.data.length; i++) {
        this.spanIndex.push(i);
      }
    }
    // else{
    //   this.spanIndex
    //   this.spanIndex =[]
    // }
    // 同步选中信息 是列表栏选中
    if (this.checkList.length > 0) {
      const len = this.checkList.length;
      const lenTwo = res.data.length;
      for (let k = 0; k < len; k++) {
        const checkedId = this.checkList[k].id;
        for (let j = 0; j < lenTwo; j++) {
          const checkedIdTwo = res.data[j].id;
          if (checkedId === checkedIdTwo) {
            res.data[j].checked = true;
          }
        }
      }
    }
    this.videoList = res.data;
    this.videoIndex = this.videoList.length;
    // console.log(res.data,555555555)
    this.total = res.total * 1;
    this.currentPage = page;
  }
  // 查询tab详情
  private async getTabList() {
    const opts = {
      districtCode:
        this.cityData.gbCode === this.rootDistrictCode
          ? ''
          : this.cityData.gbCode,
          // 页面初始值 采用 themecode 值为防汛 themecode 值
          themeCode: this.$store.state.forestFireModule.ProjectType ? this.$store.state.forestFireModule.ProjectType : '1',
    };
    const res: any = await videoSituationServer.getVideoStatistics(opts);
    // this.tabList = res.data.filter((item: any => item.name != '专题收藏');
    console.log('1213', res);

    res.data = res.data.filter(
      (item: any) => item.name !== '专题收藏',
    );
    res.data = res.data.filter(
      (item: any) => item.name !== '通用收藏',
    );
    // 暂时隐藏重点企业和加油站
    res.data = res.data.filter(
      (item: any) => item.name !== '加油站',
    );
    res.data = res.data.filter(
      (item: any) => item.name !== '重点企业',
    );
    this.tabList = res.data;
    this.$nextTick(() => {
      this.listHeight = 605 - (this.$refs.tabBox as HTMLElement).offsetHeight;
    });
    if (this.Iftab) {
      this.changeTab(res.data[0], 0);
    }
  }
  // 分页事件
  private handlePageChange(val: any) {
    // console.log
    this.spanIndex = [];
    this.currentPage = val;
    this.getVideoList(val);
  }
  // 视频列表事件
  private handleCheckedCitiesChange(item: any, index: any) {
    this.videoli = index;
    this.checkList = [];
    this.mapId.push(item.id);
    this.searchVideoUrl(item);
  }
  // 城市下拉事件
  private select() {
    this.selectShow = !this.selectShow;
  }
  // 城市点击事件
  private changeCity(data: any, index: any) {
    this.value = data.name;
    this.cityData = data;
    this.selectIndex = index;
    this.selectShow = false;
    // 联动地图上图
    const obj = {
      keyWord: this.input,
      districtCode:
        this.cityData.gbCode === this.rootDistrictCode
          ? ''
          : this.cityData.gbCode,
      type: this.tabList[this.activeIndex].code,
    };
    this.getComponent().addResourceSPJK(obj);
  } //  获取地图功能
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
.grayBox{
.gray {
  display: flex;
  .el-checkbox__label {
    color: red !important;
    
  }
}
}
.labelBox{
.elCheckbox {
  .el-checkbox__inner {
    margin-left: 20px;
    display: none!important;

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
  
  .collection_select{
    background: url('@{icons}collection_select.png') no-repeat !important;
  }
}
}
.grayBox {
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
  
  .collection_select{
    background: url('@{icons}collection_select.png') no-repeat !important;
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
  position: absolute;
  top: 100px;
  right: 10%;
  z-index: 20;
  height: 918px;
  .layerBox{
    height: 100%;
  }
  .zwsj{
  width: 165px;
  height: 163px;
  margin: auto;
  margin-top: 179px;
  background: url('../../../../assets/img/default/panel/noData.png') no-repeat center center;
  background-size: 100% 100%;
}
  .titleTop {
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
    height: calc(100% - 243px);
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
      // 重新调整盒子的高(laobi 2021.10.14)
      height: calc(100% - 145px);
      .videoListBox_content {
        height: 100%;
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
          height: calc(100% - 86px);
          overflow: hidden;
          width: 96%;
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
.heightShow{
  height: 70px  !important;
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
.gray {
  span {
    color: gray;
  }
}
</style>
