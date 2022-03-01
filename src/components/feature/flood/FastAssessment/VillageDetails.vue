<template>
  <div class="newDetailsProtrusion animated flipInY">
    <div class="newDetailsProtrusion_bg">
      <p>
        <span class="title">村庄详情</span>
        <span
          v-if="dataResult.state"
          :class="[dataResult.state === '0' ? 'prepare' : 'immediately']"
        >
          {{
          dataResult.state === "0" ? "准备转移" : "立即转移"
          }}
        </span>
        <!-- <span class="state">立即转移</span> -->
      </p>

      <i @click="backParent()"></i>
    </div>
    <div class="newDetailsProtrusion-baseinfo-content">
      <p>
        <span class="staticfont">村庄：</span>
        <span :title="dataResult.county">
          {{
          dataResult.county ? dataResult.county : "暂无数据"
          }}
        </span>
      </p>
      <p>
        <span class="staticfont">所属区市：</span>
        <span class="TeamLeix" :title="dataResult.name">
          {{
          dataResult.name ? dataResult.name : "暂无数据"
          }}
        </span>
      </p>
      <p>
        <span class="staticfont">所属流域：</span>
        <span class="TeamLeix" :title="dataResult.basin">
          {{
          dataResult.basin ? dataResult.basin : "暂无数据"
          }}
        </span>
      </p>
      <p>
        <span class="staticfont">防洪能力(年)：</span>
        <span class="TeamLeix" :title="dataResult.floodcrtl">
          {{
          dataResult.floodcrtl ? dataResult.floodcrtl : "暂无数据"
          }}
        </span>
      </p>
      <p>
        <span class="staticfont">影响人数：</span>
        <span
          class="TeamLeix"
          :title="dataResult.people"
        >{{ dataResult.people ? dataResult.people : "暂无数据" }}人</span>
      </p>
      <p>
        <span class="staticfont">影响房屋数：</span>
        <span class="TeamLeix" :title="dataResult.house">
          {{
          dataResult.house ? dataResult.house : "暂无数据"
          }}
        </span>
      </p>
      <p>
        <span class="staticfont">防汛责任人：</span>
        <span class="TeamLeix" :title="dataResult.contacts">
          <span>
            {{
            dataResult.contacts ? dataResult.contacts : "暂无数据"
            }}
          </span>
        </span>
      </p>
      <p>
        <span class="staticfont">联系电话：</span>
        <span class="TeamLeix" :title="dataResult.house">
          <span>
            {{
            dataResult.telephone ? dataResult.telephone : "暂无数据"
            }}
          </span>
        </span>
        <b
          v-if="dataResult.telephone&&dataResult.telephone!=='--'"
          class="callphonebgimg"
          :title="dataResult.telephone ? dataResult.telephone : ''"
          @click="
              handleClickCallup(
                dataResult.telephone,
                dataResult.telephone,
                $event
              )
            "
        ></b>
      </p>
      <p>
        <span class="staticfont">计算依据：</span>
        <span class="TeamLeix" :title="dataResult.threshold">
          <span>
            {{
            dataResult.threshold? timeData.id+'分钟降水量超过'+ dataResult.threshold:'--'
            }}
          </span>
        </span>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import { realtimeTeam } from '@/api/installServer';
// import moment from 'moment';
// import { rescueTeamServer } from '@/api/installServer';
// import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
// import popDataDeal from '@/components/feature/gisModule/popUp/dataDeal/popDataDeal';
// import MapCommon from '@/util/MapCommon';
// import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import { gsemergencyServer } from '@/api/feature/model/installServer';
@Component({
  name: 'VillageDetails',
})
export default class VillageDetails extends Vue {
  // @Prop() private rescueTeamHomeData?: any // 父组件传的数据
  // @Prop() private timeData: any // 父组件传的时间
  @Prop() private villageDetailsParams: any;
  private dataResult: any = {};

  // @Watch('rescueTeamHomeData', { deep: true })
  // private FnlistData(val: any): void {
  //   this.getDetail()
  // }
  @Watch('villageDetailsParams', { deep: true })
  private FnlistData(val: any): void {
    this.getDetail();
  }
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any) {
    const self: any = this;
    self.messsageBus.emit('showCallup', true, listObj, val, event);
  }
  // 返回首页
  private backParent() {
    this.messsageBus.emit('updateVillageDetails', { show: false });
    this.getComponent().closePopup();
    // this.$emit('backParent')
  }
  private mounted() {
    this.getDetail();
  }

  // 获取列表数据
  private getDetail() {
    gsemergencyServer
      .getModelDetail({
        id: this.villageDetailsParams.id, // this.rescueTeamHomeData.id,
        state: this.villageDetailsParams.state, // this.rescueTeamHomeData.state,
        time: this.villageDetailsParams.time, // this.timeData.id,
        mark: this.villageDetailsParams.mark, // this.timeData.state,
      })
      .then((res: any) => {
        if (!res) {
          return;
        }
        this.dataResult = res;
      });
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.ModelDisplayFactory.getComponent('mountainFlood');
    return component;
  }
}
</script>

<style lang="less" scoped>
@closeUrl: '../../../../assets/img/gisModule/PopulationFeverBox';
.staticfont {
  color: #92edf6;
  font-size: 24px;
  display: inline-block;
  vertical-align: top;
}
.callphonebgimg {
  display: inline-block;
  width: 22px;
  height: 22px;
  background: url('../../../../assets/img/realtimeTeam/phone.png') no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
  margin-left: 10px;
  cursor: pointer;
}
.newDetailsProtrusion {
  position: absolute;
  z-index: 300;
  top: 0;
  width: 450px;
  height: 520px;
  margin-top: 115px;
  margin-left: 77px;
  border-radius: 5px;
  background: url('../../../../assets/img/fastAssessment/bg.png') no-repeat;
  background-size: 100% 100%;
  font-size: calc(20px * 1.3) !important;
  color: #fff;
  .newDetailsProtrusion_bg {
    position: relative;
    p {
      margin: 15px 30px;
      .title {
        font-weight: 600;
        font-family: 'myHeiti';
        font-size: calc(20px * 1.5);
        color: 00e4ff;
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -1px;
        padding-right: 20px;
      }
      .prepare {
        display: inline-block;
        margin-left: 50px;
        color: #fdef4f;
        font-size: 24px;
      }
      .immediately {
        display: inline-block;
        margin-left: 50px;
        font-size: 24px;
        color: #ec5b39;
      }
    }

    i {
      position: absolute;
      top: -9px;
      right: 5px;
      width: 90px;
      height: 48px;
      background: url('@{closeUrl}/closeBtn.png') no-repeat;
      background-size: 100% 100%;
      &:hover {
        background: url('@{closeUrl}/closeHover.png') no-repeat;
      }
    }
  }

  .newDetailsProtrusion-baseinfo-content {
    margin: 30px 20px;
    p {
      display: flex;
      align-items: center;
      padding: 5px 10px;
    }
    p:nth-child(odd) {
      background: #1f3851;
    }
  }
}
</style>
