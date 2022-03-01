<template>
    <div class="progress" @mousedown="down">
        <div class="progress_line" :style="{width:getBasicsData(value).currentWidth  + 'px'}">
            <div class="progress_line_point" ref="point"></div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
  /**
    *  进度条组件
    */
@Component({
    name : 'Progress',
})
export default class Progress extends Vue {
    /**
      * 总长度
      */
   @Prop({
        default: 0,
    }) public len?: number;

    /**
    *   进度数
     */

    @Prop({
        default: 0,
    }) public value?: number;

    private setTime: any = null;

    private getBasicsData(val: number = 0) {
        const pointDom =  (this.$refs as any).point;
        if (!pointDom) {return {}; }
        const progressDom = pointDom.parentNode;
        const progressBoxDox = progressDom.parentNode;
        const totalMileage = progressBoxDox.clientWidth;
        const step = (totalMileage / (this.len || 0 ));
        const len = this.len || 0;
        const value = this.value || 1;
        const currentWidth = (value < len ? val : len) * step - pointDom.clientWidth / 2;
        return {
            pointDom,
            progressDom,
            progressBoxDox,
            totalMileage,
            len,
            step,
            value,
            pointWidth: pointDom.clientWidth,
            currentWidth,
        };
    }

    private down(e: any) {
        const {progressDom, progressBoxDox, pointDom, step = 0} = this.getBasicsData();
        if (e.target !== pointDom ) {
            this.$emit('input', e.offsetX / step);
            progressBoxDox.onmousemove = null;
            e.target.onmouseup = null;
            progressBoxDox.onmousemove = (ev: any) => this.down(ev);
            e.target.onmouseup = () => {
                e.target.onmousemove = null;
                e.target.onmuseup = null;
            };
        }
    }
}
</script>

<style lang="less" scoped>
.progress{
    border-radius:15px;
    height: 5px;
    background: rgba(57, 141, 255, 0.3);
    cursor:pointer;
    &_line{
        position: relative;
        border-radius:15px;
        height:100%;
        width:0;
        background:blue;
        &_point{
            width: 15px;
            height: 15px;
            border-radius: 50%;
            position: absolute;
            right: -15px;
            cursor: pointer;
            top: -5px;
            display: flex;
            align-items: center;
            justify-content: center;
            background:red;
        }
    }
}
</style>