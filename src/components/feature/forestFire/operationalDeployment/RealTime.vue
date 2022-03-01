<template>
  <div class="real-box" id="realTimeBox">
    <div class="titles">
      <span>实时监测</span>
      <div class="btn">
        <!-- 最小化显示 -->
        <i class="close-real" @click="closereal"></i>
      </div>
    </div>
    <div class="content">
      <iframe
        :src="urlreal"
        id="cssss"
        style="width: 100%; height: 100%"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowfullscreen="true"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
      ></iframe>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import publishObjectPath from '@/util/configRegistry';
@Component({
  name: 'RealTime',
  components: {},
})
export default class RealTime extends Vue {
  private urlreal: any = '';
  private closereal() {
    this.messsageBus.emit( 'closerealForParent', false);
  }
  private created() {
    const ids: string = this.$store.state.realTimeUrlModule.getDataForreal.id;
    const infoUrl = publishObjectPath.value.industyMonitorInfo;
    this.urlreal =
      infoUrl + `?id=${ids}&token=Bf4qZg7UnV7h4OWgHEj7hA8Gc7ACyarPfztWXg44h8g3WMSUvS07M5WSMBafTEMlExHQ7WuT7kVpQpwfCVpXLQeWW69vWeIzg9q3NfuhvXyKY4lOv2wteAf0VjJqcmLRidUfJZz8y7udJqTgkClpsvDILNGgwCGRCIWkMDZ5hEPvD7zbephYCggjo24MSeODaIgbkBAce2ma6TyTSutLCutNFMbS1tLr5Lq2nYtra1W19iWjSkgwpim0s4IDQzpzhgAPPw9rQzK2o6fwUI3VODLYVGvQ8JCQJgXN7mkvpC1ssYT`;
  }
  private mounted() {
    const eMapPanelDrag: any = new Drag( '#realTimeBox', '.titles', {
      container: '.layoutMain',
    });
    eMapPanelDrag.toDrag();
  }
  private beforeDestroy() {
    this.$store.commit( 'realTimeUrlModule/SET_GETDATAFORREAL', {});
  }
}
</script>
<style lang="less" scoped>
@url: "~@/assets/img/gisModule/PopulationFeverBox";
.real-box {
  width: 1137.38px;
  height: 640px;
  position: absolute;
  left: 400px;
  top: 178px;
  z-index: 316;
  background: url("@{url}/video_bg.png") no-repeat;
  background-size: 100% 100%;
  .btn {
    position: absolute;
    display: flex;
    top: -8px;
    right: -15px;
    height: 47px;
    width: 175px;

    .close-real {
      position: absolute;
      right: 1px;
      top: -3px;
      width: 57px;
      height: 47px;
      cursor: pointer;
      background: url("@{url}/menu_magnify_bg_active_03.png") no-repeat center /
        100% 100%;
      &:hover {
        background: url("@{url}/menu_shrink_active_03.png") no-repeat center /
          100% 100%;
      }
    }
  }
  .titles {
    position: relative;
    padding: 0px 40px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-weight: 600;
    height: 70px;
    box-sizing: border-box;
    span {
      display: block;
      width: 340px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;
    }
  }
  .content {
    height: calc(100% - 103px);
    padding: 15px;
  }
}
</style>
