
import { RequestServerClass } from '../../../util/request';
import { geocodeServer } from '@/api/installServer.ts';
// 灾情研判服务
export class CommunicationServer {

    public rSerivce: any; // 老服务
    public newService: any; // 新服务
    public serverUrl: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.serverUrl = opt.baseURL;
        opt.baseURL = (window as any).EMAP_CONFIG.common.urlWeb;
        opt.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        this.rSerivce = new RequestServerClass(opt);
        this.newService = new RequestServerClass({ baseURL: this.serverUrl });
    }

    /**
     * 终端统计
     * @param opts
     * @param opts.point [Array]
     * @param opts.radius [Number] 单位千米
     */
    public getTerminalCount(opts: any) {
        // const url = (window as any).EMAP_CONFIG.common.urlWeb + '/statisticsCount/queryTerminationsCount';
        const url = '/api/equipment/queryequipmentcount/list/v1';
        const data = {
            longitude: opts.point[0],
            latitude: opts.point[1],
            radius: opts.radius,
        };
        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url, data).then((response: any) => {
                    resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
            // $.ajax({
            //     type: 'POST',
            //     url,
            //     data,
            //     success: (res) => {
            //         resolve(res);
            //     },
            //     error: (err) => {
            //         reject(err);
            //     },
            // });
        });
    }
    /**
     * 设备列表
     * @param opts
     * @param opts.point [Array]
     * @param opts.radius [Number] 单位千米
     * @param opts.type [String] 北斗终端：1；|天通终端：2；|视频回传：3；|短波电台：4；|消防车辆：5；|消防移动终端：6；|全部（1,2,3,4,5,6）：0
     * @param [opts.order] [String] 默认为空
     */
    public getTerminalList(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (opts.type + '' === '0') {
                self.getEquipmentList(opts).then((equipmentData: any) => {
                    const result = equipmentData;
                    self.getShortWaveList(opts).then((shortwaveData: any) => {
                        result.data.duanbo = shortwaveData.data;
                        resolve(result);
                        // result.data[0].duanbo = shortwaveData.data;
                        // const res = {
                        //     data: result.data[0],
                        // };
                        // resolve(res);
                    });
                });
            } else if (opts.type + '' === '4') {
                self.getShortWaveList(opts).then((data: any) => {
                    resolve(data);
                });
            } else {
                self.getEquipmentList(opts).then((data: any) => {
                    const res = {
                        data: data.data,
                    };
                    resolve(res);
                });
            }
        });
    }

    /**
     * 设备id查询
     * @param opts
     * @param opts.id [Array]
     * @param opts.type [String] 北斗终端：1；|天通终端：2；|视频回传：3；|消防车辆：5；|消防移动终端：6；|全部（1,2,3,4,5,6）：0
     * @param opts.startTime [String]   'yyyy-MM-dd hh:mm:ss'
     * @param opts.endTime [String]    'yyyy-MM-dd hh:mm:ss'
     */
    public getTerminalById(opts: any) {
        const self = this;
        const param: any = {};
        param.type = opts.type;
        switch (opts.type + '') {
            case '1':
                param.souceAddr = opts.id;
                break;
            case '2':
                param.terminalId = opts.id;
                break;
            case '3':
                param.id = opts.id;
                break;
            case '4':
                break;
            case '5':
                param.gpsid = opts.id;
                break;
            case '6':
                param.perlocationid = opts.id;
                break;
            default:
                break;
        }
        return new Promise((resolve, reject) => {
            const url = '/api/equipment/queryequipmentbyid/v1';
            this.newService.serverObj.post(url, param).then((response: any) => {
                if (response.data.data) {
                    if (response.data.data.sourceAddress) {
                        if (!response.data.data.souceAddr) {
                            response.data.data.souceAddr = response.data.data.sourceAddress;
                        }
                    }
                    if (response.data.data.sourceName) {
                        if (!response.data.data.souceName) {
                            response.data.data.souceName = response.data.data.sourceName;
                        }
                    }
                    if (response.data.data.userId) {
                        if (!response.data.data.userid) {
                            response.data.data.userid = response.data.data.userId;
                        }
                    }
                    if (response.data.data.userName) {
                        if (!response.data.data.username) {
                            response.data.data.username = response.data.data.userName;
                        }
                    }
                    if (response.data.data.updateTime) {
                        if (!response.data.data.updatetime) {
                            response.data.data.updatetime = response.data.data.updateTime;
                        }
                    }
                    if (response.data.data.gxsj) {
                        if (!response.data.data.time) {
                            response.data.data.time = response.data.data.gxsj;
                        }
                    }
                }
                self.addAddressAttr(response.data).then((data: any) => {
                    if (!data.data) {
                        data.data = {};
                    }
                    self.getTerminalHistoryById(opts).then((result: any) => {
                        data.data.trackhistory = result.data;
                        if (data.data.direction) {
                            data.data.angle = data.data.direction;
                            data.data.direction = this.getDirectionByAngle(data.data.angle);
                        }
                        resolve(data);
                    });
                });
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 设备历史
     * @param opts
     * @param opts.id [Array]
     * @param opts.startTime [String]   'yyyy-MM-dd hh:mm:ss'
     * @param opts.endTime [String]    'yyyy-MM-dd hh:mm:ss'
     * @param opts.type [String] 北斗终端：1/7/8；|天通终端：2；|视频回传：3；|消防车辆：5；|消防移动终端：6；|全部（1,2,3,4,5,6）：0
     */
    public getTerminalHistoryById(opts: any) {
        const self = this;
        // let url = (window as any).EMAP_CONFIG.common.urlWeb + '/equipment/queryEquipmentByIdHis';
        let url = this.serverUrl + '/api/equipment/equipmentbyidhis/list/v1';
        const param: any = {};
        param.startTime = opts.startTime;
        param.endTime = opts.endTime;
        param.type = opts.type;
        switch (opts.type + '') {
            case '1':
                param.souceAddr = opts.id;
                break;
            case '2':
                param.terminalId = opts.id;
                break;
            case '3':
                param.userid = opts.id;
                if (!param.userId) {
                    param.userId = opts.id;
                }
                // url = (window as any).EMAP_CONFIG.common.urlWeb + '/equipment/queryappByIdHis';
                url = this.serverUrl + '/api/equipment/mobile/coordinatehis/list/v1';
                delete param.type;
                break;
            case '4':
                break;
            case '5':
                param.gpsid = opts.id;
                break;
            case '6':
                param.perlocationid = opts.id;
                break;
            default:
                break;
        }
        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url, param).then((response: any) => {
                if (response.data.data) {
                    response.data.data.forEach((element: any) => {
                        if (!!element.reportTime && !element.time) {
                            element.time = element.reportTime;
                        }
                        if (!!element.gxsj && !element.time) {
                            element.time = element.gxsj;
                        }
                    });

                }
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
            // $.ajax({
            //     type: 'POST',
            //     url,
            //     // contentType: 'application/json;charset=UTF-8',
            //     data: param,
            //     success: (res) =>  {
            //         resolve(res);
            //     },
            //     error: (err) => {
            //         reject(err);
            //     },
            // });
        });
    }
    /**
     * 获取附件
     * @param opts
     * @param opts.userid [String]
     */
    public getAttachments(opts: any) {
        const url = '/api/mobileapp/getfeedbackhistory/v1';
        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 获取短报文
     * @param opts
     * @param opts.pageNo [Number]
     * @param opts.pageSize [Number]
     * @param opts.startTime [String]
     * @param opts.endTime [String]
     */
    public getShortMessage(opts: any) {
        const url = '/api/equipment/rtd/termtoterm/page/list/v1';
        opts.pageNo = opts.pageNo || 1;
        if (!opts.nowPage) {
            opts.nowPage = opts.pageNo;
        }
        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
        // return new Promise((resolve, reject) => {
        //     $.ajax({
        //         type: 'get',
        //         url: (window as any).EMAP_CONFIG.common.urlWeb + '/rtdtermtotermcomm/selectByParem',
        //         data: opts,
        //         success: (res: any) => {
        //             resolve(res);
        //         },
        //         error: (err: any) => {
        //             reject(err);
        //         },
        //     });
        // });
    }

    /**
     * 根据id获取短报文
     * @param opts
     * @param opts.id [String]
     * @param [opts.pageNo] [Number]
     * @param [opts.pageSize] [Number]
     * @param opts.startTime [String]
     * @param opts.endTime [String]
     */
    public getShortMessageById(opts: any) {
        const self = this;
        const url = '/api/equipment/rtd/termtoterm/commlist/v1';
        opts.pageNo = opts.pageNo || 1;
        opts.pageSize = opts.pageNo || 999;
        opts.souceAddr = opts.id;
        delete opts.id;

        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url, opts).then((response: any) => {
                const read = response.data.data.read;
                const notRead = response.data.data.notRead;
                // =================
                read.forEach((element: any) => {
                    element.address = element.longitude + ', ' + element.latitude;
                });
                notRead.forEach((element: any) => {
                    element.address = element.longitude + ', ' + element.latitude;
                });
                resolve(response.data);
                // =================
                // response.data.data.read = [];
                // response.data.data.notRead = [];
                // read.forEach((element: any) => {
                //     self.addAddressAttr({data: element}).then((res: any) => {
                //         response.data.data.read.push(res.data);
                //         if (response.data.data.read.length === read.length) {
                //             notRead.forEach((element2: any) => {
                //                 self.addAddressAttr({data: element2}).then((res2: any) => {
                //                     response.data.data.notRead.push(res2.data);
                //                     if (response.data.data.notRead.length === notRead.length) {
                //                         resolve(response.data);
                //                     }
                //                 }).catch((err: any) =>{
                //                     reject(err);
                //                 });
                //             });
                //         }
                //     }).catch((err: any) =>{
                //         reject(err);
                //     });
                // });
            }, (err: any) => {
                reject(err);
            });
        });
        // return new Promise((resolve, reject) => {
        //     $.ajax({
        //         type: 'get',
        //         url: (window as any).EMAP_CONFIG.common.urlWeb + '/rtdtermtotermcomm/getRtdTermtotermCommList',
        //         data: opts,
        //         success: (res: any) => {
        //             resolve(res);
        //         },
        //         error: (err: any) => {
        //             reject(err);
        //         },
        //     });
        // });
    }

    /**
     * 更新短报文已读状态
     * @param opts
     * @param opts.id [String]
     */
    public updateShortMessageStatus(opts: any) {
        const url = '/api/equipment/rtd/termtoterm/updateReceive/v1';
        opts.souceAddr = opts.id;
        delete opts.id;

        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
        // return new Promise((resolve, reject) => {
        //     $.ajax({
        //         type: 'POST',
        //         url: (window as any).EMAP_CONFIG.common.urlWeb + '/rtdtermtotermcomm/updateReceive',
        //         data: opts,
        //         success: (res) => {
        //             resolve(res);
        //         },
        //         error: (err) => {
        //             resolve(err);
        //         },
        //     });
        // });
    }

    /**
     * 更新视频回传已读状态
     * @param opts
     * @param opts.id [String]
     */
    public updateVedioStatus(opts: any) {
        const url = '/api/mobileapp/updatereadstatus/list/v1';
        if (!opts.userId) {
            opts.userId = opts.id;
        }
        // delete opts.id;

        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
        // return new Promise((resolve, reject) => {
        //     $.ajax({
        //         type: 'POST',
        //         url: (window as any).EMAP_CONFIG.common.urlWeb + '/mobile/updateSceneFeedback',
        //         data: opts,
        //         success: (res) => {
        //             resolve(res);
        //         },
        //         error: (err) => {
        //             resolve(err);
        //         },
        //     });
        // });
    }

   /**
     * 更新短波已读状态
     * @param opts
     * @param opts.id [String]
     */
    public updateShortwaveStatus(opts: any) {
        const url = '/api/shortwave/update/readstatu/v1';
        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
        // return new Promise((resolve, reject) => {
        //     $.ajax({
        //         type: 'POST',
        //         url: (window as any).EMAP_CONFIG.common.urlWeb + '/shortWave/updateJcShortWave',
        //         data: opts,
        //         success: (res) => {
        //             resolve(res);
        //         },
        //         error: (err) => {
        //             resolve(err);
        //         },
        //     });
        // });
    }

    private getDirectionByAngle(angle: any) {
        angle = (angle + 22.5) > 360 ? (angle + 22.5) - 360 : (angle + 22.5);
        const directions = ['西', '西北', '北', '东北', '东', '东南', '南', '西南'];
        let direction = '北';
        if (angle) {
            const index = Math.ceil(angle / 45);
            direction = directions[index - 1];
        } else {
            direction = '';
        }
        return direction;
    }
    private addAddressAttr(data: any) {
        return new Promise((resolve, reject) => {
            if (!data.data || !data.data.longitude || !data.data.latitude) {
                resolve(data);
            }
            const opt = {
                location: [data.data.longitude, data.data.latitude],
            };
            geocodeServer.getGaodeAddressByLocation(opt).then((res: any) => {
                data.data.address = res.address;
                resolve(data);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 设备列表
     * @param opts
     * @param opts.point [Array]
     * @param opts.radius [Number]
     * @param opts.type [String] 北斗终端：1；|天通终端：2；|视频回传：3；|消防车辆：5；|消防移动终端：6；|全部（1,2,3,5,6）：0
     * @param [opts.order] [String] 默认为空
     */
    private getEquipmentList(opts: any) {
        // const url = '/equipment/queryEquipment';
        const url = '/api/equipment/queryequipment/list/v1';
        const data: any = {
            longitude: opts.point[0],
            latitude: opts.point[1],
            radius: opts.radius,
            type: opts.type,
        };
        data.order = opts.order || '';
        return new Promise((resolve: any, reject: any) => {
            this.newService.serverObj.post(url, data).then((response: any) => {
                    response.data.data = response.data.data[0];
                    resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
            // $.ajax({
            //     type: 'POST',
            //     url: (window as any).EMAP_CONFIG.common.urlWeb + '/equipment/queryEquipment',
            //     data,
            //     success: (res) => {
            //         resolve(res);
            //     },
            //     error: (err) => {
            //         reject(err);
            //     },
            // });
        });
    }
    /**
     * 短波电台列表
     * @param opts
     */
    private getShortWaveList(opts: any) {
        // const url = '/shortWave/getshortWaveList';
        const url = '/api/shortwave/list/v1';
        return new Promise((resolve, reject) => {
            this.newService.serverObj.post(url).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
}

