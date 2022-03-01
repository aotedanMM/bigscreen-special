
/**
 * 公共的gis相关状态
 */
export default {
    namespaced: true,
    state: {
        zoom: 5,
        mousePoint: [],
        // 当前显示的行政区划名称
        districtShowName: '',
        // 当前行政区划信息
        district: {
            districtCode: '',
            districtName: '',
            province: '',
            city: '',
            county: '',
        },
        // 地图左上右下边距
        margin: {
            left: 500,
            top: 100,
            right: 500,
            bottom: 80,
        },
        SetRiveRadius: '', // 河流初始化状态值
    },
    mutations: {
        zoomUpdate(state: any, data: any) {
            state.zoom += data;
        },
        mousePointUpdate(state: any, data: any) {
            state.mousePoint = data;
        },
        changeDistrictShowName(state: any, data: any) {
            state.districtShowName = data;
        },
        MapSetRiveRadius(state: any, data: any) {
            state.SetRiveRadius = data;
        },
        changeDistrict(state: any, data: any) {
            // 组件改变触发
            const district: any = {};
            const districtCode: string = data.districtCode;
            district.districtCode = districtCode;
            district.districtName = data.districtName;
            // 处理省市县
            if (districtCode !== '000000') {
                district.province = ('' + districtCode).substr(0, 2) + '0000';
                if (!districtCode.endsWith('0000')) {
                    district.city = ('' + districtCode).substr(0, 4) + '00';
                    if (!districtCode.endsWith('00')) {
                        district.conty = districtCode;
                    }
                }
            }
            state.district = district;
        },
        // 更新margin
        changeMargin(state: any, data: any) {
            for (const key of Object.keys(data)) {
                state.margin[key] = data[key];
            }
        },
    },
    actions: {
        zoomUpdate(state: any, data: any) {
            state.commit('zoomUpdate', data);
        },
        mousePointUpdate(state: any, data: any) {
            state.commit('mousePointUpdate', data);
        },
    },
};
