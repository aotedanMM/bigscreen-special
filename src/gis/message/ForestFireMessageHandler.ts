
import ForestFireEventInfo from '../event/ForestFireEventInfo';
import EventInfo from '../event/EventInfo';
import MessageHandler from './MessageHandler';
/**
 * 森林火灾事件处理
 */
export default class ForestFireMessageHandler extends MessageHandler {
    // windrLayers: WindLayer | undefined;

    constructor() {
        super();
    }

    public createEventInfo(): EventInfo {
        return new ForestFireEventInfo(null, null);
    }

    // 重置所有状态
    public reset() {
        // todo 清理事件的相关状态
        this.toggleWaterLayer(false);
        this.toggleWindLayer(false);
        // 触发父类重置方法
        super.reset();
    }

    /**
     * 定位推送
     * @param event
     */
    public onPushEvent(event: any, eventDispatcher: any) {
        this.updateEventInfo(event, eventDispatcher);
        // 烈度圈组件
        const influence = this.components.commonFactory.getComponent('influence');
        console.debug('eventInfo: ');
        // 重置显示的范围类型
        influence.reset();
        influence.reload();
    }

    /**
     * 事件处理后的统一处理
     * @param event
     * @param eventDispatcher
     */
    public postPushEvent(event: any, eventDispatcher: any): void {
        this.toggleWindLayer(true);
    }

    // 切换水域图层
    public toggleWaterLayer(visible: boolean) {
        // 服务接入组件
        const mapserviceIn = this.components.commonFactory.getComponent('mapserviceIn');
        if (visible) {
            mapserviceIn.addLayer('WaterLayer');
        } else {
            mapserviceIn.removeLayer('WaterLayer');
        }
    }
    // 切换风向图层
    public toggleWindLayer(visible: boolean) {
        // 服务接入组件
        const mapserviceIn = this.components.commonFactory.getComponent('mapserviceIn');
        // this.windrLayers=new WindLayer((window as any).map);WindField
        // this.windrLayers.load(mapserviceIn)
        if (visible) {
            const eventInfo: any = this.eventWapper.getEventInfo();
            mapserviceIn.addLayer('WindLayer', eventInfo);
            // mapserviceIn.addLayer('WindField', eventInfo);
        } else {
            mapserviceIn.removeLayer('WindLayer');
            // mapserviceIn.removeLayer('WindField');
        }
    }
    public addreservoir() {
        const disasterJudgeResource = this.components.disasterJudgeFactory.getComponent('disasterJudgeResource');
        const eventInfo: any = this.eventWapper.getEventInfo();
        const ranges = eventInfo.getRanges();
        const maxlevel = ranges[ranges.length - 1].level;
        disasterJudgeResource.load(['reservoir']).then((data: any) => {
            if (data && data[0].total > 0) {
                disasterJudgeResource.showResource('reservoir', [maxlevel]);
            }
        });
    }

}
