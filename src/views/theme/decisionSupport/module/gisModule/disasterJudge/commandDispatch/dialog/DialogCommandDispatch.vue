<template>
  <div class="dialogCommandDispatch" v-if="isShowDialogCommandDispatch">
    <span class="dialogCommandDispatch_close" @click="close()"></span>
    <div v-if="currentObj.type === 'mp4'"  style="width:100%;height:100%;">
      <!-- <Vedio :url="currentObj.url" /> -->
      <video :src="currentObj.url"  controls="controls" style="width:100%;height:100%;"></video>
    </div>
    <div v-else-if="currentObj.type === 'jpg'" class="showMiddle">
        <img :src="currentObj.url" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Vedio from '@/components/feature/vedio/Vedio.common.vue';
@Component({
  name: 'DialogCommandDispatch',
  components: {
    Vedio,
  },
})
export default class DialogCommandDispatch extends Vue {
  private isShowDialogCommandDispatch: boolean = false;
  private currentObj: any;
  private close() {
    this.isShowDialogCommandDispatch = false;
  }
  private open() {
    this.isShowDialogCommandDispatch = true;
  }

  private created() {
    this.messsageBus.on('openDialog', (data: any) => {
      this.open();
      this.currentObj = data;
    });
    this.messsageBus.on('closeDialog', (data: any) => {
      this.close();
      this.currentObj = data;
    });
  }
}
</script>
<style lang="less" scoped>
.dialogCommandDispatch {
  z-index: 5;
  position: absolute;
  left: 40px;
  top: 70px;
  right: 40px;
  background: rgba(0, 0, 0, 0.8);
  bottom: 75px;

  background: rgba(0, 0, 0, 0.8);
  &_close {
    color: #fff;
    font-size: 26px;
    top: -40px;
    right: 0;
    position: absolute;
    width: 36px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    text-align: center;
    &::after {
      content: '\2716';
      display: inline-block;
    }
  }
  .showMiddle{
    width:100%;
    height: 100%;
    margin:0 auto;
    display: -webkit-box;
    display:-moz-box;
    display: flex;
    -webkit-box-align:center;
    -moz-box-align:center;
    box-align:center;
    -webkit-box-pack:center;
    -moz-box-pack:center;
    box-pack:center;
  }
  .showMiddle img{
    display: inline-block;
    width: 100%;
    max-height: 800px;
  }
}
</style>