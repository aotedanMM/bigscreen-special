<template>
    <div class="typhoonMonitor-wrap">
        <div class="typhoonMonitor-wrap_hd ">
         <span class="block f-tit-h2" style="position:relative">
            {{typhoonId}}{{typhoonTitle}}路径信息 <i @click.stop="toPlay(typhoonId)" :class="!isPlaying ? 'icon40 icon40_play':'icon40 icon40_stop'" ></i>
            <!-- :class="isPlay ? 'icon40 icon40_play':'icon40 icon40_stop'" -->
        </span>  
         
         <span class="block f-tit-h2">{{'（' + dataSource + '）' }}</span>
         <!--台风事件时间轴-->
        <TyphoonTimerShaft></TyphoonTimerShaft>
        </div>
        <div class="typhoonMonitor-wrap_bd">
          <el-scrollbar style="height:100%" ref="dotsList" id="dotsList">
            <ul class="typhoonMonitor-wrap_list" id="dataList">

              <li class="f-tit-h2" 
              v-for="(item,index) of typhoonPathDots" :id="'dot#_'+index" :ref="'dot#_'+index" 
              :class="index === curIndex ? ' cur' : ''"
              :key="index"
               @click="handlerListData(index,item.geometry.coordinates)">
                  <p class="typhoonMonitor-wrap_list_p">
                      <span class="time-bg">{{item.properties.time.replace('T','  ')}}</span>
                  </p>
                  <p class="typhoonMonitor-wrap_list_p">
                    <span class="label"> 位置：</span>  
                    <span class="">N: <span class="text-hl">{{ item.geometry.coordinates[0]}}</span> / E: <span class="text-hl">{{item.geometry.coordinates[1]}}</span></span>
                  </p>
                  <p class="typhoonMonitor-wrap_list_p">
                    <span class="label"> 状态：</span> 
                    <span>{{item.properties.strong}}</span>
                  </p>  
              </li>
            </ul>
          </el-scrollbar>
        </div>
    </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import publishObjectPath from '@/util/configRegistry';
import TyphoonTimerShaft from '@/components/feature/typhoonInfo/TyphoonTimerShaft.vue';
@Component({
  name: 'TyphoonMonitoring',
  components: {
    TyphoonTimerShaft, // 台风事件时间轴
  },
})
export default class TyphoonMonitoring extends Vue {
  private typhoonTitle: string = '';
  private dataSource: string = '';
  private typhoonId: string = '';
  private typhoonPathDots: any = []; // 监测点
  private curIndex: number = -1;
  private isPlay: boolean = false;
  private isPlaying: boolean = false;
  // 台风
  private getTyphoonServer() {
    const typhoonServerConf =  publishObjectPath.value.typhoonServer;
    typhoonServerConf.httpRequest = new G.base.HttpRequest();
    const typhoonServer = new G.service.TyphoonServiceImpl(typhoonServerConf);
    return typhoonServer;
  }
  private async getAllDotsById() {
    const id = this.typhoonId;
    const typhoonServer = this.getTyphoonServer();
    const that = this;
    const res = await typhoonServer.getTyphoonInfo({typhoonid: id});
    return res;
  }
  private handlerListData(index: number, local: any) {
    const dotLocal = local;
    this.curIndex = index;
    // this.isActive = this.toHeightlight(index);
    // 清除台风点高亮
    this.getMapComponent().hidehighlight() ;
    this.getMapComponent().showhighlight(dotLocal);
    // console.debug('0000000', dotLocal);
  }

  // Gis地图方法
  private getMapComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('typhoon');
    return component;
  }
  private handleScroll(num: number) {
    // 选中点的对应的列表数据滚动到视野内
    const scrollEl =  $('#dotsList .el-scrollbar__wrap') ;
    if (this.$refs['dot#_' + num]) {
      const height = 129 * num;
      scrollEl.scrollTop(height);
    }
  }

  private toPlay(id: any) {
    if (!this.isPlay) {
      this.isPlaying = true;
      this.isPlay = true;
      this.getMapComponent().playoneTyphoon(id);
    } else {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
    this.getMapComponent().pauseTyphoon(id, true); // 继续
    } else {
    this.getMapComponent().pauseTyphoon(id, false); // 暂停
    }
    }
  }

  private clickTyphoonDot() {
    // 点击地图点位选中列表中对应数据
    const that = this;
    this.getMapComponent().off('focuslistitem');
    this.getMapComponent().on('focuslistitem', (data: any) => {
      const centerPoint = data.centerPoint.data;
      that.curIndex = this.typhoonPathDots.findIndex((item: any) => (centerPoint[0] - 0) === item.geometry.coordinates[0] && (centerPoint[1] - 0)  === (item.geometry.coordinates[1]));
      that.$nextTick(() => {
        that.handleScroll(that.curIndex);
      });
    });
    this.getMapComponent().off('typhoonMoveEnd');
    this.getMapComponent().on('typhoonMoveEnd', (data: any) => {
    that.isPlaying = false;
    that.isPlay = false;
    });
  }

  private async init() {
    this.typhoonTitle = this.$store.state.TyphoonModule.content; // '2020黄峰路径信息';
    this.dataSource = '中央气象台';
    this.typhoonId = this.$store.state.TyphoonModule.id;
    const resData = await this.getAllDotsById();
    this.typhoonPathDots = resData[0].features;
    // console.debug(this.typhoonPathDots, '111111', this.typhoonPathDots.length);
    const aimsData = this.typhoonPathDots[this.typhoonPathDots.length - 1].properties.forecast;
    const tmp = aimsData.find((item: any) => (item.region === '中国'));
    this.typhoonPathDots = this.typhoonPathDots.concat(tmp.features);
    // console.debug(this.typhoonPathDots, '222222', this.typhoonPathDots.length);
    // console.debug(resData, '--------------');
    // console.debug(this.predictionDots, '++++++++++');
  }
  private async  created() {
    await this.init();
    this.clickTyphoonDot();
  }
  private  beforeDestroy() {
     this.getMapComponent().off('focuslistitem');
  }

}
</script>
<style lang="less" scoped>
.typhoonMonitor-wrap{
  margin:0 5px;
  height:100%;
  &_hd{
    height:170px;
    padding:0 10px;
    color:#67e1fb;
    line-height: 1.25;
    .block{
      display: block;
    }
  }
  &_bd{
    height: calc(100% - 170px);
  }
  &_list{
    margin:0;
    padding:0;
    outline: none;
    &>li{
      padding:10px;
      color:#e8f4fe;
      background:linear-gradient(to left, transparent 10%, rgba(116,239,252, .2) 50%, transparent 100%);
      margin:5px 0;
      cursor: pointer;
      user-select: none;
      &.cur{
      background:linear-gradient(to left, transparent 10%, rgba(255,222,0, .2) 50%, transparent 100%);
      color:#fffabe;
        .label{
          color:#fffabe;
        }

      }
    }
    &_p{
      margin:0;
      padding:0;
    }
    .title-bg{
      background:linear-gradient(to left, red 0%,  transparent 50%);
      display: inline-block;
      border-radius: 5px;
    }
    .label{
      color:#8cafd0;
    }
    .text-hl{
      color:#27e8ff
    }
  }
  .icon40{
    position: absolute;
    right:10px;;
    top:0;
    display: inline-block;
    width:40px;
    height:40px;
    vertical-align: middle;
    cursor: pointer;
  }
  .icon40_play{    
    background: url('../../../assets/img/typhoonInfo/play.png') no-repeat 50% 50%;
  }
  .icon40_stop{    
    background: url('../../../assets/img/typhoonInfo/stop.png') no-repeat 50% 50%;
  }
}
</style>
