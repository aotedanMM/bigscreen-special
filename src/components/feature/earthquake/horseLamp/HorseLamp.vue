<template>
  <div class="horse-lamp">
    <div class="scrollItem" id="contentBlock">
      <div class="scrollItemCont" id="scrollItemCont">
        <span class="announce-event" v-if="myData.time">{{ myData.time }}</span>
        <span class="announce-cont">{{ myData.content }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { pushDataRequestServe } from '@/api/installServer';
@Component
export default class HorseLamp extends Vue {
  private syTimer: any = null;
  private myData: any = {
    content: '',
    time: '',
  };
  private zMarquee() {
    if (!this.syTimer) {
      clearInterval(this.syTimer);
    }
    const oUl: any = document.getElementById('contentBlock');
    const childEl: any = document.getElementById('scrollItemCont');
    const elWidth = childEl.offsetWidth;
    const oUlWidth = oUl.offsetWidth;
    let num = 0;
    function move() {
      num++;
      childEl.style.left = oUlWidth - num + 'px';
      if (num >= elWidth + oUlWidth) {
        num = 0;
        childEl.style.left = oUlWidth + 'px';
      }
    }
    this.syTimer = setInterval(move, 10);
    oUl.onmouseover = () => {
      clearInterval(this.syTimer);
    };
    oUl.onmouseout = () => {
      this.syTimer = setInterval(move, 10);
    };
  }
  @Watch('$store.state.eventPushStore.fontScl')
  private eventChange(val: any) {
    if (val >= 0) {
      this.getData();
    }
  }
  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'fontScl'; // 伤亡id
    const { data }: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      processId,
    );
    const myData = JSON.parse(JSON.parse(data.content)[0].data);
    this.myData.time = myData.event.time;
    this.myData.content = myData.event.content;
  }
  private mounted() {
    this.zMarquee();
  }
}
</script>
<style scoped lang="less">
.horse-lamp {
  height: 100%;
  // padding-bottom: 8px;
  box-sizing: border-box;
  color: #fff;
  .scrollItem {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    .scrollItemCont {
      position: absolute;
      white-space: nowrap;
      left: 736px;
      .announce-event {
        background: #000;
        border-radius: 3px;
        padding: 0px 5px;
        color: #ff5a00;
        font-size: 25px;
        margin-right: 10px;
      }
      .announce-cont {
        color: #fff;
        font-size: 22px;
      }
    }
  }
}
</style>
