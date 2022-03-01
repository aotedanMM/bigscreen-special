export default {
    namespaced: true,
    state: {
        mapDownload: {
            showPreview: false,
            title: '',
            time: '',
        },
        switchBaseMapVisible: false,
        thematicVisible: false,
        regionPanelVisible: false, // 是否显示行政区划选择面板
        nearbyQueryVisible: false, // 是否显示周边查询面板
        nearbyQueryRadius: 0, // 缓冲区半径(公里)
        showLayerPanel: false, // 图层面板显示
        selectedLayers: [], // 所有选中的图层
        curSelectLayer: {}, // 当前选中的图层
        showLayerLegend: false, // 图层图例显隐
        showLayerPlay: false, // 图层播放轴显隐
        showRiverList: { // 河流目录显隐
            isShow: false,
            isMajorRiver: null,
            name: '',
        },
        showRiverListz: {
            isShow: false,
            isMajorRiver: null,
            name: '',
        },
        showReservoirList: { // 水库列表显隐
            isShow: false,
            type: null,
            geometry: null,
            name: '',
        },
        showReservoirCountdxList: { // 大型水库列表显隐
            isShow: false,
            type: null,
            geometry: null,
            scalename: '大型',
        },
        showReservoirCountzxList: { // 中型水库列表显隐
            isShow: false,
            type: null,
            geometry: null,
            scalename: '中型',
        },
        showReservoirCountxxList: { // 小型水库列表显隐
            isShow: false,
            type: null,
            geometry: null,
            scalename: '小型',
        },
        showFloodvillageList: { // 受灾村列表显隐
            isShow: false,
            type: null,
            geometry: null,
            name: '',
        },
        showRainMonitorList: { // 雨情列表显隐
            isShow: false,
            level: null,
            filter: {},
            destroy: false,
        },
        showFireList: { // 历史火情列表显隐
            isShow: false,
        },
        showFireList2: { // 企业监测
            isShow: false,
        },
        citySelectVisible: false, // 多选区县-是否显示行政区划选择面板
        showOnlyLayerPlay: { // 单独播放轴
            isShow: false,
            param: {},
        },
        showWeirgateMonitorList: {
            isShow: false,
            name: '',
        },
    },
    mutations: {
        changeMapDownload(state: any, data: any) {
            for (const key of Object.keys(data)) {
                state.mapDownload[key] = data[key];
            }
        },
        changeThematicVisible(state: any, data: any) {
            state.thematicVisible = data;
        },
        // 多选区县显示隐藏
        changeCitySelectVisible(state: any, data: any) {
            state.citySelectVisible = data;
        },
        changeSwitchBaseMapVisible(state: any, data: any) {
            state.switchBaseMapVisible = data;
        },
        changeNearbyQueryVisible(state: any, data: any) {
            state.nearbyQueryVisible = data;
        },
        changeRegionPanelVisible(state: any, data: any) {
            state.regionPanelVisible = data;
        },
        changeNearbyQueryRadius(state: any, data: any) {
            state.nearbyQueryRadius = data;
        },
        changeShowLayerPanel(state: any, data: any) {
            state.showLayerPanel = data;
        },
        changeShowLayerPlay(state: any, data: any) {
            state.showLayerPlay = data;
        },
        changeShowRiverList(state: any, data: any) {
            state.showRiverList = data;
        },
        changeShowsRiverList(state: any, data: any) {
            state.showRiverListz = data;
        },
        changeShowReservoirList(state: any, data: any) {
            state.showReservoirList = data;
        },
        changeShowReservoirCountdxList(state: any, data: any) {
            state.showReservoirCountdxList = data;
        },
        changeShowReservoirCountzxList(state: any, data: any) {
            state.showReservoirCountzxList = data;
        },
        changeShowReservoirCountxxList(state: any, data: any) {
            state.showReservoirCountxxList = data;
        },
        changeShowFloodvillageList(state: any, data: any) {
            state.showFloodvillageList = data;
        },
        changeShowRainMonitorList(state: any, data: any) {
            state.showRainMonitorList = data;
        },
        changeShowWeirgateMonitorList(state: any, data: any) {
            state.showWeirgateMonitorList = data;
        },
        changeShowFireList(state: any, data: any) {
            state.showFireList = data;
        },
        changeShowFireList2(state: any, data: any) {
            state.showFireList2 = data;
        },
        changeCurSelectLayer(state: any, data: any) {
            state.curSelectLayer = data;
        },
        changeShowOnlyLayerPlay(state: any, data: any) {
            state.showOnlyLayerPlay = data;
        },
        /**
         * 叠加图层
         * @param state
         * @param data {Object}
         * @param data.id {String} 图层id
         * @param data.name {String} 图层名称
         * @param data.legend {Object} 图例
         * @param data.legend.component {String} 图例对应的组件名
         * @param data.play {Boolean} 图例是否有播放轴
         */
        addSelectedLayer(state: any, data: any) {
            let exist: boolean = false;
            for (const item of state.selectedLayers) {
                if (item.id === data.id) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                state.selectedLayers.push(data);
            }
            (this as any).commit('mapTools/updateLayerLegendVisible');
        },
        /**
         * 移除图层
         * @param state
         * @param data {Object}
         * @param data.id {String} 图层id
         */
        removeSelectedLayer(state: any, data: any) {
            let index: number = 0;
            for (const item of state.selectedLayers) {
                if (item.id === data.id) {
                    state.selectedLayers.splice(index, 1);
                    break;
                }
                index++;
            }
            (this as any).commit('mapTools/updateLayerLegendVisible');
        },
        // 清除所有图层
        clearSelectedLayer(state: any) {
            state.selectedLayers = [];
            (this as any).commit('mapTools/updateLayerLegendVisible');
        },
        // 根据图层自动更新图例显示
        updateLayerLegendVisible(state: any, data: any) {
            const selectedLayers: any = state.selectedLayers;
            let legendCount = 0;
            for (const item of selectedLayers) { // 过滤没有图例的
                if (item.legend && item.legend.component) {
                    legendCount++;
                }
            }
            state.showLayerLegend = legendCount > 0;
        },
    },
    actions: {},
};
