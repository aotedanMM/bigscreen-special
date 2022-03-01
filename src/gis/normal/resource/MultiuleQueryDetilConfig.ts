
// 处理详情查询的映射
const MultiuleQueryDateilConfig: any = {
    // 水电站
    bas_hydstation: {
        fileFn: (data: any) => {
            return 'and hydstationid=\'' + data.id + '\'';
        },
    },
    // 堤坝
    bas_dam: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
    // 核电站
    bas_nuclearinfo: {
        fileFn: (data: any) => {
            return 'and nuclearid=\'' + data.id + '\'';
        },
    },
    // 加油站
    egis_gas_station: {
        fileFn: (data: any) => {
            return 'and fid=\'' + data.id + '\'';
        },
    },
    // // 商超
    bas_market: {
        fileFn: (data: any) => {
            return 'and marketid=\'' + data.id + '\'';
        },
    },
    // // 宾馆饭店
    bas_hotel: {
        fileFn: (data: any) => {
            return 'and hotelid=\'' + data.id + '\'';
        },
    },
    // 文化场所
    bas_theater: {
        fileFn: (data: any) => {
            return 'and theaterid=\'' + data.id + '\'';
        },
    },
    // 学校
    bas_school: {
        fileFn: (data: any) => {
            return 'and schoolid=\'' + data.id + '\'';
        },
    },
     // 学校
     railwaystation: {
        fileFn: (data: any) => {
            return 'and stationid=\'' + data.id + '\'';
        },
    },
     // 学校
     airport: {
        fileFn: (data: any) => {
            return 'and airportid=\'' + data.id + '\'';
        },
    },
     // 学校
     portwharf: {
        fileFn: (data: any) => {
            return 'and portwharfid=\'' + data.id + '\'';
        },
    },
    // 海油 02
    anjian_oilgasfieldCNOOC: {
        fileFn: (data: any) => {
            return 'and oilgasfieldid=\'' + data.id + '\'';
        },
    },
    // 陆油 01
    anjian_oilgasfieldCRUDE: {
        fileFn: (data: any) => {
            return 'and oilgasfieldid=\'' + data.id + '\'';
        },
    },
    // 战保
    jyxx_tea_rescue_warbase: {
        fileFn: (data: any) => {
            return 'and rescueid=\'' + data.id + '\'';
        },
    },
    // 滑坡
    landslide: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
    // 泥石流
    debrisflow: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
    // 崩塌
    mountaincollapse: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
     // 塌陷
     bottomcollapse: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
     // 地裂缝
     groundfissure: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
     // 斜坡
     unstableslopes: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
    // 地面沉降
    landsubsidence: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
    // 火山喷发
    volcanoeruption: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
    // 其他地质灾害
    otherdisasters: {
        fileFn: (data: any) => {
            return 'and objectid=\'' + data.id + '\'';
        },
    },
    // 水库
    reservoir: {
        fileFn: (data: any) => {
            return 'and stcd=\'' + data.id + '\'';
        },
    },
    // 仓库
    warehouse: {
        fileFn: (data: any) => {
            return 'and warehouseno=\'' + data.id + '\'';
        },
    },
    // 危化企业
    hazardous: {
        fileFn: (data: any) => {
            return 'and dagchementid=\'' + data.id + '\'';
        },
    },
    // 煤矿
    coalmine: {
        fileFn: (data: any) => {
            return 'and coalid=\'' + data.id + '\'';
        },
    },
    // 尾矿
    mine: {
        fileFn: (data: any) => {
            return 'and wkkid=\'' + data.id + '\'';
        },
    },
    // 烟花爆竹
    explosive: {
        fileFn: (data: any) => {
            return 'and fireworkentid=\'' + data.id + '\'';
        },
    },
     // 重大危险源
     majordanger: {
        fileFn: (data: any) => {
            return 'and dangerid=\'' + data.id + '\'';
        },
    },
    // 避难场所
    shelter: {
        fileFn: (data: any) => {
            return 'and shelterid=\'' + data.id + '\'';
        },
    },
    // 专家
    expert: {
        fileFn: (data: any) => {
            return 'and expertid=\'' + data.id + '\'';
        },
    },
    // 应急管理机构
    emergencypart: {
        fileFn: (data: any) => {
            return 'and vdtid=\'' + data.id + '\'';
        },
    },
     // 医院
     hospital: {
        fileFn: (data: any) => {
            return 'and orgid=\'' + data.id + '\'';
        },
    },
    // 救援队伍
    jyxx_tea_rescue: {
        fileFn: (data: any) => {
            return 'and rescueid=\'' + data.id + '\'';
        },
    },
     // 储备库
     repository: {
        fileFn: (data: any) => {
            return 'and repertoryid=\'' + data.id + '\'';
        },
    },
     // 储备库
     industry: {
        fileFn: (data: any) => {
            return 'and whsmyhbzid=\'' + data.id + '\'';
        },
    },
};
export default MultiuleQueryDateilConfig;
