<template>
  <div class="PDFBanner">
    <PicBanner :height="987" :pictures="pictures" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import PicBanner from '../../common/picBanner/picBanner.common.vue';
@Component({
  name: 'PDFBanner',
  components: {
    PicBanner,
  },
})
export default class PDFBanner extends Vue {
  @Prop() public pictures?: string[];
}
</script>

<style lang="less" scoped>
.PDFBanner {
  width: 990px;
  position: fixed;
  left: 39px;
  top: 76px;
  background-color: rgba(0, 5, 25, 0.85);
  box-shadow: inset 0px 0px 30px 10px #041d47;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 9;
}
</style>