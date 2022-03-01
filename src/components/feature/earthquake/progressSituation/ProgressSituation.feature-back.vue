<template>
    <div class="progressSituationWrap">
        <div class="right" v-if="listDatas.length">
            <div class="right_item" @click="firstDatasFn(firstDatas)">
                <div class="titleWrap">
                    <div class="titleClass">{{processType(firstDatas.type)}}</div>
                    <div class="timeClass">{{firstDatas.progressTime}}</div>
                </div>
                <div class="decClass">{{firstDatas.sendDept || ''}}</div>
                <el-scrollbar class="cmp-scrollbar-y" style="height:46%;">
                    <div class="contClass">{{firstDatas.progressCont}}</div>
                </el-scrollbar>
            </div>

            <div class="bottomContainer" @mouseover="scollAreaOver" @mouseout="scollAreaOut">
                <div class="right_bottom_wrap" ref="right_bottom_wrap" :class="{anim:animate==true}">
                    <div
                            class="right_item right_list"
                            ref="right_list"
                            v-for="(item,index) in listDatas"
                            :key="index"
                            @click="listDatasFn(item)"
                    >
                        <div class="titleWrap">
                            <div class="titleClass" :class="item.typeBg">{{processType(item.type)}}</div>
                            <div class="timeClass">{{item.progressTime}}</div>
                        </div>
                        <div class="contClass" @click="openFn">
                            <span>({{item.sendDept || ''}})</span>
                            <span>{{item.progressCont}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
    import { progressSituationServer } from '@/api/installServer.ts';
    import Socketcomponents from '@/util/Socketcomponents';
    @Component({
        name: 'ProgressSituation',
    })
    export default class ProgressSituation extends Vue {
        @Prop({ default: () => [] }) public listDatas!: any;
        @Prop({ default: () => [] }) public firstDatas!: any;

        //   private showCont: boolean = false;
        //   private firstDatas?: object;
        //   private listDatas?: any;
        private animate?: boolean = false;
        private timerLoop?: any;
        private timerSet?: any;
        private listData: any = '';
        private colorConfig?: any = {
            救援进展: 'green',
            处置建议: 'blue1',
            灾情上报: 'blue2',
            领导批示: 'red',
            灾情评估: 'blue3',
        };
        private isPushBol: boolean = true;
        @Watch('listDatas', { deep: true })
        private onChange(val: any) {
            if (this.isPushBol) {
                this.watchMsg(val);
            }
        }

        private processType( type: string ) {
            switch (type) {
                case '0' :
                    return '领导批示';
                case '1' :
                    return '救援进展';
                case '2' :
                    return '灾情上报';
                case '3' :
                    return '处置建议';
                case '4' :
                    return '灾情评估';
            }
        }

        private scroll() {
            if (this.listDatas.length < 2) {
                return;
            }
            const tempUl: any = this.$refs.right_bottom_wrap;
            const liHeight: any = (this.$refs as any).right_list[0].offsetHeight;
            tempUl.style.marginTop = `-${liHeight}px`;
            if (this.isPushBol) {
                this.listDatas.push(this.listDatas[0]);
            }
            this.animate = true;
            clearInterval(this.timerSet);
            this.timerSet = setTimeout(() => {
                // this.listDatas.push(this.listDatas[0]);
                this.listDatas.shift();
                tempUl.style.marginTop = '0px';
                this.animate = false;
            }, 1900);
        }
        private scollAreaOver() {
            clearInterval(this.timerSet);
            clearInterval(this.timerLoop);
            this.isPushBol = false;
        }
        private scollAreaOut() {
            this.isPushBol = true;
            this.timerLoop = setInterval(this.scroll, 2000);
        }
        private watchMsg(opt: any) {
            if (opt.length) {
                // this.showCont = true;
                clearInterval(this.timerLoop);
                this.timerLoop = setInterval(this.scroll, 2000);
            } else {
                // this.showCont = false;
            }
        }
        private getTimeFormat() {
            const curDay = new Date();
            const year = curDay.getFullYear();
            // const month = (curDay.getMonth() + 1+'').padStart(2, '0');
            // const day = (curDay.getDate()+'').padStart(2, '0');
            // const hour = (curDay.getHours()+'').padStart(2, '0');
            // const minute = (curDay.getMinutes()+'').padStart(2, '0');
            // const second = (curDay.getSeconds() +'').padStart(2, '0');
            const month = curDay.getMonth() + 1 + '';
            const day = curDay.getDate() + '';
            const hour = curDay.getHours() + '';
            const minute = curDay.getMinutes() + '';
            const second = curDay.getSeconds() + '';
            const dealDay = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            return dealDay;
        }
        private updateDatas(res: string) {
            const temp = JSON.parse(res);
            const tempTime = this.getTimeFormat();
            const obj = {
                type: temp.msgKind,
                time: tempTime,
                typeBg: this.colorConfig[temp.msgKind],
                dec: temp.dec,
                cont: temp.content,
            };
            this.listDatas.unshift(obj);
            this.firstDatas = this.listDatas[0];
        }
        private created() {
            try {
                Socketcomponents.theProgress((res: any) => {
                    this.updateDatas(res);
                });
                Socketcomponents.leaderInstruction((res: any) => {
                    this.updateDatas(res);
                });
                Socketcomponents.disposalAdvice((res: any) => {
                    this.updateDatas(res);
                });
            } catch (e) {
                // console.error(e);
            }
        }
        private mounted() {
            if (this.listDatas && this.isPushBol) {
                this.scroll();
            }
        }

        // 打开详情弹框
        private openFn() {
            // this.$store.commit('updateShowProgressSituationDetail', true);
        }
        private firstDatasFn(data: any) {
            this.messsageBus.emit('firstDatas', data);
        }
        private listDatasFn(item: any) {
            this.messsageBus.emit('listDatas', item);
        }
        private destroyed() {
            clearInterval(this.timerSet);
            clearInterval(this.timerLoop);
        }
    }
</script>

<style scoped lang="less">
    .progressSituationWrap {
        width: 100%;
        height: 100%;
        box-sizing:border-box;
        padding:0 5px;
        .right {
            width: 100%;
            height: 100%;
            background: url('../../../../assets/img/progressSituation/shouyeshuxian.png')
            13px 10px no-repeat;
            background-size: 2px 100%;
            font-size: 24px;
            position: relative;

            .bottomContainer {
                width: 100%;
                height: calc(100% - 165px);
                overflow: hidden;
                cursor: pointer;
            }
            .bottomContainer{
                .right_list{
                    .titleWrap {
                        .titleClass {
                            background:#278817;
                            color: #fff;
                        }
                        .spanColor3.titleClass{
                            background: #0ceff5;
                            color: #fff;
                        }
                    }
                }

            }
            .right_item {
                position: relative;
                height: 149px;
                background: url('../../../../assets/img/progressSituation/newYellow.png')
                left top no-repeat;
                background-size: 100% 100%;
                padding-left: 30px;
                margin-bottom: 8px;
                overflow: hidden;
                .titleWrap {
                    box-sizing: border-box;
                    padding: 2px 10px 2px 0px;
                    display: flex;

                    .titleClass {
                        height: 42px;
                        line-height: 42px;
                        padding: 0 10px;
                        border-radius: 7px;
                        background: #fffd38;
                        color: #000;
                    }

                    .blue1 {
                        background: #0ceff5;
                        color: #fff;
                    }

                    .blue2 {
                        background: #03499c;
                        color: #fff;
                    }

                    .blue3 {
                        background: #0c9eff;
                        color: #fff;
                    }

                    .red {
                        background: rgba(219, 13, 13);
                        color: #fff;
                    }

                    .green {
                        background: rgba(1, 246, 246, 0.7);
                        color: #fff;
                    }

                    .timeClass {
                        line-height: 42px;
                        margin-left: 20px;
                        color: #adefff;
                    }
                }

                .decClass {
                    box-sizing: border-box;
                    // padding: 0 20px;
                    color: #00ffed;
                }

                .contClass {
                    box-sizing: border-box;
                    // padding: 0 20px;
                    height: 100%;
                    color: #fff;

                    span:first-of-type {
                        color: #00ffed;
                    }
                }
            }

            .right_item:after {
                content: '';
                position: absolute;
                left: 0px;
                top: -1px;
                width: 30px;
                height: 30px;
                background: url('../../../../assets/img/progressSituation/shan.gif') left
                top no-repeat;
                background-size:100% 100%;
            }

            .right_list {
                height: auto;
                background: none;
                &:first-of-type{
                    .titleWrap{
                        .titleClass{
                            background:#278817;
                            color: #fff;
                        }
                    }
                }
            }

            .right_list:after {
                content: '';
                position: absolute;
                left: 0px;
                top: 0px;
                width: 30px;
                height: 30px;
                background: url('../../../../assets/img/progressSituation/newthing.gif')
                left top no-repeat;
                background-size:100% 100%;
            }

            .anim {
                transition: all 2s;
            }
        }

        // .noDataClass {
        //   width: 100%;
        //   text-align: center;
        //   font-size: 28px;
        //   color: #bdebef;
        //   padding-top: 26%;
        // }
    }
</style>
