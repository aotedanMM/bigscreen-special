
import {RequestServerClass} from '@/util/request';
import publishObjectPath from '@/util/configRegistry';

export class WeatherServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
    // 天气的数据
    public getWeatherData(data: any) {
        const url = publishObjectPath.value.serverPath + 'api/weatherData/findweatherdata/v1';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 天气配置的图片
    public getImgConfigData() {
        const url = 'json/weather/imgConfig.json';
        return this.rSerivce.serverObj.get(url);
    }
    // 未来24小时精细预报
    public getJXYBData(data: any) {
        const url = publishObjectPath.value.serverPath + 'api/weatherData/findweatherdata/v1';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 明后天预报
    public getTQYBData() {
        const url = 'json/weather/weatherTqyb.json';
        return this.rSerivce.serverObj.get(url);
    }

    // 空气质量数据
    public getAirQualityDataList() {
        const url = 'json/weather/weatherAirQuality.json';
        return this.rSerivce.serverObj.get(url);
    }

    // 获取降雨量
    public getHyetologyDataList(data: any) {
        const url = publishObjectPath.value.serverPath + 'api/weatherData/findweatherdata/v1';
        return this.rSerivce.serverObj.post(url, data);
    }

    // 获取行政规划数据
    public getAdministrative() {
        const url = 'json/weather/cityarr.json';
        return this.rSerivce.serverObj.get(url);
    }
    // 获取风力，温度，湿度    ---已弃用
    public getWeatherDataFn(latitude: any, longitude: any) { // 传入经纬度
        const url = publishObjectPath.value.serverPath + 'api/natWeaStationHour/v1/selectNatWeaStationHourListByKey?latitude=' + latitude + '&longitude=' + longitude ;
        return this.rSerivce.serverObj.get(url);
    }
}
