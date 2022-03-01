<template>
  <!-- 图层图例 -->
  <div class="typhoon">
    <el-scrollbar style="height: 200px" class="rain_list_addr">
      <div class="legend_checked">
        <span class="subtext">预报机构</span>
        <ul>
          <li v-for="city in cities" :key="city">{{ city }}</li>
          <div class="clearfix"></div>
        </ul>
      </div>

      <div class="legend_color">
        <span class="subtext">台风图例</span>
        <ul>
          <li
            v-for="(item, index) in colorList"
            :key="index"
            :class="active == index ? 'active' : ''"
            @click="changeBg(item, index)"
          >
            <span :style="{ background: item.color }"></span>
            <span>{{ item.value }}</span>
            <div class="clearfix"></div>
          </li>
        </ul>
      </div>
      <div class="legend_circle">
        <span class="subtext">风图</span>
        <ul>
          <li>7级风圈</li>
          <li>10级风圈</li>
          <li>12级风圈</li>
          <div class="clearfix"></div>
        </ul>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import {} from '@/api/feature/monitorwarning/installServer';
/**
 * 图层
 */
@Component({
  name: 'Typhoon',
})
export default class Typhoon extends Vue {
  private isShow: any = true;
  private cityOptions: any = ['北京', '广州', '日本', '关岛', '香港', '概率图'];
  private checkedCities: any = ['上海', '北京'];
  private cities: any = this.cityOptions;
  private active: any = 0;
  private isIndeterminate: any = true;
  private colorList: any = [
    {
      color: '#00e400',
      value: '热带低压',
    },
    {
      color: '#065fb8',
      value: '热带风景',
    },
    {
      color: '#ffff00',
      value: '强热带风景',
    },
    {
      color: '#ff7e00',
      value: '台风',
    },
    {
      color: '#f00f00',
      value: '强台风',
    },
    {
      color: '#b10021',
      value: '超强台风',
    },
  ];

  private changeBg(item: any, index: any) {
    this.active = index;
  }
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../assets/img/gisModule/legendPlanel';
.typhoon {
  width: 94%;
  margin: 0 auto;
  margin-top: 40px;
  .legend_checked {
    margin-left: 30px;
    margin-bottom: 4px;
    .subtext {
      font-size: 26px;
      color: #bbd0dc;
      margin-left: 10px;
      margin-bottom: 20px;
      display: block;
    }
    ul {
      li {
        font-size: 24px;
        line-height: 34px;
        color: #ffffff;
        text-align: center;
        // width: 80px;
        padding: 0px 10px;
        height: 34px;
        background: url('@{imgPath}/typhoon_nomal.png') no-repeat 0 0;
        background-size: 100% 100%;
        margin-right: 14px;
        margin-bottom: 10px;
        float: left;
        cursor: pointer;
        &:active,
        &:hover {
          background: url('@{imgPath}/typhoon_active.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
      }
      .active {
        background: url('@{imgPath}/typhoon_active.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
    }
  }
  .legend_color {
    // height: 100px;
    width: 96%;
    margin-left: 30px;
    margin-bottom: 4px;
    .subtext {
      font-size: 26px;
      color: #bbd0dc;
      margin-left: 10px;
      margin-bottom: 20px;
      display: block;
    }
    ul {
      margin-top: 10px;
      margin-left: 6px;
      li {
        width: 130px;
        float: left;
        margin-bottom: 20px;
        span {
          &:nth-child(1) {
            // width: 65px;
            height: 15px;
            display: block;
          }
          &:nth-child(2) {
            font-size: 24px;
            // width: 65px;
            display: block;
            text-align: center;
            margin-bottom: 4px;
          }
        }
      }
    }
  }
  .legend_circle {
    margin-left: 30px;
    .subtext {
      font-size: 26px;
      color: #bbd0dc;
      margin-left: 10px;
      margin-bottom: 20px;
      display: block;
    }
    ul {
      li {
        font-size: 24px;
        line-height: 40px;
        width: 150px;
        height: 40px;
        background: url('@{imgPath}/typhoon_nomal.png') no-repeat 0 0;
        background-size: 100% 100%;
        margin-right: 14px;
        margin-bottom: 10px;
        float: left;
        cursor: pointer;
        text-align: center;
        &:active,
        &:hover {
          background: url('@{imgPath}/typhoon_active.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
      }
    }
  }
  .clearfix:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
</style>
