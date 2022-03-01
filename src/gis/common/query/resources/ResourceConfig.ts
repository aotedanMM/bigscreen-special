/**
 * 资源展示的配置
 */
export default {
    // 预警
    yujing: {
        yujing_default: {
            name: '预警',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3 = 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标 +文字  3 = 图标分级
            symbolType: 3,
            // 显示的文本
            text: '',
            idField: 'id',
            geometryField: ['longitude', 'latitude'],
            // 是否点击闪烁
            blinkOnClick: false,
        },
    },
    // 承灾体
    // TODO 没有房屋情况
    chengzaiti: {
        'emergencypart※01': {
            name: '应急部门',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 1,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'bas_school': {
            name: '学校',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'hospital': {
            name: '医院',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'government': {
            name: '政府机关',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'development※01': {
            name: '住宅区',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'tunnel※01': {
            name: '重点桥梁',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'airport': {
            name: '机场',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'portwharf': {
            name: '港口码头',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'Resrrvoir※01': {
            name: '水库大坝',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'Nuclearinfo※01': {
            name: '核设施',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'powerplant※01': {
            name: '发电站',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'railwaystation': {
            name: '火车站',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'productionindustry': {
            name: '危化品企业',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'coal': {
            name: '煤矿企业',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'tailingpond': {
            name: '尾矿库',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 符号size，1 = 圆的，34*34 不填默认34*46
            symbolSize: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'ANJIAN_FIREWORKENT※01': {
            name: '烟花爆竹企业',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'ANJIAN_ENT_WHSMYHBZ※01': {
            name: '工贸企业',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'metalnonmetal': {
            name: '金属非金属矿山',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'ANJIAN_OILGASFIELD※01': {
            name: '陆油',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'ANJIAN_OILGASFIELD※02': {
            name: '海油',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'majordanger': {
            name: '重大危险源',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'BAS_GEOLOGICHAZARD※01': {
            name: '地质隐患点',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: '',
            // 是否点击闪烁
            blinkOnClick: true,
        },
    },
    // 应急资源
    yingjiziyuan: {
        'transportationteam': {
            name: '消防救援队',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 2,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'floodteam': {
            name: '矿山隧道救援队',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 2,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'fireteam': {
            name: '危险化学品救援队',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 2,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'forestfireteam': {
            name: '森林消防救援队',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 2,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'hazardousteam': {
            name: '地震灾害救援队',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 2,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'mineteam': {
            name: '医疗防疫救援队',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 2,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'nonmineteam': {
            name: '安全水上救援队',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 2,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'corecompetenceteam': {
            name: '社会救援队',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 2,
            // 显示的文本
            text: '${peoplenum}',
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'equipment': {
            name: '矿山装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※02': {
            name: '危化装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※04': {
            name: '森林消防装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※05': {
            name: '制造企业',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※06': {
            name: '地震装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※07': {
            name: '卫生防疫装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※08': {
            name: '水上装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※09': {
            name: '铁路装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※10': {
            name: '电力装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※11': {
            name: '通信装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※14': {
            name: '安全水上装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※15': {
            name: '社会组织装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※16': {
            name: '施工企业装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※17': {
            name: '运输企业装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※18': {
            name: '应急勘测装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※19': {
            name: '医疗装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※20': {
            name: '技指中心装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'v_equipment※03': {
            name: '消防装备',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'ANJIAN_REPERTORY※01': {
            name: '储备库',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'JC_WARBASE※01': {
            name: '战保基地',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'shelter': {
            name: '避难场所',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'DisasterPer※01': {
            name: '灾情信息员',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        'Expert※01': {
            name: '专家',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 3,
            // 符号类型 1 = 简单图标  2 = 图标+文字
            symbolType: 1,
            // 显示的文本
            text: null,
            // 是否点击闪烁
            blinkOnClick: true,
        },
        '人口分布': {
            name: '人口分布',
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3= 行政区划下钻  4 = 热力图
            dType: 4,
        },
    },
};

