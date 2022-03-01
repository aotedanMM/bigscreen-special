<template>
  <WarningInfo :loading='loading'  :warningInfoData="warningInfoData"></WarningInfo>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import WarningInfo from '@/components/feature/common/warningInfo/WarningInfo.feature.vue';
import { getDateFormat } from '@/util/tools';
import { warningInfoServer } from '@/api/installServer';

@Component({
  name: 'EarlywarningInfo',
  components: {
    WarningInfo,
  },
})
export default class EarlywarningInfo extends Vue {
  @Prop() public componentParam: any;
  private loading: boolean = false;
  // 事件信息列表
  private warningInfoData: any = [
    // {
    //   count: 0,
    //   name: '台风事件',
    //   districtcode: '',
    //   type: '11B01',
    // },
    // { count: 0, name: '暴雨事件', districtcode: '', type: '11B03' },
    // { count: 0, name: '高温事件', districtcode: '', type: '11B09' },
    // { count: 0, name: '森林火险', districtcode: '', type: '11B25' },
    // { count: 0, name: '地质灾害气象风险', districtcode: '', type: '11B37' },
  ];
  private resData = [];
  private typeCodes: any = null;
  private districtCode: any = null;
  // 获取预警信息
  private getWarningInfo() {
    this.loading = true;
    const opts = {
      type: '11B01,11B03,11B09,11B25,11B37', // 未生效
      // startTime: getDateFormat({ last: 'oneDay' }), // 120部署时间
      startTime: getDateFormat({ last: 'year' }), // quarter day3
      endTime: getDateFormat(),
      districtCode: this.districtCode,
    };
    warningInfoServer
      .getDataHas(opts)
      .then((res: any) => {
        if (res && res.data.length) {
          const data = res.data;
          if (this.typeCodes && this.typeCodes.length > 0) {
            this.warningInfoData = [];
            data.forEach((element: any) => {
              if (this.typeCodes.includes(element.type)) {
                this.warningInfoData.push(element);
              }
            });
          } else {
            this.warningInfoData = data;
          }
          this.loading = false;
        }
      });
  }
  private created() {
    // this.getWarningInfo();
    this.getComponetParam(this.componentParam);
  }
    // 监听关键字
  @Watch('componentParam')
  private getComponetParam(val: any) {
    this.typeCodes = null;
    this.districtCode = null;
    if (this.componentParam) {
      if (this.componentParam.typeCodes) {
        this.typeCodes = this.componentParam.typeCodes;
      }
      if (this.componentParam.typeCodes) {
        this.districtCode = this.componentParam.districtCode;
      }
    }
    this.getWarningInfo();
  }
}
</script>