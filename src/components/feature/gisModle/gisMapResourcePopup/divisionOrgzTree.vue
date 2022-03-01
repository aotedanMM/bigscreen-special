<template>
  <div id="orgTree">
    <ul id="treeDemoOrg" class="ztree"></ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
@Component
export default class DivisionOrgzTree extends Vue {
  private isCheckArr: any = [];
  private zTreeElement: any = '';
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
      beforeClick: this.beforeClickOrg,
      onCheck: this.onClickkOrg,
    },
  };
  private zNodes = [];
  @Emit('customClickOrg')
  private handleClick(parame: any) {
    return parame;
  }
  // 点击某个节点 然后将该节点的名称赋值值文本框;
  private onClickkOrg(e: any, treeId: any, treeNode: any) {
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
          than.handleClick(than.isCheckArr);
        }
      });
    } else {
      than.handleClick([]);
    }
  }
  // 取消勾选单项
  private unchecknodeOrg(type: any) {
    const nodes = this.zTreeElement.getCheckedNodes(true);
    // 返回checkbox值
    for (let i = 0, l = nodes.length; i < l; i++) {
      if (!nodes[i].isParent && nodes[i].code === type) {
        this.zTreeElement.checkNode(nodes[i], false);
      }
    }
  }
  private beforeClickOrg(treeId: any, treeNode: any) {
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
      than.zTreeElement.setting.callback.onCheck(null, 'treeDemoOrg', item[0]);
    });
    return false;
  }
  private initTreeOrg(parame: any) {
    parame.then((res: any) => {
      this.zNodes = res;
      ($.fn as any).zTree.init($('#treeDemoOrg'), this.setting, this.zNodes);
      // 默认展开第一层树节点
      const zTree = ($.fn as any).zTree.getZTreeObj('treeDemoOrg');
      const nodeList = zTree.getNodes();
      const nodes = zTree.transformToArray(zTree.getNodes());
    });
  }
}
</script>
<style scoped lang="less">
@import url('../../../../assets/plugins/ztree/css/zTreeStyle/zTreeStyle.css');
#orgTree {
  width: 94%;
  height: 100%;
  position: relative;
  .ztree {
      width: 100%;
      overflow: hidden;
      overflow-y: auto;
      position: absolute;
      margin-left: 2%;
      padding-left: 3%;
      li {
        a {
          color: #fff;
        }
      }
    }
}
</style>
