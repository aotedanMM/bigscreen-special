<template>
    <div id="DamageCasualtiesGIS">
    <span
            class="showModule"
            v-show="!moduleIsShow"
            @click="changeModuleIsShow"
    ></span>
        <div class="detail" v-show="moduleIsShow">
            <!--<span class="closeModule" @click="changeModuleIsShow"></span>
             <MapDialogTitle>
              <template v-slot:title>{{earthTitle}}</template>
            </MapDialogTitle> -->
            <div class="title">
                <span>{{ earthTitle }}</span>
                <span class="closeModule" @click="changeModuleIsShow"></span>
            </div>
            <ul class="dieListBox">
                <li
                        v-for="(i, index) in listData"
                        :key="index"
                        @click="checkListFunc(index, i.type)"
                        :class="listCheck === index ? 'checkSty' : ''"
                >
                    <div class="dieList_title">{{ i.name }}</div>
                    <span class="dieList_number"
                    >{{ i.num }}<span class="dieList_unit">{{ i.unit }} </span></span
                    >
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import MapDialogTitle from '@/views/theme/decisionSupport/common/MapDialogTitle.vue';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
  import MapCommon from '@/util/MapCommon';

  @Component({
    name: 'DamageCasualtiesGIS',
    components: {
      MapDialogTitle,
    },
  })
  export default class DamageCasualtiesGIS extends Vue {
    private listCheck: any = [];
    private moduleIsShow: boolean = true;
    private listData: any = [];
    private levelArr: any = [];
    private type: string = '';
    @Prop() private earthTitle: any;
    @Prop() private personnelKey: any;
    private opt1: any = {
      resourceKeys: this.personnelKey,
      ranges: [
        {
          level: 'earthData',
          geometry: {},
        },
      ],
    };

    private changeModuleIsShow() {
      this.moduleIsShow = !this.moduleIsShow;
    }

    // quan
    private getComponent(type: any) {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent(type);
      return component;
    }

    private checkListFunc(index: any, type: any) {
      this.getComponent('disasterJudgeResource').hideResource(
        [this.type],
        this.levelArr,
      );
      this.type = type;
      this.listCheck = index;
      const that = this;
      const component = this.getComponent('disasterJudgeResource');
      // 获取数据
      component.load([type]).then((data: any) => {
        const level = data[0].data[data[0].data.length - 1].level;
        this.levelArr = [];
        for (const i of data[0].data) {
          this.levelArr.push(i.level);
        }
        if (this.$store.state.controlMoudle.mapCircleQueryType === 0) {
          that
            .getComponent('disasterJudgeResource')
            .showResource([type], [level]);
        } else if (this.$store.state.controlMoudle.mapCircleQueryType === 1) {
          // 烈度
          that
            .getComponent('disasterJudgeResource')
            .showResource([type], this.levelArr);
        }
      });
    }

    // 初始化
    @Watch('$store.state.controlMoudle.mapCircleQueryType')
    private init() {
      this.listCheck = '';
      this.listData = [];
      this.getComponent('disasterJudgeResource').hideResource(
        [this.type],
        this.levelArr,
      );
      // 获取烈度或者经验圈对应数据
      const key = this.$store.state.controlMoudle.mapCircleQueryType;
      const eventInfoWrapper: any = this.$ioc.resolve('eventInfo');
      const eventData = eventInfoWrapper.getRanges(key);
      // 人员密集场所
      if (this.$store.state.controlMoudle.mapCircleQueryType === 0) {
        this.opt1.ranges[0].geometry = eventData[eventData.length - 1].geometry;
      } else if (this.$store.state.controlMoudle.mapCircleQueryType === 1) {
        // 烈度
        this.opt1.ranges[0].geometry = eventData[0].geometry;
        // this.opt1.ranges = eventData;
      }
      this.getResourceStat();
    }

    private beforeDestroy() {
      this.getComponent('disasterJudgeResource').hideResource(
        [this.type],
        this.levelArr,
      );
    }

    private aggreteStat(res: any) {
      const result: any = {};
      for (const level in res) {
        if (res.hasOwnProperty(level)) {
          const record = res[level];
          for (const key in record) {
            if (record.hasOwnProperty(key)) {
              if (result[key]) {
                result[key].count += record[key].count;
              } else {
                result[key] = record[key];
              }
            }
          }
        }
      }
      return result;
    }

    private getResourceStat() {
      installDisasterJudgeServer.quickJudgeServer
        .getResourceStat(this.opt1)
        .then((res: any) => {
          let data: any;
          if (this.$store.state.controlMoudle.mapCircleQueryType === 0) {
            data = res.earthData;
          } else if (this.$store.state.controlMoudle.mapCircleQueryType === 1) {
            // 烈度
            data = this.aggreteStat(res);
          }
          if (data) {
            if (data.school) {
              this.listData.push({
                name: '学校',
                type: 'school',
                num: data.school.count,
                unit: '所',
              });
            }
            if (data.hospital) {
              this.listData.push({
                name: '医院',
                type: 'hospital',
                num: data.hospital.count,
                unit: '家',
              });
            }
            if (data.airport) {
              this.listData.push({
                name: '机场',
                type: 'airport',
                num: data.airport.count,
                unit: '个',
              });
            }
            if (data.railwaystation) {
              this.listData.push({
                name: '火车站',
                type: 'railwaystation',
                num: data.railwaystation.count,
                unit: '个',
              });
            }
            if (data.hazardous) {
              this.listData.push({
                name: '危化企业',
                type: 'hazardous',
                num: data.hazardous.count,
                unit: '家',
              });
            }
            if (data.coalMine) {
              this.listData.push({
                name: '煤矿企业',
                type: 'coalMine',
                num: data.coalMine.count,
                unit: '家',
              });
            }
            if (data.mine) {
              this.listData.push({
                name: '非煤矿山',
                type: 'mine',
                num: data.mine.count,
                unit: '家',
              });
            }
            if (data.explosive) {
              this.listData.push({
                name: '烟花爆竹企业',
                type: 'explosive',
                num: data.explosive.count,
                unit: '家',
              });
            }
            if (data.reservoir) {
              this.listData.push({
                name: '水库',
                type: 'reservoir',
                num: data.reservoir.count,
                unit: '个',
              });
            }
            if (data.portwharf) {
              this.listData.push({
                name: '码头',
                type: 'portwharf',
                num: data.portwharf.count,
                unit: '个',
              });
            }
            if (data.nuclear) {
              this.listData.push({
                name: '核设施',
                type: 'nuclear',
                num: data.nuclear.count,
                unit: '个',
              });
            }
          }
        });
    }

    private created() {
      this.init();
    }
  }
</script>
<style lang="less" scoped>
    @path: '../../../../../../../assets/img/gisModule/districtDialog'; // 定义路径
    @import url('../../../../../../../assets/css/popUp/statistic.less');
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .checkSty {
        box-shadow: 0 0 50px rgb(240, 234, 17) inset;
    }

    #DamageCasualtiesGIS {
        position: absolute !important;
        top: 225px;
        left: 75px;
        z-index: 5;
        width: 405px;

        li {
            list-style-type: none;
        }

        .dieListBox {
            max-height: 450px;
            overflow-y: scroll;
            margin: 0 30px;

            li {
                width: 100%;
                background: rgba(7, 25, 65, 0.8);
                background-size: 100% 100%;
                border-radius: 20px;
                margin-bottom: 10px;
                cursor: pointer;
                color: #ffffff;
                display: flex;
                justify-content: space-between;
                padding: 15px 25px 15px 15px;
                font-size: 28px;
                vertical-align: middle;

                .address {
                    width: 34%;
                    height: auto;
                    font-size: 24px;
                    text-align: center;
                }

                .listCont {
                    display: flex;
                    flex-direction: column;
                    font-size: 24px;
                }

                .dieList_title {
                    display: inline-block;
                    color: yellow;
                    padding-top: 3px;
                }

                .dieList_number {
                    display: inline-block;
                    font-weight: bold;
                    color: #fff;
                    font-size: 48px;
                    text-align: right;
                    padding-right: 5px;
                    vertical-align: middle;
                    vertical-align: middle;
                    line-height: 1;
                }

                .dieList_unit {
                    display: inline-block;
                    font-size: 24px;
                    padding-left: 5px;
                    vertical-align: middle;
                    font-weight: 100;
                }
            }
        }

        .dieListBox::-webkit-scrollbar {
            display: none;
        }
    }
</style>
