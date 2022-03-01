<template>
  <div id="areaTree">
    <div class="content_wrap">
      <ul id="treeDemo" class="ztree"></ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
@Component
export default class PersonalCasualty extends Vue {
  private key = '';
  private isCheckArr: any = [];
  private zTreeElement: any = '';
  private nodeList = [];
  private setting = {
    check: {
      enable: true,
      chkboxType: { Y: 'ps', N: 'ps' },
    },
    view: {
      dblClickExpand: false,
    },
    data: {
      simpleData: {
        enable: true,
      },
    },
    callback: {
      beforeClick: this.beforeClick,
      onCheck: this.onClick,
    },
  };
  private zNodes = [];
  private freshArea() {
    ($.fn as any).zTree.init($('#treeDemo'), this.setting, this.zNodes);
  }
  private callback(value: any) {
    this.$message(value);
  }
  @Emit('customClick')
  private handleClick(parame: any, itemobj: any) {
    return {
      parame,
      itemobj,
    };
  }
  // 点击某个节点 然后将该节点的名称赋值值文本框;
  private onClick(e: any, treeId: any, treeNode: any) {
    this.isCheckArr = [];
    const than = this;
    this.zTreeElement = ($.fn as any).zTree.getZTreeObj(treeId);
    const nodeArr = this.zTreeElement.getCheckedNodes();
    if (nodeArr && nodeArr.length > 0) {
      nodeArr.map((itemobj: any) => {
        if (itemobj.isParent) {
          itemobj.children.forEach((p1: any, p2: any) => {
            if (p1.checked) {
              than.isCheckArr.push(p1);
            }
          });
          than.handleClick(than.isCheckArr, itemobj);
        }
      });
    } else {
      than.handleClick([], {});
    }
  }
  // 取消勾选单项
  private unchecknode(type: any) {
    const nodes = this.zTreeElement.getCheckedNodes(true);
    // 返回checkbox值
    for (let i = 0, l = nodes.length; i < l; i++) {
      if (!nodes[i].isParent && nodes[i].code === type) {
        this.zTreeElement.checkNode(nodes[i], false);
      }
    }
  }
  private beforeClick(treeId: any, treeNode: any) {
    this.zTreeElement = ($.fn as any).zTree.getZTreeObj(treeId);
    this.zTreeElement.checkNode(treeNode, !treeNode.checked, true);
    const arr = [];
    const than = this;
    if (treeNode.isParent) {
      arr.push(treeNode);
      arr.push(treeNode.children);
    } else {
      arr.push(treeNode);
    }
    arr.forEach(function(item, index) {
      than.zTreeElement.setting.callback.onCheck(null, 'treeDemo', item[0]);
    });
    return false;
  }
  // 还原zTree的初始数据;
  private InitialZtree() {
    ($.fn as any).zTree.init($('#treeDemo'), this.setting, this.zNodes);
  }
  // 根据文本框的关键词输入情况自动匹配树内节点 进行模糊查找;
  private AutoMatch(txtObj: any) {
    const that = this;
    if (this.key.length > 0) {
      that.InitialZtree();
      const zTree = ($.fn as any).zTree.getZTreeObj('treeDemo');
      const nodeList = zTree.getNodesByParamFuzzy('name', this.key);
      // 将找到的nodelist节点更新至Ztree内;
      ($.fn as any).zTree.init($('#treeDemo'), that.setting, nodeList);
    } else {
      // 隐藏树;
      // hideMenu();
      that.InitialZtree();
    }
  }
  private initTree(parame: any) {
    parame.then((res: any) => {
      this.zNodes = res.data;
      ($.fn as any).zTree.init($('#treeDemo'), this.setting, this.zNodes);
      // 默认展开第一层树节点
      const zTree = ($.fn as any).zTree.getZTreeObj('treeDemo');
      const nodeList = zTree.getNodes();
      const nodes = zTree.transformToArray(zTree.getNodes());
    });
  }
}
</script>
<style scoped lang="less">
@import url('../../../../assets/plugins/ztree/css/zTreeStyle/zTreeStyle.css');
#areaTree {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .content_wrap {
    width: 100%;
    height: 100%;
    .ztree {
      width: 100%;
      color: #fff;
      overflow: hidden;
      overflow-y: auto;
      position: absolute;
      margin-left: 2%;
      li {
        a {
          color: #fff;
        }
      }
    }
  }
}
</style>
