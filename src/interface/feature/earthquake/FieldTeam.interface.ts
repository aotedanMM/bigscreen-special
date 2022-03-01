interface Igrid {
    top: string;
    left: string;
    right: string;
    bottom: string;
    containLabel: boolean;
}
// axisLabel;
interface Istyle {
    margin?: number | string;
    fontSize: number | string;
    fontFamily: string;
    color: string;
}
interface Ilabel {
    show: boolean;
    position: string;
    distance: number;
    textStyle: Istyle;
    fontSize: number | string;
    fontFamily: string;
    color: string;
}
interface Ishow {
    show: boolean;
}

interface IyAxis {
    inverse: boolean;
    axisLine: Ishow;
    axisTick: Ishow;
    axisLabel: Istyle;
    data: string[];
}


interface IseriesDataItem {
    value: number;
    label: Ilabel;
    itemStyle: {
        color: Icolor;
    };
    emphasis: {
        label: Ishow,
    };
}
interface Icolor {
    x: number;
    y: number;
    x2: number;
    y2: number;
    type: string;
    global: boolean;
    colorStops: IcolorStopsItem[];
}
interface ImarkPointDataItemStyle {
    color?: string;
    barBorderRadius?: number[] | string[];
    shadowBlur?: number;
    shadowColor?: string;
    opacity?: number;
}
interface IcolorStopsItem {
    offset: number;
    color: string;
}
interface ImarkPoint {
    symbol: string;
    symbolSize: number;
    symbolOffset: string[];
    data: ImarkPointData[];

}
interface ImarkPointData {
    xAxis: number;
    yAxis: string;
    itemStyle: ImarkPointDataItemStyle;
    label?: any;
    emphasis?: {label?: any};
}
interface IseriesDataItem {
    value: number;
    label: Ilabel;
    itemStyle: {
        color: Icolor;
    };
    emphasis: {
        label: {
            show: boolean;
        };
    };
}

interface Iseries {
    name: string;
    type: string;
    data: IseriesDataItem[];
    barWidth: number;
    itemStyle: ImarkPointDataItemStyle;
    markPoint: ImarkPoint;
}

export interface  IFieldTeamDemo {
    grid: Igrid;
    xAxis: Ishow;
    yAxis: IyAxis[];
    series: Iseries[];
}
