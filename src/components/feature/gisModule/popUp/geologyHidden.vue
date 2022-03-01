<template>
  <div id="GeologyHidden" class="geology-hidden">
    <ul class="pop-data-head">
      <li>
        <div class="text-title">行政区划：</div>
        <div>{{rescueData.districtname || '暂无数据'}}</div>
      </li>
      <li>
        <div>地址：</div>
        <div>{{rescueData.address || '暂无数据'}}</div>
      </li>
    </ul>
    <table class="pop-data-content">
      <tr>
        <td>
          <div class="text-title">类型：</div>
          <div class="text-inner">{{rescueData.type || '暂无数据'}}</div>
        </td>
        <td>
          <div class="text-title">危险等级：</div>
          <div class="text-inner">{{rescueData.dangerlevel || '暂无数据'}}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-title">威胁人数：</div>
          <div class="text-inner">{{rescueData.personnum || '暂无数据'}}</div>
        </td>
        <td>
          <div class="text-title">监测方式：</div>
          <div class="text-inner">{{rescueData.monitortype || '暂无数据'}}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-title">治理措施：</div>
          <div class="text-inner text-wrap" :title="rescueData.measures">{{rescueData.measures || '暂无数据'}}</div>
        </td>
        <td>
          <div class="text-title">监测负责人：</div>
          <div  class="text-inner">{{rescueData.monitorperson || '暂无数据'}}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-title">威胁对象：</div>
          <div  class="text-inner">{{rescueData.threatobject || '暂无数据'}}</div>
        </td>
        <td>
          <div class="text-title">责任人联系电话：</div>
          <div  class="text-inner">{{rescueData.monitorphone || '暂无数据'}}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="text-title">威胁户数：</div>
          <div  class="text-inner">{{rescueData.threathouseholds || '暂无数据'}}</div>
        </td>
        <td>
          <div class="text-title">威胁财产（万元）：</div>
          <div  class="text-inner">{{rescueData.threattresure || '暂无数据'}}</div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'GeologyHidden',
})
export default class GeologyHidden extends Vue {
  @Prop() public rescueData: any;
  private mounted() {
    console.log(this.rescueData);
    if (this.rescueData.dangerlevel !== '') {
      if (Number(this.rescueData.dangerlevel) === 1) {
          this.rescueData.dangerlevel = '特别危险';
      } else if (Number(this.rescueData.dangerlevel) === 2) {
          this.rescueData.dangerlevel = '重大危险';
      } else if (Number(this.rescueData.dangerlevel) === 3) {
          this.rescueData.dangerlevel = '较大危险';
      } else if (Number(this.rescueData.dangerlevel) === 4) {
          this.rescueData.dangerlevel = '一般危险';
      } else if (Number(this.rescueData.dangerlevel) === 5) {
         this.rescueData.dangerlevel = '其他';
      }
    }
  }
}
</script>
<style lang="less" scoped>
.geology-hidden {
  color: #2cf8ff;
  max-height: 280px;
  height:280px;
  // overflow: hidden;
}
.pop-data-head li {
  // border: 1px solid #2cf8ff;
  overflow: hidden;
  margin-bottom: -2px;
  // height: 40px;
  line-height: 40px;
  font-size: 26px;
  vertical-align: top;
  div {
    // float: left;
    display: table-cell;
    color:#0edbe4;
    padding-left: 10px;
  }
  .text-title{
    // text-overflow: hidden;
    white-space: nowrap;
  }
  .text-inner{
    color:#fff;
  }
  div:nth-child(2) {
    // border-left: 1px solid #2cf8ff;
  }
}
.pop-data-content {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  td {
    border: 1px solid #2cf8ff;
    padding-left: 10px;
    div {
      height: 40px;
      line-height: 40px;
      float: left;
    }
    
    .text-title{
      // text-overflow: hidden;
      white-space: nowrap;
    }
    .text-inner{
      color:#fff;
    }
  }
  .text-wrap {
    width: calc(100% - 130px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>