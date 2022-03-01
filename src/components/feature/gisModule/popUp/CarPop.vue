<template>
<!-- :style = "{marginTop: -popHeight + 'px'}" -->
    <div class="eventInfoPop expert" >
        <input id="eventPopdata" type="hidden" :value="data" />
        <div class="eventInfoPop_title">
            <div class="eventInfoPop_title_txt" :title="name">{{ name }}</div>
            <div class="eventInfoPop_title_close" @click="closeThisPanel"></div>
        </div>
        <div class="eventInfoPop_content">
            <ul>
                <el-scrollbar wrap-style="height:100%;max-height: 350px;">
                    <li
                            class=""
                            v-for="item of dataFilter"
                            :key="item"
                    >
                        <span>{{ labelObj[item] }}：</span>
                                    <span :title="list[item] + unitObj[item]">{{list[item]}} {{unitObj[item]}}</span>
                    </li>

                    <li>
                        <span>历史轨迹：</span>
                    </li>
                    <div class="lsgj-container">
                        <div class="operate-container">
                            <div v-if="carState!=='play'" class="play-btn info-icon-play" @click.stop="playCarPath(carPathArr,carState)">

                            </div>
                            <div v-if="carState==='play'" class="pause-btn info-icon-pause" @click.stop="pauseCarPath(carPathArr,carState)">

                            </div>
                            <div class="stop-btn info-icon-stop" @click.stop="finishCarPath(carPathArr,carState)">

                            </div>

                            <div class="tip-text">
                                {{carPathArr.length? carPathStartTime+'-'+carPathEndTime : '暂无历史轨迹'}}
                            </div>
                        </div>

                        <div class="progress-container">
                            <el-progress :show-text='true' :percentage="percentage" :format="progressFormat"></el-progress>
                        </div>
                        <div>
                            <!-- 时间暂未实现更新 -->
                           <!--  {{carPathStartTime1}} -->
                        </div>
                    </div>

                </el-scrollbar>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import { Draggable } from 'draggable-vue-directive';
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
import equipmentList from '@/components/feature/gisModule/popUp/equipmentList.vue';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';
@Component({
    name: 'CarPop',
    components: {
        equipmentList,
    },
    mixins: [popDataDeal],
    directives: {
        Draggable,
    },
})
export default class CarPop extends Vue {
    public name: any = '暂无标题';
    public styles: any = {};
    public popUpType: any;
    public list: any = {};
    public carPathArr: any = [];
    public carPathStartTime1 = ''; // -- 这个格式的
    public carPathStartTime = ''; // /这个格式
    public carPathEndTime = '';
    public carState = 'stop'; // play,stop,pause,
    public percentage = 0;
  public popHeight: any = 0;
    // 拖拽
    private draggableValue: any = {
        onPositionChange: this.onPosChanged,
    };

    private initEventListener() {
        this.getComponent().on('finish', () => {
            this.carState = 'stop';
        });
    }

    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component: any = factory.commonFactory.getComponent('historyTrack');
        return component;
    }


    private progressFormat(percentage: any) {
        return percentage = `${percentage}%`;
    }
    private onPosChanged(positionDiff: any, absolutePosition: any, event: any) {
        if (event.target.closest('[draggable-state]')) {
            event.target.closest('[draggable-state]').style.position = 'absolute';
        }
    }

    private closeThisPanel() {
        this.getComponent().unload();
        this.close();
    }
    private calcHeight() {
        this.popHeight = $('.eventInfoPop.expert').innerHeight();
        this.popHeight += 40;
    }
    private getCarPath() {
        const options = {
            //  gpsid: '11725040530',
            gpsId: this.list.gpsid,
            // starttime: '2019-11-11 11:52:00',
            startTime: this.$moment(this.list.time).subtract(5, 'hours').format('YYYY-MM-DD hh:mm:ss'),
            endTime: this.list.time,
        };
        installSearchReosurce.realTimeCar.getFireEnginesInfoHistory(options).then((data: any) => {
            this.carPathArr = data;
            this.carPathStartTime = this.$moment(data[data.length - 1].time).format('MM/DD hh:mm:ss');
            this.carPathStartTime1 = this.$moment(data[data.length - 1].time).format('YYYY-MM-DD hh:mm:ss');
            this.carPathEndTime =  this.$moment(data[0].time).format('MM/DD hh:mm:ss');

        }).catch((error) => {
            this.carPathArr = [];
        });

    }

    // flag是否暂停
    private  playCarPath(data: any, carState: string) {
        if (!this.carPathArr.length) {
            return ;
        }
        if (this.carState === 'stop') { // 从暂停状态开始
            this.getComponent().load(this.carPathArr);
        }
        // this.isPause = false;

        this.getComponent().play(this.carPathArr);
        this.carState = 'play';

        this.getComponent().on('carTrackMoveEvent', (res: any) => {
            this.percentage = Math.floor(res.per * 100);
        });
    }

    private finishCarPath(data: any) {
        if (!this.carPathArr.length) {
            return ;
        }
        this.getComponent().finish();
        this.carState = 'stop';
        this.percentage = 0;
    }

    private pauseCarPath(data: any) {
        if (!this.carPathArr.length) {
            return ;
        }

        this.getComponent().pause();
        this.carState = 'pause';
    }


    private  getData(data: any) {
        this.list = data;
        this.name = data[dataDeal[this.popUpType].name];
    }

    private mounted() {

        const that: any = this;
        that.popUpType = that.type;

        this.calcHeight();
        if (that.styleObj) {
            that.styles = that.styleObj;
        }


        if (dataDeal[that.popUpType]) {
            that.unitObj = dataDeal[that.popUpType].unitObj;
            that.dataFilter = dataDeal[that.popUpType].dataFilter;
            that.labelObj = dataDeal[that.popUpType].labelObj;
            dataDeal[that.popUpType].cb(that);
        }

        this.getCarPath();

        this.initEventListener();

    }
}
</script>
<style lang="less" scoped>
    @url: '../../../../assets/img/eventInfo';
    @dispathImg: '../../../../assets/img/CommandDispatch';
    .eventInfoPop {
        cursor: default !important;
        width: 410px;
        // max-width: 480px;
        filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
        background: rgba(7, 25, 65, 0.8);
        border-radius: 1px;
        box-shadow: 0 0 15px #071941;
        color: #fff;
        // position: absolute;
        // bottom: 0;
        // left: 0;
        margin-bottom: 50px;
        // margin-left: -205px;
        padding-bottom: 10px;
        z-index: 1;
        &_title {
            background: url('@{url}/title.png') no-repeat center / 100% 100%;
            height: 60px;
            line-height: 65px;
            display: flex;
            align-items: center;
            font-size: 28px;
            color: #fff;
            &::before {
                content: '';
                width: 54px;
                height: 54px;
                background: url('@{url}/dotdefault.png') no-repeat center / 100% 100%;
                flex-shrink: 0;
            }
            &_close {
                background: url('@{url}/maptooltipclose.png') no-repeat center / 100% 100%;
                width: 15px;
                height: 14px;
                cursor: pointer;
                flex-shrink: 0;
                position: absolute;
                right: 20px;
            }
            &_txt {
                color: #fff;
                display: inline-block;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 24px;
                white-space: nowrap;
                width: 300px;
                font-weight: normal;
                height: 55px;
                line-height: 55px;
            }
        }
        &_content {
            padding: 0 15px 15px 15px;
            ul {
                position: relative;
                max-height: 350px;
                li {
                    font-size: 28px;
                    width: 92%;
                    margin-top: 10px;
                    line-height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    // span {
                    //   white-space: nowrap;
                    //   text-align: left;
                    //   display: inline-block;
                    // }
                    span:first-child {
                        color: #0EDBE4;
                    }
                    .pathPlanning,
                    .aroundAnalysis {
                        display: block;
                        float: right;
                        border: solid 1px #02e9d5;
                        color: white!important;
                        padding: 0 5px;
                        margin-left: 10px;
                        margin-top: 10px;
                        font-size: 28px;
                        line-height: 40px;
                        cursor: pointer;
                    }
                }
            }
        }

        .lsgj-container{
            background: rgba(4,58,99,.9);
            max-height: 130px;

            .operate-container{
                display: flex;

                .tip-text{
                    font-size: 20px;
                    max-width: 310px;
                    height: 34px;
                    line-height: 34px;
                    background: rgba(3,39,82,.9);
                    border-radius: 5px;
                    padding: 0 5px;
                    text-align: center;
                    color: #fff;
                    font-weight: bolder;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }


            .info-icon-play{
                width:34px;
                height:34px;
                background: url('@{dispathImg}/carplaybg.png') no-repeat center center;
                cursor: pointer;
                /*background-size: 100%;*/
            }
            .info-icon-stop{
                width:34px;
                height:34px;
                background: url('@{dispathImg}/stopbg.png') no-repeat center center;
                cursor: pointer;
            }
            .info-icon-pause{
                width:34px;
                height:34px;
                background: url('@{dispathImg}/causebg.png') no-repeat center center;
                cursor: pointer;
            }
        }
        /deep/ .el-progress__text{
            color:#fff;
        }
        /deep/ .el-progress-bar{
            padding-right: 60px;
            margin-right:-59px;
        }
    }
</style>
<style lang="less" scoped>
    // /deep/ .el-scrollbar__wrap {
    //     margin-bottom: -33px !important;
    //     padding-bottom: 10px;
    // }
</style>
