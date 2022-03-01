import { RequestServerClass } from '../../../util/request';

// 防御准备
export default class RainSituationServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }

  /**
   * 获取人员转移
   * @param eventId
   */
  public getPeopleTransfer(eventId: string) {
    return new Promise((resolve, reject) => {
      const data: any = {
        estimatedNum: 10, // 预计转移人数(万人)
        practicalNum: 11, // 实际转移人数(万人)
        populationShiftsList: [
          // 人口转移情况
          {
            cityName: '莱山区', // 区划
            cityCode: '370613', // 区划
            estimated: 12, // 预计转移人数(万人)
            practical: 13, // 实际转移人数(万人)
            ratio: 0.2, // 转移率
            longitude: 112.333, // 地图定位经度
            latitude: 22.33, // 地图定位纬度
            list: [
              {
                label: '在建工地受影响人数',
                num: 12, // 在建工地数量
                affected: 12, // 受影响人数
                transfered: 12, // 转移人数
              },
              {
                label: '建筑物受影响人数',
                num: 12, // 建筑物数量
                affected: 12, // 受影响人数
                transfered: 12, // 转移人数
              },
              {
                label: '危房受影响人数',
                num: 12, // 危房数量
                affected: 12, // 受影响人数
                transfered: 12, // 转移人数
              },
              {
                label: '削坡建房受影响人数',
                num: 12, // 削坡建房数量
                affected: 12, // 受影响人数
                transfered: 12, // 转移人数
              },
            ],
          },
        ],
      };
      resolve(data);
    });
  }

  /**
   * 获取船舶归港
   * @param eventId
   */
  public getShipAshore(eventId: string) {
    return new Promise((resolve, reject) => {
      const data: any = {
        shipsAffectedNum: 1, // 船舶受影响数量
        shipsBackPortNum: 2, // 船舶已归港数量
        personnelAffectedNum: 3, // 人员 受影响人数
        personnelAshoreNum: 4, // 人员 已上岸人数
        shipPersonList: [
          {
            cityName: '莱山区', // 区划
            cityCode: '370613', // 区划
            shipsAffectedNum: 5, // 船舶受影响数量
            shipsBackPortNum: 6, // 船舶已归港数量
            personnelAffectedNum: 7, // 人员 受影响人数
            personnelAshoreNum: 8, // 人员 已上岸人数
            shipRatio: 0.2, // 归港率
            peopleRatio: 0.2, // 上岸率
          },
        ],
      };
      resolve(data);
    });
  }
}
