<template>
  <!-- 水库左侧简介 -->
  <div class="left">
    <div class="title" :style="{display: data.display ? data.display : 'none'}">
      <span>{{ name }}</span>
    </div>
    <el-scrollbar style="height: 500px">
      <ul class="information">
        <li v-for="(item, index) in titleData" :key="index">
          <span class="name">{{ item.name + '：' }}</span>
          <span v-if="Array.isArray(item.value)">
            <span v-if="!item.value.length">--</span>
            <span v-else v-for="(v, i) in item.value" :key="i" class="cursor"
              >{{ v.name && v.name !== '--' ? v.name + ': ' : '--'
              }}<span
                v-for="(child, n) in v.tel"
                :key="n"
                @click="makingACall(v.name, child)"
                >{{ child ? ' ' + child.replace(/^(\d{3})\d{4}(\d{4})/,"$1****$2") : '' }}<i v-if="child"></i></span
            ></span>
          </span>
          <span v-else>{{
            item.value !== '--' ? item.value + item.unit : '--'
          }}</span>
        </li>
      </ul>
    </el-scrollbar>
    <div class="capacity">
      <div
        :class="['capacity-item', item.icon]"
        v-for="(item, index) in capacityList"
        :key="index"
      >
        <div class="name">
          {{ item.name }}
        </div>
        <div class="value">
          <p>{{ item.value }}</p>
          <span>{{ item.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
import { parse } from 'qs';
@Component({
  name: 'Rainfall',
})
export default class Rainfall extends Vue {
  @Prop() public data!: any; // 接受数据
  private name: any = '';
  private titleData: any = [
    // 基本信息的数据
    {
      name: '工程管理规模',
      value: '',
      unit: '',
      code: 'scale',
    },
    {
      name: '是否头顶库',
      value: '',
      unit: '',
      code: 'isOverHeadReservoir',
    },
    {
      name: '水库类型',
      value: '',
      unit: '',
      code: 'classCode',
    },
    {
      name: '年径流量',
      value: '',
      unit: '万m³',
      code: 'annualFlow',
    },
    {
      name: '调洪库容',
      value: '',
      unit: '万m³',
      code: 'floodStorage',
    },
    {
      name: '所在区县市',
      value: '',
      unit: '',
      code: 'district',
    },
    {
      name: '所在乡镇',
      value: '',
      unit: '',
      code: 'towns',
    },
    {
      name: '所在河流',
      value: '',
      unit: '',
      code: 'rivers',
    },
    {
      name: '建成时间',
      value: '',
      unit: '',
      code: 'completionTime',
    },
    {
      name: '流域面积',
      value: '',
      unit: '平方公里',
      code: 'drainageArea',
    },
    {
      name: '管理单位',
      value: '',
      unit: '',
      code: 'managementUnit',
    },
    // {
    //   name: '联系电话',
    //   value: '',
    //   unit: '',
    //   tel: true,
    //   code: 'principalPhone',
    // },
    {
      name: '行政责任人',
      value: [],
      unit: '',
      code: 'adminRespPerList',
    },
    {
      name: '行政责任人职务',
      value: '',
      unit: '',
      code: 'adminRespPerJob',
    },
    {
      name: '主要负责人',
      value: [
        {
          name: '',
          tel: [],
        },
      ],
      unit: '',
      code: 'principal',
    },
    {
      name: '主要负责人职务',
      value: '',
      unit: '',
      code: 'respPerJob',
    },
    // {
    //   name: '行政责任人联系电话',
    //   value: '',
    //   unit: '',
    //   tel: true,
    //   code: 'adminRespPerTel',
    // },
    {
      name: '技术责任人',
      value: '',
      unit: '',
      code: 'techRespPerList',
    },
    {
      name: '技术责任人职务',
      value: '',
      unit: '',
      code: 'techRespPerJob',
    },
    // {
    //   name: '技术责任人联系电话',
    //   value: '',
    //   unit: '',
    //   tel: true,
    //   code: 'techRespPerTel',
    // },
    {
      name: '巡查责任人',
      value: '',
      unit: '',
      code: 'patrolRespPerList',
    },
    {
      name: '巡查责任人职务',
      value: '',
      unit: '',
      code: 'patrolRespPerJob',
    },
    // {
    //   name: '巡查责任人联系电话',
    //   value: '',
    //   unit: '',
    //   tel: true,
    //   code: 'patrolRespPerTel',
    // },
    // {
    //   name: '主要负责人办公电话',
    //   value: '',
    //   unit: '',
    //   tel: true,
    //   code: 'respPeroTel',
    // },
    // {
    //   name: '主要负责人移动电话',
    //   value: '',
    //   unit: '',
    //   tel: true,
    //   code: 'respPermTel',
    // },
  ];
  private capacityList: any = [
    // 左下方库容的数据
    {
      name: '总库容',
      value: '0',
      unit: '万m³',
      icon: 'zkr',
      code: 'pondageTotal',
    },
    {
      name: '兴利库容',
      value: '0',
      unit: '万m³',
      icon: 'xlkr',
      code: 'utilizableCapacity',
    },
    // {
    //   name: '调洪库容',
    //   value: '0',
    //   unit: '万m³',
    //   icon: 'xlkr',
    //   code: 'floodStorage',
    // },
    {
      name: '死库容',
      value: '0',
      unit: '万m³',
      icon: 'skr',
      code: 'deadStorage',
    },
    {
      name: '汛限库容',
      value: '0',
      unit: '万m³',
      icon: 'xxkr',
      code: 'controlCapacity',
    },
  ];
  private mounted() {
    this.init();
  }
  // data.flag === true 时才有数据
  @Watch('data.flag')
  private init() {
    if (!this.data.flag) {
      return;
    }
    console.log(this.data, 'ddddddd');
    this.name = this.data.name;
    this.titleData.forEach((item: any) => {
      if (item.code === 'principal') {
        // 主要负责人
        item.value[0].name = this.data.principal || '--';
        item.value[0].tel.push(this.data.respPeroTel);
        item.value[0].tel.push(this.data.respPermTel);
      } else if (item.code === 'isOverHeadReservoir') {
        // 是否头顶水库
        if (this.data.isOverHeadReservoir === '0') {
          item.value = '否';
        } else if (this.data.isOverHeadReservoir === '1') {
          item.value = '是';
        } else {
          item.value = '--';
        }
      } else {
        item.value = this.data[item.code] || '--';
      }
    });
    this.capacityList.forEach((item: any) => {
      item.value = this.data[item.code] || 0;
    });
    if (this.data.scale !== '大（2）型' && this.data.scale !== '中型') {
      this.titleData.splice(13, 2);
    } else {
      this.titleData.splice(1, 1);
    }
  }
  // 拨打电话
  private makingACall(name: any, tel: any) {
    // console.log(99999, data)
    const item = {
      conactTel: tel,
      leaderName: name || '暂无数据',
    };
    this.messsageBus.emit(
      'showCallup',
      true,
      item,
      item.conactTel,
      {},
      item.leaderName,
    );
  }
}
</script>

<style lang="less" scoped>
@reservations: '../../../../../../assets/img/reservoirPopup';
* {
  box-sizing: border-box;
}
.left {
  position: relative;
  padding-right: 30px;
  width: 512px;
  // height: 762px;
  background: url('@{reservations}/left-bg.png') no-repeat;
  background-position: right center;
  // background-size: 100% 100%;
  .trend {
    position: absolute;
    top: -35px;
    right: 30px;
  }
  .title {
    // position: relative;
    // padding-left: 20px;
    padding: 0;
    height: 64px;
    // line-height: 64px;
    // text-align: center;
    // font-size: 28px;
    // color: #67e1fb;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('@{reservations}/title-bg.png') no-repeat;
    background-size: 100% 100%;
    span {
      font-weight: 500;
      font-family: 'myHeiti';
      font-size: 30px;
      color: 00e4ff;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    // &::before {
    //     content: '';
    //     width: 16px;
    //     height: 30px;
    //     position: absolute;
    //     top: 16px;
    //     left: 0;
    //     background: url('@{reservations}/title-left.png') no-repeat;
    //     background-size: calc(100% + 30px) 100%;
    // }
  }
  .el-scrollbar {
    position: relative;
    padding-top: 10px;
    background: url('@{reservations}/ul-top.png') no-repeat;
    background-position: top center;
  }
  .information {
    position: relative;
    li {
      // display: flex;
      padding-left: 20px;
      min-height: 45px;
      .name {
        color: #92edf6;
        height: 100%;
      }
      .cursor {
        cursor: pointer;
      }
      span {
        // display: inline-block;
        height: 100%;
        line-height: 45px;
        vertical-align: middle;
        font-size: 26px;
        color: #e8f4fe;
        span {
          margin-right: 10px;
        }
        i {
          display: inline-block;
          cursor: pointer !important;
          width: 23px;
          height: 45px;
          vertical-align: top;
          background: url(../../../../../../assets/img/eventInfo/telphoon.png)
            55% 20% no-repeat;
          background-size: contain;
          margin-left: 5px;
        }
      }
      &:nth-child(2n) {
        background-color: rgba(100, 219, 251, 0.1);
      }
    }
  }
  .capacity {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    // padding: 0 10px;
    margin-top: 20px;
    &::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 0;
      width: 100%;
      height: 20px;
      background: url('@{reservations}/rule.png') no-repeat;
      background-size: 100% 100%;
    }
    &-item {
      display: flex;
      margin-right: 8px;
      width: 237px;
      height: 149px;
      padding: 10px;
      align-items: center;
      // margin-top: 5px;
      // margin-right: -7px;
      // border-radius: 5px;
      // background: #2A85DD;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:nth-child(3) {
        background: #f9c01f;
      }
      &:nth-child(4) {
        background: #f9c01f;
      }
      .name {
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        padding: 0 20px;
        line-height: 28px;
        width: 80px;
        height: 100%;
        font-size: 26px;
        font-family: 'Microsoft YaHei';
        color: rgb(232, 244, 254);
        text-align: center;
      }
      .value {
        width: 120px;
        height: 100%;
        p {
          margin-top: 15px;
          height: 50px;
          color: #fbee50;
          line-height: 50px;
          text-align: center;
          font-size: 30px;
          font-family: 'Impact';
        }
        span {
          display: block;
          text-align: center;
          font-size: 18px;
          color: #e8f4fe;
        }
      }
    }
    .zkr {
      background: url('@{reservations}/zkr.png') no-repeat;
      background-size: 100% 100%;
    }
    .xlkr {
      background: url('@{reservations}/xlkr.png') no-repeat;
      background-size: 100% 100%;
    }
    .skr {
      background: url('@{reservations}/skr.png') no-repeat;
      background-size: 100% 100%;
    }
    .xxkr {
      background: url('@{reservations}/xxkr.png') no-repeat;
      background-size: 100% 100%;
      .value {
        p {
          color: #fff;
        }
      }
    }
  }
}
</style>
