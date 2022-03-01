<template>
  <div class="ShipLegendBox">
    <el-scrollbar style="height:100%;width:100%;">
      <div class="shipType">
        <p class="shipType_title">船舶类型</p>
        <ul class="shipType_ul">
          <li v-for="(item,index) in shipType" :key="index">
            <i :class="item.icon"></i>
            <p class="shipType_name">{{item.name}}</p>
          </li>
        </ul>
      </div>
      <div class="shipType">
        <p class="shipType_title">船舶状态</p>
        <ul class="shipType_ul">
          <li v-for="(item,index) in shipState" :key="index">
            <i :class="item.icon"></i>
            <p class="shipType_name">{{item.name}}</p>
          </li>
        </ul>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 船舶图例
 */
@Component({
  name: 'ShipLegend',
})
export default class ShipLegend extends Vue {
  private shipType: any = [
    {
      name: '客船',
      icon: 'kechuan',
    },
    {
      name: '货船',
      icon: 'huochuan',
    },
    {
      name: '执法船',
      icon: 'zhifachuan',
    },
    {
      name: '油轮',
      icon: 'youlun',
    },
    {
      name: '拖轮',
      icon: 'tuolun',
    },
    {
      name: '引航船',
      icon: 'yinhangchuan',
    },
    {
      name: '高速船',
      icon: 'gaosuchuan',
    },
    {
      name: '搜救船',
      icon: 'soujiuchuan',
    },
    {
      name: '其他',
      icon: 'other',
    },
  ];
  private shipState: any = [
    {
      name: '静止',
      icon: 'jingzhi',
    },
    {
      name: '航行',
      icon: 'hangxing',
    },
    {
      name: '转向',
      icon: 'zhuanxiang',
    },
    {
      name: '系泊',
      icon: 'xibo',
    },
  ];
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
ul,
li {
  list-style: none;
}
</style>
<style lang="less" scoped>
@imgPath: "../../../../../assets/img/gisModule/legendPlanel";
.ShipLegendBox {
  height: 100% - 10px;
  overflow: hidden;
  .shipType {
    width: 100%;
    margin: 16px 0 0 10px;
    &_title {
      font-size: 26px;
      letter-spacing: 1px;
      line-height: 26px;
      color: #bbd0dc;
      font-family: "Microsoft Ya Hei";
    }
    &_ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        display: flex;
        align-items: center;
        width: 130px;
        height: 40px;
        border-radius: 4px;
        background-image: linear-gradient(0deg, #020d26 0%, #000000 100%);
        border: 1px solid #1a86bb;
        margin-top: 10px;
        margin-left: 6px;
        i {
          display: inline-block;
          width: 42px;
          height: 15px;
          margin-left: 6px;
          &.kechuan {
            background: url("@{imgPath}/kechuan.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.huochuan {
            background: url("@{imgPath}/huochuan.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.zhifachuan {
            background: url("@{imgPath}/zhifachuan.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.youlun {
            background: url("@{imgPath}/youlun.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.tuolun {
            background: url("@{imgPath}/tuolun.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.yinhangchuan {
            background: url("@{imgPath}/yinhangchuan.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.gaosuchuan {
            background: url("@{imgPath}/gaosuchuan.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.soujiuchuan {
            background: url("@{imgPath}/soujiuchuan.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.other {
            background: url("@{imgPath}/other.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.jingzhi {
            background: url("@{imgPath}/gaosuchuan.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.hangxing {
            background: url("@{imgPath}/hangxing.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.zhuanxiang {
            background: url("@{imgPath}/zhuanxiang.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
          &.xibo {
            background: url("@{imgPath}/xibo.png") no-repeat 0 0;
            background-size: 100% 100%;
          }
        }
        .shipType_name {
          font-size: 24px;
          line-height: 40px;
          color: #ffffff;
          font-family: "Microsoft Ya Hei";
          margin-left: 6px;
        }
      }
    }
  }
}
</style>
