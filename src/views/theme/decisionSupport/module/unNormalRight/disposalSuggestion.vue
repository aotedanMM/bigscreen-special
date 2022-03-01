<!--非常态默认展示面板-处置建议-->
<template>
  <div class="container">
    <el-scrollbar class="cmp-scrollbar-y" style="height:100%">
      <ul class="ulContainer">
        <li
          class="liContainer"
          @click="changeImgIsShow()"
        >
          <span class="circle-dot"></span>
          <span class="liContent">救援力量调派预案</span>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IDisposalAdvice } from '@/interface/feature/earthquake/DisposalAdvice.interface';
@Component({
  name: 'DisposalSuggestion',
})
export default class DisposalSuggestion extends Vue {
  private changeImgIsShow() {
    this.messsageBus.emit('dealSuggest', true);
  }
}
</script>
<style lang="less" scoped>
@import url('../../../../../assets/css/variable.less');
@tableTdHover: '../../../../../assets/img/default/table/tableTdHover_bg.png';
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.container {
  height: 100%;
  position: relative;
  padding: 15px 0px 15px 25px;
  margin-right:-1px;
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

    .liContainer:hover {
      background: url(@tableTdHover);
      background-size: 100% 60px;
    }
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
        background: url('../../../../../assets/img/disposalAdvice/dot.png') no-repeat;
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
