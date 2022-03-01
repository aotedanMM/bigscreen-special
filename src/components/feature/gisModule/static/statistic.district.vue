<template>
  <div class="PopulationFever">
    <RenderBox
      v-slot="{
        classflag,
        addClass,
        moduleIsShow,
        changeModuleIsShow,
      }"
      type="districtComp">
      <div>
        <span class="showModule"
          v-show="!moduleIsShow"
          @click="changeModuleIsShow"></span>
        <div class="detail" v-show="moduleIsShow">
          <div class="half-title title-panel">
            <span>行政区划分布</span>
            <span class="closeModule" @click="changeModuleIsShow"></span>
          </div>
          <ul class="statisticList specialXaqh">
            <li
              class="statisticList_li f-tit-h2"
              v-for="(data, index) in cityData"
              :key="index"
              :class="{ checkSty: data.isChecked }"
              @click="addClass(data, cityData)"
            >
                <span>
                  <font class="statisticList_li_textWarning f-number">{{ data.distance }}</font>{{ data.distanceUnit }}的{{ data.city }}
                </span>
                <span> 
                  <em class="statisticList_li_textWarning f-number">
                    {{ data.number }}
                  </em>{{data.unit}}
                </span>
            </li>          
          </ul>  
        </div>
      </div>
    </RenderBox>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import RenderBox from '@/components/common/render/statistic.shrink.vue';
@Component({
  name: 'DistrictLeftModule',
  components: {
    RenderBox,
  },
})
export default class DistrictLeftModule extends Vue {
  @Prop() private cityData!: object;
}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/popUp/statistic.less');
// #DistrictLeftModule {
//   height: 100%;
//   width: 100%;
//   position: relative;
//   outline:1px solid red;
// }
.halflist .notShowTab .statisticList.specialXaqh {
    display: block !important;
  }
</style>
