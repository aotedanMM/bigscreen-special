<template>
  <!-- 河网水系入口页面 -->
  <div class="panelPublicDefault RiverWaterSystemBox">
    <ZoomBtn></ZoomBtn>
    <div class="panelPublicDefault_hd">
      <span class="title-panel">河网水系</span>
    </div>
    <div class="panelPublicDefault_bd">
      <div class="riverTypeList">
        <p
          v-for="(item,index) in riverTypeList"
          :key="index"
          @click="handleShowRiverList(item)"
          :class="item.checked?'active':''"
        >
        <i class="icon" :class="item.icon"></i>
        <span class="label f-txt-com">{{item.name}}</span>
        <span class="total f-number">{{item.total}}</span>
        <span class="unit">{{item.unit}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { riverWaterSystemServe } from '@/api/installServer';
import ZoomBtn from '../../flood/ZoomBtn.vue';  // 导入最小化组件

@Component({
  name: 'RiverWaterSystem',
  components: { ZoomBtn },
})
export default class RiverWaterSystem extends Vue {
  private riverTypeList: any = [
    {
      key: 'majorRiver',
      name: '重点河流',
      checked: false,
      isMajorRiver: 1,
      icon: 'majorRiverIcon',
      total: 0,
      unit: '条',
    },
    {
      key: 'otherRiver',
      name: '其他河流',
      checked: false,
      isMajorRiver: 0,
      icon: 'otherRiverIcon',
      total: 0,
      unit: '条',
    },
  ];
    // 获取河流条数
  public async getStatImportantInfo() {
    const resData: any = await riverWaterSystemServe.getStatImportantInfo();
    this.riverTypeList.map((item: any) => {
      if (item.key === 'majorRiver') {
        item.total = resData.data.majorRiverTotal;
      } else if (item.key === 'otherRiver') {
        item.total = resData.data.otherRiverTotal;
      }
    });
  }
  private created() {
    this.getStatImportantInfo();
    // 如果列表关闭
    this.messsageBus.on('closeRiverPanel', () => {
        this.riverTypeList.map((item: any) => {
            item.checked = false;
        });
    });
  }
  // 点击河流类型触发河流面板
  private handleShowRiverList(item: any) {
    this.riverTypeList.map((singleItem: any) => {
      if (singleItem.key === item.key) {
        item.checked = !item.checked;
      } else {
        singleItem.checked = false;
      }
    });
    const params = {
      isShow: item.checked,
      isMajorRiver: item.isMajorRiver,
      name: item.name,
    };
    this.$store.commit('mapTools/changeShowRiverList', params);
  }


  private beforeDestroy() {
    const params = {
      isShow: false,
      isMajorRiver: null,
      name: '',
    };
    this.$store.commit('mapTools/changeShowRiverList', params);
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@popPath: '../../../../assets/img/gisModule/gisLayerPanel/layerPopup';
.RiverWaterSystemBox {
  width: 100%;
  .panelPublicDefault_bd {
    padding: 0;
  }
  .riverTypeList {
    display: flex;
    flex-direction: column;
    padding-top: 15px;
    p {
      position: relative;
      display: flex;
      align-items: center;
      height: 70px;
      font-size: 28px;
      font-family: 'myYahei';
      cursor: pointer;
      color: #e8f4fe;
      padding: 0 15px;
      .icon {
        display: inline-block;
        width: 50px;
        height: 50px;
        margin-right: 10px;
        &.majorRiverIcon {
          background: url('@{popPath}/majorRiverIcon.png') no-repeat;
          background-size: 100% 100%;
        }
        &.otherRiverIcon {
          background: url('@{popPath}/otherRiverIcon.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .label {
        flex: 1;
        background: url('@{popPath}/riverType_bg.png') no-repeat;
        background-size: 100% 100%;
        padding: 10px 15px;
      }
      .total {
        font-weight: normal;
        color: #fff000;
      }
      .unit {
        margin: 0 10px;
      }
      &:hover,
      &.active {
        .label {
          color: #fff000;
        }
      }
    }
  }
}
</style>
