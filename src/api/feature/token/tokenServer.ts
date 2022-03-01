import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 获取各种token授权
export class TokenServer {
    public rSerivce: any;
    private arcgisTokenUrl: any; // token 配置
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.arcgisTokenUrl = publishObjectPath.value.arcgisToken.url;
    }
    /**
   * arcgis 服务token获取
   * @param unit token的有效期(hour,day,week,month,year 五个枚举值，获取到的token对应一个单位的有效期)
   */
    public getArcgisToken(unit: any) {
        return new Promise(async (resolve, reject) => {
            const time: any = {
                hour: 60,
                day: 24 * 12 * 60,
                week: 24 * 12 * 60 * 7,
                month: 24 * 12 * 60 * 30,
                year: 24 * 12 * 60 * 30 * 365,
            };
            const data = {
                username: publishObjectPath.value.arcgisToken.username,
                password: publishObjectPath.value.arcgisToken.password,
                client: 'requestip',
                f: 'json',
                expiration: time[unit], // 1天，单位分钟
                encrypted: false,
                referer: publishObjectPath.value.arcgisToken.referer,
                ip: '',
            };
            $.ajax({
                type: 'POST',
                url: this.arcgisTokenUrl,
                dataType: 'json',
                async: false,
                data,
                success: (res) => {
                    resolve(res);
                },
                error: (err: any) => {
                    reject(new Error(err));
                },
            });
        });
    }
}

