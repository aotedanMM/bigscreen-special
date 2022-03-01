<template>
    <div>
        <div class="precipitationName">降水预报图</div>
        <div class="timeSteps">
            <i :class="isPlay?'openBtn': 'closeBtn' " @click="playFn"></i>
            <ul>
                <li v-for="(item,index) in timeSteps" :key="index" :class="item.checked? 'active': ''">
                    <i @click="nextFn(item)" :class="item.checked? 'activei': ''"></i>
                    <span @click="nextFn(item)">{{item.value}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
    name: 'TimeAxis',
})
export default class TimeAxis extends Vue {
        private isPlay: boolean = false;
        private active: any = '';
        private activei: any = '';
        private autoPlay: any = '';
        private timeSteps: any = [
            { id: '0', value: '24h', checked: true },
            { id: '1', value: '48h', checked: false },
            { id: '2', value: '72h', checked: false },
        ];
    public getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('rainForecast');
        return component;
    }
        // 点击开始/关闭按钮
        private playFn() {
            this.isPlay = !this.isPlay;
            if (this.isPlay === true) {
                this.autoPlayFn();
            } else {
                clearInterval(this.autoPlay);
            }

        }
        private autoPlayFn() {
            let index = 0;
            this.autoPlay = setInterval(() => {
                if (this.timeSteps[1].checked === true && this.timeSteps[2].checked === true) {
                    this.timeSteps[1].checked = false;
                    this.timeSteps[2].checked = false;
                } else {
                    index ++;
                    if (index > 2) {
                        index = 0;
                    }
                    this.timeSteps[index].checked = true;
                    this.getComponent().load(index);
                }
            }, 2000);
        }

        private nextFn(item: any) {
            item.checked = true;
            if (item.value === '48h' && item.checked === true) {
                this.getComponent().load(1);
                this.timeSteps[2].checked = false;
            } else if (item.value === '24h' && item.checked === true) {
                this.timeSteps[2].checked = false;
                this.timeSteps[1].checked = false;
                this.getComponent().load(0);
            } else if (item.value === '72h') {
                this.getComponent().load(2);
            }
        }
        private created(): void {
            this.getComponent().load(0);
        }
        private beforeDestroy(): void {
            clearInterval(this.autoPlay);
            this.getComponent().unload();
        }
    }
</script>
<style scoped lang="less">
    .precipitationName{
        height: 100px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 30px;
        bottom: 14%;
        z-index: 9999;
        font-size: 40px;
        line-height: 100px;
        color: #fff6b0;
        text-align: center;
    }
    .timeSteps{
        position: absolute;
        left: 300px;
        bottom: 14%;
        z-index: 99999;
        width: 62%;
        height: 78px;
        background: rgba(55, 79, 125, .8);
        display: flex;
        .closeBtn{
            display: inline-block;
            width: 65px;
            height: 67px;
            background: url("../../../assets/img/weather/autoplayclose.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
        }
        .openBtn{
            display: inline-block;
            width: 65px;
            height: 67px;
            background: url("../../../assets/img/weather/autoplayopen.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
        }
        ul{
            display: flex;
            width: 85% ;
            margin: 15px 0 0 30px;
            li{
                width: 48%;
                background: #ffffff;
                height: 8px;
                position: relative;
                i{
                    display: inline-block;
                    width: 17px;
                    height: 17px;
                    background: #3498db;
                    border-radius: 50%;
                    position: absolute;
                    right: -1px;
                    top: -4px;
                    cursor: pointer;
                }
                span{
                    position: absolute;
                    top: 27px;
                    right: 0;
                    color: #ffffff;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
            .active{
                background: #3498db;
            }
            .activei{
                background: #ffffff;
                transform: translateX(-6px);
            }
            li:nth-of-type(1){
                width: 2%;
            }
        }
    }
</style>
