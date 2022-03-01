<template>
  <!-- 物资调拨 -->
  <div class="suppliesAllocate">
    <ul class="suppliesAllocate_ul">
      <li class="suppliesAllocate_ul_li">
        <div class="suppliesAllocate_ul_li_txt accept">累计到达中央物资</div>
        <div class="suppliesAllocate_ul_li_number">
          <i class="icon-arrow" :class="[animateflag > 0?'icon-arrow-up':'', animateflag < 0?'icon-arrow-down':'']"></i>
          <span :class="{'scale_value' : !(animateflag === 0)}">{{accept}}</span>万件
        </div>
      </li>
      <li class="suppliesAllocate_ul_li">
        <div class="suppliesAllocate_ul_li_txt allot">累计调拨中央物资</div>
        <div class="suppliesAllocate_ul_li_number">
          <i class="icon-arrow" :class="[animateflag > 0?'icon-arrow-up':'', animateflag < 0?'icon-arrow-down':'']"></i>
          <span :class="{'scale_value' : !(animateflag === 0)}">{{allot}}</span>万件
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
  name: 'SuppliesAllocate',
})
export default class SuppliesAllocate extends Vue {
  // 接收到的物资数量
  @Prop({ default: 0 }) public accept?: number;
  // 调拨的物资数量
  @Prop({ default: 0 }) public allot?: number;
  @Prop({ default: 0 }) public animateflag?: number;
}
</script>

<style lang="less" scoped>
@imgUrl: '../../../../assets/img/other/';
.suppliesAllocate {
  padding: 0 32px 0 25px;
  height: 100%;
  &_ul {
    margin: 0;
    padding: 0;
    list-style: none;
    &_li {
      font-family: 'myYahei';
      margin-bottom: 20px;
      font-size: 28px;
      color: #e5f4ff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 65px;
      &_txt {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        max-width: 70%;
        &.accept {
          &::before {
            content: '';
            flex-shrink: 0;
            background: url('@{imgUrl}/wuziicon.png') no-repeat center / 100%
              100%;
            width: 43px;
            height: 38px;
            margin-right: 10px;
          }
        }
        &.allot {
          &::before {
            flex-shrink: 0;
            content: '';
            background: url('@{imgUrl}/wuziiconjia.png') no-repeat center / 100%
              100%;
            width: 42px;
            height: 42px;
            margin-right: 10px;
          }
        }
      }
      &_number {
        flex-shrink: 0;
        > span {
          font-family: 'Impact';
          display: inline-block;
          color: #fff001;
          font-weight: bold;
          font-size: 28px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>