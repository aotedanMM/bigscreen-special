<template>
  <div id="EquipmentList" v-show="paginationTotal !== 0">
    <div class="titleBox">主要装备：</div>
    <div class="listTitleBox">
      <span class="index">序号</span>
      <span class="type">装备类型</span>
      <span class="num">装备数量</span>
    </div>
    <ul class="listContBox">
      <li v-for="(i, index) in tableData" :key="index">
        <span class="index" :title="index+pageSize*pageNo-2">{{ index+pageSize*pageNo-2 }}</span>
        <span class="type" :title="i.equiptypename">{{ i.equiptypename }}</span>
        <span class="num" :title="i.equipnum">{{ i.equipnum}}</span>
      </li>
    </ul>
    <div style="text-align:center;padding:10px 0 8px;">
      <el-pagination
        class="constomMyElPage"
        layout="prev, pager, next"
        :total="paginationTotal"
        :page-size="pageSize"
        :pager-count="5"
        :current-page="pageNo"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import disasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';

@Component({
  name: 'EquipmentList',
})
export default class EquipmentList extends Vue {
  @Prop()
  private rescueId: any;
  private paginationTotal: number = 0;
  private pageSize: number = 3;
  private tableData: any = [];
  private pageNo: any = 1;
  private handleCurrentChange(val: any) {
    this.pageNo = val;
    this.getListData();
  }
  private getListData() {
    disasterJudgeServer.rescueTeamServer
      .getEquipmentByTeamId({
        id: this.rescueId,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        resourceKey: 'equipment',
      })
      .then((res: any) => {
        this.tableData = res.data.data.list;
        this.paginationTotal = res.data.data.total;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  private created() {
    this.getListData();
  }
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#EquipmentList {
  width: 100%;
  z-index: 999;
  background-size: 100% 100%;
  .listTitleBox {
    display: flex;
    background: #07325c;
    border: 1px solid rgb(1, 132, 165);
    padding: 8px 0px;
    margin-top: -10px;

    height: 54px;
    line-height: 38px;
    font-size: 28px;
    font-weight: normal;
    color: #92edf6;
    letter-spacing: 0px;
    span {
      text-align: center;
      display: inline-block;
    }
    .index {
      width: 20%;
    }
    .type {
      width: 55%;
    }
    .num {
      width: 25%;
    }
  }
  .listContBox {
    color: #fff;
    font-size: 28px;
    margin-bottom: 10px;
    li {
      border: 1px solid #085579;
      border-top: none;
      padding: 8px 0px;
      height: 54px;
      line-height: 38px;
      span {
        display: inline-block;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .index {
        width: 20%;
      }
      .type {
        width: 55%;
      }
      .num {
        width: 25%;
      }
    }
  }
  .titleBox {
    padding: 10px 0;
    width: 100%;
    font-size: 30px;
    color: #fff;
  }
  // /deep/ .myPagination.el-pagination {
  //   margin-top: 10px;
  //   button,
  //   button:disabled {
  //     background-color: transparent;
  //     color: #fff;
  //   }
  //   span {
  //     color: #fff;
  //   }
  //   .el-pager li {
  //     background: rgba(255, 255, 255, 0);
  //     color: #fff;
  //     border: 1px solid #b4c0c5;
  //     margin: 0px 2px;
  //   }
  //   .el-pager li.active {
  //     color: #409eff;
  //     cursor: default;
  //   }
  //   .el-input__inner {
  //     background-color: rgba(20, 212, 250, 0);
  //     color: #fff;
  //     border: none;
  //     border-bottom: 1px solid #fff;
  //   }
  // }
}
</style>
