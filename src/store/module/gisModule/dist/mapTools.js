"use strict";
exports.__esModule = true;
exports["default"] = {
    namespaced: true,
    state: {
        mapDownload: {
            showPreview: false,
            title: '',
            time: ''
        },
        switchBaseMapVisible: false,
        thematicVisible: false,
        regionPanelVisible: false,
        nearbyQueryVisible: false,
        nearbyQueryRadius: 0,
        showLayerPanel: false,
        selectedLayers: [],
        curSelectLayer: {},
        showLayerLegend: false,
        showLayerPlay: false,
        showRiverList: {
            isShow: false,
            isMajorRiver: null,
            name: ''
        },
        showRiverListz: {
            isShow: false,
            isMajorRiver: null,
            name: ''
        },
        showReservoirList: {
            isShow: false,
            type: null,
            geometry: null,
            name: ''
        },
        showReservoirCountdxList: {
            isShow: false,
            type: null,
            geometry: null,
            scalename: '大型'
        },
        showReservoirCountzxList: {
            isShow: false,
            type: null,
            geometry: null,
            scalename: '中型'
        },
        showReservoirCountxxList: {
            isShow: false,
            type: null,
            geometry: null,
            scalename: '小型'
        },
        showFloodvillageList: {
            isShow: false,
            type: null,
            geometry: null,
            name: ''
        },
        showRainMonitorList: {
            isShow: false,
            level: null,
            filter: {},
            destroy: false
        },
        showFireList: {
            isShow: false
        },
        citySelectVisible: false,
        showOnlyLayerPlay: {
            isShow: false,
            param: {}
        },
        showWeirgateMonitorList: {
            isShow: false,
            name: ''
        }
    },
    mutations: {
        changeMapDownload: function (state, data) {
            for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                var key = _a[_i];
                state.mapDownload[key] = data[key];
            }
        },
        changeThematicVisible: function (state, data) {
            state.thematicVisible = data;
        },
        // 多选区县显示隐藏
        changeCitySelectVisible: function (state, data) {
            state.citySelectVisible = data;
        },
        changeSwitchBaseMapVisible: function (state, data) {
            state.switchBaseMapVisible = data;
        },
        changeNearbyQueryVisible: function (state, data) {
            state.nearbyQueryVisible = data;
        },
        changeRegionPanelVisible: function (state, data) {
            state.regionPanelVisible = data;
        },
        changeNearbyQueryRadius: function (state, data) {
            state.nearbyQueryRadius = data;
        },
        changeShowLayerPanel: function (state, data) {
            state.showLayerPanel = data;
        },
        changeShowLayerPlay: function (state, data) {
            state.showLayerPlay = data;
        },
        changeShowRiverList: function (state, data) {
            state.showRiverList = data;
        },
        changeShowsRiverList: function (state, data) {
            state.showRiverListz = data;
        },
        changeShowReservoirList: function (state, data) {
            state.showReservoirList = data;
        },
        changeShowReservoirCountdxList: function (state, data) {
            state.showReservoirCountdxList = data;
        },
        changeShowReservoirCountzxList: function (state, data) {
            state.showReservoirCountzxList = data;
        },
        changeShowReservoirCountxxList: function (state, data) {
            state.showReservoirCountxxList = data;
        },
        changeShowFloodvillageList: function (state, data) {
            state.showFloodvillageList = data;
        },
        changeShowRainMonitorList: function (state, data) {
            state.showRainMonitorList = data;
        },
        changeShowWeirgateMonitorList: function (state, data) {
            state.showWeirgateMonitorList = data;
        },
        changeShowFireList: function (state, data) {
            state.showFireList = data;
        },
        changeCurSelectLayer: function (state, data) {
            state.curSelectLayer = data;
        },
        changeShowOnlyLayerPlay: function (state, data) {
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
        addSelectedLayer: function (state, data) {
            var exist = false;
            for (var _i = 0, _a = state.selectedLayers; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id === data.id) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                state.selectedLayers.push(data);
            }
            this.commit('mapTools/updateLayerLegendVisible');
        },
        /**
         * 移除图层
         * @param state
         * @param data {Object}
         * @param data.id {String} 图层id
         */
        removeSelectedLayer: function (state, data) {
            var index = 0;
            for (var _i = 0, _a = state.selectedLayers; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.id === data.id) {
                    state.selectedLayers.splice(index, 1);
                    break;
                }
                index++;
            }
            this.commit('mapTools/updateLayerLegendVisible');
        },
        // 清除所有图层
        clearSelectedLayer: function (state) {
            state.selectedLayers = [];
            this.commit('mapTools/updateLayerLegendVisible');
        },
        // 根据图层自动更新图例显示
        updateLayerLegendVisible: function (state, data) {
            var selectedLayers = state.selectedLayers;
            var legendCount = 0;
            for (var _i = 0, selectedLayers_1 = selectedLayers; _i < selectedLayers_1.length; _i++) { // 过滤没有图例的
                var item = selectedLayers_1[_i];
                if (item.legend && item.legend.component) {
                    legendCount++;
                }
            }
            state.showLayerLegend = legendCount > 0;
        }
    },
    actions: {}
};
