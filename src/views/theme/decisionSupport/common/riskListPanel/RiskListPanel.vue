<template>
    <div id="RiskListPanel">
        <div class="searchBox">
            <input type="text" class="searchInp">
            <span class="btn">搜索</span>
        </div>
         <el-table
            :data="tableData"
            stripe
            size='small'
            :highlight-current-row='isHighlight'
            :header-row-class-name = 'headerRowStyleFunc'
            :row-class-name = 'rowStyleFunc'
            style="width: 100%"
            class="tabBox"
            >

            <el-table-column
            type = 'index'
            prop="date"
            label="序号"
            min-width="30%">
            </el-table-column>

            <el-table-column
            prop="name"
            label="名称"
            min-width="30%">
            </el-table-column>

            <el-table-column
            prop="address"
            label="地址"
            min-width="50%">
            </el-table-column>
        </el-table>
         <el-pagination
            layout="prev, pager, next"
            :total="50">
        </el-pagination>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
@Component({
  name: 'RiskListPanel',
})
export default class RiskListPanel extends Vue {
    private isHighlight: any = true;
    private tableData: any =  [{
          date: '2016-05-02',
          name: 'author',
          address: '上海市普陀区金沙江路 1518 弄',
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
    ];
    private headerRowStyleFunc(row: any) {
        return 'headerRowStyle';
    }
    private rowStyleFunc(row: any) {
        const rowIndex = row.rowIndex;
        if (rowIndex % 2 === 0) {
            return 'dbRow';
        } else {
            return 'defaultRow';
        }
    }
}
</script>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    #RiskListPanel{
        width: 906px;
        height: 370px;
        // position: fixed;
        background-image: url(../../../../../assets/img/gisModule/tankpng.png);
        left: 10vw;
        top: 43vh;
        z-index: 999;
        font-size: 18px;
        background-size: 100% 100%;
        .searchBox{
            padding: 40px 0 10px 20px;
            width: 100%;
            .searchInp{
                width: 200px;
                height: 35px;
                outline: none;
                border: 1px solid #0ceff5;
                color: #fff;
                border-radius: 10px;
                background: rgba(0,0,0,0.2);
            }
            .btn{            
                font-size: 22px;
                vertical-align: middle;
                margin-left: 1%;
                cursor: pointer;
                color: #fff;
            }
        }
        /deep/ .tabBox{
            background: transparent;
            font-weight: 900;
            text-align: center;
            font-size: 20px;
            color: #fff;
            td{
                border-bottom: none;
            }
        }
        /deep/ .dbRow{
            background: rgba(1,35,62,.6);
            border: none;
        }
        /deep/ .defaultRow{
            background: transparent;
            border: none;
            td{
                background: transparent;
            }
        }
        /deep/ .headerRowStyle{
            background: transparent;
            th{
                background: transparent;
                color: #00e4ff;
                font-size: 20px;
            }
        }
    }
</style>