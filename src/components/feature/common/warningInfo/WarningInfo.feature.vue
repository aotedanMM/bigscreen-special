<template>
  <div class="panel-warning-info">
    <el-scrollbar class="cmp-scrollbar-y" style="height:100%">
      <ul v-if='warningInfoData.length'>
        <li
          v-for="(item,index) in warningInfoData"
          :key="index"
          @click="clickItemWarning(item,index)"
          :class="{'yujing_active' : idd == index}"
          :type="item.type"
        >
          <p class="icon"></p>
          <p>
            <span class="num">{{item.count}}</span>
            <span :title="item.name" class="type ellipsis">{{item.name}}</span>
          </p>
        </li>
      </ul>
      <template v-else>
        <div class="nothingData--bg" :class="{halfhide:loading}"></div>
      </template>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'WarningInfo',
})
export default class WarningInfo extends Vue {

  /*
   * 预警信息列表
   */
  @Prop() public warningInfoData?: any;
  @Prop() public loading: any;
  /*
   * 选中下标
   */
  private ischeck: boolean = true;
  private idd: number = -1;

  private list = [];
  // 当操作屏定位后高亮消失
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  public onEventLocate() {
    this.idd = -1;
  }
  /*
   * 点击每一个预警信息时的回调
   */
  private clickItemWarning(item: any, index: number) {
    // 隐藏常态模式事件分布
    this.messsageBus.emit('eventInfoMapShow', false);
    if (index !== this.idd) {
        this.idd = index;
        this.messsageBus.emit('listEarlyWarninginfoEmit', item);
    } else {
        this.idd = -1;
        this.messsageBus.emit('listEarlyWarninginfoEmit', {type: false});
    }
  }
  private created() {
    this.messsageBus.on('idShow', (data: any) => {
      this.idd = -1;
    });
  }
  get getList() {
    return this.warningInfoData || [];
  }
}
</script>
<style scoped lang="less">
@warningInfoImgUrl: '../../../../assets/img/warningInfo/';
.panel-warning-info {
  height: 100%;
  margin:-5px -1px 0 10px;
}
.panel-warning-info ul {
  margin: 0;
  padding: 0;
  height: 100%;  
  list-style: none;
}
.panel-warning-info ul li {
  float: left;
  width: 50%;
  /* margin-top: 10px;*/
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover{
     background: url('@{warningInfoImgUrl}yujing_active.png')
    no-repeat;
  background-size: 100% 100%;
  }
  .icon {
    width: 81px;
    height: 81px;
    float: left;
  }
  .icon + p {
    width: calc(100% - 85px);
  }
  .num {
    font-family: 'Impact';
    color: #2cf7ff;
    font-weight: 600;
    font-size: 32px;
    display: block;
  }
  .type {
    color: #d2e1ec;
    display: inline-block;
    width: 100%;
    height: 38px;
    font-size: 26px;
    overflow: hidden;
    // text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.panel-warning-info ul li.yujing_active {
  background: url('@{warningInfoImgUrl}yujing_active.png')
    no-repeat;
  background-size: 100% 100%;
}

/* 重污染 11829 ， 大雾事件 11B17， 大风事件 11B06， 霾11B19 ，道路结冰11B21  雷雨大风 11B20，  寒冷 11B34 ， 干旱 11B22 ，森林火险 11B25  道路冰雪 11B57
寒潮事件 11B05，霜冻事件 11B16 ，高森林火险 11G10 ，暴雪事件 11B04 ，空气污染事件 12Q02 ，沙尘暴 11B07 ，冰雹 11B15 ，雷电 11B14*/
li[type='11B01'] .icon {
  background: url('@{warningInfoImgUrl}taifeng_01.png');
  background-size: 100% 100%;
}
li[type='11B14'] .icon {
  background: url('@{warningInfoImgUrl}leidian_01.png');
  background-size: 100% 100%;
}
li[type='11B15'] .icon {
  background: url('@{warningInfoImgUrl}bingbao_01.png');
  background-size: 100% 100%;
}
li[type='11B07'] .icon {
  background: url('@{warningInfoImgUrl}shachenbao_01.png');
  background-size: 100% 100%;
}
li[type='11B03'] .icon {
  background: url('@{warningInfoImgUrl}baoyu_01.png');
  background-size: 100% 100%;
}
li[type='11B09'] .icon {
  background: url('@{warningInfoImgUrl}gaowen_01.png');
  background-size: 100% 100%;
}
li[type='11B25'] .icon {
  background: url('@{warningInfoImgUrl}senlin_01.png');
  background-size: 100% 100%;
}
li[type='11B37'] .icon {
  background: url('@{warningInfoImgUrl}dizhi_01.png');
  background-size: 100% 100%;
}
li[type='11B17'] .icon {
  background: url('@{warningInfoImgUrl}dawu_01.png');
  background-size: 100% 100%;
}
li[type='11B06'] .icon {
  background: url('@{warningInfoImgUrl}dafeng_01.png');
  background-size: 100% 100%;
}
li[type='11B19'] .icon {
  background: url('@{warningInfoImgUrl}mai_01.png');
  background-size: 100% 100%;
}
li[type='11B21'] .icon {
  background: url('@{warningInfoImgUrl}daolujiebing_01.png');
  background-size: 100% 100%;
}
li[type='11B22'] .icon {
  background: url('@{warningInfoImgUrl}ganhan_01.png');
  background-size: 100% 100%;
}
li[type='11B05'] .icon {
  background: url('@{warningInfoImgUrl}hanchao_01.png');
  background-size: 100% 100%;
}
li[type='11B16'] .icon {
  background: url('@{warningInfoImgUrl}shuangdong_01.png');
  background-size: 100% 100%;
}
li[type='11B04'] .icon {
  background: url('@{warningInfoImgUrl}baoxue_01.png');
  background-size: 100% 100%;
}
li .icon{
  background: url('@{warningInfoImgUrl}qita.png');
  background-size: 100% 100%;
}
/*弹框*/
.hotspot_early_warning_infor_popu1 {
  position: absolute;
  width: 480px;
  /*max-width: 555px;*/
  /*min-height: 480px;*/
  height: 565px;
  background: url('@{warningInfoImgUrl}yujing_list.png')
    no-repeat;
  background-size: 100% 100%;
  top: -310px;
  left: 600px;
  z-index: 3;
}
.hotspot_popu_title {
  color: #fda100;
  font-size: 30px;
  line-height: 50px;
  position: relative;
  margin: 35px 0 0 75px;
  width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.hotspot_popu_close {
  position: absolute;
  font-size: 50px;
  color: #fff;
  right: 18px;
  top: 27px;
  display: inline-block;
  cursor: pointer;
  width: 46px;
  height: 46px;
}
.hotspot_popu_cont {
  width: calc(100% - 90px);
  height: calc(74% - 18px);
  margin-left: 37px;
  margin-top: 35px;
}
.hotspot_popu_cont ul {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.hotspot_popu_cont ul > li {
  height: 80px;
  display: flex;
}
.hotspot_popu_cont ul > li > img {
  width: 67px;
  height: 67px;
  margin-right: 8px;
}
.hotspot_popu_cont ul > li > p {
  width: calc(100% - 92px);
}
.hotspot_popu_cont ul > li > p > span {
  display: inline-block;
  font-size: 30px;
  color: #ffffff;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.hotspot_popu_cont ul > li > p > span:last-child {
  font-size: 20px;
  color: #52728c;
}
.halfhide{
  color: #fff;
  // font-size: 36px;
  background: url(../../../../assets/img/halfScreen/halflist/loading.gif) no-repeat 33px;
  color: #d2e1ec;
  height: 100%;
}

</style>
<style lang="less">
  .cmp-scrollbar-y .el-scrollbar__wrap {
    overflow-x: hidden;
    padding-right: 15px;
  }
</style>