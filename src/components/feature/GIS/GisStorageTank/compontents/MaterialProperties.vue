/** author: chenyu time:2020-03-25 **/
<template>
  <div class="MaterialProperties">
    <el-scrollbar style="height: 100%;">
      <el-row>
        <el-col :span="12">
          <div>
            <div class="NameOfTheMaterial">
              物质名称
            </div>
            <div class="NameOfTheMaterial_content">
              汽油 Gasoline
            </div>
          </div>
          <div>
            <div class="NameOfTheMaterial">
              特别警示
            </div>
            <div class="NameOfTheMaterial_content">
              高度易燃液体；不得使用直流水扑救（用水灭火无效）。
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="NameOfTheMaterial_image"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="TheAccordion">
            <div class="TheAccordion_top">
              <el-scrollbar style="height: 95%;width: 95%;">
                <!-- 滚动条 -->
                <el-collapse accordion>
                  <el-collapse-item name="1">
                    <template slot="title">
                      <div
                        style="margin-bottom:5px;display:flex;justify-content:space-between;width:100%"
                      >
                        <div class="title_style">理性特性</div>
                        <div
                          :class="[
                            activeName == 1 ? 'arrows' : 'arrows_transform',
                          ]"
                        ></div>
                      </div>
                    </template>
                    <div>
                      无色到浅黄色的透明液体。相对密度（水=1）0.70～0.80，相对蒸气密度（空气=1）3～4，闪点-46℃，爆炸极限1.4～7.6%（体积比），自燃温度415～530℃，最大爆炸压力0.813MPa；石脑油主要成分为C4～C6的烷烃，相对密度0.78～0.97，闪点-2℃，爆炸极限1.1～8.7%（体积比）。
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="2">
                    <template slot="title">
                      <div
                        style="margin-bottom:5px;display:flex;justify-content:space-between;width:100%"
                      >
                        <div class="title_style">危害信息</div>
                        <div
                          :class="[
                            activeName == 2 ? 'arrows' : 'arrows_transform',
                          ]"
                        ></div>
                      </div>
                    </template>
                    <div style="height: 207px;">
                      <el-scrollbar style="height: 95%;width: 95%;">
                        <span style="font-weight: bold;">【燃烧和爆炸危险性】</span><br/>
                        <div class="video-dot1"></div>高度易燃，蒸气与空气能形成爆炸性混合物，遇明火、高热能引起燃烧爆炸。<br/>
                        <div class="video-dot1"></div>高速冲击、流动、激荡后可因产生静电火花放电引起燃烧爆炸。<br/>
                        <div class="video-dot1"></div>蒸气比空气重，能在较低处扩散到相当远的地方，遇火源会着火回燃和爆炸。<br/>
                        <span style="font-weight: bold;">【健康危害】</span><br/>
                        <div class="video-dot1"></div>汽油为麻醉性毒物，高浓度吸入出现中毒性脑病，极高浓度吸入引起意识突然丧失、反射性呼吸停止。<br/>
                        <div class="video-dot1"></div>误将汽油吸入呼吸道可引起吸入性肺炎。<br/>
                        <div class="video-dot1"></div>职业接触限值：PC-TWA(时间加权平均容许浓度)(mg/m3):300（汽油）。<br/>
                      </el-scrollbar>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="3">
                    <template slot="title">
                      <div
                        style="margin-bottom:5px;display:flex;justify-content:space-between;width:100%"
                      >
                        <div class="title_style">安全措施</div>
                        <div
                          :class="[
                            activeName == 3 ? 'arrows' : 'arrows_transform',
                          ]"
                        ></div>
                      </div>
                    </template>
                    <div style="height: 207px;">
                      <el-scrollbar style="height: 95%;width: 95%;">
                        <span style="font-weight: bold;">【一般要求】</span><br/>
                      <div class="video-dot1"></div>操作人员必须经过专门培训，严格遵守操作规程，熟练掌握操作技能，具备应急处置知识。<br/>
                      <div class="video-dot1"></div>密闭操作，防止泄漏，工作场所全面通风。远离火种、热源，工作场所严禁吸烟。配备易燃气体泄漏监测报警仪，使用防爆型通风系统和设备，配备两套以上重型防护服。操作人员穿防静电工作服，戴耐油橡胶手套。<br/>
                      <div class="video-dot1"></div>储罐等容器和设备应设置液位计、温度计，并应装有带液位、温度远传记录和报警功能的安全装置。<br/>
                      <div class="video-dot1"></div>避免与氧化剂接触。<br/>
                      生产、储存区域应设置安全警示标志。灌装时应控制流速，且有接地装置，防止静电积聚。搬运时要轻装轻卸，防止包装及容器损坏。配备相应品种和数量的消防器材及泄漏应急处理设备。<br/>
                        <span style="font-weight: bold;">【特殊要求】</span><br/>
                        <span style="font-weight: bold;">&nbsp;&nbsp;【操作安全】</span><br/>
                      （1）油罐及贮存桶装汽油附近要严禁烟火。禁止将汽油与其他易燃物放在一起。 <br/>
                      （2）往油罐或油罐汽车装油时，输油管要插入油面以下或接近罐的底部，以减少油料的冲击和与空气的摩擦。沾油料的布、油棉纱头、油手套等不要放在油库、车库内，以免自燃。不要用铁器工具敲击汽油桶，特别是空汽油桶更危险。因为桶内充满汽油与空气的混合气，而且经常处于爆炸极限之内，一遇明火，就能引起爆炸。<br/>
                      （3）当进行灌装汽油时，邻近的汽车、拖拉机的排气管要戴上防火帽后才能发动，存汽油地点附近严禁检修车辆。<br/>
                      （4）汽油油罐和贮存汽油区的上空，不应有电线通过。油罐、库房与电线的距离要为电杆长度的1.5倍以上。<br/>
                      （5）注意仓库及操作场所的通风，使油蒸气容易逸散。<br/>
                        <span style="font-weight: bold;">&nbsp;&nbsp;【储存安全】</span><br/>
                      （1）储存于阴凉、通风的库房。远离火种、热源。库房温度不宜超过30℃。炎热季节应采取喷淋、通风等降温措施。<br/>
                      （2）应与氧化剂分开存放，切忌混储。用储罐、铁桶等容器盛装，不要用塑料桶来存放汽油。盛装时，切不可充满，要留出必要的安全空间。<br/>
                      （3）采用防爆型照明、通风设施。禁止使用易产生火花的机械设备和工具。储存区应备有泄漏应急处理设备和合适的收容材料。罐储时要有防火防爆技术措施。对于1000m3及以上的储罐顶部应有泡沫灭火设施等。<br/>
                        <span style="font-weight: bold;">&nbsp;&nbsp;【运输安全】</span><br/>
                      （1）运输车辆应有危险货物运输标志、安装具有行驶记录功能的卫星定位装置。未经公安机关批准，运输车辆不得进入危险化学品运输车辆限制通行的区域。<br/>
                      （2）汽油装于专用的槽车(船)内运输，槽车(船)应定期清理；用其他包装容器运输时，容器须用盖密封。运送汽油的油罐汽车，必须有导静电拖线。对有每分钟0.5m3以上的快速装卸油设备的油罐汽车，在装卸油时，除了保证铁链接地外，更要将车上油罐的接地线插入地下并不得浅于100mm。运输时运输车辆应配备相应品种和数量的消防器材。装运该物品的车辆排气管必须配备阻火装置，禁止使用易产生火花的机械设备和工具装卸。汽车槽罐内可设孔隔板以减少震荡产生静电。<br/>
                      （3）严禁与氧化剂等混装混运。夏季最好早晚运输，运输途中应防曝晒、防雨淋、防高温。中途停留时应远离火种、热源、高温区及人口密集地段。<br/>
                      （4）输送汽油的管道不应靠近热源敷设；管道采用地上敷设时，应在人员活动较多和易遭车辆、外来物撞击的地段，采取保护措施并设置明显的警示标志；汽油管道架空敷设时，管道应敷设在非燃烧体的支架或栈桥上。在已敷设的汽油管道下面，不得修建与汽油管道无关的建筑物和堆放易燃物品；汽油管道外壁颜色、标志应执行《工业管道的基本识别色、识别符号和安全标识》（GB 7231）的规定。<br/>
                      （5）输油管道地下铺设时，沿线应设置里程桩、转角桩、标志桩和测试桩，并设警示标志。运行应符合有关法律法规规定。
                      </el-scrollbar>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="4">
                    <template slot="title">
                      <div
                        style="margin-bottom:5px;display:flex;justify-content:space-between;width:100%"
                      >
                        <div class="title_style">应急处置原则</div>
                        <div
                          :class="[
                            activeName == 4 ? 'arrows' : 'arrows_transform',
                          ]"
                        ></div>
                      </div>
                    </template>
                    <div style="height: 207px;">
                      <el-scrollbar style="height: 95%;width: 95%;">
                        <span style="font-weight: bold;">【急救措施】</span><br/>
                      <div class="video-dot1"></div>吸入：迅速脱离现场至空气新鲜处。保持呼吸道通畅。如呼吸困难，给氧。如呼吸停止，立即进行人工呼吸、就医。<br/>
                      <div class="video-dot1"></div>食入：给饮牛奶或用植物油洗胃和灌肠、就医。<br/>
                      <div class="video-dot1"></div>皮肤接触：立即脱去污染的衣着，用肥皂水和清水彻底冲洗皮肤、就医。<br/>
                      <div class="video-dot1"></div>眼睛接触：立即提起眼睑，用大量流动清水或生理盐水彻底冲洗至少15分钟、就医。<br/>
                        <span style="font-weight: bold;">【灭火方法】</span><br/>
                      <div class="video-dot1"></div>喷水冷却容器，尽可能将容器从火场移至空旷处。<br/>
                      <div class="video-dot1"></div>灭火剂：泡沫、干粉、二氧化碳。<br/>
                      <div class="video-dot1"></div>用水灭火无效。<br/>
                        <span style="font-weight: bold;">【泄漏应急处置】</span><br/>
                      消除所有点火源。根据液体流动和蒸气扩散的影响区域划定警戒区，无关人员从侧风、上风向撤离至安全区。建议应急处理人员戴正压自给式空气呼吸器，穿防毒、防静电服。作业时使用的所有设备应接地。禁止接触或跨越泄漏物。尽可能切断泄漏源。防止泄漏物进入水体、下水道、地下室或密闭性空间。<br/>
                      小量泄漏：用砂土或其它不燃材料吸收。使用洁净的无火花工具收集吸收材料。<br/>
                      大量泄漏：构筑围堤或挖坑收容。用泡沫覆盖，减少蒸发。喷水雾能减少蒸发，但不能降低泄漏物在受限制空间内的易燃性。用防爆泵转移至槽车或专用收集器内。<br/>
                      作为一项紧急预防措施，泄漏隔离距离至少为50m。如果为大量泄漏，下风向的初始疏散距离应至少为300m。
                      </el-scrollbar>
                    </div>
                  </el-collapse-item>
                  <!--
                  <el-collapse-item title="特别警示" name="5">
                    <template slot="title">
                      <div
                        style="margin-bottom:5px;display:flex;justify-content:space-between;width:100%"
                      >
                        <div class="title_style">特别警示</div>
                        <div
                          :class="[
                            activeName == 5 ? 'arrows' : 'arrows_transform',
                          ]"
                        ></div>
                      </div>
                    </template>
                    <div>
                      高度易燃液体；不得使用直流水扑救（用水灭火无效）。
                    </div>
                  </el-collapse-item>
                  -->
                </el-collapse> </el-scrollbar><!-- /滚动条 -->
            </div>

            <div class="recalculate_felxBox"  @click="FnRecount()">
              <div class="recalculate" style="margin-right: 20px;">
                <div class="recalculate_img"></div>
                <div class="recalculate_font">重新计算</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'MaterialProperties',
  components: {},
})
export default class MaterialProperties extends Vue {
  private msg: any = '物质性质';
  private activeName: any = '0';
  private FnRecount(): any {
    this.messsageBus.emit('recount', 'GisInputPanle');
  }
}
</script>
<style scoped lang="less">
.MaterialProperties {
  height: 100%;
}
.NameOfTheMaterial {
  width: 45%;
  height: 34px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/titleBg.png);
  background-position: 0px 0px;
  color: #00e4ff;
  text-indent: 34px;
  line-height: 34px;
  font-size: 22px;
  margin: 10px;
}
.NameOfTheMaterial_content {
  color: #a0f7ff;
  font-size: 22px;
  margin-left: 10px;
}

.NameOfTheMaterial_image {
  width: 100%;
  height: 217px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/TheMaterialProperties.png);
  background-position: -399px -27px;
}

.TheAccordion {
  width: 100%;
  height: 600px;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/decisionSupport_zdmb.png);
  background-repeat: no-repeat;
  background-position: 13px 0px;
  // display: flex;
  // justify-content: center;
}
.TheAccordion_top {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
}
.arrows {
  width: 34px;
  height: 36px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAkCAYAAADsHujfAAAGwUlEQVRYhYWYvY8lRxXFf6eq+/V787WLbe0ay0JaW8sGyIkTOzESAYbAMraEJRMSQIITROzEfwhCBCT8CSRYFmAZERgLnGBGliw+1rDa2Zmdmfe6qw5BVc/reftmKemququr6p46de+tW61bfzL/p2ij3mzfLJsT+or2S6V5jPJNANr4vg3MNqWbbd4GahsQbci2ts3vU6VXia4AuBXINkVhItO2TTBTpXnjeZTNcgFmCuQqALG+xyrbgE2BTBWnKqHW2wD5cUBGAKPiZvLeTL6PYMYJR+UZGCZAhtov1b5TMI8AmYKZAmlrv20y9h0nd1W6KQHoN5iDLVszpXi62nYis43nKWMjkJGBVVXc1+cpa7HWaaLX2xgZ6R5XPSqe17qrbR1rWxmBZGBZvy+r0rFM7SdMGNzKyOa2NBMQHbBweZ5PAE5Xu6r9zrU28rGMjI2MTHVuZWTqIVNGFoYdioyA2smqE9ALzoHGELQGOBrsUPuP23JRHmes062ZuyjfBfYQu4ZFBTjOMVRGzvCFIVtrD+pr34HLNvkIkG0BrHGhemZYVAAHhv3KzHyDkXNDJxEFtgtLQKcC8qoYdMlGNsFEV9c1zC3mwK5hz3BQmRm3B6DHZVsY3VisMCvB0tDqcuy5dF6NFj8FIUCugwytRWtYZNjJsGexb7H/1hPc+eQF3v7kBd5+6wnujO0Z9jLsGBZ1bFvnipt6RuVTIBeAXOnL0Fi0GbpcWNlx2Z5dw/67z/DS9cj8emT+7jO8ZNg37FrsWuxkmGfo6hxNBTONxhflkdM3V6RZZXsytC6TdVSjRSyARZqMz9Dk0t5jloI5opPpDG0QMUEIRgZtMnDpPYEsSCJkiAliFm0Ws1y2prOYGboh89w7nxPv9vDPHn7yOXHIPFdBzyqLiyxmWbSpLComEayi6ypGnAUG5QIoGDoXj5mjdWDL5tls7vzmCL7xF/4OKGduGe7YHAdxWg15hpkLZhKdIKgyIkH0o5HVvVCv4jG5eEoxMjE3zCrVbTY3bV4MQgS+CIFDgCxamWeTeTGLoyCOMXOrjjWtoJVowsRzWk9O34cBpbW3BIvo9bnSGRYSM8xTKfNKGxyzdLcNfDoaXox82mdmsm8MWa/EwH3Eic1C0FFsbCaIMkGgQWgltJurjfSlMfQiDqIdYJagS2I+iHkOdFlcW5lXZ9HdEPUgRj4mggPRgUiEGPk4RT1ooruVeTWLaznQDWKexDxBN0A3iLbqCv1mHDEoQUjQJNEmFTCILpvdVeb1ReODZdBZE/mIWM+LQCaQARFJTeSjPuhsHn2wyryezS6iqwubJdEkaFIJmBpUgRy26CxAL5RETCrWnaHN0CZoh8wbc/nmGRpiwx8op2tAbsAz8Ay5UVnYeWz4/bk0zOWbQ+aNVOeqEquesCq74MO2urNH2ygeEzI0GYQIQ+LNTr49BOUQeV/wnzpqhpm/86Ruv/OkbmPm4JkCCP4bIu8PQbmTbw+JNykhQXXu4LVN6sJYlyouotLBxQmgT3x3gV/OgkF8MIPPBAdkB0z7/et87XvXeBrgXz351/c5RA6ScoDPViI04lud/fJZ0hcx8AuvE6KQKXnDIwEtgy1skSwGZ15LgpX0YSM+AM6xe0Df2efmj5/SV8exP3pKz3x7n5vF4NwD54343Ur6cBA485rFYJEtnK+612RdyjmXglNF3uulr7eBP2IOwBHY+eYe1396Q89r49D62Q09f25/+dsT/gE+xTqJgV/21l9D5G/AqUvilBDJk2xe/NljRtYGmKskPDuCvQD7CuxHOIhwLeCvBHPjV7f0w1bM7YsDEkGW8GCWPzj0z7P4MqN7CY4SPHDmOMOx4aQCOssFVA+kEciYkbWhBLF5KGAWgt0o9hq8H+GJYG5gbqrU1ynAAc4Q9y3uIv6dxd0E9wZ0nMyJ4WFVfgqc55Jc95SMLTe3enzYri9HGVbhIrTQR0gyS2CJ6W16Sjr4oGwXswpkSVnxPcw9xD3EkeAkwnKAh5QsbZlLPV7EfKtfJ88jkAFwhmwYYkUtu5PLJIYzmWPgPiVdnOasp5gHFkeYY5mHkk8tLQ3nCQZfvgFeXCkunb6TD0kmBUiykwqFS8y54FTmBLjHZvJc0sLzagOniDOZXvYqSEOGwbp07bx8+t7qyzXwsF3nkVnkmJ0FQzBDKAa9wpxSaB6z/GnyXJJls0SsQmExWQzRzqugxOTKWfWugYxl8sEAR7q4lU3vr4FicNM/BeOYRAmGg1y2OkBuylGfn05X/zW66o8RANcsA+lIFuub2mbiOwUy1pekzvPY8j91/zu9VANdHgAAAABJRU5ErkJggg==)
    no-repeat;
  background-size: auto;
  background-size: 100% 100%;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 10px;
}
.arrows_transform {
  width: 34px;
  height: 36px;
  background: url(data:image/png;base64,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)
    no-repeat;
  background-size: auto;
  background-size: 100% 100%;
  cursor: pointer;
  transform: rotate(180deg);
  transition: transform 0.3s;
  margin-top: 10px;
}
.title_style {
  width: auto;
  height: 30px;
  line-height: 60px;
  font-size: 24px;
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
/deep/ .el-collapse-item__arrow {
  margin: 0 8px 0 auto;
  transition: transform 0.3s;
  font-weight: 300;
  color: rgba(0, 0, 0, 0);
}
/deep/ .el-collapse-item__header {
  display: flex;
  align-items: center;
  height:53px;
  line-height: 48px;
  background-color: rgba(0, 0, 0, 0);
  color: #00e4ff;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  font-size: 22px;
  font-weight: 500;
  transition: border-bottom-color 0.3s;
  outline: 0;
  background-image: url(../../../../../assets/img/gisModule/GisStorageTank/barColor.png);
  background-position: 0px 39px;
  background-repeat: no-repeat;
  text-indent: 10px;
}

/deep/ .el-collapse {
  border-top: 1px solid rgba(0, 0, 0, 0);
  border-bottom: 1px solid rgba(0, 0, 0, 0);
}

/deep/ .el-collapse-item__wrap {
  will-change: height;
  background-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
}

/deep/ .el-collapse-item__content {
  padding-bottom: 0px;
  font-size: 24px;
  color: #dafbff;
  line-height: 1.769230769230769;
  // height:207px;
}
  .video-dot1 {
    width: 8px;
    height: 8px;
    background: #ad1111;
    border-radius: 4px;
    margin: 14px 10px 0px 14px;
    display: inline-flex;
  }
</style>
