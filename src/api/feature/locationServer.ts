
import { RequestServerClass } from '../../util/request';
import publishObjectPath from '@/util/configRegistry';
import { districtServer } from '@/api/installServer';
// 定位服务
export class LocationServer {

  public rService: any;

  private ipAddress: string = '';

  private WILSService: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rService = new RequestServerClass(opt);
    // egis的ip定位服务
    this.WILSService = new g2.ews.RestWILSService({
      url: publishObjectPath.value.egis.server + 'egis/base/v1', // 服务
      clientId: publishObjectPath.value.egis.clientId, // 用户id
      clientSecret: publishObjectPath.value.egis.clientSecret, // 用户密码
      authType: 'Token', // 授权类型
      tokenUrl: publishObjectPath.value.egis.tokenServer,
    });
  }

  // 获取ip
  public interetIP() {
    return new Promise((resolve, reject) => {
      if (this.ipAddress) {
        resolve(this.ipAddress);
      } else {
        const url = publishObjectPath.value.ipifyUrl;
        this.rService.serverObj.get(url).then((res: any) => {
          if (res.data.ip) {
            this.ipAddress = res.data.ip;
            resolve(this.ipAddress);
          } else {
            reject(new Error('获取ip失败！'));
          }
        });
      }
    });
  }

  /**
   * 根据ip获取位置
   * @param opts
   * @param opts.ip ip地址
   */
  public ipGetPosition(opts: any) {
    return new Promise((resolve, reject) => {
      this.interetIP().then((res) => {
        const ip = opts.ip || res;
        this.WILSService.locationByIP(ip).then((data: any) => {
          if (data) {
            resolve(data.content);
          }
        });
      });
    });
  }


  public ipGetDistrict() {
    return new Promise((resolve, reject) => {
      this.ipGetPosition({}).then((res: any) => {
        const opts = {
          location: [res.location.x, res.location.y],
          level: 3,
        };
        districtServer.getDistrictByLonLat(opts).then((data: any) => {
          if (data.code === 0) {
            const county = data.data[0].code;
            const province = county.substr(0, 2) + '0000';
            const city = county.substr(0, 4) + '00';
            // 取城市的名字和code
            const districtName = res.address_detail.city;
            let districtCode = city;
            // 如果选的是直辖市下属区县，改成省级编码
            if (districtCode === '110100' || districtCode === '120100' || districtCode === '310100' || districtCode === '500100' ) { // 如果选的是直辖市下属区县，改成省级编码
              districtCode = districtCode.substr(0, 2) + '0000';
            }
            resolve({ province, city, county, districtName, districtCode });
          }
        });
      });
    });
  }
}
