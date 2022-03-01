<template>
  <!-- 图层图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <span class="subtext">{{currentTime}}</span>
      <ul>
        <li v-for="(item, index) in colorList" :key="index">
          <span :style="{ background: item.color }"></span>
          <span>{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'Traffic',
})
export default class Traffic extends Vue {
  private currentTime: string = '00:00';
  private timer: any = false;
  private colorList: any = [
    {
      color: '#630000',
      value: '严重拥堵',
    },
    {
      color: '#e41515',
      value: '拥堵',
    },
    {
      color: '#f2850d',
      value: '缓慢',
    },
    {
      color: '#7fbd09',
      value: '畅通',
    },
  ];
  private created(): void {
    this.timer = true;
    this.getDate();
  }

  private getDate() {
    const myDate = new Date();
    this.currentTime =
      myDate.getHours() +
      ':' +
      myDate
        .getMinutes()
        .toString()
        .padStart(2, '0');
    if (this.timer) {
      setTimeout(() => {
        this.getDate();
      }, 20000);
    }
  }
}
</script>

<style lang="less" scoped>
.legendLayerBox {
  .legend_color {
    height: 100%;
    width: 100%;
    .subtext {
      font-size: 22px;
      color: #bbd0dc;
    }
    ul {
      display: flex;
      flex-direction: column;
      margin: 10px 0 0 30px;
      li {
        display: flex;
        height: 40px;
        span {
          &:nth-child(1) {
            width: 20px;
          }
          &:nth-child(2) {
            font-size: 20px;
            margin-left: 15px;
          }
        }
      }
    }
  }
}
</style>
