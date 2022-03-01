<template>
    <div class="panel-goods-need scroll-style">
      <ul  v-for="item of goodsNeedList"
           :class="['need-ul', item.type]"
           :key="item.type" >
        <li class="need-li">
            <span class="title">{{item.name}}</span><span class="total">{{item.total}}</span><span class="unit">{{item.unit}}</span>
        </li>
        <li class="need-li">
            <span>未调派<font class="notdispatch">{{item.notdispatch}}</font></span>
            <span >调派中<font class="dispatching">{{item.dispatching}}</font></span>
        </li>
      </ul>
    </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import {IGoodsNeed} from '@/interface/feature/earthquake/GoodsNeed.interface';
/**
  * 重点物资需求
  */
@Component({
    name : 'GoodsNeed',
})
export default class GoodsNeed extends Vue {
    /**
      * 重点物资数据，类型 array
      */
    @Prop({ default: [{
            type: 'tent',
            name: '救灾帐篷',
            total: 20,
            unit: '顶',
            notdispatch: '1',
            dispatching: '2',
        }] }) private goodsNeedList?: IGoodsNeed;
}
</script>
<style lang='less' scoped>
.panel-goods-need{
    height:100%;
    overflow-y: scroll;
    /*margin-left:2%;
    width:97%;*/
}
.need-ul {
    margin:5px 0;
    font-size: 28px;
    list-style:none;
    padding:10px 0 10px 75px;
}
.tent{
    background: url(../../../../assets/img/goodsNeed/tent.png) left center no-repeat;
}
.quilt{
    background: url(../../../../assets/img/goodsNeed/quilt.png) left center no-repeat;
}
.food{
    background: url(../../../../assets/img/goodsNeed/food.png) left center no-repeat;
}
.goods{
    background: url(../../../../assets/img/goodsNeed/goods.png) left center no-repeat;
}
.light{
    background: url(../../../../assets/img/goodsNeed/light.png) left center no-repeat;
}
.rescue{
    background: url(../../../../assets/img/goodsNeed/rescue.png) left center no-repeat;
}
.source{
    background: url(../../../../assets/img/goodsNeed/source.png) left center no-repeat;
}
.traffictool{
    background: url(../../../../assets/img/goodsNeed/traffictool.png) left center no-repeat;
}

.need-li{
    color: #b1d5e1;
    .title{
        color: #06ebfd;
        padding-right: 10px;
    }
    .unit{
        color: #ffaa00;
    }
    .total{
        color: #ffaa00;
    }
}
</style>