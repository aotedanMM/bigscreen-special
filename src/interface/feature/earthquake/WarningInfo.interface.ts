// 请求预警信息API的接口参数定义
export interface IWarningInfoParam {
  type: string;
  startTime: string;
  endTime: string;
}

// 预警信息的数据接口定义 也就是后台给的数据格式
export interface IWarningInfo {
  count: number;
  name: string;
  districtcode: string;
  type: string;
}

// 通过预警信息的类型来请求API的参数类型定义
export interface IWarningInfoTypeParam {
  type: string;
  startTime: string;
  endTime: string;
}
