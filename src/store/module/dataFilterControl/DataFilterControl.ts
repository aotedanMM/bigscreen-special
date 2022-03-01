/**
 *  左侧那些面板数据筛选的条件控制
*/
import publishObjectPath from '@/util/configRegistry';
export default {
    namespaced: true,
    state: {
        filter : { // districtCode geometry可以并存，查询时取交集
            // 默认为烟台的行政区划,综合研判资源筛选变量，逗号隔开。
            // 行政区划选择面板赋值，解决综合研判行政区划几何查询过慢问题
            districtCode: publishObjectPath.value.district.root,
            geometry: '', // 这里存放的是geoJson字符串
        },
        // 存放综合研判那三个控制按钮的类型，之所以放在这，是因为和geometry是一起的
        zhypGeoType: {
            key: '',
            // 这个key为：
            // hcqyp代表缓冲区分析，
            // xzqhyp代表行政区划分析，
            // hlyp代表河流研判，
            // tfyp代表台风研判
            // 没有值为默认
            // searchYp 为搜索后的那个缓冲结果的研判
            // jyqYp经验圈研判
            // ldqYp烈度圈研判
            value: {
                // 下面的之所以是数组，是为了适配烈度圈s
                // indexArr: [selectedIndex], // 选中的数组下标
                // rangeArr: [JSON.parse(JSON.stringify(selectedRange))], // 选中的range
            },
        },
    },
    // 不建议直接调用mutations中的方法
    mutations: {
        // 更新当前选中的筛选条件的类型，主要是用来控制面板的高亮、出现等逻辑
        updateZhypGeoType(content: any, data: any) {
            const oriObj = content.zhypGeoType || {key: ''};
            data.key = data.key || '';
            if (oriObj.key !== data.key) {
                content.zhypGeoType = data;
            } else { // 当从经验圈的 5公里切换到10公里的时候
                content.zhypGeoType.value = data.value;
            }
        },
        // 更新数据筛选的条件，主要用来对数据进行真正的筛选的查询条件
        updateFilter(content: any, data: any) {
            if (!data.geometry) { // 当geometry,没有值的时候，走默认的行政区划,对于烟台项目而言，是370600
                data.districtCode = data.districtCode || publishObjectPath.value.district.root;
            }
            // 当值没有发生改变的时候，不执行
            if (content.filter.districtCode === data.districtCode && content.filter.geometry === data.geometry) {
                return ;
            }
            // 这里必须进行整体赋值，以便在vue内部对整体进行监听
            content.filter = {
                districtCode: data.districtCode || '', // "370686"
                geometry: data.geometry || '',
            };
        },
    },
    actions: {
        UpdateFilterCondition(context: any , data: any) {
            context.commit('updateZhypGeoType', data.zhypGeoType || {});
            context.commit('updateFilter', data.filter || {});
        },
    },
};
