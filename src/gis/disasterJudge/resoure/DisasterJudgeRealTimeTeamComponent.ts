import Util from '../../Util';
/**
 * 灾情研判单类资源展示
 */
import { realtimeTeam } from '@/api/installServer';
// import componentBase from './DisasterJudgeResourceComponent';
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    // 资源类型
    addRealTimeTeamInterval0: null,
    addRealTimeTeamInterval: null,
    equipmentlist: null,
  },
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
  },
  load(dataArry: any, type: string, simpleRenderMgr: any, featureType: string, list: any, self: any) {
    componentBase.prototype.load.call(this);
    this.options.self =  self;
    if (!this.options.self.forward) {
        return;
    }
    this._getFrontLineTeam(dataArry, type, simpleRenderMgr, featureType, list);
  },
      /**
     * 找出每个烈度圈或影响圈前突队伍并加定时器，10s刷新一次
     * @param dataArry 每个烈度圈或影响圈的所有数据，类型数组，必填
     */
    _getFrontLineTeam(dataArry: any, type: string, simpleRenderMgr: any, featureType: string, list: any) {
        const self = this;
        const teamA: any = [];
        const teamB: any = [];
        const teamBIds: any = [];
        const dataList = dataArry.list;
        if (dataList.length > 0) {
            for (const i of Object.keys(dataList)) {
                const item = dataList[i];
                if (item.name.indexOf('（前突）') !== -1) {
                    teamB.push(item);
                    teamBIds.push(item._id);
                } else {
                    teamA.push(item);
                }
            }
        }
        self._getData(teamBIds, teamB, type, simpleRenderMgr, featureType, list);
        this.addRealTimeTeamInterval0 = setTimeout(() => {
            console.debug('>>>>>>>>>开启前突队伍定时器');
            if (teamBIds && teamBIds !== '') {
                this.addRealTimeTeamInterval = setInterval(() => {
                    self._getData(teamBIds, teamB, type, simpleRenderMgr, featureType, list);
                }, 60000);
            }
        }, 500);
    },
    /**
     * 把前突放在后面
     * @param dataArry 救援队伍数据
     */
    deallTeam(dataArry: any) {
        const teamA: any = [];
        const teamB: any = [];
        let itemArry: any = [];
        const dataList = dataArry.list;
        if (dataList.length > 0) {
            for (const i of Object.keys(dataList)) {
                const item = dataList[i];
                if (item.name.indexOf('（前突）') !== -1 && item.notReadCount && item.notReadCount > 0) {
                    teamB.push(item);
                } else {
                    teamA.push(item);
                }
            }
            itemArry = teamA;
            itemArry.push.apply(itemArry, teamB);
        }
        if (itemArry.length > 0) {
            dataArry.list = itemArry;
        } else {
            dataArry.list = dataArry.list;
        }
        return dataArry;
    },
    /**
     * 清除定时器
     */
    clearRealTimeTeamInterval() {
        console.debug('>>>>>>>>>清除前突队伍定时器');
        if (this.addRealTimeTeamInterval0) {
            clearTimeout(this.addRealTimeTeamInterval0);
        }
        if (this.addRealTimeTeamInterval) {
            clearInterval(this.addRealTimeTeamInterval);
        }
        this.addRealTimeTeamInterval0 = null;
        this.addRealTimeTeamInterval = null;
    },
     /*时间转化类型*/
  timeChange(dates: any) {
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
  },
    /**
     * 查询前突队伍对应的装备
     * @param id  string，前突队伍的所有id,格式："id,id,id"
     * @param teamB Array,前突队伍数组
     */
    _getData(id: string, teamB: any, typeCode: string, simpleRenderMgr: any, featureType: string, list: any) {
        console.debug('>>>>>>>>>前突队伍地图点位定时器');
        const endTime = this.timeChange(new Date().getTime());
        const obj = {
            startTime: this.options.self.options.eventInfo.eventInfo.eventTime ? this.options.self.options.eventInfo.eventInfo.eventTime : endTime,
            endTime,
            teamIdArray: id,
        };
        realtimeTeam.getEquipmentListServer(obj).then((res: any) => {
            if (res.code === 0) {
                this.equipmentlist = res.data;
                const dataArr = this.equipmentlist;
                if (dataArr.length > 0) {
                    for (const j of Object.keys(dataArr)) {
                        const dataArri = dataArr[j];
                        const teamid = dataArri.teamid;
                        if (list.length > 0) {
                            for (const jj of Object.keys(list)) {
                                const teamBi = list[jj];
                                const teamBiid = teamBi._id;
                                if (teamid === teamBiid) {
                                    if (this.options.self.forward) {
                                    teamBi.geom.coordinates[0] = dataArri.longitude * 1;
                                    teamBi.geom.coordinates[1] = dataArri.latitude * 1;
                                    teamBi.notReadCount = dataArri.notReadCount;
                                    this.addRealTimeTeamPoint(typeCode, dataArri, simpleRenderMgr, featureType, [teamBi]);
                                    }

                                }

                            }
                        }
                    }
                }
            }
        });
    },
    /**
     * 更新点要素
     */
    addRealTimeTeamPoint(typeCode: string, dataArri: any, simpleRenderMgr: any, featureType: string, list: any) {
        const layer = simpleRenderMgr.getLayer(featureType);
        let element: any = null;
        const self = this.options.self;
        self.Util = Util;
        if (layer) {
            simpleRenderMgr.visitFeature(featureType,
                {
                    visit: (ele: any, layerTmp: any) => {
                        if (ele.id === dataArri.teamid) {
                            element = ele;
                            if ( dataArri.notReadCount && dataArri.notReadCount > 0) {
                                const attrObj: any = self.Util.attributeSet2Object(ele.attributeSet);
                                attrObj.notReadCount = dataArri.notReadCount;
                                if (self.forward) {
                                    self._blinkHightlight(typeCode, [dataArri.longitude * 1, dataArri.latitude * 1], attrObj);
                                } else {
                                    self._blinkHightlight(typeCode, [element.geometry.x, element.geometry.y], attrObj);
                                }
                            }
                            return false;
                        }
                        return true;
                    },
                },
            );
            if (element) {
                simpleRenderMgr.update({// 更新图标
                    featureType,
                    list,
                  });
            }
        }
    },
});
export default component;
