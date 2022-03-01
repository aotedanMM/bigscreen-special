<template>
  <div>
    <div v-for="(item, index) in manageTabAllDatas" :key="item.name">
      <div
        class="commonTabTitle manageTabTitle"
        @click="manageTabClick(item, index)"
      >{{ item.name }}</div>
      <div class="hotTab commonTab manageItemWrap">
        <el-input
          class="treeInput"
          v-model="item.inputKey"
          clearable
          size="small"
          suffix-icon="el-icon-search"
          placeholder="请输入关键字"
          @input="inputWatch"
          v-show="item.isShowInput"
        ></el-input>
        <!-- {{item.list}} -->
        <div v-show="!iselenamechange">
          <div class="listWrap">
            <el-scrollbar style="height:100%;" v-if="item.list.length !== 0">
              <ul
                v-for="(ele, idx) in item.list"
                :key="ele.id"
                class="listWrapUl"
                :class="[(ele.isOpen && 'active')]"
                @mouseenter="addHighlightPlot(ele, idx, index) "
                @mouseleave="removeHighlightPlot(ele, idx, index) "
              >
                <li @click="listToggle(ele, idx, index)">{{ ele.toggle }}</li>
                <li
                  @click="showiselenamechange(ele, 'show', index)"
                  :title="ele.name"
                >{{ ele.name }}</li>
                <li @click="listDelete(ele, idx, index)">{{ ele.operation }}</li>
              </ul>
            </el-scrollbar>
            <div class="nothingData--bg" v-else>{{ msg }}</div>
          </div>

          <div class="paginationClass" v-show="item.isShowPagination" v-if="item.list.length !== 0">
            <el-pagination
              size="mini"
              @current-change="handleCurrentChange"
              :page-size="9"
              :current-page="listObj.currentPage"
              layout=" total, prev, pager, next,jumper"
              :total="listTotal"
              :pager-count="5"
            ></el-pagination>
          </div>
        </div>
        <div v-show="iselenamechange">
          <ul class="listWrapUl">
            <li @click="showiselenamechange1('save')">保存</li>
            <span style="margin-top: 8px;">
              <el-input
                v-model="changeDataObj.schemaName"
                class="el-input-color"
                clearable
                size="small"
                placeholder="请输入标绘名称"
                maxlength="20"
                @keyup.enter.native="showiselenamechange(ele, 'save', index)"
              ></el-input>
            </span>
            <li
              @click="
                          showiselenamechange(
                            { id: '', schemaName: '' },
                            'quit',
                          )
                        "
            >返回</li>
          </ul>
        </div>
      </div>
      <div class="nodataLi">
        <div class="nothingData--bg">{{ msg }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import { plotServer, plotNoSqlService } from '@/api/installServer';
@Component({})
export default class GisPlotPanelManage extends Vue {
    @Prop() public leftTabValue?: any;
    @Prop() public hotIconIndex?: any;
    @Prop() public commonIconIndex?: any;
    @Prop() public options?: any;
    @Prop() public mapComponent?: any;
    @Prop() public mapOpts?: any;
    @Prop() public eventType?: any;
    @Prop() public plotIcons?: any;
    @Prop() public eMapPanelEditObj?: any;
    @Prop() public rendered?: any;
    public timer: any;
    private allPlotSchemas: any = [];
    private msg = '暂无数据';
    private activeShow = false;
    private activeShowTwo = false;
    private changeDataObj = {
      id: '',
      schemaName: '',
    };
    private iselenamechange: boolean = false;
      // 方案列表是否激活class
    private openSchemas: any = [];
    private listObj = {
      inputKey: '',
      currentPage: 1,
    };
    private listTotal = 0;
    // 每页方案个数
    private limit: number = 9;
    private manageTabAllDatas = [
    {
      name: '标绘方案',
      isShowInput: true,
      isShowPagination: true,
      inputKey: '',
      list: [],
    },
    {
      name: '已标绘图形',
      isShowInput: false,
      isShowPagination: false,
      list: [],
    },
  ];

  private created() {
    // 新增messsageBus的监听
    this.messageBus = this.messageBus || this.messsageBus;
  }

  private mounted() {
    this.refreshSchemaList();
    this.updateMapComponent(this.mapComponent);
  }
  /**
   * mapComponent 有值时 再进行加载
   */
  @Watch('mapComponent')
  private updateMapComponent(val: any) {
    if (val) {
      this.getlistDatas(this.listObj);
      this.mapComponentEvents();
    }
  }
   // 未保存标绘
  private noSaveplot(arr: any) {
    const tempArr: any = [];
    arr.map((item: any) => {
      const item1: any = item;
      tempArr.push({
        toggle: '隐藏',
        showFlag: false,
        iselenamechange: false,
        newname: item1.content,
        name: item1.content,
        operation: '删除',
        data: item1,
      });
    });
    this.manageTabAllDatas[1].list = tempArr;
  }
  private removeHighlightSchema() {
    this.openSchemas = [];
    this.manageTabAllDatas[0].list.forEach((item: any) => {
      item.isOpen = false;
    });
    this.$emit('closeEMapPanelEdit');
    // this.closeEMapPanelEdit();
  }
  // 将请求到的list数据放入面板;
  private setListDatas(data: any, flag: boolean) {
    this.listTotal = data.listTotal;
    const res = data.data;
    this.allPlotSchemas = [];
    if (res.length) {
      res.map((item: any) => {
        const obj: any = item;
        let isOpen = false;
        let toggle = '显示';
        let showFlag: boolean = true;
        this.openSchemas.map((id: any) => {
          if (id === obj.id) {
            isOpen = true;
            toggle = '隐藏';
            showFlag = false;
          }
        });
        this.allPlotSchemas.push(
          Object.assign({}, obj, {
            toggle,
            showFlag,
            isOpen,
            iselenamechange: false,
            newname: obj.val,
            name: obj.val, // item.tag.RELATION_ID,
            operation: '删除',
            id: obj.id,
          }),
        );
      });
      // 保存后加载的方案，默认第一个是显示的
      if (flag) {
        this.listToggle(this.allPlotSchemas[0], 0, 0, true);
        // this.allPlotSchemas[0].isOpen = true;
        // this.allPlotSchemas[0].showFlag = false;
        // this.allPlotSchemas[0].toggle = '隐藏';
      }
    }
    this.manageTabAllDatas[0].list = this.allPlotSchemas;
  }
     // 刷新列表
  private refreshSchemaList() {
    this.listObj.currentPage = 1;
    this.listObj.inputKey = '';
    this.getlistDatas(this.listObj);
  }
    // 请求数据
  private getlistDatas(opt?: any) {
    this.manageTabAllDatas[0].list = [];
    if (this.mapComponent) {
     this.mapComponent.refreshPlotSchemaList(this.mapOpts.businessId, opt.currentPage , this.limit);
    }
    if (opt.currentPage > 1) {
      this.activeShow = true;
      // opt.flag = false;
    } else {
      this.activeShow = false;
    }
  }

  // 前端分页处理
  private frentPag() {
    this.manageTabAllDatas[0].list = [];
    this.manageTabAllDatas[0].list = this.allPlotSchemas.slice(
      (this.listObj.currentPage - 1) * 9,
      9 * this.listObj.currentPage,
    );
  }
  private showiselenamechange(ele: any, flag: string, index: any) {
   /*  if (index === 0) {
      this.iselenamechange = !this.iselenamechange;
      this.changeDataObj = {
        id: ele.id,
        schemaName: ele.newname,
      };
      if (flag === 'quit') {
        this.changeDataObj = {
          id: '',
          schemaName: '',
        };
        return;
      }
    } else if (index === 1 || !index) {
       if (flag === 'quit') {
        this.changeDataObj = {
          id: '',
          schemaName: '',
        };
        return;
      }
    } */
  }
  private showiselenamechange1(flag: string) {
    if (flag === 'save') {
      this.mapComponent.updateSchema(this.mapOpts.businessId, this.changeDataObj);
      this.iselenamechange = !this.iselenamechange;
      this.getlistDatas(this.listObj);
    }
  }
  // input监听
  private inputWatch(val: any) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.listObj.inputKey = val;
      this.listObj.currentPage = 1;
      // this.getlistDatas(this.listObj);
      this.mapComponent.planSearchBack(this.mapOpts.businessId, this.listObj.inputKey, this.listObj.currentPage, this.limit);
    }, 1000);
  }
  // input监听;
  private inputWatch1(val: any) {
    return false;
  }
  // 管理标绘列表显示、隐藏事件
  private listToggle(ele: any, idx: any, index: any, booActive?: any) {
    if (index === 0 && idx === 0 ) {
      this.activeShowChange = true;
    }
    if (ele.toggle === '显示') {
      ele.toggle = '隐藏';
      ele.showFlag = false;
    } else {
      ele.toggle = '显示';
      ele.showFlag = true;
    }
    if (index === 1) {
      if (ele.toggle === '显示') {
         this.mapComponent.removeHighlightPlot(ele.data.id);
      }
      // 未保存的显隐控制
      this.mapComponent.toggleUnsavedPlot(ele.data.id, !ele.showFlag);
    } else if (index === 0) {
      // 方案的显隐控制
      if (!ele.showFlag) {
        this.mapComponent.planShowBack(ele.id);
        ele.isOpen = true;
        this.openSchemas.push(ele.id);
        // TODO
      } else {
        this.mapComponent.planCleanBack(ele.id);
        ele.isOpen = false;
        for (var i = this.openSchemas.length - 1; i >= 0; i--) {
          if (this.openSchemas[i] === ele.id) {
            this.openSchemas.splice(i, 1);
          }
        }
      }
    }
  }
  // 管理  标绘列表删除事件
  private listDelete(ele: any, idx: any, index: any) {
    const self = this;
    let messageList = '';
    if (index === 0) {
      messageList = '是否删除标绘方案?';
    } else {
       messageList = '是否删除标绘?';
    }
    this.$confirm(messageList, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        if (index === 1) {
          // console.log(this.manageTabAllDatas[1]);
          self.manageTabAllDatas[1].list.splice(idx, 1);
          self.mapComponent.removeUnsaved(ele.data.id);
        } else {
          self.manageTabAllDatas[0].list.splice(idx, 1);
          self.mapComponent.planDeleteBack(self.mapOpts.businessId, ele.id, self.listObj.currentPage, self.limit);
          if (self.eMapPanelEditObj.data.schemaId === ele.id) {
            // TODO
            self.$emit('closeEMapPanelEdit');
            // self.closeEMapPanelEdit();
          }
        }
        self.$message({
          type: 'success',
          message: '删除成功!',
        });
        // 关闭编辑按钮
        this.messsageBus.emit('closeEditorBh');
      })
      .catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
  }
  // 分页
  private handleCurrentChange(val: any) {
    // this.allPlotSchemas[0].isOpen = false;
    this.listObj.currentPage = val;
    this.getlistDatas(this.listObj);
  }
  // 高亮标绘图形
  private addHighlightPlot(ele: any, idx: any, index: any) {
    if (index === 1 && ele.toggle === '隐藏') {
      this.mapComponent.addHighlightPlot(ele.data.id);
    }
  }
   // 高亮标绘图形
  private removeHighlightPlot(ele: any, idx: any, index: any) {
    if (index === 1 && ele.toggle === '隐藏') {
      this.mapComponent.removeHighlightPlot(ele.data.id);
    }
  }
  // 管理标绘标题点击事件
  private manageTabClick(item: any, index: any) {
    if (item.name === '标绘方案' && !this.activeShowChange ) {
      const obj = {
        currentPage: 1,
      };
      this.getlistDatas(obj);
      this.activeShow = false;
    }
    if (item.inputKey !== undefined) {
      item.inputKey = '';
      item.list = [''];
      this.listObj.inputKey = '';
      this.listObj.currentPage = 1;
      this.mapComponent.planSearchBack(this.mapOpts.businessId, '', 1, this.limit);
    }
    if (!item.list.length) {
      $('.commonTab').slideUp();
      $('.nodataLi')
        .eq(index)
        .slideToggle();
      $('.nodataLi')
        .eq(index)
        .parent()
        .siblings()
        .find('.nodataLi')
        .slideUp();
    } else {
      $('.nodataLi').slideUp();
      $('.manageTabTitle')
        .eq(index)
        .next()
        .slideToggle();
      $('.manageTabTitle')
        .eq(index)
        .parent()
        .siblings()
        .find('.commonTab')
        .slideUp();
    }
  }
  // 重置表单验证
  private resetForm(formName: any) {
    (this.$refs[formName] as any).resetFields();
  }
  // 地图事件
  private mapComponentEvents() {
    const self = this;
    // 高亮指定方案
    this.mapComponent.off('highlightUnsavedView');
    this.mapComponent.on('highlightUnsavedView', (schemaList: any) => {
      schemaList.forEach((id: any) => {
        if (this.openSchemas.indexOf(id) < 0) {
          this.openSchemas.push(id);
        }
      });
    });
    // 每次绘制完成时调用
    this.mapComponent.off('updateUnsavedView');
    this.mapComponent.on('updateUnsavedView', (data: any) => {
      // console.log('每次绘制完成时调用', data);
      // 数据列表中包含通过标绘工具箱绘制的全部图形，通过businessId排除外部标绘图形
      const list: any = [];
      data.data.forEach((item: any) => {
        if (item.businessId === this.mapOpts.businessId) {
          list.push(item);
        }
      });
      this.noSaveplot(list);
    });
     // 查询标绘方案列表回调
    this.mapComponent.off('removeHighlightSchema');
    this.mapComponent.on('removeHighlightSchema', (data: any) => {
      this.removeHighlightSchema();
    });
     // 查询标绘方案列表回调
    this.mapComponent.off('refreshSchemaList');
    this.mapComponent.on('refreshSchemaList', (opts: any) => {
      if (this.activeShow || this.activeShowChange) {
         opts.flag = false;
      }
      // console.log(opts);
      if (opts.businessId === self.mapOpts.businessId) {
        self.setListDatas(opts.data, opts.flag);
      } else {
        console.debug('refreshBusinessPlotSchemaList', opts);
        self.messageBus.emit('refreshBusinessPlotSchemaList', opts);
      }
    });

    // 标绘方案搜索回调
    this.mapComponent.off('planSearchBack');
    this.mapComponent.on('planSearchBack', (opts: any) => {
      // console.log(opts);
      opts.flag = false;
      if (opts.businessId === self.mapOpts.businessId) {
        this.manageTabAllDatas[0].list = [];
        this.setListDatas(opts.data, false);
      } else {
        console.debug('refreshBusinessPlotSchemaList', opts);
        self.messageBus.emit('refreshBusinessPlotSchemaList', opts);
      }
    });
    // 标绘方案保存回调
    this.mapComponent.off('schemaSaveSuccess');
    this.mapComponent.on('schemaSaveSuccess', (businessId: any) => {
      if (businessId === self.mapOpts.businessId) {
        $('.savePlotName').fadeOut();
        this.manageTabAllDatas[1].list = [];
        this.getlistDatas(this.listObj);
        this.$message({
          type: 'success',
          message: '保存方案成功！',
        });
      } else {
        console.debug('businessSchemaSaveSuccess');
        self.messageBus.emit('businessSchemaSaveSuccess');
      }
    });
      // 方案保存失败回调
    this.mapComponent.off('schemaSaveFail');
    this.mapComponent.on('schemaSaveFail', (data: any, businessId: any) => {
      if (businessId === self.mapOpts.businessId) {
        this.$message({
          type: 'error',
          message: data,
        });
      } else {
        console.debug('businessSchemaSaveFail');
        self.messageBus.emit('businessSchemaSaveFail', data);
      }
    });
    // 地图触发删除标绘图形
    this.mapComponent.off('deletePlotElement');
    this.mapComponent.on('deletePlotElement', (data: any) => {
      if (data.businessId === self.mapOpts.businessId) {
        const list: any = this.manageTabAllDatas[1].list;
        // console.log('开始循环');
        if (list.length === 0 || (list.length > 0 && !list[0].data.id) ) {// 方案时直接删除
          this.$confirm('是否删除标绘？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.mapComponent.removeUnsaved(data.id);
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          })
          .catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除',
            // });
          });
        } else {
          for (let i = list.length - 1; i >= 0; i--) {
            // console.log('循环' + i);
            const eleData: any = list[i].data;
            if (list[i].data && (list[i].data.id === data.id)) {
              this.listDelete(list[i], i, 1);
              break;
            }
          }
        }
      } else {
        // console.log(data);
        this.mapComponent.removeUnsaved(data.id);
        self.messageBus.emit('businessDeletePlotElement', {data});
      }
    });
  }
}
</script>
