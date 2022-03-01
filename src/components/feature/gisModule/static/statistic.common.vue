<template>
  <div id="MapDialog">
    <renderBox
    ref="randerBox"
      v-slot="{
        clickFeatureList,
        viewRenderData,
        moduleIsShow,
        changeModuleIsShow,
        totalNum
      }"
      :viewData="viewData"
       :moduleType="moduleType"
      type="disasterJudgeResource"
    >
      <div>
        <span
          class="showModule"
          v-show="!moduleIsShow"
          @click="changeModuleIsShow"
        ></span>
        <div class="detail" v-show="moduleIsShow">
          <div class="half-title title-panel">
            <span class="closeModule" @click="changeModuleIsShow"></span>
            <slot name="title"></slot>
          </div>
          <ul class="statisticCount f-tit-h2">
            <li>
              共
              <span class="f-number">{{ viewResData.total?viewResData.total:totalNum }}</span>
              <slot name="unit"></slot>
            </li>
          </ul>
          <el-scrollbar :style="{height: $store.state.eventPushStore.eventLocation.EventType&&viewRenderData[0] && viewRenderData[0].levelTitle && viewRenderData[0].levelTitle !== '0'&&($store.state.dataFilterControl.zhypGeoType.key === 'jyqYp'||$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp')? '255px' : ''}">
            <ul class="statisticList" v-if="$store.state.eventPushStore.eventLocation.EventType&&viewRenderData[0] && viewRenderData[0].levelTitle && viewRenderData[0].levelTitle !== '0'&&($store.state.dataFilterControl.zhypGeoType.key === 'jyqYp'||$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp')">
              <li  class="statisticList_li f-tit-h2"
                v-for="(i, index) in viewRenderData"
                :key="index"
                :class="{ checkSty: i.isChecked }"
                @click="
                  clickFeatureList(
                    i.isChecked,
                    index,
                    viewData,
                    i,
                    moduleType,
                    'NewResourceComponent',
                  )
                "
              >
                <span>
                  <span  class="statisticList_li_textWarning f-number">{{ i.title }}</span>
                  <span v-show="$store.state.dataFilterControl.zhypGeoType.key!=='ldqYp'">{{i.levelUnit}}</span>
                </span>
                <span>
                  <span class="statisticList_li_textWarning f-number">{{ i.quantity }}</span>
                  <slot name="unit"></slot>
                </span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </renderBox>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import renderBox from '@/components/common/render/statistic.shrink.vue';
@Component({
  name: 'mapDialogTitle',
  components: {
    renderBox,
  },
})
export default class MapDialogTitle extends Vue {
  @Prop()
  private viewData: any;
  @Prop()
  private viewResData: any;
  @Prop()
  private moduleType: any;
  private created() {
    /*// 监听详情中“更多"内容后，隐藏左侧统计面板。收缩左侧统计窗口  32:9 缩小左侧统计面板
    this.messsageBus.on('closeStatisticPop', () => {
    (this.$refs as any).randerBox.changeModuleIsShow();
    });*/
  }
}
</script>
<style lang="less" scoped>
@path: '../../../../assets/img/gisModule/districtDialog'; // 定义路径

@import url('../../../../assets/css/popUp/statistic.less');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#MapDialog {
  width:100%;
  height: auto; 
}

 /* 统计总数 start*/ 
.statisticCount {
    padding-left: 10px;
    margin: 5px 0 0 0;
    background:url('../../../.././assets/img/halfScreen/halflist/totalbg.png') 0 0 no-repeat;
    background-size:100% 100%;
    
  li {
    list-style:none;
    cursor: pointer;
    color: #ffffff;
    font-weight: bolder;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content:flex-start;
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
 /* 统计总数 end*/ 

.listBoxStatistic{
    padding-bottom: 5px;
    &_li { 
      border-bottom: 1px solid rgba(43,191,252,0.6);
      list-style-type: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      padding: 0px 10px 5px;
      margin: 0;
      span {
        display: inline-block;
        text-align: center;
        line-height: 44px;
        // font-size: 24px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: normal;
        vertical-align: middle;
        white-space: normal;
        word-break: break-word;
      }
      .distance {
        padding: 0px 4px;
        color: yellow;
        font-weight: bolder;
        font-family: 'Impact';
      }
      .indexSpan {
        display: inline-block;
        height: 45px;
        margin: 0;
      }
      .num {
        font-weight: bold;
        text-align: right;
        padding-right: 5px;      
        color:yellow;
      }
    }
    .checkSty {
      box-shadow:none;
    }
    
  }
</style>
