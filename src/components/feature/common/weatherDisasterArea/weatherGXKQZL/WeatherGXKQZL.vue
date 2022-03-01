<template>
    <div class="QXKQZL_Wrap">
        <div class="left"> 
            <div class="leftItem" v-for="(item , index) in weatherGxkqzlKQ" :key="index + item">
                <div class="value">{{item.value?item.value:'暂无数据'}}</div>
                <div class="title">{{item.title}}</div>
            </div>
        </div>
        <div class="right">
           <div class="rightInner">
               <div class="rightItem" v-for="(item , index) in weatherGxkqzlQT" :key="index + item">
                   <div class="title">{{item.title}}</div>
                   <div class="value">{{item.value?item.value:'--'}}</div>
               </div>
           </div>

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAirQualityLabelListItem, IAirQualityDataListItem } from '@/interface/feature/common/weather/Weather.interface.ts';
@Component({
    name: 'WeatherGxkqzl',
})
export default class WeatherGxkqzl extends Vue {
  @Prop() private weatherGxkqzlKQ?: IAirQualityLabelListItem[];
  @Prop() private weatherGxkqzlQT?: IAirQualityDataListItem[];

}
</script>

<style scoped lang="less">
  .QXKQZL_Wrap{
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      .left{
          width: 270px;
          height: 113px;
          background: url("../../../../../assets/img/weather/kongqi.png") left center no-repeat;
          background-size: contain;
          display: flex;
          justify-content:center;
          align-items: center;
          .leftItem{
              margin-bottom: 5px;
              margin-right: 8%;
              text-align: center;
              &:last-of-type{
                  margin-right:0;
              }
              .value{
                  color: #23d266;
              }
              .title{
                  color: #85fefe;
              }
          }

      };
      .right{
          width: 480px;
          background: url("../../../../../assets/img/weather/qitiname.png") left top no-repeat;
          background-size: contain;
          .rightInner{
              width: 100%;
              background: url("../../../../../assets/img/weather/qitibottom.png") left bottom no-repeat;
              background-size: contain;
              display: flex;
              .rightItem{
                  width: 16.6%;
                  text-align: center;
                  .title{
                      width: 100%;
                      height: 49px;
                      line-height: 58px;
                      color: #69e3e7
                  }
                  .value{
                      width: 100%;
                      height: 39px;
                      line-height:39px;
                  }
              }
          }

      }
  }
</style>