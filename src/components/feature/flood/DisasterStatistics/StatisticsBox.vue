<template>
  <!-- 灾情统计弹框 -->
  <div class="StatisticsBox-wrap" v-show="showFlag">
    <div class="StatisticsBox-title">
      <span class="close-icon" @click="close"></span>
      <span class="title-panel"> {{ data.name }}灾情统计</span>
      <span class="title-time"
        >灾害统计时间：{{ data.starttime }}~{{ data.endtime }}</span
      >
    </div>
    <div class="StatisticsBox-content">
      <div class="content-left">
        <div class="left-title">
          <span
            >受灾乡镇数量: <span class="num">{{ data.townNum }}</span
            >个</span
          ><span
            >受淹镇区:<span class="num">{{ data.floodTownNum }}</span
            >个</span
          ><span
            >受淹乡村:<span class="num">{{ data.floodVillageNum }}</span
            >个</span
          ><span
            >受淹城区:<span class="num">{{ data.floodUrbanNum }}</span
            >个</span
          >
        </div>
        <div class="module-statistics-top">
          <div class="module-statistics">
            <div>
              <p>人口</p>
              <ul>
                <li>
                  <span class="statistics-name">受灾人口:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.renkou.shouzai ? data.renkou.shouzai : 0
                    }}</span
                    >人</span
                  >
                </li>
                <div class="shouzai-box">
                  <el-scrollbar style="height:100%;">
                    <li>
                      <span class="statistics-name">因灾死亡人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{
                          data.renkou.siwang ? data.renkou.siwang : 0
                        }}</span
                        >人</span
                      >
                    </li>

                    <li>
                      <span class="statistics-name">因灾失踪人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{
                          data.renkou.shizong ? data.renkou.shizong : 0
                        }}</span
                        >人</span
                      >
                    </li>
                    <li>
                      <span class="statistics-name">因灾伤病人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{
                          data.renkou.shangbing ? data.renkou.shangbing : 0
                        }}</span
                        >人</span
                      >
                    </li>
                    <li>
                      <span class="statistics-name">紧急转移安置人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{
                          data.renkou.anzhi ? data.renkou.anzhi : 0
                        }}</span
                        >人</span
                      >
                    </li>

                    <li>
                      <span class="icon"></span>
                      <span class="statistics-name">集中安置人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{ data.renkou.jizhonganzhi?data.renkou.jizhonganzhi:0 }}</span
                        >人</span
                      >
                    </li>
                    <li>
                      <span class="icon"></span>
                      <span class="statistics-name">分散安置人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{
                          data.renkou.fensananzhi ? data.renkou.fensananzhi : 0
                        }}</span
                        >人</span
                      >
                    </li>
                    <li>
                      <span class="icon"></span>
                      <span class="statistics-name">需紧急生活救助人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{
                          data.renkou.jinjijiuzhu ? data.renkou.jinjijiuzhu : 0
                        }}</span
                        >人</span
                      >
                    </li>
                    <li>
                      <span class="icon"></span>
                      <span class="statistics-name">需过渡期生活救助人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{
                          data.renkou.guoduqijiuzhu
                            ? data.renkou.guoduqijiuzhu
                            : 0
                        }}</span
                        >人</span
                      >
                    </li>
                    <li>
                      <span class="icon"></span>
                      <span class="statistics-name">被困人口:</span
                      ><span class="statistics-number"
                        ><span class="num">{{
                          data.renkou.beikun ? data.renkou.beikun : 0
                        }}</span
                        >人</span
                      >
                    </li>
                  </el-scrollbar>
                </div>
              </ul>
            </div>
          </div>
          <div class="module-statistics">
            <div>
              <p>房屋</p>
              <ul>
                <li>
                  <span class="statistics-name">倒塌房屋户数:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.fangwu.daotahu ? data.fangwu.daotahu : 0
                    }}</span
                    >户</span
                  >
                </li>
                <li>
                  <span class="statistics-name">倒塌房屋间数:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.fangwu.datajian ? data.fangwu.datajian : 0
                    }}</span
                    >间</span
                  >
                </li>

                <li>
                  <span class="statistics-name">严重损坏房屋户数:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.fangwu.yanzhongsunhuihu
                        ? data.fangwu.yanzhongsunhuihu
                        : 0
                    }}</span
                    >户</span
                  >
                </li>
                <li>
                  <span class="statistics-name">严重损坏房屋间数:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.fangwu.yanzhongsunhuijian
                        ? data.fangwu.yanzhongsunhuijian
                        : 0
                    }}</span
                    >间</span
                  >
                </li>
                <li>
                  <span class="statistics-name">一般损坏房屋户数:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.fangwu.yibansunhuihu ? data.fangwu.yibansunhuihu : 0
                    }}</span
                    >户</span
                  >
                </li>
                <li>
                  <span class="statistics-name">一般损坏房屋间数:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.fangwu.yibansunhuijian
                        ? data.fangwu.yibansunhuijian
                        : 0
                    }}</span
                    >间</span
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="module-statistics-bottom">
          <div class="module-statistics">
            <div>
              <p>经济</p>

              <ul>
                <li>
                  <span class="statistics-name">直接经济损失:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.jingji.zhijie ? data.jingji.zhijie : 0
                    }}</span
                    >万元</span
                  >
                </li>
                <li>
                  <span class="icon"></span>
                  <span class="statistics-name">农业损失:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.jingji.nongye ? data.jingji.nongye : 0
                    }}</span
                    >万元</span
                  >
                </li>

                <li>
                  <span class="icon"></span>
                  <span class="statistics-name">工矿企业损失:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.jingji.gongkuang ? data.jingji.gongkuang : 0
                    }}</span
                    >万元</span
                  >
                </li>
                <li>
                  <span class="icon"></span>
                  <span class="statistics-name">基础设施损失:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.jingji.jichusheshi ? data.jingji.jichusheshi : 0
                    }}</span
                    >万元</span
                  >
                </li>
                <li>
                  <span class="icon"></span>
                  <span class="statistics-name">公益设施损失:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.jingji.gongyisheshi ? data.jingji.gongyisheshi : 0
                    }}</span
                    >万元</span
                  >
                </li>
                <li>
                  <span class="icon"></span>
                  <span class="statistics-name">家庭财产损失:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.jingji.jiatingcaichan
                        ? data.jingji.jiatingcaichan
                        : 0
                    }}</span
                    >万元</span
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="module-statistics">
            <div>
              <p>农业</p>
              <ul>
                <li>
                  <span class="statistics-name">农作物受灾面积:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.nongye.nongzuowu ? data.nongye.nongzuowu : 0
                    }}</span
                    >公顷</span
                  >
                </li>
                <li>
                  <span class="statistics-name">草场受灾面积:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.nongye.caochang ? data.nongye.caochang : 0
                    }}</span
                    >公顷</span
                  >
                </li>

                <li>
                  <span class="statistics-name">毁坏耕地面积:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.nongye.gengdi ? data.nongye.gengdi : 0
                    }}</span
                    >公顷</span
                  >
                </li>

                <li>
                  <span class="statistics-name">因灾死亡大牲畜:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.nongye.siwangdashengchu
                        ? data.nongye.siwangdashengchu
                        : 0
                    }}</span
                    >头</span
                  >
                </li>
                <li>
                  <span class="statistics-name">因灾死亡羊只:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.nongye.siwangyangzhi ? data.nongye.siwangyangzhi : 0
                    }}</span
                    >只</span
                  >
                </li>
                <li>
                  <span class="statistics-name">饮水困难大牲畜:</span
                  ><span class="statistics-number"
                    ><span class="num">{{
                      data.nongye.yinshuikunnandashengchu
                        ? data.nongye.yinshuikunnandashengchu
                        : 0
                    }}</span
                    >头</span
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="localunit">
          <p>本级单位救灾</p>
          <el-scrollbar style="height: 285px">
            <ul>
              <li>
                <span class="statistics-name">启动响应时间:</span
                ><span class="statistics-number"
                  ><span class="time">{{
                    shuju.benji.responseLevel ? shuju.benji.responseLevel : 0
                  }}</span></span
                >
              </li>

              <li>
                <span class="statistics-name">启动响应时间:</span
                ><span class="statistics-number"
                  ><span class="time">{{
                    shuju.benji.responseTime ? shuju.benji.responseTime : 0
                  }}</span></span
                >
              </li>
              <li>
                <span class="statistics-name">已支出自然灾害生活补助资金:</span
                ><span class="statistics-number"
                  ><span class="num">{{
                    shuju.benji.shenghuobuzhuzijin
                      ? shuju.benji.shenghuobuzhuzijin
                      : 0
                  }}</span
                  >万</span
                >
              </li>
              <li>
                <span class="statistics-name">发放衣被数量:</span
                ><span class="statistics-number"
                  ><span class="num">{{
                    shuju.benji.yibei ? shuju.benji.yibei : 0
                  }}</span
                  >套</span
                >
              </li>
              <li>
                <span class="statistics-name">搭建帐篷数量:</span
                ><span class="statistics-number"
                  ><span class="num">{{
                    shuju.benji.zhangpeng ? shuju.benji.zhangpeng : 0
                  }}</span
                  >顶</span
                >
              </li>
              <li>
                <span class="statistics-name">其他生活类物资投入折款:</span
                ><span class="statistics-number"
                  ><span class="num">{{
                    shuju.benji.zhekuan ? shuju.benji.zhekuan : 0
                  }}</span
                  >万元</span
                >
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="subordinateunit">
          <p>下级单位救灾</p>
          <ul>
            <!-- <li>
              <span class="statistics-name">启动响应级别:</span
              ><span class="statistics-number"
                ><span class="time">{{
                  shuju.xiaji.responseLevel ? shuju.xiaji.responseLevel : ''
                }}</span></span
              >
            </li>

            <li>
              <span class="statistics-name">启动响应时间:</span
              ><span class="statistics-number"
                ><span class="time">{{
                  shuju.xiaji.responseTime ? shuju.xiaji.responseTime : ''
                }}</span></span
              >
            </li> -->
            <li>
              <span class="statistics-name">已支出自然灾害生活补助资金:</span
              ><span class="statistics-number"
                ><span class="num">{{
                  shuju.xiaji.shenghuobuzhuzijin
                    ? shuju.xiaji.shenghuobuzhuzijin
                    : 0
                }}</span
                >万</span
              >
            </li>
            <li>
              <span class="statistics-name">发放衣被数量:</span
              ><span class="statistics-number"
                ><span class="num">{{
                  shuju.xiaji.yibei ? shuju.xiaji.yibei : 0
                }}</span
                >套</span
              >
            </li>
            <li>
              <span class="statistics-name">搭建帐篷数量:</span
              ><span class="statistics-number"
                ><span class="num">{{
                  shuju.xiaji.zhangpeng ? shuju.xiaji.zhangpeng : 0
                }}</span
                >顶</span
              >
            </li>
            <li>
              <span class="statistics-name">其他生活类物资投入折款:</span
              ><span class="statistics-number"
                ><span class="num">{{
                  shuju.xiaji.zhekuan ? shuju.xiaji.zhekuan : 0
                }}</span
                >万元</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 灾情统计弹框
 */
@Component({
  name: 'StatisticsBox',
  components: {},
})
export default class StatisticsBox extends Vue {
  @Prop() private compParam: any; // data
  @Prop() private compParamData: any; // shuju
  private showFlag = true;
  private data: any = {

  };
  private shuju: any = {

  };

  private created() {
    this.data = JSON.parse(JSON.stringify(this.compParam));
    this.adjustData();
    this.shuju = JSON.parse(JSON.stringify(this.compParamData));
    this.adjustShuju();
    // console.log(this.compParam, 'data');
    // console.log(this.compParamData, 'shuju');
    return;
  }
  private adjustData() {
    this.data.renkou = this.data.renkou || {};
    this.data.fangwu = this.data.fangwu || {};
    this.data.jingji = this.data.jingji || {};
    this.data.nongye = this.data.nongye || {};
  }
  private adjustShuju() {
    this.shuju.benji = this.shuju.benji || {};
    switch (this.shuju.benji.responseLevel) {
              case '1':
                this.shuju.benji.responseLevel = 'Ⅰ级';
                break;
              case '2':
                this.shuju.benji.responseLevel = 'Ⅱ级';
                break;
              case '3':
                this.shuju.benji.responseLevel = 'Ⅲ级';
                break;
              case '4':
                this.shuju.benji.responseLevel = 'Ⅳ级';
                break;
              default:
                this.shuju.benji.responseLevel = '未启动响应';
                break;
            }
    this.shuju.benji.responseTime = this.shuju.benji.responseTime.substring(0, 16);
    this.shuju.xiaji = this.shuju.xiaji || {};
  }
  private close() {
    this.messsageBus.emit('DisasterOpen', false);
  }
}
</script>

<style lang="less" scoped>
@urlPath: '../../../../assets/img/flood/disasterStatistics';
* {
  padding: 0;
  margin: 0;
}

ul li:nth-of-type(even) {
  background: #142a3b;
}
.StatisticsBox-wrap {
  position: absolute;
  height: 899px;
  width: 1452px;
    left: 24%;
    top: 146px;
  z-index: 20;
  background: url('@{urlPath}/box-bg.png') no-repeat 0 0;
  .StatisticsBox-title {
    margin: 25px 30px;
    .title-time {
      font-family: 'myHeiti';
      font-size: 26px;
      color: #bbd0dc;
      letter-spacing: -1px;
      padding-left: 20px;
    }
    .close-icon {
      position: absolute;
      top: 12px;
      right: 14px;
      width: 80px;
      height: 35px;
      background: url('@{urlPath}/eventAndTopics_close.png') no-repeat 0 0;
      z-index: 1;
      cursor: pointer;
      pointer-events: auto;
    }
    .close-icon:hover {
      background-image: url('@{urlPath}/eventAndTopics_close_h.png');
    }
  }
  .StatisticsBox-content {
    display: flex;
    margin: 30px;
    .content-left {
      width: 66%;
      .left-title {
        color: #92edf6;
        font-size: 26px;
        span {
          margin-left: 20px;
          .num {
            font-family: 'myHeiti';
            color: #ffe615;
            margin: 0 10px;
          }
        }
      }
      // 人口和房屋
      .module-statistics-top {
        display: flex;
        .module-statistics {
          width: 430px;
          margin: 24px;
          p {
            color: #5fd0e8;
            font-size: 26px;
            margin-left: 46px;
          }
          ul {
            margin: 10px;
            height: 285px;
            .shouzai-box {
              height: 230px;
              overflow: hidden;
            }
            li {
              width: 100%;
              height: 48px;
              line-height: 48px;
              font-family: 'myHeiti';
              font-size: 24px;
              color: #bbd0dc;
              letter-spacing: -1px;
              clear: both;

              .icon {
                display: inline-block;
                margin: 0 0 0 20px;
                width: 21px;
                height: 12px;
                background: url('@{urlPath}/icon-circle.png') no-repeat 0 0;

                position: relative;
              }
              .icon::before {
                margin-left: 2;
                position: absolute;
                top: -23px;
                bottom: 0;
                content: '';
                width: 1px;
                height: 48px;
                background-color: #2a6da1;
              }
              .statistics-name {
                margin-left: 10px;
              }
              .statistics-number {
                float: right;
                margin-right: 10px;
                .num {
                  font-family: 'myHeiti';
                  color: #92edf6;
                  margin: 0 6px;
                }
              }
            }
          }
        }
      }
      //经济和农业
      .module-statistics-bottom {
        display: flex;
        .module-statistics {
          width: 430px;
          margin: 4px 24px 24px 24px;
          p {
            color: #5fd0e8;
            font-size: 26px;
            margin-left: 46px;
          }
          ul {
            margin: 10px;
            // height: 285px;
            li {
              width: 100%;
              height: 48px;
              line-height: 48px;
              font-family: 'myHeiti';
              font-size: 24px;
              color: #bbd0dc;
              letter-spacing: -1px;
              clear: both;
              .icon {
                display: inline-block;
                margin: 0 0 0 20px;
                width: 21px;
                height: 12px;
                background: url('@{urlPath}/icon-circle.png') no-repeat 0 0;

                position: relative;
              }
              .icon::before {
                margin-left: 2;
                position: absolute;
                top: -23px;
                bottom: 0;
                content: '';
                width: 1px;
                height: 48px;
                background-color: #2a6da1;
              }
              .statistics-name {
                margin-left: 10px;
              }
              .statistics-number {
                float: right;
                margin-right: 10px;
                .num {
                  font-family: 'myHeiti';
                  color: #92edf6;
                  margin: 0 10px;
                }
              }
            }
          }
        }
      }
    }
    .content-right {
      width: 33%;
      .localunit {
        width: 430px;
        margin: 8px 42px;
        p {
          color: #5fd0e8;
          font-size: 26px;
          margin-left: 30px;
          margin-bottom: 42px;
        }
        ul {
          margin: 10px;
          // height: 285px;
          li {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            width: 100%;
            min-height: 48px;
            // line-height: 48px;
            font-family: 'myHeiti';
            font-size: 24px;
            color: #bbd0dc;
            letter-spacing: -1px;
            clear: both;
            box-sizing: border-box;
            .statistics-name {
              float: left;
              margin-left: 10px;
            }
            .statistics-number {
              float: right;
              margin-right: 10px;
              .num {
                font-family: 'myHeiti';
                color: #92edf6;
                margin: 0 6px;
              }
              .time {
                color: #ec5b39;
              }
            }
          }
        }
      }
      .subordinateunit {
        width: 430px;
        margin: 8px 42px;
        p {
          color: #5fd0e8;
          font-size: 26px;
          margin: 30px 30px 42px;
        }
        ul {
          margin: 10px;
          height: 285px;
          li {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            width: 100%;
            min-height: 48px;
            // line-height: 48px;
            font-family: 'myHeiti';
            font-size: 24px;
            color: #bbd0dc;
            letter-spacing: -1px;
            clear: both;
            box-sizing: border-box;
            .statistics-name {
              margin-left: 10px;
            }
            .statistics-number {
              margin-right: 10px;
              .num {
                font-family: 'myHeiti';
                color: #92edf6;
                margin: 0 6px;
              }
              .time {
                color: #ec5b39;
              }
            }
          }
        }
      }
    }
  }
}
</style>
