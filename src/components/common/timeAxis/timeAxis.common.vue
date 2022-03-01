<template>
    <div class="timeAxis">
        <div>
            <div class="timeAxis_times">
                <span>{{startTime}}</span>
                <span>{{endTime}}</span>
            </div>
            <c-progress class="timeAxis_progress" v-model="progress" :len="getLength"/>
            <div class="timeAxis_operation">
                <div>
                    <span>{{getCurrentTime}}</span>
                    <span>{{speed}}.0x</span>
                </div>
                <div class="timeAxis_operation_list">
                    <div @click="changeSpeed(false)" class="back" title="减速"></div>
                    <div @click="stop" class="play"  title="播放" ></div>
                    <div @click="play"  class="stop"  title="暂停"></div>
                    <div @click="changeSpeed(true)"class="foeward" title="加速"></div>
                </div>
            </div>
        </div>
        <div class="timeAxis_impactAnalysis">影响分析</div>
    </div>
</template>

<script  lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import CProgress from '@/components/common/progress/progress.common.vue';

   /**
    *  时间轴组件
    */
@Component({
    name : 'TimeAxis',
    components: {
        CProgress,
    },
})
export default class TimeAxis extends Vue {
    /**
     *  开始时间 是一个时间格式的字符串
     */
    @Prop() public startTime?: string ;
    /**
     *  结束时间 是一个时间格式的字符串
     */
    @Prop() public endTime?: string ;

    /**
     *  最高的播放速度 默认最高八倍
     */
     @Prop({default: 8}) public maxSpeed?: number;

    // 当前进度
    private progress = 0;

    // 当前播放速度
    private speed = 1;

    // 时间控制器
    private setInter: any = null;

    private getTotalLength() {
         const {startTime, endTime} = this.getProgressData();
         return (+new Date(endTime || 0) - +new Date(startTime || 0)) / 1000;
    }

    get getLength() {
        return this.getTotalLength();
    }
    get getCurrentTime() {
        const {startTime} = this.getProgressData();
        return new Date((+new Date(startTime) + this.progress * 1000)).toLocaleString();
    }

    // 播放
    private play() {
        this.$emit('progress', this.getProgressData());
        this.$emit('play', this.getProgressData());
        this.run();
    }

    // 暂停
    private stop() {
        clearInterval(this.setInter);
        this.$emit('progress', this.getProgressData());
        this.$emit('stop', this.getProgressData());
    }

    // 运行
    private run() { // 好像没有使用
        this.setInter = setInterval(() => {
            this.progress++;
            this.$emit('progress', this.getProgressData());
        }, 1000 / this.speed);
    }

    // 改变播放速度
    private changeSpeed(bool: boolean) {
        bool ? this.speed++ : this.speed--;
        this.speed = this.speed <= 1 ? 1 : this.speed >= (this.maxSpeed || 8 ) ? (this.maxSpeed || 8 ) : this.speed;
    }

    // 返回进度数据
    private getProgressData() {
        return {
            startTime: this.startTime || 0,
            endTime: this.endTime || 0,
            maxSpeed: this.maxSpeed || 8,
            currentTime: new Date((+new Date(this.startTime || 0) + this.progress * 1000)).toLocaleString(),
            speed: this.speed,
        };
    }

}
</script>

<style lang="less" scoped>
@predictionWaterlogging: '../../../assets/img/predictionWaterlogging';
.timeAxis{
    padding:20px;
    background-image:url('@{predictionWaterlogging}/progressBg.png');
    background-size: 100% 100%;
    display:flex;
    justify-content:space-between;
    align-items:center;
    &_times{
        display:flex;
        justify-content:space-between;
        >span{
            color: #1d7a96;
            font-size:16px;
        }
    }
    &_progress{
        margin:10px 0;
    }
    &_impactAnalysis{
        margin:0 30px 0 0;
        cursor:pointer;
        flex-shrink: 0;
        background-image:url("@{predictionWaterlogging}/btn.png");
        padding: 15px;
        background-size: 100% 100%;
        width: 134px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size:12px;
    }
}

.timeAxis_operation{
    display:flex;
    overflow:hidden;
    flex-wrap: wrap;
    justify-content: center;
     >div>span{
         font-size:18px;
         color: #00e6ff;
         margin-right:30px;
     }
    &_list{
        display:flex;
        flex-grow:1;
        justify-content: center;
        >div{
            margin-left:10px;
            cursor:pointer;
            display:flex;
            justify-content:center;
            align-items:center;
            width:45px;
            height:45px;
            background-size: 60px;
            background-position: center;
            &.back{
                background-image:url("@{predictionWaterlogging}/backOff.png")
            }
            &.foeward{
                background-image:url("@{predictionWaterlogging}/fastForward.png")
            }
            &.stop{
                background-image:url("@{predictionWaterlogging}/stopVideo.png")
            }
            &.play{
                background-image:url("@{predictionWaterlogging}/playVideo.png")
            }
        }
    }
}
</style>
