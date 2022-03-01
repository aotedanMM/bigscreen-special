<template>
    <el-dialog :visible="visible"  width="50%" @close='toggleDialog'>
        <iframe
            :src="pdfUrl"
            type="application/x-google-chrome-pdf"
            width="100%"
            height="500px" />
    </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch , Emit } from 'vue-property-decorator';

@Component({
    name : 'PdfPreview',
})
export default class PdfPreview extends Vue {
  @Prop() private pdfUrl: any;
  private visible: boolean = true;

  public toggleDialog() {
    this.visible = false;
  }
}
</script>
<style scoped lang="less">
    .pdfPreviewWrap {
        width: 100%;
        height: 100%;
    }
</style>