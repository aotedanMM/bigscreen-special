<template>
  <div class="internetIntelligence">
    <div id="huichuanimg-del" class="huichuanimg-del" @click="closeEvent(true)">×</div>
    <PicBanner :height="680" :pictures="pictures" v-if=" pictures !== undefined"/>
        <div class="nodata"  v-else>
          <img src="../../../../assets/img/default/panel/noData.png" alt srcset />
        </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import PicBanner from '../../common/picBanner/picBanner.common.vue';

@Component({
  name: 'InternetIntelligence',
  components: {
    PicBanner,
  },
})

export default class InternetIntelligence extends Vue {
  @Prop() public pictures?: string[];
  private closeEvent(isClose: boolean = false) {
    this.messsageBus.emit('internetEvent', {isShow: false});
    this.messsageBus.emit('ToolCompared', 'internetIntelligence', isClose);
    this.messsageBus.emit('ToolCompared', 'returnImage', isClose);
  }
}
</script>


<style lang="less" scoped>
@path: '../../../../assets/img/gisModule/districtDialog'; // 定义路径
.internetIntelligence{
  position: absolute;
  top: 161px;
  left: 24%;
  width: 955px;
  overflow: hidden;
  z-index: 9;
  .huichuanimg-del {
    width: 30px;
    height: 30px;
    position: absolute;
    color: #22cae1;
    font-size: 40px;
    right: 0px;
    top: -1%;
    text-align: center;
    cursor: pointer;
    z-index: 10;
  }
  .nodata{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 680px;
    background: url('@{path}/returnimg_zwbg.png') no-repeat 0 -10px;
    background-size: 100% 100%;
    box-sizing: border-box;
  }
}
</style>
