<template>
  <div class="gisMapTool-item">
    <div class="gisMapTool-item_hd">
      <span
        class="gisMapTool-icon--head"
        :title="originData[0]&&originData[0].title"
        :class="[originData[0] && originData[0].iconName, curActiveArr.length ? 'toolActive': '']"
        @click="toShow"
      ></span>
    </div>
    <div class="gisMapTool-item_bd gisMapTool-item_bd--bg" 
        v-show="isShow">
      <div
          v-for="(item,key) of originData.slice(1)"
        :class="[item.isOpen ? 'toolActive': '', 'gisMapTool-item_bd_item']"
        :key="item.key"
        @click="fnClickHandler(item,key)"
      >
        <span
          class="gisMapTool-icon"
          v-show="!item.isShow"
          :class="[item.iconName,(item.isOpen && 'toolActive')]"
        ></span>
        <p class="text">{{item.title}}</p>
        <ul class="gisMapToolMore-box_item_list" v-if="item.list">
          <li v-for="(each) in item.list" :key="each.key" @click.stop="fnClickHandler(each)">
            <span class="gisMapTool-icon" :class="each.iconName"></span>
           {{each.title}} </li>
        </ul>

      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import '@/assets/css/gisUI/mapToolIcon.less';
import { IMapToolItem } from '@/interface/feature/common/mapTool/MapTool.interface';
// const defaultData = [{
//             iconName: 'gisMapTool-gongxiang',
//             title: '2工具箱',
//             key: 'toolBox',
//           },
//           {
//             iconName: 'gisMapTool-zhoubiantianqi',
//             title: '2周边天气',
//             key: 'surroundingWeather',
//           },
//           {
//             iconName: 'gisMapTool-yuqingxitong',
//             title: '2舆情监控',
//             key: 'publicOpinionMonitor',
//           },
//           {
//             iconName: 'gisMapTool-internet',
//             title: '互联网情报',
//             key: 'internetIntelligence',
//           },
//           {
//             iconName: 'gisMapTool-celiang',
//             title: '测量工具',
//             key: 'measuringTools',
//           },
//           {
//             iconName: 'gisMapTool-jiaotongguanzhi',
//             title: '交通管制',
//             key: 'trafficControl',
//           },
//           {
//             iconName: 'gisMapTool-daolusunhui',
//             title: '道路损毁',
//             key: 'roadDamage',
//           },
//           {
//             iconName: 'gisMapTool-huichuanimg',
//             title: '回传图像',
//             key: 'returnImage',
//           },
//           {
//             iconName: 'gisMapTool-shortCut',
//             title: '绿色通道',
//             key: 'greenChannel',
//           }];

@Component({
  name: 'GisMapTool',
})
export default class GisMapTool extends Vue {
  /*@Prop({
    default: '',
  })
  public lastKey?: string;*/
  @Prop() private originData!: any;
  private isShow: boolean = false;
  private curActiveArr: any = [];
  // private activeIndex: number = -1 ;
  @Watch('originData', {deep: true})
  private updateOriginData(val: any) {
    const tmpArr = JSON.parse(JSON.stringify(val));
    this.curActiveArr = [];
    if (tmpArr && tmpArr.length) {
      tmpArr.forEach( (item: any, index: any) => {
          if (item.isOpen) {
            this.curActiveArr.push(item);
          } else if (item.list && item.list.length) {
            item.list.forEach( (citem: any, cindex: any) => {
              if (citem.isOpen) {
                this.curActiveArr.push(item);
              }
            } );
          }
      });
    }
  }
  private toShow() {
    if (this.isShow) {
      this.isShow = false;
      return;
    }
    this.messsageBus.emit('changeToShow', this.originData[0].title);
    // this.$store.commit('mapTools/changeNearbyQueryVisible', false);
    this.$store.commit('mapTools/changeRegionPanelVisible', false);
  }
  private fnClickHandler(obj: any, index: number) {
    // this.$emit('clickToolItem', obj);
    // if (this.activeIndex === index) {
    //   this.activeIndex = -1;
    // 对应的触发器
    this.isShow = false;
    this.$emit('clickHandler', obj);
    // } else {
    //   this.activeIndex = index;
    //   this.$emit('clickHandler', obj);
    // }
  }

  private handleMouseLeave(event: any) {
    this.isShow = false;
  }

  private created(): void {
    this.updateOriginData(this.originData);
    // this.messsageBus.off('changeToShow');
    this.messsageBus.on('changeToShow', (title: string) => {
      this.isShow = false;
      this.isShow = this.originData[0].title === title;
    });
    // this.messsageBus.off('queryAroundAdministrativeDivisions');
    this.messsageBus.on('queryAroundAdministrativeDivisions', (data: string) => {
      this.isShow = false;
    });
    this.mapDimensionality = this.$store.state.controlMoudle.mapDimensionality;
  }
  /*private destroyed(): void {
    this.messsageBus.off('queryAroundAdministrativeDivisions');
    this.messsageBus.off('changeToShow');
  }*/
}
</script>
<style lang="less" scoped>
ul,li{
  margin:0;padding:0;
}
@gisMapToolMore: '../../../../assets/img/gisUI/gisMapToolMore';
.gisMapTool-item {
  position: relative;
  width: 60px;
  // margin:0 6px;
  text-align: center;
  cursor: pointer;
  // margin-left: -10px;
}
.gisMapTool-item_hd {
  display: block;
  height: 60px;
}
.gisMapTool-item_bd {
  position: absolute;
  // left: 2px;
  // margin-top:10px;
  width: 55px;
  user-select: none;
}
.gisMapTool-item_bd--bg {
  // background: url('../../../../assets/img/gisUI/gisMapTool/dituselecterbg.png')
    // no-repeat 50% 0;
  background-position: 4px 0;
  background-size: 93%;
}
.gisMapTool-item_bd_icon {
  display: block;
  width: 60px;
  height: 60px;
  line-height: 1;
  margin: 0 auto;
}
.gisMapTool-icon--head {
  display: block;
  width: 60px;
  height: 60px;
  line-height: 1;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.gisMapTool-item_bd_item {
  position: relative;
  & > .text {
    display: none;
    background: rgba(1, 235, 245, 0.5);
    border: 1px #01ebf5 solid;
    border-radius: 2px;
    position: absolute;
    top: 9px;
    right: 54px;
    height: 42px;
    line-height: 42px;
    min-width: 130px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    z-index: 1;
  }
  &:hover {
   & > .text {
    display: block;
    background:url('@{gisMapToolMore}/dituhoverbg.png') no-repeat 0 0;
    background-size: 100% 100%;
    border:none;
    width: 218px;
    }
    
    & > ul {
      display: block;
      background: url('@{gisMapToolMore}/fhmbzhabf.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
}
.gisMapToolMore-box_item_list{
  
    display: none;
    position: absolute;
    top: 52px;
    right: 62px;
    white-space: nowrap;
    width: 178px;
    text-align: left;
    padding: 10px 16px;
    & > li {
      list-style: none;
      line-height: 50px;
      border-bottom: 1px dashed #145763;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      height: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        color: #e2d500;
      }
      & > span {
        width: 24px;
        height: 24px;
        margin: 5px;
        margin-bottom: 8px;
        display: inline-block;
        vertical-align: middle;
        background-size: 100% 100%;
      }
    }
    .borderNone {
      border-bottom: none;
    }
    .optionActive {
      color: #e2d500;;
    }
  }

</style>
