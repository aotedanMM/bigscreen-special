<template>
  <div class='HistoricalEarthquake'>
    <el-scrollbar class="cmp-scrollbar-y" style="height:96%;margin-top:4%">
      <ul class='HistoricalEarthquake_cont' v-if='isShow'>
        <li v-for="(item,index) in arrData" :key='index'>
          <h2 class='f-tit-h2'>{{item.name}}</h2>
          <p class='f-txt-com' v-html = 'item.content'></p>
        </li>
      </ul>
      <div class="nothingData--bg" v-else></div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { historicalEarthquakeServer } from '@/api/installServer';
@Component({
  name: 'HistoricalEarthquake',
})
export default class HistoricalEarthquake extends Vue {
    private arrData: any = [];
    private isShow: any = false;
    private updateStr: any = '';
    private tmpNumStr: any = '';
    private interChar: any = '';
    private latitude: any = '';
    private longitude: any = '';
    private data: any = {
        endTime: '',
        latitude: '25.94',
        longitude: '99.68',
        m: ['5', '6'],
        radius: '100',
        startTime: '1949',
    };
    // 遍历字符串中的数字，给数字添加新的样式颜色
    private update_form(text: any) {
      this.updateStr = '';
      this.tmpNumStr = '';
      const j = text.length;
      for ( let i = 0; i < j ; i++) {
        this.interChar = text.charAt(i);
        if (!isNaN(this.interChar)) {
        // 为数字时
          if (this.tmpNumStr === '') {
          // 增加样式<FONT style="color:#00fffc" >
            this.tmpNumStr = '<FONT style="color:#00fffc" >' + this.interChar;
          } else {
            this.tmpNumStr = this.tmpNumStr + this.interChar;
          }
        } else {
        // 闭合样式</FONT>
          if (this.tmpNumStr !== '') {
            this.tmpNumStr = this.tmpNumStr + '</FONT>' + this.interChar;
            this.updateStr = this.updateStr + this.tmpNumStr;
            this.tmpNumStr = '';
          } else {
            this.updateStr = this.updateStr + this.interChar;
          }
        }
      }
      return this.updateStr;
    }

    // 获取历史地震数据
    private getManagementDuty() {
      const self = this;
      self.longitude = self.$store.state.eventPushStore.eventLocation.EventLon;
      self.latitude = self.$store.state.eventPushStore.eventLocation.EventLat;
      self.data.longitude = self.longitude;
      self.data.latitude = self.latitude;
      historicalEarthquakeServer.getData(self.data).then((res: any) => {
        if (res.data.length > 0) {
          this.isShow = true;
          self.arrData = res.data;
          const j = self.arrData.length;
          for (let i = 0 ; i < j ; i ++) {
            self.arrData[i].content = self.update_form(self.arrData[i].content);
          }
        } else {
          this.isShow = false;
        }
      });
    }
    private created() {
      this.getManagementDuty();
    }
}
</script>
<style lang="less" scoped>
@url: '../../../assets/img/HistoricalEarthquake';
*{
  margin:0;
  padding:0;
}
.HistoricalEarthquake{
    width: 100%;
    height: 100%;
}
.HistoricalEarthquake_cont{
    width: 96%;
    height: 100%;
    margin-left: 4%;
    li{
      h2{
        height: 45px;
        line-height:45px;
        background: rgba(100,219,251,.1);
        font-weight: bold;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #92edf6;
        padding: 0 13px;
      }
      p{
        padding: 5px 13px;
        line-height: 36px;
        color: #bbd0dc;
        margin-bottom: 10px;
      }
    }

}
.HistoricalEarthquake .el-scrollbar__thumb {
    background-image: linear-gradient(0deg, #0a7ccc 0%, #06b4d1 52%, #02ebd5 100%);
}
</style>