<!-- 天眼监测 影像对比 地形地貌 通用iframe -->
<template>
    <!-- <div class="secondary-skySystem-new-shouye">
        <span class="close-secondary-skySystem" @click="close(true)"><span>X</span></span>
        <iframe :src="iframeSrc" :style="styleObj" ></iframe>
        
    </div> -->
    <PanelIframe
      @panelIframeShowEmit="close"
      :iframeSrc="iframeSrc"
      :styleObj="styleObj"
    ></PanelIframe>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import PanelIframe from '@/components/common/panel/PanelIframe.vue';
@Component({
  name: 'DayEye',
  components: {
    PanelIframe,
  },
})
export default class DayEye extends Vue {
    @Prop() public iframeSrc!: string;
    @Prop() public styleObj?: string;
    private close(isClose: boolean = false) {
        this.$emit('dayEyeShowEmit', false);
    }
}
</script>