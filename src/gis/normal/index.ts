
import NewsEventLocateComponnet from './newsevent/NewsEventLocateComponnet';
import QueryAndShowAccident from './historyEvent/QueryAndShowAccidentData';
import EventWarnInforComponent from './eventwarninfor/EventWarnInforComponent';
import historyEarthQuakeComponent from './histroyEarthQuake/historyEarthQuakeComponent';
import ResourceComponent from './resource/ResourceComponent';
import NewResourceComponent_left from './resource/NewResourceComponent_left';
import NewResourceComponent from './resource/NewResourceComponent';
import GISToolComponent from '../common/tool/GISToolComponent';
import FloodSelectionComponent from './flood/FloodSelectionComponent';
import firepointinforemationComponent from './firepointinformation/firepointinforemationComponent';

export default {
    // 事件轮播定位
    NewsEventLocateComponnet,
    QueryAndShowAccident,
    // 预警信息
    EventWarnInforComponent,
    // 历史地震
    historyEarthQuakeComponent,
    // 应急资源(老板基于mongo)
    ResourceComponent,
     // 新版应急资源(左侧)，基于pg服务，脱离mongo查询
    NewResourceComponent_left,
    // 新版应急资源（右侧），基于pg服务，脱离mongo查询
    NewResourceComponent,
    // 地图通用工具
    GISToolComponent,
    // 防汛相关组件
    FloodSelectionComponent,
    // 火点信息
    firepointinforemationComponent,
};

