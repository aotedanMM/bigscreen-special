/**
 *缺少行政区划字段
 **/
// import { messsageBus } from '@/util/message';

const development: any = {
  // 住宅区
  name: '暂无标题',
  unitObj: {
  },
  dataFilter: ['name', 'phone', 'address', 'districtname'],
  labelObj: {
    name: '名称',
    phone: '电话',
    address: '地址',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
    // tslint:disable-next-line:no-debugger
    // debugger;
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
  },
};

export { development };
