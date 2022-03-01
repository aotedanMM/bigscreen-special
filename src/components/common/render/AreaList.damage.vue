<template>
  <div>
    <div class="listDistrict popupPanelRight_bg" v-show="closeFlag">
      <div v-if="minimize">
        <div class="closed-container-box">
          <div class="listDistrict_title"><span class="f-tit-h2">{{ title }}</span></div>
          <div class="closed-container">
            <span @click="FnMinimize()" class="panel_btnMinify"></span>
            <span @click="FnClose()" class="panel_btnClose"></span>
          </div>
        </div>
        <div class="listDistrict-flex-box">
          <div class="listDistrict-input">
            <div class="listDistrict-input-content">
              <!-- <input type="text" v-model="inputWord"/> -->
               <el-input class="csmMyInput" type="text" v-model.trim="inputWord" >
                  <i slot="suffix"  class="iconSelf_search"></i>
                </el-input>  

            </div>
            <!-- <div class="listDistrict-icon">
              <i class="el-icon-search"></i>
            </div> -->
          </div>
          <div class="lestDistrict-select" v-if="SelectFlag">
            <el-select class="constomMySelect"  v-model="selectSchoolClass" placeholder="请选择" >
            <el-option
                v-for="item in SelectClass"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="headBox">
        <span class="f-tit-h2"
            v-for="(each, index) in getHeader"
            :key="index+'indexNum'"
            :style="FiltersStyles( each.width + ',' + each.label )"
        >{{ each.label }}</span>
      </div>
      <!-- 列表每一行-->
      <div class="nodata" v-if="listDataAll.length <= 0">暂无数据</div>
      <ul class="listBox" v-else>
        <li class="listBox_li"
            v-for="(item, index) in listDataAll"
            :key="index"
            @click="clickHandler(index)"
            :class="[index % 2 !== 0 ? 'doubleLi' : '' , listBgClick === index ? 'classList' : '']"
        >
          <span
              v-for="(field,key) in item.data"
              :key="key"
              :class="[!key && 'indexSpan']"
              class="tooltip"
              :title="field.value + ',' + field.name | FiltersCondition"
              :style="FiltersStyles(field.width + ',' + field.name)"
              @mouseenter="itmeMouse()"
              @mouseleave="itemiMouout"
          >{{field.value + ',' + field.name | FiltersCondition}}</span>
        </li>
      </ul>
      <!-- <div></div> -->
      <!-- 分页-->
      <el-pagination class="constomMyElPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="paginationObj.currentPage"
          :page-size="paginationObj.pageSize"
          layout="prev, pager, next, jumper"
          :total="paginationObj.total"
          :pager-count="5"
      ></el-pagination>
    </div>
    <template v-if="!minimize">
      <div class="minimize-position" @click="FnMinimize()"></div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
    name: 'AreaList',
    filters: {
      // 条件过滤
      FiltersCondition(val: any): any {
        const arrStr = val.split(',');
        const objStr = {
          val: arrStr[0],
          name: arrStr[1],
        };
        if (objStr.name !== 'undefined') {
          switch (objStr.name) {
            case 'area':
              if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
                return parseFloat(objStr.val).toFixed(2);
              } else if (objStr.val === 'null') {
                return '暂无数据';
              } else {
                return parseFloat(objStr.val);
              }
              break;
            case 'popeleNum': // 人口数量
              if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
                const popeleNum = parseFloat(objStr.val) / 10000;
                return popeleNum.toFixed(2);
              } else if (objStr.val === 'null') {
                return '暂无数据';
              } else {
                return parseFloat(objStr.val);
              }
              break;
            case '_distance': // 事发距离
              if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
                return parseFloat(objStr.val).toFixed(2) + 'km';
              } else if (objStr.val === 'null') {
                return '暂无数据';
              } else {
                return parseFloat(objStr.val) + 'km';
              }
              break;
            case 'population': // 行政区划人口密度
              if (objStr.val !== 'null' && parseFloat(objStr.val) !== 0) {
                return parseFloat(objStr.val).toFixed(2);
              } else if (objStr.val === 'null') {
                return '暂无数据';
              } else {
                return parseFloat(objStr.val);
              }
              break;
            default:
              return objStr.val;
              break;
          }
        } else {
          return objStr.val;
        }
      },
    },
  })
  export default class AreaList extends Vue {

    // 计算属性
    get COMdata(): any {
      this.paginationObj.currentPage = 1;
      if (this.inputWord.length === 0 && this.selectSchoolClass.length === 0) {
        return this.getDataList;
      } else {
        return this.getFiltrateData;
      }
    }

    // 获取表格头部数据 （）
    private get getHeader() {
      return this.header.map((item: any, index: number) => {
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            return {
              label: item[key],
              width: this.definitionWidth[key],
            };
          }
        }
      });
    }

    // 获取表格主体数据（输入框数据）
    private get getFiltrateData() {
      this.cacheListTotalData = JSON.parse(JSON.stringify(this.filtrateData)); // 这个地方是为了当搜索后，点击一行，可以找到源数据
      return this.filtrateData.map((item: any, index: number) => {
        const res = {
          data: [],
          style: {
            width: '0',
          },
        };
        // 设置索引
        (res.data as any).push({
          value: index + 1,
          width: this.definitionWidth[this.filexed[0]],
        });
        this.filexed.forEach((key: any, i: number) => {
          if (i) {
            (res.data as any).push({
              value: item[key],
              name: key,
              width: this.definitionWidth[key],
            });
          }
        });
        return res;
      });
    }

    /* // 获取表格主体数据（输入框数据）
    private get getInputData() {
      this.cacheListTotalData = JSON.parse(JSON.stringify(this.inputData)); // 这个地方是为了当搜索后，点击一行，可以找到源数据
      return this.inputData.map((item: any, index: number) => {
        const res = {
          data: [],
          style: {
            width: '0',
          },
        };
        // 设置索引
        (res.data as any).push({
          value: index + 1,
          width: this.definitionWidth[this.filexed[0]],
        });
        this.filexed.forEach((key: any, i: number) => {
          if (i) {
            (res.data as any).push({
              value: item[key],
              name: key,
              width: this.definitionWidth[key],
            });
          }
        });
        return res;
      });
    }
    // 获取表格主体数据（下拉框数据）
    private get getSelectSchoolClassData() {
      this.cacheListTotalData = JSON.parse(
        JSON.stringify(this.selectSchoolClassData),
      ); // 这个地方是为了当select后，点击一行，可以找到源数据
      return this.selectSchoolClassData.map((item: any, index: number) => {
        const res = {
          data: [],
          style: {
            width: '0',
          },
        };
        // 设置索引
        (res.data as any).push({
          value: index + 1,
          width: this.definitionWidth[this.filexed[0]],
        });
        this.filexed.forEach((key: any, i: number) => {
          if (i) {
            (res.data as any).push({
              value: item[key],
              name: key,
              width: this.definitionWidth[key],
            });
          }
        });
        return res;
      });
    } */
    // 获取表格主体数据（原数据）
    private get getDataList() {
      this.cacheListTotalData = JSON.parse(JSON.stringify(this.listData)); // 把prop拿过来的源数据进行引用地址解引用，点击一行，可以找到源数据
      return this.listData.map((item: any, index: number) => {
        const res = {
          data: [],
          style: {
            width: '0',
          },
        };
        // 设置索引
        (res.data as any).push({
          value: index + 1,
          width: this.definitionWidth[this.filexed[0]],
        });
        this.filexed.forEach((key: any, i: number) => {
          if (i) {
            (res.data as any).push({
              value: item[key],
              name: key,
              width: this.definitionWidth[key],
            });
          }
        });
        return res;
      });
    }
    // 定义分页的对应
    @Prop() public paginationObj!: any;
    // 定义对应的表头信息
    @Prop() public header!: any;
    // 对应的数据
    @Prop() public listData!: any;
    // 对应后端接口树形
    @Prop() public filexed!: any;
    // 前端分页  还是后端分页  为true，则是前端分支，
    @Prop() public IsPagination: boolean = true;
    // 标题传入
    @Prop() public title: any;
    // 绑定所有的事件的信息
    @Prop() public eventObject: any;
    // 发送事件
    @Prop() private itemClick: any;
    // 定义 接收学校分类的信息
    @Prop() private SelectClass: any;
    // 定义 学校分类下拉栏是否显示
    @Prop({ default: false }) private SelectFlag: any;
    // 定义 元素宽度
    @Prop() private definitionWidth: any;
    // 定义 筛选的关键字在第几个索引
    @Prop({ default: 1 }) private searchKeyIndex: any;
    // 最小化判断
    private minimize: any = true;
    // 定义 input关键字
    private inputWord: string = '';
    // 定义 下拉确定的分类信息
    private selectSchoolClass: string = '';
    // 定义 通过inputWord 查出来的数据
    private filtrateData: any = [];
    // hover 延迟执行
    private hover: any;
    private listDataAll: any = [];
    private cacheListTotalData: any = [];
    private noData: any = true;
    private closeFlag: any = true;
    private listBgClick: any = '';
    @Watch('inputWord')
    public getInputWordListData() {
      this.changeFiltrate();
    }
    @Watch('selectSchoolClass')
    public getSelectSchoolClassListData() {
      this.changeFiltrate();
    }
    private handleSizeChange() {
      this.listDataAll = [];
    }

    private FiltersStyles(val: any): any {
      const arrStr = val.split(',');
      const objStr = {
        val: arrStr[0],
        name: arrStr[1],
      };
      if (objStr.name !== 'undefined') {
        let styleNum = objStr.val;
        if (
          this.$store.state.controlMoudle.mapCircleQueryType === 0 &&
          this.filexed.indexOf('level') >= 0
        ) {
          const levelNum =
            this.definitionWidth.level.substring(
              0,
              this.definitionWidth.level.length - 1,
            ) / 1;
          const nameNum =
            this.definitionWidth.name.substring(
              0,
              this.definitionWidth.level.length - 1,
            ) / 1;
          styleNum = levelNum + nameNum + '%';
        }
        switch (objStr.name) {
          case 'name':
            return { width: styleNum, textAlign: 'left' };
            break;
          case '名称':
            return { width: styleNum, textAlign: 'center' };
            break;
          default:
            return { width: objStr.val, textAlign: 'center' };
            break;
        }
      } else {
        return { width: objStr.val, textAlign: 'center' };
      }
    }

// 筛选过滤
    private changeFiltrate(): void {
      const val: any[] = [this.inputWord, this.selectSchoolClass];
      this.filtrateData = [];
      if (val[0].length > 0 && val[1].length > 0 && val[1] !== 'all') {
        // 如果都有条件,且过滤不是全选
        for (const iterator of this.listData) {
          if (
            iterator.name.includes(val[0]) && // 名字包含文本
            (iterator.typecode === val[1] || // 且typecode或者level 复合筛选
              iterator.level === val[1])
          ) {
            this.filtrateData.push(iterator);
          }
        }
      } else if (val[1].length > 0 && val[0].length === 0) {
        // 如果选择框有条件
        if (val[1] === 'all') {
          // 判断是不是all 全选处理
          this.filtrateData = JSON.parse(JSON.stringify(this.listData));
        } else {
          // 单个处理
          for (const iterator of this.listData) {
            if (iterator.typecode === val[1] || iterator.level === val[1]) {
              this.filtrateData.push(iterator);
            }
          }
        }
      } else if (val[0].length > 0 && (!val[1] || val[1] === 'all')) {
        // 只有input有值
        for (const iterator of this.listData) {
          if (iterator.name.includes(val[0])) {
            this.filtrateData.push(iterator);
          }
        }
      } else {
        // 都没有
        this.cacheListTotalData = JSON.parse(JSON.stringify(this.listData));
      }
    }
    /* private FnInputData(): void {
       this.inputData = [];
       if (this.inputWord) {
         for (const iterator of this.listData) {
           if (iterator.name.includes(this.inputWord)) {
             this.inputData.push(iterator);
           }
         }
       } else {
         this.cacheListTotalData = JSON.parse(JSON.stringify(this.listData));
       }
       this.paginationObj.currentPage = 1;
     }

     @Watch('selectSchoolClass')
     private FnSelectSchoolData(): void {
       this.selectSchoolClassData = [];
       if (this.selectSchoolClass === 'all') {
         for (const iterator of this.listData) {
           this.selectSchoolClassData.push(iterator);
         }
       } else if (this.selectSchoolClass) {
         for (const iterator of this.listData) {
           if (
             iterator.typecode === this.selectSchoolClass ||
             iterator.level === this.selectSchoolClass
           ) {
             this.selectSchoolClassData.push(iterator);
           }
         }
       } else {
         this.cacheListTotalData = JSON.parse(JSON.stringify(this.listData));
       }
     } */

    @Watch('listData')
    private FnlistData(): void {
      console.log('listData的值：', this.listData);
      this.selectSchoolClass = '';
      this.noData = false;
      this.inputWord = '';
      this.closeFlag = true;
      this.$nextTick((): void => {
        this.minimize = true;
      });
      this.handleCurrentChange();
    }

    private FnMinimize() {
      this.minimize = !this.minimize;
      this.FnClose();
    }

    private clickHandler(index: number) {
      this.itemClick(
        // this.listData[
        this.cacheListTotalData[
        index +
        (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize
          ],
      );
      this.listBgClick = index;
    }

    @Watch('COMdata')
    private handleCurrentChange() {
      // 前端分页
      if (this.IsPagination) {
        this.frentPag();
      } else {
        // 后端分页
        this.backPag();
      }
    }

    private frentPag() {
      this.paginationObj.total = this.COMdata.length;
      this.listDataAll = this.COMdata.slice(
        (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize,
        this.paginationObj.pageSize * this.paginationObj.currentPage,
      );
      // 前端分页处理
    }

    private backPag() {
      // 后端分页处理，直接调用某一个接口
      this.listDataAll = [];
    }

    private itmeMouse() {
      this.hover = setTimeout(() => {
        return false;
      }, 1000);
    }

    private FnClose() {
      this.closeFlag = !this.closeFlag;
    }

    private itemiMouout() {
      this.hover = null;
    }

    private created() {
      this.handleCurrentChange();
    }
  }
</script>
<style lang="less" scoped>
  @import url('../../../assets/css/decisionSupport/AreaList.less');
</style>
