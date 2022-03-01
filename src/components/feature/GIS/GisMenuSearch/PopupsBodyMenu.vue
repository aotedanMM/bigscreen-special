<!-- 弹窗体 -->
<template>
    <div class="body">
        <div class="list-block">
            <div class="list-item" v-for="(item, index) in listDataCopy" :key="index">
                <div class v-if="true || item.name === '救援装备'">
                    <div class="list-item-contain">
                        <img :src="item.icon" alt class="list-item-contain-img" />
                        <span
                            :class="['list-item-contain-text', (item.checked) ?'contain-text-checked':'']"
                            @click="clickTitle(item,index)"
                        >{{item.name}}</span>
                        <i
                            v-if="item.arrow || item.subList.length"
                            :class="['list-item-contain-extra', {
                      'up': item.arrow,
                      'down': !item.arrow
                    }]"
                            @click="switchList(index)"
                            onselectstart="return false"
                        ></i>
                    </div>
                    <div class="list-subItem" v-show="item.arrow">
                        <div
                            class="list-sub-item"
                            v-for="(subItem, ind) in item.subList"
                            :key="ind"
                        >
                            <span
                                :class="['checkbox', (subItem.checked) ?'checked':'']"
                                @click="setCheckbox(index, ind, subItem)"
                            ></span>
                            <span class="text" @click="setCheckbox(index, ind, subItem)">{{subItem.name}}({{subItem.num}})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { resourceanalysisServer } from '@/api/feature/normal/installNormalServer';

@Component({
  name: 'PopupsBodyMenu',
  components: {},
})
export default class PopupsBodyMenu extends Vue {
  @Prop() private listData: any;
  @Prop() private clickCheckedItem: any; // 单击checked的方法
  @Prop() private clickTitleItem: any; // 单击title的方法
  @Prop() private isRadio: any; // 是否单选，全国是单选


  private curTitleItem: any = {}; // 当前选中的标题

  private listDataCopy: any = [];

   // 这里要是public，获得当前所有的checked数组
    public getAllCheckedArr() {
        // 把当前选中的传过去
        const checkedArr: any = [];
        this.listDataCopy.forEach((item: any) => {
            if (item.name === '人口分布') {
                return ;
            }

            if (item.checked) {
                checkedArr.push(item);
            }
            item.subList.forEach((citem: any) => {
                if (citem.name === '房屋结构') {
                    return ;
                }
                if (citem.checked) {
                    checkedArr.push(citem);
                }
            });
        });
        return checkedArr;
    }

    // 改变checked的状态 为false
    public updateAllChecked() {
        this.listDataCopy.forEach((item: any) => {
            item.checked = false;
            item.subList.forEach((citem: any) => {
                citem.checked = false;
            });
        });

        this.listDataCopy = this.listDataCopy.concat([]);
    }

  // 应急资源树
  private switchList(index: number) {
    this.listDataCopy.forEach((v: any, i: number) => {
      if (index === i && v.arrow) {
        v.arrow = false;
      } else if (index === i) {
        v.arrow = true;
      } else {
        v.arrow = false;
      }
    });
    this.listDataCopy = this.listDataCopy.concat([]);
  }
  private setCheckbox(index: number, ind: number, subItem: any) {
      if (subItem.name === '房屋结构') {
          if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'quanguo') {
              this.$message({
                  message: '请先选择行政区划',
                  type: 'warning',
                  showClose: true,
                  duration: 1000,
              });
              return ;
          }
      }

      if (subItem.name === '房屋分布') {
           this.$message({
               message: '暂无数据',
               type: 'warning',
               showClose: true,
               duration: 1000,
           });
           return ;
       }
      if (this.isRadio) { // 单选
            this.listDataCopy.forEach((v: any, i: number) => {
              v.subList.forEach((j: any, k: number) => {
                  if (j.id === subItem.id) {
                      j.checked = !j.checked;
                  } else {
                      j.checked = false;
                  }
              });
            });
      } else {
          // 多选
          this.listDataCopy[index].subList[ind].checked = !this.listDataCopy[index].subList[ind].checked;
      }
      this.listDataCopy = this.listDataCopy.concat([]);

      if (this.isRadio) {
          this.listDataCopy.forEach((litem: any) => {
              if (litem.checked) {
                  litem.checked = false;
                  this.clickTitleItem(litem);
              }
              litem.checked = false;

          });

      }
      this.messsageBus.emit('currentPage');
      this.clickCheckedItem(this.listDataCopy[index].subList[ind]);

    // const status = this.listDataCopy[index].subList[ind].checked;
    // this.listDataCopy[index].subList[ind].checked = !status;
    // 单选
    // if (false) {
    //   this.listDataCopy.forEach((v: any, i: number) => {
    //     v.subList.forEach((j: any, k: number) => {
    //       if (k !== ind || i !== index) {
    //         j.checked = false;
    //       }
    //     });
    //   });
    // }
    // if (subItem.name === '房屋分布') {
    //   // 房屋分布
    //   if (this.listDataCopy[index].subList[ind].checked) {
    //     console.log('房屋分布');
    //     const opts5: any = {
    //       districtCode: '110000,130000',
    //       geometry: JSON.parse(this.geojsonStr),
    //     };
    //     resourceanalysisServer.getHouseDistribution(opts5).then((res2: any) => {
    //       console.log(res2);
    //     });
    //   }
    // }
    // else if (subItem.name === '房屋结构') {
    //   // 房屋结构（无数据）
    //   if (this.listDataCopy[index].subList[ind].checked) {
    //     console.log('房屋结构');
    //     const opts5: any = {
    //       districtCode: '110000,130000',
    //       geometry: JSON.parse(this.geojsonStr),
    //     };
    //     resourceanalysisServer.getHouseStructure(opts5).then((res2: any) => {
    //       console.log(res2);
    //     });
    //   }
    // } else {
    //   // 节点点击-资源查询
    //   console.log('其他节点点击');
    //   const tsKeys = this.listDataCopy.map((item: any) => item.subList).flat();
    //   console.log(tsKeys.flat());
    //   const resourceKeys = tsKeys.map((v: any) => {
    //     if (v.checked) {
    //       return v.code;
    //     }
    //   });
    //   const opts: any = {
    //     // Keyword: '',
    //     districtCode: '110000,130000',
    //     resourceKeys,
    //     buffer: JSON.parse(this.geojsonStr),
    //     // flatTag: true,
    //     // point: [115.21554243779553, 30.9149354518662],
    //     // radius: 50,
    //   };
    //   resourceanalysisServer.getNearbyList(opts).then((res2: any) => {
    //     console.log(res2);
    //   });
    // }

    // this.listDataCopy = this.listDataCopy.concat([]);


  }
  private clickTitle(item: any , index: number) {
        if (item.subList && item.subList.length) {
          return ;
      }
        if (item.name === '人口分布') {
          if (this.$store.state.gisMenuSearch.handResultData.curResultType === 'quanguo') {
              this.$message('请选择行政区划');
              return ;

          }
      }

        this.listDataCopy.forEach((litem: any, lindex: number) => {
          if (lindex === index) {
              litem.checked = !litem.checked;
          } else {
              litem.checked = false;
          }
      });
        this.messsageBus.emit('currentPage');
        this.listDataCopy = this.listDataCopy.concat([]);
        this.clickTitleItem(item);
    // if (!run) {
    //   console.log(title);
    //   if (title === '车辆实时位置') {
        // const opt4 = {
        //   polygon:
        //     'polygon((116.22045974259194 40.02378449453392,116.63702473987756 40.045528241008306,116.64709559653818 39.736766588449264,116.20031828072786 39.717311604454906,116.22045974259194 40.02378449453392))',
        // };
        // realTimeCar.getFireEnginesInfo(opt4).then((data: any) => {
        //   console.log('车辆实时位置', data);
        // });
      // }
      // // 节点点击-资源查询
      // if (title === '人口分布') {
        // 人口
        // const opts5: any = {
        //   districtCode: '110000,130000',
        //   geometry: JSON.parse(this.geojsonStr),
        // };
        // resourceanalysisServer.getPopulationHeatmap(opts5).then((res2: any) => {
        //   console.log(res2);
        // });
      // }
    // }
  }
  @Watch('listData')
  private listDataCopyWatch() {
      this.listDataCopy = this.listData.concat([]);
  }
  private created() {
    this.listDataCopy = this.listData.concat([]);
  }

}
</script>

<style lang="less" scoped>
@imgurl: '../../../../assets/img/popupsborder/';
.list-item {
  margin-bottom: 2px;
  position: relative;
  color: #c8d8f1;
  font-size: 18px;
  white-space: nowrap;
  cursor: pointer;
  &::before {
    content: '';
    height: 2px;
    width: 100%;
    position: absolute;
    top: 78px;
    left: 0;
    background: url('@{imgurl}line.png') center no-repeat;
  }
  &:last-child {
    margin-bottom: 0;
    &::before {
      height: 0;
    }
  }
}
.list-item-contain {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .list-item-contain-img {
    margin-left: 20px;
    margin-bottom: 5px;
    margin-right: 5px;
  }
  .list-item-contain-text {
    flex-grow: 1;
  }
    .contain-text-checked{
        color:#63d8ff;
    }
  .list-item-contain-extra {
    margin-right: 20px;
    display: inline-block;
    padding: 20px;
    width: 14px;
    height: 8px;
    background-repeat: no-repeat;
    background-position: center center;
    &.up {
      background-image: url('@{imgurl}Xtop.png');
    }
    &.down {
      background-image: url('@{imgurl}Xbtm.png');
    }
  }
}
.list-subItem {
  background-image: url('@{imgurl}showList.png');
  // background-size: cover;
  .checkbox {
    margin-right: 5px;
    display: inline-block;
    width: 25px;
    height: 25px;
    background-image: url('@{imgurl}zTreeStandard0.png');
    background-position: -165px -70px;
    background-repeat: no-repeat;
    &.checked {
      background-position: -165px -95px;
    }
  }
  .list-sub-item {
    padding-left: 65px;
    height: 56px;
    display: flex;
    align-items: center;
  }
}
</style>