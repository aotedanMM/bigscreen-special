/**
 *  推送事件id，和当前location id 存放的位置
*/
export default {
    namespaced: true,
    state: {
        // 行政区划
        district: {
            code: '', // "110000"
            name: '', // "北京市"
        },
         // 选中某个行政区或者处置面的共享数据
         geometrySelectShareObj: {
            districtCode: '', // "110000"
            districtName: '', // "北京市"
        },
        // 事件信息
        eventLocation: { // 字段是可以变得，先写这些
            curLocationKey: '', // 表明当前是定位还是推送 send_location：定位   NEW_POPULATIONFEVE：推送
            EventLat: '', // 纬度
            EventAddr: '', // 地点,北京市大观园
            EventLon: '', // 经度
            EventLatLonStr: '', // 经纬度拼起来的串，给地图监听用。主要用作推送屏点定位的时候，地图进行重定位。
            radius: '0', // 影响经验圈 '5,10,20,50'
            EqLevel: '', // 7.5
            EventDesc: '', // "2020年03月08日00时56分,北京市大观园发生重大火灾(此信息为测试数据)"
            EventLevel: '', // "严重"
            EventTime: '', // "2020年03月08日00时56分"
            EventTimes: '', // "2020-03-08 00:56:14"
            EventTit: '', // "11·24演习"
            EventType: '', // "6"
            EventIcon: '', // 增加一个全局的事件处置id
            Pushofsupportscreen: '', // 判断是否是支撑屏推送过来的
            originalEventId: '', // 原始mis中的id
            geometry: '',  // 面
            TyphoonLatLonStr: false, // 经纬度拼起来的串，台风专用, 重新计算面
            // eventid: "8a808b9c70a9016a0170b5e4d11f0be1"
            /*inEventInfoPopup: { // 这里是为了储存安全生产进入处置后详情窗的信息, 为了展示详情窗 在StudtToolHalf.vue 的mounted里面
              popupData: null, // 安全生产专题 危化品出详情窗版
              popupType: '',
            },*/
        },
        // 地震速报
        dizhensubao: false,
        // 事件 id
        eventId: '',
        // 人员伤亡 - 实时灾情
        casualties: -1,
        // 房屋损毁 - 实时灾情
        housesh: -1,
        //  灾损评估(死亡人数、房屋倒塌、经济损失) - 实时灾情
        SIZEUP: -1,
        // 灾损评估(救出人数、转移人数) - 实时灾情
        RESCERTRANSFER: -1,
        // 物资调拨（调拨，到达）
        equipment_dispatch: -1,
        // 进展情况(领导批示)
        SEND_PROGRESS: -1,
        // 现场队伍（队伍调派
        SEND_FIELDTEAM: -1,
        // 赶赴队伍/待命队伍（队伍调派
        SEND_HURRYTEAM: -1,
        // 人物信息 - 当地政府
        SEND_PERSON_INFO: -1,
        // 队伍需求（需求队伍人数）
        SEND_RESCUEDEMAND: -1,
        // 物资需求（重点物资需求）
        goods_dispatch: -1,
        // 人员安置
        SEND_PERSONNELPLACEMENT: -1,
        // 电力受损
        power: -1,
        // 重点设施（风险隐患排查）
        gkyh: -1,
        // 绿色通道 道路损毁 交通管制
        traffic: -1,
        // 非常态左侧滚动信息（跑马灯）
        fontScl: -1,
        // 领导批示
        SEND_commanddata: -1,
        // 重点事件
        tabSheng: -1,
        // 余震
        SEND_AFTERSHOCK_INFO: -1,
        // 失联区域
        outofcontact: -1,
        // 上传烈度
        UPLOADSHP: -1,
        // 现场回传
        liveSendBack: -1,
        // 人员转移  防御准备那里用到了，
        // 这里把这个换成对象，因为在推送事件的时候，eventId和personnel_transfer 可能会同时发生改变，会有bug
        // 这里换成对象后，就可以直接对这个对象进行监听，不用在对eventId监听，造成更坑的bug
        personnel_transfer: {
            value: -1,
        },
        // 船舶转移  防御准备那里用到了，
        // 这里把这个换成对象，因为在推送事件的时候，eventId和personnel_transfer 可能会同时发生改变，会有bug
        // 这里换成对象后，就可以直接对这个对象进行监听，不用在对eventId监听，造成更坑的bug
        ship_transfer:  {
            value: -1,
        },
        // 救灾工作情况
        rescue_disaster:  {
            value: -1,
        },
        // 自然灾害灾损情况
        nature_disaster:  {
            value: -1,
        },
        // 判断行政区划是否有选中的数据
        activeShow: '',
        eventPushData: {
          derivativeEvents: [], // 衍生事件
      },
    },
    mutations: {
        updateRoutePoint(content: any, data: any) {
            // 当为常态的时候，要对searchYp的有和无，对经纬度进行处理
            if (!content.eventId) {
                content.eventLocation.EventLat = data.targetPoint ? data.targetPoint.EventLat : ''; // 纬度
                content.eventLocation.EventLon = data.targetPoint ? data.targetPoint.EventLon : ''; // 经度
            }
        },
        updateGeometryShareObj(content: any, data: any) {
            content.geometrySelectShareObj = {
                districtCode: data.districtCode, // "110000"
                districtName: data.districtName, // "北京市"
            };
        },
        setDistrict(content: any, data: any) {
            content.district = data;
            content.geometrySelectShareObj = {
                districtCode: data.code, // "110000"
                districtName:  data.name, // "北京市"
            };
        },
        // 通过点击工具条查询后，给相应的key赋值
        setLocationKey(content: any, key: any) {
            content[key] = 0;
        },

        /**
         *  通过推送 给对应的值进行赋值
        */
        composex(content: any, data: any) {
            const arr = ['personnel_transfer', 'ship_transfer', 'rescue_disaster', 'nature_disaster'];
            if (arr.includes(data)) { // 当为对象
                if (content[data].value === -1) {
                    content[data] = {
                        value: 1,
                    };
                } else {
                    content[data] = {
                        value: content[data].value + 1,
                    };
                }
            } else { // 原来那种直接进行赋值的
                 // 第一个进行累加
                if (content[data] === -1) {
                    content[data] = 1;
                } else {
                    content[data]++;
                }
            }
        },
        // 定位
        eventLocation(content: any, data: any) {
            content.eventLocation = Object.assign(content.eventLocation, data); // 经度  维度 地址
            content.eventLocation.EventLatLonStr = '' + data.EventLat + data.EventLon + (+new Date()); // 为了区分同一个经纬度的定位
            // content.eventId = data.eventid;
            content.geometrySelectShareObj = {
                districtCode: '', // "110000"
                districtName: '', // "北京市"
            };
            content.casualties = -1;
            // 房屋损毁 - 实时灾情
            content.housesh = -1;
            //  灾损评估(死亡人数、房屋倒塌、经济损失) - 实时灾情
            content.SIZEUP = -1;
            // 灾损评估(救出人数、转移人数) - 实时灾情
            content.RESCERTRANSFER = -1;
            // 物资调拨（调拨，到达）
            content.equipment_dispatch = -1;
            // 进展情况(领导批示)
            content.SEND_PROGRESS = -1;
            // 现场队伍（队伍调派
            content.SEND_FIELDTEAM = -1;
            // 赶赴队伍/待命队伍（队伍调派
            content.SEND_HURRYTEAM = -1;
            // 人物信息 - 当地政府
            content.SEND_PERSON_INFO = -1;
            // 队伍需求（需求队伍人数）
            content.SEND_RESCUEDEMAND = -1;
            // 物资需求（重点物资需求）
            content.goods_dispatch = -1;
            // 人员安置
            content.SEND_PERSONNELPLACEMENT = -1;
            // 电力受损
            content.power = -1;
            // 重点设施（风险隐患排查）
            content.gkyh = -1;
            // 绿色通道 道路损毁 交通管制
            content.traffic = -1;
            // 非常态左侧滚动信息（跑马灯）
            content.fontScl = -1;
            // 领导批示
            content.SEND_commanddata = -1;
            // 重点事件
            content.tabSheng = -1;
            // 余震
            content.SEND_AFTERSHOCK_INFO = -1;
            // 失联
            content.outofcontact = -1;
            // 现场回传
            content.liveSendBack = -1;
            // 人员转移  防御准备那里用到了，
            content.personnel_transfer =  {
                value: -1,
            };
            // 船舶转移  防御准备那里用到了，
            content.ship_transfer = {
                value: -1,
            };
            // 救灾工作情况
            content.rescue_disaster = {
                value: -1,
            };
            // 自然灾害灾损情况
            content.nature_disaster = {
                value: -1,
            };
        },
        // 事件信息
        eventInfoAll(content: any, data: any) {
            data.EventLatLonStr = content.eventLocation.EventLatLonStr; // 为了同步这次定位
            content.eventLocation = data;
            content.geometrySelectShareObj = {
                districtCode: '', // "110000"
                districtName: '', // "北京市"
            };
            // content.eventLocation.EventLatLonStr = '' + data.EventLat + data.EventLon;
            content.eventId = data.eventId || data.eventid;
            content.casualties = -1;
            // 房屋损毁 - 实时灾情
            content.housesh = -1;
            //  灾损评估(死亡人数、房屋倒塌、经济损失) - 实时灾情
            content.SIZEUP = -1;
            // 灾损评估(救出人数、转移人数) - 实时灾情
            content.RESCERTRANSFER = -1;
            // 物资调拨（调拨，到达）
            content.equipment_dispatch = -1;
            // 进展情况(领导批示)
            content.SEND_PROGRESS = -1;
            // 现场队伍（队伍调派
            content.SEND_FIELDTEAM = -1;
            // 赶赴队伍/待命队伍（队伍调派
            content.SEND_HURRYTEAM = -1;
            // 人物信息 - 当地政府
            content.SEND_PERSON_INFO = -1;
            // 队伍需求（需求队伍人数）
            content.SEND_RESCUEDEMAND = -1;
            // 物资需求（重点物资需求）
            content.goods_dispatch = -1;
            // 人员安置
            content.SEND_PERSONNELPLACEMENT = -1;
            // 电力受损
            content.power = -1;
            // 重点设施（风险隐患排查）
            content.gkyh = -1;
            // 绿色通道 道路损毁 交通管制
            content.traffic = -1;
            // 非常态左侧滚动信息（跑马灯）
            content.fontScl = -1;
            // 领导批示
            content.SEND_commanddata = -1;
            // 重点事件
            content.tabSheng = -1;
            // 余震
            content.SEND_AFTERSHOCK_INFO = -1;
            // 现场回传
            content.liveSendBack = -1;
            // 人员转移  防御准备那里用到了，
            content.personnel_transfer = {
                value: -1,
            };
            // 船舶转移  防御准备那里用到了，
            content.ship_transfer = {
                value: -1,
            };
            // 救灾工作情况
            content.rescue_disaster = {
                value: -1,
            };
            // 自然灾害灾损情况
            content.nature_disaster = {
                value: -1,
            };
        },
        // 进入专题按钮
        intoSpecial(content: any, data: any) {
            if (data.EventDesc === '地震') {
                content.dizhensubao = !content.dizhensubao;
            }
            // if ( (!data.radius ) || (!data.radius.trim())) {
            //     data.radius = '5,10,20,50'; // 当没有经验圈的时候，要默认值
            // }
            content.eventLocation = data;
            content.geometrySelectShareObj = {
                districtCode: '', // "110000"
                districtName: '', // "北京市"
            };
            // content.eventLocation.EventLatLonStr = '' + data.EventLat + data.EventLon;
            content.eventLocation.EventLatLonStr = '' + data.EventLat + data.EventLon + (+new Date()); // 为了区分同一个经纬度的定位
            content.eventId = data.eventId || data.eventid;
            content.casualties = -1;
            // 房屋损毁 - 实时灾情
            content.housesh = -1;
            //  灾损评估(死亡人数、房屋倒塌、经济损失) - 实时灾情
            content.SIZEUP = -1;
            // 灾损评估(救出人数、转移人数) - 实时灾情
            content.RESCERTRANSFER = -1;
            // 物资调拨（调拨，到达）
            content.equipment_dispatch = -1;
            // 进展情况(领导批示)
            content.SEND_PROGRESS = -1;
            // 现场队伍（队伍调派
            content.SEND_FIELDTEAM = -1;
            // 赶赴队伍/待命队伍（队伍调派
            content.SEND_HURRYTEAM = -1;
            // 人物信息 - 当地政府
            content.SEND_PERSON_INFO = -1;
            // 队伍需求（需求队伍人数）
            content.SEND_RESCUEDEMAND = -1;
            // 物资需求（重点物资需求）
            content.goods_dispatch = -1;
            // 人员安置
            content.SEND_PERSONNELPLACEMENT = -1;
            // 电力受损
            content.power = -1;
            // 重点设施（风险隐患排查）
            content.gkyh = -1;
            // 绿色通道 道路损毁 交通管制
            content.traffic = -1;
            // 非常态左侧滚动信息（跑马灯）
            content.fontScl = -1;
            // 领导批示
            content.SEND_commanddata = -1;
            // 现场回传
            content.liveSendBack = -1;
            // 人员转移  防御准备那里用到了，
            content.personnel_transfer = {
                value: -1,
            };
            // 船舶转移  防御准备那里用到了，
            content.ship_transfer = {
                value: -1,
            };
            // 救灾工作情况
            content.rescue_disaster = {
                value: -1,
            };
            // 自然灾害灾损情况
            content.nature_disaster = {
                value: -1,
            };
        },
        // 经验圈范围
        UpdateExperienceCircleRadius(content: any, data: any) {
            content.eventLocation.radius = data;
        },
        // 设置面
        UPDATE_GEOMETRY(content: any, data: any) {
            content.eventLocation.EventLat = parseFloat(data.geom.coordinates[1]); // 纬度（不可为空）;
            content.eventLocation.EventLon = parseFloat(data.geom.coordinates[0]); // 经度（不可为空）;
            content.eventLocation.geometry = JSON.stringify(data.geometry);
            content.eventLocation.TyphoonLatLonStr = !content.eventLocation.TyphoonLatLonStr;
        },
        CALL_BACK_STATE(content: any) {
            content.district = {
            code: '',
            name: '',
            };
            content.eventLocation = {
              /*inEventInfoPopup: { // 这里是为了储存安全生产进入处置后详情窗的信息, 为了展示详情窗 在StudtToolHalf.vue 的mounted里面
                popupData: null, // 安全生产专题 危化品出详情窗版
                popupType: '',
              },*/
              curLocationKey: '',
              EventLat: '',
              EventAddr: '',
              EventLon: '',
              EventLatLonStr: '',
              radius: '',
              EqLevel: '',
              EventDesc: '',
              EventLevel: '',
              EventTime: '',
              EventTimes: '',
              EventTit: '',
              EventType: '',
              EventIcon: '',
            };
            content.geometrySelectShareObj = {
                districtCode: '', // "110000"
                districtName: '', // "北京市"
            };
            // 地震速报
            content.dizhensubao = false;
            // 事件id
            content.eventId = '';
            // 人员伤亡 - 实时灾情
            content.casualties = -1;
            // 房屋损毁 - 实时灾情
            content.housesh = -1;
            //  灾损评估(死亡人数、房屋倒塌、经济损失) - 实时灾情
            content.SIZEUP = -1;
            // 灾损评估(救出人数、转移人数) - 实时灾情
            content.RESCERTRANSFER = -1;
            // 物资调拨（调拨，到达）
            content.equipment_dispatch = -1;
            // 进展情况(领导批示)
            content.SEND_PROGRESS = -1;
            // 现场队伍（队伍调派
            content.SEND_FIELDTEAM = -1;
            // 赶赴队伍/待命队伍（队伍调派
            content.SEND_HURRYTEAM = -1;
            // 人物信息 - 当地政府
            content.SEND_PERSON_INFO = -1;
            // 队伍需求（需求队伍人数）
            content.SEND_RESCUEDEMAND = -1;
            // 物资需求（重点物资需求）
            content.goods_dispatch = -1;
            // 人员安置
            content.SEND_PERSONNELPLACEMENT = -1;
            // 电力受损
            content.power = -1;
            // 重点设施（风险隐患排查）
            content.gkyh = -1;
            // 绿色通道 道路损毁 交通管制
            content.traffic = -1;
            // 非常态左侧滚动信息（跑马灯）
            content.fontScl = -1;
            // 领导批示
            content.SEND_commanddata = -1;
            // 重点事件
            content.tabSheng = -1;
            // 余震
            content.SEND_AFTERSHOCK_INFO = -1;
            // 失联区域
            content.outofcontact = -1;
            // 上传烈度
            content.UPLOADSHP = -1;
            // 现场回传
            content.liveSendBack = -1;
            // 人员转移  防御准备那里用到了，
            content.personnel_transfer = {
                value: -1,
            };
            // 船舶转移  防御准备那里用到了，
            content.ship_transfer = {
                value: -1,
            };
            // 救灾工作情况
            content.rescue_disaster = {
                value: -1,
            };
            // 自然灾害灾损情况
            content.nature_disaster = {
                value: -1,
            };
        },
        changeChecked(content: any, data: any) {
          content.activeShow = data;
        },
        updateEventPushData(content: any, data: any) {
          // if (data.key && data.key === 'derivativeEvents') {
          //     // 衍生事件，推送多次，叠加不覆盖
          //     const list = data.event ? data.event : data.data;
          //     list.map((item: any) => {
          //         content.eventPushData[data.key].push(item);
          //     });
          // }
          let dataType: any = null;
          if (content.eventPushData[data.key] instanceof Array) {
              dataType = [];
          } else {
              dataType = {};
          }
          content.eventPushData[data.key] = data.event || data.data || dataType;
        },
        },
    actions: {
        callbackState(context: any) {
            context.commit('CALL_BACK_STATE');
        },
        UpdateGeometry(context: any , config: any) {
            context.commit('UPDATE_GEOMETRY', config);
        },
    },
};
