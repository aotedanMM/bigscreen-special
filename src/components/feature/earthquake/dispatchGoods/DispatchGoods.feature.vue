<template>
    <div class="panel-dispatch-goods">
        <ul>
            <li class="goods-li arrived"><i ></i><span>累计到达中央物资</span><strong>{{arrivated}}</strong>万件</li>
            <li class="goods-li dispatched"><i></i><span>累计调拨中央物资</span><strong >{{dispatched}}</strong>万件</li>
        </ul>
    </div>

</template>
<script lang="ts">
import { Component, Vue , Prop } from 'vue-property-decorator';
/**
  * 物资调派组件
  */
@Component
export default class DispatchGoods extends Vue {
   /**
    *  累计到达中央物资,以万为单位
    */
    @Prop() public arrivated?: number ;
   /**
    *  累计调拨中央物资,以万为单位
    */
    @Prop() public dispatched?: number ;
}
</script>
<style scoped lang="less">
.goods-li {
    line-height: 65px;
    color: #fff;
    font-size: 16px;
    font-style: normal;
    margin-top:10px;
    margin-bottom:10px;
    padding:0 10px 0 0px;
    i{
        display: inline-block;
        width: 65px;
        height: 50px;
        vertical-align: middle;
    }
}
.arrived i{
    background: url(../../../../assets/img/dispatchGoods/wuziicon.png) no-repeat center 9px;
    background-size: 65% 65%;
}
.dispatched i{
    background: url(../../../../assets/img/dispatchGoods/wuziiconjia.png) no-repeat center 9px;
    background-size: 65% 65%;
}

.goods-li span{
    display: inline-block;
    width: 100px;
    font-size: 12px;
} 
 
.goods-li strong{
    font-size: 28px;
    font-weight: 900;
    color: yellow;
    vertical-align: bottom;
    width: 21%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    text-align: right;
    padding-right: 5px;
}

</style>