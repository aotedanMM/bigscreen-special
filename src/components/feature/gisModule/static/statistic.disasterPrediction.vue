<template>
  <div class="DisasterPrediction">
    <RenderBox
      v-slot="{ clickFeatureList, moduleIsShow, changeModuleIsShow }"
      :viewData="viewData"
    >
      <div>
        <span
          class="showModule"
          v-show="!moduleIsShow"
          @click="changeModuleIsShow"
        ></span>

        <div class="detail" v-show="moduleIsShow">
          <!-- <MapDialogTitle>
            <template v-slot:title>灾情评估分布</template>
          </MapDialogTitle>
          <span class="closeModule" @click="changeModuleIsShow" style="outline:1px solid red;"></span> -->
           <div class="title">
            <span class="closeModule" @click="changeModuleIsShow"></span>
            <span >灾情预估</span>
          </div>
          <ul>
            <li
              v-for="(item, index) in viewData"
              :key="index"
              @click="clickFeatureList(item.isChecked, index, viewData, item)"
              :class="item.isChecked ? 'active' : ''"
            >
              <p class="Disaster_top">
                <span
                  class="Disaster_top_siwang"
                  v-if="item.leftName == '人员死亡'"
                >
                </span>
                <span
                  class="Disaster_top_daota"
                  v-if="item.leftName == '房屋倒塌'"
                >
                </span>
                <span
                  class="Disaster_top_sunshi"
                  v-if="item.leftName == '经济损失'"
                >
                </span>
                <span v-if="item.num !== '0'">{{ item.num }}</span>
                <span v-else>评估中...</span>
              </p>
              <p class="Disaster_bottom">
                <span>{{ item.leftName }}</span>
                <span>（{{ item.numName }}）</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </RenderBox>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapDialogTitle from '@/views/theme/decisionSupport/common/MapDialogTitle.vue';
import RenderBox from '@/components/common/render/statistic.shrink.vue';
@Component({
  name: 'DisasterPrediction',
  components: {
    MapDialogTitle,
    RenderBox,
  },
})
export default class DisasterPrediction extends Vue {
  @Prop() private viewResData!: any[];
  @Prop() private viewData!: any;
}
</script>
<style lang="less" scoped>
@bg_siwang: url('./../../../../assets/img//gisModule/disaster/shangwang.png')
  no-repeat;
@bg_daota: url('./../../../../assets/img//gisModule/disaster/daota.png')
  no-repeat;
@bg_jingjisunshi: url('./../../../../assets/img//gisModule/disaster/jingjisunshi.png')
  no-repeat;
@path: '../../../../assets/img/gisModule/districtDialog'; // 定义路径
@import url('../../../../assets/css/popUp/statistic.less');
* {
  margin: 0;
  padding: 0;
}
.DisasterPrediction {
  width: 100%;
  height: auto;
  ul {
    width: 100%;
    height: 415px;
    position: absolute;
    left: 5px;
    .active {
      box-shadow: 0 0 50px rgb(245, 245, 3) inset;
    }
    li {
      width: 100%;
      height: 125px;
      background: rgba(7, 25, 65, 0.8);
      border-radius: 10px;
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      cursor: pointer;

      .Disaster_top {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 81px;

        .Disaster_top_siwang {
          background: @bg_siwang;
          background-size: 100%;
          width: 51px;
          height: 51px;
          margin: 20px 30px 10px 30px;
          cursor: pointer;
        }

        .Disaster_top_daota {
          background: @bg_daota;
          background-size: 100%;
          width: 51px;
          height: 51px;
          margin: 20px 30px 10px 30px;
          cursor: pointer;
        }

        .Disaster_top_sunshi {
          background: @bg_jingjisunshi;
          background-size: 100%;
          width: 51px;
          height: 51px;
          margin: 20px 30px 10px 30px;
          cursor: pointer;
        }

        span:nth-child(2) {
          font-size: 50px;
          font-weight: 600;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 86px;
        }
      }

      .Disaster_bottom {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        span:nth-child(1) {
          height: 35px;
          background: rgba(5, 17, 37, 0.6);
          text-align: center;
          line-height: 40px;
          border-radius: 5px;
          font-size: 28px;
          color: #fff;
          margin-left: 6px;
        }

        span:nth-child(2) {
          font-size: 24px;
          color: #fff;
          font-style: normal;
          line-height: 40px;
        }
      }
    }
  }
}
</style>
