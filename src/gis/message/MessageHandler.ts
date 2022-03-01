/**
 * 消息处理
 */
import EventInfo from '../event/EventInfo';
import EVENT_NAMES from './EventNames';
import IMessageHandler from './IMessageHandler';
export default abstract class MessageHandler implements IMessageHandler {
    protected eventWapper: any = null;
    protected components: any = null; // 模块
    protected tools: any = null; // 通用工具

    public setEventWapper(eventWapper: any) {
        this.eventWapper = eventWapper;
    }

    public setComponents(components: any) {
        this.components = components;
    }

    public setTools(tools: any) {
        this.tools = tools;
    }
    /**
     * 重置事件处理的相关状态
     */
    public reset() {
        if (this.eventWapper) {
            // 清除事件信息包装类所绑定的具体事件类型的事件信息对象
            this.eventWapper.unbind();
        }
        if (this.components) {
            const mapserviceIn = this.components.commonFactory.getComponent('mapserviceIn');
            mapserviceIn.unload();
            const districtComp = this.components.disasterJudgeFactory.getComponent('districtComp');
            districtComp.unload();
            const disasterJudgeResource = this.components.disasterJudgeFactory.getComponent('disasterJudgeResource');
            disasterJudgeResource.unload();
            const drawEventPolygon = this.components.commonFactory.getComponent('drawEventPolygon');
            drawEventPolygon.unload();
        }
    }

    // 创建事件信息类，不同类型的事件处理类都要实现
    public abstract createEventInfo(): EventInfo;
    /**
     * 事件推送
     * @param event
     */
    public abstract onPushEvent(event: any, eventDispatcher: any, backfunc: any): void;

    /**
     * 事件处理后的统一处理
     * @param event
     * @param eventDispatcher
     */
    public postPushEvent(event: any, eventDispatcher: any): void {
        // do sth
    }
    /**
     * 更新影响圈
     * @param radius {String} '5,10,20,50'
     */
    public updateAffectRadius(radius: any, eventDispatcher: any, reloadInflunce: boolean = false) {
        if (this.eventWapper !== null) {
            const eventInfo: any = this.eventWapper.getEventInfo();
            if (eventInfo) {
                if (radius) {
                        console.debug('更新影响半径:' + radius );
                        const oldRadius: any = eventInfo.getAffactRadius().join(',');
                        // if (radius !== oldRadius) {
                        eventInfo.setAffactRadius(radius.split(','));
                        // 分发影响圈变化的事件
                        console.debug('影响圈更新通知！');
                        eventDispatcher.dispatch(EVENT_NAMES.INFLUENCE_READY, {
                            eventInfo,
                        });
                        // 范围刷新
                        eventDispatcher.dispatch(EVENT_NAMES.RANGES_REFRESH, {
                            eventInfo,
                            type: 0,
                        });
                        // if (reloadInflunce) { // 刷新影响圈
                        //     const influence = this.components.commonFactory.getComponent('influence');
                        //     influence.reload();
                        //     // 刷新人口热力
                        //     const pop = this.components.disasterJudgeFactory.getComponent(
                        //         'disasterJudgePop',
                        //       );
                        //     pop.reload();
                        // }
                    // }
                }
            }
        }
    }

    protected updateEventInfo(event: any, eventDispatcher: any) {
        const eventInfo: any = this.getNewEventInfo(event);
        // 定位组件
        const locateComponent = this.components.commonFactory.getComponent('locateComp');
        const point: any = eventInfo.getPoint();
        if (point) {
            // 事件定位
            locateComponent.load({
                x: point[0],
                y: point[1],
                autoPan: false, // 推送时不定位视野
                type: eventInfo.getType(),
            });
        }
        this.updateAffectRadius(event.radius, eventDispatcher);
    }

    /**
     * 更新事件基本信息
     * @param event
     */
    protected getNewEventInfo(event: any) {
        let eventInfo: any = this.eventWapper.getEventInfo();
        // 第一次推送或者类型变化，生成新的eventInfo
        if (!(eventInfo && eventInfo.getType() === event.EventType)) {
            eventInfo = this.createEventInfo();
            eventInfo.setType(event.EventType);
            this.eventWapper.bind(eventInfo);
        }
        this.eventWapper.bind(eventInfo);
        // 更新ID
        if (event.eventId) {
            this.eventWapper.setId(event.eventId);
        }
        // 更新mis端事件ID
        this.eventWapper.setOriginalEventId(event.originalEventId);
        // 更新事件基本信息
        if (event.EventTit) {
            eventInfo.setTitle(event.EventTit);
        }
        if (event.EventTimes) {
            eventInfo.setEventTime(event.EventTimes);
        }
        if (event.EventDesc) {
            eventInfo.setMessage(event.EventDesc);
        }
        const lng: any = parseFloat(event.EventLon);
        const lat: any = parseFloat(event.EventLat);
        if ( lng && lat) {
            // 更新事件信息
            eventInfo.setPoint([lng, lat]);
        }
        // 如果事件信息里有geometry 属性，兼容线面要素
        if (event.geometry) {
            let geometry: any = event.geometry;
            if (Object.prototype.toString.call(geometry) === '[object String]') { // 处理字符串的情况
                geometry = JSON.parse((geometry as any));
            }
            eventInfo.setGeometry(geometry);
        }
        return eventInfo;
    }
    /**
     * 更新事件基本信息
     * @param event
     */
    protected updateEventType(eventType: any, eventDispatcher: any, reloadInflunce: boolean = false) {
        eventDispatcher.dispatch(EVENT_NAMES.EVENTTYPE_CHANGE, eventType);
    }
}
