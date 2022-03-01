<template>
    <!--监测预警点位详情弹框-->
  <div class="newDetailsProtrusion" v-show="isShowWarning">
    <div class="newDetailsProtrusion_title-panel">
       {{title}}
    </div>
    <span class="newDetailsProtrusion-header-closebtn detail-container-close" @click="warningClose" ></span>
    <div class="newDetailsProtrusion-baseinfo-content">
      <div class="newDetailsProtrusion_title">
            <span>{{ name }}</span>
        </div>
      <el-scrollbar class="newDetailsProtrusion-baseinfo-content-top">
          <p>
              <span class="staticfont">河流名称：</span>
              <span class="">{{ riverName }}</span>
          </p>
          <p>
              <span class="staticfont">水系名称：</span>
              <span class="">{{ riverSystemName }}</span>
          </p>
          <p>
              <span class="staticfont">流域名称：</span>
              <span class="">{{ watershedName }}</span>
          </p>
          <p>
              <span class="staticfont">站址：</span>
              <span class="">{{ stationAddress }}</span>
          </p>
          <div v-if="type === 'limitOfReservoir'">
              <p><span class="staticfont">水库类型：</span><span class="TeamLeix" :title="reservoirType">{{ reservoirType }}</span></p>
              <p>
                  <span class="staticfont">库上水位：</span>
                  <span class="">{{ levelAbove }}m</span>
              </p>
              <p>
                  <span class="staticfont">库下水位：</span>
                  <span class="">{{ levelBelow }}m</span>
              </p>
              <p>
                  <span class="staticfont">汛限水位：</span>
                  <span class="">{{ levelLimit }}m</span>
              </p>
              <p><span class="staticfont">设计洪水位：</span><span class="currentLocation">{{ levelDesigned }}m</span></p>
              <p><span class="staticfont">数据加载时间：</span><span class="currentLocation">{{ datatime}}</span></p>
          </div>
          <div v-else-if="type === 'riverStation'">
              <p>
                  <span class="staticfont">水位：</span>
                  <span class="">{{ level }}m</span>
              </p>
              <p>
                  <span class="staticfont">警戒水位：</span>
                  <span class="">{{ levelWarning }}m</span>
              </p>
              <p>
                  <span class="staticfont">保证水位：</span>
                  <span class="">{{ levelGuarantee }}m</span>
              </p>
              <p><span class="staticfont">实测最高水位：</span><span class="currentLocation">{{ levelHighest }}m</span></p>
              <p><span class="staticfont">数据加载时间：</span><span class="">{{ datatime}}</span></p>
          </div>
          <div v-else>
              <p>
                  <span class="staticfont">日降水量：</span>
                  <span class="">{{ dailyRainfall }}mm</span>
              </p>
          </div>

      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'WarningPopup',

})
export default class WarningPopup extends Vue {

    private isShowWarning: boolean = true; // 监测预警详情窗开关
    private id: string = '';
    private title: string = '';
    private name: string = '';
    private type: string = '';   // 类型
    private riverName: string = '';   // 河流名称
    private riverSystemName: string = ''; // 水系名称
    private watershedName: string = ''; // 流域名称
    private stationAddress: string = ''; // 站址

    // 雨量站


    private dailyRainfall: number = 0;  // 日降水量


    // 水库测站
    private reservoirType: string = '';  // 水库类型
    private levelAbove: number = 0;  // 库上水位
    private levelBelow: number = 0;  // 库下水位
    private levelLimit: number = 0;  // 汛限水位
    private levelDesigned: number = 0;  // 设计洪水位
    private datatime: string = '';  // 数据加载时间

    // 河道站
    private level: number = 0;  // 水位
    private levelWarning: number = 0; // 警戒水位
    private levelGuarantee: number = 0; // 保证水位
    private levelHighest: number = 0; // 实测最高水位



  /**
   * gis传入数据data
   * @data 基本数据的参数
   *
  */
  private getrealtimeTeambaseInfo(data: any) {
      this.name = data.name || '暂无数据';
      this.type = data.type || '暂无数据';
      this.riverName = data.riverName || '暂无数据';
      this.riverSystemName = data.riverSystemName || '暂无数据';
      this.watershedName = data.watershedName || '暂无数据';
      this.stationAddress = data.stationAddress;
      this.reservoirType = data.reservoirType;
      this.level = data.level || 0;
      this.datatime = data.datetime || '暂无数据';
      this.id = data._id;
      this.levelWarning = data.levelWarning || 0;
      this.levelGuarantee = data.levelGuarantee || 0;
      this.levelHighest = data.levelHighest || 0;
      this.levelAbove = data.levelAbove || 0;
      this.levelBelow = data.levelBelow || 0;
      this.levelLimit = data.levelLimit || 0;
      this.levelDesigned = data.levelDesigned || 0;
      this.dailyRainfall = data.dailyRainfall || 0;
      if (data.name.indexOf('河道站') > 0) {
          this.title = '河道站';
      } else if (data.name.indexOf('水库') > 0) {
          this.title = '水库测站';
      } else {
          this.title = '雨量站';
      }
  }



  private handleSizeChange(val: number) {
    console.log(val);
  }


  // 关闭弹窗
  private warningClose() {
    const self = this;
    self.isShowWarning = !this.isShowWarning;
  }

  /**
   * 页面初始加载 获取数据
   *
  */
  private mounted() {
      const self: any = this;
      self.getrealtimeTeambaseInfo(self.data);
  }
}
</script>
<style lang="less" scoped>
 @import url('../../../../../assets/css/popUp/RealteamAndMareria.less');
 
</style>
