
import EarthQuakeEventInfo from '../event/EarthQuakeEventInfo';
import EventInfo from '../event/EventInfo';
import MessageHandler from './MessageHandler';
import EVENT_NAMES from './EventNames';
import Util from '../Util';
/**
 * 地震事件处理
 */
export default class EarthQuakeMessageHandler extends MessageHandler {
    public intentsityData: any;
    constructor() {
        super();
    }

    public createEventInfo(): EventInfo {
        return new EarthQuakeEventInfo(null, null);
    }

    // 重置所有状态
    public reset() {
        // todo 清理事件的相关状态
        // 触发父类重置方法
        super.reset();
    }

    /**
     * 定位推送
     * @param event
     */
    public onPushEvent( event: any, eventDispatcher: any, backfunc: any) {
        // 如果是非操作屏推送的地震，则按默认规则给定经验圈半径
        // 即根据级别设置对应默认的半径
        /* if (event.Pushofsupportscreen !== true) {
            const radiusArr: any = this.getAffectRadiusByLevel(event.EqLevel);
            if (radiusArr.length > 0) {
                event.setValue('radius', radiusArr.join(','));
            }
        } */
        // 更新事件信息
        this.updateEventInfo(event, eventDispatcher);
        const eventInfo: any = this.eventWapper.getEventInfo();
        const oldEventInfo: any = Util.toJSON(eventInfo);
        // 烈度圈组件
        const influence = this.components.commonFactory.getComponent('influence');
        // 烈度级别
        console.debug('事件推送： 更新震级:' + event.EqLevel );
        eventInfo.setLevel(parseFloat(event.EqLevel) || null);
        // 烈度级别、位置变化，调用模型服务
        if (Util.detectChange(oldEventInfo, Util.toJSON(eventInfo), ['level', 'point'])) {
            console.debug('烈度圈变化， new level = ', event.EqLevel);
            // 设置了烈度级别，且在[5,8.2]区间
            if (eventInfo.getLevel() && eventInfo.getLevel() >= 5 && eventInfo.getLevel() <= 8.2 ) {
                influence.executeModel().then((data: any) => {
                    const ranges: any = data.optionData;
                    this.intentsityData = data.dataAll;
                    backfunc();
                    // 烈度模型计算完成
                    eventDispatcher.dispatch(EVENT_NAMES.MODEL_EXECUTED, {
                        eventInfo,
                    });
                }).catch((err: any) => {
                    console.error('地震烈度模型计算失败！ ', err.message);
                });
            } else {
                console.debug(' 不计算模型 ');
            }
        }
        influence.reload(false);
        console.debug('eventInfo: ');
        console.debug(eventInfo);
    }

    /**
     * 事件处理后的统一处理
     * @param event
     * @param eventDispatcher
     */
    public postPushEvent(event: any, eventDispatcher: any): void {
        // this.addDistricts();
    }

    /**
     * 上传烈度shape
     * @param event
     * @param eventDispatcher
     */
    public onPushUploadShp(event: any, eventDispatcher: any) {
        // 烈度圈组件
        console.debug(' 处理上传烈度shape消息');
        const influence = this.components.commonFactory.getComponent('influence');
        const eventInfo: any = this.eventWapper.getEventInfo();
        influence.fetchAndSetReportRanges().then(() => {
            const loadType: any = influence.reload();
            eventDispatcher.dispatch(EVENT_NAMES.RANGES_REPORTED, {
                eventInfo,
            });
            if (loadType === 2) {
                console.debug(' 地图上刷新为上报烈度圈！');
                eventDispatcher.dispatch(EVENT_NAMES.RANGES_REFRESH, {
                    eventInfo,
                    type: 2,
                });
            }
        });
    }

      // 叠加行政区划
    private addDistricts() {
        // 行政区划组件
        const districtComp = this.components.disasterJudgeFactory.getComponent('districtComp');
        districtComp.load(true, true);
    }

}
