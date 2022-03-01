/**
 * 地图通用方法
 **/
import {messsageBus} from './message';
export default {
    methods: {
        /**
         * 注册地图，分发地图加载事件
         * @param map
         * @param tag
         */
        registMap(map: any, tag: string) {
            // 注册地图变量
            const temp: any = this;
            const event = {
                ready: true,
                map,
            };
            (temp.$ioc as any).register(`map-${tag}`, event);
            // 分发地图加载完成的事件
            (messsageBus as any).$emit(`map-ready-${tag}`, event);
        },

        /**
         * 获取地图，检查地图加载完成后进入回调
         * @param tag
         */
        resolveMap(tag: string) {
            return new Promise((resolve: any , reject: any) => {
                const temp: any = this;
                // 先从容器中找地图，如果没有，则监听地图初始化完成的事件
                const mapData = (temp.$ioc as any).resolve(`map-${tag}`);
                if (mapData && mapData.ready === true ) {
                    resolve({
                        map: mapData.map,
                    });
                } else {
                    // 监听地图加载完成的回调
                    (messsageBus as any).$on(`map-ready-${tag}`, (event: any) => {
                        resolve({
                            map: event.map,
                        });
                    });
                }
            });
        },
    },
};
