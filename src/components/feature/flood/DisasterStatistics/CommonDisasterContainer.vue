<!--自然灾害的下钻页的容器组件-->
<template>
  <div class="CommonStatisticsContainer">
    <div class="disaster_title">
      <p class="title-panel">{{ compParam.name }}</p>
      <span class="halflist-back" @click="handleBackParent"></span>
    </div>
    <div class="loading" v-if="loading"></div>
    <div v-else class="riskBoxDistrict_con">
      <div ref="riskBoxTop" class="riskBoxDistrict">
        <el-scrollbar class="riskBoxDistrict_box ">
          <ul>
            <li
              class="cityAreaList f-tit-h2"
              :class="item.isChecked ? 'active' : ''"
              v-for="(item, index) in disasterList"
              :key="index"
            >
              <span class="f-txt-com">{{ item.name }}</span>
              <span class="textWarning f-number">{{ item.value || 0 }}</span>
              <span>{{ item.unit }}</span>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { resourceServer } from '@/api/feature/defensiveprepation/installServer';
import { protectTargetServer } from '@/api/feature/defensiveprepation/installServer';
// import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { disasterSituationServer } from '@/api/feature/disasterStatistics/installServer';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'CommonDisasterContainer',
  components: {},
  mixins: [MapCommon],
})
export default class CommonDisasterContainer extends Vue {
  @Prop() private compParam: any;
  @Prop() private handleClick: any; // 父组件处理子组件的点击的方法

  private loading: boolean = false; //
  private minimize: boolean = true;
  private listHeight: number = 0;
  private disasterList: any;
  // 人口
  private renkou: any = [
    {
      name: '受灾人口',
      unit: '人',
      key: 'shouzai',
      value: '',
    },
    {
      name: '因灾死亡人口',
      unit: '人',
      key: 'siwang',
      value: '',
    },
    {
      name: '因灾失踪人口',
      unit: '人',
      key: 'shizong',
      value: '',
    },
    {
      name: '因灾伤病人口',
      unit: '人',
      key: 'shangbing',
      value: '',
    },
    {
      name: '紧急转移安置人口',
      unit: '人',
      key: 'anzhi',
      value: '',
    },
    {
      name: '集中安置人口',
      unit: '人',
      key: 'jizhonganzhi',
      value: '',
    },
    {
      name: '分散安置人口',
      unit: '人',
      key: 'fensananzhi',
      value: '',
    },
    {
      name: '需紧急生活救助人口',
      unit: '人',
      key: 'jinjijiuzhu',
      value: '',
    },
    {
      name: '需过渡期生活救助人口',
      unit: '人',
      key: 'guoduqijiuzhu',
      value: '',
    },
    {
      name: '被困人口',
      unit: '人',
      key: 'beikun',
      value: '',
    },
  ];
  // 房屋
  private fangwu: any = [
    {
      name: '倒塌房屋户数',
      unit: '户',
      key: 'daotahu',
      value: '',
    },
    {
      name: '倒塌房屋间数',
      unit: '间',
      key: 'datajian',
      value: '',
    },
    {
      name: '严重损坏房屋户数',
      unit: '户',
      key: 'yanzhongsunhuihu',
      value: '',
    },
    {
      name: '严重损坏房屋间数',
      unit: '间',
      key: 'yanzhongsunhuijian',
      value: '',
    },
    {
      name: '一般损坏房屋户数',
      unit: '户',
      key: 'yibansunhuihu',
      value: '',
    },
    {
      name: '一般损坏房屋间数',
      unit: '间',
      key: 'yibansunhuijian',
      value: '',
    },
  ];
  // 农业
  private nongye: any = [
    {
      name: '农作物受灾面积',
      unit: '公顷',
      key: 'nongzuowu',
      value: '',
    },
    {
      name: '草场受灾面积',
      unit: '公顷',
      key: 'caochang',
      value: '',
    },
    {
      name: '毁坏耕地面积',
      unit: '公顷',
      key: 'gengdi',
      value: '',
    },
    {
      name: '因灾死亡大牲畜',
      unit: '头',
      key: 'siwangdashengchu',
      value: '',
    },
    {
      name: '因灾死亡羊只',
      unit: '只',
      key: 'siwangyangzhi',
      value: '',
    },
    {
      name: '饮水困难大牲畜',
      unit: '头',
      key: 'yinshuikunnandashengchu',
      value: '',
    },
  ];
  // 经济
  private jingji: any = [
    {
      name: '直接经济损失',
      unit: '万元',
      key: 'zhijie',
      value: '',
    },
    {
      name: '农业损失',
      unit: '万元',
      key: 'nongye',
      value: '',
    },
    {
      name: '工矿企业损失',
      unit: '万元',
      key: 'gongkuang',
      value: '',
    },
    {
      name: '基础设施损失',
      unit: '万元',
      key: 'jichusheshi',
      value: '',
    },
    {
      name: '公益设施损失',
      unit: '万元',
      key: 'gongyisheshi',
      value: '',
    },
    {
      name: '家庭财产损失',
      unit: '万元',
      key: 'jiatingcaichan',
      value: '',
    },
  ];
  // 本级
  private benji: any = [
    {
      name: '本级启动响应级别',
      unit: '',
      key: 'responseLevel',
      value: '',
    },
    {
      name: '本级启动响应时间',
      unit: '',
      key: 'responseTime',
      value: '',
    },
    {
      name: '己支出自然灾害生活补助资金',
      unit: '万元',
      key: 'shenghuobuzhuzijin',
      value: '',
    },
    {
      name: '发放衣被数量',
      unit: '套',
      key: 'yibei',
      value: '',
    },
    {
      name: '搭建帐篷数量',
      unit: '顶',
      key: 'zhangpeng',
      value: '',
    },
    {
      name: '其他生活类物资投入折款',
      unit: '万元',
      key: 'zhekuan',
      value: '',
    },
  ];
  // 下级
  private xiaji: any = [
    {
      name: '己支出自然灾害生活补助资金',
      unit: '万元',
      key: 'shenghuobuzhuzijin',
      value: '',
    },
    {
      name: '发放衣被数量',
      unit: '套',
      key: 'yibei',
      value: '',
    },
    {
      name: '搭建帐篷数量',
      unit: '顶',
      key: 'zhangpeng',
      value: '',
    },
    {
      name: '其他生活类物资投入折款',
      unit: '万元',
      key: 'zhekuan',
      value: '',
    },
  ];

  private normalData(itemKey: any) {
    switch (itemKey) {
      case 'renkou':
        this.disasterList = this.renkou;
        break;
      case 'fangwu':
        this.disasterList = this.fangwu;
        break;
      case 'nongye':
        this.disasterList = this.nongye;
        break;
      case 'jingji':
        this.disasterList = this.jingji;
        break;
      case 'benji':
        this.disasterList = this.benji;
        break;
      case 'xiaji':
        this.disasterList = this.xiaji;
        break;
      default:
        break;
    }
  }
  private async created() {
    this.normalData(this.compParam.key);
    const disasterList = this.disasterList;
    const arr = this.compParam.detail;
    // Object.keys(arr).forEach(function(key: any) {
    //   disasterList.map((v: any) => {
    //     if (key == v.key) {
    //       v.value = arr[key];
    //     }
    //   });
    // });
    // this.extractionData(disasterList, arr);
    await this.handleResultData();
    await this.handleResultData1();
  }
  private mounted() {
    console.log(this.compParam);
  }

  private extractionData(disasterList: any, arr: any) {
    const self = this;
    Object.keys(arr).forEach(function(key: any) {
      disasterList.map((v: any) => {
        if (key === v.key) {
          // v.value = arr[key];
          if (key === 'responseLevel') {
            console.log(arr[key], 'responseLevel');
            switch (arr[key]) {
              case '1':
                v.value = 'Ⅰ级';
                break;
              case '2':
                v.value = 'Ⅱ级';
                break;
              case '3':
                v.value = 'Ⅲ级';
                break;
              case '4':
                v.value = 'Ⅳ级';
                break;
              default:
                v.value = '未启动响应';
                break;
            }
          } else if (key === 'responseTime') {
            v.value = arr[key].substring(0, 16);
            console.log(arr[key].substring(0, 16), 'responseTime');
          } else {
            v.value = arr[key];
          }
        }
      });
    });
  }

  // 返回一级页面
  private handleBackParent() {
    if (this.compParam.status === 'home') {
      this.$emit('backParent');
      this.handleClick(
        'DisasterStatisticsHome',
        JSON.parse(JSON.stringify({})),
      );
    } else if (this.compParam.status === 'town') {
      this.$emit('backParent');
      this.handleClick(
        'DisasterSituationTown',
        JSON.parse(JSON.stringify(this.compParam)),
      );
    }
  }
  //  数据
  // this.$store.state.eventPushStore.eventId,
  private async getDataByServ() {
    const resData: any = await disasterSituationServer.getStatistics(
      this.$store.state.eventPushStore.eventId,
    );
    const self = this;
    // 首页 市 进入详情列表页
    if (this.compParam && this.compParam.code === resData.code) {
      Object.keys(resData).forEach(function(key: any) {
        // console.log(key, 'key1');
        if (self.compParam.key === key) {
          console.log(self.compParam.key, key);
          self.normalData(key);
          // Object.keys(resData[key]).forEach(function(key1: any) {
          //   // console.log(resData['renkou'], "resData['renkou']");
          //   self.disasterList.map((v: any) => {
          //     if (key1 == v.key) {
          //       v.value = resData[key][key1];
          //     }
          //   });
          // });
          self.extractionData(self.disasterList, resData[key]);
          // switch (key) {
          //   case 'renkou':
          //     self.disasterList = self.renkou;
          //     Object.keys(resData['renkou']).forEach(function(key1: any) {
          //       // console.log(resData['renkou'], "resData['renkou']");
          //       self.disasterList.map((v: any) => {
          //         if (key1 == v.key) {
          //           v.value = resData['renkou'][key1];
          //         }
          //       });
          //     });
          //     break;
          //   case 'fangwu':
          //     self.disasterList = self.fangwu;
          //     Object.keys(resData['fangwu']).forEach(function(key1: any) {
          //       self.disasterList.map((v: any) => {
          //         if (key1 == v.key) {
          //           v.value = resData['fangwu'][key1];
          //         }
          //       });
          //     });
          //     break;
          //   case 'nongye':
          //     self.disasterList = self.nongye;
          //     Object.keys(resData['nongye']).forEach(function(key1: any) {
          //       self.disasterList.map((v: any) => {
          //         if (key1 == v.key) {
          //           v.value = resData['nongye'][key1];
          //         }
          //       });
          //     });
          //     break;
          //   case 'jingji':
          //     self.disasterList = self.jingji;
          //     Object.keys(resData['jingji']).forEach(function(key1: any) {
          //       self.disasterList.map((v: any) => {
          //         if (key1 == v.key) {
          //           v.value = resData['jingji'][key1];
          //         }
          //       });
          //     });
          //     break;
          //   default:
          //     return;
          //     break;
          // }
        }
      });
    } else {
      // 子页面 区县 进入详情列表页
      resData.counties.map((item: any) => {
        if (this.compParam.nextCompParam.code === item.code) {
          Object.keys(item).forEach(function(key: any) {
            if (self.compParam.key === key) {
              self.normalData(key);
              // Object.keys(item[key]).forEach(function(key1: any) {
              //   // console.log(item['renkou'], "item['renkou']");
              //   self.disasterList.map((v: any) => {
              //     if (key1 == v.key) {
              //       v.value = item[key][key1];
              //     }
              //   });
              // });
              self.extractionData(self.disasterList, item[key]);
              // switch (key) {
              //   case 'renkou':
              //     self.disasterList = self.renkou;
              //     Object.keys(item['renkou']).forEach(function(key1: any) {
              //       // console.log(item['renkou'], "item['renkou']");
              //       self.disasterList.map((v: any) => {
              //         if (key1 == v.key) {
              //           v.value = item['renkou'][key1];
              //         }
              //       });
              //     });
              //     break;
              //   case 'fangwu':
              //     self.disasterList = self.fangwu;
              //     Object.keys(item['fangwu']).forEach(function(key1: any) {
              //       self.disasterList.map((v: any) => {
              //         if (key1 == v.key) {
              //           v.value = item['fangwu'][key1];
              //         }
              //       });
              //     });
              //     break;
              //   case 'nongye':
              //     self.disasterList = self.nongye;
              //     Object.keys(item['nongye']).forEach(function(key1: any) {
              //       self.disasterList.map((v: any) => {
              //         if (key1 == v.key) {
              //           v.value = item['nongye'][key1];
              //         }
              //       });
              //     });
              //     break;
              //   case 'jingji':
              //     self.disasterList = self.jingji;
              //     Object.keys(item['jingji']).forEach(function(key1: any) {
              //       self.disasterList.map((v: any) => {
              //         if (key1 == v.key) {
              //           v.value = item['jingji'][key1];
              //         }
              //       });
              //     });
              //     break;
              //   default:
              //     return;
              //     break;
              // }
            }
          });
        }
      });
    }
  }
  // 接口数据  救灾工作
  private async getDisasterData() {
    const resData: any = await disasterSituationServer.getDisasterData(
      this.$store.state.eventPushStore.eventId,
    );
    // const that = this;
    const self = this;
    // 首页 市 进入详情列表页
    if (this.compParam && this.compParam.code === resData.code) {
      Object.keys(resData).forEach(function(key: any) {
        if (self.compParam.key === key) {
          self.normalData(key);
          // Object.keys(resData[key]).forEach(function(key1: any) {
          //   self.disasterList.map((v: any) => {
          //     if (key1 == v.key) {
          //       v.value = resData[key][key1];
          //     }
          //   });
          // });
          self.extractionData(self.disasterList, resData[key]);
        }
      });
    } else {
      // 子页面 区县 进入详情列表页
      resData.counties.map((item: any) => {
        if (this.compParam.nextCompParam.code === item.code) {
          Object.keys(item).forEach(function(key: any) {
            if (self.compParam.key === key) {
              self.normalData(key);
              // Object.keys(item[key]).forEach(function(key1: any) {
              //   self.disasterList.map((v: any) => {
              //     if (key1 == v.key) {
              //       v.value = item[key][key1];
              //     }
              //   });
              // });
              self.extractionData(self.disasterList, item[key]);
            }
          });
        }
      });
    }
  }

  // 监听推送
  @Watch('$store.state.eventPushStore.nature_disaster')
  private async handleResultData() {
    await this.getDataByServ();
  }
  // 监听推送
  @Watch('$store.state.eventPushStore.rescue_disaster')
  private async handleResultData1() {
    this.getDisasterData();
  }

  // 列表参数更新
  // @Watch('filters', { deep: true })
  // private updateList(newVal: any, oldVal: any): void {
  // this.getRiskDetailListData();
  // }
}
</script>

<style lang="less" scoped>
.CommonStatisticsContainer {
  width: 395px;
  height: 855px;
  border-radius: 5px;
  position: relative;
  * {
    margin: 0;
    padding: 0;
  }
  .disaster_title {
    padding: 0px 15px 5px 15px;
  }
  .title-panel {
    font-style: italic;
    line-height: 35px;
  }
  .halflist-back {
    width: 61px;
    height: 25px;
    position: absolute;
    top: 10px;
    right: 6px;
    color: #338af8;
    cursor: pointer;
    z-index: 1;
    background: url('../../../../assets/img/default/panel/toBack.png') no-repeat
      0px 70%;
    background-size: 100% 100%;
    &:hover {
      background-image: url('../../../../assets/img/default/panel/toBack_h.png');
    }
  }
  .loading {
    color: #fff;
    background: url(../../../../assets/img/halfScreen/halflist/loading.gif)
      no-repeat 33px 255px;
    color: #d2e1ec;
    height: 100%;
  }

  .riskBoxDistrict_con {
    // padding-top: 10px;
    height: calc(100% - 50px);
    padding-right: 6px;
    .riskBoxDistrict {
      .riskBoxDistrict_title {
        position: relative;
        color: #67e1fb;
        letter-spacing: 1px;
        font-weight: normal;
        line-height: 60px;
        display: flex;
        &:after {
          content: '';
          background: url(../../../../assets/img/halfScreen/halflist/titlexian.png)
            50% 0 no-repeat;
          position: absolute;
          width: 100%;
          height: 23px;
          top: 54px;
          left: 0;
        }
        span:nth-child(1) {
          flex: 1;
        }
        span:nth-child(2) {
          font-style: italic;
          color: yellow;
          margin: 0 5px 0 10px;
          cursor: pointer;
        }
        span:nth-child(3) {
          color: #daf2ff;
        }
        .panel_switch {
          width: 34px;
          height: 29px;
          background-size: 100% 100%;
          position: absolute;
          right: 0px;
          top: 15px;
          cursor: pointer;
          background: url('../../../../assets/img/halfScreen/halflist/open.png')
            50% 50% no-repeat;
          transition: transform 0.3s;
        }
        .panel_switch.panel-switch-reverse {
          transform: scale(1, -1);
        }
      }
      .riskBoxDistrict_box {
        // height: 250px;
        // padding-top: 5px;
        ul li:nth-child(2n) {
          background-color: rgba(82, 183, 234, 0.13);
        }
        .cityAreaList {
          display: flex;
          justify-content: space-between;
          color: #bbd0dc;
          // background: url('../../../../assets/img/halfScreen/halflist/listbg.png')
          //   no-repeat -5px 50%;
          // background-size: 100% 100%;
          padding: 7px 15px;
          box-sizing: border-box;
          // margin: 5px 0;
          cursor: pointer;
          &.active,
          // &:hover {
          //   background-image: url('../../../../assets/img/halfScreen/halflist/listbghover.png');
          // }
          .f-txt-com {
            flex: 1;
          }
          .textWarning {
            color: yellow;
            padding: 0 5px;
            max-width: 160px;
            text-align: right;
          }
        }
      }
      .riskBoxDistrict_main {
        display: block;
        width: 100%;
        .csmMyInput {
          margin: 5px 0;
        }
        input::-webkit-input-placeholder {
          color: #c4d7da;
        }
        input:-moz-placeholder {
          color: #c4d7da;
        }
        input:-ms-input-placeholder {
          color: #c4d7da;
        }
        .riskBoxDistrict_list {
          .nodata {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .constomMyElPage {
            margin-top: 15px;
          }
          .listBoxSingle {
            &_li {
              display: flex;
              height: 50px;
              line-height: 50px;
              cursor: pointer;
              color: #ffffff;
              margin: 10px 0 0 0;
              background: url('../../../../assets/img/halfScreen/halflist/boxListBgIcon.png')
                no-repeat 0 0;
              background-size: 100% 100%;
              color: #e8f4fe;

              &.active,
              &:hover {
                color: yellow;
              }
              .li_index {
                margin: 0 10px;
              }
              .li_name {
                flex: 1;
                align-items: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }
}
</style>
