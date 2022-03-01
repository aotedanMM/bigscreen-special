<template>
  <div class="GisEarthQuakeIntensity">
    <div class="GisEarthQuakeIntensity-title">{{currentPage === 'ComputePage' ? '地震烈度' : '灾损评估'}}</div>
    <span class="halflist-back" @click="handleBackParent"></span>
    <div class="GisEarthQuakeIntensity-content">
      <transition
                name="custom-classes-transition"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                mode="out-in"
              >
        <component :is="currentPage" :resultData="resultData"></component>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { gisEarthQuakeIntensity } from '@/api/installServer';
import ComputePage from './components/computePage.vue';
import ResultsPage from './components/resultsPage.vue';
@Component({
  name: 'GisEarthQuakeIntensity',
  components: {
    ComputePage,
    ResultsPage,
  },
})
export default class GisEarthQuakeIntensity extends Vue {
  private currentPage = 'ComputePage';
  private resultData: any = []; // 结果集合
  // 获取区域名称 暂时不用
  // private async getAreaName() {
  //   await gisEarthQuakeIntensity.getAreaData().then((res: any) => {
  //     this.areaList = [];
  //     res.data.area.forEach((item: any) => {
  //       if (item.id.indexOf('0000') >= 0) {
  //         this.areaList.push({
  //           id: item.id,
  //           value: item.tag.districtname,
  //           label: item.tag.districtname,
  //           children: [],
  //         });
  //       }
  //     });

  //     res.data.area.forEach((item: any) => {
  //       if (item.id.indexOf('0000') < 0 && item.id.substring(item.id.length - 2, item.id.length) === '00') {
  //         this.areaList.forEach((jtem: any, jndex: any) => {
  //           if (item.id.substring(0, 2) === jtem.id.substring(0, 2)) {
  //             this.areaList[jndex].children.push({
  //               id: item.id,
  //               value: item.tag.districtname,
  //               label: item.tag.districtname,
  //               children: [],
  //             });
  //           }
  //         });
  //       }
  //     });
  //     res.data.area.forEach((item: any) => {
  //       if (item.id.substring(item.id.length - 2, item.id) !== '00') {
  //         this.areaList.forEach((jtem: any, jndex: any) => {
  //           jtem.children.forEach((sstem: any, ssdex: any) => {
  //             if (item.id.substring(0, 4) + '00' === sstem.id) {
  //               this.areaList[jndex].children[ssdex].children.push({
  //                 id: item.id,
  //                 value: item.tag.districtname,
  //                 label: item.tag.districtname,
  //               });
  //             }
  //           });
  //         });
  //       }
  //     });
  //   });
  // }

  // 初始化地图
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('earthQuakeIntensity');
    return component;
  }

  // 返回一级页面
  private handleBackParent() {
    this.$emit('tobackParent');
  }
  private created() {
    this.messsageBus.on('computeResult', (data: any) => {
      this.resultData = data;
      this.changePage('ResultsPage');
    });
  }
  // 更换页面组件
  private changePage(val: string) {
    this.currentPage = val;
  }
  private beforeDestroy() {
    this.changePage('ComputePage');
    this.getComponent().clear();
        // 获取父级元素
    const el: any = document.getElementById('right_function_box');
    if (el) {
      // 设置父级元素宽度
      el.style.width = '390px';
    }
  }
}
</script>
<style scoped lang="less">
@imgPath: '../../../../assets/img/gisModule/legendPlanel';
.GisEarthQuakeIntensity {
  position: relative;
  .GisEarthQuakeIntensity-content {
    margin-top: 55px;
    margin-left: 16px;
  }
  .GisEarthQuakeIntensity-title {
    display: block;
    width: 61%;
    font-size: calc(16px * 1.5);
    font-weight: 600;
    padding-left: 28px;
    line-height: 32px;
    font-family: 'myHeiti';
    font-style: italic;
    background:-webkit-linear-gradient(top,#f5f7c3 10%,#00e4ff);
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    letter-spacing: -1px;
  }
  .halflist-back {
    width: 61px;
    height: 24px;
    position: absolute;
    top: 10px;
    left: 329px;
    color: #338af8;
    cursor: pointer;
    z-index: 1;
    background: url('../../../../assets/img/default/panel/toBack.png') no-repeat
      0px 70%;
    background-size: 100% 100%;
    &:hover {
      background-image: url('../../../../assets/img/default/panel/toBack_h.png');
    }
  } 
}
</style>
