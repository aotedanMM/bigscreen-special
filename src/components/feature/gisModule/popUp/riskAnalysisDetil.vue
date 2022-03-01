<!-- 风险统计弹框 -->
<template>
  <div class="GisPlane" v-show="false">
    <div class="title">
      {{data.data.attributeSet.attributes[1].value}}
    </div>
     <i class="close" @click="close"></i>
    <div class="style_pie" style="display: none;">
      泄漏发生{{dataTime}}小时后
    </div>
    <div class="style_pie">
      下风向影响距离为{{downwindDistance}}米
    </div>
    <!-- <div class="style_pie">
      面积为{{area}}
    </div> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'RiskAnalysisDetil',
})
export default class RiskAnalysisDetil extends Vue {
}
</script>
<style lang="less" scoped>
@imgUrl: '../../../../assets/img/flood/disasterStatistics/';
.GisPlane {
  min-width: 300px;
  // min-height: 200px;
  min-height: 124px;
  background-image: url(../img/jjqbj.png);
  background-size: 100% 100%;
    position:relative;
  .close{
      display: inline-block;
      width: 74px;
      height: 28px;
      background: url("@{imgUrl}eventAndTopics_close.png") no-repeat center center;
      background-size: 100% 100%;
      position: absolute;
      top: 0px;
      right: 0px;
      cursor: pointer;
        &:hover{
        background: url("@{imgUrl}eventAndTopics_close_h.png") no-repeat center center;
        background-size:100% 100%; 
      }
}
}
.title {
 width: 100%;
 height: 53px;
// font-size: 26px;
  font-size: 23px;
  color: #06e8fd;
  // line-height: 53px;
  line-height: 39px;
  // text-indent: 10px;
  text-indent: 15px;
}
.style_pie {
   width: 100%;
  height: 30px;
  font-size: 24px;
  color: #e5f4fe;
  line-height: 30px;
  text-indent: 10px;
  margin-right: 30px;
  margin-top: 10px;
}
</style>
