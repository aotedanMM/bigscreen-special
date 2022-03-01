import DefaultMessageHandler from './DefaultMessageHandler';
import EarthQuakeMessageHandler from './EarthQuakeMessageHandler';
import ForestFireMessageHandler from './ForestFireMessageHandler';
import SafeProductionMessageHandler from './SafeProductionMessageHandler';
import FireAccidentMessageHandler from './FireAccidentMessageHandler';
import TrafficMessageHandler from './TrafficMessageHandler';
import FloodDisasterMessageHandler from './FloodDisasterMessageHandler';
import GrasslandFireMessageHandler from './GrasslandFireMessageHandler';
import GeologicHazardMessageHandler from './GeologicHazardMessageHandler';
import ForeignEmergenciesMessageHandler from './ForeignEmergenciesMessageHandler';
import PublicHealthEmergenciesMessageHandler from './PublicHealthEmergenciesMessageHandler';
import TyphoonMessageHandler from './TyphoonMessageHandler';
import RainstormMessageHandler from './RainstormMessageHandler';
const handlerMap: any = { // 10 台风事件 16 暴雨事件 17泥石流 18滑坡 19燃气泄漏 20水库溃坝 21 内涝
    // 地震
    1: new EarthQuakeMessageHandler(),
    // 煤矿事故
    2: new SafeProductionMessageHandler(),
    // 地质灾害
    3: new GeologicHazardMessageHandler(),
    // 非煤矿山事故
    4: new SafeProductionMessageHandler(),
    // 危化工贸事故
    5: new SafeProductionMessageHandler(),
    // 火灾事故
    6: new FireAccidentMessageHandler(),
    // 交通事故
    7: new TrafficMessageHandler(),
    // 洪涝灾害
    24: new FloodDisasterMessageHandler(),
    // 森林火灾
    9: new ForestFireMessageHandler(),
    // 台风事件
    10: new TyphoonMessageHandler(),
    // 草原火灾
    11: new GrasslandFireMessageHandler(),
    // 涉外突发事件
    12: new ForeignEmergenciesMessageHandler(),
    // 公共卫生事件
    13: new PublicHealthEmergenciesMessageHandler(),
    // 暴雨事件
    16: new RainstormMessageHandler(),
    default: new DefaultMessageHandler(),
};
export default class MessageHandlerBuilder {
    public static getHandler(type: any) {
        if (handlerMap.hasOwnProperty(type)) {
            return handlerMap[type];
        } else {
            console.warn(' unsupported event type ' + type);
        }
        return null;
    }
    public static getDefaultHandler() {
        return handlerMap.default;
    }
    public static getAHandler(type: any) {
        let messageHandler = MessageHandlerBuilder.getHandler(type);
        if (messageHandler === null) {
          messageHandler = MessageHandlerBuilder.getDefaultHandler();
        }
        return messageHandler;
    }
}
