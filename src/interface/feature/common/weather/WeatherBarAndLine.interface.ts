export interface IchartDatas {
    xData: string[];
    yData1: number[];
    yData2: number[];
}
// option的数据描述
interface Igrid {
        top: string;
        left: string;
        right: string;
        bottom: string;
        containLabel: boolean;
}

interface ItextStyle {
    color: string;
    fontSize: number;
}

interface Ilegend {
        data: string[];
        top: string;
        textStyle: ItextStyle;
}

interface IsplitLine {
    show: boolean;
}

interface IlineStyle {
    color: string;
}

interface  IaxisLine {
    show: boolean;
    lineStyle?: IlineStyle;
}

interface  IaxisTick {
    show: boolean;
    inside?: boolean;
    length?: number;
    lineStyle?: IlineStyle;
}

interface IaxisLabel {
    show: boolean;
    margin: number;
    color: string;
    fontSize: number;
}

interface IxAxis {
    type: string;
    show: boolean;
    boundaryGap: boolean;
    splitLine: IsplitLine;
    axisLine: IaxisLine;
    axisTick: IaxisTick;
    axisLabel: IaxisLabel;
    data: string[];
}



interface IyAxis {
    type: string;
    name: string;
    nameGap: number;
    nameTextStyle: ItextStyle;
    splitLine: IsplitLine;
    axisLine: IaxisLine;
    axisTick: IaxisTick;
    axisLabel: IaxisLabel;
}

interface Ilabel {
    show: boolean;
    position: string;
    distance: number;
    fontSize: number;
    color: string;
}

interface Iseries {
    name: string;
    type: string;
    yAxisIndex: number;
    symbol?: string;
    symbolSize?: number;
    barWidth?: string;
    smooth?: boolean;
    itemStyle: IlineStyle;
    label: Ilabel;
    data: number[];
}

export interface Ioption {
    grid: Igrid;
    legend: Ilegend;
    xAxis: IxAxis[];
    yAxis: IyAxis[];
    series: Iseries[];
}


