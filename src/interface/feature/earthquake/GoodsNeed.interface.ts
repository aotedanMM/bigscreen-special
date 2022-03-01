


export interface IGoodsNeed {
    type: string;
    name: string ;
    total: number ;
    unit: string;
    notdispatch: string | number;
    dispatching: string | number;
}


export interface IGoodsNeedPredict {
    type: string;
    name: string;
    number: number;
    unit: string;
}
