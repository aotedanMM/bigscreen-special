<!--防御准备下船舶进港容器组件-->
<template>
<div>
                  <div class="tempRight-title  f-tit-h2">
                        <span >
                          {{curCompParam.title}}
                        </span>
                  </div>
                  <div class="ShipContainer" style="position:relative">
                      <!-- 隐藏 AIS 按钮 -->
                        <div class="ShipContainer_echart" v-show="false"
                            :class="{'ShipContainer_echart_active':isAisChecked}"
                            @click.stop="clickAis(!isAisChecked)">
                            </div>
                        <div v-for="(item,index) of curList"
                            class="ShipContainer_item"
                            :key="item.key"
                            @click.stop="clickItem(item,index)">
                            <div class="ShipContainer_item_title">
                                <!-- <div class="ShipContainer_item_title_icon">
                                <i class="item_icon" :class="'item_icon_'+ item.icon"></i> 
                                </div> -->
                                <div class="ShipContainer_item_title_txt f-tit-h2">
                                    {{item.title}}
                                </div>
                            </div>
                            <div class="ShipContainer_item_content team-ul">
                                <div v-for="(citem) of item.subArr"
                                    class="ShipContainer_item_content_item tempRight-itemTitle"
                                    :class="citem.class"
                                    :key="citem.key">
                                    <!-- <div class="tempRight-icon_bg">
                                        <i class="teamIcon32" :class="'teamIcon32_'+citem.icon"></i>
                                    </div> -->
                                    <div class="tempRight-itemName">
                                        <span class="f-txt-com">{{citem.text}}</span>
                                    </div>
                                    <div class="tempRight-itemNum  f-txt-com">
                                        <span class="number f-number">
                                            {{curDataCache[citem.key] || 0}}
                                        </span>
                                        <span class="unit">
                                            {{citem.unit}}
                                        </span> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
</div>              
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { pushDataRequestServe } from '@/api/installServer';
import {getFormatData} from '@/util/filter/CommonFilter';
import publishObjectPath from '@/util/configRegistry';
@Component({
    name: 'Ship',
    components: {},
    // filters: {
    //     formatData: getFormatData, // null
    // },
})
export default class Ship extends Vue {
    @Prop() private compParam: any; // 父组件带过来的子组件需要的参数
    @Prop() private handleClick: any; // 父组件处理子组件点击的方法
    @Prop() private getCacheData: any; // 父组件可以获得子组件的数据的方法
    private curCompParam: any = {}; // compParam的转换
    private isAisChecked: boolean = false; // ais按钮的选中状态
    private curDataCache: any = {};
    private curList: any = [
        {
            key: 'shipToHarbour',
            title: '船舶归港',
            icon: 'shipReturningToPort',
            nextCompName: 'ShipToHarbourContainer',
            subArr: [
                {
                    text: '受影响',
                    key: 'shipsAffectedNum',
                    unit: '只',
                    icon: 'affected',
                    class: 'subItemActive',
                },
                {
                    text: '已归港',
                    key: 'shipsBackPortNum',
                    unit: '只',
                    icon: 'hasReturned',
                    class: 'subItem',
                },
            ],
        },
        {
            key: 'personTransfer',
            title: '人员转移',
            icon: 'personnelTransfer',
            nextCompName: 'ShipToHarbourContainer',
            subArr: [
                {
                    text: '受影响',
                    key: 'personnelAffectedNum',
                    unit: '人',
                    icon: 'affected',
                    class: 'subItemActive',
                },
                {
                    text: '已上岸',
                    key: 'personnelAshoreNum',
                    unit: '人',
                    icon: 'hasReturned',
                    class: 'subItem',
                },
            ],
        },
    ];

    public onUpdateLegend(event: any) {
        // 更新图例
        if (event.action === 'add') {
            this.$store.commit('mapTools/addSelectedLayer', event.data);
        } else {
            this.$store.commit('mapTools/removeSelectedLayer', event.data);
        }
    }

    // checkedFlag表示要展示还是要隐藏
    // true 为要展示 false 为要隐藏
    private clickAis(checkedFlag: boolean) {
        this.isAisChecked = checkedFlag;
        if ( checkedFlag ) {
             const myDate = new Date();
             const month = myDate.getMonth() + 1;
             const startTime = myDate.getFullYear() + '-' + month + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
             // startTime = '2020-06-15 00:00:00'
             this.getComponent().load({startTime});
        } else {
            this.getComponent().unload();
        }
    }

    private clickItem(item: any, index: number) {
        const param: any = {
            ...item,
            nextCompParam:  JSON.parse(JSON.stringify(this.curDataCache)),
        };
        this.handleClick(item.nextCompName, param);
    }

    private async getDataByServ() {
        const resData = await pushDataRequestServe.getPushDataByIds(this.$store.state.eventPushStore.eventId || publishObjectPath.value.defensiveEventId, 'ship_transfer');
        const result = this.handleResData(resData);
        this.getCacheData('ShipToHarbour', result);
        return result;
    }

     // 处理从接口拿回的数据，将两个不同的接口返回的不同的数据格式做个处理，处理成页面上原来需要的那种数据格式，类似于一个中间的转换处理
    private handleResData(resData: any) {
        let newResData: any = {};
        if ( resData.data.content ) {
            const targetJsonStr = JSON.parse(resData.data.content)[0].data;
            const targetDataObj = JSON.parse(targetJsonStr);
            newResData = targetDataObj.data;
        }
        return newResData;
    }

    // 将接口拿到的数据进行处理，并且赋值给本页面需要的数据
    // 船舶有新的数据推送
    // 这个变成了对象，所以不用在监听eventId
    @Watch('$store.state.eventPushStore.ship_transfer')
    private async handleResultData() {
        console.log('1233333');
        this.clickAis(false);
        this.curDataCache = await this.getDataByServ();
    }

    @Watch('compParam')
    private updateCurCompParam(val: any) {
        if (val.updateAis) {
            this.isAisChecked = false; // 去掉高亮
            this.getComponent().unload();
        }
    }

    private initCurCompParam() {
        this.curCompParam = JSON.parse(JSON.stringify(this.compParam));
    }

    // 地图弹窗组件加载
    private showPopup(event: any) {
        event.type = 'shipAis';
        const  self = this;
        const param = {
            that: self,
            popupId: 'RealtimeShip_popup', // 监听弹出层id，必须
            moduleTypeID: 'realtimeShip', // 实体类资源模块id，必须
        };
        const popUpTemplate = new renderpopUpTemplate();
        popUpTemplate.getParams(param);
        popUpTemplate.onShowPopup(event);
    }

    // 初始化监听的事件
    private initEventListener() {

        // ais的点位点击事件监听
        this.getComponent().on('RealtimeShip_popup', this.showPopup , this);
        // 图例切换
        this.getComponent().on('updateLegend', this.onUpdateLegend , this);
    }

    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.defensivePreparationFactory.getComponent(
        'realtimeShip',
        );
        return component;
    }

    private async created() {
        this.initCurCompParam();
        this.getComponent().off('RealtimeShip_popup', this.showPopup , this);
        this.getComponent().off('updateLegend', this.onUpdateLegend , this);
        await this.handleResultData();
    }
    private mounted() {
        this.initEventListener();
    }
    private beforeDestroy() {
        this.getComponent().clear();
        this.getComponent().off('RealtimeShip_popup', this.showPopup , this);
        this.getComponent().off('updateLegend', this.onUpdateLegend , this);
        this.getComponent().unload();
    }
}
</script>

<style lang="less" scoped>
@import '../../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../../assets/css/decisionSupport/Statistic.half.less';
.tempRight-title {
    margin-bottom: 10px;
}
    .ShipContainer{
        background: url('../../../../../assets/img/defensivePreparation/bg.png');
        background-size: 100% 100%;
        &_echart{
            position:absolute;
            right:6px;
            top: -10px;
            margin-top:-38px;
            width:41px;
            height:32px;
            cursor: pointer;
            background:url('../../../../../assets/img/discuss/ais.png') no-repeat 0 0;
            &:hover, &_active{
                // background-position: 0 -32px;
                background:url('../../../../../assets/img/defensivePreparation//ais-h.png') no-repeat;
            }
        }
        &_item{
            cursor: pointer;
            border-radius: 2px;
            border: solid 1px transparent;
            box-sizing: border-box;
            &:nth-child(1) {
                background-color:yellow;
                &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 5px;
                // background-image: url(../../../../../assets/img/barList/botBorderImg.png);
                background-color:yellow;
            }
            }
            &_title{
                display: flex;
                padding-top: 10px;
                padding-left: 10px;
                &_icon{
                    width: 50px;
                    height: 50px;
                    // outline: 1px solid red;
                }

                &_txt{
                    line-height: 50px;
                    color: #daf2ff;
                    // padding-left: 5px;
                }
            }
            &_content.team-ul {
                display: flex;
                padding: 0 10px;
                justify-content: space-between;
                box-sizing: border-box;
                .tempRight-itemTitle {
                    display: block;
                    margin: 0 0 15px 0;
                    // width: 160px;
                    height: 84px;
                    background:url('../../../../../assets/img/defensivePreparation/item.png') no-repeat;
                    background-size: 160px 84px;
                    box-sizing: border-box;
                    .tempRight-itemName {
                        padding-left: 32px;
                        padding-top: 12px;
                        width: 100%;
                        height: 45px;
                        line-height: 30px;
                        text-align: left;
                        box-sizing: border-box;
                    }
                    .tempRight-itemNum {
                        display: flex;
                        padding-left: 32px;
                        width: 100%;
                        height: 40px;
                        line-height: 35px;
                        float: none;
                        text-align: left;
                        box-sizing: border-box;
                        .number {
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            color: #fbee06;
                            font-style: normal;
                            cursor: pointer;
                        }
                        .unit {
                            color: #bacfdc;
                            padding-right: 5px;
                            float: none;
                            font-style: normal;
                        }
                    }
                }
            }
            &_content.team-ul .tempRight-itemTitle .tempRight-itemName{
                        background: none;
            } 
            // &_content.team-ul .tempRight-itemNum .text-number{
            //     color: #7cf3fc;
            // }

            // .tempRight-itemTitle.subItemActive{
            //    background: rgba(82,183,234, 0.18);
            // }

            &_content.team-ul .tempRight-itemTitle.subItemActive .tempRight-itemNum .text-number{
                color: #fbee06;
            }
        }
        &_item:nth-child(2){
            position: relative;
            margin-bottom: 1px;
            &::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 1px;
                background-image: url(../../../../../assets/img/barList/botBorderImg.png);
                background-size: 100% 100%;
            }
        }
        &_item:hover{
            border: solid 1px #fef551;
            background: rgba(254,245,81, 0.1);
        }
    }

</style>
