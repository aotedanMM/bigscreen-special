/**
    实时车辆*/

const fireCar: any = {
    // 实时车辆
    name: 'NAME',
    unitObj: {
        speed: 'km/h',
    },
    dataFilter: [
        'cphm',
        'speed',
        'direction_new',
        'longitude',
        'latitude',
        'time',
    ],
    labelObj: {
        cphm: '车牌号码',
        speed: '行驶速度',
        direction_new: '行驶方向',
        longitude: '经度',
        latitude: '纬度',
        time: '时间',
    },
    cb(self: any) {
        const that = self;
        // that.data.direction_new =
        switch (Math.floor(that.data.direction / 45)) {
           case 0:
           case 7:
               that.data.direction_new = '西';
               break;
           case 1:
           case 2:
               that.data.direction_new = '北';
               break;
           case 3:
           case 4:
               that.data.direction_new = '东';
               break;
           case 5:
           case 6:
               that.data.direction_new = '南';
               break;
       }

        that.data.longitude = Math.round((parseFloat('' + that.data.longitude)) * 100) / 100;
        that.data.latitude = Math.round((parseFloat('' + that.data.latitude)) * 100) / 100;

        that.getData(that.data);
    },
};

export { fireCar };
