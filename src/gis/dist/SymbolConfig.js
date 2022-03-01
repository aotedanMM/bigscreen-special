"use strict";
exports.__esModule = true;
exports.SymbolMap = exports.SymbolTemplate = void 0;
// 所有的图标统一配置
/**
 * 符号配置模板
 */
exports.SymbolTemplate = {
    symbol: {
        ICON1: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 34,
                height: 46,
                offsetX: 17,
                offsetY: 46,
                opacity: '1',
                rotation: '0'
            }
        },
        CUNSYMBOL: {
            type: 'SimpleMarkerSymbol',
            options: {
                borderColor: {
                    a: 200,
                    r: 125,
                    g: 125,
                    b: 125
                },
                fillColor: {
                    a: 200,
                    r: 125,
                    g: 225,
                    b: 125
                },
                borderThickness: 2,
                size: 8,
                offsetX: '2',
                offsetY: '5'
            }
        },
        ICONSENFORE: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 32,
                height: 32,
                offsetX: 16,
                offsetY: 16,
                opacity: '1',
                rotation: '0'
            }
        },
        ICONSENFORERescueTeam: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 50,
                height: 50,
                offsetX: 25,
                offsetY: 25,
                opacity: '1',
                rotation: '0'
            }
        },
        ICONWARNING: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 38,
                height: 44,
                offsetX: 17,
                offsetY: 44,
                opacity: '1',
                rotation: '0'
            }
        },
        // 调派
        ICONDISPATCH: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 90,
                height: 110,
                offsetX: 45,
                offsetY: 55,
                opacity: 1,
                rotation: 0
            }
        },
        // 国家森防
        ICONCOUNTRY: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 40,
                height: 50,
                offsetX: 20,
                offsetY: 56,
                opacity: 1,
                rotation: 0
            }
        },
        // 前突
        ICONFORWARD: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 34,
                height: 46,
                offsetX: 17,
                offsetY: 46,
                opacity: '1',
                rotation: '0'
            }
        },
        // 前突
        ICONFORWARDIFOR: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 44,
                height: 56,
                offsetX: 20,
                offsetY: 56,
                opacity: 1,
                rotation: 0
            }
        },
        // 天气
        ICONWEATHER: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 42,
                height: 30,
                offsetX: 42,
                offsetY: 15,
                opacity: 1,
                rotation: 0
            }
        },
        // 搜索-救援队-1~4级，及对应textsymbol
        ICON2LEVEL1: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 38,
                height: 56,
                offsetX: 19,
                offsetY: 56,
                opacity: 1,
                rotation: 0
            }
        },
        ICON2LEVEL1TEXT: {
            type: 'TextSymbol',
            options: {
                borderColor: {
                    alpha: 255, r: 255, g: 255, b: 255
                },
                borderThickness: 1,
                fontSize: 16,
                fontWeight: 'bold',
                fontFamilyName: '宋体',
                foreground: { alpha: 255, r: 255, g: 255, b: 255 },
                offsetX: 0,
                offsetY: -34
            }
        },
        ICON2LEVEL2: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 45,
                height: 66,
                offsetX: 22,
                offsetY: 66,
                opacity: 1,
                rotation: 0
            }
        },
        ICON2LEVEL2TEXT: {
            type: 'TextSymbol',
            options: {
                borderColor: {
                    alpha: 255, r: 255, g: 255, b: 255
                },
                borderThickness: 1,
                fontSize: 17,
                fontWeight: 'bold',
                fontFamilyName: '宋体',
                foreground: { alpha: 255, r: 255, g: 255, b: 255 },
                offsetX: 0,
                offsetY: -40
            }
        },
        ICON2LEVEL3: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 51,
                height: 74,
                offsetX: 25,
                offsetY: 74,
                opacity: 1,
                rotation: 0
            }
        },
        ICON2LEVEL3TEXT: {
            type: 'TextSymbol',
            options: {
                borderColor: {
                    alpha: 255, r: 255, g: 255, b: 255
                },
                borderThickness: 1,
                fontSize: 17,
                fontWeight: 'bold',
                fontFamilyName: '宋体',
                foreground: { alpha: 255, r: 255, g: 255, b: 255 },
                offsetX: 0,
                offsetY: -44
            }
        },
        ICON2LEVEL4: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 59,
                height: 85,
                offsetX: 29,
                offsetY: 85,
                opacity: 1,
                rotation: 0
            }
        },
        ICON2LEVEL4TEXT: {
            type: 'TextSymbol',
            options: {
                borderColor: {
                    alpha: 255, r: 255, g: 255, b: 255
                },
                borderThickness: 1,
                fontSize: 17,
                fontWeight: 'bold',
                fontFamilyName: '宋体',
                foreground: { alpha: 255, r: 255, g: 255, b: 255 },
                offsetX: 0,
                offsetY: -50
            }
        },
        ICONCAR: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 80,
                height: 80,
                offsetX: 40,
                offsetY: 0,
                opacity: 1,
                rotation: 1
            }
        },
        ICONHOUSESTRUCTURE: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 142,
                height: 105,
                offsetX: 71,
                offsetY: 105,
                opacity: 1,
                rotation: 0
            }
        },
        ICONYUJING: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 32,
                height: 27,
                offsetX: 16,
                offsetY: 24,
                opacity: 1,
                rotation: 0
            }
        },
        ICONYUJINGUNKNOWN: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 64,
                height: 54,
                offsetX: 32,
                offsetY: 27,
                opacity: 1,
                scale: 1,
                rotation: 0
            }
        },
        ICONDZ1: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 14,
                height: 14,
                offsetX: 7,
                offsetY: 7,
                opacity: 1,
                scale: 1,
                rotation: 0
            }
        },
        ICONDZ2: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 24,
                height: 24,
                offsetX: 12,
                offsetY: 12,
                opacity: 1,
                scale: 1,
                rotation: 0
            }
        },
        ICONDZ3: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 34,
                height: 34,
                offsetX: 17,
                offsetY: 17,
                opacity: 1,
                scale: 1,
                rotation: 0
            }
        },
        ICONDZ4: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 44,
                height: 44,
                offsetX: 22,
                offsetY: 22,
                opacity: 1,
                scale: 1,
                rotation: 0
            }
        },
        // ais图标
        ICON_AIS1: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 63,
                height: 22,
                offsetX: 31,
                offsetY: 11,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICON_AIS2: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 37,
                height: 37,
                offsetX: 18,
                offsetY: 18,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICON_AIS3: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 47,
                height: 22,
                offsetX: 24,
                offsetY: 11,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICON_AIS4: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 60,
                height: 21,
                offsetX: 30,
                offsetY: 10,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICON_WeatherWarn: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 42,
                height: 36,
                offsetX: 21,
                offsetY: 18,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        }
    },
    hlSymbol: {
        typhoonfocus: {
            type: 'SimpleMarkerSymbol',
            options: {
                fillColor: {
                    a: 153, r: 255, g: 251, b: 240
                },
                borderColor: {
                    a: 153, r: 128, g: 128, b: 140
                },
                borderThickness: 0.5,
                size: 12
            }
        },
        ICON2: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 66,
                height: 80,
                offsetX: 33,
                offsetY: 80,
                opacity: '1',
                rotation: '0'
            }
        },
        ICON1: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 64,
                height: 70,
                offsetX: 32,
                offsetY: 64,
                opacity: 1,
                rotation: 0
            }
        },
        ICONsh: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 64,
                height: 70,
                offsetX: 34,
                offsetY: 74,
                opacity: 1,
                rotation: 0
            }
        },
        Firehouse: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 64,
                height: 70,
                offsetX: 34,
                offsetY: 35,
                opacity: 1,
                rotation: 0
            }
        },
        ICONFire: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 72,
                height: 72,
                offsetX: 36,
                offsetY: 36,
                opacity: 1,
                rotation: 0
            }
        },
        ICONsfh: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 64,
                height: 70,
                offsetX: 34,
                offsetY: 70,
                opacity: 1,
                rotation: 0
            }
        },
        ICON3: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 56,
                height: 63,
                offsetX: 28,
                offsetY: 63,
                opacity: 1,
                rotation: 0
            }
        },
        ICON4: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 57,
                height: 63,
                offsetX: 28,
                offsetY: 63,
                opacity: 1,
                rotation: 0
            }
        },
        CUNSYMBOLHL: {
            type: 'SimpleMarkerSymbol',
            options: {
                borderColor: {
                    a: 200,
                    r: 255,
                    g: 0,
                    b: 0
                },
                fillColor: {
                    a: 200,
                    r: 125,
                    g: 225,
                    b: 125
                },
                borderThickness: 2,
                size: 8,
                offsetX: '2',
                offsetY: '5'
            }
        },
        ICONFORWARD: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 56,
                height: 65,
                offsetX: 28,
                offsetY: 65,
                opacity: 1,
                rotation: 0
            }
        },
        ICONWARNING: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 85,
                height: 89,
                offsetX: 43,
                offsetY: 70,
                opacity: '1',
                rotation: '0'
            }
        },
        ICONHOUSESTRUCTURE: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 200,
                height: 180,
                offsetX: 100,
                offsetY: 120,
                opacity: 1,
                rotation: 0
            }
        },
        ICONYUJING: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 32,
                height: 27,
                offsetX: 16,
                offsetY: 24,
                opacity: 1,
                rotation: 0
            }
        },
        ICONYUJINGUNKNOWN: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 64,
                height: 54,
                offsetX: 32,
                offsetY: 27,
                opacity: 1,
                scale: 1,
                rotation: 0
            }
        },
        // ais图标
        ICON_AIS1: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 108,
                height: 47,
                offsetX: 54,
                offsetY: 23,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICON_AIS2: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 64,
                height: 64,
                offsetX: 32,
                offsetY: 32,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICON_AIS3: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 87,
                height: 47,
                offsetX: 43,
                offsetY: 23,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICONSENFORE: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 72,
                height: 72,
                offsetX: 36,
                offsetY: 36,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICONSENFORERescueTeam: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 72,
                height: 72,
                offsetX: 36,
                offsetY: 36,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICON_AIS4: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 109,
                height: 45,
                offsetX: 54,
                offsetY: 24,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        },
        ICON_WeatherWarn: {
            type: 'PictureMarkerSymbol',
            options: {
                width: 59,
                height: 51,
                offsetX: 25,
                offsetY: 25,
                opacity: 1,
                rotation: '0',
                source: ''
            }
        }
    }
};
/**
 * 符号配置, 图标key
 */
exports.SymbolMap = {
    // 默认
    DEFAULT: {
        iconFn: function (type, data) {
            return type + "_img";
        },
        iconHlFn: function (type, data) {
            return type + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1,
        countrySymbol: exports.SymbolTemplate.symbol.ICONCOUNTRY
    },
    // 事件信息
    EVENT: {
        iconFn: function (type, data) {
            var typeCode = data.typeCode;
            return "eventa" + typeCode + "_img";
        },
        iconHlFn: function (type, data) {
            var typeCode = data.typeCode;
            return "eventa" + typeCode + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 行政区划点
    DISTRICT: {
        map: {
            district_point_town: 'rescueArea_disoatch_town',
            district_point_county: 'rescueArea_disoatch_county'
        },
        iconFn: function (type, data) {
            return exports.SymbolMap.DISTRICT.map[type] + "_img";
        },
        iconHlFn: function (type, data) {
            return exports.SymbolMap.DISTRICT.map[type] + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        cunsymbol: exports.SymbolTemplate.symbol.CUNSYMBOL,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1,
        cunsymbolhl: exports.SymbolTemplate.hlSymbol.CUNSYMBOLHL
    },
    // 救援队 - 根据类型
    RESCUETEAM: {
        map: {
            RescueTeam120301130000: 'floodteam',
            RescueTeam120301010000: 'fireteam',
            RescueTeam120301030000: 'forestfireteam',
            RescueTeam120301050000: 'hazardousteam',
            RescueTeam120301040000: 'mineteam',
            RescueTeam120301450000: 'nonmineteam',
            RescueTeam120301460000: 'corecompetenceteam',
            RescueTeam120301140000: 'transportationteam',
            RescueTeam120301180000: 'powerteam',
            RescueTeam120301170000: 'mobileteam',
            RescueTeam120301290000: 'gasteam',
            RescueTeam120301200000: 'environmentteam',
            RescueTeam120301230000: 'salvageteam',
            RescueTeam120301090000: 'searescueteam',
            RescueTeam120301470000: 'shipspillteam',
            RescueTeam120301210000: 'healthyteam',
            RescueTeam120301480000: 'portrescueteam',
            RescueTeam120301490000: 'portpassengerteam',
            RescueTeam120301500000: 'portconstructionteam',
            RescueTeam120301120000: 'buildingemergencyteam',
            RescueTeam120301510000: 'passengeremergencyteam',
            RescueTeam120301520000: 'emergencytransportteam',
            RescueTeam120301540000: 'equipteam',
            RescueTeam120301420000: 'civilianteam'
        },
        iconFn: function (type, data, f) {
            var field = 'rescuetypecode';
            if (f) {
                field = f;
            }
            var img = exports.SymbolMap.RESCUETEAM.map["RescueTeam" + data[field]];
            if (img === undefined) {
                var imgsrc = exports.SymbolMap.RESCUETEAM.map["RescueTeamT003forward"] + '_img';
                return imgsrc;
            }
            else {
                var imgsrc = exports.SymbolMap.RESCUETEAM.map["RescueTeam" + data[field]] + '_img';
                return imgsrc;
            }
        },
        iconHlFn: function (type, data, f) {
            var field = 'rescuetypecode';
            if (f) {
                field = f;
            }
            var img = exports.SymbolMap.RESCUETEAM.map["RescueTeam" + data[field]];
            if (img === undefined) {
                var imgsrc = exports.SymbolMap.RESCUETEAM.map["RescueTeamT003forward"] + '_img_hover';
                return imgsrc;
            }
            else {
                var imgsrc = exports.SymbolMap.RESCUETEAM.map["RescueTeam" + data[field]] + '_img_hover';
                return imgsrc;
            }
        },
        fwSymbol: function (type, data, f) {
            var icon = exports.SymbolTemplate.symbol.ICON1;
            if (f) {
                icon = exports.SymbolTemplate.symbol.ICONFORWARD;
            }
            return icon;
        },
        fwSymbolReal: function (type, data, f) {
            var icon = exports.SymbolTemplate.symbol.ICON1;
            if (f) {
                icon = exports.SymbolTemplate.symbol.ICONFORWARDIFOR;
            }
            return icon;
        },
        fwHlSymbol: function (type, data, f) {
            var icon = exports.SymbolTemplate.hlSymbol.ICON1;
            if (f) {
                icon = exports.SymbolTemplate.hlSymbol.ICONFORWARD;
            }
            return icon;
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1,
        shlSymbol: exports.SymbolTemplate.hlSymbol.ICONsh,
        sfhlSymbol: exports.SymbolTemplate.hlSymbol.ICONsfh,
        countrySymbol: exports.SymbolTemplate.symbol.ICONCOUNTRY
    },
    // 历史地震
    HISTORYEARTH: {
        iconFn: function (type, data) {
            switch (true) {
                case (data.magnitude * 1 <= 5):
                    return "HistoryDZ01_img";
                case (data.magnitude * 1 > 5 && data.magnitude * 1 <= 6):
                    return "HistoryDZ02_img";
                case (data.magnitude * 1 > 6 && data.magnitude * 1 <= 7):
                    return "HistoryDZ03_img";
                case (data.magnitude * 1 > 7):
                    return "HistoryDZ04_img";
                default:
                    return "HistoryDZ01_img";
            }
        },
        iconHlFn: function (type, data) {
            switch (true) {
                case (data.magnitude * 1 <= 5):
                    return "HistoryDZ01_img_hover";
                case (data.magnitude * 1 > 5 && data.magnitude * 1 <= 6):
                    return "HistoryDZ02_img_hover";
                case (data.magnitude * 1 > 6 && data.magnitude * 1 <= 7):
                    return "HistoryDZ03_img_hover";
                case (data.magnitude * 1 > 7):
                    return "HistoryDZ04_img_hover";
                default:
                    return "HistoryDZ01_img_hover";
            }
        },
        symbol: function (type, data) {
            switch (true) {
                case (data.magnitude * 1 <= 5):
                    return exports.SymbolTemplate.symbol.ICONDZ1;
                case (data.magnitude * 1 > 5 && data.magnitude * 1 <= 6):
                    return exports.SymbolTemplate.symbol.ICONDZ2;
                case (data.magnitude * 1 > 6 && data.magnitude * 1 <= 7):
                    return exports.SymbolTemplate.symbol.ICONDZ3;
                case (data.magnitude * 1 > 7):
                    return exports.SymbolTemplate.symbol.ICONDZ4;
                default:
                    return exports.SymbolTemplate.symbol.ICONDZ1;
            }
        },
        hlSymbol: function (type, data, f) {
            switch (true) {
                case (data.magnitude * 1 <= 5):
                    return exports.SymbolTemplate.symbol.ICONDZ1;
                case (data.magnitude * 1 > 5 && data.magnitude * 1 <= 6):
                    return exports.SymbolTemplate.symbol.ICONDZ2;
                case (data.magnitude * 1 > 6 && data.magnitude * 1 <= 7):
                    return exports.SymbolTemplate.symbol.ICONDZ3;
                case (data.magnitude * 1 > 7):
                    return exports.SymbolTemplate.symbol.ICONDZ4;
                default:
                    return exports.SymbolTemplate.symbol.ICONDZ1;
            }
        }
    },
    // 航空护林站
    AIRTEAM: {
        iconFn: function (type, data) {
            return "Airteam_img";
        },
        iconHlFn: function (type, data) {
            return "Airteam_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 现场队伍
    THETEAM: {
        iconFn: function (type, data) {
            return "theteam_img";
        },
        iconHlFn: function (type, data) {
            return "theteam_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 现场队伍
    BASECOMMAND: {
        iconFn: function (type, data) {
            return "baseCom_img";
        },
        iconHlFn: function (type, data) {
            return "baseCom_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 学校
    SCHOOL: {
        iconFn: function (type, data) {
            return "bas_school_img";
        },
        iconHlFn: function (type, data) {
            return "bas_school_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 重大危险源
    MAJOR_DANGER: {
        iconFn: function (type, data) {
            return "majordanger_img";
        },
        iconHlFn: function (type, data) {
            return "majordanger_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 防火自然保护地
    forest_fire_prevention_natural_reserve: {
        iconFn: function (type, data) {
            return "forest_fire_prevention_natural_reserve_img";
        },
        iconHlFn: function (type, data) {
            return "forest_fire_prevention_natural_reserve_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 防火重点部位
    fores_fire_prevention_important_place: {
        iconFn: function (type, data) {
            return "fores_fire_prevention_important_place_img";
        },
        iconHlFn: function (type, data) {
            return "fores_fire_prevention_important_place_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 防火装备
    forest_fire_prevention: {
        iconFn: function (type, data) {
            return "forest_fire_prevention_img";
        },
        iconHlFn: function (type, data) {
            return "forest_fire_prevention_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 防火阻隔带信息
    forest_fire_prevention_barrier_strip: {
        iconFn: function (type, data) {
            return "forest_fire_prevention_barrier_strip_img";
        },
        iconHlFn: function (type, data) {
            return "forest_fire_prevention_barrier_strip_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 防火气象监测站
    forest_fire_prevention_meteorological_monitoring_station: {
        iconFn: function (type, data) {
            return "forest_fire_prevention_meteorological_monitoring_station_img";
        },
        iconHlFn: function (type, data) {
            return "forest_fire_prevention_meteorological_monitoring_station_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 金属非金属矿山
    ANJIAN_METALNONMETAL: {
        iconFn: function (type, data) {
            return "metalnonmetal_img";
        },
        iconHlFn: function (type, data) {
            return "metalnonmetal_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON4
    },
    // 油气田-陆油
    ANJIAN_OILGASFIELD1: {
        iconFn: function (type, data) {
            return "ANJIAN_OILGASFIELD\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "ANJIAN_OILGASFIELD\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON4
    },
    // 油气田-海油
    ANJIAN_OILGASFIELD2: {
        iconFn: function (type, data) {
            return "ANJIAN_OILGASFIELD\u203B02_img";
        },
        iconHlFn: function (type, data) {
            return "ANJIAN_OILGASFIELD\u203B02_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON4
    },
    // 机场
    AIRPORT: {
        iconFn: function (type, data) {
            return "airport_img";
        },
        iconHlFn: function (type, data) {
            return "airport_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON3
    },
    // 森防图层
    SENFORE: {
        iconFn: function (type, data) {
            return type + "_img";
        },
        iconHlFn: function (type, data) {
            return type + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICONSENFORE,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICONSENFORE
    },
    // 森防图层
    SENFORERescueTeam: {
        iconFn: function (type, data) {
            return type + "_img";
        },
        iconHlFn: function (type, data) {
            return type + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICONSENFORERescueTeam,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICONSENFORERescueTeam
    },
    // 医院
    HOSPITAL: {
        iconFn: function (type, data) {
            return "hospital_img";
        },
        iconHlFn: function (type, data) {
            return "hospital_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 火车站
    RAILWAYSTATION: {
        iconFn: function (type, data) {
            return "railwaystation_img";
        },
        iconHlFn: function (type, data) {
            return "railwaystation_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 危化企业
    HAZARDOUS: {
        iconFn: function (type, data) {
            return "productionindustry_img";
        },
        iconHlFn: function (type, data) {
            return "productionindustry_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    MAJDANGER: {
        iconFn: function (type, data) {
            return "majordanger_img";
        },
        iconHlFn: function (type, data) {
            return "majordanger_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 煤矿
    COALMINE: {
        iconFn: function (type, data) {
            return "coal_img";
        },
        iconHlFn: function (type, data) {
            return "coal_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON3
    },
    // 煤矿
    NONCOAL: {
        iconFn: function (type, data) {
            return "noncoal_img";
        },
        iconHlFn: function (type, data) {
            return "noncoal_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON3
    },
    // 非煤
    NONCOALMINE: {
        iconFn: function (type, data) {
            return "NON_COALMINE_img";
        },
        iconHlFn: function (type, data) {
            return "NON_COALMINE_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 烟花爆竹
    FIREWORKENT: {
        iconFn: function (type, data) {
            return "ANJIAN_FIREWORKENT\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "ANJIAN_FIREWORKENT\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 水库大坝
    RESRRVOIR: {
        iconFn: function (type, data) {
            return "Resrrvoir\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "Resrrvoir\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 物资储备库
    REPOSITORY: {
        iconFn: function (type, data) {
            switch (data.REPERTORYTYPECODE) {
                case '1':
                    return "Repository\u203B01_img";
                case '2':
                    return "Repository\u203B02_img";
                case '3':
                    return "Repository\u203B03_img";
                case '4':
                    return "Repository\u203B04_img";
                case '5':
                    return "Repository\u203B05_img";
                default:
                    return "Repository\u203B03_img";
            }
        },
        iconHlFn: function (type, data) {
            switch (data.REPERTORYTYPECODE) {
                case '1':
                    return "Repository\u203B01_img_hover";
                case '2':
                    return "Repository\u203B02_img_hover";
                case '3':
                    return "Repository\u203B03_img_hover";
                case '4':
                    return "Repository\u203B04_img_hover";
                case '5':
                    return "Repository\u203B05_img_hover";
                default:
                    return "Repository\u203B03_img_hover";
            }
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 码头
    PORTWHARF: {
        iconFn: function (type, data) {
            return "portwharf_img";
        },
        iconHlFn: function (type, data) {
            return "portwharf_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 核设施
    NUCLEARINFO: {
        iconFn: function (type, data) {
            return "Nuclearinfo\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "Nuclearinfo\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 信息员
    DISASTERPER: {
        iconFn: function (type, data) {
            return "DisasterPer\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "DisasterPer\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 指挥调度-终端设备
    TERMINAL: {},
    // 预警-根据级别区分图标
    EARLYWARNING: {
        map: {
            红色: 'red',
            橙色: 'orange',
            黄色: 'yellow',
            蓝色: 'blue',
            未知: 'gray'
        },
        // signallevel typeCode
        iconFn: function (type, data) {
            var key = exports.SymbolMap.EARLYWARNING.map[data.signallevel] || 'gray';
            return key + "_img";
        },
        iconHlFn: function (type, data) {
            var key = exports.SymbolMap.EARLYWARNING.map[data.signallevel] || 'gray';
            return key + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICONWARNING,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICONWARNING
    },
    // 搜索默认样式
    SEARCHDEFAULT: {
        iconFn: function (type, data) {
            return type + "_img";
        },
        iconHlFn: function (type, data) {
            return type + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1,
        countrySymbol: exports.SymbolTemplate.symbol.ICONCOUNTRY
    },
    // 搜索-队伍
    SEARCHRESCUETEAM: {
        map: function (num) {
            var level = null;
            if (num) {
                if (num < 100) {
                    level = 'one';
                }
                else if (num >= 100 && num < 500) {
                    level = 'two';
                }
                else if (num >= 500 && num < 1000) {
                    level = 'three';
                }
                else if (num >= 1000) {
                    level = 'four';
                }
            }
            else {
                level = 'one';
            }
            var config = {
                one: {
                    text: '_one',
                    picsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL1,
                    textsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL1TEXT,
                    hlsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL1
                },
                two: {
                    text: '_two',
                    picsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL2,
                    textsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL2TEXT,
                    hlsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL2
                },
                three: {
                    text: '_three',
                    picsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL3,
                    textsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL3TEXT,
                    hlsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL3
                },
                four: {
                    text: '_four',
                    picsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL4,
                    textsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL4TEXT,
                    hlsymbol: exports.SymbolTemplate.symbol.ICON2LEVEL4
                }
            };
            return config[level];
        },
        iconFn: function (type, codes, num) {
            var personnum = parseFloat(num);
            var typeCode = codes + exports.SymbolMap.SEARCHRESCUETEAM.map(personnum).text;
            return typeCode + "_img";
        },
        iconHlFn: function (type, codes, num) {
            var personnum = parseFloat(num);
            var typeCode = codes + exports.SymbolMap.SEARCHRESCUETEAM.map(personnum).text;
            return typeCode + "_img_hover";
        },
        symbol: function (type, codes, num) {
            var personnum = parseFloat(num);
            var config = exports.SymbolMap.SEARCHRESCUETEAM.map(personnum);
            return [config.picsymbol, config.textsymbol];
        },
        hlSymbol: function (type, codes, num) {
            var personnum = parseFloat(num);
            var config = exports.SymbolMap.SEARCHRESCUETEAM.map(personnum);
            return config.hlsymbol;
        },
        countrySymbol: exports.SymbolTemplate.symbol.ICONCOUNTRY
    },
    // 搜索-预警通用样式
    SEARCHYUJING: {
        map: {
            colorlevel: {
                红色: '01',
                橙色: '02',
                黄色: '03',
                蓝色: '04'
            }
        },
        iconFn: function (type, data) {
            return data.typeCode + "_" + exports.SymbolMap.SEARCHYUJING.map.colorlevel[data.signallevel] + "_img";
        },
        iconHlFn: function (type, data) {
            return data.typeCode + "_" + exports.SymbolMap.SEARCHYUJING.map.colorlevel[data.signallevel] + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICONYUJING,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICONYUJING
    },
    // 搜索-预警通用样式-无图标时的default
    SEARCHYUJING_UNKNOWN: {
        map: {
            colorlevel: {
                红色: '01',
                橙色: '02',
                黄色: '03',
                蓝色: '04'
            }
        },
        iconFn: function (type, data) {
            if (data.signallevel) {
                return "unknown_" + exports.SymbolMap.SEARCHYUJING_UNKNOWN.map.colorlevel[data.signallevel] + "_img";
            }
            else {
                return "unknown_img";
            }
        },
        iconHlFn: function (type, data) {
            if (data.signallevel) {
                return "unknown_" + exports.SymbolMap.SEARCHYUJING_UNKNOWN.map.colorlevel[data.signallevel] + "_img_hover";
            }
            else {
                return "unknown_img_hover";
            }
        },
        symbol: exports.SymbolTemplate.symbol.ICONYUJINGUNKNOWN,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICONYUJINGUNKNOWN
    },
    // 搜索-车辆
    SEARCHCAR: {
        iconFn: function (type) {
            return type + "_img";
        },
        iconHlFn: function (type) {
            return type + "_img";
        },
        symbol: exports.SymbolTemplate.symbol.ICONCAR,
        hlSymbol: exports.SymbolTemplate.symbol.ICONCAR
    },
    // 搜索-房屋结构
    SEARCHHOUSESTRUCTURE: {
        iconFn: function (type) {
            return "HouseStructure_img";
        },
        iconHlFn: function (type) {
            return "HouseStructure_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICONHOUSESTRUCTURE,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICONHOUSESTRUCTURE
    },
    // 指挥调度
    DISPATCH: {
        iconFn: function (type) {
            return "" + type;
        },
        iconHlFn: function (type) {
            return "" + type;
        },
        symbol: exports.SymbolTemplate.symbol.ICONDISPATCH,
        hlSymbol: exports.SymbolTemplate.symbol.ICONDISPATCH
    },
    // 天气
    WEATHER: {
        iconFn: function (type) {
            return "" + type;
        },
        iconHlFn: function (type) {
            return "" + type;
        },
        symbol: exports.SymbolTemplate.symbol.ICONWEATHER,
        hlSymbol: exports.SymbolTemplate.symbol.ICONWEATHER
    },
    AFTERSHOCK: {
        iconFn: function (type, data) {
            return type + "_img";
        },
        iconHlFn: function (type, data) {
            return type + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 滑坡
    LANDSLIDE: {
        iconFn: function (type, data) {
            return "LANDSLIDE\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "LANDSLIDE\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 泥石流
    DEBRISFLOW: {
        iconFn: function (type, data) {
            return "DEBRISFLOW\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "DEBRISFLOW\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 山体崩塌
    MOUNTAINCOLLAPSED: {
        iconFn: function (type, data) {
            return "MOUNTAINCOLLAPSED\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "MOUNTAINCOLLAPSED\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 地面塌陷
    BOTTOMCOLLAPSE: {
        iconFn: function (type, data) {
            return "BOTTOMCOLLAPSE\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "BOTTOMCOLLAPSE\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 采空塌陷
    EMPTYSUBSIDE: {
        iconFn: function (type, data) {
            return "EMPTYSUBSIDE\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "EMPTYSUBSIDE\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 地裂缝
    GROUNDFISSURE: {
        iconFn: function (type, data) {
            return "GROUNDFISSURE\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "GROUNDFISSURE\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 地面沉降
    LANDSUBSIDENCE: {
        iconFn: function (type, data) {
            return "LANDSUBSIDENCE\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "LANDSUBSIDENCE\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 不稳定斜坡
    UNSTABLESLOPES: {
        iconFn: function (type, data) {
            return "UNSTABLESLOPES\u203B01_img";
        },
        iconHlFn: function (type, data) {
            return "UNSTABLESLOPES\u203B01_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 历史地震
    EAR_HISTORY: {
        iconFn: function (type, data) {
            return "monitorstation_img";
        },
        iconHlFn: function (type, data) {
            return "monitorstation_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 历史地震
    MON_MONITORSTATION_EARTHQUAKE: {
        iconFn: function (type, data) {
            return "monitorstation_img";
        },
        iconHlFn: function (type, data) {
            return "monitorstation_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 超警河道站
    riverStation: {
        iconFn: function (type, data) {
            return "riverStation_img";
        },
        iconHlFn: function (type, data) {
            return "riverStation_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 超汛限水库
    limitOfReservoir: {
        iconFn: function (type, data) {
            return "limitOfReservoir_img";
        },
        iconHlFn: function (type, data) {
            return "limitOfReservoir_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 特大暴雨雨量站
    superRainMeasuringStation: {
        iconFn: function (type, data) {
            return "superRainMeasuringStation_img";
        },
        iconHlFn: function (type, data) {
            return "superRainMeasuringStation_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 大暴雨雨量站
    heavyRainMeasuringStation: {
        iconFn: function (type, data) {
            return "heavyRainMeasuringStation_img";
        },
        iconHlFn: function (type, data) {
            return "heavyRainMeasuringStation_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 暴雨雨量站
    rainMeasuringStation: {
        iconFn: function (type, data) {
            return "rainMeasuringStation_img";
        },
        iconHlFn: function (type, data) {
            return "rainMeasuringStation_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 监测预警 雨情
    monitorWarning_rain: {
        // 水库
        map: {
            无雨: 'monitorWarning_rain_img',
            小雨: 'monitorWarning_rain_img',
            中雨: 'monitorWarning_rain_img',
            大雨: 'monitorWarning_rain_img',
            暴雨: 'monitorWarning_rain_rain_img',
            大暴雨: 'monitorWarning_rain_heavyRain_img',
            特大暴雨: 'monitorWarning_rain_superRain_img',
            redWarning: 'monitorWarning_rain_redWarning_img',
            orangeWarning: 'monitorWarning_rain_orangeWarning_img'
        },
        iconFn: function (type, data) {
            if (data.isValid === '0') {
                return "monitorWarning_rain_isValid_img";
            }
            else if (data.warningSign) {
                return "" + exports.SymbolMap.monitorWarning_rain.map[data.warningSign];
            }
            else if (!data.level && typeof (data.level) !== 'undefined' && data.level !== 0) {
                return "monitorWarning_rain_img";
            }
            else {
                return "" + exports.SymbolMap.monitorWarning_rain.map[data.level];
            }
        },
        iconHlFn: function (type, data) {
            return "" + exports.SymbolMap.monitorWarning_rain.iconFn(type, data) + "_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 监测预警 风情
    monitorWarning_wind: {
        iconFn: function (type, data) {
            if (data.isValid === '0') {
                return "monitorWarning_wind_isValid_img";
            }
            else if (data.overThreshold) {
                return "monitorWarning_wind_overthreshold_img";
            }
            else {
                return "monitorWarning_wind_img";
            }
        },
        iconHlFn: function (type, data) {
            return "" + exports.SymbolMap.monitorWarning_wind.iconFn(type, data) + "_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 监测预警 水情
    monitorWarning_water: {
        // 水库
        reservoir: {
            无预警: 'monitorWarning_water_reservoir',
            超历史最高: 'monitorWarning_water_reservoir_01',
            超正常: 'monitorWarning_water_reservoir_02',
            超汛限: 'monitorWarning_water_reservoir_03',
            超设计: 'monitorWarning_water_reservoir_04'
        },
        river: {
            无预警: 'monitorWarning_water_river_img',
            超保证: 'monitorWarning_water_river_01_img',
            超历史最高: 'monitorWarning_water_river_02_img',
            超警戒: 'monitorWarning_water_river_03_img'
        },
        iconFn: function (type, data) {
            if (data.type === 'river') {
                if (data.isValid === '0') {
                    return "monitorWarning_water_river_isValid_img";
                }
                else if (data.warning === '') {
                    return "monitorWarning_water_river_img";
                }
                else {
                    return "" + exports.SymbolMap.monitorWarning_water.river[data.warning];
                }
            }
            else if (data.type === 'reservoir') {
                if (data.isValid === '0') {
                    return "monitorWarning_water_reservoir_isValid_" + data.typeName + "_img";
                }
                else if (data.warning === '' && data.waterLevel !== '满库') {
                    return "monitorWarning_water_reservoir_" + data.typeName + "_img";
                }
                else if (data.waterLevel === '满库') {
                    return "monitorWarning_water_reservoir_01_" + data.typeName + "_img";
                }
                else {
                    // let level = '';
                    // if (data.warning.includes('超历史最高')) {
                    //     level = '01';
                    // } else if (data.warning.includes('超设计')) {
                    //     level = '02';
                    // } else if (data.warning.includes('超正常')) {
                    //     level = '03';
                    // } else if (data.warning.includes('超汛限')) {
                    //     level = '04';
                    // }
                    // if (data.waterLevel === '满库') {
                    //     level = '01';
                    // }
                    // return `${SymbolMap.monitorWarning_water.reservoir[data.warning]}_${data.typeName}_img`;
                    // 告警全部显示红色
                    return "monitorWarning_water_reservoir_01_" + data.typeName + "_img";
                }
            }
            else {
                return "monitorWarning_water_river_img";
            }
        },
        iconHlFn: function (type, data) {
            return "" + exports.SymbolMap.monitorWarning_water.iconFn(type, data) + "_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 监测预警 水情
    monitorWarning_river: {
        // 水库
        reservoir: {
            无预警: 'monitorWarning_water_reservoir_img',
            满库: 'monitorWarning_water_reservoir_01_img',
            超历史最高: 'monitorWarning_water_reservoir_01_img',
            超正常: 'monitorWarning_water_reservoir_03_img',
            超汛限: 'monitorWarning_water_reservoir_04_img',
            超设计: 'monitorWarning_water_reservoir_02_img'
        },
        river: {
            无预警: 'monitorWarning_water_river_img',
            超保证: 'monitorWarning_water_river_01_img',
            超历史最高: 'monitorWarning_water_river_02_img',
            超警戒: 'monitorWarning_water_river_03_img'
        },
        iconFn: function (type, data) {
            if (data.type === 'river') {
                if (data.isValid === '0') {
                    return "monitorWarning_water_river_isValid_img";
                }
                else if (data.warning === '') {
                    return "monitorWarning_water_river_img";
                }
                else {
                    return "" + exports.SymbolMap.monitorWarning_water.river[data.warning];
                }
            }
            else if (data.type === 'reservoir') {
                if (data.isValid === '0') {
                    return "monitorWarning_water_reservoir_isValid_img";
                }
                else if (data.warning === '') {
                    return "monitorWarning_water_reservoir_img";
                }
                else {
                    return "" + exports.SymbolMap.monitorWarning_water.reservoir[data.warning];
                }
            }
            else {
                return "monitorWarning_water_river_img";
            }
        },
        iconHlFn: function (type, data) {
            return "" + exports.SymbolMap.monitorWarning_water.iconFn(type, data) + "_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 监测预警 工情
    monitorWarning_work: {
        iconFn: function (type, data) {
            // return `monitorWarning_work_img`;
            return "monitorWarning_work_" + type + "_img";
        },
        iconHlFn: function (featuretype, data) {
            var icon = featuretype + '_' + data.type + '_img_hover';
            return icon;
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 防御准备风险点，防护目标
    defensiveResource: {
        iconFn: function (type, data) {
            return "defensiveResource_" + type + "_img";
        },
        iconHlFn: function (type, data) {
            return "defensiveResource_" + type + "_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 台风高亮点
    TYPHOONFOCUS: {
        hlSymbol: exports.SymbolTemplate.hlSymbol.typhoonfocus
    },
    // ais实时船舶位置
    defensiveResource_realtimeShip: {
        type: {
            搜救: 'sjc_',
            油轮: 'yl',
            游艇: 'qt',
            货船: 'hc',
            高速船: 'gsc',
            拖轮: 'tl',
            其它: 'qt',
            客船: 'kc',
            执法: 'zfc',
            引航: 'yhc'
        },
        state: {
            '帆航中': 'hx',
            '未操纵': 'jz',
            '机动船拖后退': 'hx',
            '在航(主机推动)': 'hx',
            '机动船推进或在旁牵引': 'hx',
            '从事捕捞': 'hx',
            '锚泊': 'jz',
            '系泊': 'jb',
            '受船舶吃水限制': 'jz',
            '有限操纵性': 'jz',
            '搁浅': 'jz',
            '未定义': 'jz'
        },
        iconFn: function (data) {
            var type = "" + exports.SymbolMap.defensiveResource_realtimeShip.type[data.type];
            var state = "" + exports.SymbolMap.defensiveResource_realtimeShip.state[data.state];
            type = type === 'undefined' ? 'qt' : type;
            state = state === 'undefined' ? 'jz' : state;
            return "" + type + "_" + ("" + state);
            // return `monitorWarning_water_river_03_img`;
        },
        iconHlFn: function (data) {
            return "" + exports.SymbolMap.defensiveResource_realtimeShip.iconFn(data) + "_hover";
        },
        symbol: function (data) {
            var state = "" + exports.SymbolMap.defensiveResource_realtimeShip.state[data.state];
            state = state === 'undefined' ? 'jz' : state;
            switch (state) {
                case 'hx':
                    return exports.SymbolTemplate.symbol.ICON_AIS1;
                case 'jb':
                    return exports.SymbolTemplate.symbol.ICON_AIS2;
                case 'jz':
                    return exports.SymbolTemplate.symbol.ICON_AIS3;
                case 'zx':
                    return exports.SymbolTemplate.symbol.ICON_AIS4;
                default:
                    return exports.SymbolTemplate.symbol.ICON_AIS1;
            }
        },
        hlSymbol: function (data) {
            var state = "" + exports.SymbolMap.defensiveResource_realtimeShip.state[data.state];
            state = state === 'undefined' ? 'jz' : state;
            switch (state) {
                case 'hx':
                    return exports.SymbolTemplate.hlSymbol.ICON_AIS1;
                case 'jb':
                    return exports.SymbolTemplate.hlSymbol.ICON_AIS2;
                case 'jz':
                    return exports.SymbolTemplate.hlSymbol.ICON_AIS3;
                case 'zx':
                    return exports.SymbolTemplate.hlSymbol.ICON_AIS4;
                default:
                    return exports.SymbolTemplate.hlSymbol.ICON_AIS1;
            }
        }
    },
    // 实时监测视频点位
    videoFeaturelayer: {
        iconFn: function (type, data) {
            if (data.isDB) {
                return "danbingFeaturelayer_img";
            }
            if (data.isOnline === '0' || data.isOnline === '1') {
                return "VideoFeaturelayer_" + data.isOnline + "_img";
            }
            else {
                return "VideoFeaturelayer_0_img";
            }
        },
        iconHlFn: function (type, data) {
            if (data.isDB) {
                return "danbingFeaturelayer_img_hover";
            }
            if (data.isOnline === '0' || data.isOnline === '1') {
                return "VideoFeaturelayer_" + data.isOnline + "_img_hover";
            }
            else {
                return "VideoFeaturelayer_0_img_hover";
            }
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    // 气象预警图标
    weatherWarning: {
        type: {
            红色: '01',
            橙色: '02',
            黄色: '03',
            蓝色: '04'
        },
        iconFn: function (data) {
            return "" + data.typeCode + "_" + ("" + exports.SymbolMap.weatherWarning.type[data.signallevel]);
        },
        iconHlFn: function (data) {
            return "weatherWarning_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON_WeatherWarn,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON_WeatherWarn
    },
    // 在线终端图标
    terminalLayer: {
        iconFn: function () {
            return "terminal_img";
        },
        iconHlFn: function () {
            return "terminal_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    mountainFlood_Layer: {
        iconFn: function (data) {
            if (data.state === '1') {
                return "flood_transfer_town_img";
            }
            else {
                return "flood_town_img";
            }
        },
        iconHlFn: function (featureType, data) {
            if (data.state === '1') {
                return "flood_transfer_town_img_hover";
            }
            else {
                return "flood_town_img_hover";
            }
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    CUNSYMBOL: {
        type: 'SimpleMarkerSymbol',
        options: {
            borderColor: {
                a: 200,
                r: 125,
                g: 125,
                b: 125
            },
            fillColor: {
                a: 200,
                r: 125,
                g: 225,
                b: 125
            },
            borderThickness: 2,
            size: 8,
            offsetX: '2',
            offsetY: '5'
        }
    },
    CUNSYMBOLHL: {
        type: 'SimpleMarkerSymbol',
        options: {
            borderColor: {
                a: 200,
                r: 255,
                g: 0,
                b: 0
            },
            fillColor: {
                a: 200,
                r: 125,
                g: 225,
                b: 125
            },
            borderThickness: 2,
            size: 8,
            offsetX: '2',
            offsetY: '5'
        }
    },
    monitorWarning_countweirGateWater: {
        iconFn: function (type, data) {
            return "monitorWarning_countweirGateWater_img";
        },
        iconHlFn: function (type, data) {
            return "monitorWarning_countweirGateWater_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    monitorWarning_floodvillage: {
        iconFn: function (type, data) {
            return "monitorWarning_floodvillage_img";
        },
        iconHlFn: function (type, data) {
            return "monitorWarning_floodvillage_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    monitorWarning_reservoir: {
        iconFn: function (type, data) {
            return "monitorWarning_water_reservoir_img";
        },
        iconHlFn: function (type, data) {
            return "monitorWarning_water_reservoir_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    monitorWarning_reservoirCountdx: {
        iconFn: function (type, data) {
            return "monitorWarning_reservoirCountdx_img";
        },
        iconHlFn: function (type, data) {
            return "monitorWarning_reservoirCountdx_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    monitorWarning_reservoirCountzx: {
        iconFn: function (type, data) {
            return "monitorWarning_reservoirCountzx_img";
        },
        iconHlFn: function (type, data) {
            return "monitorWarning_reservoirCountzx_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    },
    monitorWarning_reservoirCountxx: {
        iconFn: function (type, data) {
            return "monitorWarning_reservoirCountxx_img";
        },
        iconHlFn: function (type, data) {
            return "monitorWarning_reservoirCountxx_img_hover";
        },
        symbol: exports.SymbolTemplate.symbol.ICON1,
        hlSymbol: exports.SymbolTemplate.hlSymbol.ICON1
    }
};
