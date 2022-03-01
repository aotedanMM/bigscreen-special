
<!--灾情研判-->
<template>
    <div class="studyAndJudgmentOfaPicture unNormalRight-default">
      <div class="tab">
        <DiscussTab></DiscussTab>
      </div>
      <div class="list">
        <DiscussList :tabShow='tabShow'></DiscussList>
      </div>
      <div class="cont">
        <DiscussCont v-for="(item,index) of contList.contListAll" :key="index" :contList="item" :radius="radius"></DiscussCont>
        <DiscussCont :contList="contList.contList3" :radius="radius"></DiscussCont>
      </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import DiscussCont from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/DiscussCont.vue';
import DiscussTab from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/DiscussTab.vue';
import DiscussList from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/DiscussList.vue';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';

@Component({
    name: 'StudyAndJudgmentOfaPicture',
    components: {
      DiscussList,
      DiscussTab,
      DiscussCont,
    },
})
export default class StudyAndJudgmentOfaPicture extends Vue  {
  private tabShow: any = {
    countyCount: {
      name: '区县',
      num: 0,
      danwei: '个',
      platoon: true,
    },
    population: {
      name: '人口',
      num: 0,
      danwei: '万人',
    },
    townCount: {
      name: '乡镇',
      num: 0,
      danwei: '个',
      platoon: true,
    },
    totalArea: {
      name: '面积',
      num: 0,
      danwei: 'km²',
    },
    populationDensity: {
      name: '人口密度',
      num: 0,
      danwei: '人/km²',
    },
  };
  private level: string = '6级';
  private personnelKey: any = ['school', 'hospital', 'airport', 'railwaystation', 'hazardous', 'coalMine', 'mine', 'explosive', 'reservoir', 'portwharf', 'nuclear'];
  private contList: any = {
        contListAll : [
                {
                    title: '人员密集场所',
                    sum: 0,
                    list: {
                        school: {
                            name: '学校',
                            bg: 'schoolbg',
                            num: 0,
                            danwei: '所',
                        },
                        hospital: {
                            name: '医院',
                            bg: 'hospitalbg',
                            num: 0,
                            danwei: '家',
                        },
                        airport: {
                            name: '机场',
                            bg: 'airportbg',
                            num: 0,
                            danwei: '个',
                        },
                        railwaystation: {
                            name: '火车站',
                            bg: 'railwaystationbg',
                            num: 0,
                            danwei: '个',
                        },
                    },
                },
                {
                    title: '高危行业企业',
                    sum: 0,
                    list: {
                        hazardous: {
                            name: '危化企业',
                            bg: 'hazardousbg',
                            num: 0,
                            danwei: '家',
                        },
                        coalMine: {
                            name: '煤矿企业',
                            bg: 'coalMinebg',
                            num: 0,
                            danwei: '家',
                        },
                        mine: {
                            name: '尾矿库',
                            bg: 'minebg',
                            num: 0,
                            danwei: '座',
                        },
                        explosive: {
                            name: '烟花爆竹企业',
                            bg: 'explosivebg',
                            num: 0,
                            danwei: '家',
                        },
                    },
                },
                {
                    title: '重要设施',
                    sum: 0,
                    list: {
                        reservoir: {
                            name: '水库大坝',
                            bg: 'reservoirbg',
                            num: 0,
                            danwei: '个',
                        },
                        portwharf: {
                            name: '码头',
                            bg: 'portwharfbg',
                            num: 0,
                            danwei: '个',
                        },
                        nuclear: {
                            name: '核设施',
                            bg: 'nuclearbg',
                            num: 0,
                            danwei: '个',
                        },
                    },
                },
            ],
        contList3: {
            title: '力量调度',
            sum: 0,
            list: [
                {
                    name: '消防救援队',
                    bg: 'xiaofang',
                    num: 0,
                    danwei: '人',
                    team: 0,
                    zhi: '支',
                },
                {
                    name: '森防救援队',
                    bg: 'senfang',
                    num: 0,
                    danwei: '人',
                    team: 0,
                    zhi: '支',
                },
                {
                    name: '专业救援队',
                    bg: 'zhuanye',
                    num: 0,
                    danwei: '人',
                    team: 0,
                    zhi: '支',
                },
            ],
        },
  };
  private radius: any = '50';
  private keyArr: any = [];
  private pmaxlevel: any;
  // 参数 point类型为number
  private opt2: any = {
    point: [116.35, 39.87],
    ranges: [
      {
        level: this.level,
        geometry: {},
      },
    ],
  };
  private opt1: any = {
    resourceKeys: this.personnelKey,
    ranges: [
      {
        level: this.level,
        geometry: {},
      },
    ],
  };
  // 力量调度信息
  private getRescueTeamStat(opt2: any) {
    installDisasterJudgeServer.quickJudgeServer.getRescueTeamStat(opt2).then((res: any) => {
      this.contList.contList3.sum = res[this.level].total;
      const resData = res[this.level].data;
      for (const key of resData) {
        for ( const item of this.contList.contList3.list ) {
          if (item.name === key.title) {
            item.team = key.teamnum;
            item.num = key.peoplenum;
          }
        }
      }
    });
  }
  // 行政区划，人口统计
  private getRegionPopStat(opt2: any) {
    if ( opt2.point.length ) {
      opt2.point[0] = parseFloat(opt2.point[0]);
      opt2.point[1] = parseFloat(opt2.point[1]);
    }
    installDisasterJudgeServer.quickJudgeServer.getRegionPopStat(opt2).then((res: any) => {
      if (res[this.level]) {
        // 人口数保留两位
        const population = res[this.level].population / 10000;
        res[this.level].population = population.toFixed(2);
        // 人口密度取整
        const populationDensity = res[this.level].populationDensity;
        res[this.level].populationDensity = populationDensity.toFixed(0);
        // 面积取整数
        const totalArea = res[this.level].totalArea;
        res[this.level].totalArea = totalArea.toFixed(0);
        for (const key of Object.keys(this.tabShow)) {
          this.tabShow[key].num = res[this.level][key];
        }
      } else {
        this.tabShow = {};
      }
    }).catch( (err: any) => {
      (console as any).log(err);
      this.tabShow = {};
    });
  }
  // 人员密集场所、高危行业企业、重要设施
  private getResourceStat(optKey: any) {
    this.opt1.resourceKeys = optKey;
    installDisasterJudgeServer.quickJudgeServer.getResourceStat(this.opt1).then((res: any) => {
        const j =  this.contList.contListAll.length;

        for (var i = 0 ; i < j ; i ++) {
            this.contList.contListAll[i].sum = 0;
            for (const key of Object.keys(this.contList.contListAll[i].list)) {
                this.contList.contListAll[i].list[key].num = res[this.level][key].count;
                this.contList.contListAll[i].sum += res[this.level][key].count;
            }
        }
    });
  }

  // 获取经纬度
  private getLonAndLat() {
    const eventPushStore = this.$store.state.eventPushStore.eventLocation;
    this.opt2.point = [eventPushStore.EventLon, eventPushStore.EventLat];
  }

  // 烈度、经验圈变化。子组件中调用
  private tabList(item: any) {
    this.radius = item.level;
    this.getLonAndLat();
    this.opt1.ranges[0].geometry = item.geometry;
    this.opt2.ranges[0].geometry = item.geometry;
    this.getRegionPopStat(this.opt2);
    this.getResourceStat(this.personnelKey);
    this.getRescueTeamStat(this.opt2);
  }
  // 文字叠加key处理。子组件中调用
  private dealKey(item: any) {
    const self = this;
    if (item.active) {
      // 清除标点
      if (this.pmaxlevel) {
      this.getComponent().hideResource(item.key);
      }
      this.keyArr = this.keyArr.filter(function(key: any) {
          return key !== item.key;
      });
    } else {
      this.keyArr.push(item.key);
      // 添加标点
      this.getComponent().load([item.key], self.radius).then((data: any) => {
          if ( item.active && data && data[0].total > 0) {
          const maxlevel = self.radius;
          this.pmaxlevel = maxlevel;
          this.getComponent().showResource(item.key, [maxlevel]);
          }
      });
    }
  }
}
</script>
<style lang="less" scoped>
*{
  margin: 0;
  padding: 0;
}
.studyAndJudgmentOfaPicture{
  width: 1057px;
  height: 1008px;
  position: absolute;
  right: 7px;
  z-index: 1;
  .tab{
    // float: right;
    // margin-right: 60px;
    // margin-top:35px;
    z-index: 1;
    position: absolute;
    right: 55px;
    top: 30px;
  }
  .list{
    top: 0px;
    left: 75px;
    position: absolute;
  }
  .cont{
    display: flex;
    position: absolute;
    top: 270px;
    left: 75px;
    justify-content: flex-start;
    flex-wrap: wrap;
    height: 74%;
  }
}
</style>