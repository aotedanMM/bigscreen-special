<template>
  <div class="panel-need-predict">
    <el-scrollbar class="cmp-scrollbar-y" style="height:100%">
      <ul class="scroll-style">
        <li
          v-for="item of goodsneedPredicLlist"
          :class="['needPredict-li', 'ellipsis', item.type]"
          :key="item.type"
        >
          <span class="pname">{{item.name}} ({{item.unit}}) :</span>
          <span class="pnum">{{item.number}}</span>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { IGoodsNeedPredict } from '@/interface/feature/earthquake/GoodsNeed.interface';

/**
 * 物资需求预估组件
 */
@Component({
  name: 'GoodsneedPredict',
})
export default class GoodsneedPredict extends Vue {
  /**
   * 物资需求预估列表
   */
  @Prop()
  private goodsneedPredicLlist?: IGoodsNeedPredict[];
}
</script>
<style lang='less' scoped>
.panel-need-predict {
  height: 100%;
  padding: 0px 12px;
}
.panel-need-predict ul {
  height: 100%;
  padding: 0;
  margin: 0;
}
.needPredict-li {
  width: 98%;
  margin-left: 2%;
  margin-top: 15px;
  display: flex;
  align-items: center;
  .pname {
    font-size: 28px;
    color: #06ebfd;
    align-items: center;
  }
  .pnum {
    font-size: 32px;
    color: #ffaa00;
    align-items: center;
    padding-top: 8px;
    padding-left: 15px;
  }
}

.clothes:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/clothes.png) left
    center no-repeat;
}
.quilt:before,.water::before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/quilt.png) left center
    no-repeat;
}
.dustbin:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/dustbin.png) left
    center no-repeat;
}
.blood:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/blood.png) left center
    no-repeat;
}
.food:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/food.png) left center
    no-repeat;
}
.goods:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/goods.png) left center
    no-repeat;
}
.light:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/light.png) left center
    no-repeat;
}
.source:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/source.png) left
    center no-repeat;
}
.rescue:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/rescue.png) left
    center no-repeat;
}
.traffictool:before {
  content: '';
  display: inline-block;
  width: 69px;
  height: 65px;
  background: url(../../../../assets/img/goodsneedPredict/traffictool.png) left
    center no-repeat;
}
.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
  // margin-right: -18px!important; 
}
</style>