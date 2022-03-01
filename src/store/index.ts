import Vue from 'vue';
import Vuex from 'vuex';

import helloModule from './module/helloModule/hello';
import comMutexState from './module/comMutexState/comMutexState';
import mapModule from './module/mapModule/emap';
import weatherStore from './module/weatherStore/weatherStore';
import layoutModule from './module/layoutModule/layout';
import gisModuleEventGlobal from './module/gisModule/eventGlobal';
import gisModuleDisasterJudge from './module/gisModule/disasterJudge';
import gisMenuSearch from './module/gisModule/gisMenuSearch';
import mapTools from './module/gisModule/mapTools';
import controlMoudle from './module/controlModel/control';
import pushEventModule from './module/pushEventModule/PushEventStore';
import eventPushStore from './module/pushEventModule/EventPushStore';
import pathStore from './module/pathStore/pathStore';
import configModel from './module/configModel/config';
import TyphoonModule from './module/TyphoonModule/TyphoonModule';
import eventInfoType from './module/eventInfoType/eventInfoType';
import panelMutualExclusionMudule from './module/panelMutualExclusionMudule/panelMutualExclusion';
import panelPositionChangeModule from './module/panelPositionChangeModule/panelPositionChange';
import forestFireModule from './module/forestFireModuleYantai/forestFireModule';
import dataFilterControl from './module/dataFilterControl/DataFilterControl';
import earthQuake from './module/earthQuake/earthQuake';
import firePointInfo from './module/firePointInfo/firePointInfo';
import realTimeUrlModule from './module/realTimeUrlModule/RealTimeUrlModule';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // clearAll: false,  // 清屏状态发生改变时清屏
    resetDefaultAddedData: false, // 重置默认加载的数据
    resumeDefaultAddedData: false, // 重新加载默认加载的数据
  },
  mutations: {
    /*changeClearAllStatus(state, data) {
      state.clearAll = !state.clearAll;
    },*/
    resetAllDefaultData(state, data) {
      state.resetDefaultAddedData = !state.resetDefaultAddedData;
    },
    resumeAllDefaultData(state, data) {
      state.resumeDefaultAddedData = !state.resumeDefaultAddedData;
    },
  },
  modules: {
    comMutexState,
    helloModule,
    mapModule,
    weatherStore,
    layoutModule,
    gisModuleEventGlobal,
    gisModuleDisasterJudge,
    gisMenuSearch,
    mapTools,
    controlMoudle,
    pushEventModule, // 当前推送事件相关的数据模块
    eventPushStore,
    pathStore, // 路径规划面板显示状态
    configModel, // 配置文件
    eventInfoType, // 事件类型
    panelMutualExclusionMudule, // 面板互斥
    panelPositionChangeModule, // 面板位置
    TyphoonModule, // 台风信息
    dataFilterControl, // 数据面板过滤控制文件
    forestFireModule, // 森火专题
    earthQuake, // 地震模型数据
    firePointInfo, // 火点信息数据
    realTimeUrlModule, // 实时监测
  },
});
