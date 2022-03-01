<template>
    <p class="timeBlock-p">
        <span>事故已发生</span>
        <span class="timeBlockNum">
            <span class="timestrNum" title="00">{{hours}}</span><i>小时</i>
            <span class="timestrNum" title="11">{{minutes}}</span><i>分</i>
            <span class="timestrNum" title="50">{{seconds}}</span><i>秒</i>
        </span>
    </p>
</template>

<script lang="ts">
import { Component, Vue , Prop } from 'vue-property-decorator';
/**
  * 事发时间组件*/
@Component({
    name : 'EventTime',
})
export default class EventTime extends Vue {
    /**
      * 事发时间，类型为时间对象
      */
    @Prop() public date = new Date()  ;
    public setCouter: any = false;
    public hours = '';
    public minutes = '';
    public seconds = '';
    public created() {
    this.init();
    }
    public beforeDestroy() {
      clearInterval(this.setCouter);
    }

    private startTime() {
    this.setCouter = setInterval(this.init, 1000);
    }
    private init() {
        const shareTime  = new Date().getTime() - new Date(this.date).getTime() ;
        const share  = new Date(shareTime);
        const data = share.getDate();
        const hours: any   = share.getHours();
        const minutes: any   = share.getMinutes();
        const seconds: any   = share.getSeconds();
        // this.hours = data * 24  + hours ;
        this.minutes = minutes ;
        this.seconds = seconds ;
        if (!this.setCouter) {
            this.startTime();
        }
    }
}
</script>
<style scoped>
.timeBlock-p span{color: #fff}
</style>
