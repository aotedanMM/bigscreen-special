<template>
  <div class="panelPublicDefault rainCont" style="padding: 0px 15px;">
    <div class="panelPublicDefault_hd">
      <span class="title-panel">
        周边视频
      </span>
    </div>
    <ul class="statisticCount f-tit-h2">
      <li>
        共
        <span class="f-number">{{ totalSum || 0 }}个</span>
        <!-- <slot name="unit"></slot> -->
      </li>
    </ul>
    <ul class="statisticList" v-if="$store.state.eventPushStore.eventLocation.EventType&&showInit">
      <li
        class="statisticList_li f-tit-h2"
        v-for="(i, index) in listAll"
        :key="index"
        :class="{ checkSty: activeIndex === index}"
        @click="selectRadiuChangeData(i,index)"
      >
        <span v-show="listAll.length>1">
          <span  class="statisticList_li_textWarning f-number">{{ i.title }}</span>
          <span v-show="$store.state.dataFilterControl.zhypGeoType.key!=='ldqYp'">{{'km'}}</span>
        </span>
        <span v-show="listAll.length>1">
          <span class="statisticList_li_textWarning f-number">{{ i.total }}</span>
          <slot name="unit">个</slot>
        </span>
      </li>
    </ul>
    <div class="listDistrict popupPanelRight_bg" v-show="closeFlag"  :style="$store.state.eventPushStore.eventLocation.EventType&&showInit ? 'height: 460px' : 'height: 730px'">
      <div class="closed-container-box">
        <div class="listDistrict_title">
          <span class="f-tit-h2">周边视频列表</span>
          <i
            @click="FnMinimize"
            :class="
              minimize ? 'panel_switch' : 'panel_switch panel-switch-reverse'
            "
          ></i>
        </div>
      </div>
      <div v-show="minimize" style="height: calc(100% - 66px)">
        <div class="listDistrict-flex-box">
          <div class="listDistrict-input">
            <div class="listDistrict-input-content">
              <el-input
                class="csmMyInput"
                type="text"
                placeholder="请输入视频监控名称"
                v-model.trim="inputWord"
                @change="search(inputWord)"
                @keyup.enter="search(inputWord)"
              >
                <i
                  slot="suffix"
                  class="iconSelf_search"
                  @click="search(inputWord)"
                ></i>
              </el-input>
            </div>
          </div>
        </div>
        <!-- 列表每一行-->
        <div class="nodata" v-if="noData === true || !listDataAll.length">
          <img
            style="margin-top:-20%"
            src="../../../../assets/img/default/panel/noData.png"
            alt
            srcset
          />
        </div>
        <!-- develop上的样式减140 -->
        <div
          v-show="!(noData === true || !listDataAll.length)"
          style="margin-bottom: 5px; height: calc(100% - 140px)"
        >
          <el-scrollbar class="cmp-scrollbar-y" style=" height: calc(100% - 40px)">
            <!-- style="height: calc(100% - 20px);" -->
            <ul class="listBox">
              <li
                class="listBox_li f-txt-com"
                v-for="(item, index) in listDataAll"
                :key="index"
                :title="item.name"
                @click="clickList(item)"
                :class="
                  item.isOnline * 1 === 0
                    ? 'gray'
                    : item.checked
                    ? 'active'
                    : ''
                "
              >
                <span>
                  <em class="">{{ indexMethod(index) }}</em>
                </span>
                {{ item.name }}
              </li>
            </ul>
          </el-scrollbar>
          <!-- 分页-->
          <div class="pagingBox">
            <!-- class="constomMyElPage"
              small -->
            <el-pagination
              background
              :pager-count="5"
              @current-change="handlePageChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import HoverGIS from '@/views/common/gisModules/common/interact/CommonnteractComponent';
import MapCommon from '@/util/MapCommon';
import { videoSituationServer } from '@/api/feature/monitorwarning/installServer';

@Component({
  name: 'SurroundVideoList',
  mixins: [MapCommon],
  components: {},
})
export default class SurroundVideoList extends Vue {
  public paginationObj!: any;
  private totalSum: any = 0; // 统计总数
  private showInit: any = false; // 统计总数
  private listDataAll: any = []; // 当前页的表格数据
  private cacheListTotalData: any = []; // 当前分页的总数据
  // 选中的视频数据
  private checkList: any = [];
  // 点击地图时存储的数据
  private mapId: any = [];
  private viewRenderData: any = [];
  private listAll: any = [
    {
      total: '',
      title: '',
    },
  ];
  private activeIndex: any = -1;
  // 最小化判断
  private minimize: any = true;
  private noData: any = true;
  private closeFlag: any = true;
  private inputWord: string = '';
  // 分页总数量
  private total: any = 0;
  // 显示条数
  private pageSize: any = 10;
  // 当前页码
  private currentPage: any = 1;
  // 查询条件
  private opts: any = {
    pageSize: 10,
    nowPage: 1,
    keyWord: this.inputWord,
    districtCode: '',
    type: '',
    // geometry: '',
  };
  private optsSum: any = {
    // geometry: '',
  };
  public indexMethod(index: number) {
    return (this.currentPage - 1) * this.pageSize + (index + 1);
  }
  private created() {
    if (this.$store.state.dataFilterControl.filter.geometry) { // 看空间字段是否有值
        if (this.$store.state.mapTools.nearbyQueryVisible || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') { // 确认周边查询是否打开初始化进来的时候
          this.showInit = false;
        } else {
          this.showInit = true;
        }
    }
    // this.getSum();
    // this.getVideoList(1);
  }
  // 获取烈度圈、经验圈对应数值
  private async getEventInfoWrapper(key?: any) {
    if (!this.$store.state.eventPushStore.eventLocation.EventType) { // 常态下就不往下走了
      return;
    }
    const self = this;
    const eventInfoWrapper: any = this.$ioc.resolve('eventInfo');
    if (eventInfoWrapper) {
      const eventData = eventInfoWrapper.getRanges(); // 这个方法执行之前，地图必须绘制了圈（烈度或者经验）
      this.viewRenderData = [...eventData];
      const dataList: any = [];
      this.viewRenderData.forEach((item: any, index: any) => {
        dataList.push(this.getSumEqdz(item.geometry, item.title));
      });
      Promise.all(dataList).then(
          (values: any) => {
            if (values.length) {
              // 默认最后一个高亮
              if (key) {
                let allTotal = 0;
                self.selectRadiuChangeData(values[values.length - 1], values.length - 1);
                values.forEach((item: any) => {
                  allTotal += item.total * 1;
                });
                self.totalSum = allTotal;
              } else {
                self.activeIndex = values.length - 1;
              }
              self.listAll = values;
            }
          },
        );
    }
  }
 // 经验圈半径选择Tab点击事件
  private selectRadiuChangeData(item: any, index: any) {
      this.inputWord = '';
      // this.listDataAll = [];
      this.opts = {
        pageSize: 10,
        nowPage: 1,
        keyWord: this.inputWord,
        districtCode: '',
        type: '',
        // geometry: '',
      };
      const obj: any = {
          keyWord: '',
          districtCode:
            this.$store.state.dataFilterControl.filter.districtCode === '370600'
              ? ''
              : this.$store.state.dataFilterControl.filter.districtCode,
          district: '',
          type: '',
        };
      if (index !== this.activeIndex) {
        this.activeIndex = index;
        this.opts.geometry = JSON.stringify(item.geometry);
        this.opts.districtCode = this.$store.state.dataFilterControl.filter.districtCode === '370600' ? '' : this.$store.state.dataFilterControl.filter.districtCode;
        obj.geometry =  this.opts.geometry;
        this.getComponent().addResource(obj);
        this.getVideoList(1, true);
        } else {
           this.getComponent().clearAll();
           this.activeIndex = -1;
        }
  }
    // 统计数值
  private async getSumEqdz(geometry: any, title: any) {
    this.getComponent().unload();
    const opts = {
      districtCode: this.$store.state.dataFilterControl.filter.districtCode === '370600' ? '' : this.$store.state.dataFilterControl.filter.districtCode,
      geometry: JSON.stringify(geometry),
      };
    const res: any = await videoSituationServer.getVideoStatisticsNew(
        opts,
      );
    const totalNum = res.data.map((item: any) => {
      return item.value;
    });
    this.totalSum = this.sumTwo(totalNum);
    const data = {
      total: this.totalSum,
      title,
      geometry,
      isChecked: false,
    };
    return data;
  }

    // 获得当前的研判类型，并且触发初步研判首页统计查询数据
  private handleQueryFilterChange() {
    // 获得当前的研判类型
    let curFilterKeyType = '';
    if (this.$store.state.dataFilterControl.zhypGeoType && this.$store.state.dataFilterControl.zhypGeoType.key) {
      curFilterKeyType = this.$store.state.dataFilterControl.zhypGeoType.key;
    }
    if ((curFilterKeyType === 'jyqYp') || (curFilterKeyType === 'ldqYp')) { // 当前处于经验圈研判或者烈度圈研判
      this.changeQuan();
    }
  }
    // 监听烈度圈：1 ; 经验圈：0
  private changeQuan() {
    const mapType = this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ? 0 : 1;
    if ( mapType === 0 ) {
      this.getEventInfoWrapper(mapType);
    } else if ( mapType === 1 ) {
      this.getEventInfoWrapper(mapType);
    }
  }
  private mounted() {
    if (this.$store.state.dataFilterControl.zhypGeoType.key !== 'ldqYp') {
        this.changeGeometry();
      //  this.getEventInfoWrapper(); // 获取对应圈内统计数量
    } else if (this.$store.state.dataFilterControl.zhypGeoType.key === 'hlyp') {
      this.changeGeometry();
    } else {
     this.getEventInfoWrapper('ldqYp');
    }
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
      that.listDataAll.forEach((key: any, index: any) => {
        if (key.id === data.id) {
          that.listDataAll[index].checked = false;
        }
      });
    });
    // 弹窗关闭清空数据
    this.messsageBus.on('closeVideoMapPop', (data: any) => {
      that.checkList = [];
      this.mapId = [];
      that.listDataAll.forEach((key: any, index: any) => {
        key.checked = false;
      });
      this.getComponent().removeHighlight();
    });
  }
  // 地图点击事件
  private showVideoPlayer(event: any) {
    if (!this.mapId.includes(event.data.id)) {
      this.mapId.push(event.data.id);
      this.searchVideoUrl(event.data);
    } else {
      this.messsageBus.emit('minimizeVideoMapPopShow', true); // 弹出视频播放最小化按钮
      this.getComponent().removeHighlight();
    }
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
      this.getComponent().removeHighlight();
      return;
    }
    if (item.x !== null && item.y !== null) {
      this.getComponent().locatResource('id', item.id);
    }
    this.checkList.push(item);
    this.messsageBus.emit('showVideoMapPop', this.checkList);
    this.messsageBus.emit('minimizeVideoMapPopShow', true); // 最小化弹窗按钮隐藏
  }
  private FnMinimize() {
    this.minimize = !this.minimize;
  }
  // 求和
  private sum(arr: any) {
    var s = 0;
    arr.forEach(function(val: any, idx: any, arr2: any) {
      s += val;
    }, 0);
    return s;
  }
  private sumTwo(arr: any) {
    var s = 0;
    arr.forEach(function(val: any, idx: any, arr2: any) {
      s += val;
    }, 0);
    return s;
  }
  // 统计数值
  private async getSum() {
    this.optsSum.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode === '370600'
        ? ''
        : this.$store.state.dataFilterControl.filter.districtCode;

    if (
      this.$store.state.dataFilterControl.filter.geometry ||
      this.$store.state.dataFilterControl.filter.geometry === ''
    ) {
      this.optsSum.geometry = this.$store.state.dataFilterControl.filter.geometry;
    }
    const res: any = await videoSituationServer.getVideoStatisticsNew(
      this.optsSum,
    );
    const totalNum = res.data.map((item: any) => {
      return item.value;
    });
    this.totalSum = this.sum(totalNum);
  }
  // 查询当前页视频监控
  private async getVideoList(page: any, showOpts?: any) {
    if (!showOpts) {
        this.opts.districtCode =
          this.$store.state.dataFilterControl.filter.districtCode === '370600'
            ? ''
            : this.$store.state.dataFilterControl.filter.districtCode;

        if (
          this.$store.state.dataFilterControl.filter.geometry ||
          this.$store.state.dataFilterControl.filter.geometry === ''
        ) {
          this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry;
        }
      }
    this.opts.nowPage = page;
    console.log(this.opts, 'this.opts');
    const res: any = await videoSituationServer.getVideoStationsList(this.opts);
    // 添加属性
    res.data.forEach((item: any) => {
      item.checked = false;
    });
    this.listDataAll = res.data;
    if (this.listDataAll) {
      this.noData = false;
    }
    // 同步选中信息 是列表栏选中
    if (this.checkList.length > 0) {
      const len = this.checkList.length;
      const lenTwo = res.data.length;
      for (let i = 0; i < len; i++) {
        const checkedId = this.checkList[i].id;
        for (let j = 0; j < lenTwo; j++) {
          const checkedIdTwo = res.data[j].id;
          if (checkedId === checkedIdTwo) {
            res.data[j].checked = true;
          }
        }
      }
    }
    this.total = res.total * 1;
    this.currentPage = page;
  }
  // 分页事件
  private handlePageChange(val: any) {
    this.currentPage = val;
    this.opts.nowPage = val;
    this.getVideoList(val);
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent('videoLayer');
    return component;
  }

  // 输入框查询事件
  private search(inputWord: any) {
    setTimeout(() => {
    this.opts.keyWord = this.inputWord;
    this.optsSum.keyWord = this.inputWord;
    this.addMapInit(inputWord);
    this.getVideoList(1);
    this.getSum();
    }, 500);
  }
  private clickList(item: any) {
    item.checked = !item.checked;
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
      this.getComponent().removeHighlight();
    }
  }
  private beforeDestroy() {
    this.getComponent().off('VideoLayer_popup', this.showVideoPlayer, this);
    this.getComponent().removeResource();
    this.messsageBus.emit('closeVideoMapPop');
  }
  private addMapInit(inputWord: any) {
      // 联动地图上图
      const obj: any = {
        keyWord: inputWord ? inputWord : '',
        districtCode:
          this.$store.state.dataFilterControl.filter.districtCode === '370600'
            ? ''
            : this.$store.state.dataFilterControl.filter.districtCode,
        district: '',
        type: '',
      };
      if (this.$store.state.dataFilterControl.filter.districtCode) {
        obj.districtCode = this.$store.state.dataFilterControl.filter.districtCode === '370600' ? '' : this.$store.state.dataFilterControl.filter.districtCode;
        }
      if (
        this.$store.state.dataFilterControl.filter.geometry ||
        this.$store.state.dataFilterControl.filter.geometry === ''
      ) {
        obj.geometry = this.$store.state.dataFilterControl.filter.geometry;
      }
      this.getComponent().addResource(obj);

  }
  // 监听 geometry
  @Watch('$store.state.dataFilterControl.filter', {deep: true})
  private changeGeometry() {
    this.opts.districtCode = this.$store.state.dataFilterControl.filter.districtCode === '370600' ? '' : this.$store.state.dataFilterControl.filter.districtCode;
    this.optsSum.districtCode = this.$store.state.dataFilterControl.filter.districtCode === '370600' ? '' : this.$store.state.dataFilterControl.filter.districtCode;
    if (this.$store.state.dataFilterControl.filter.geometry || this.$store.state.dataFilterControl.filter.geometry === '') {
      this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry;
      this.opts.keyWord = this.inputWord;
      this.optsSum.keyWord = this.inputWord;
      this.optsSum.geometry = this.$store.state.dataFilterControl.filter.geometry;
      const obj: any = {
        keyWord: this.inputWord,
        districtCode:
          this.$store.state.dataFilterControl.filter.districtCode === '370600'
            ? ''
            : this.$store.state.dataFilterControl.filter.districtCode,
        type: '',
      };
      obj.geometry = this.$store.state.dataFilterControl.filter.geometry;
      // let codekey: any = null;
      // if(this.$store.state.dataFilterControl.filter.districtCode!=='370600') {
      //    codekey= this.$store.state.dataFilterControl.filter.districtCode.split(',');
      // }
      // if (codekey&&codekey.length>0) {
      //     codekey.forEach((item: any) =>{
      //       obj.districtCode = item;
      //     })
      //     this.getComponent().addResource(obj);
      //   } else {
      //     this.getComponent().addResource(obj);
      //   }
      this.getComponent().addResource(obj);

    } else {
      const obj = {
        keyWord: this.inputWord,
        districtCode:
          this.$store.state.dataFilterControl.filter.districtCode === '370600'
            ? ''
            : this.$store.state.dataFilterControl.filter.districtCode,
        type: '',
      };
      this.getComponent().addResource(obj);
    }
    if (this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode) {
      this.showInit = false;
    } else if (this.$store.state.dataFilterControl.filter.districtCode === '370600' && this.$store.state.dataFilterControl.filter.geometry) {
       this.showInit = false;
    } else if (this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode === '370600') {
      this.showInit = true;
    } else if (!this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode === '370600') {
      this.showInit = false;
    } else if (this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode !== '') {
      this.showInit = true;
    } else if (this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode === '') {
      if (this.$store.state.mapTools.nearbyQueryVisible || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') {
        this.showInit = false;
      } else {
        this.handleQueryFilterChange();
        this.showInit = true;
      }
    } else {
      this.showInit = true;
      this.getSum();
    }
    if (!this.showInit || this.$store.state.dataFilterControl.zhypGeoType.key === 'hlyp') {
      this.getSum();
    }
    this.getVideoList(1);
    this.getComponent().load();
  }
}
</script>
<style lang="less" scoped>
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
@import '../../../../assets/css/popUp/statistic.less';
@import '../../../../assets/css/popUp/statistic.list.less';
@import '../../../../assets/css/decisionSupport/AreaList.less';
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 统计总数 start*/
.statisticCount {
  padding-left: 10px;
  margin: 5px 0 0 0;
  background: url('../../../../assets/img/halfScreen/halflist/totalbg.png') 0 0
    no-repeat;
  background-size: 100% 100%;

  li {
    list-style: none;
    cursor: pointer;
    color: #ffffff;
    font-weight: bolder;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      cursor: pointer;
      margin: 0 10px;
      color: yellow;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
  }
}
.listDistrict_title {
  color: #67e1fb;
  letter-spacing: 1px;
  font-weight: normal;
  line-height: 60px;
  display: flex;
  &:after {
    content: '';
    background: url(../../../../assets/img/halfScreen/halflist/titlexian.png)
      50% 0 no-repeat;
    position: absolute;
    width: 100%;
    height: 23px;
    top: 54px;
    left: 0;
  }
  .panel_switch {
    width: 34px;
    height: 29px;
    background-size: 100% 100%;
    position: absolute;
    right: 0px;
    top: 15px;
    cursor: pointer;
    background: url('../../../../assets/img/halfScreen/halflist/open.png') 50%
      50% no-repeat;
    transition: transform 0.3s;
  }
  .panel_switch.panel-switch-reverse {
    transform: scale(1, -1);
  }
}
.listBox_li {
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 334px;
  margin-top: 8px; // develop上的样式
  &.active {
    color: yellow;
  }
}
</style>
