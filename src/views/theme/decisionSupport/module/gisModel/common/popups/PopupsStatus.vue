<template>
  <div :class="['popups', showPopups?'show':'']">
        <div class="close-btn" @click="closePopups">×</div>
        <div class="popups-title">房山区</div>
        <div class="popups-main">
            <div class="popups-main-title">未调配</div>
          <div class="popups-item">救灾帐篷(件)：666</div>
        </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
@Component({})
export default class Popups extends Vue {
    @Prop({default: false}) private showPopups!: boolean;
    private closePopups() {
        this.showPopups = false;
    }
}
</script>

<style lang="less" scoped>
.popups {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 0 10px;
    background-color: rgba(0, 110, 255, 0.404);
    z-index: 20;
    transition: all .3s;
    visibility: hidden;
    opacity: 0;
    &.show {
        visibility: visible;
        opacity: 1;
    }
    .close-btn {
        position: absolute;
        top: 0;
        right: 3px;
        padding: 3px;
        color: #fff;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
    }
    .popups-title {
        font-size: 14px;
        color: #4abdc9;
    }
    .popups-main {
    font-size: 14px;
    color: #4abdc9;
    }
}
</style>