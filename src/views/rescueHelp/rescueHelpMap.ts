
import { gisStaticServer } from '@/api/installServer';

export const rescueHelpMap: any = {
    resetData: '',
    // 初始化方法
    init(cb: any, slef: any) {
        this.loadData.call(slef, cb);
    },
    async loadData(cb: any , index?: any) {
        const that: any = this;
        await gisStaticServer.getRescueHelp().then((data: any) => {
            that.rescueHelp = data;
            rescueHelpMap.resetData = data;
            cb(data.list , index);
            rescueHelpMap.vuexDataLoad(data.list, data.vuexList, that);
            rescueHelpMap.vuexcircleFlag(data.list, that);
        });
    },
    // 与vuex相关系的方法（目前只处理有total的情况）
    vuexDataLoad(data: any, key: any, self: any) {
        // 处理total 与 vuex 相关联的方式
        data.forEach((item: any) => {
            console.log(item);
            if (item.pushLocationKeyArr) {
                // 模块加处理
                item.pushLocationKeyArr.forEach((v: any) => {
                    item[key] += self.$store.state[item.vuexModuelName][v];
                    // 业务代码处理,当前为-1 ，则为业务判定
                    if (self.$store.state[item.vuexModuelName][v] === -1) {
                        item.tempTotal = '';
                    } else {
                        item.tempTotal = true;
                    }
                });
            }
        });
        // 主动调用向nva 发送的事件
        rescueHelpMap.sendNvaTotal(data, self);
    },
    // 烈度圈与经验圈的的vuex的代码(纯业务的处理)
    vuexcircleFlag(data: any, self: any) {
        data.forEach((item: any) => {
            item.circleFlag = self.$store.state.controlMoudle.mapCircleQueryType;
        });
    },
    // 当vuex的值变了时。主动向导航推送消息，更改值或,定义vuex里面的key进行触发。
    sendNvaTotal(data: any, self: any) {
        let tempTotal = 0;
        data.forEach((item: any) => {
            if (item.tempTotal) {
                tempTotal++;
            }
        });
        self.messsageBus.emit('nvaTotal', tempTotal, 2);
    },
    // 重置数据的方法
    resetThisData(slef: any) {
        rescueHelpMap.vuexDataLoad(rescueHelpMap.resetData.list , rescueHelpMap.resetData.vuexList , slef);
    },
    // 切换2d、3d的方法
    changeMapDimension(data: any) {
        this.$store.commit('controlMoudle/setMapDimensionality', data);
    },
};
