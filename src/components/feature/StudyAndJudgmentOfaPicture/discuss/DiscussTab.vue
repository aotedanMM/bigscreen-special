<template>
  <div class="DiscussTab">
    <span  class="DiscussTab_span f-tit-h2" v-for='(item, index) of tabList' 
          @click="handleTab(item,index)"
          :class="{dengjihoverbglan:item.checked}"
          :key='item.title + index'>{{item.title}}{{company}}</span>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import EventConfigRegistry from '@/util/eventConfigRegistry.js';
@Component({
    name: 'DiscussTab',
})
export default class DiscussTab extends Vue  {
  private tabActive: number = 0;
  private tabList: any[] = [];
  private company: string = 'km';
  private mapType: any;
  private tabListNewArr: any = [];
  private handleTab(item: string, index: number) {
    // this.$store.state.controlMoudle.exprienceCircle = index;
    // this.tabActive = index;
    // this.$parent.tabList(item);

    if (this.mapType === 0) { // 经验圈
      this.handleTabClickByRadius(item, index);
    } else if ( this.mapType === 1 ) { // 烈度圈
        this.handleTabClickByLiedu(item, index);
    }
  }

  /**
 * 经验圈的tab点击，这个是单选
*/
  private handleTabClickByRadius(tabItem: any, index: number) {
      if (this.tabList[index].checked) { // 当前经验圈已经选中
          return;
      }

      // const curOriTablist: any = [];
      // this.tabList = [];
      // this.tabList.forEach((fitem: any, findex: number) => {
      //     // const newItem = {
      //     //   ...fitem,
      //     // }
      //     if (findex === index) {
      //         fitem.checked = true;
      //     } else {
      //         fitem.checked = false;
      //     }
      // });
      // this.tabList = curOriTablist;
      // 拿出当前affectRanges找那个的数组的最后一个用来做研判用
      const selectedIndex = index; // 当前选中的经验圈的数组的下标
      const selectedRange = tabItem;
      // 往DataFilterControl.ts 的geometry中存放数据
      const geoStrObj = {
        filter: {
          districtCode: '', // "370686"
          geometry: JSON.stringify(selectedRange.geometry),
        },
        zhypGeoType: {
          key: 'jyqYp',
          value: {
            indexArr: [selectedIndex],
            rangeArr: [JSON.parse(JSON.stringify(selectedRange))],
            // affectRanges:
          },
        },
      };
      this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
      // this.$forceUpdate(); // 强制刷新页面选中效果
      // this.tabListNewArr = [];
      // this.tabListNewArr.push(tabItem);
      // this.messsageBus.emit('tabItem', tabItem);
      // 给父组件传值
      // this.$parent.tabList(this.tabListNewArr, this.tabList);

  }

  /**
 * 烈度圈的tab点击，这个是多选
*/
  private handleTabClickByLiedu(tabItem: any, index: number) {
      // 如果烈度圈都不选中是不可以的，即烈度圈当前只有一个选中，且选中的恰好为当前点击的
      var checkedLastIndex = -1;
      var checkedCount = 0;
      this.tabList.forEach((fitem: any, findex: number) => {
          if (fitem.checked) {
              checkedCount ++;
              checkedLastIndex = findex;
          }
      });

      if ((checkedCount === 1) && (checkedLastIndex === index)) {
          return ;
      }

      const selectedIndexArr: any = [];
      const geometryList: any = [];
      this.tabListNewArr = [];
      this.tabList.forEach((fitem: any, findex: number) => {
          if (findex === index) {
              fitem.checked = !fitem.checked;
          }
          if (fitem.checked) {
              this.tabListNewArr.push(this.tabList[findex]);
              geometryList.push(fitem.geometry);
              selectedIndexArr.push(findex);
          }
      });
      // 当前选中的geometry做研判
      const unionGeometry = this.getComponent_Influence().unionGeometry(geometryList);
      // 往DataFilterControl.ts 的geometry中存放数据
      const geoStrObj = {
        filter: {
          districtCode: '', // "370686"
          geometry: JSON.stringify(unionGeometry),
        },
        zhypGeoType: {
          key: 'ldqYp',
          value: {
            indexArr: selectedIndexArr,
            rangeArr: this.tabListNewArr,
            // affectRanges:
          },
        },
      };
      this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
      this.$forceUpdate(); // 强制刷新页面选中效果
      // 给父组件传值
      // this.$parent.tabList(this.tabListNewArr, this.tabList);
  }

  // 监听烈度圈：1 ; 经验圈：0
  private changeQuan() {
    this.getComponent().unload(); // 重新定位清除已经查询的结果
    const mapType = this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ? 0 : 1;
    this.mapType = mapType;
    if ( mapType === 0 ) {
      this.company = 'km';
      this.getEventInfoWrapper(mapType);
    } else if ( mapType === 1 ) {
      this.company = '';
      this.getEventInfoWrapper(mapType);
    }
  }

  // 数据过滤条件发生更改
  @Watch('$store.state.dataFilterControl.filter')
  private setGeometryFn(newVal: any, oldVal: any) {
    this.handleQueryFilterChange();
  }
  // 获取烈度圈、经验圈对应数值
  private async getEventInfoWrapper(key: number) {
    const eventInfoWrapper: any = this.$ioc.resolve('eventInfo');
    if (eventInfoWrapper) {
      const eventData = eventInfoWrapper.getRanges(); // 这个方法执行之前，地图必须绘制了圈（烈度或者经验）
      if (key === 1) {
        // this.tabActive = 0;
        for (const i of eventData) {
          switch (i.level) {
            case 5:
              i.title = 'Ⅴ';
              break;
            case 6:
              i.title = 'Ⅵ';
              break;
            case 7:
              i.title = 'Ⅶ';
              break;
            case 8:
              i.title = 'Ⅷ';
              break;
            case 9:
              i.title = 'Ⅸ';
              break;
          }
        }
      }
      this.tabList = eventData;
      this.tabListNewArr = [];
      // this.handleTab(this.tabList[this.tabActive], this.tabActive);
      if (this.mapType === 0) { // 经验圈
          // 初始化经验圈选中最大值
          const selectedRageIndex = this.$store.state.dataFilterControl.zhypGeoType.value.indexArr[0];
          // this.handleTab(this.tabList[selectedRageIndex], this.tabList.length - 1);
          this.tabList[selectedRageIndex].checked = true;
          this.tabListNewArr = this.tabList[selectedRageIndex];
          this.$forceUpdate(); // 强制刷新页面选中效果
      } else if ( this.mapType === 1 ) { // 烈度圈
          // 初始化烈度圈全部选中
          const selectedArrIndex = this.$store.state.dataFilterControl.zhypGeoType.value.indexArr;
          this.tabList.forEach((fitem: any, findex: number) => {
            if (selectedArrIndex.includes(findex)) {
              fitem.checked = true;
              this.tabListNewArr.push(fitem);
            }
          });
          this.$forceUpdate(); // 强制刷新页面选中效果
      }
      // 给父组件传值
      this.$parent.tabList(this.tabListNewArr, this.tabList);
    }
  }

  // 获得当前的研判类型，并且触发初步研判首页统计查询数据
  private handleQueryFilterChange() {
    // 获得当前的研判类型
    let curFilterKeyType = '';
    if (this.$store.state.dataFilterControl.zhypGeoType && this.$store.state.dataFilterControl.zhypGeoType.key) {
      curFilterKeyType = this.$store.state.dataFilterControl.zhypGeoType.key;
    }
    if ((curFilterKeyType === 'jyqYp') || (curFilterKeyType === 'ldqYp')) { // 当前处于经验圈研判或者烈度圈研判
      this.changeQuan();
    } else { // 当前处于河流研判、缓冲区研判等
      // 这个数组仅仅是为了兼容以前的逻辑
      const tmpArr = [
        {
          level: 0,
          title: 0,
          districtCode: '',
          geometry: '',
          checked: true,
        },
      ];
      // 调用父组件的方法，触发数据查询逻辑
      this.$parent.tabList(tmpArr, tmpArr, true);
    }
  }
  private created() {
    this.handleQueryFilterChange();
  }
  // 联动gis方法 开始
  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.disasterJudgeFactory.getComponent('disasterJudgeResource');
    }
    return component;
  }
   private getComponent_Influence() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('influence');
    return component;
  }
}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/DiscussTab.less');  
</style>
