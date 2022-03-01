
# 面板组件

## 文件说明

* Panel.common.vue ———— 带下拉框的面板
* Panel.primary.vue ————带Tab功能的面板。
* PanelIframe.vue ————iframe嵌套面板，主要接入外部系统或链接。
* PanelView.vue ————通用的面板，type类型可收缩与关闭功能。

## 最基本的用法

* 组件内容高宽百分百，需要内容调用者来决定显示的位置、大小及组件的外框样式。

```js
 
  <PanelView title="救援物资" >
        <div>面板内容</div>
  </PanelView> 

```

## 带关闭按钮的面板

```vue
<template>
<div>
  <el-button @click="openPanel">打开面板</el-button>
  <PanelView ref="panelWarningInfo" title="救援物资" :type="1">
        <div>面板内容</div>
  </PanelView> 
</div>
</template>
<script>
 export default {
   data(){
     return {

     }
   },
   methods: {
   openPanel() {
        this.$refs.panelWarningInfo.openPanel();
    }
   }
 }
 </script>




```

## 带收缩按钮的面板

```js
 
  <PanelView title="救援物资" :type="2">
        <div>面板内容</div>
  </PanelView> 

```



