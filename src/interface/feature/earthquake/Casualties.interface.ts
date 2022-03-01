
interface Itooltip {
    trigger: string;
    padding: number;
    borderColor: string;
    borderWidth: string | number;
    formatter?: any;
}
interface ItextStyle {
    color: string;
    fontFamily: string;
    fontSize: number;
}
// textStyle
interface IaxisLabel {
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    textStyle?: ItextStyle;
}
interface IangleAxis {
    type: string;
    z: number;
    axisLabel: IaxisLabel;
    data: any;
}
interface Ipolar {
    center: string[];
    radius: number;
}
interface IlineStyle {
    color: string;
    type?: string;
}
interface IsplitArea {
    areaStyle: IaxisLabel;
}
interface Iemphasis {
    borderWidth: number;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowColor: string;
}
interface IitemStyle {
    emphasis: Iemphasis;
}

interface IaxisTickLineLabel {
    show?: boolean;
    lineStyle?: IlineStyle;
    textStyle?: ItextStyle;
    areaStyle?: IlineStyle;
}

interface IradiusAxis {
    zlevel: number;
    z: number;
    axisTick: IaxisTickLineLabel;
    axisLine: IaxisTickLineLabel;
    axisLabel: IaxisTickLineLabel;
    splitLine: IaxisTickLineLabel;
    splitArea: IaxisTickLineLabel;
}
export interface IdataItem {
    name: string;
    value: number[];
}
interface IseriesItem {
    type: string;
    data: IdataItem[];
    coordinateSystem: string;
    name: string;
    stack: string;
    itemStyle: IitemStyle;
}

export interface ICasultiesOption {
    tooltip: Itooltip;
    color: string[];
    angleAxis: IangleAxis;
    polar: Ipolar;
    radiusAxis: IradiusAxis;
    series: IseriesItem[];
}

