<template>
    <div class="layoutAssist">
       <!-- <TreeAnimate></TreeAnimate> -->
       <!-- <GisPathAnalysis ref="showPathAnalysis"></GisPathAnalysis> -->
       <!-- <div @click="test" style="position:absolute;top: 100px;width: 100px;height: 100px; left: 100px;background-color:#fff;"></div> -->
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import TreeAnimate from '@/views/theme/decisionSupport/module/normalRight/TreeAnimate.vue';
// import GisPathAnalysis from '@/components/feature/GIS/GisPathAnalysis/GisPathAnalysis.vue';

@Component({
    name: 'LayoutAssist',
    components: {
        PanelView,
        TreeAnimate,
        // GisPathAnalysis,
    },
})
export default class LayoutAssist extends Vue  {

    // public test() {
    //     this.messsageBus.emit('Open_Router', {
    //         startPoint: [116.35, 39.83],
    //         endPoint: [117, 36.70],
    //         type: 1, // 判断打开哪个路径弹窗 0:直接打开大弹窗 1:打开小弹窗
    //     });
    // }
}
</script>
<style lang="less">
  @import url('../../../assets/css/theme.default.less');
</style>
<style lang="less" scoped>
    .layoutAssist{
        height:100%;
}
</style>