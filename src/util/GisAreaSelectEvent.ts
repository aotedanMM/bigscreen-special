import { getEvemtInfoOrCreatedInfo } from '@/api/installServer';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import { districtServer, eventPushServer } from '@/api/installServer';
import uuid from 'uuid';
/**
 * 区域选择中与地图交互事件
 */
export default {
    methods: {
        // 创建组件
        getComponent_AreaSelectJudgement() {
            const temp: any = this;
            const factory = (temp.$ioc as any).resolve('GISFactory-map');
            const component = factory.normalFactory.getComponent('floodSelection');
            return component;
        },
        /**
         * 定位并且绘制
         * @param geometry
         * @param name // 标注名称
         * @param type // 业务类型，RiverLayer/WatershedLayer
         * @param fit // 是否定位
         * @param radius // 缓冲半径
         */
        drawAndLocate(geometry: object, name: string, type: string, fit: boolean = true, radius?: number) {
            const opts = {
                geom: geometry, //
                radius, // 缓冲距离，非必填，单位米
                name,
                fit,
                type,
            };
            // 绘制并定位至河流/流域
            this.getComponent_AreaSelectJudgement().draw(opts);
        },
        /**
               * 定位并且绘制
               * @param geometry
               * @param paramas // 业务数据
               * @param type // 业务类型，RiverLayer/WatershedLayer
               * @param fit // 是否定位
               * @param radius // 缓冲半径
               */
              drawAndLocate1(geometry: object, paramas: string, type: string, fit: boolean = true, radius?: number) {
                const opts = {
                    geom: geometry, //
                    radius, // 缓冲距离，非必填，单位米
                    paramas,
                    fit,
                    type,
                };
                // 绘制并定位至河流/流域
                this.getComponent_AreaSelectJudgement().draw1(opts);
            },

        /**
         * 点击进入处置按钮
         * @param isCollection- 是否收藏
         * @param selecttypecode - 事件类型
         */
        disposeHandler(isCollection: number, selecttypecode: string, geo: object) {
                const self: any = this;
                const sourceData = geo ? geo : this.getComponent_AreaSelectJudgement().getMapData();
                const userName: string = (self.$route ? self.$route.query.loginName : '') || (sessionStorage.loginName ? sessionStorage.loginName : '') || 'eads';
                const paramData: any = {
                    collection: isCollection, // 收藏标识：0：未收藏，1：已收藏
                    eventAddr: sourceData.address, // 事件地址
                    // eventAddr: '某河流', // sourceData.address, // 事件地址
                    eventId: (sourceData._id + (uuid().replace(/-/g, ''))).substr(0, 32), // 事件id（不可为空） 32位
                    eventLat: sourceData.geom.coordinates[1].toFixed(6), // 纬度（不可为空）
                    eventLon: sourceData.geom.coordinates[0].toFixed(6), // 经度（不可为空）
                    geometry: sourceData.geometry,
                    eventType: self.selecttypecode || '0', // 事件类型
                    locationPointTime: self.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 定位点更新时间
                    reportMan: userName, // 上报人（不可为空）
                    resourceName: '', // 资源名称
                    userName, // 用户名称（不可为空）
                };
            // getEvemtInfoOrCreatedInfo.getCreatedEventInfo(paramData).then((res: any): void => {
                // 这个res理论上为推送屏查回来的，但是这是常态就先写死了
                const res: any = {
                    code: 0,
                    data: {
                        collection: '0',
                        eventDesc: '',
                        eventExtra: {magnitude: null, affectRange: '5,10,20,50', intensityCircle: Array(0), focalDepth: null},
                        eventId: '',
                        eventType: '10',
                        fied: '0',
                        id: '',
                        latitude: paramData.eventLat,
                        level: null,
                        location: '',
                        locationPointTime: paramData.locationPointTime,
                        longitude: paramData.eventLon,
                        occurTime: paramData.locationPointTime,
                        reportMan: paramData.userName,
                        reportTime: null,
                        scene: null,
                        source: '一张图',
                        status: '0',
                        statusTime: paramData.locationPointTime,
                        title: '',
                        userName: paramData.userName,
                    },
                };
                const { data, code } = res;
                if (code === 0) {
                    const eventData: any = {
                        curLocationKey: 'NEW_POPULATIONFEVE', // 表明当前是定位还是推送 send_location：定位   NEW_POPULATIONFEVE：推送
                        EventLat: parseFloat(data.latitude), // 纬度
                        EventAddr: data.location, // 地点,北京市大观园
                        EventLon: parseFloat(data.longitude), // 经度
                        EventLatLonStr: `${data.location}${data.longitude}${new Date()}`, // 经纬度拼起来的串，给地图监听用。主要用作推送屏点定位的时候，地图进行重定位。
                        TyphoonLatLonStr: !self.$store.state.eventPushStore.eventLocation.TyphoonLatLonStr,
                        radius: '0', // data.eventExtra ? data.eventExtra.affectRange : '', // 影响经验圈 '5,10,20,50'
                        EqLevel: data.eventExtra ? data.eventExtra.magnitude : '', // 7.5
                        EventDesc: data.eventDesc, // "2020年03月08日00时56分,北京市大观园发生重大火灾(此信息为测试数据)"
                        EventLevel: data.level, // "严重"
                        EventTime: '', // "2020年03月08日00时56分"   这两个好像只是格式的区别 别的没有区别
                        EventTimes: data.occurTime, // "2020-03-08 00:56:14"   标题取得这个字段显示在了事发时间 所以这里存的是事发时间
                        EventTit: data.title, // "11·24演习"
                        EventType: data.eventType, // "6"
                        eventId: data.id, // 事件id
                        EventIcon: sourceData._id, // 这里用来隐藏同一个事件进入处置按钮 增加一个全局的事件处置id
                        // geometry:data.geometry || sourceData.geometry
                        geometry: JSON.stringify(data.geometry) || JSON.stringify(sourceData.geometry),
                    };
                    // EventConfigRegistry.setConfig(eventData.EventType); // 根据事件类型读取配置文件
                    /**
                     * 经验圈信息全部都在后端拿不在读配置文件
                     * */
                    // self.$store.commit('configModel/setConfig', EventConfigRegistry.config);
                    self.handleEventInfo(eventData);
                    // self.eventPushToServe(eventData);
                    setTimeout(() => {
                      self.messsageBus.emit('positioningOperation', false);
                    });
                } else {
                    console.log(res.msg);
                }
            // });
        },
        /**
         * 更改前端的vuex中的event值，以便进入前端处置
         * @param newParamData
         */
        handleEventInfo(newParamData: any) {
            const self: any = this;
            this.getDistrict(newParamData);
            self.$store.commit('eventPushStore/eventInfoAll', newParamData);
        },
        /**
         * 根据经纬度获得行政区划
         * @param data
         */
        getDistrict(data: any) {
            const self: any = this;
            const optsTest = {
                location: [data.EventLon, data.EventLat],
                level: '2',
            };
            districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
                if (dataDis && dataDis.data && dataDis.data[0]) {
                  self.$store.commit('eventPushStore/setDistrict', dataDis.data[0]); // 推送
                }
            });
        },

        eventPushToServe(item: any) {
            const self: any = this;
            let receiverIds = 'eads';
            const sendSearch = location.hash || location.search || window.sessionStorage.loginName;
            const paramName: any = 'loginName=';  // 获取的为userid
            if (window.sessionStorage.loginName) {
              receiverIds = window.sessionStorage.loginName;
            } else {
              if (sendSearch.indexOf(paramName) !== -1) {
                receiverIds = sendSearch.split(`${paramName}`)[1];
              }
            }
            const param = {
                content: [
                    {
                        eventId: item.eventId,
                        date: self.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    },
                ],
                eventId: item.eventId,
                locationKey: 'eads',
                messageName: item.eventId,
                messageType: 'command',
                receiverIds,
                senderId: '1',
            };
            eventPushServer.pushEventToServe(param).then((res: any) => {
                // res && res.data && res.data.data
                console.log('操作屏回填=>', res);
            }).catch((error: any) => {
                console.log('操作屏回填=>', error);
            });
        },
    },
};
