<template>
  <div class="PopulationFever">
    <RenderBox
      :viewData="viewData"
      :moduleType="moduleType"
      v-slot="{
        moduleIsShow,
        changeModuleIsShow,
      }"
    >
      <div>
        <span
          class="showModule"
          v-show="!moduleIsShow"
          @click="changeModuleIsShow"
        ></span>
        <div class="detail" v-show="moduleIsShow">
          <div class="half-title title-panel">
            <!-- <span>行政区划分布</span> -->
            <span>{{sourceObj.title}}分布</span>
            <span class="closeModule" @click="changeModuleIsShow"></span>
          </div>
          <!-- <span class="closeModule" @click="changeModuleIsShow"></span>
          <MapDialogTitle>
            <template v-slot:title></template>
          </MapDialogTitle> -->
          <ul class="population-list">
             <li class="population-list_hd flex-box " style="background:none">
              <p class="f-tit-h2">
                <!-- <span v-show="!viewData.geometry">{{IntensityExperienceTitle}}</span> -->
              </p>
              <p class="f-tit-h2" style="width:140px;">
                <span style="width:140px"><i>{{sourceObj.name}}</i></span>
              </p>
              <!-- <p style="width:100px;">
                <span>面积<br />（km²）</span>
              </p> -->
              <p class="f-tit-h2" style="width:120px;">
                <span class="people"><i>人口</i><i style="font-size:22px;">(万)</i></span>
              </p>
            </li>
            <!-- <li
              class="flex-box f-txt-com"
              v-if="!viewData.geometry"
              v-for="(item, index) in viewData"
              :key="index"
              :class="{ checkedList: item.isChecked }"
              @click="clickPopulationFeverList(item, viewData,title)"
            >
              <p class="ul_li_P">
                <span class="f-number" style="text-align:left"> <i class="text-warning">{{ item.intensityNum }}</i> <i class="km_list_sty">{{ item.intensityUnit }}</i></span>
              </p>
              <p v-if='title === "区县"' class="li_2" style="font-weight: 600;text-align:center"><i class="len_left">{{ item.county }}</i></p>
              <p v-if='title === "乡镇"' class="li_2" style="font-weight: 600;text-align:center"><i class="len_right">{{ item.Township }}</i></p>
              <p class="li_2" style="width:120px;font-weight: 600;text-align:left;padding-left:15px">{{ item.population }}</p>
            </li> -->
            <li
               class="flex-boxNot f-txt-com not_hover"
               style="cursor:default"
            >
              <p class="ul_li_P">
                <span class="f-number" style="text-align:left"> <i class="text-warning">共计</i> <i class="km_list_sty"></i></span>
                <!-- <span class="f-txt-com"></span> -->
              </p>
              <p v-if='sourceObj.name === "受影响村庄"' class="li_2" style="font-weight: 600;text-align:center"><i class="len_left">{{totalData.cunTotal}}</i></p>
              <p v-else-if='sourceObj.name === "受影响区市"' class="li_2" style="font-weight: 600;text-align:center"><i class="len_left">{{totalData.countyTotal}}</i></p>
              <p v-else-if='sourceObj.name === "受影响乡镇"' class="li_2" style="font-weight: 600;text-align:center"><i class="len_right">{{totalData.townTotal}}</i></p>
              <!-- <p class="li_2" style="width:100px;">{{ item.area }}</p> -->
              <p class="li_2" style="width:120px;font-weight: 600;text-align:right;padding-left:15px">{{totalData.peopleTotal}}</p>
              <!-- <p class="li_2 ul_li_p_person">{{ item.population }}</p> -->
            </li>
          </ul>
        </div>
      </div>
    </RenderBox>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop , Watch } from 'vue-property-decorator';
import MapDialogTitle from '@/views/theme/decisionSupport/common/MapDialogTitle.vue';
import RenderBox from '@/components/common/render/statistic.shrink.vue';
@Component({
  name: 'PopulationFever',
  components: {
    MapDialogTitle,
    RenderBox,
  },
})
export default class PopulationFever extends Vue {
  @Prop() private viewData!: any[];
  @Prop() private totalData!: any[];
  @Prop() private viewResData: any;
  @Prop() private moduleType: any;
  @Prop() private title: any;
  @Prop() private sourceObj: any;
  private IntensityExperienceTitle: any = '';
  private districtCounty: number = 0; // 总区县
  private headTown: number = 0; // 总乡镇
  private totalPopulation: number = 0; // 总人口
  private isShowNew: any = false;
}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/popUp/statistic.less');

.PopulationFever {
  li {
    list-style: none;
  }
  .people {
    text-align: right;
  }
  .population-list   > li.flex-box{
    width: 100%;
    margin-bottom: 5px;
    background:url('../../../../assets/img/halfScreen/halflist/listbg.png') no-repeat;
    background-size:100% 100%;
    cursor: pointer;
    border-radius: 15px;
    &:hover,
    &.checkedList{
      background:url('../../../../assets/img/halfScreen/halflist/listbghover.png') no-repeat;
      background-size:100% 100%;
      box-shadow:none;
    }
    &.flex-box {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    &.population-list_hd {
      justify-content: space-around;
      border-radius: 10px;
       background: rgba(7, 25, 65, 0.8);
      p {
        margin:0 1px;
        height:60px;
        display:flex;
        align-items:center;
        span {
          display: block;
        }
      }
    }
    p {
      color: #e8f4fe;
      text-align: center;
      margin: 5px;
      flex: 1;
      span {
        width: 100%;
        display: inline-block;
        margin: 4px 0;
        border-radius: 4px;
      }

      &:nth-child(4){
        display:none;
      }
    }
    .ul_li_P {
      border-radius: 12px 0 0 12px;
      padding: 0;
      line-height: 1;
      .text-warning{
       color: yellow;
       padding-left: 10px;
      }
      .km_list_sty{
        color: #e8f4fe;
        font-family: none;
        font-weight: 500;
        margin-left: 5px;
        font-size: 26px;
      }

    }

  }
  .ul_li_p_person {
    width: 100px;
  }
  .li_2 {
    line-height: 54px;
    // font-size: 28px;
    text-align: center;
  }
  // .len_left{
  //   width: 45px;
  //   display: inline-block;
  //   text-align: right;
  // }
  // .len_right{
  //   width: 45px;
  //   display: inline-block;
  //   text-align: left;
  // }
  .icon_left{
    position: relative;
    margin-left: 15px;
  }
  .icon_left::before{
    content: "";
    display: inline-block;
    width:6px ;
    height: 40px;
    background:url('../../../../assets/img/halfScreen/halflist/icon_left.png') no-repeat;
    background-size:100% 100%;
    position: absolute;
    top: 5px;
    margin-left: -10px;
    left: 0px;
  }
  .icon_top{
     position: relative;
    margin-left: 15px;
  }
  .xieStyle{
      height: 30px;
      display: inline-block;
      font-size: 30px;
      padding-left: 5px;
      padding-right: 5px;
  }
  .icon_top::before{
    content: "";
    display: inline-block;
    width:6px ;
    height: 40px;
    background:url('../../../../assets/img/halfScreen/halflist/icon_left.png') no-repeat;
    background-size:100% 100%;
    position: absolute;
    top: -2px;
    margin-left: -10px;
    left: 0px;
  }
  .flex-boxNot{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-bottom: 5px;
    background:url('../../../../assets/img/halfScreen/halflist/listbg.png') no-repeat;
    background-size:100% 100%;
    cursor: pointer;
    border-radius: 15px;
        &.population-list_hd {
      justify-content: space-around;
      border-radius: 10px;
       font-weight: 600;
       background: rgba(7, 25, 65, 0.8);
      p {
        // margin:0;
        // height:100px;
        margin:0 1px;
        height:60px;
        background: rgba(0, 0, 0, 0.5) no-repeat;
        display:flex;
        align-items:center;
        span {
          display: block;
          // font-size: 28px;
        }
      }
    }
    p {
      color: #e8f4fe;
      text-align: center;
      margin: 5px;
      flex: 1;
      span {
        width: 100%;
        display: inline-block;
        margin: 4px 0;
        border-radius: 4px;
      }

      &:nth-child(4){
        display:none;
      }
    }
    .ul_li_P {
      border-radius: 12px 0 0 12px;
      padding: 0;
      line-height: 1;
      .text-warning{
       color: yellow;
       padding-left: 10px;
      }
      .km_list_sty{
        color: #e8f4fe;
        font-family: none;
        font-weight: 500;
        margin-left: 5px;
        font-size: 26px;
      }

    }

  }
}
</style>
