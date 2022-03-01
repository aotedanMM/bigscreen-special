<template lang="">
    <div class="imgBox">
      <i class="el-icon-close close" @click="closeImg"></i>
      <img src="../../../../../assets/img/unNormal/helpPower_img.png" />
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'SuggestPop',
})
export default class SuggestPop extends Vue {
    private closeImg() {
        this.messsageBus.emit('dealSuggest', false);
    }
}
</script>
<style lang="less" scoped>
    .imgBox::-webkit-scrollbar {
        width: 0;
    }
    .imgBox {
        position: absolute;
        right:10px;
        left: 0;
        top: 20px;
        bottom:20px;
        background: #fff;
        text-align: center;
        overflow: auto;
        z-index: 1;
        img {
            display: inline-block;
            padding: 60px 30px 0;
            width: 100%;
            box-sizing: border-box;
        }
        .close {
            font-size: 50px;
            cursor: pointer;
            position: fixed;
            top: 110px;
            right:13px;
            color: rgb(75, 75, 75);
        }
        .close:hover{
            color: #000;
        }
    }
</style>