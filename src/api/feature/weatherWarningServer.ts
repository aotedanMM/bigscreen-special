import { RequestServerClass } from '../../util/request';

/* 预警信息*/
export class WeatherWarningServer {
  public rSerivce: any;
  public param: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }

  /**
   * 按照条件查询预警信息
   * @param opts
   * @param opts.starttime 开始时间
   * @param opts.endtime 结束时间
   * @param opts.searchType
   * @param opts.districtCode 行政区划
   */
  public getWeatherWarningInforData() {
    const starttime = this.timeChange(new Date().getTime() - 86400000 * 3);
    const endtime = this.timeChange(new Date().getTime());
    const str = '';
    const searchType = ''; // 行政区划code个数1或2
    const districtCode = '';
    $.ajax({
      type: 'POST',
      url:
        (window as any).EMAP_CONFIG.common.urlWeb + '/weatherData/getTypeCount',
      dataType: 'json',
      async: true,
      data: {
        vSignaltype:
          '11B01,11B03,11B09,11B25,11B37,11B04,11B56,11B05,11B16,11B21,11B17,11B22,11A01,11B14,11B19,11B15,11B07,11B06',
        starttime,
        endtime,
        searchType,
        districtCode,
      },
      success: (data) => {
        if (data.success) {
          var sum = 0;
          sum = data.data.length;
          data.data.sort((a: any, b: any) => {
            // 有数量的排前面
            return b.num - a.num;
          });
        }
      },
    });
  }

  /*时间转化类型*/
  public timeChange(dates: any) {
    const date = new Date(dates);
    const year: any = date.getFullYear();
    let mouth: any = date.getMonth() + 1;
    mouth = mouth < 10 ? '0' + mouth : mouth;
    let days: any = date.getDate();
    days = days < 10 ? '0' + days : days;
    let hours: any = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let sconds: any = date.getSeconds();
    sconds = sconds < 10 ? '0' + sconds : sconds;
    let miniuts: any = date.getMinutes();
    miniuts = miniuts < 10 ? '0' + miniuts : miniuts;
    const str =
      year +
      '-' +
      mouth +
      '-' +
      days +
      ' ' +
      hours +
      ':' +
      sconds +
      ':' +
      miniuts;
    return str;
  }

  /**
   * 按照类型查询预警信息
   * @param opts
   * @param opts.districtCode 行政区划
   * @param opts.endtime 结束时间
   * @param opts.searchType
   * @param opts.starttime 起始时间
   * @param opts.vSignaltype 类型
   */
  public queryDataType(opts: any, datatitle: any) {
    $.ajax({
      type: 'POST',
      url:
        (window as any).EMAP_CONFIG.common.urlWeb + '/weatherData/getTypeList',
      dataType: 'json',
      async: false,
      data: opts,
      success: (data) => {
        console.log(data);
      },
    });
  }

  /* 根据行政区划分类 */
  public districtStatistics(data: any) {
    // 拆分数据类型
    const maps: any = {};
    const dest: any = [];
    const citydest: any = [];
    if (!!data) {
      for (const i of data) {
        const ai = i;
        if (!!ai.districtcode) {
          const district = ai.districtcode.substring(0, 2) + '0000'; // 省
          if (!maps[district]) {
            dest.push({
              districtcode: district,
              count: 1,
            });
            maps[district] = ai;
          } else {
            for (const j of dest) {
              const dj: any = j;
              const distr: any = ai.districtcode.substring(0, 2) + '0000';
              if (dj.districtcode.substring(0, 2) + '0000' === distr) {
                dj.count++;
                break;
              }
            }
          }
        }
      }
    }
    const alldest: any = {};
    alldest.dest = dest;
    return alldest;
  }
}
