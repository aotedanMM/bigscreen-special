<template>
  <div
    class="eventInfoPop expert"
    ref="eventInfoPop"
    :style="'height: ' + 720 + 'px;'"
  >
  <div class="eventInfoPop_title">
    <div class="eventInfoPop_title_txt title-panel">
     现场指挥部详情
    </div>
  <div class="eventInfoPop_title_close" @click="close()"></div>
</div>
  <div class="FieldCommand-wrap">
    <div class="FieldCommand-container">
      <div class="data member" v-for="(item, index) in pageData.memberList" :key="index">
        <!-- <i></i> -->
        <span>{{item.duties}}</span>
        <span class="unit">{{item.name}}</span>
        <span  class="unit">
          {{ (item.phone && item.phone.replace(
          /^(\d{3})\d{4}(\d+)/,
          '$1****$2',
          )) || '- -' }}
        </span>
        <i class="tel" v-if="item.phone" @click="clickForPhone(item.name, item.phone)"></i>
      </div>
      <div class="position">
        <!-- <i></i> -->
        <span>位置</span>
        <span class="unit">{{pageData.address}}</span>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'siteTeamPopup',
  components: {},
})
export default class SiteTeamPopup extends Vue {
  private pageData: any = {
    header: '蒋科长',
    subHeader: '蒋科长',
    member: [
      {
        duty: '成员',
        name: '罗新民',
        tel: '13111122222',
      },
      {
        duty: '成员',
        name: '罗新民',
        tel: '13111122222',
      },
      {
        duty: '成员',
        name: '罗新民',
        tel: '13111122222',
      },
      {
        duty: '成员',
        name: '罗新民',
        tel: '13111122222',
      },
      {
        duty: '成员',
        name: '罗新民',
        tel: '13111122222',
      },
    ],
    position: '昆山镇xx村南300米',
  };
  // 进入处置 关闭弹窗
  private closeFunc() {
    const self: any = this;
    self.close();
  }
  // 拨打电话
  private clickForPhone(name: any, tel: any) {
     this.messsageBus.emit('showCallup', true, {}, tel, '', name);
  }
  private mounted() {
  const that: any = this;
  this.pageData = that.data;
  }
}
</script>
<style scoped lang="less">
@imgUrl: '../../../../assets/img/forestFire';
@url: '../../../../assets/img/eventInfo';
@popdialog: '../../../../assets/img/popdialog';
@closebg: '../../../../assets/img/halfScreen/eventAndTopics';

.eventInfoPop {
  width: 560px;
  height: 400px;
  z-index: 4;
  cursor: default;
  color: #fff;

  // 组件内样式调整
  .buttonListCon {
    padding-top: 16px;
  }
  &_title {
    background: url('@{popdialog}/popdialog-title.png') no-repeat;
    background-size: 100% 65px;
    height: 65px;
    line-height: 65px;
    &_close {
      position: absolute;
      top: 2px;
      right: 8px;
      width: 80px;
      height: 35px;
      background: url('@{closebg}/eventAndTopics_close.png') no-repeat 0 -3px;
      background-size: 100% 100%;
    }
    &_close:hover {
      background: url('@{closebg}/eventAndTopics_close_h.png') no-repeat 0 -3px;
    }
    &_txt {
      text-overflow: ellipsis;
      overflow: hidden;
      padding-left: 28px;
    }
  }
  .FieldCommand-wrap {
    background: url('@{popdialog}/businessImgBackContent.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    padding: 20px 0 0 2px;
    height: calc(100% - 90px);
  .FieldCommand-container {
    width: 96%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    padding-left: 16px;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-image: linear-gradient(
        0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%
      );
    }
    &::-webkit-scrollbar-track {
      border-radius: 0;
      border-radius: inherit;
      background-color: transparent;
    }
    .data {
      color: #bbd0dc;
      font-size: 28px;
      padding: 2px;
      display: flex;
      cursor: default;
      align-items: center; // 居中
      &:nth-child(2n) {
        background: url('@{popdialog}/list_nowNew.png') no-repeat;
        background-size: 100% 100%;
      }
        .unit {
          color: #fff;
        }
      i {
        width: 30px;
        height: 36px;
        display: block;
        float: left;
        margin-left: 16px;
        margin-right: 9px;
      }
      span {
        &:nth-child(1) {
          display: inline-block;
          color: #0edbe4;
          width: 154px;
          padding-left: 10px;
        }
        &:nth-child(2) {
          width: 140px;
          text-align: center;
        }
      }
      .header-name {
        color: #fff8a5;
      }
    }
    .header {
      i {
        background: url('@{imgUrl}/header.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .member {
      span {
        &:nth-child(3) {
          text-align: left;
          display: block;
          float: left;
        }
        &:nth-child(4) {
          text-align: left;
          display: block;
          float: left;
          text-indent: 13px;
          line-height: 36px;
        }
      }
      i {
        background: url('@{imgUrl}/member.png') no-repeat;
        background-size: 100% 100%;
      }
      .tel {
        width: 20px;
        height: 21px;
        margin-left: 7px;
        cursor: pointer;
        background: url('../../../../assets/img/eventInfo/telphoon.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .position {
      color: #bbd0dc;
      font-size: 28px;
      padding: 2px;
      display: flex;
      cursor: default;
      i {
        background: url('@{imgUrl}/position.png') no-repeat;
        background-size: 100% 100%;
      }
      span {
        &:nth-child(1) {
          display: inline-block;
          color: #0edbe4;
          line-height: 50px;
          width: 154px;
          padding-left: 10px;
        }
        &:nth-child(2) {
          display: flex;
          width: 346px;
        }
      }
    }
  }
  }
}
</style>
