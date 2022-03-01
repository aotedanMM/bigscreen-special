<template>
  <div class="SwitchPathPlanning planning">
    <p class="switch_wrap">
      <span>路径规划:</span>
      <el-switch
        v-model="btnvalue"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="btnclick()"
        :active-value="true"
        :inactive-value="false"
      ></el-switch>
      <span></span>
    </p>
    <ul v-show="btnvalue">
      <li class v-for="(item,key) in getList" :key="key">
        <span class="label">{{item.name}}:</span>
        <span class="value">{{item.value}}</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { messsageBus } from '@/util/message';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'SwitchPathPlanning',
})
export default class SwitchPathPlanning extends Vue {
  @Prop({
    default: false,
  })
  public onOff?: boolean;

  @Prop({
    default: () => {
      return {};
    },
  })
  public switchInfo: any;

  public btnvalue: any = false;
  public isswitchbtnlist = false;
  // public btnlist: any = [
  //   {
  //     name: '距离',
  //     value: '200公里',
  //   },
  //   {
  //     name: '时间',
  //     value: '3小时20分钟',
  //   },
  // ];

  private get getList() {
    return [
      {
        name: '距离',
        value: this.switchInfo.distance
          ? this.switchInfo.distance + '公里'
          : '',
      },
      {
        name: '时间',
        value: this.switchInfo.time ? this.switchInfo.time : '',
      },
    ];
  }

  @Watch('onOff')
  private boolWatch(val: boolean) {
    this.btnvalue = val;
  }

  private btnclick() {
    // tslint:disable-next-line:no-debugger
    // debugger;
    // this.isswitchbtnlist = this.btnvalue === '0' ? false : true;
    this.$emit('changeHandler', this.btnvalue);
    return this.isswitchbtnlist;
  }

  private mounted() {
    // tslint:disable-next-line:no-debugger
    // debugger;
    const that: any = this;
  }
  private created() {
    this.btnvalue = this.onOff;
  }
}
</script>
<style lang="less" scoped>
@url: '../../../../assets/img/eventInfo';
.SwitchPathPlanning {
  width: 100%;
  ul {
    li {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span.label  {
        flex-shrink: 0;
        color: #0edbe4;
        width: 130px;
        margin-right: 10px;
      }
      span.value {
        flex-grow: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .switch_wrap {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      flex-shrink: 0;
      color: #0edbe4;
      width: 130px;
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less">
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
</style>