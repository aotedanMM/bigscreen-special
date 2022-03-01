import moment from 'moment'; // 导入moment

const filterStrArr = ['null', 'NULL', 'undefined', 'UNDEFINED'];

const filterType: any = {
    // 判断值是否恒等于 null undefined 'null' 'undefined'
    // value 值
    // targetItem
    // targetItem.replaceStr 表示当null时，希望展示的文本
    isNullStr(value: any, targetItem: any) {
        let result: any = value;
        if (value === 0) {
            return result;
        }
        if (!value || filterStrArr.includes(value)) { // null undefined
            result = targetItem.replaceStr || '暂无数据';
            return result;
        }
        return result;
    },
    // 时间戳转为字符串
    // value 值
    // targetItem
    // targetItem.replaceStr 表示当null时，希望展示的文本
    // targetItem.formatStr 表示时间戳，希望展示的文本
    isTimestamp(value: any, targetItem: any) {
        let result: any = value;
        if (!value || filterStrArr.includes(value)) { // null undefined
            result = targetItem.replaceStr || '暂无数据';
            return result;
        }
        result = moment(new Date(value)).format(targetItem.formatStr || 'YYYY-MM-DD HH:mm:ss');
        return result;
    },
    // 数字和单位直接进行组合,如果有值，就是值+单位，如果没有值，直接返回暂无数据等
    // value 值
    // targetItem
    // targetItem.replaceStr 表示当null时，希望展示的文本
    isDefaultUnit(value: any, targetItem: any) {
        value += ''; // 这是为了把数字直接转成字符串
        let result: any = value;
        if (!value || filterStrArr.includes(value)) { // null undefined
            result = targetItem.replaceStr || '暂无数据';
            return result;
        }
        if (targetItem.filterRule && targetItem.filterRule.pointNum) {
            const pointNum = targetItem.filterRule.pointNum;
            value = Math.round(parseFloat(value) * pointNum) / pointNum;
        }
        result = value + targetItem.unit;
        return result;
    },
    isMareThanValue(value: any, targetItem: any) {
        value += ''; // 这是为了把数字直接转成字符串
        // let result: any = value;
        if (!value || filterStrArr.includes(value)) { // null undefined
            value = '0';
        }
        const newValue = +value;
        let resultItem: any = {
            unit: targetItem.unit,
            value: newValue,
        };
        targetItem.filterRule.forEach((item: any, index: number) => {
            if (newValue >= item.range) {
                resultItem = {
                    ...item,
                };
                resultItem.value = Math.round( (newValue / item.range) * item.pointNum) / item.pointNum;
            }
        });
        return resultItem;
    },
};

const getFormatData = function(value: any, targetItem: any) {
    let result: any = '';
    result = filterType[ targetItem.filterType || 'isNullStr'](value, targetItem);
    return result;
};

const formadResultValue = function(value: any) {
    return value.value;
};

const formadResultUnit = function(value: any) {
    return value.unit;
};

export {
    getFormatData,
    formadResultValue,
    formadResultUnit,
};
