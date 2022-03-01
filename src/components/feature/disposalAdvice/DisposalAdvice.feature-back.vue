// 我不要了！
<template>
  <div class="container">
    <!-- <div
      class="command-btn"
      v-if="false"
      :class="{'btn-on':stateFlag === true,'btn-off':stateFlag === false}"
      @click.stop="changeStateFlag"
    ></div>-->
    <el-scrollbar class="cmp-scrollbar-y" style="height:100%">
      <ul class="ulContainer">
        <li
          class="liContainer"
          v-for="(item,index) of data"
          :key="index"
          @click.stop="openPDFHandler(item,index)"
        >
          <span class="circle-dot"></span>
          <span class="liContent">{{item.title}}</span>
          <!--  :title="item.title" -->
        </li>

        <template v-if="data.length===0">
          <div class="ulNoData">暂无建议</div>
        </template>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IDisposalAdvice } from '@/interface/feature/earthquake/DisposalAdvice.interface';

@Component
export default class DisposalAdvice extends Vue {
  @Prop({
    default: () => [],
  })
  public data!: IDisposalAdvice[];

  private stateFlag = true;

  private changeStateFlag() {
    this.stateFlag = !this.stateFlag;
  }
  private openPDFHandler(item: IDisposalAdvice, index: number) {
    console.log(item);
  }
}
</script>
<style scoped lang="less">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.container {
  height: 100%;
  position: relative;
  padding: 15px;

  .command-btn {
    cursor: pointer;
    width: 65px;
    height: 25px;
    border: 1px solid #02fff6;
    border-radius: 10px;
    position: absolute;
    top: -29px;
    right: 25px;
  }

  .btn-on:before,
  .btn-off:before {
    content: '';
    display: inline-block;
    position: absolute;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    background: #02fff6;
  }

  .btn-on {
    &:before {
      left: -1px;
      top: -1px;
    }
  }

  .btn-off {
    &:before {
      right: -1px;
      top: -1px;
    }
  }

  .ulContainer {
    height: 100%;
    overflow-y: auto;

    .liContainer {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: flex-start;
      align-content: center;
      align-items: center;

      .circle-dot {
        width: 18px;
        height: 18px;
        background: url('../../../assets/img/disposalAdvice/dot.png') no-repeat;
        margin-right: 10px;
      }

      .liContent {
        height: 60px;
        line-height: 60px;
        font-size: 28px;
        color: #bdebef;
        cursor: pointer;
        max-width: calc(100% - 42px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .ulNoData {
      padding-top: 10%;
      font-size: 28px;
      color: #bdebef;
      text-align: center;
    }
  }
}
.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
  // margin-right: -18px!important; 
}
</style>