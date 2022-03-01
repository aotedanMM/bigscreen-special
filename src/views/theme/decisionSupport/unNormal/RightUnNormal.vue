<!--默认-->
<template>
  <div class="layoutAssist">
    <div class="cu-flex">
      <!--右侧 第一列-->
      <div class="layoutSidebar_A cu-flex-average">
        <div v-for="(item,index) in layout.left.children" :style="item.style" :key="index">
          <!--左右都复用-->
          <DragPanal :slotName="item.slotName" class="heightPercent100">
            <div slot="czjy" class="heightPercent100">
              <PanelView title="处置建议" class="cmp-panel-cnt--bg" style="margin-right:4px;">
                <disposal-suggestion></Disposal-suggestion>
              </PanelView>
            </div>
            <div slot="jyll" class="heightPercent100">
              <!-- <PanelView title="救援力量">  -->
              <HelpPowerAndUAV :allData="videoJianKong"></HelpPowerAndUAV>
              <!-- </PanelView> -->
            </div>
            <div slot="ddzf" class="heightPercent100">
              <PanelView title="当地政府" class="cmp-panel-cnt--bg">
                <LocalGovernmentView></LocalGovernmentView>
              </PanelView>
            </div>
            <div slot="jywz" class="heightPercent100">
              <!-- <PanelView title="救援物资"></PanelView> -->
              <HelpPowerAndUAV2 :allData="videoJianKong02"></HelpPowerAndUAV2>
            </div>
          </DragPanal>
        </div>
      </div>
      <!--右侧 第二列-->
      <div class="layoutSidebar_B cu-flex-average">
        <div v-for="(item,index) in layout.right.children" :style="item.style" :key="index">
          <!--左右都复用-->
          <DragPanal :slotName="item.slotName" class="heightPercent100">
            <div slot="czjy" class="heightPercent100">
              <PanelView title="处置建议" class="cmp-panel-cnt--bg" style="margin-right:4px;">
                <disposal-suggestion></Disposal-suggestion>
              </PanelView>
            </div>
            <div slot="jyll" class="heightPercent100">
              <!-- <PanelView title="救援力量">  -->
              <HelpPowerAndUAV :allData="videoJianKong"></HelpPowerAndUAV>
              <!-- </PanelView> -->
            </div>
            <div slot="ddzf" class="heightPercent100">
              <PanelView title="当地政府" class="cmp-panel-cnt--bg">
                <LocalGovernmentView></LocalGovernmentView>
              </PanelView>
            </div>
            <div slot="jywz" class="heightPercent100">
              <!-- <PanelView title="救援物资"></PanelView> -->
              <HelpPowerAndUAV2 :allData="videoJianKong02"></HelpPowerAndUAV2>
            </div>
          </DragPanal>
        </div>
      </div>
    </div>

    <suggest-dialog v-if="suggestDialog"></suggest-dialog>
    
    <!-- <div class="CommandDispatchView-wrap">
       <CommandDispatchView></CommandDispatchView>
      </div> -->

  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseVideo from '@/components/feature/vedio/Vedio.common.vue';
import DisposalSuggestion from '@/views/theme/decisionSupport/module/unNormalRight/disposalSuggestion.vue';
import HelpPowerAndUAV from '@/views/earthquake/panelcontainer/HelpPowerAndUAV.vue';
import HelpPowerAndUAV2 from '@/views/earthquake/panelcontainer/HelpPowerAndUAV2.vue';
import LocalGovernmentView from '@/views/theme/decisionSupport/module/unNormalRight/localGovernment.vue';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import VideoSurveillance from '@/components/feature/videoSurveillance/VideoSurveillance.feature.vue';
import suggestDialog from '@/views/theme/decisionSupport/module/unNormalRight/disposalSuggestionPop.vue';
import { Draggable } from 'draggable-vue-directive' ;
import DragPanal from '@/components/common/drag/drag.commont.vue';
import { videoServerPath } from '@/api/installServer';
// import CommandDispatchView from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/CommandDispatch.vue';
@Component({
  name: 'RightUnNormal',
  components: {
    BaseVideo,
    DisposalSuggestion,
    HelpPowerAndUAV,
    HelpPowerAndUAV2,
    LocalGovernmentView,
    PanelView,
    VideoSurveillance,
    suggestDialog,
    DragPanal,
  // CommandDispatchView,
  },
})
export default class RightUnNormal extends Vue {
  // 布局动态实现
  private layout = {
    left : {
      class : 'layoutSidebar_A cu-flex-average',
      children : [
        {
          style : 'height:35%',
          // 处置建议的key
          slotName : 'czjy',
        },
        {
          style : 'height:65%',
          // 救援力量的key
          slotName : 'jyll',
        },
      ],
    },
    right : {
      class : 'layoutSidebar_A cu-flex-average',
      children : [
        {
          style : 'height:35%;',
          // 当地政府的key
          slotName :  'ddzf',
        },
        {
          style : 'height:65%;',
          // 救援物资的key
          slotName : 'jywz',
        },
      ],
    },
  };
  private laders: any = [
    {
      work: '当地政府',
      infomationwork: '云南省省长',
      infomationname: '阮成发',
      infomationphone: '18699018732',
    },
    {
      work: '当地政府',
      infomationwork: '省应急厅长',
      infomationname: '王以志',
      infomationphone: '13557490401',
    },
    {
      work: '当地政府',
      infomationwork: '玉溪市市长',
      infomationname: '张德华',
      infomationphone: '15901305478',
    },
    {
      work: '当地政府',
      infomationwork: '元江县县长',
      infomationname: '封志荣',
      infomationphone: '13779542007',
    },
  ];
  private BaseVideo: any = {
    xinwen: `${videoServerPath}/report/xinwenbaodao.mp4`,
    jiankongUrl: `${videoServerPath}/monitor/fangwudaota.mp4`,
    wurenji: `${videoServerPath}/drone/zhenquxianchang.mp4`,
    huichuan: `${videoServerPath}/news/xuexiaoyingjiu.mp4`,
  };
  // private optionsData: any = [
  //   {
  //     lable: '北京',
  //     value: 10,
  //   },
  //   {
  //     lable: '天津',
  //     value: 10,
  //   },
  //   {
  //     lable: '天津',
  //     value: 10,
  //   },
  // ];
  private optionsData: any = [{
    lable: '北京市',
    value: '110000',
  }, {
    lable: '天津市',
    value: '120000',
  }, {
    lable: '重庆市',
    value: '500000',
  }, {
    lable: '广东省',
    value: '440000',
  }, {
    lable: '山东省',
    value: '370000',
  }, {
    lable: '江苏省',
    value: '320000',
  }, {
    lable: '河南省',
    value: '410000',
  }, {
    lable: '上海市',
    value: '310000',
  }, {
    lable: '河北省',
    value: '130000',
  }, {
    lable: '浙江省',
    value: '330000',
  }, {
    lable: '香港特别行政区',
    value: '810000',
  }, {
    lable: '陕西省',
    value: '610000',
  }, {
    lable: '湖南省',
    value: '430000',
  }, {
    lable: '福建省',
    value: '350000',
  }, {
    lable: '云南省',
    value: '530000',
  }, {
    lable: '四川省',
    value: '510000',
  }, {
    lable: '广西壮族自治区',
    value: '450000',
  }, {
    lable: '安徽省',
    value: '340000',
  }, {
    lable: '海南省',
    value: '460000',
  }, {
    lable: '江西省',
    value: '360000',
  }, {
    lable: '湖北省',
    value: '420000',
  }, {
    lable: '山西省',
    value: '140000',
  }, {
    lable: '辽宁省',
    value: '210000',
  }, {
    lable: '台湾省',
    value: '710000',
  }, {
    lable: '黑龙江省',
    value: '230000',
  }, {
    lable: '内蒙古自治区',
    value: '150000',
  }, {
    lable: '澳门特别行政区',
    value: '820000',
  }, {
    lable: '贵州省',
    value: '520000',
  }, {
    lable: '甘肃省',
    value: '620000',
  }, {
    lable: '青海省',
    value: '630000',
  }, {
    lable: '新疆维吾尔自治区',
    value: '650000',
  }, {
    lable: '西藏自治区',
    value: '540000',
  }, {
    lable: '吉林省',
    value: '220000',
  }, {
    lable: '宁夏回族自治区',
    value: '640000',
  }];
  private listData: any = [];
  private videoJianKong: any = {
    panelVideo: [
      {
        title: '视频回传',
        url: this.BaseVideo.huichuan,
        type: 0,
        selectData: [
          {
            code: {key: 'news/xuexiaoyingjiu.mp4', select: 0},
            name: '学校营救',
          },
          {
            code: {key: 'news/duiwujijie.mp4', select: 0},
            name: '队伍集结',
          },
          {
            code: {key: 'news/wuzidiaobo1.mp4', select: 0},
            name: '物资调拨',
          },
          {
            code: {key: 'news/wuzidiaobo2.mp4', select: 0},
            name: '物资调拨2',
          },
          {
            code: {key: 'news/kongzhongkancha1.mp4', select: 0},
            name: '空中勘察1',
          },
          {
            code: {key: 'news/kongzhongkancha2.mp4', select: 0},
            name: '空中勘察2',
          },
          {
            code: {key: 'news/quanmianjiuyuan.mp4', select: 0},
            name: '全面救援',
          },
          {
            code: {key: 'news/yuzhenbobao.mp4', select: 0},
            name: '余震播报',
          },
          {
            code: {key: 'news/zaiqingbaodao1.mp4', select: 0},
            name: '灾情报道',
          },
          {
            code: {key: 'news/zaiqingbaodao2.mp4', select: 0},
            name: '灾情报道2',
          },
          {
            code: {key: 'news/zaiqingbaodao3.mp4', select: 0},
            name: '灾情报道3',
          },
          {
            code: {key: 'news/zaiqingbaodao4.mp4', select: 0},
            name: '灾情报道4',
          },
          {
            code: {key: 'news/zaiqingbaodao5.mp4', select: 0},
            name: '灾情报道5',
          },
          {
            code: {key: 'news/zaiqingbobao.mp4', select: 0},
            name: '灾情播报',
          },
        ],
      },
      {
        title: '视频监控',
        url: this.BaseVideo.jiankongUrl,
        type: 1,
        selectData: [
          {
            code: {key: 'monitor/fangwudaota.mp4', select: 1},
            name: '房屋倒塌',
          },
          {
            code: {key: 'monitor/cunkougonglu.mp4', select: 1},
            name: '村口公路',
          },
          {
            code: {key: 'monitor/cunerzu.mp4', select: 1},
            name: '村二组',
          },
          {
            code: {key: 'monitor/cunliuzu.mp4', select: 1},
            name: '村六组',
          },
          {
            code: {key: 'monitor/heguqiaoliang.mp4', select: 1},
            name: '河谷桥梁',
          },
          {
            code: {key: 'monitor/xianchengjiedao.mp4', select: 1},
            name: '县城街道',
          },
          {
            code: {key: 'monitor/zongheshichang.mp4', select: 1},
            name: '综合市场',
          },
          {
            code: {key: 'monitor/tingchechang.mp4', select: 1},
            name: '停车场',
          },
        ],
      },
    ],
    panelList: {
      title: '救援力量',
      selectOption: this.optionsData,
      listData: this.listData,
    },
  };
  private videoJianKong02: any = {
    panelVideo: [
      {
        title: '无人机',
        url: this.BaseVideo.wurenji,
        type: 3,
        selectData: [
          {
            code: {key: 'drone/zhenquxianchang.mp4', select: 3},
            name: '震区现场',
          },
          {
            code: {key: 'drone/zhenhouzaiqing.mp4', select: 3},
            name: '震后灾情',
          },
          {
            code: {key: 'drone/zhenhouzaiqing1.mp4', select: 3},
            name: '震后灾情1',
          },
          {
            code: {key: 'drone/zhenhouzaiqing2.mp4', select: 3},
            name: '震后灾情2',
          },
          {
            code: {key: 'drone/zhenhouzaiqing3.mp4', select: 3},
            name: '震后灾情3',
          },
          {
            code: {key: 'drone/zhenhouchengshi.mp4', select: 3},
            name: '震后城市',
          },
          {
            code: {key: 'drone/yasehu.mp4', select: 3},
            name: '堰塞湖',
          },
          {
            code: {key: 'drone/dizhenzaihai.mp4', select: 3},
            name: '地震灾害',
          },
        ],
      },
      {
        title: '新闻报道',
        url: this.BaseVideo.xinwen,
        type: 2,
        selectData: [
          {
            code: {key: 'report/xinwenbaodao.mp4', select: 4},
            name: '新闻报道',
          },
          {
            code: {key: 'http://ivi.bupt.edu.cn/hls/cctv1.m3u8', select: 4},
            name: 'CCTV-1',
          },
          {
            code: {key: 'http://ivi.bupt.edu.cn/hls/cctv13.m3u8', select: 4},
            name: 'CCTV-13',
          },
          {
            code: {key: 'http://45.126.83.51/qwr9ew/s/s21/index2.m3u8', select: 4}, // 一线地址
            name: '凤凰资讯',
          },
          {
            code: {key: 'http://ivi.bupt.edu.cn/hls/hunanhd.m3u8', select: 4},
            name: '湖南卫视',
          },
          {
            code: {key: 'http://ivi.bupt.edu.cn/hls/hbhd.m3u8', select: 4},
            name: '湖北卫视',
          },
        ],
      },
    ],
    panelList: {
      title: '救援物资',
      selectOption: this.optionsData,
      listData: this.listData,
    },
  };

  private suggestDialog: boolean = false;
  private created() {
    this.messsageBus.on('dealSuggest', (bool: boolean) => {
      this.suggestDialog = bool;
    });
  }
}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/LayoutAssist.less');
.CommandDispatchView-wrap{
  position:absolute; 
  top:0;
  left:0;
  bottom:0;
  right:0;
  z-index:2
}
</style>
