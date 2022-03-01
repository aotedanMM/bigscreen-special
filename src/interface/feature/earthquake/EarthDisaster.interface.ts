
/**
 * 地灾隐患点 接口
*/
// textStyle 接口  (lineStyle,textStyle)
interface ItextStyle {
    color: string;
    fontSize ?: number;
}
// yAxis 下的 splitLine，axisTick，axisLabel，axisLine
interface IyAxisLine {
    show: boolean;
}

interface IitemStyle {
    normal: {
        label: {
            show: boolean,
            position: string,
            textStyle: ItextStyle,
        },
        color: any;
    };
}

interface IBarSeries {
    type: string;
    data: number[];
    barWidth: number;
    itemStyle: IitemStyle;
}

export interface ILatentDanger {
    xAxis: {
        data: string[],
        axisLabel: {
            show: boolean,
            textStyle: ItextStyle,
        },
        axisTick: {
            show: boolean,
        },
        axisLine: {
            lineStyle: ItextStyle,
        },
    };
    yAxis: {
        splitLine: IyAxisLine,
        axisTick: IyAxisLine,
        axisLabel: IyAxisLine,
        axisLine: IyAxisLine,
    };
    series: IBarSeries[];
}


/**
 * 重点企业接口
*/

export interface IEnterprise {
    xAxis: {
        data: string[],
        axisLabel: {
            show: boolean,
            textStyle: ItextStyle,
        },
        axisTick: {
            show: boolean,
        },
        axisLine: {
            lineStyle: ItextStyle,
        },
    };
    yAxis: {
        splitLine: IyAxisLine,
        axisTick: IyAxisLine,
        axisLabel: IyAxisLine,
        axisLine: IyAxisLine,
    };
    series: IBarSeries[];
}

/**
 * 重点设施接口
*/

export interface IInstallation {
    xAxis: {
        data: string[],
        axisLabel: {
            show: boolean,
            textStyle: ItextStyle,
        },
        axisTick: {
            show: boolean,
        },
        axisLine: {
            lineStyle: ItextStyle,
        },
    };
    yAxis: {
        splitLine: IyAxisLine,
        axisTick: IyAxisLine,
        axisLabel: IyAxisLine,
        axisLine: IyAxisLine,
    };
    series: IBarSeries[];
}
