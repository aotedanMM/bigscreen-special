<template>
  <div style="height:270px;">
    <TeamDemand :option="getOption" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TeamDemand from '../../../components/feature/earthquake/teamDemand/TeamDemand.vue';

@Component({
  name: 'TeamDeamandDemo',
  components: {
    TeamDemand,
  },
})
export default class TeamDeamandDemo extends Vue {
  @Prop({ default: 0 }) public personal?: number;

  @Prop({ default: 0 }) public needPersonal?: number;

  get getOption() {
    return {
      color: ['#ffae00', '#01e3fd'],
      dataset: {
        source: [
          {
            name: '现场队伍人数',
            value: this.personal || 0,
          },
          {
            name: '需要队伍人数',
            value: this.needPersonal || 0,
          },
        ],
      },
      series: [
        {
          name: '环形图',
          type: 'pie',
          label: {
            padding: [5, -180],
            formatter(params: any) {
              const name = params.data.name;
              const value = params.data.value ? params.data.value : '--';
              return `{aa|${value}人\n${name}}`;
            },
            rich: {
              aa: {
                fontSize: 22,
                padding: [7, 0],
              },
            },
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 180,
            lineStyle: {
              width: 2,
            },
          },
          startAngle: 180,
          radius: ['50%', '60%'],
        },
        {
          z: 0,
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['30%', '60%'],
          data: [1],
          itemStyle: {
            color: '#071c44',
          },
          hoverAnimation: false,
          label: {
            show: false,
          },
        },
      ],
    };
  }
}
</script>