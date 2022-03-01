/**
 * 值班管理的接口定义
 */
export interface IStaffInfo {
  name: string;
  job?: string;
  tel?: string;
}

export interface ILeader {
  postion: string;
  staffInfo: IStaffInfo[];
}

export interface IStaff {
  orgName: string;
  staffs: IStaffInfo[];
}

export interface IStaffs {
  postion: string;
  staffInfo: IStaffInfo;
}
// 值班信息的请求API的数据定义
export interface IManagementDuty {
  leader: ILeader;
  staff: IStaff;
}
