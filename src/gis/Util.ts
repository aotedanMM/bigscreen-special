export default {
    /**
     * 元素的属性集合转换为对象
     * @param attributeSet
     */
    attributeSet2Object(attributeSet: any) {
        const obj: any = {};
        for (let i = 0; i < attributeSet.getCount(); i++ ) {
            const attribute = attributeSet.getItem(i);
            obj[attribute.name] = attribute.value;
        }
        return obj;
    },

    /**
     * 检查属性变化
     * @param oldInstance {Object}
     * @param newInstance {Object}
     * @param keys {Array} 属性名数组
     */
    detectChange(oldInstance: any , newInstance: any , keys: any): boolean {
        let changeCount: number = 0;
        if (oldInstance && newInstance && keys) {
            for (const key of keys ) {
                const oldVal: any = oldInstance[key];
                const newVal: any = newInstance[key];
                if (oldVal === newVal) {
                    continue;
                }
                if ( Object.prototype.toString.call(oldVal) === '[object Object]' ||
                    Object.prototype.toString.call(oldVal) === '[object Array]' ) {
                    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                        changeCount++;
                    }
                 } else {
                     changeCount++;
                 }
            }
        }
        return changeCount > 0;
    },
    /**
     *
     * @param obj
     */
    toJSON(obj: any) {
        return JSON.parse(JSON.stringify(obj || {}));
    },
};

