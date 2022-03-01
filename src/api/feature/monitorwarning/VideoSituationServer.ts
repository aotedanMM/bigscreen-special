import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 视频监测站点服务
export default class MonitorWarningServer {
  public rSerivce: any;
  public videoSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    opt.headers = { 'Content-Type': 'application/json' };
    const videoMonitorPath = publishObjectPath.value.videoMonitorPath;
    this.videoSerivce = new RequestServerClass({
      baseURL: videoMonitorPath.videoIp,
    });
    this.rSerivce = new RequestServerClass(opt);
  }
  /**
   * 获取视频监控分类统计信息
   * @param opts {Object}
   * @param opts.districtCode 行政区划代码
   * @returns {Promise}
   */
  public getVideoStatistics(opts: any) {
    const url = '/api/video/statTypeSum?districtCode=' + opts.districtCode + '&themeCode=' + opts.themeCode;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        const data = res.data;
        const newData: any = [];
        data.forEach((element: any) => {
          if (element.code !== 'ceshi') {
            newData.push(element);
          }
        });
        res.data = newData;
        resolve(res);
      });
    });
  }
    /**
   * 获取视频监控分类统计信息 带geometry
   * @param opts {Object}
   * @param opts.districtCode 行政区划代码
   * @returns {Promise}
   */
  public getVideoStatisticsNew(opts: any) {
    const url = '/api/video/statTypeSumGeom';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        const data = res.data;
        const newData: any = [];
        data.forEach((element: any) => {
          if (element.code !== 'ceshi') {
            newData.push(element);
          }
        });
        res.data = newData;
        resolve(res);
      });
    });
  }
  /**
   * 获取客户端ip地址
   */
  public getclientIp() {
    const url = '/api/video/getIP';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.get(url).then((res: any) => {
        resolve(res);
      });
    });
  }
  /**
   * 获取视频流token
   * @param opts.clientIp 客户端ip地址
   */
  // public getVideoToken(opts: any) {
  //   const url = `login/?userName=${publishObjectPath.value.videoMonitorPath.userName}&password=${publishObjectPath.value.videoMonitorPath.password}&ip=${opts.clientIp}`;
  //   return new Promise((resolve, reject) => {
  //     this.videoSerivce.serverObj.get(url).then((res: any) => {
  //       resolve(res);
  //     });
  //   });
  // }
  /**
   * 获取视频url
   * @param opts.password 视频流token
   * @param opts.camCode 摄像头编码
   */
  // public getVideorealPlay(opts: any) {
  //   const url = `video/real-play?password=${opts.password}&camCode=${opts.camCode}`;
  //   return new Promise((resolve, reject) => {
  //     this.videoSerivce.serverObj.get(url).then((res: any) => {
  //       resolve(res);
  //     });
  //   });
  // }
  /**
   * 分页查询视频监控列表
   * @param opts
   * @param opts.pageSize: 10,
   * @param opts.nowPage: 1,
   * @param opts.keyWord: '视频', //非必填，关键字
   * @param opts.districtCode: '370686', // 非必填，行政区划编码
   * @param opts.type: 'gongan' // 非必填，统计接口返回的类型code
   * @param opts.themeCode '1/2/3/4' 必填，专题对应code值
   * @returns {Promise}
   */
  public getVideoStationsList(opts: any) {
    const url = '/api/video/page';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        const result: any = {};
        const data = res.data;
        result.data = data.list;
        result.total = data.total;
        resolve(result);
      });
    });
  }
  /**
   * 获取在线单兵列表
   * @returns {Promise}
   */
  public getOnlinePawnList() {
    const url = '/api/video/individualsoldier';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        resolve(res);
      });
    });
  }
  /**
   * 按照行政区划来统计（区县，乡镇）聚合图层展示（地图组件使用）
   * @param opts
   * @param opts.keyWord: '视频', //非必填，关键字
   * @param opts.districtCode: '370686', // 非必填，行政区划编码
   * @param opts.type: 'gongan' // 非必填，统计接口返回的类型code
   * @param opts.districtType: 'town'|'county' // 必填，统计接口返回的类型code
   * @param opts.geometry
   * @returns {Promise}
   */
  public getVideoStatistics2map(opts: any) {
    const url = '/api/video/v1/statByDist';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res);
      });
    });
  }
  /**
   * 查询全部视频监控（地图组件使用）
   * @param opts
   * @param opts.keyWord: '视频', //非必填，关键字
   * @param opts.districtCode: '370686', // 非必填，行政区划编码
   * @param opts.type: 'gongan' // 非必填，统计接口返回的类型code
   * @param opts.geometry
   * @returns {Promise}
   */
  public getAllVideoStations(opts: any) {
    const url = '/api/video/findAll';
    return this.rSerivce.serverObj.post(url, opts);
  }
  /**
   * 查询视频详情
   * @param opts
   * @param opts.id 视频点位id

   */
  public getVideoStationDetail(opts: any) {
    const url = '/api/video/detail?id=' + opts.id;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        const result = res.data;
        // result.data.url = 'https://v-cdn.zjol.com.cn/277002.mp4';
        resolve(result);
      });
    });
  }
  /**
   * 获取视频播放地址
   * @param opts
   * @param opts.camCode 摄像头id
   * @param opts.clientIP 客户端ip
   * @param opts.userName 用户名
   * @param opts.password 密码
   */
  public getVideoUrl(opts: any) {
    const url = `/api/video/getVideoUrlHls?camCode=${opts.camCode}&password=${opts.password}&userName=${opts.userName}`;
    return this.rSerivce.serverObj.get(url);
    // const url = `要换的/api/video/getVideoUrl?camCode=${opts.camCode}&password=${opts.password}&userName=${opts.userName}`;
    // const url = `http://172.25.31.2:18084/api/video/getVideoUrl?camCode=${opts.camCode}&password=${opts.password}&userName=${opts.userName}`;
  }

   /**
   * 收藏 添加接口
   * @param opts
   * @param opts.themeCode '1/2/3/4' 必填，专题对应code值
   * @param opts.videoId ' 视频国标号
   * @returns {Promise}
   */
  public getFavoriteSave(opts: any) {
    const url = '/api/video/favorite/save?themeCode=' + opts.themeCode + '&videoId=' + opts.videoId;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        const result = res.data;
        // result.data.url = 'https://v-cdn.zjol.com.cn/277002.mp4';
        resolve(result);
      });
    });
  }
     /**
   * 收藏 删除接口
   * @param opts
   * @param opts.themeCode '1/2/3/4' 必填，专题对应code值
   * @param opts.videoId ' 视频国标号
   * @returns {Promise}
   */
  public getFavoriteDel(opts: any) {
    const url = '/api/video/favorite/del?themeCode=' + opts.themeCode + '&videoId=' + opts.videoId;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        const result = res.data;
        // result.data.url = 'https://v-cdn.zjol.com.cn/277002.mp4';
        resolve(result);
      });
    });
  }
}
