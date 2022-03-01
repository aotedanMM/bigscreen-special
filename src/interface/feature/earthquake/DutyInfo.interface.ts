/**
 * 值班信息 接口
*/

// tslint:disable-next-line:class-name
interface staffInfo {
  job: string;
  name: string;
  tel: string;
}
// tslint:disable-next-line:class-name
interface staffs {
  postion: string;
  staffInfo ?: staffInfo[];
}
// tslint:disable-next-line:class-name
export interface staff {
  orgCode ?: string;
  orgName: string;
  staffs ?: staffs[];
}
// tslint:disable-next-line:class-name
export interface staff {
  orgCode ?: string;
  orgName: string;
  staffs ?: staffs[];
}
// tslint:disable-next-line:class-name
export interface sectionList {
  label: string;
  value: string;
}

