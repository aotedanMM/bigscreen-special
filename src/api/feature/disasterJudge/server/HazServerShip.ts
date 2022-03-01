import { RequestServerClass } from '../../../../util/request';

// 灾情研判服务
export class HazServerShip {
  public rSerivce: any;
  public param: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }

  /**
   * 按照烈度范围查询企业数据
   * @param opts
   * @param opts.earthLevel
   * @param opts.point
   * @param opts.typecode
   * @param opts.dataA
   * @param opts.callback
   */
  public queryResourceByRanges(opts: any) {
    return new Promise((resolve, reject) => {
      const time: any = new Date();
      time.setHours(time.getHours() - 10);
      const param = {
        starttime: time.format('yyyy-MM-dd hh:mm:00'), // 当前时间前十小时
      };
      $.ajax({
        type: 'POST',
        url:
          (window as any).EMAP_CONFIG.common.urlWeb +
          '/realTimeShip/getRealTimeShipList',
        dataType: 'json',
        async: false,
        data: param,
        success: (res) => {
          const data = res.data;
          const result: any = [];
          // data.length=1000;
          for (const i in data) {
            if (data[i].latitude > 0 && data[i].longitude > 100) {
              const obj: any = {};
              obj.id = data[i].id;
              obj.name = data[i].name;
              obj.callsign = data[i].callsign;
              obj.longitude = data[i].longitude;
              obj.latitude = data[i].latitude;
              obj.heading = data[i].heading;
              obj.stateSpeed = data[i].stateSpeed;
              obj.shipType = data[i].shipType;
              obj.chineseName = data[i].chineseName;
              obj.nationality = data[i].nationality;
              result.push(data[i]);
            }
          }
          // test
          // result.push( {
          //   id: '80155809e2eb4df5aa2533ad8e129811',
          //   name: 'YUYUN618',
          //   mmsi: '413801174',
          //   advancePort: null,
          //   imo: 'null',
          //   advanceTime: null,
          //   callsign: '0000000',
          //   longitude: '107.64183',
          //   chineseName: 'null',
          //   latitude: '29.844743333333334',
          //   nationality: 'null',
          //   heading: '0',
          //   shipLength: 'null',
          //   track: null,
          //   beam: null,
          //   stateSpeed: '未定义/0.200000003',
          //   tonnage: 'null',
          //   draft: null,
          //   grossTonnage: 'null',
          //   publishTime: null,
          //   netTons: 'null',
          //   shipType: '货船',
          //   url:
          //     'http://ship.chinaports.com/shipinit.do?method=shipInfo&userid=9182103605&source=0&num=1544608150626&encode=true',
          //   updateTime: '2019-09-20 15:12:28',
          //   groupnameStamp: 'real_time_ship1568963548020',
          // });
          resolve({
            layerName: '_RealShip',
            level: '',
            list: result,
            count: result.length,
          });
        },
        error: (err: any) => {
          reject(new Error(err));
        },
      });
    });
  }
}
