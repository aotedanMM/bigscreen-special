/**
 *缺少 行政区划 职务
 **/
// import { messsageBus } from '@/util/message';
export const NearbyDisinfoper: any = {
    'NearbyDisasterPer※01': {
        // 灾情信息员
      name: '暂无标题',
      unitObj: {
        _distance: 'km',
      },
      telobj: {
        phone: 'phone',
      },
      dataFilter: ['districtname', 'duty', 'phone', '_distance'],
      labelObj: {
        districtname: '行政区划',
        duty: '职务',
        phone: '电话',
        _distance: '距事发地',
      },
      // 下方的按钮
      btnFilter : [
        // 'pathPlanningBtn', // 路径规划
        // 'aroundAnalysisBtn', // 周边分析
        // 'videoMonitoringBtn', // 视频监控
        // 'hazardousChemicalsBtn', // 危化物联
      ],
      popHeight: 330,
      cb(self: any) {
        const that = self;
        // tslint:disable-next-line:no-debugger
        // debugger;
        if ( that.data.dis || that.data.dis === 0) {
          that.data._distance =  that.data.dis / 1000;
        }
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
