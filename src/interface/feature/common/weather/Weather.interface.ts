export interface IWeather {
    address: string;
    temperature: number | string;
    temperatureUnit: string;
    weatherIconName: string;
    weatherSituation: string;
    windSpeed: number | string;
}
// 当前获取的天气信息的某条信息
export interface IWeatherListItem {
    DAYMS: string;
    DQ: string;
    DQQW: string;
    FL: string;
    FX: string;
    icon: string;
    DAYHIGHT?: string;
    ID?: string ;
    KWXL?: string;
    NIGHLOW?: string;
    NIGHTMS?: string ;
    NJD?: string;
    QY?: string;
    RC?: string;
    RELID?: string ;
    RL?: string;
    RQ?: string;
    RQTJ?: string ;
    SD?: string;
    STATE?: string ;
    TEMPHOUR?: string;
    ZWX?: string;
    JS?: string;
}
// 获取的天气列表信息。
// export interface IWeatherList {
//     [index: number]: IWeatherListItem;
// }

// 天气图标
export interface IWeatherImageListItem {
    label: string;
    value: string;
}

// export interface IWeatherImageList {
//     [index: number]: IWeatherImageListItem;
// }

// 空气质量label项
export interface IAirQualityLabelListItem {
    title: string;
    value: string | number;
    key: string;
}
// 空气质量label表头列表
// export interface IAirQualityLabelList {
//     [index: number]: IAirQualityLabelListItem;
// }

// 空气质量数据list单项
export interface IAirQualityDataListItem {
    title: string;
    value: string | number;
}
// 空气质量数据list
// export interface IAirQualityDataList {
//     [index: number]: IAirQualityDataListItem;
// }

//
export interface ICurrentLiveListItem {
    title: string;
    key: string;
    iconClass: string;
}

// 当前实况数据数组
// export interface ICurrentLiveList {
//     [index: number]: ICurrentLiveListItem;
// }

export interface IMeteorologicalElementMapListItem {
    label: string;
    iconclass: string;
    activeclass: string;
    checked: boolean;
}

// 气象要素图
// export interface IMeteorologicalElementMapList {
//     [index: number]: IMeteorologicalElementMapListItem;
// }
// 精细预报表头数据描述
export interface IHour24ForecastListItem {
     key: string | number;
     prop: string;
     label: string;
     width: string;
     align: string;
}

// 精细预报后台传来的数据描述
export interface IweatherJXYBServer {
    ja?: string | number;
    jb?: string | number;
    jc?: string | number;
    jd?: string | number;
    je?: string | number;
    jf?: string | number;
}

// 精细预报表格需要的数据描述
export interface IweatherJXYBTable {
    title: string;
    value1?: string | number;
    value2?: string | number;
    value3?: string | number;
    value4?: string | number;
    value5?: string | number;
    value6?: string | number;
    value7?: string | number;
    value8?: string | number;
}

// 天气tab数据描述
export interface IweatherTabDatas {
    label: string;
    key: string;
}

// 明后天预报数据描述
export interface IweatherTqyb {
    dealDay?: string;
    week?: string;
    dayImg: string;
    maxTemp: string;
    minTemp: string;
    direct: string;
    power: string;
    icon?: string;
}
