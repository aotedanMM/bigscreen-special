import { RequestServerClass } from '../../util/request';
import publishObjectPath from '@/util/configRegistry';
import MultiuleQueryParamConfigList_yt from '@/gis/normal/resource/MultiuleQueryParamConfigList_yt';
import { id } from 'inversify';

export class MultiuleInterfaceServer {
  public rSerivce: any;
  public eadsService: any;
  public egisOpts: object = {};
  constructor(opt: any, axiosFilterFn?: any) {
    opt.baseURL = (window as any).EMAP_CONFIG.common.resourceServer;
    this.rSerivce = new RequestServerClass(opt);
    this.egisOpts = publishObjectPath.value.egis;
    this.eadsService = publishObjectPath.value.serverPathNew;
  }

  /**
   * 展示屏信息 发送到 推送屏
   * @param opts
   */
  public multiuleInterGetData(opts: any) {
    // tslint:disable-next-line: no-debugger
    // debugger;
    const url = '/api/universal/getUniversalSql/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((data: any) => {
        resolve(data);
      });
    });
  }

  // 列表分页接口
  public getLimitDataList(opts: any) {
    const url = '/api/universal/getUniversalLimitSql/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((data: any) => {
        resolve(data);
      });
    });
  }

  /**
   * 展示屏信息 发送到 推送屏
   * @param opts   查询总数
   */
  public multiuGetAllNum(opts: any) {
    const url = '/api/universal/getUniversalEquipmentCountSql/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((data: any) => {
        resolve(data);
      });
    });
  }

  /**
   * 获取火场列表标绘元素
   * @param fireId   火场id
   */
  public getFireParam(fireId: any) {
    const url = this.eadsService + 'fireData/v1/getFirePlot?id=' + fireId;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((data: any) => {
        resolve(data);
      });
    });
  }

  /**
   * 获取火场详情
   * @param fireId   火场id
   */
  public getFireSourceParam(fireId: any) {
    const url = this.eadsService + 'fireData/v1/getFireDetails?id=' + fireId;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((data: any) => {
        resolve(data);
      });
    });
  }

  // 获取倾斜摄影列表的方法
  public getWopsList() {
    const temp: any = this.egisOpts;
    const wopsService = new g2.ews.RestWOPSService({
      url: temp.server + 'egis/base/v1',
      clientId: '28524d8c65844630a3427270c9a16323',
      clientSecret: '84bc17650bb04491aa8475b9cbe3d1c4',
      authType: 'Basic',
      tokenUrl: 'http://120.52.31.31:590/oauth/token',
      deserializer: new g2.core.Deserializer(),
    });
    return new Promise((resolve, reject) => {
      wopsService.getCapabilities().then((res: any) => {
        resolve(res);
      });
    });
  }

  /**
   * 获取单项数据
   * @param opts
   * @param opts.keyword 关键字
   * @param opts.resourceKey，多个逗号分隔
   * @param opts.pageSize
   * @param opts.pageIndex
   * @param opts.districtCode
   */
  public getDataList(param: any) {
    // this.$store.state.dataFilterControl.zhypGeoType.key
    // 右侧点击数字展开列表 -> 风险隐患请求
    /*
    * objname 要寻找的对象
    * where 要查询的code
    * text 关键字
    * centerPoint 中心点
    */
    let objname = param.resourceKey;
    // 装备特殊处理，因为22个装备type用的一个查询条件
    let equipWhere = '';
    let equipCode = '';
    if (objname.indexOf('equipmentdsaddsasd') >= 0) {
      equipCode = objname.split('_')[1];
      objname = objname.split('_')[0];
      equipWhere = ' and a.equiptypecode=' + '\'' + equipCode + '\'';
    }
    const text: any = param.keyword ? param.keyword : '';
    const typecode: any = param.typecode;
    const btnflags: any = param.btnflags;
    if (param.id) {
      const typeid: any = param.id ? param.id : '';
      const obj: any = {
        field: MultiuleQueryParamConfigList_yt[objname].fileFn('0'),
        group: MultiuleQueryParamConfigList_yt[objname].group(),
        nowPage: param.pageIndex,
        pageSize: param.pageSize,
        typecode: typecode ? typecode : '',
        polygon: '',
        tableName: MultiuleQueryParamConfigList_yt[objname].tableName(),
        type: '3',
        // orderBy: this.$store.state.eventPushStore.eventId ? MultiuleQueryParamConfigList_yt[objname].orderBy() : '',
        where: MultiuleQueryParamConfigList_yt[objname].where(text, typeid) + equipWhere,

      };
      // param.districtCode = '3706'
      if (param.districtCode) {  // 行政区划过滤
        if (param.districtCode.substring(param.districtCode.length - 2) === '00') {
          param.districtCode = param.districtCode.substr(0, 4);
        }
        obj.where += ' and ' + obj.group + ' like  \'' + param.districtCode + '\'||\'%\'';
      }
      const url = '/api/universal/getUniversalLimitSql/v1';
      return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url, obj).then((data: any) => {
          resolve(data.data.data);
        });
      });
      // 刘云梦2022/02/24 除空外添加不等于undefined的情况判断
    } else if (param.btnflags !== '' && param.btnflags !== undefined) {
      const obj: any = {
        field: MultiuleQueryParamConfigList_yt[objname].fileFn('0'),
        group: MultiuleQueryParamConfigList_yt[objname].group(),
        nowPage: param.pageIndex,
        pageSize: param.pageSize,
        polygon: param.polygon ? param.polygon : '',
        tableName: MultiuleQueryParamConfigList_yt[objname].tableName(),
        type: param.type ? param.type : '3',
        where: MultiuleQueryParamConfigList_yt[objname].where(text, btnflags) + equipWhere,
      };
      // param.districtCode = '3706'
      if (param.districtCode) {  // 行政区划过滤
        const arrDistrict = param.districtCode.split(',');
        if (arrDistrict.length === 1) {
          if (param.districtCode.substring(param.districtCode.length - 2) === '00') {
            param.districtCode = param.districtCode.substr(0, 4);
          }
          obj.where += ' and ' + obj.group + ' like  \'' + param.districtCode + '\'||\'%\'';
        } else if (arrDistrict.length > 1) {
          obj.where += ' and ' + obj.group + ' in(' + param.districtCode + ')';
        }

      }
      const url = '/api/universal/getUniversalLimitSql/v1';
      // console.log(obj);
      return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url, obj).then((data: any) => {
          resolve(data.data.data);
        });
      });
    } else {
      const obj: any = {
        field: MultiuleQueryParamConfigList_yt[objname].fileFn('0'),
        group: MultiuleQueryParamConfigList_yt[objname].group(),
        nowPage: param.pageIndex,
        pageSize: param.pageSize,
        polygon: param.polygon ? param.polygon : '',
        tableName: MultiuleQueryParamConfigList_yt[objname].tableName(),
        type: param.type ? param.type : '3',
        where: MultiuleQueryParamConfigList_yt[objname].where(text, typecode) + equipWhere,
      };
      // param.districtCode = '3706'
      if (param.districtCode) {  // 行政区划过滤
        const arrDistrict = param.districtCode.split(',');
        if (arrDistrict.length === 1) {
          if (param.districtCode.substring(param.districtCode.length - 2) === '00') {
            param.districtCode = param.districtCode.substr(0, 4);
          }
          obj.where += ' and ' + obj.group + ' like  \'' + param.districtCode + '\'||\'%\'';
        } else if (arrDistrict.length > 1) {
          obj.where += ' and ' + obj.group + ' in(' + param.districtCode + ')';
        }

      }
      const url = '/api/universal/getUniversalLimitSql/v1';
      // console.log(obj);
      return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url, obj).then((data: any) => {
          resolve(data.data.data);
        });
      });
    }
    // const text: any = param.keyword ? param.keyword : '';
    // if (this.homeData.curNumItem.isHasSelect) {
    //   this.whereconfig[MultiuleQueryParamConfigList_yt[objname].giscodeConfig] = this.checkedOption;
    //   this.whereconfig.all = JSON.parse(JSON.stringify(this.homeData.curNumItem.selectArr));
    // }
    // if (this.moduleType[0] === 'sjzlpt_dm_tfsjjb_sjdcrwlb') {  // 兼容 E键通
    //   obj.polygon = '';
    //   obj.type = '3';

    // 1 中心距离
    // 2 缓冲区
    // 3 普通

  }
}
