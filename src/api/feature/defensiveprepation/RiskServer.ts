import { RequestServerClass } from '../../../util/request';

// 风险隐患
export default class RiskServer {
  public rSerivce: any;

  public resourceServer: any = null;
  /**
 * 配置
 */
  public config: any = [
    {
      name: '危险建筑',
      layer: 'prh_dangerbuliding',
      nameField: 'name',
      deleteFields: ['longitude', 'latitude', 'fid', 'shape', 'featurecode'],
    },
    {
      name: '地灾隐患',
      layer: '100103000000',
      nameField: 'name',
      deleteFields: ['longitude', 'hazardtype', 'shape', 'bid', 'gid', 'featurecode', 'statuscode', 'fid', 'latitude', 'objectid', 'hazardid', 'Sourcedeptcode'],
    },
    {
      name: '山洪隐患',
      layer: 'nah_fld_mountainflood',
      nameField: 'name',
      deleteFields: ['longitude', 'latitude', 'hazardtype', 'featurecode', 'fid', 'shape', 'statuscode'],
    },
    {
      name: '易涝路段',
      layer: 'nah_fld_waterlogroad',
      nameField: 'name',
      deleteFields: ['longitude', 'latitude', 'featurecode', 'fid', 'shape', 'statuscode'],
    },
    {
      name: '建筑工地',
      layer: 'acd_prh_buildingsite',
      nameField: 'name',
      deleteFields: ['longitude', 'latitude', 'featurecode', 'fid', 'shape', 'statuscode'],
    },
    {
      name: '涵闸',
      layer: 'puf_wcf_culvertgate',
      nameField: 'name',
      deleteFields: ['longitude', 'latitude', 'featurecode', 'fid', 'shape', 'statuscode'],
    },
    {
      name: '内涝点',
      layer: 'nah_fld_waterlogsite',
      nameField: 'name',
      deleteFields: ['longitude', 'latitude', 'featurecode', 'fid', 'shape', 'statuscode'],
    },
  ];
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    // test
    // (window as any).riskServer = this;
  }

  public setResourceServer(server: any) {
    this.resourceServer = server;
  }

  /**
   * 获取统计
   */
  public getStatistics(opts: any) {
    const whereStr = (opts && opts.distCode)  ? `pac like '${opts.distCode}'` : '';
    return new Promise(async (resolve, reject) => {
      // fxyh
      const layerId: any = 'fxyh';
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
   * riskServer.getPageList({layerId:'bas_geologichazard',page:0,size:10,keyword:'',districtCode:'',}).then(function(data){console.log(data);})
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
   * riskServer.getList({layerId:'bas_geologichazard',keyword:'蛇场',districtCode:'',}).then(function(data){console.log(data);})
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
   * riskServer.getDetail({layerId:'bas_geologichazard',dataId:503, withRelation: true}).then(function(data){console.log(data);})
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
   *  获取风险点数据
   * @param opts   风险点
   */
  public getRiskListServer(opts: any) {
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
          RiskType: 'wxjz', // 风险点类型？！
          RiskName: '危险建筑', // 风险点名称
          RiskValue: '28', // 风险点数
        },
        { RiskType: 'wxjz', RiskName: '地灾隐患', RiskValue: '20' },
        { RiskType: 'wxjz', RiskName: '山洪隐患', RiskValue: '11' },
        { RiskType: 'wxjz', RiskName: '易涝路段', RiskValue: '28' },
        { RiskType: 'wxjz', RiskName: '建筑工地', RiskValue: '20' },
        { RiskType: 'wxjz', RiskName: '涵闸', RiskValue: '11' },
        { RiskType: 'wxjz', RiskName: '内涝黑点', RiskValue: '11' },
      ],
    };
  }

  /**
   *  获取-危险建筑-图表详情数据    // 地灾隐患，山洪隐患，易涝路段，建筑工地，涵闸，内涝黑点
   * @param opts   风险点类型，查询图表详情
   */
  public getRiskDetailServer(opts: any) {
    const url = '';
    return new Promise((resolve, reject) => {
      const data: any = {
        //   RiskCityList  echart图内容 top
        RiskCityList: [
          {
            riskCityName: '龙口市1', // 危险建筑分布区 X
            riskNum: 51, // 建筑数量 Y
          },
          {
            riskCityName: '龙口市',
            riskNum: 50,
          },
        ],
        //   RiskAddressList 列表内容 bottom + 地图弹窗内容
        RiskAddressList: [
          {
            riskAddressName: '水口直街11号', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号1', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
        ],
      };
      resolve(data);
      // this.rSerivce.serverObj.post(url, data).then(
      //   (response: any) => {
      //     resolve(response.data);
      //   },
      //   (err: any) => {
      //     reject(err);
      //   },
      // );
    });
    // 返回数据
    const data1 = {
      //   RiskCityList  echart图内容 top
      RiskCityList: [
        {
          riskCityName: '龙口市', // 危险建筑分布区 X
          riskNum: 50, // 建筑数量 Y
        },
        {
          riskCityName: '龙口市',
          riskNum: 50,
        },
      ],
      //   RiskAddressList 列表内容 bottom + 地图弹窗内容
      RiskAddressList: [
        {
          riskAddressName: '水口直街11号', // 危险建筑名称
          riskAddress: '水口直街11号', // 危险建筑地址
          propertyOwner: '不详', // 产权责任人
          nowLivePeople: '不详', // 现居住人
          warningPeople: '防汛指挥所', // 预警责任人（镇、街）
          warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
          transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
          transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
          responsiblePerson: '谭培源  17712898492', // 安置责任人
          responsibleUnit: '社区居委会（委员）', // 安置责任人单位
          LONGITUDE: 116.405298, // 经纬度
          LATITUDE: 23.577593,
        },
      ],
    };
  }
  /**
   *  获取-危险建筑-详情列表数据    // 地灾隐患，山洪隐患，易涝路段，建筑工地，涵闸，内涝黑点
   * @param opts   风险点类型，查询图表详情
   */
  public getRiskDetailListServer(opts: any) {
    const url = '';
    return new Promise((resolve, reject) => {
      const data = {
        //   RiskAddressList 列表内容 bottom + 地图弹窗内容
        RiskAddressList: [
          {
            riskAddressName: '水口直街11号', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号1', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
          {
            riskAddressName: '水口直街11号2', // 危险建筑名称
            riskAddress: '水口直街11号', // 危险建筑地址
            propertyOwner: '不详', // 产权责任人
            nowLivePeople: '不详', // 现居住人
            warningPeople: '防汛指挥所', // 预警责任人（镇、街）
            warningPerson: '梁国峰 18899998899', // 预警责任人（村委）
            transferee: '卢国雄 18899998899', // 转移责任人（镇、街）
            transferPrincipal: '卢国雄 18899998899', // 转移责任人（村委）
            responsiblePerson: '谭培源  17712898492', // 安置责任人
            responsibleUnit: '社区居委会（委员）', // 安置责任人单位
            LONGITUDE: 116.405298, // 经纬度
            LATITUDE: 23.577593,
          },
        ],
      };
      resolve(data);
      // this.rSerivce.serverObj.post(url, data).then(
      //   (response: any) => {
      //     resolve(response.data);
      //   },
      //   (err: any) => {
      //     reject(err);
      //   },
      // );
    });
  }
}
