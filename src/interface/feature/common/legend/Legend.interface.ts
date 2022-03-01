export interface ILegendItem {
    title?: string;
    iconClass?: string;
    width?: number;
    height?: number;
    src?: string;
}
export interface ILegend {
    isShow: boolean;
    title?: string;
    data: ILegendItem[];
}
export class LegendData implements ILegend {
    public isShow = true;
    public title  = '图例';
    public data = [];
}
