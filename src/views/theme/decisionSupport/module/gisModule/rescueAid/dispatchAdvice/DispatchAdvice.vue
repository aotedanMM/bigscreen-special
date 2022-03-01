<template>
  <div class="DispatchAdvice">
    <AccordionPop
      :title = "title"
      :listData = "staticData"
      :groupClick = "groupClick"
      :itemClick = "itemClick"
    ></AccordionPop>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { districtServer } from '@/api/installServer';
import { rescueAssistanceServer } from '@/api/feature/RescueAssistance/installRescueAssistanceServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { Draggable } from 'draggable-vue-directive';
import AccordionPop from '@/views/theme/decisionSupport/common/AccordionPopModule.vue';

@Component({
  name: 'DispatchAdvice',
  directives: {
    Draggable,
  },
  components: {
    AccordionPop,
  },
})

export default class DispatchAdvice extends Vue {
  private title = '调拨建议';
  private staticData: any = [];
  private eventInfo: any = this.$store.state.eventPushStore;

  // 获取gis组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.rescueHelpFactory.getComponent('teamDispatchAdvice');
    return component;
  }
  private created() {
    this.getDispatchAdviceData();
  }

  private mounted() {
    this.init();
  }

  // 监听当前事件改变
  @Watch('$store.state.eventPushStore.eventId')
  private refreshData(val: any) {
    if (val) {
      this.getComponent().clear();
      this.getComponent().closePopup();
      this.getDispatchAdviceData();
    }
  }
  // 初始化弹窗
  private init() {
    const component = this.getComponent();
    component.on('firePopup_rescue_dispatch_advice', (event: any) => {
        const param = {
          that: this,
          popupId: 'popup_rescue_dispatch_advice', // 监听id，必须
          moduleTypeID: 'disasterJudgeResource', // 模块id，必须
        };
        const popUpTemplate = new renderpopUpTemplate();
        popUpTemplate.getParams(param);
        popUpTemplate.onShowPopup(event);
      });
  }

  // 调第三方服务接口获取调拨建议所有数据
  private getDispatchAdviceData() {
    this.staticData = [];
    const optsTest = {
      location: [
        this.eventInfo.eventLocation.EventLon,
        this.eventInfo.eventLocation.EventLat,
      ],
      level: '1',
    };
    const self = this;
    districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
      const optsScheduling = {
        typecode: '',
        adcode: dataDis.data[0].code,
        point: [
          this.eventInfo.eventLocation.EventLon,
          this.eventInfo.eventLocation.EventLat,
        ],
      };
      rescueAssistanceServer
        .getScheduling(optsScheduling)
        .then((res: any) => {
          const list: any = [];
          Object.keys(res).forEach((item: any) => {
            list.push(
              Object.assign({
                  title: this.getTitle(item),
                  team: res[item].teamNum,
                  persoanls: res[item].totalNum,
                  batchNum: Number(item),
                  children: this.getChildren(item, res[item].arr),
                  checked: false,
              }, res[item]),
            );
          });
          this.staticData = list;
          this.staticData[0].children.forEach((child: any) => {
            this.getComponent().addTeamOnMap(child, this.staticData[0].batchNum);
            this.getComponent().fitMapView();
          });
          this.updataRightList(this.staticData[0].children, this.staticData[0].batchNum);
      });
    });
  }
  // 将左侧的统计面版的二级菜单数据处理成组件需要的格式
  private getChildren(index: any, data: any) {
    if (index === '1') {
      data.forEach((item: any) => {
        item.title = item.key;
        item.persoanls = item.num;
        item.isActive = true;
      });
    } else {
      data.forEach((item: any) => {
        item.title = item.key;
        item.persoanls = item.num;
        item.isActive = false;
      });
    }
    return data;
  }

  // 数据变化后更新右侧的列表数据
  private updataRightList(list: any, batchNum: any) {
    const data = {
      list,
      batchNum,
    };
    this.messsageBus.emit('updataDispatchAdviceList', data);
  }

  /*
  * 将获取的批次数转换成中文的第几批次
  **/
  private getTitle(num: any) {
    if (num === 0) {
      return '零';
    }
    for (let i = num.length - 1; i >= 0; i--) {
      num = num.replace(',', ''); // 替换Num中的“,”
      num = num.replace(' ', ''); // 替换Num中的空格
    }
    if (isNaN(num)) {
      // 验证输入的字符是否为数字
      // alert("请检查小写金额是否正确");
      return;
    }
    // 字符处理完毕后开始转换，采用前后两部分分别转换
    const part = String(num).split('.');
    let newchar = '';
    // 小数点前进行转化
    for (let i = part[0].length - 1; i >= 0; i--) {
      if (part[0].length > 10) {
        // alert("位数过大，无法计算");
        return '';
      } // 若数量超过拾亿单位，提示
      let tmpnewchar = '';
      const perchar = part[0].charAt(i);
      switch (perchar) {
        case '0':
          tmpnewchar = '零' + tmpnewchar;
          break;
        case '1':
          tmpnewchar = '一' + tmpnewchar;
          break;
        case '2':
          tmpnewchar = '二' + tmpnewchar;
          break;
        case '3':
          tmpnewchar = '三' + tmpnewchar;
          break;
        case '4':
          tmpnewchar = '四' + tmpnewchar;
          break;
        case '5':
          tmpnewchar = '五' + tmpnewchar;
          break;
        case '6':
          tmpnewchar = '六' + tmpnewchar;
          break;
        case '7':
          tmpnewchar = '七' + tmpnewchar;
          break;
        case '8':
          tmpnewchar = '八' + tmpnewchar;
          break;
        case '9':
          tmpnewchar = '九' + tmpnewchar;
          break;
      }
      switch (part[0].length - i - 1) {
        case 0:
          tmpnewchar = tmpnewchar;
          break;
        case 1:
          if (perchar) {
            tmpnewchar = tmpnewchar + '十';
          }
          break;
        case 2:
          if (perchar) {
            tmpnewchar = tmpnewchar + '百';
          }
          break;
        case 3:
          if (perchar) {
            tmpnewchar = tmpnewchar + '千';
          }
          break;
        case 4:
          tmpnewchar = tmpnewchar + '万';
          break;
        case 5:
          if (perchar) {
            tmpnewchar = tmpnewchar + '十';
          }
          break;
        case 6:
          if (perchar) {
            tmpnewchar = tmpnewchar + '百';
          }
          break;
        case 7:
          if (perchar) {
            tmpnewchar = tmpnewchar + '千';
          }
          break;
        case 8:
          tmpnewchar = tmpnewchar + '亿';
          break;
        case 9:
          tmpnewchar = tmpnewchar + '十';
          break;
      }
      newchar = tmpnewchar + newchar;
    }
    // 替换以“一十”开头的，为“十”
    if (newchar.indexOf('一十') === 0) {
      newchar = newchar.substr(1);
    }
    // 替换以“零”结尾的，为“”
    if (newchar.lastIndexOf('零') === newchar.length - 1) {
      newchar = newchar.substr(0, newchar.length - 1);
    }
    return `第${newchar}批次`;
  }

  // 左侧手风琴统计面版一级菜单点击回调事件
  private groupClick(data: any) {
    this.getComponent().clear();
    data.children.forEach((child: any) => {
      child.isActive = true;
      this.getComponent().addTeamOnMap(child, data.batchNum);
      this.getComponent().fitMapView();
    });
    this.updataRightList(data.children, data.batchNum);
  }

 // 左侧手风琴统计面版二级菜单点击回调事件
  private itemClick(item: any, child: any) {
    if (child.isActive) {
      this.getComponent().addTeamOnMap(child, item.batchNum);
      this.getComponent().fitMapView();
    } else {
      this.getComponent().removeTeam(child.key, item.batchNum);
      this.getComponent().fitMapView();
    }
    this.updataRightList(item.children, item.batchNum);
  }

  // 切换模块后,需要销毁gis弹窗和高亮点
  private beforeDestroy() {
    this.getComponent().clear();
    this.getComponent().closePopup();
  }
}
</script>

<style lang="less" scoped>
.DispatchAdvice {
  // position: absolute;
  // top: 220px;
  // left: 60px;
  // height: 500px;
  // width: 300px;
  // z-index: 9999;
  // color: #fff;
  // font-size: 24px;
    position: absolute !important;
  top: 225px;
  left: 75px;
  z-index: 5;
}
li div {
  height: 40px;
  cursor: default;
}
.children div {
  padding-left: 30px;
}
.selected .item {
  background-color: lightblue;
}
.checked .children {
  background-color: lightcoral;
}
</style>
