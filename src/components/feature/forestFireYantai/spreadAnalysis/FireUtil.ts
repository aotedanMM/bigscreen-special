const parameterMap: any = {
    location: 102079,	// 位置点-区县信息	object	-	-	-	-	位置信息，格式：国家.省.市.县.乡.村,可少，国家可忽略，......(详见[1])
    sourceInfo: 112120,	// 火源信息集	arrays	-	-	-	-	着火点信息集合
    startTime: 112103,	// 着火起始时间	datetime	yyyy-MM-dd HH:mm:ss.fff	1900-00-00 00:00:00.000	-	-	着火时间[标准日期格式，注意不同语言下该format可能变动]
    fireSourceInfo: 112105,	// 着火点信息	object	-	-	-	-	火场信息(可为点或面几何对象)[几何信息集，实际使用时节点名......(详见[2])
    geoType: 102201,	// 几何对象类型	enum	-	-	-	-	GIS数据几何对象类型：[Point、Ployline、Pl......(详见[3])
    geometry: 102204,	// 点集字串	arrays	(-∞,∞)	-	-	-	点串信息集组，[c,x,y,z,x,y,z,...],c为坐......(详见[4])
    isolationInfo: 112121,	// 隔离带信息集	arrays	(-∞,∞)	-	-	-	隔离带信息集合[点串信息集组，[c,x,y,z,x,y,z,......(详见[6])
    weatherInfo: 105600,	// 环境信息参数	object	-	-	-	-	环境信息参数，多时段
    windInfo: 105602,	// 风信息集	object	-	-	-	-	风信息集，多点，多时段，Json对象组[模型风场参数集，多时段风场信息]
    windArr: 105041,	// 风信息参数集	arrays	-	-	-	-	风对象信息参数集，多点，多时段[模型风参数集合]
    windType: 103001,	// 风向	enum	[-1,15]	0.0	-	-	枚举值：[无风、西风、西南风、南风、东南风、东风、东北风、北......(详见[7])
    windAngle: 103003,	// 风向角度
    windSpeedZ: 103007,	// 风速_Z
    windSpeed: 103004,	// 风速	double	[0.0,100]	1.0	米/秒	m/s	xy方向风速
    windStartTime: 103009,	// 起始时间	datetime	yyyy-MM-dd HH:mm:ss.fff	1900-00-00 00:00:00.000	-	-	风开始时间[标准日期格式，注意不同语言下该format可能变动]
    windLast: 103010,	// 持续时间	double	[0.0,∞)	-	秒	s	风持续时间
    analysisTime: 110022,	// 计算时间	double	[0,864000]	36000.0	秒	s	最大模拟时间，为0时计算全部，默认最大10小时
    analysisStep: 110322,	// 输出步进间隔	double	[0.0,∞)	60.0	秒	s	步进间隔数(输出步进)
};
export default {
    parse(param: any, result: any) {
        for (const key of Object.keys(param)) {
            // 判断key是否计入参数
            if (!!parameterMap[key]) {
                if (param[key] instanceof Object) {
                    if (param[key] instanceof Array) {
                        // 是数组的情况
                        result[parameterMap[key]] = [];
                        for (let i = 0; i < param[key].length; i++) {
                            if (param[key][i] instanceof Object) {
                                if (param[key][i] instanceof Array) {
                                    // 数组套数组的情况--isolationInfo的情况
                                    result[parameterMap[key]][i] = param[key][i];
                                } else {
                                    // 数组套对象的情况
                                    result[parameterMap[key]][i] = {};
                                    this.parse(param[key][i], result[parameterMap[key]][i]);
                                }
                            } else {
                                result[parameterMap[key]][i] = param[key][i];
                            }
                        }
                    } else {
                        result[parameterMap[key]] = {};
                        this.parse(param[key], result[parameterMap[key]]);
                    }
                } else {
                    result[parameterMap[key]] = param[key];
                }
            }
        }
    },

    /**
     * (polygon only)
     * @param type
     * @param list
     */
    geoJson_parser(type: string, list: any) {
        const result: any = {};
        result.type = type;
        result.coordinates = [];
        result.coordinates[0] = this.list_geo_parser(list);
        return result;
    },

    list_geo_parser(list: any[]) {
        if (list && list.length > 0) {
            list.splice(0, 1);
            const productData = [];
            const num = Math.ceil(list.length / 3);
            for (let i = 0; i < num; i++) {
                productData.push(list.slice(i * 3, i * 3 + 3));
            }
            return productData;
        }
    },
};

