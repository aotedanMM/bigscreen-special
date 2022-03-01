
<!--地图工具箱组件-->
<template>
  <div class="gisMapToolMore-box gisMapToolMore-box--bg">
    <div class="gisMapToolMore-box_nr">
      <div
        class="gisMapToolMore-box_item"
        :data-Deployment="item.total"
        :class="[{hasMessageNO : item.total>0} , ( item.isOpen &&'gisMapToolMoreActive')]"
        v-for="(item,index) of getOption.slice(start,end)"
        :key="item.key"
        @click="fnClickHandler(item,index)"
      >
        <!--图标-->
        <span :class="item.iconName" class="YJ-navIcon" ></span>
        <p class="text">{{item.title}}</p>
        <!--像人员密集场所的做的菜单-->
        <ul class="gisMapToolMore-box_item_list" v-if="item.list">
          <li
            v-for="(single,key) in item.list"
            :class="[key == item.list.length - 1 ? 'borderNone' : '', single.isOpen &&'optionActive']"
            :key="key"
            @click.stop="fnClickHandler(single)"
            title
          >
            <span :class="single.iconName"></span>
            {{single.title}}
          </li>
        </ul>
      </div>
    </div>
    <div class="gisMapToolMore-box_more" v-if="options.length > 11" @click="fnClickMore">
      <span class="YJ-navIcon YJ-navIcon-more" v-if="!isShow"></span>
      <span class="YJ-navIcon YJ-navIcon-back" v-else></span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import '@/assets/css/gisUI/mapToolIconMore.less';
import { IMapToolItem } from '@/interface/feature/common/mapTool/MapTool.interface';
// const defaultData = [
//   {
//     iconName: 'gisMapTool-gongxiang',
//     title: '2工具箱',
//     key: 'toolBox',
//   },
//   {
//     iconName: 'gisMapTool-zhoubiantianqi',
//     title: '2周边天气',
//     key: 'surroundingWeather',
//   },
//   {
//     iconName: 'gisMapTool-yuqingxitong',
//     title: '2舆情监控',
//     key: 'publicOpinionMonitor',
//   },
//   {
//     iconName: 'gisMapTool-internet',
//     title: '互联网情报',
//     key: 'internetIntelligence',
//   },
//   {
//     iconName: 'gisMapTool-celiang',
//     title: '测量工具',
//     key: 'measuringTools',
//   },
//   {
//     iconName: 'gisMapTool-jiaotongguanzhi',
//     title: '交通管制',
//     key: 'trafficControl',
//   },
//   {
//     iconName: 'gisMapTool-daolusunhui',
//     title: '道路损毁',
//     key: 'roadDamage',
//   },
//   {
//     iconName: 'gisMapTool-huichuanimg',
//     title: '回传图像',
//     key: 'returnImage',
//   },
//   {
//     iconName: 'gisMapTool-shortCut',
//     title: '绿色通道',
//     key: 'greenChannel',
//   },
// ];

@Component({
  name: 'GisMapToolMore',
})
export default class GisMapToolMore extends Vue {
  /*@Prop({
    default: '',
  })
  public lastKey?: string;*/
  @Prop({
    default: () => [],
  })
  private options!: any;
  @Prop({ default: true }) private hasMessage?: boolean;
  private deployment: number = 2;
  private isShow: boolean = false;
  private start: number = 0;
  private end: number = 11;
  private activeIndex: number = -1;

  @Watch('options')
  private fnOptions() {
    this.init();
  }
  private fnClickHandler(obj: IMapToolItem, index: number) {
    // 此处要做选中状态
    // if (this.activeIndex === index) {
    //     this.activeIndex = -1;
    this.$emit('clickHandler', obj);
    // } else {
    //     this.activeIndex = index;
    //     this.$emit('clickHandler', obj);
    // }
  }
  private fnClickMore() {
    if (this.isShow) {
      this.start = 0;
      this.end = 11;
    } else {
      this.start = 11;
      this.end = this.options.length;
    }
    this.isShow = !this.isShow;
  }
  private init() {
    this.start = 0;
    this.end = 11;
  }

  private getTotal(pushLocationKeyArr: string[]) {
    let total = 0;
    pushLocationKeyArr.forEach((str: any) => {
      const currentTotal = this.$store.state.eventPushStore[str];
      if (currentTotal > 0) {
        total += total;
      }
    });
    return total;
  }
  // 添加选中状态(临时方案)
  /*private changedKey() {
    this.messsageBus.on('changeKey', (data: any) => {
        this.lastKey = data;
    });
  }*/
  /*private created() {
    this.changedKey();
  }*/
  private get getOption() {
    return this.options.map((item: any) => {
      if (item.pushLocationKeyArr) {
        let total = 0;
        (item.pushLocationKeyArr || []).map((key: any) => {
          const currentTotal = this.$store.state.eventPushStore[key];
          if (currentTotal > 0) {
            total += currentTotal;
          }
        });
        item.total = total;
      } else {
        item.total = 0;
      }
      return item;
    });
  }
}
</script>
<style lang="less" scoped>
@gisMapToolMore: '../../../../assets/img/gisUI/gisMapToolMore';
.gisMapToolMore-box {
  width: 52px;
  height: calc(100% - 60px);
  // padding-bottom: 46px;
  user-select: none;
  max-height: 550px;
  margin-top: 8px;
}
.gisMapToolMore-box--bg {
  background: url('@{gisMapToolMore}/ditutoolbg.png') no-repeat 50% 0;
}
.gisMapToolMore-box_nr {
  /* overflow: hidden; */
  height: 100%;
}
.gisMapToolMore-box_icon {
  display: block;
  width: 60px;
  height: 60px;
  line-height: 1;
  margin: 0 auto;
}
.gisMapToolMore-icon--head {
  display: block;
  width: 60px;
  height: 60px;
  line-height: 1;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.gisMapToolMore-box_item {
  position: relative;
  width: 100%;
  height: 50px;
  text-align: center;
  padding-top: 8px;
  box-sizing: border-box;
  cursor: pointer;
  & > .text {
    display: none;
    border-radius: 2px;
    position: absolute;
    top: -20px;
    right: 52px;
    white-space: nowrap;
    height: 42px;
    line-height: 42px;
    min-width: 200px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    padding: 0 10px;
    z-index: 10;
  }
  &_list {
    display: none;
    position: absolute;
    top: 44px;
    right: 62px;
    white-space: nowrap;
    width: 178px;
    text-align: left;
    padding: 10px 16px;
    & > li {
      list-style: none;
      line-height: 50px;
      border-bottom: 1px dashed #ccc;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      height: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        color: yellow;
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
      color: yellow;
    }
  }
  &:hover {
    & > .text {
      display: block;
      background: url('@{gisMapToolMore}/dituhoverbg.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
    & > ul {
      display: block;
      background: url('@{gisMapToolMore}/fhmbzhabf.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
}
.gisMapToolMore-box_item.hasMessageNO:before {
  content: attr(data-Deployment);
  width: 36px;
  height: 36px;
  background: red;
  position: absolute;
  top: 0;
  right: 0px;
  line-height: 36px;
  text-align: center;
  font-size: 18px;
  border-radius: 18px;
  color: #fff;
}
.gisMapToolMore-box_more {
  text-align: center;
  cursor: pointer;
  position: absolute;
  bottom: -47px;
  display: inline-block;
  height: 45px;
  width: 50px;
  text-align: center;
  border: 1px solid #01ebf5;
  background-color: rgba(48, 153, 255, 0.6);
  -webkit-box-shadow: inset 0px 0px 20px rgba(39, 228, 253, 1);
  -moz-box-shadow: inset 0px 0px 20px rgba(39, 228, 253, 1);
  box-shadow: inset 0px 0px 20px rgba(39, 228, 253, 1);
  // margin-left: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}
// .gisMapToolMore-box_item_list > li > span{
  
// }
</style>
