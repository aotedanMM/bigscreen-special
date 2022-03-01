/** author: chenyu time:2020-03-25 **/
<template>
  <div class="FlameDetails">
    <el-scrollbar style="height: 100%;">
      <el-main v-loading="GoLoading" style="overflow: hidden;">
        <el-row>
          <el-col :span="24">
            <div class="content TheFlameShape">
              <span class="titleFont">&nbsp;&nbsp;&nbsp;火焰外形：</span>
              <span class="titleContent">火焰外形被抽象成斜圆柱体</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="FlameGraphics"></div>
          </el-col>
          <el-col :span="12">
            <div class="FlameGraphicsList">
              <div class="FlameGraphicsList_pie">
                <span class="FlameGraphicsListNUM">{{
                  returnData.TankHeight
                }}</span>
                <span class="FlameGraphicsListWord">米</span>
              </div>
              <div class="FlameGraphicsList_pie">
                <span class="FlameGraphicsListNUM">{{
                  returnData.TheFlameRadius
                }}</span>
                <span class="FlameGraphicsListWord">米</span>
              </div>
              <div class="FlameGraphicsList_pie">
                <span class="FlameGraphicsListNUM">{{
                  returnData.FlameLength
                }}</span>
                <span class="FlameGraphicsListWord">米</span>
              </div>
              <div class="FlameGraphicsList_pie">
                <span class="FlameGraphicsListNUM">{{
                  returnData.FlameDirection
                }}</span>
              </div>
              <div class="FlameGraphicsList_pie">
                <span class="FlameGraphicsListNUM">{{
                  returnData.FlameAngle
                }}</span>
                <span class="FlameGraphicsListWord">度</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="content EstimatedBurnoutTime">
              <span class="titleFont" style="margin-left:20px"
                >预计燃尽总时间：</span
              >
              <span class="FlameGraphicsListNUM">{{
                returnData.BurningTime
              }}</span>
              <span class="FlameGraphicsListWord" style="margin-left:10px"
                >小时</span
              >
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="content BoilOverSigns">
              <span class="titleFont" style="margin-left:20px">沸溢征兆：</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="BoilOverSigns_pie">
              1.出现有面蠕动,涌涨现象,出现油沫2至四次.
            </div>
            <div class="BoilOverSigns_pie">
              2.火焰增大,发亮,变白,火舌形式火箭,颜色由浓变淡
            </div>
            <div class="BoilOverSigns_pie">
              3.金属罐壁颤抖,罐体发出强烈的噪声.此外,现场还有罐内油品发出的剧烈“嘶嘶”声.
            </div>
            <div class="BoilOverSigns_pie">
              4.一旦油罐发生火灾,注意上述现象,及时避难.
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="content EstimatedBurnoutTime">
              <span class="titleFont" style="margin-left:20px"
                >预计沸溢时间：</span
              >
              <span class="FlameGraphicsListNUM">{{
                returnData.BoilOverTime
              }}</span>
              <span class="FlameGraphicsListWord" style="margin-left:10px"
                >小时</span
              >
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="recalculate_felxBox">
              <div class="recalculate" @click="FnRecount()">
                <div class="recalculate_img"></div>
                <div class="recalculate_font">重新计算</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { gisStorageTankServer } from '@/api/installServer';
@Component({
  name: 'FlameDetails',
  components: {},
})
export default class FlameDetails extends Vue {
  @Prop() private GetLargeTankFireModelData: any;
  @Prop() private GetLargeTankFireAnalysisModelData: any;
  private msg: any = '火焰详情';
  private GoLoading: any = true;
  private returnData: any = {
    TankHeight: '',
    TheFlameRadius: '',
    FlameLength: '',
    FlameDirection: '',
    FlameAngle: '',
    BurningTime: '',
    BoilOverTime: '',
  };
  private FnRecount(): any {
    this.messsageBus.emit('recount', 'GisInputPanle');
  }
  // 方法 （截取特定字符前的字符串）
  private FnCutOut(str: any , sign: any): any {
    const index: any = str.replace(/\s/g, '').lastIndexOf(sign);
    const CutOutStr: any = this.returnFloat(str.substring(0, index));
    return CutOutStr;
  }
  // 方法(保留两位小数，不足补零)
  private returnFloat(value: any): any {
    let val: any = Math.round(parseFloat(value) * 100) / 100;
    const s = val.toString().split('.');
    if (s.length === 1) {
      val = val.toString() + '.00';
      return val;
    }
    if (s.length > 1) {
      if (s[1].length < 2) {
        val = val.toString() + '0';
      }
      return val;
    }
  }
  @Watch('GetLargeTankFireModelData')
  private FnRenderData(): void {
    this.GoLoading = false;
    this.returnData.TankHeight = '28';
    this.returnData.TheFlameRadius = '14';
    this.returnData.FlameDirection = '东北风';
    if (this.GetLargeTankFireModelData.data.data.Service_Info) {
      // this.returnData.FlameLength = this.FnCutOut(this.GetLargeTankFireModelData.data.data.Service_Info.Parms_Return.Fire_Info[0].FireHigh , '(');
      // this.returnData.FlameAngle = this.FnCutOut(this.GetLargeTankFireModelData.data.data.Service_Info.Parms_Return.Fire_Info[0].FireAngle , '(') ;
      // this.returnData.BurningTime = this.FnCutOut(this.GetLargeTankFireModelData.data.data.Service_Info.Parms_Return.Fire_Info[0].BurningTime, '(');
      this.returnData.FlameLength = Number(this.GetLargeTankFireModelData.data.data.Service_Info.Parms_Return.Fire_Info[0].FireHigh).toFixed(2);
      this.returnData.FlameAngle = Number(this.GetLargeTankFireModelData.data.data.Service_Info.Parms_Return.Fire_Info[0].FireAngle).toFixed(2);
      this.returnData.BurningTime = Number(this.GetLargeTankFireModelData.data.data.Service_Info.Parms_Return.Fire_Info[0].BurningTime).toFixed(2);
    }
    this.returnData.BoilOverTime = '10';
  }
  private created() {
    if (this.GetLargeTankFireModelData !== '') {
      this.FnRenderData();
    }
  }
}
</script>
<style scoped lang="less">
.FlameDetails {
  width: 100%;
  height: 100%;
}
.title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 25px;
  color: #00e4ff;
  margin-left: 20px;
}
.content {
  width: 100%;
  margin: 10px 0;
}
.TheFlameShape {
  height: 34px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/FlameDetails.png);
  background-position: -22px 279px;
  font-size: 22px;
  line-height: 34px;
}
.titleFont {
  color: #00e4ff;
}
.titleContent {
  color: #dafbff;
}
.FlameGraphics {
  width: 100%;
  height: 362px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/FlameDetails.png);
  background-position: 454px -22px;
}
.FlameGraphicsList {
  width: 100%;
  height: 311px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/FlameDetails.png);
  background-position: -32px 0;
  padding-top: 37px;
}
.FlameGraphicsListNUM {
  font-weight: bold;
  color: #fff000;
  font-size: 24px;
  text-shadow: 5px 2px 6px #000;
}
.FlameGraphicsListWord {
  color: #dafbff;
  margin-left: 40px;
}
.FlameGraphicsList_pie {
  margin: 2px 0 0 150px;
  width: 100%;
  height: 58px;
  line-height: 58px;
}

.EstimatedBurnoutTime {
  height: 34px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/FlameDetails.png);
  background-position: -22px 73px;
  font-size: 22px;
  line-height: 34px;
}
.BoilOverSigns {
  height: 34px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/FlameDetails.png);
  background-position: -22px 219px;
  font-size: 22px;
  line-height: 34px;
}

.BoilOverSigns_pie {
  width: 100%;
  height: 30px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/FlameDetails.png);
  background-position: -893px -47px;
  font-size: 17px;
  line-height: 39px;
  background-repeat: no-repeat;
  text-indent: 3em;
  color: #dafbff;
}
.recalculate_felxBox {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
} 
.recalculate {
  width: 180px;
  height: 60px;
  background-image: url(../img/recount.png);
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.recalculate:hover {
  width: 180px;
  height: 60px;
  background-image: url(../img/recount_hover.png);
  background-size: 100% 100%;
  justify-content: center;
  align-items: center;
}
.recalculate_img {
  width: 40px;
  height: 40px;
  background-image: url(../img/recount_icon.png);
}
.recalculate_img:hover {
  width: 40px;
  height: 40px;
  background-image: url(../img/recount_icon_hover.png);
}
.recalculate_font {
  font-size: 22px;
  color: #70feff;
  cursor:pointer;
}
.recalculate_font:hover {
  font-size: 22px;
  color: #fff600;
  cursor:pointer;
}
/deep/ .el-scrollbar__thumb {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-radius: inherit;
  background-image: linear-gradient(#00efd5a8, #0080d378);
  transition: 0.3s background-color;
}
</style>
