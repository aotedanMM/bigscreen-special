<template>
    <div class="TyphoonPanelMonitor-nr">
      <div class="TyphoonPanelMonitor_content" v-if="isShowLoading">
        <!-- 历史台风-->
        <div class="TyphoonPanelMonitor_list_table">
          <div class="get_list">
            <el-select v-model="selectYear" size="mini" @change="getYear" class="constomMySelect">
              <el-option
                v-for="(item,index) in yearList"
                :key="index"
                :label="item.value"
                :value="item.value"
              ></el-option>
              <el-option :key="null" label value></el-option>
            </el-select>
          </div>
          <my-el-table
            :tableInfo="JSON.parse(JSON.stringify(historyData))"
            key="2"
            :selection="false"
            @row-click="rowClick"
            class="typhoon_table_list"
          ></my-el-table>
        </div>
      </div>
      <div class="nocontBox" v-else>
        <p class='loading'></p>
      </div>
    </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import MyElTable from '@/components/feature/typhoonInfo/MyElTable.vue';
import MapCommon from '@/util/MapCommon';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import { getEvemtInfoOrCreatedInfo } from '@/api/installServer';
@Component({
  name: 'Typhoon',
  components: {
    MyElTable,
  },
  mixins: [MapCommon, GisAreaSelectEvent],
})
export default class Typhoon extends Vue {
  // 父级传下来的接口信息
  @Prop() public option?: any;
  // 接口信息
  private service: any = null;
  // 加载loading
  private isShowLoading: boolean = false;
  // 事件点击间隔 防止多次点击出现问题
  private isOk: boolean = true;
  private oldEventId: string = '';
  // 历史台风
  private historyData: any = {
    height: '100%',
    config: [
      { prop: 'id', label: '编号' },
      { prop: 'content', label: '中文名' },
    ],
    data: [],
  };

  private selectYear: any = ''; // 选择的年份
  private yearList: any = []; // 年份列表
  private isCollection: number = 0;  // 是否收藏
  private selecttypecode: string = '10';  // 台风事件

  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStaFactory.getComponent(
        'typhoonDistricts',
    );
    return component;
  }

  // 列表点击事件 进入处置
  private rowClick(res: any) {
    // if (!this.isOk) {
    //   return;
    // }
    // this.isOk = false;
    const self: any = this;
    self.messsageBus.emit('closePopTyphoon', true);
    self.$store.dispatch('TyphoonModule/setTyphoon', res);
    // 关闭加载的台风
    self.getComponent().clear();
    self.getComponent().addTyphoon(res.id, true);
    // self.$store.commit('mapTools/changeNearbyQueryVisible', false);
    self.getComponent().getTyphoonInfluence(res.id).then((data: any) => {
      /**
        * 点击进入处置按钮
        * @param isCollection- 是否收藏
        * @param selecttypecode - 事件类型
        */
      self.currentgeoms = [];
      self.currentgeoms.push(data.geometry);
      self.currentgeoms.push(data.foregeometry);
      self.currentgeoms.push(data.pastgeometry);
      self.$store.dispatch('TyphoonModule/setTyphoongeoms', self.currentgeoms);
      self.disposeHandler(self.isCollection, self.selecttypecode, data);
    });
  }

  @Watch('$store.state.eventPushStore.eventId')
  private watchEventId(val: string) {
    // 如果id改变了 说明加载完成可以再次点击
    if (this.oldEventId !== val) {
      this.isOk = true;
      this.oldEventId = val;
    }
  }

  // 初始化参数
  private initOptions() {
    this.initService();
  }

  // 初始化服务
  private initService() {
    this.service = this.option.service;
  }

  // 地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('typhoon');
    return component;
  }

  // 获取历史台风;
  private async getTyphoonListByYear() {
    this.isShowLoading = false;
    await this.service
      .getTyphoonsByYear({ year: this.selectYear })
      .then((res: any[]) => {
        this.isShowLoading = true;
        if (res.length > 0) {
          const dataArr: any[] = [];
          // 数据倒叙
          // res.forEach((val: any): void => {
          //   dataArr.unshift(val);
          // });
          this.historyData.data =  res.sort((a: any, b: any) => {
            return b.id * 1 - a.id * 1;
          });
        } else {
          this.historyData.data = [];
        }
      });
  }

  private getYear(data: any) {
    this.selectYear = data;
    this.getComponent().clear();
    this.getTyphoonListByYear();
  }

  // 获取年份
  private getHistoryYear() {
    const nowYaer = new Date().getFullYear();
    this.selectYear = nowYaer;
    const num = nowYaer - 2010 + 1;
    for (let i = 0; i < num; i++) {
      const obj: any = {};
      obj.value = nowYaer - i;
      this.yearList.push(obj);
    }
  }

  private created() {
    const self: any = this;
    self.resolveMap('map').then(() => {
      self.getComponent().loadTyphoonTrack();
      self.initOptions();
      self.getHistoryYear();
      self.getTyphoonListByYear();
      self.getComponent().unloadWarningLine();
      self.getComponent().loadWarningLine();
      // 点击预测点
      self.getComponent().off('clickForecastPoint');
      self.getComponent().on('clickForecastPoint', (data: any) => {
        self.$store.dispatch('eventPushStore/UpdateGeometry', data);
        self.messsageBus.emit('updateData');
        if (this.$store.state.TyphoonModule.viewConfig.tabChooseValue === '2') {
          this.$nextTick(() => {
            this.getComponent1().showhideCircle(true);
          });
        }
      });
    });
     // 创建时时展开台风图例
    this.messsageBus.emit('closeTyphoonLegend', true);
  }

  private beforeDestroy() {
    this.getComponent().clear();
    this.getComponent().unloadWarningLine();
    this.getComponent().unloadTyphoonTrack();
    this.messsageBus.emit('closePopTyphoon');
     // 销毁时带走台风图例
    this.messsageBus.emit('closeTyphoonLegend', false);
  }

  private destroyed() {
    this.getComponent().off('clickForecastPoint');
  }
}
</script>
<style lang="less" scoped>
@url:'../../../assets/img/halfScreen/firePoint';
.TyphoonPanelMonitor-nr {
  width: 100%;
  height: 100%;
}

.TyphoonPanelMonitor_tabLable {
  transform: translateX(0px);
  width: 100%;
  display: flex;
  white-space: nowrap;
  position: relative;
  transition: transform .3s,-webkit-transform .3s;
}  
.constomMySelect{
  width: 100%;
}
.TyphoonPanelMonitor_tabLable_pie {
  cursor: pointer;
  flex: 1;
  position: relative;
  padding-left:20px;
  padding-right:20px!important;
  font-size: 22px;
  line-height: 42px;
      // width:190px;
  background-image:-webkit-linear-gradient(top,#ffffff 10%,#7bfaff);
  background-clip:text;
  -webkit-background-clip: text;
  -webkit-text-fill-color:transparent;
  text-align:center;
  font-weight: bold;
  &::after{
        content:'';
        background: url('../../../assets/img/halfScreen/eventAndTopics/selected.png') no-repeat 50% 10px;
        background-size:100% 100%;
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index: -1;
  }
}

 .TyphoonPanelMonitor_tabLable_pie.active {
      background-image:-webkit-linear-gradient(top,#ffffff 10%,#ffd43d);
      background-clip:text;
  -webkit-background-clip: text;
      -webkit-text-fill-color:transparent;
      text-align:center;
      &::after{
        content:'';
        background: url('../../../assets/img/halfScreen/eventAndTopics/selected_h.png') no-repeat 50% 10px;
        background-size:100% 100%;
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index: -1;
      }
 }

.TyphoonPanelMonitor_content{
  margin-left: 8px;
  width: calc(100% - 8px);
  height: calc(100% - 20px);
}

.TyphoonPanelMonitor_list_table {
  color: #fff;
  height: 100%;
}

.get_list{
  width: 100%;
  padding-bottom: 10px;
}

.curTyphoon-title{
    background:url('@{url}/list_title_bg.png') no-repeat 115px 32px;
    padding-bottom:20px;
    padding-top:10px;
    padding-left:10px;
    font-size: 30px;
    color:#67e1fb;
  }

  .typhoon_table_list{
    height: calc(100% - 42px);
  }

  .mr20 {
    margin-right: 20px;
  }

.nocontBox{
  position: relative;
  height: 632px;
  margin-right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading{
    width: 365px;
    background: url(../../../assets/img/halfScreen/halflist/loading.gif) no-repeat 33px 255px;
    margin: 250px auto;
    height:100%;
  }
}
</style>

<style lang="less">
.com-typhoon-detail{
/*滚动条样式*/
::-webkit-scrollbar {
/*滚动条整体样式*/
width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
height: 4px;
}
::-webkit-scrollbar-thumb {
/*滚动条里面小方块*/
border-radius: 5px;
-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
background-image: linear-gradient(0deg, #0a7ccc 0%, #06b4d1 52%, #02ebd5 100%);
}
::-webkit-scrollbar-track {
/*滚动条里面轨道*/
-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
border-radius: 0;
background: rgba(0, 0, 0, 0.1);
}
}
.TyphoonPanelMonitor-nr{
  .el-input--mini .el-input__inner{
    height: 40px;
    line-height: 40px;
  }
  .typhoon_table_list /deep/ .el-table .cell{
    font-size: 26px;
    line-height: 1;
    text-overflow: initial;
  }
  .typhoon_table_list /deep/ th:first-child .el-checkbox{
    visibility: hidden;
  }
}
.com-typhoon-detail {
    min-width: 300px;
    height: 460px;
    color: #fff;
    padding: 10px 0;
    margin-left: 10px;
    .com-typhoon-detail_yuCeTitle{
      width: 100%;
      height: 62px;
      position: relative;
      background:url('../../../assets/img/typhoonInfo/headerBg.png') no-repeat;
      background-size: 101% 100%;
      div{
        font-weight: 600;
        font-family: 'myHeiti';
        font-size: calc(20px * 1.5);
        color: 00e4ff;
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -1px;
        line-height: 62px;
        margin-left: 27px;
      }
    }
    ul{
      width: 448px;
        height: 300px;
        overflow: hidden;
        background:url('../../../assets/img/gisModule/PopulationFeverBox/centerBg.png') no-repeat -6px 0;
        background-size: 104% 100%;
        padding: 27px 0px 27px 16px;
        overflow-y: scroll;
        li {
            line-height: 45px;
            margin-top: 5px;
            padding: 0 15px;
            font-size: 26px;
            span{
              display: inline-block;
              width: 52.01px;
              text-align: center;
              margin-left: 10px;
            }
        }
        .listName{
          span:nth-of-type(1){
            margin-left: 0px;
            display: inline;
          }
          span{
            display: inline;
          }
        }
    }
    .com-typhoon-detail_footer{
      width: 100%;
      height: 30px;
      background: url('../../../assets/img/typhoonInfo/bottomBg.png') no-repeat;
      background-size: 101% 100%;
    }
    
}



.com-typhoon-detail-DetailsBox{
   min-width: 300px;
    min-height: 100px;
    color: #fff;
    padding: 10px 0;
    margin-left: 10px;
    .com-typhoon-detail_yuCeTitle{
      width: 100%;
      height: 62px;
      position: relative;
      background:url('../../../assets/img/typhoonInfo/DetailsBoxHeader.png') no-repeat;
      background-size: 100% 100%;
      div{
        font-weight: 600;
        font-family: 'myHeiti';
        font-size: calc(20px * 1.5);
        color: 00e4ff;
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -1px;
        line-height: 62px;
        margin-left: 27px;
        display: flex;
        .title_sy{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 289px;
        }
      }
      .close-enterprise-dialog{
        background: url("../../../assets/img/halfScreen/eventAndTopics/eventAndTopics_close.png") no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        width: 80px;
        height: 35px;
        top: 5px;
        right: 11px;
        position: absolute;
        cursor: pointer;
        &:hover {
          cursor: pointer;
          background-image: url('../../../assets/img/halfScreen/eventAndTopics/eventAndTopics_close_h.png');
        }
      }
    }
    ul{
      width: 448px;
        height: 100%;
        background:url('../../../assets/img/typhoonInfo/DetailsBoxCenter.png') no-repeat;
        background-size: 100% 100%;
        padding: 27px 0px 27px 30px;
        li {
            line-height: 45px;
            margin-top: 5px;
            padding: 0 15px;
            font-size: 26px;
            span{
              display: inline-block;
              width: 52.01px;
              text-align: center;
              margin-left: 10px;
            }
        }
        .listName{
          span:nth-of-type(1){
            margin-left: 0px;
            display: inline;
          }
        }
        .listSpecial{
          display: flex;
          div{
            color: #ffec48;
            font-size: 26px;
          }
          div:nth-of-type{
             display: inline-block;
          }
          div:nth-of-type(2){
            display: inline-block;
            width: 68%;
          }
        }
    }
    .com-typhoon-detail_footer{
      width: 100%;
      height: 30px;
      background: url('../../../assets/img/typhoonInfo/DetailsBoxFooter.png') no-repeat;
      background-size: 100% 100%;
    }
}
</style>
