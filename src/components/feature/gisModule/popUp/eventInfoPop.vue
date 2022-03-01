<template>
<!--  :style = "{marginTop: -popHeight + 'px'}" -->
  <div class="eventInfoPop expert" >
    <input id="eventPopdata" type="hidden" :value="data" />
    <div class="eventInfoPop_title">
      <div class="eventInfoPop_title_txt" :title="name">{{name}}</div>
      <div class="eventInfoPop_title_close" @click="close()"></div>
    </div>
    <div class="eventInfoPop_content">
      <ul>
        <el-scrollbar wrap-style="height:100%;max-height: 360px;">
          <li class v-for="(item,key) in list" :key="key" :title="item.value">
            <span class="label">{{item.label}}:</span>
            <span class="value">{{item.value || (item.value === 0 ? 0 : '- -')}}</span>
          </li>
          <li class="switchBtn" v-if="switchInfo">
            <switchPathPlanning
              :onOff="onOff"
              :switchInfo="switchInfo"
              @changeHandler="switchHanler"
            />
          </li>
        </el-scrollbar>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { messsageBus } from '@/util/message';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import { Draggable } from 'draggable-vue-directive';
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
import switchPathPlanning from '@/components/feature/switchPathPlanning/switchPathPlanning.vue';

@Component({
  name: 'EventInfoPop1',
  components: {
    switchPathPlanning,
  },
  mixins: [popDataDeal],
  directives: {
    Draggable,
  },
})
export default class EventInfoPop1 extends Vue {
  public popHeight: any = 0;
  private calcHeight() {
    this.popHeight = $('.eventInfoPop.expert').innerHeight();
    this.popHeight += 40;
  }
  private mounted() {
    this.calcHeight();
  }
}
</script>
<style lang="less" scoped>
@url: '../../../../assets/img/eventInfo';
.eventInfoPop {
  cursor: default !important;
  width: 410px;
  background: rgba(7, 25, 65, 0.8);
  border-radius: 1px;
  // color: #fff;
  position: absolute;
  bottom: 100%;
  // margin-left: -205px;
  margin-bottom: 50px;
  left: 0;
  padding-bottom: 10px;
  z-index: 1;
  &_title {
    background: url('@{url}/title.png') no-repeat center / 100% 100%;
    height: 60px;
    line-height: 65px;
    display: flex;
    align-items: center;
    font-size: 28px;
    color: #fff;
    &::before {
      content: '';
      width: 54px;
      height: 54px;
      background: url('@{url}/dotdefault.png') no-repeat center / 100% 100%;
      flex-shrink: 0;
    }
    &_close {
      background: url('@{url}/maptooltipclose.png') no-repeat center / 100% 100%;
      width: 15px;
      height: 14px;
      cursor: pointer;
      flex-shrink: 0;
      position: absolute;
      right: 20px;
    }
    &_txt {
      color: #fff;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 24px;
      white-space: nowrap;
      width: 300px;
      font-weight: normal;
      height: 55px;
      line-height: 55px;
    }
  }
  &_content {
    padding: 0 15px 15px 15px;
    ul  {
      position: relative;
      max-height: 350px;
      padding: 0 15px;
      li {
        font-size: 22px;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
        cursor: pointer;
        span.label  {
          flex-shrink: 0;
          color: #0edbe4;
          width: 130px;
          margin-right: 10px;
        }
        span.value {
          flex-grow: 1;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
                .popDetailBtn  {
          width: auto !important;
          display: block !important;
          float: right;
          // border: solid 1px #02e9d5;
          padding: 0 5px;
          margin-left: 10px;
          margin-top: 10px;
          line-height: 32px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<style lang="less">
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
</style>
