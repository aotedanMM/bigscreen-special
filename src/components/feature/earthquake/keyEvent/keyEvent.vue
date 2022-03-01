<template>
  <div class="keyEvent">
    <el-scrollbar class="cmp-scrollbar-y" v-if="keyEventData.length" style="height:100%" >
      <ul v-loading="loading">
          <li class="qwea" v-for="(item, index) in keyEventData" :key="index" :title="item.name">
            <div>
              <span>{{item.name}}</span>
            </div>
          </li>
      </ul>
    </el-scrollbar>
    <div v-else class="nothingData--bg"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// import { KeyEventInter } from '@/interface/feature/earthquake/KeyEvent.interface.ts';
// import { leftMenuServer } from '@/api/installServer';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'KeyEvent',
})
export default class KeyEvent extends Vue {
  // 数据数组
  // @Prop() public data!: KeyEventInter[];
  private keyEventData: any = [];
  private loading: boolean = true;

  @Watch('$store.state.eventPushStore.tabSheng')
  private eventChange(val: any) {
    if (val >= 0) {
      this.getKeyEventData();
    }
  }

  private async getKeyEventData() {
    this.loading = true;
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'tabSheng';  // 次生灾害id
    const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
    if (data) {
      const content = JSON.parse(data.content);
      if (content.length > 0) {
        const jsonData = JSON.parse(content[0].data);
        this.keyEventData.push(jsonData.event);
      }
      this.loading = false;
    } else {
      this.loading = false;
    }
  }
  private created() {
    if (this.$store.state.eventPushStore.tabSheng >= 0) {
      this.getKeyEventData();
    }
  }
}
</script>

<style lang="less" scoped>
@imgUrl: '../../../../assets/img/keyEvent/';
.keyEvent {
  height: 100%;
  padding: 0px 20px 0px 25px;
  // .noDataClass {
  //   width: 100%;
  //   text-align: center;
  //   font-size: 28px;
  //   color: #bdebef;
  //   padding-top: 16%;
  // }
  ul {
    margin: 0;
    padding: 0;
    li {
      font-size: 28px;
      height: 49px;
      display: flex;
      align-items: center;
      overflow: hidden;
      margin-bottom: 20px;
      background: url('@{imgUrl}/importantInfolistpng.png') no-repeat center /
        100% 100%;
      width: 100%;
      cursor: pointer;
      > div {
        overflow: hidden;
        flex-grow: 1;
        display: flex;
        align-items: center;
        margin-right: 20px;
        > span {
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-grow: 1;
          overflow: hidden;
          color: #bdebef;
        }
      }
      &::before {
        content: '';
        width: 18px;
        height: 18px;
        margin: 0 20px;
        background: url('@{imgUrl}/dot.png') no-repeat center / 100% 100%;
        flex-shrink: 0;
      }
    }
  }
}
.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
  // margin-right: -18px!important; 
}
</style>