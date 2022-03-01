/**
 * 该文件是存放关于事件的所有接口 Event
 */

export interface Eventinfo {
  id: string;
  releaseTime: string;
  latitude: string;
  longitude: string;
  content: string;
  typeCode: string;
  location: string;
}

// 事件列表的接口数据定义
export interface IEventList {
  id: string;
  releaseTime: string;
  latitude: string;
  longitude: string;
  content: string;
  typeCode: string;
  location: string;
}

// 事件信息的接口数据的定义
export interface IEventinfo {
  id: string;
  title: string;
  eventType: string;
  reportTime: string;
  location: string;
  longitude: string;
  latitude: string;
  content?: string;
  typeCode?: string;
  type?: boolean;
  collectionTime?: string;
}

// 事件信息请求API的参数定义
export interface IEventinfoParam {
  startTime: string;
  endTime: string;
  eventCode: any;
}
// 地震速报请求API的参数定义
export interface EarthinfoParam {
  id: string;
  releaseTime: string;
  content: string;
  longitude: string;
  latitude: string;
  typeCode: string;
  location: string;
  magnitude: string;
  locale: string;
}
