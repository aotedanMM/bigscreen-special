<template>
  <div>
    <div class="JXYB_Wrap">
      <el-table
        size="mini"
        :data="tableData"
        :row-class-name="tableRowClassName"
        :header-row-class-name="tableHeaderClassName"
        tooltip-effect="light"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in col"
          :key="item.key + index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="title" v-if="item.prop=='title'">{{scope.row[item.prop]}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  IweatherJXYBServer,
  IHour24ForecastListItem,
  IweatherJXYBTable,
} from '@/interface/feature/common/weather/Weather.interface.ts';
@Component({
  name: 'WeatherJxyb',
})
export default class WeatherJxyb extends Vue {
  @Prop() public weatherList!: IweatherJXYBServer[];
  private tableData!: IweatherJXYBTable[];
  private col: IHour24ForecastListItem[] = [
    {
      key: '1',
      prop: 'title',
      label: '未来时刻',
      width: '',
      align: 'center',
    },
    {
      key: '2',
      prop: 'value1',
      label: '06:00',
      width: '',
      align: 'center',
    },
    {
      key: '3',
      prop: 'value2',
      label: '09:00',
      width: '',
      align: 'center',
    },
    {
      key: '4',
      prop: 'value3',
      label: '12:00',
      width: '',
      align: 'center',
    },
    {
      key: '5',
      prop: 'value4',
      label: '15:00',
      width: '',
      align: 'center',
    },
    {
      key: '6',
      prop: 'value5',
      label: '18:00',
      width: '',
      align: 'center',
    },
    {
      key: '7',
      prop: 'value6',
      label: '21:00',
      width: '',
      align: 'center',
    },
    {
      key: '8',
      prop: 'value7',
      label: '24:00',
      width: '',
      align: 'center',
    },
    {
      key: '9',
      prop: 'value8',
      label: '03:00',
      width: '',
      align: 'center',
    },
  ];

  // table斑马线
  private tableRowClassName(row: IweatherJXYBTable, rowIndex: number) {
    if (rowIndex % 2 !== 0) {
      return 'odd-row';
    }
  }
  // 表头样式类名
  private tableHeaderClassName() {
    return 'tableHead';
  }
  private dealJXYBDatas(opt: IweatherJXYBServer[]) {
    if (opt.length) {
      const arr: IweatherJXYBTable[] = [
        {
          title: '气温(℃)',
        },
        {
          title: '湿度(%)',
        },
        {
          title: '风速(m/s)',
        },
        {
          title: '风向',
        },
      ];
      opt.forEach((item: IweatherJXYBServer, index: number) => {
        const value = 'value' + (index + 1);
        (arr[0] as any)[value] = item.jb;
        (arr[1] as any)[value] = item.je;
        (arr[2] as any)[value] = item.jd;
        (arr[3] as any)[value] = this.translateWindX(item.jc);
      });
      this.tableData = arr;
    } else {
      this.tableData = [];
    }
  }

  // 处理风向
  private translateWindX(num: any) {
      const temp2 = Number(num);
      let windX = '';
      if (temp2 === 0) {
          windX = '持续无风';
      } else if (temp2 === 1) {
          windX = '东北风';
      } else if (temp2 === 2) {
          windX = '东风';
      } else if (temp2 === 3) {
          windX = '东南风';
      } else if (temp2 === 4) {
          windX = '南风';
      } else if (temp2 === 5) {
          windX = '西南风';
      } else if (temp2 === 6) {
          windX = '西风';
      } else if (temp2 === 7) {
          windX = '西北风';
      } else if (temp2 === 8) {
          windX = '北风';
      } else if (temp2 === 9) {
          windX = '旋转风';
      } else {
          windX = '无数据';
      }
      return windX;
  }

  private created() {
    this.dealJXYBDatas(this.weatherList);
  }
}
</script>


<style  lang="less">
.JXYB_Wrap {
  .title {
    color: #69e3e7;
  }
  .el-table,
  .el-table th,
  .el-table tr,
  .el-table td {
    font-size: 17px;
    color: white;
    border: 0;
    background-color: transparent;
    font-weight: normal;
  }
  .el-table::before {
    height: 0;
  }
  .el-table th {
    color: #fbea4e;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    border: 0;
    background-color: transparent;
  }
  .odd-row {
    background-image: url('../../../../../assets/img/weather/yujingli.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .tableHead {
    height: 40px;
    background-image: url('../../../../../assets/img/weather/yubaotitle.png');
    background-repeat: no-repeat;
    background-size: 100% 115%;
  }
}
</style>
<style>
  .el-tooltip__popper {
    max-width: 120px;
  }

</style>
