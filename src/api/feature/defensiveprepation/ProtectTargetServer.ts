import { RequestServerClass } from '../../../util/request';

// 防护目标
export default class ProtectTargetServer {
  public rSerivce: any;

  public resourceServer: any = null;

  /**
   * 配置
   */
  public config: any = [
    {
      name: '电力设施',
      layer: 'puf_powerfacilities',
      nameField: 'name',
      deleteFields: ['longitude', 'latitude', 'fid', 'shape', 'featurecode'],
    },
    {
      name: '通讯设施',
      layer: 'puf_comfacilities',
      nameField: 'name',
      deleteFields: ['longitude', 'latitude', 'fid', 'shape', 'featurecode'],
    },
  ];

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    // test
    // (window as any).protectTargetServer = this;
  }


  public setResourceServer(server: any) {
    this.resourceServer = server;
  }

  /**
   * 获取统计
   */
  public getStatistics(opts: any) {
    const whereStr = (opts && opts.distCode) ? `pac like '${opts.distCode}'` : '';
    return new Promise(async (resolve, reject) => {
      // fhmb
      const layerId: any = 'fhmb';
      const result: any = await this.resourceServer.getResourceStatistics({
        layerId,
        config: this.config,
        where: whereStr,
      });
      resolve(result);
    });
  }


  /**
   * 获取分页数据
   * @param opts
   * @param opts.layerId 图层id
   * @param opts.keyword 关键字条件
   * @param opts.districtCode 行政区划过滤条件
   * @param opts.page 第几页
   * @param opts.size 页码，从0计数
   * protectTargetServer.getPageList({layerId:'bas_geologichazard',page:0,size:10,keyword:'',districtCode:'',}).then(function(data){console.log(data);})
   */
  public getPageList(opts: any) {
    return this.resourceServer.getCommonPageList(opts, this.config);
  }
  /**
   * @param layerId 图层id,多个用','分开(nah_fld_mountainflood,100103000000)
   */
  public getAllDataByName(layerId: any) {
    return this.resourceServer.getAllDataByName(layerId);
  }
  /**
   * 获取数据
   * @param opts
   * @param opts.layerId 图层id
   * @param opts.keyword 关键字条件
   * @param opts.districtCode 行政区划过滤条件
   * protectTargetServer.getList({layerId:'bas_geologichazard',keyword:'',districtCode:'',}).then(function(data){console.log(data);})
   */
  public getList(opts: any) {
    return this.resourceServer.getCommonList(opts, this.config);
  }

  /**
   * 获取详情
   * @param opts
   * @param opts.layerId 图层id
   * @param opts.dataId 数据id
   * @param opts.withRelation 是否返回关联
   * protectTargetServer.getDetail({layerId:'bas_geologichazard',dataId:503, withRelation: true}).then(function(data){console.log(data);})
   */
  public getDetail(opts: any) {
    return new Promise(async (resolve, reject) => {
      this.resourceServer.getDetail(opts, this.config).then((res: any) => {
        let tempConfig: any = {};
        for (const item of this.config) {
          if (item.layer === opts.layerId) {
            tempConfig = item;
            break;
          }
        }
        const deleteStr: any = tempConfig.deleteFields.toString();
        const tempList: any = [];
        for (const item of res.attirbutes) {
          if (deleteStr.indexOf(item.name) !== -1) {
            continue;
          }
          if (item.name === item.alias) {
            continue;
          }
          tempList.push(item);
        }
        res.attirbutes = tempList;
        resolve(res);
      });
    });
  }

  /**
   *  获取防护目标数据
   * @param opts   防护目标
   */
  public getProtectListServer(opts: any) {
    const url = '';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then(
        (response: any) => {
          resolve(response.data);
        },
        (err: any) => {
          reject(err);
        },
      );
    });
    // 返回数据
    const data = {
      RiskData: [
        {
          RiskType: 'wxjz', // 防护目标类型
          RiskName: '电力设施', // 防护目标名称
          RiskValue: '28', // 防护目标数
        },
        { RiskType: 'wxjz', RiskName: '通讯设施', RiskValue: '20' },
      ],
    };
  }

  /**
   *  获取-电力设施-图表详情数据    // 电力设施，通讯设施
   * @param opts   查询图表详情
   */
  public getProtectDetailServer(opts: any) {
    const url = '';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then(
        (response: any) => {
          resolve(response.data);
        },
        (err: any) => {
          reject(err);
        },
      );
    });
    // 返回数据
    const data = {
      //   RiskCityList  echart图内容 top
      RiskCityList: [
        {
          riskCityName: '', //  X
          riskNum: 50, //  Y
        },
      ],
      //   RiskAddressList 列表内容 bottom
      RiskAddressList: [
        {
          LONGITUDE: 116.405298,
          LATITUDE: 23.577593,
        },
      ],
    };
  }
}
