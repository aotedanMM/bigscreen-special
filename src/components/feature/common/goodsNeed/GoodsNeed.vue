<template>
  <div class="panel-goods-need scroll-style">
    <el-scrollbar v-if="goodsNeedList.length > 0" class="cmp-scrollbar-y" style="height:100%">
      <ul v-for="(item, index) of goodsNeedList" :class="['need-ul', item.type]" :key="index">
        <li class="need-li">
          <span class="title">{{item.name}}</span>
          <span class="total">{{item.total}}</span>
          <span class="unit">{{item.unit}}</span>
        </li>
        <li class="need-li">
          <span>
            未调派
            <font class="notdispatch">{{item.notdispatch}}</font>
          </span>
          <span>
            调派中
            <font class="dispatching">{{item.dispatching}}</font>
          </span>
        </li>
      </ul>
    </el-scrollbar>
    <div class="nothingData--bg" v-else></div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
/**
 * 重点物资需求
 */
@Component
export default class GoodsNeed extends Vue {
  /**
   * 重点物资数据，类型 array
   */
  @Prop() private goodsNeedList: any;
}
</script>
<style lang='less' scoped>
.panel-goods-need {
  /* height: 260px;
  /*overflow-y: scroll;*/
  /*margin-left: 2%;*/
  width: 100%;
  height: 100%;
  padding-left: 22px;
  // .noDataClass {
  //   width: 100%;
  //   text-align: center;
  //   font-size: 28px;
  //   color: #bdebef;
  //   padding-top: 16%;
  // }
}
.need-ul {
  padding-left: 75px;
  margin-bottom: 13px;
  font-size: 28px;
}
.tent {
  background: url(../../../../assets/img/goodsNeed/tent.png) left center
    no-repeat;
}
.quilt {
  background: url(../../../../assets/img/goodsNeed/quilt.png) left center
    no-repeat;
}
.food {
  background: url(../../../../assets/img/goodsNeed/food.png) left center
    no-repeat;
}
.goods {
  background: url(../../../../assets/img/goodsNeed/goods.png) left center
    no-repeat;
}
.light {
  background: url(../../../../assets/img/goodsNeed/light.png) left center
    no-repeat;
}
.rescue {
  background: url(../../../../assets/img/goodsNeed/rescue.png) left center
    no-repeat;
}
.source {
  background: url(../../../../assets/img/goodsNeed/source.png) left center
    no-repeat;
}
.traffictool {
  background: url(../../../../assets/img/goodsNeed/traffictool.png) left center
    no-repeat;
}

.need-li {
  color: #b1d5e1;
  .title {
    color: #06ebfd;
    padding-right: 10px;
  }
  .unit {
    color: #ffaa00;
  }
  .total {
    color: #ffaa00;
  }
}
.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
  // margin-right: -18px !important;
}
</style>