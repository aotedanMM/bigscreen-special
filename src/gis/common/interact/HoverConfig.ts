// 地图划过显示名称及高亮配置
import { SymbolTemplate, SymbolMap } from '../../SymbolConfig';
import teamTypeCode from '../../disasterJudge/teamDispatch/TeamType';
const TEMPLATES: any = {
    DEFAULT: {
        // 获取展示的属性
        nameFn: (featureType: any, data: any) => {
            return data.name;
        },
        highlight: {
            // 默认为true，为false时不显示高亮
            show: true,
            symbol: SymbolTemplate.hlSymbol.ICON1,
            shlSymbol: SymbolTemplate.hlSymbol.ICONsfh,
            firehouse: SymbolTemplate.hlSymbol.Firehouse,
            cunhlSymbol: SymbolTemplate.hlSymbol.CUNSYMBOLHL,
            // 获取闪烁图标key
            iconFn: SymbolMap.DEFAULT.iconFn,
            blink: {
                enable: false,
            },
        },
        highlight2: {
            // 默认为true，为false时不显示高亮
            show: true,
            symbol: SymbolTemplate.hlSymbol.ICON3,
            // 获取闪烁图标key
            iconFn: SymbolMap.DEFAULT.iconFn,
            blink: {
                enable: false,
            },
        },
        highlight3: {
            // 默认为true，为false时不显示高亮
            show: true,
            symbol: SymbolTemplate.hlSymbol.ICONFire,
            // 获取闪烁图标key
            iconFn: SymbolMap.DEFAULT.iconFn,
            blink: {
                enable: false,
            },
        },
        highlight4: {
            // 默认为true，为false时不显示高亮
            show: true,
            symbol: SymbolTemplate.hlSymbol.ICONFORWARD,
            // 获取闪烁图标key
            iconFn: SymbolMap.DEFAULT.iconFn,
            blink: {
                enable: false,
            },
        },
    },
};
/**
 * 资源映射表
 */
const CONFIG: any = {
    // 常态资源
    'resource_': {
        // 显示的名称字段名
        map: {
            'resource_ANJIAN_DAGCHEMENT※DangerousChemical': SymbolMap.HAZARDOUS,
        },
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                if (CONFIG.resource_.map[featureType]) {
                    return CONFIG.resource_.map[featureType].iconHlFn('productionindustry', data);
                } else {
                    return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
                }
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'resource_fireworkhouse': {
        // 显示的名称字段名
        map: {
            'resource_ANJIAN_DAGCHEMENT※DangerousChemical': SymbolMap.HAZARDOUS,
        },
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.firehouse,
            iconFn: (featureType: any, data: any) => {
                if (CONFIG.resource_.map[featureType]) {
                    return CONFIG.resource_.map[featureType].iconHlFn('productionindustry', data);
                } else {
                    return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
                }
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'distribute_metalnonmetal': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: SymbolMap.ANJIAN_METALNONMETAL.hlSymbol,
            iconFn: SymbolMap.ANJIAN_METALNONMETAL.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'distribute_ANJIAN_OILGASFIELD※01': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: SymbolMap.ANJIAN_OILGASFIELD1.hlSymbol,
            iconFn: SymbolMap.ANJIAN_OILGASFIELD1.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'distribute_ANJIAN_OILGASFIELD※02': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: SymbolMap.ANJIAN_OILGASFIELD2.hlSymbol,
            iconFn: SymbolMap.ANJIAN_OILGASFIELD2.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'resource_airport': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight2.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'resource_for_watersource': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'resource_for_waterport': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'resource_FOR_WATERSOURCE※04': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'resource_forestfireteam': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'resource_firepreventionrepository': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'resource_for_watersourceport': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'for_watersourceport': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'firepreventionrepository': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'forestfireteam': {
        // 显示的名称字段名
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight3.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('resource_')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 常态预警
    'warnInfor': {
        nameFn: (featureType: any, data: any) => {
            return data.cont;
        },
        highlight: {
            show: true,
            symbol: SymbolMap.EARLYWARNING.hlSymbol,
            iconFn: SymbolMap.EARLYWARNING.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'historyeq': {
        marginbottom: 70, // 底部transform比例
        nameFn: (featureType: any, data: any) => {
            data.origin_time = data.origin_time ? data.origin_time : '';
            data.magnitude = data.magnitude ? data.magnitude : '';
            let date = '';
            let formateDate = '';
            if (data.origin_time !== '') {
                date = data.origin_time.split(' ')[0].split('-');
                formateDate = date[0] + '年' + date[1] + '月' + date[2] + '日';
            }
            return formateDate + ' ' + data.magnitude + '级';
        },
        highlight: {
            show: true,
            symbol: SymbolMap.HISTORYEARTH.hlSymbol,
            iconFn: SymbolMap.HISTORYEARTH.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'airteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: SymbolMap.AIRTEAM.hlSymbol,
            iconFn: SymbolMap.AIRTEAM.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'disaster_judge_resource__majorDanger': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: SymbolMap.MAJDANGER.hlSymbol,
            iconFn: SymbolMap.MAJDANGER.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 灾情研判资源
    // 学校
    'disaster_judge_resource__school__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.SCHOOL.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 机场
    'disaster_judge_resource__airport__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight2.symbol,
            iconFn: SymbolMap.AIRPORT.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 医院
    'disaster_judge_resource__hospital__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.HOSPITAL.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 车站
    'disaster_judge_resource__railwaystation__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.RAILWAYSTATION.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 危化企业
    'disaster_judge_resource__hazardous__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.HAZARDOUS.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 煤矿
    'disaster_judge_resource__coalMine__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight2.symbol,
            iconFn: SymbolMap.COALMINE.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 非煤
    'disaster_judge_resource__mine__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.NONCOALMINE.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 烟花爆竹
    'disaster_judge_resource__explosive__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.FIREWORKENT.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 水库大坝
    'disaster_judge_resource__reservoir__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.RESRRVOIR.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 储备库
    'disaster_judge_resource__repository__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.REPOSITORY.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 码头
    'disaster_judge_resource__portwharf__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.PORTWHARF.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 核设施
    'disaster_judge_resource__nuclear__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.NUCLEARINFO.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 信息员
    'disaster_judge_resource__disinfoper__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.DISASTERPER.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 滑坡
    'disaster_judge_resource__landslide__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.LANDSLIDE.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 泥石流
    'disaster_judge_resource__debrisflow__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.DEBRISFLOW.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 山体崩塌
    'disaster_judge_resource__mountaincollapse__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.MOUNTAINCOLLAPSED.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 地面塌陷
    'disaster_judge_resource__bottomcollapse__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.BOTTOMCOLLAPSE.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 地裂缝
    'disaster_judge_resource__groundfissure__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.GROUNDFISSURE.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 地面沉降
    'disaster_judge_resource__landsubsidence__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.LANDSUBSIDENCE.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 不稳定斜坡
    'disaster_judge_resource__unstableslopes__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: SymbolMap.UNSTABLESLOPES.iconHlFn,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 救援队
    'disaster_judge_resource__RescueTeam※03__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: (featureType: any, data: any) => {
                let symbol = TEMPLATES.DEFAULT.highlight.symbol;
                const type = featureType.split('__')[1];
                if (type === 'RescueTeam※03') {
                    let teamtypecode = '';
                    const teamname = data.name;
                    const rescuetypecode = data.rescuetypecode;
                    teamtypecode = rescuetypecode;
                    if (rescuetypecode === 'T003' || rescuetypecode === 'T004') {
                        if (teamname.indexOf('（前突）') !== -1) {
                            teamtypecode += 'forward';
                            symbol = TEMPLATES.DEFAULT.highlight4.symbol;
                        }
                    }
                }
                return symbol;
            },
            iconFn: (featureType: any, data: any) => {
                let symbol: any = null;
                const type = featureType.split('__')[1];
                if (type === 'RescueTeam※03') {
                    let teamtypecode = '';
                    const teamname = data.name;
                    const rescuetypecode = data.rescuetypecode;
                    teamtypecode = rescuetypecode;
                    if (rescuetypecode === 'T003' || rescuetypecode === 'T004') {
                        if (teamname.indexOf('（前突）') !== -1) {
                            teamtypecode += 'forward';
                        }
                    }
                    data.teamtypecode = teamtypecode;
                    symbol = SymbolMap.RESCUETEAM.iconHlFn(type, data, 'teamtypecode');
                    // const symbolObj = Util.toJSON(symbolMapper.fwSymbol(type, data, 'teamtypecode'));
                    // symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(type, data, 'teamtypecode')];
                } else {
                    symbol = SymbolMap.DEFAULT.iconHlFn(type, data);
                }
                return symbol;
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 其他资源
    'disaster_judge_resource__': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.split('__')[1], data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 力量调度
    'disaster_team_': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                const teamtypeKey = teamTypeCode[data.rescuetypecode];
                return SymbolMap.DEFAULT.iconHlFn(teamtypeKey, data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 直升机取水点
    'watersource_air_': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                const teamtypeKey = teamTypeCode[data.rescuetypecode];
                return SymbolMap.DEFAULT.iconHlFn(teamtypeKey, data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 取水码头
    'watersource': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                const teamtypeKey = teamTypeCode[data.rescuetypecode];
                return SymbolMap.DEFAULT.iconHlFn(teamtypeKey, data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 取水点加取水码头
    'watersource_puf': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                const teamtypeKey = teamTypeCode[data.rescuetypecode];
                return SymbolMap.DEFAULT.iconHlFn(teamtypeKey, data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 灾情研判行政区划点 district_point_town/district_point_county
    // 'district_point_': {
    //     nameFn: (featureType: any, data: any) => {
    //         return data.tag.name;
    //     },
    //     highlight: {
    //         show: true,
    //         symbol: TEMPLATES.DEFAULT.highlight.symbol,
    //         iconFn: SymbolMap.DISTRICT.iconHlFn,
    //         blink: TEMPLATES.DEFAULT.highlight.blink,
    //     },
    // },
    // 指挥调度
    'communicationEquiphcLayer': {
        nameFn: (featureType: any, data: any) => {
            const map: any = {
                communicationEquiphcLayer01: 'souceName',
                communicationEquiphcLayer02: 'owner_name',
                communicationEquiphcLayer03: 'username',
                communicationEquiphcLayer04: '',
                communicationEquiphcLayer05: 'cphm',
                communicationEquiphcLayer06: 'ryxm',
            };
            const field: any = map[featureType];
            return data[field];
        },
        highlight: {
            show: false,
        },
    },
    // 搜索里的分布
    'distribute_RescueTeam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: (featureType: any, data: any) => {
                return SymbolMap.SEARCHRESCUETEAM.hlSymbol('', featureType.replace('distribute_', ''), data.peoplenum);
            },
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.SEARCHRESCUETEAM.iconHlFn('', featureType.replace('distribute_', ''), data.peoplenum);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 搜索里的分布
    'distribute_': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('distribute_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 周边查询救援队
    'nearby_RescueTeam※03': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.RESCUETEAM.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 周边查询信息员
    'nearby_DisasterPer※01': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'district_point_cun': {
        marginbottom: 70, // 底部transform比例
        nameFn: (featureType: any, data: any) => {
            return data.tag.name;
        },
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.cunhlSymbol,
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'district_point_town': {
        marginbottom: 120, // 底部transform比例
        marginleft: 200,
        nameFn: (featureType: any, data: any) => {
            return data.tag.name;
        },
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            blink: TEMPLATES.DEFAULT.highlight.blink,
            iconFn: () => {
                return SymbolMap.DISTRICT.iconHlFn('district_point_town');
            },
        },
    },
    // 周边查询学校
    'nearby_bas_school': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 周边查询学校
    'nearby_hospital': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_government': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_market': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_bazaar': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_Gymnasium': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_tourist': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_culturalvenues': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_powerfacilities': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_supwatfacil': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_powerfacil': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_gasfacil': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_sluice': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_gasstation': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_floodteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_fireteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_transportationteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_forestfireteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_hazardousteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_mineteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_nonmineteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_corecompetenceteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_powerteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_mobileteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_gasteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_environmentteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_salvageteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_searescueteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_shipspillteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_healthyteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_portrescueteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_portpassengerteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_portconstructionteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_buildingemergencyteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_passengeremergencyteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_emergencytransportteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_snowteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_equipteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_civilianteam': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'nearby_shelter': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.DEFAULT.iconHlFn(featureType.replace('nearby_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 灾情统计
    'disaster_sta_point_type': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: () => {
                return SymbolMap.DISTRICT.iconHlFn('district_point_town');
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 监测预警
    'monitorWarning_': {
        nameFn: TEMPLATES.DEFAULT.nameFn,
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap[featureType].iconHlFn(featureType, data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 防御准备资源
    'defensiveResource_': {
        nameFn: (featureType: any, data: any) => {
            return data.name;
        },
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.defensiveResource.iconHlFn(featureType.replace('defensiveResource_', ''), data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    // 视频监控
    'VideoFeaturelayer': {
        nameFn: (featureType: any, data: any) => {
            return data.name;
        },
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.videoFeaturelayer.iconHlFn(featureType, data);
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    'TerminalLayer': {
        nameFn: (featureType: any, data: any) => {
            return data.userName;
        },
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.terminalLayer.iconHlFn();
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
    //
    'mountainFlood_Layer': {
        nameFn: (featureType: any, data: any) => {
            return data.name;
        },
        highlight: {
            show: true,
            symbol: TEMPLATES.DEFAULT.highlight.symbol,
            iconFn: (featureType: any, data: any) => {
                return SymbolMap.mountainFlood_Layer.iconHlFn();
            },
            blink: TEMPLATES.DEFAULT.highlight.blink,
        },
    },
};
// 事件信息
const eventConfig: any = {
    // 显示的名称字段名
    nameFn: (featureType: any, data: any) => {
        return data.title;
    },
    highlight: {
        show: true,
        symbol: TEMPLATES.DEFAULT.highlight.symbol,
        iconFn: SymbolMap.EVENT.iconHlFn,
        blink: TEMPLATES.DEFAULT.highlight.blink,
    },
};
CONFIG.eventpoint = eventConfig;
CONFIG.事故灾难 = eventConfig;
CONFIG.社会安全事件 = eventConfig;
CONFIG.公共卫生事件 = eventConfig;
CONFIG.自然灾害 = eventConfig;

export default CONFIG;
