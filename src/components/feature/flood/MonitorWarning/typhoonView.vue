<template>
  <!-- 台风面板 -->
  <div class="panelPublicDefault water-monitor-panel">
    <div class="panelPublicDefault_hd">
      <span class="title-panel">台风监测</span>
    </div>
    <!-- 数据统计 -->
    <div class="panelPublicDefault_bd">
      <Typhoon :option="typhoonOption"></Typhoon>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { warningInfoServer } from '@/api/installServer';
import Typhoon from '@/components/feature/typhoonInfo/Typhoon.vue';
import publishObjectPath from '@/util/configRegistry';
import { getDateFormat } from '@/util/tools';
/**
 * 监测预警
 */
@Component({
  name: 'WaterMonitor',
  components: {
    Typhoon,
  },
})
export default class WaterMonitor extends Vue {
  private typhoonOption = {
    service: this.getTyphoonServer(),
  };
  private getTyphoonServer() {
    const typhoonServerConf = publishObjectPath.value.typhoonServer;
    typhoonServerConf.httpRequest = new G.base.HttpRequest();
    const typhoonServer = new G.service.TyphoonServiceImpl(typhoonServerConf);
    return typhoonServer;
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../../assets/img/monitorWarning';
@url: '../../../../assets/img/halfScreen/firePoint';
@imgUrl: '../../../../assets/img/weatherForewarning';
// @imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
@panel-padding: 10px;
.panelPublicDefault {
  height: 99% !important;
}
.c-sky {
  color: skyblue;
}
.c-orange {
  color: orange;
}
.c-tomato {
  color: tomato;
}
.c-red {
  color: red;
}
.water-monitor-panel {
  .title-panel {
    padding-right: 20px !important;
  }
  .waterDialog_word {
    width: 93%;
    margin-left: 3%;
    .spanDot {
      margin-left: 20px;
      margin-top: 15px;
      display: inline-block;
    }
    background: #091120;
    border: 1px solid #2b5461;
    border-radius: 8px;
    margin-top: 30px;
    font-size: 20px;
    color: #8de5eb;
    .redWord {
      color: #abbfcb;
    }
  }
  .count-container {
    width: 94%;
    margin: 0 auto;
    .echarts {
      // padding: 28px @panel-padding 0;
      height: 350px;
    }
  }
  .nodata {
    height: 463px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .updateTime {
    color: #abbfcb;
    position: absolute;
    right: 0px;
    margin-right: 20px;
    font-size: 20px;
  }
}
.statisticList {
  .statisticListEL {
    height: 194px;
    overflow: hidden;
  }
}
</style>
