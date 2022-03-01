<template>
  <div id="ZhanbaoList" v-show="paginationTotal !== 0">
    <div class="titleBox">{{titleBox}}</div>
    <div class="listTitleBox">
      <span :style="'width:' + widthObj[index]" v-for="(i, index) in headObj" :key="index">{{i}}</span>
    </div>
    <ul class="listContBox">
      <li v-for="(i, index) in tableData" :key="index">
        <span :title="i[j]" :style="'width:' + widthObj[Jindex]" v-for="(j, Jindex) in dataObj" :key="Jindex+'span'">
           <template v-if='Jindex === 0'>
             {{(pageNo - 1 ) * pageSize + index + 1}}
          </template>   
          <template>
              {{i[j]}}
          </template>  
        </span>
      </li>
    </ul>
    <div style="text-align:center;padding:10px 0; ">
    <el-pagination
      class="constomMyElPage"
      layout="total, prev, pager, next"
      :total="paginationTotal"
      :page-size="pageSize"
      :pager-count="5"
      :current-page="pageNo"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import searchReosurce from '@/api/feature/searchresource/installSearchReosurce';

@Component({
  name: 'ZhanbaoList',
})
export default class ZhanbaoList extends Vue {
  @Prop({default: '主要装备'}) public titleBox?: any;
  @Prop() public rescueId?: any;
  // 表头
  @Prop({default: () => {
      return ['序号', '装备名称', '装备数量', '载水量（吨）', '泡沫量（吨）', '举升高度(米)', '干粉量(千克)'];
  }}) public headObj?: any;

  // 宽度
  @Prop({default: () => {
      return ['10%', '15%', '15%', '15%', '15%', '15%', '15%'];
  }}) public widthObj?: any;

  // 对应字段
  @Prop({default: () => {
      return [ '', 'EQUIPMENTNAME', 'EQUIPMENTNUM', 'WATERCARRYCAP', 'FOAMOUTPUT', 'LIFTHEIGHT', 'DRYPOWERQUY'];
  }}) public dataObj?: any;

  public tableData: any = [];
  private lastTableData = [];
  private paginationTotal: number = 0;
  private pageSize: number = 3;
  private pageNo: any = 1;
  private handleCurrentChange(val: any) {
    this.pageNo = val;
    this.getListData();
  }
  private getStyle(width: any) {
    return 'width=' +  width;
  }
  private getListData() {
    searchReosurce.resourceServer.getEquipmentByWarBaseId({
      id: this.rescueId, // 'guiyang94',
      pageSize: this.pageSize,
      pageNo: this.pageNo,
    }).then( (result: any) => {
        this.tableData = result.list;
        this.paginationTotal = result.total;
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
#ZhanbaoList {
  width: 100%;
  z-index: 999;
  background-size: 100% 100%;
  .listTitleBox {
    width: 100%;
    color: #92edf6;
    display: flex;
    background: #06325c;
    border: 1px solid #085579;
    padding: 8px 0px;
    font-size: 28px;
    font-weight: normal;
    letter-spacing: 0px;
    span {
      text-align: center;
      display: inline-block;
    }
    .index {
      width: 12%;
    }
    .type {
      width: 45%;
    }
    .num {
      width: 35%;
    }
  }
  .listContBox {
    color: #fff;
    font-size: 28px;
    margin-bottom:10px;
    li {
      border: 1px solid #085579;
      border-top: none;
      padding: 8px 0px;
      height: 54px;
      line-height: 38px;
      span {
        display: inline-block;
        text-align: center;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .index {
        width: 12%;
      }
      .type {
        width: 45%;
      }
      .num {
        width: 35%;
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
  //   /*.el-pager {
  //           li.active {
  //               color: #00e4ff;
  //           }
  //       }*/
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
