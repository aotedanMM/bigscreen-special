<!--严重受灾区域-->
<template>
  <div :id="echartsID"
       style="width:92%;height:100%;padding-left: 16px;">
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as echarts from 'echarts';
import { SeverelyAffectedArea } from '@/interface/feature/earthquake/SeverelyAffectedArea.interface';
/**
 * 严重受灾区域
 */
@Component({
  name: 'ServerlyAffectedArea',
  components: {},
})
export default class ServerlyAffectedArea extends Vue {
  @Prop({ default: '严重受灾区域', type: String }) public title?: string;

  // 受灾区域的标注点
  @Prop({ default: () => [], type: Array })
  public data?: SeverelyAffectedArea[];

  // 地图JSON
  @Prop()
  public geoJson: any;

  // 地图名称
  @Prop({ default: () => '' }) public mapName!: string;

  // 随机生成一个echartsId
  private echartsID =
    'echarts' + +new Date() + Math.floor(Math.random() * 1000);

  // echartsObj
  private echartsObj: any = null;

  // 开始绘画地图
  private renderEcharts(data: any, name: string) {
    const option = {
      geo: {
        zoom: 1.2,
        show: false,
        map: name,
      },
      series: [
        {
          itemStyle: {
            areaColor: 'rgba(6,235,253,0.2)',
            borderColor: '#06ebfd',
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              areaColor: 'rgba(6,235,253,0.8)',
              borderColor: '#06ebfd',
              borderWidth: 2,
              shadowColor: 'rgba(6,235,253,1)',
              shadowBlur: 10,
            },
            label: {
              show: true,
              color: '#000',
            },
          },
          zoom: 1.2,
          name: '地图',
          type: 'map',
          mapType: name,
          data,
        },
        {
          name: 'eTop5',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data,
          symbolSize: 15,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false,
            },
          },
          itemStyle: {
            normal: {
              color: '#ff2a2a',
              shadowBlur: 10,
              shadowColor: '#ff2a2a',
            },
          },
          zlevel: 10,
        },
      ],
    };
    echarts.registerMap(name, this.geoJson || {});
    this.echartsObj.setOption(option, true);
  }

  private init() {
    const div = document.getElementById(this.echartsID) as HTMLDivElement;
    this.echartsObj = echarts.init(div);
    this.renderEcharts(this.data, this.mapName);
  }

  @Watch('geoJson')
  private geoJsonWatch() {
    if (this.geoJson.type) {
      this.init();
    }
  }

  private mounted() {
    if (this.geoJson.type) {
      this.init();
    }
  }
}
</script>

