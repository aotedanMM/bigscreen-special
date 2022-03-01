<!-- 天眼监测 影像对比 地形地貌 通用iframe -->
<template>
    <div class="secondary-skySystem-new-shouye">
        <span class="close-secondary-skySystem" @click="close(true)"></span>
        <iframe :src="iframeSrc" :style="styleObj" ></iframe>
        
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'PanelIframe',
  components: {},
})
export default class PanelIframe extends Vue {
    @Prop() public iframeSrc!: string;
    @Prop() public styleObj?: string;
    private close(isClose: boolean = false) {
        this.$emit('panelIframeShowEmit', false);
    }
}
</script>
<style lang="less" scoped>
@url: '../../../assets/img/halfScreen/eventAndTopics';
    .secondary-skySystem-new-shouye {
        left: 0px;
        top: 0px;
        /* right: 14px; */
        /* bottom: 66px; */
        overflow: hidden;
        position: absolute;
        width: 1920px;
        height: 1080px;
        background:url(../../../assets/img/iframeKuan/bg.png) no-repeat;
        z-index:99;
        // padding-top:24px;
        .close-secondary-skySystem {
                position: absolute;
                color: #FFF;
                top: 50PX;
                right: 80px;
                width: 90px;
                height: 48px;
                line-height: 50px;
                background: url('@{url}/eventAndTopics_close.png') no-repeat 0 0;
                cursor: pointer;
                &:hover{
                    background-image: url('@{url}/eventAndTopics_close_h.png');
                }
                // &>span{
                //     display: block;
                // font-size: 22px;

                // text-align: center;
                //     -webkit-transform: scale(1.2, 1) translate(0,-3px);
                //     transform: scale(1.25, 1) translate(0,-3px);

                // }
        }
        iframe{
            width: 1645px;
            height: 863px;
            /* padding: 24px 0 0 0; */
            box-sizing: border-box;
            border: none;
            position: absolute;
            top: 110px;
            left: 139px;
        }
    }
</style>
