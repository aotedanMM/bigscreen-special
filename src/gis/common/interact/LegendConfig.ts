// featureType 与 图例数据映射
import RESOURCES from './LegendResource';
import RESOURCE from './LegendResource';
/**
 * 根据featureType 配置数据图例的映射
 * key 为不同功能里的featureType
 */
const CONFIG: any = {
    /**
     * 常态
     */
    // 最新事件
    'eventpoint' : {
        symbol: RESOURCES.EVENT,
    },
    // 历史事件树
    '社会安全事件' : {
        symbol: RESOURCES.EVENT,
    },
    '事故灾难' : {
        symbol: RESOURCES.EVENT,
    },
    '公共卫生事件' : {
        symbol: RESOURCES.EVENT,
    },
    '自然灾害' : {
        symbol: RESOURCES.EVENT,
    },
    // 常态-资源-专家
    'resource_Expert※01': {
        symbol: RESOURCES.EXPERT,
    },
    /**
     * 灾情研判
     */
    // 区县 乡镇
    'district_point_county' : {
        symbol: RESOURCES.COUNTY,
    },
    'district_point_town' : {
        symbol: RESOURCES.TOWN,
    },

     /**
     * 灾情统计
     */


    /**
     * 救援救助
     */

    /**
     * 救援救助
     */
};
export default CONFIG;
