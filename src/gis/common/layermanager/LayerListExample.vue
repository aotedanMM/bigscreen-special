<template>
    <div class="layer-list-panel">
        <label>图层列表</label>
        <ul class="layer-list">
            <li v-for='(each, index) in layerList' :key="index"><label>{{each.name}}</label><a class="layer-list-visiblebtn" v-if="each.visible" @click="setShow(each)">隐藏</a><a class="layer-list-visiblebtn" v-if="!each.visible" @click="setShow(each)">显示</a></li>
        </ul>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'LayerListExample',
})
export default class LayerListExample extends Vue {
    @Prop({default : ''}) private layerList: any;
    @Watch('layerList')
    // 图层显示隐藏功能回调
    private setShow(data: any) {
        this.$emit('setLayerVisible', data);
    }
}
</script>
<style lang="less" scoped>
.layer-list-panel {
    position: absolute;width: 300px;height: 400px;overflow-y: auto;overflow-x: hidden;left: 10px;top: 80px;background: #fff;border: 1px solid #dccece;z-index: 10;
}

.layer-list-panel>label {
    font-weight: bold;
}

.layer-list-panel>ul {
    width: 100%;height: 250px;padding: 0px;margin: 0px;margin-top: 10px;
}

.layer-list-panel>ul>li {
    display: block;
    width: 100%;
    padding-left: 10px;
}

.layer-list-panel>ul>li>a {
    cursor: pointer;
    color: #00f;
    position: absolute;
    left: 200px;
}
</style>
