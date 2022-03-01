<!--按钮列表组件-->
<template>
  <div class="buttonListCon"  style="">
    <template v-for="(item,key) in btnFilter">
      <span
        :key="key"
        :class="buttonList[item].className"
        @click="toParentClick(item)"
        v-if="showBtnhaikang || showBtndetection || (buttonList[item].text !== '企业视频' && buttonList[item].text !== '实时监测')"
      >{{buttonList[item].text}}
      </span>
    </template>
  </div><!--buttonListCon end-->
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import { messsageBus } from '@/util/message';
// import popDataDeal from './dataDeal/popDataDeal';
import { buttonList } from './dataDeal/buttonList' ;

@Component({
  name: 'popButtonList',
  // mixins: [popDataDeal],
})
export default class PopButtonList extends Vue {
  public buttonList = buttonList;
  @Prop()
  private btnFilter: any;
  @Prop()
  private listData: any;
  private showBtnhaikang: boolean = false;
  private showBtndetection: boolean = false;

  private created() {
    // to do
    // console.log('哈哈buttonList:', this.buttonList );
    // console.log('呵呵btnFilter:', this.btnFilter );
  }

  /* private toParentClick(item: any) {
    if (this.$parent.$parent) {
      this.$parent.$parent.buttonListClick(item);
    } else {
      this.$parent.buttonListClick(item);
    }
  } */
  private toParentClick(item: any) {
    console.log('测试' + item);
    this.$emit('buttonListClick', item);
  }
  private mounted() {
    const that = this;
    // to do
    // console.log('呵呵6666btnFilter:', this.btnFilter );
  }
  @Watch('listData')
  private getlistData(val: any) {
    if (val.haikangflag === '1') {
      this.showBtnhaikang = true;
    }
    if (val.detectionflag === '1') {
      this.showBtndetection = true;
    }
  }
}
</script>
<style lang="less" scoped>
@popdialog: '../../../../assets/img/popdialog';
.buttonListCon {
  padding: 0 30px;
  text-align: right;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  .popBtn {
    display: inline-block;
    width: 103px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    // font-size: 16px;
    font-family: 'Microsoft YaHei';
    color: #a0f4fd;
    text-transform: uppercase;
    -moz-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    -webkit-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    -ms-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    z-index: 136;
    background: url('@{popdialog}/zhoubian_icon.png') no-repeat;
    background-size: 100% 100%;
    margin-left: 10px;
    &:hover{
      background-image: url('@{popdialog}/zhoubian_icon_active.png');
      color:#fff;

    }
  }
  .popBtn:last-child{
    margin-right: 30px;
  }

  .pathPlanning,
  .realTime,
  .aroundVideo,
  .companyVideo,
    .aroundAnalysis {
      display: block;
      float: right;
      width: 118px;
      height: 40px;
      border: solid 1px #02e9d5;
      color: white!important;
      padding: 0 5px;
      margin: 10px 1px 1px 10px;
      font-size: 28px;
      line-height: 40px;
      cursor: pointer;
      background: transparent;
    }

}

</style>
