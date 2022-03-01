/**
 *
 **/
// import { messsageBus } from '@/util/message';


export const DangerousChemical: any = {'ANJIAN_DAGCHEMENT※DangerousChemical': {// 危化企业
 // 危化企业
 name: '暂无标题',
 unitObj: {
 },
 dataFilter: [
   'safetylevel',
   'address',
   'chargeperson',
   'staffnum',
   'totalproduction',
   'totalstorage',
   'mainproduct',
 ],
 labelObj: {
   safetylevel: '安全风险等级',
   address: '地址',
   chargeperson: '企业负责人',
   staffnum: '职工人数',
   totalproduction: '总生产量',
   totalstorage: '总存储量',
   mainproduct: '主要产品及生产规模',
 },
 popHeight: 616,
 cb(self: any) {
   const that = self;
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

},
};


