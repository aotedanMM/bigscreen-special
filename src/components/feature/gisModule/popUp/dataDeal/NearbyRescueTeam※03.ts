// 周边分析点出的救援队的弹窗
// 使用的模板是 rescueForcesPop.vue
// 在dataDeal.ts 和 renderpopUpTemplate.vue这两个文件里，有相应的配置，可以根据关键字NearbyRescueTeam※03检索下

export const NearbyRescueTeam: any = {
    'NearbyRescueTeam※03': {
        // 救援队伍
        name: '暂无标题',
        unitObj: {
            peoplenum: '人',
        },
        dataFilter: [
            /* 'NAME',
            'ADDRESS',
            'DISTRICT',
            'RESCUECODE',
            'LEADER',
            'LEADERMTEL',
            'LEADERTEL', */
            'type',
            'districtname',
            'address',
            'peoplenum',
            'captain',
            'phone',
        ],
        labelObj: {
            /* NAME: '名称',
            ADDRESS: '地址',
            DISTRICT: '行政区划',
            RESCUECODE: '救援队编号', // 救援队编号
            LEADER: '队长',
            LEADERMTEL: '队长电话(主)',
            LEADERTEL: '队长电话', */
            type: '类型',
            districtname: '行政区划',
            address: '地址',
            peoplenum: '总人数(人)',
            captain: '队长',
            phone: '联系电话',
        },
        telPelope: { // 电话拨打后对应人名
            phone: 'captain',
        },
        telobj: {
            phone: 'phone',
        },
        popHeight: 489,
        cb(self: any) {
            const that = self;
            // tslint:disable-next-line:no-debugger
            if (
                that.data &&
                that.data.attributeSet &&
                that.data.attributeSet.attributes
            ) {
                that.dataAttributes = that.data.attributeSet.attributes;
                that.getpopData(that.dealAttributes());
            } else {
                that.getpopData(that.data);
            }
            that.isShowPathPlanningBtn = false;
        },
    },
};
