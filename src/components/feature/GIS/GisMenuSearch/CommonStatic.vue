<!-- 统计-->
<template>
    <div class="team-total" v-if="commonStaticShow">
        <div class="team-total-title-title">
            <a href="javascript:;" class="detail-container-close" @click="detailclose"></a>
        </div>
        <div class="team-total-detailContent">
            <div class="team-total-detail-item" v-for="(item , index) in commonStaticData" :key="index">
                <p>{{item.title}}：</p>
                <p>{{item.number}}</p>
                <p>{{item.unit}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
    @Component({
        name: 'CommonStatic',
        components: {
        },
    })
    export default class CommonStatic extends Vue {
        @Prop({default: () => [
            {
                title: '队伍',
                number: '345',
                unit: '支',
            },
            {
                title: '总人数',
                number: '34500',
                unit: '人',
            },
        ]}) public commonStaticData?: any[];
        @Prop({default : true}) public commonStaticShow?: boolean;
        // 关闭事件
        private detailclose() {
            // this.commonStaticShow = false;
        }
    }
</script>

<style scoped lang="less">
@imgurl: '../../../../assets/img/popupsborder/';
.team-total {
  bottom: -300px;
  left: 600px;
  position: absolute;
  width: 437px;
  height: 165px;
  max-height: 200px;
  z-index: 5;
  &-title-title {
    font-size: 22px;
    position: relative;
    padding-top: 15px;
    margin-left: 3px;
    color: #fff;
    .detail-container-close {
      position: absolute;
      right: 4%;
      top: 13px;
      width: 15px;
      height: 15px;
      cursor: pointer;
      background: url('@{imgurl}maptooltipclose.png') center no-repeat;
      background-size: 100% 100%;
      &::before {
        content: '';
        position: absolute;
        display: block;
        width: 25px;
        height: 25px;
        top: 18%;
        left: 1%;
        background-size: 100%;
      }
    }
  }
  &-detail-item {
    width: 100%;
    height: 69px;
    background: url('@{imgurl}qt.png') center no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    p {
      color: #fff;
    }
    p:nth-child(1) {
      width: 34%;
      padding-left: 24px;
      font-size: 24px;
      font-weight: 600;
    }
    p:nth-child(2) {
      padding-left: 10px;
      font-family: 'Impact';
      font-size: 40px;
    }
    p:nth-child(3) {
      font-size: 24px;
      padding-left: 5px;
    }
  }
}
</style>
