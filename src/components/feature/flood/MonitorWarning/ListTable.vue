<template>
  <div class="flex-full" :class="listHeight?'rainBox_el':''">
    <div class="sortWrap" v-if="propdata.sortData">
      <el-button
        @click="sortBntClick(propdata.sortData.handle, item, index)"
        v-for="(item, index) in propdata.sortData.data"
        :key="index"
      >
        {{ item.name }}
        <i
          class="el-icon--right"
          :class="{
            'el-icon-arrow-down':
              item.sortType && item.sortType == 'desc' ? true : false,
            'el-icon-arrow-up':
              item.sortType && item.sortType == 'asc' ? true : false,
          }"
        ></i>
      </el-button>
      <div
        class="fr"
        v-if="propdata.resultMsg && propdata.resultMsg.length > 0"
      >
        <dl class="flex">
          <dt>检索结果中：</dt>
          <dd
            v-for="(item, index) in propdata.resultMsg"
            :key="index"
            data-id="item.id"
          >
            {{ item.name }}共
            <em>{{ item.value }}</em>
            {{ item.unit }}
            <span v-if="index !== propdata.resultMsg.length - 1">,</span>
          </dd>
        </dl>
      </div>
    </div>
    <el-scrollbar>
      <el-table
        ref="table"
        @sort-change="tableSortChange"
        :stripe="strip"
        :data="propdata.data"
        @selection-change="handleSelectionChange"
        :row-class-name="classname"
        :highlight-current-row="propdata.isSingleSelect"
        :border="true"
        @row-click="openDetails"
      >
        <template slot="empty">
          <div class="nothingData--bg nothingData-size"></div>
        </template>
        <el-table-column
          v-if="propdata.isCheck"
          type="selection"
          width="80"
        ></el-table-column>
        <el-table-column v-if="propdata.isExpand" type="expand">
          <template slot-scope="props">
            <el-form>
              <el-form-item
                v-for="(item, index) in propdata.expand"
                :label="item.label"
                :key="index"
                @click="openDialog('dialog', props.row, item)"
              >
                <span v-show="item.icon" class="icon_title"></span>
                <span>{{ props.row[item.prop] }} </span>
                <span
                  >{{ props.row.troopInfo[item.prop] }}
                  <span
                    v-if="item.tel_icon"
                    class="tel_icon"
                    @click="operatBtnClick(props.row)"
                  ></span
                ></span>
                <span v-show="item.dropBox == false" class="openForm">
                  <span
                    v-show="dropBox1 == false"
                    @click="openExpandBox(dropBox1)"
                    >展开 <span class="openIcon"></span
                  ></span>
                  <span
                    v-show="dropBox1 == true"
                    @click="openExpandBox(dropBox1)"
                    >收起 <span class="closeIcon"></span
                  ></span>
                </span>
              </el-form-item>
            </el-form>
            <div>
              <ul v-if="propdata.expandBox && dropBox1">
                <li v-for="(item, index) in propdata.expandBox" :key="index">
                  <span>{{ item.name }}</span
                  >&nbsp;&nbsp;<span>{{ item.value }}</span>
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="100">
        </el-table-column>
        <el-table-column
          :sort-orders="['ascending', 'descending']"
          :prop="item.prop"
          :sortable="
            unsortable ||
            item.type == 'button' ||
            item.type == 'tag' ||
            item.unsortable
              ? false
              : 'custom'
          "
          v-for="(item, index) in propdata.config"
          :label="item.label"
          :width="item.width"
          :key="index"
          :show-overflow-tooltip="propdata.showoverflowtooltip"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="
                item.type == 'tag' &&
                  scope.row[item.prop] != '' &&
                  propdata.tagArray[scope.row[item.prop]]
              "
              :type="propdata.tagArray[scope.row[item.prop]].type"
              >{{ propdata.tagArray[scope.row[item.prop]].name }}</el-tag
            >
            <router-link
              :title="scope.row[item.prop]"
              :to="{
                path: item.basehref,
                query: { id: scope.row[item.passProp] },
              }"
              v-if="item.type == 'link' && !scope.row['deleteFlag']"
            >
              <el-badge
                v-if="item.badge && scope.row['unReadStatus'] != '0'"
                :value="scope.row['unReadCount']"
                >{{ scope.row[item.prop] }}</el-badge
              >
              <span v-else>{{ scope.row[item.prop] }}</span>
            </router-link>
            <span
              v-if="item.type == 'link' && scope.row['deleteFlag'] == 1"
              @click="colClick(item.emit, scope.row, null)"
              >{{ scope.row[item.prop] }}</span
            >
            <span
              :title="scope.row[item.prop]"
              v-if="item.type == 'dialog'"
              @click="viewDialogOpen(item.type, scope.row, item)"
              style="cursor: pointer;"
              >{{ scope.row[item.prop] }}</span
            >
            <span
              :title="scope.row[item.prop]"
              v-if="item.type == 'img'"
              @click="item.emit ? operatBtnClick(item.emit, scope.row) : null"
            >
              <img
                style="width: 40px; height: 40px;"
                :src="scope.row[item.prop]"
                alt
              />
            </span>
            <span
              :title="scope.row[item.prop]"
              v-if="item.type == 'string' && scope.row.isSet"
              @click="item.emit ? operatBtnClick(item.emit, scope.row) : null"
            >
              <el-input
                v-if="item.read == false"
                v-model="scope.row[item.prop]"
                placeholder="请输入内容"
              ></el-input>
              <span v-if="item.read == true">{{ scope.row[item.prop] }}</span>
              <span v-if="item.read == 'datetime'">
                <el-date-picker
                  type="datetime"
                  v-model="scope.row[item.prop]"
                  placeholder="更新时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </span>
            </span>
            <span
              :title="scope.row[item.prop] + scope.row[item.prop1]"
              v-if="item.type == 'string' && item.tel == true"
              >{{ scope.row[item.prop] }}&nbsp;{{ scope.row[item.prop1] }}
              <span
                class="tel_icon"
                @click="callPeopel(scope.row[item.prop], scope.row[item.prop1])"
              ></span
            ></span>
            <span
              :title="scope.row[item.prop]"
              v-else-if="item.type == 'string'"
              @click="item.emit ? operatBtnClick(item.emit, scope.row) : null"
              :class="{
                red: item.wordColor && item.wordColor == 'red' ? true : false,
                underline:
                  item.wordStyle && item.wordStyle == 'underline'
                    ? true
                    : false,
              }"
              >{{ scope.row[item.prop] || '--' }}
              <span
                v-if="item.tel_icon"
                class="tel_icon"
                @click="operatBtnClick(scope.row)"
              ></span>
            </span>

            <!-- <span v-else-if="item.type =='button'">
                      <el-button v-if="buttonItem.expression" size="small" :title="buttonItem.title" :icon="buttonItem.icon" :type="buttonItem.type" :disabled="buttonItem.disabled" v-for="(buttonItem,btnInd) in scope.row[item.prop]" @click="operateFun(buttonItem.emit,scope.row,buttonItem)" :key="btnInd">{{buttonItem.name}}</el-button>
            </span>-->
            <span v-else-if="item.type == 'button'">
              <el-button
                size="small"
                :title="buttonItem.title"
                :icon="buttonItem.icon"
                :type="buttonItem.type"
                :disabled="buttonItem.disabled"
                v-for="(buttonItem, btnInd) in scope.row[item.prop]"
                @click="operateFun(buttonItem.emit, scope.row, buttonItem)"
                :key="btnInd"
                >{{ buttonItem.name }}</el-button
              >
            </span>
            <span v-if="item.type == 'directive'">
              <el-button
                @click="
                  operateFun('directiveFun', scope.row, scope.row[item.prop])
                "
                >{{ scope.row[item.prop] }}</el-button
              >
            </span>
            <span v-if="item.type == 'btnlink'">
              <el-button
                @click="operateFun(buttonItem.emit, scope.row, buttonItem)"
                v-for="(buttonItem, index) in scope.row[item.prop]"
                :key="index"
                >{{ buttonItem.name }}</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <div class="pager">
      <el-pagination
        class="constomMyElPage"
        small
        @current-change="handlePageChange"
        :current-page.sync="propdata.nowPage"
        :page-size="propdata.pageSize"
        layout="total, prev, pager, next"
        :total="propdata.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';

@Component({
  name: 'ListTable',
})
export default class ListTable extends Vue {
  @Prop() private propdata: any;
  @Prop() private listHeight: any;
  // 是否需要排序按钮 true为不需要
  @Prop() private unsortable: any;
  @Prop() private classname: any;
  @Prop() private hiddenpag: any;
  @Prop() private strip: any;
  private dialogvisible: boolean = false;
  private dropBox1: boolean = false;
  private dialogprop = {};
  private selecteddata: any = [];
  // 记录每列排序状态
  private orderStatusList = {};

  @Emit('handleselection')
  public handleSelectionData(data: any) {
    return { type: data };
  }

  // 表格排序
  public sortBntClick(operatName: any, item: any, index: any) {
    let tempSortType = '';
    if (item.sortType === '') {
      tempSortType = 'desc';
    } else {
      tempSortType = item.sortType === 'desc' ? 'asc' : 'desc';
    }
    const childItem = this.propdata.sortData.data;
    // for (let i = 0; i < childItem.length; i++) {
    //   childItem[i].sortType = '';
    // }
    childItem.forEach((v: any) => {
      v.sorType = '';
    });
    item.sortType = tempSortType;
    (this.$set as any)(this.propdata.sortData, index, item);
    // 执行表格排序方法
    this.operatBtnClick(operatName, item, null);
  }

  // 打开表格的详情弹框页
  public viewDialogOpen(operatName: string, row: any, item: any) {
    this.operatBtnClick(operatName, row, item);
  }
  // 表格操作按钮点击事件
  public operateFun(operatName: any, curTr: any, buttonItem: any) {
    if (operatName === 'dialog') {
      this.operatBtnClick(operatName, curTr, buttonItem);
      return;
    }
    if (buttonItem.viewDialog) {
      this.dialogvisible = true;
      this.dialogprop = { ...curTr };
      this.$set(this.propdata, 'viewDialog', buttonItem.viewDialog);
      this.operatBtnClick(operatName, curTr, buttonItem);
      return;
    }
    this.operatBtnClick(operatName, curTr, buttonItem);
  }

  @Emit('tablecallback')
  public operatBtnClick(operatName: any, curTr: any, buttonItem: any) {
    console.log('12222');
    return { type: operatName, rowVal: curTr, buttonItem };
  }

  // 分页
  public handlePageChange(val: any) {
    this.operatBtnClick('handlePageChange', val, this.propdata);
  }

  // 表单自定义表头排序
  public tableSortChange(column: any) {
    if (!column.order) {
      this.$message({
        type: 'warning',
        message: '已按当前条件排序',
      });
      return false;
    }
    const data = { sort: column.order, prop: column.prop };
    this.operatBtnClick('sort', data, null);
  }

  // 关闭弹框
  public closeCurDialogCall(dialogprop: any) {
    this.dialogvisible = false;
    this.operatBtnClick('closeDialogCall', null, null);
  }

  // 列点击事件（场景：当前行信息已删除，点击title列，则弹出提示信息）
  public colClick(emit: any, row: any) {
    this.operatBtnClick(emit, row, null);
  }

  private mounted() {
    (this.$refs as any).table.doLayout();
  }

  private handleSelectionChange(val: any) {
    if (this.propdata.isSingleSelect) {
      const length = val.length;
      if (length === 0) {
        return;
      }
      const curRow = val.slice(length - 1, length)[0];
      if (length > 1) {
        (this.$refs as any).table.toggleRowSelection(val[0], false);
      }
      (this.$refs as any).table.toggleRowSelection(curRow, true);
      this.selecteddata = [curRow];
      this.operatBtnClick('trSelectChange', curRow, null);
    } else {
      this.selecteddata = val;
    }
    return this.handleSelectionData(this.selecteddata);
  }
  // 点击展开收起 dropBox box
  private openExpandBox(dropBox: any) {
    dropBox = !dropBox;
    this.dropBox1 = dropBox;
  }
  // 点击展开详情弹窗
  private openDialog(operatName: string, row: any, item: any) {
    console.log(operatName, row, item, '3444');
    this.operatBtnClick(operatName, row, item);
  }
  // table 行点击
  private openDetails(row: any, item: any) {
    this.$emit('openDetails', row, item);
  }
  // 打电话 联系人+联系方式
  private callPeopel(text: any, phone: any) {
    console.log(text, phone, 'item');
    const obj: any = {
      show: 'true',
      data: {
        text,
        phone,
      },
    };
    this.messsageBus.emit('showPhone', obj);
  }
}
</script>
<style lang="less">
.rainBox_el{
  .el-scrollbar{
    height: 628px!important;
  }
  .nothingData--bg {
    margin-top: 180px!important;
}
}
</style>
<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@import url('../../../../assets/css/variable.less');
.pager {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 0.78rem;
  padding-right: 1.98rem;
}
// 展开tableForm 图标
.icon_title {
  width: 22px;
  height: 22px;
  // background: url('../../../../assets/img/halfScreen/commadRescue/icon_title.png')
  // no-repeat center center;
  background-size: 100% 100%;
  display: inline-block;
  margin-right: 4px;
}
.openForm {
  text-decoration: underline;
  position: absolute;
  right: 0px;
  cursor: pointer;
  .openIcon {
    width: 22px;
    height: 22px;
    // background: url('../../../../assets/img/halfScreen/commadRescue/openIcon.png')
    // no-repeat center center;
    background-size: 100% 100%;
    display: inline-block;
    margin-bottom: -5px;
  }
  .closeIcon {
    width: 22px;
    height: 22px;
    // background: url('../../../../assets/img/halfScreen/commadRescue/openIcon.png')
    // no-repeat center center;
    background-size: 100% 100%;
    transform: rotate(180deg);
    display: inline-block;
    margin-bottom: -3px;
  }
}
.red {
  color: #fc6e22;
}
.underline {
  color: #a3f7f1;
  text-decoration: underline;
  font-style: italic;
}
.tel_icon {
  width: 15px;
  height: 15px;
  // background: url('../../../../assets/img/halfScreen/commadRescue/phone.png')
  // no-repeat center center;
  background-size: 100% 100%;
  display: inline-block;
}
</style>
<style lang="less">
@import url('../../../../assets/css/variable.less');
</style>
