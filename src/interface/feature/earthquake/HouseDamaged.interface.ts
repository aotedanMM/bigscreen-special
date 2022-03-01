/**
 *房屋毁损 接口
 * */
interface Igrid {
    top: string | number;
    left: string | number;
    bottom: string | number;
    right: string | number;
    containLabel: boolean;
}

interface IaxisPointer {
    type: string;
}

interface Itooltip {
    trigger: string;
    axisPointer: IaxisPointer;
}

interface ItextStyle {
    show?: boolean;
    color: string;
    fontSize?: number;
    barBorderRadius?: number[];
}


interface IaxisLabel {
    show?: boolean;
    textStyle?: ItextStyle;
}

interface IseriesItem {
    type: string;
    barWidth: string;
    barCategoryGap?: string;
    stack: string;
    name: string;
    itemStyle: ItextStyle;
}
interface IxyAxis {
    type: string;
    axisLabel: IaxisLabel;
    axisLine: IaxisLabel;
    axisTick: IaxisLabel;
    splitLine: IaxisLabel;
    interval?: number;
}
interface Idataset {
    source: IdatasetItem[];
}

export interface IdatasetItem {
    parentName: string;
    yibansunhuai: number;
    yazhongsunhuai: number;
    damage: number;
}

export interface IHouseDamagedOption {
    tooltip: Itooltip;
    grid: Igrid;
    xAxis: IxyAxis;
    yAxis: IxyAxis;
    dataset: Idataset;
    series: IseriesItem[];
}
