<template>
  <div class="container" v-if="panelShow">
      <div class="closedContainer" @click.stop="closeThisPanel"><span class="el-icon-close"></span></div>
      <iframe ref="curIframe" class="iframeContainer" :src="curPdfSrc" frameborder="0"></iframe>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class PdfPanel extends Vue {
// ./word/powerCase.pdf
    @Prop({default: './word/powerCase.pdf'}) public pdfSrc!: string ;
    private get curPdfSrc() {
        return this.pdfSrc;
    }
    private panelShow = true;
    private closeThisPanel() {
        this.panelShow = false;
        this.destroyIframe();
    }

    private destroyIframe() {
       const iframeEl = this.$refs.curIframe as HTMLIFrameElement;
       const iframe: any = iframeEl.contentWindow;

       iframeEl.src = 'about:blank';
       try {
           iframe.document.write('');
           iframe.document.clear();
       } catch (error) {
           document.body.removeChild(iframeEl);
       }

       this.$store.dispatch('changeDisposalPdfPanel', {
            stateFlag: 'hide',
            pdfSrc: '',
        });
    }

    private destroyed() {
        this.closeThisPanel();
    }
}
</script>
<style scoped lang="less">

.container{
    height: 100%;
    position: relative;

    .closedContainer{
        position: absolute;
        right: 27px;
        top:15px;
        // width: 26px;
        z-index: 10;
        cursor: pointer;

        &:hover{
            color: #bdebef;
        }
    }

    .iframeContainer{
        height: 100%;
        width: 100%;
    }
}

</style>