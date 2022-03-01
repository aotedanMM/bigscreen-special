import EventTypeMap from '../../event/EventTypeMap';
const TEMPLATES: any = {
    DEFAULT: {
        // 匹配数据的key
        key: '',
        src: '',
        title: '',
        root: './imgs/resources/legend',
        width: 20,
        height: 20,
    },
};
/**
 * 根据数据类型配置图例符号
 */
const RESOURCE: any = {
    EVENT: {
        // 数据中匹配符号的属性名
        key: 'eventType',
        list: [],
    },
    // 专家
    EXPERT: {
        key: null,
        list: [
            {
                src: `${TEMPLATES.DEFAULT.root}/Expert※01.png`,
                title: '专家',
                width: TEMPLATES.DEFAULT.width,
                height: TEMPLATES.DEFAULT.height,
            },
        ],
    },
    // 区县
    COUNTY: {
        key: null,
        list: [
            {
                src: `${TEMPLATES.DEFAULT.root}/rescueArea_disoatch_county.png`,
                title: '区县',
                width: TEMPLATES.DEFAULT.width,
                height: TEMPLATES.DEFAULT.height,
            },
        ],
    },
    // 乡镇
    TOWN: {
        key: null,
        list: [
            {
                src: `${TEMPLATES.DEFAULT.root}/rescueArea_disoatch_town.png`,
                title: '乡镇',
                width: TEMPLATES.DEFAULT.width,
                height: TEMPLATES.DEFAULT.height,
            },
        ],
    },
    // todo
};
// 事件信息
for (const title of Object.keys(EventTypeMap)) {
    const item: any = {};
    // 匹配属性名
    item.value = title;
    item.src = `${TEMPLATES.DEFAULT.root}/eventa${EventTypeMap[title]}.png`;
    item.title = title;
    item.width = TEMPLATES.DEFAULT.width;
    item.height = TEMPLATES.DEFAULT.height;
    RESOURCE.EVENT.list.push(item);
}
export default RESOURCE;
