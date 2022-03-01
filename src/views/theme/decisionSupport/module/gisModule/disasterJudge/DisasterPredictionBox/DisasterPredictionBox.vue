<template>
    <div class="DisasterView DisasterPredictionBox">
        <DisasterPrediction
                :viewResData="viewResData"
                :viewData="viewData"
        ></DisasterPrediction>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import DisasterPrediction from '@/components/feature/gisModule/static/statistic.disasterPrediction.vue';
  import {Alert} from 'element-ui';
  import {pushDataRequestServe} from '@/api/installServer';
  import {
    KnownDisasterInterface,
    KnownDisasterDataField,
  } from '@/interface/feature/earthquake/KnownDisaster';

  @Component({
    name: 'DisasterPredictionBox',
    components: {
      DisasterPrediction,
    },
  })
  export default class DisasterPredictionBox extends Vue {
    private viewResData: any = [
      {
        leftName: '人员死亡',
        num: '0',
        numName: '人',
      },
      {
        leftName: '房屋倒塌',
        num: '0',
        numName: '万间',
      },
      {
        leftName: '经济损失',
        num: '0',
        numName: '万元',
      },
    ];
    private viewData: any = [
      {
        leftName: '人员死亡',
        num: '0',
        numName: '人',
        isChecked: true,
      },
      {
        leftName: '房屋倒塌',
        num: '0',
        numName: '万间',
        isChecked: false,
      },
      {
        leftName: '经济损失',
        num: '0',
        numName: '万元',
        isChecked: false,
      },
    ];
    private estimates: KnownDisasterDataField = {
      death: 0,
      hurt: 0,
      damage: 0,
      resuce: 0,
      transfer: 0,
    };

    private mounted() {
      this.viewData = this.viewResData.map((item: any) => {
        return {
          leftName: item.leftName,
          num: item.num,
          numName: item.numName,
          isChecked: false,
        };
      });
    }

    @Watch('$store.state.eventPushStore.SIZEUP')
    private getSIZEUP(val: any) {
      if (val >= 0) {
        this.setData();
      }
    }

    private async setData() {
      const tsData: any = await this.getData();
    }

    private async getData() {
      const eventId = this.$store.state.eventPushStore.eventId; // 事件id
      const locationId = 'SIZEUP'; // 位置id
      const res: any = await pushDataRequestServe.getPushDataByIds(
        eventId,
        locationId,
      );
      const content = JSON.parse(res.data.content || '{}');
      let tsData = {
        deathperson: '0',
        houseclose: '0',
        emrgencyclose: '0',
      };
      if (content.length > 0) {
        const data = content[0].data;
        tsData = JSON.parse(data).data;
      }
      // console.log('res.data.content=>',JSON.parse(JSON.parse(res.data.content)[0].data).data)
      this.viewData = [
        {
          leftName: '人员死亡',
          num: tsData.deathperson,
          numName: '人',
          isChecked: true,
        },
        {
          leftName: '房屋倒塌',
          num: tsData.houseclose,
          numName: '万间',
          isChecked: false,
        },
        {
          leftName: '经济损失',
          num: tsData.emrgencyclose,
          numName: '万元',
          isChecked: false,
        },
      ];
    }

    private created() {
      if (this.$store.state.eventPushStore.SIZEUP >= 0) {
        this.setData();
      }
    }

    // 离开页面清空地图点位
    // private beforeDestroy() {
    //   const component = this.getComponent();
    //   component.unload();
    // }
  }
</script>
<style lang="less" scoped>
    @import url('../../../../../../../assets/css/decisionSupport/GisPanel.less');

    .DisasterPredictionBox {
        width: 405px;
        height: auto;
    }
</style>
