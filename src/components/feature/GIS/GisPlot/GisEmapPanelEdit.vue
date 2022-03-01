<template>
    <div class="emap_control_eMapPanelEdit emap_control_eMapPanelEditPage" id="eMapPanelEdit" :style="options.editorStyle" >

        <div class="plotCtrlTop eMapPanelEditTop">
            <div class="topTitle title-panel">编辑</div>
            <div class="topClose-edit topClosePage" @click.stop="closeClick($event)"></div>
        </div>
        <div class="plotMainBox">
            <component 
                :is="editorComponent" 
                :data="eMapPanelEditObj"></component>
            <button @click="remove()" class="plot-delete plotdelete">删除</button>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop , Watch, Emit} from 'vue-property-decorator';
import './gisEmapPanelEdit.less';
import { Drag } from './toDrag';
import Editors from './editor/index';
@Component({
    components: Editors,
})
export default class EmapPanelEdit extends Vue {
    @Prop()  public eMapPanelEditObj?: any;
    @Prop()  public options?: any;
    private id: string = '';
    private editorComponent: string = '';
    @Watch('eMapPanelEditObj', {deep: true})
    private symbolType(data: any) {
        if (data && data.data && data.data.id) {
            this.id = data.data.id;
            // 根据不同的符号映射不同的编辑框组件
            const typeMap: any = {
                VectorMarkerSymbol: 'IconEditor',
                PictureMarkerSymbol: 'IconEditor',
                SimpleFillSymbol: 'PolygonEditor',
                SimpleLineSymbol: 'LineEditor',
                TextSymbol: 'TextEditor',
                TailedText: 'TailedLabelEditor',
                // todo
            };
            const componentName: any = typeMap[data.key];
            if (componentName) {
                this.editorComponent = componentName;
                const temp: any = {
                    id: this.id,
                    symbol: jQuery.extend(true, {}, data.data.symbol),
                    businessId: this.eMapPanelEditObj.data.businessId,
                };
                this.send(temp);
            } else {
                throw(new Error('不支持的符号类型！'));
            }
        } else {
            this.editorComponent = '';
        }
    }

    // 关闭事件=;
    private closeClick(event: any ) {
        event.stopPropagation();
        event.preventDefault();
        const temp: any = false;
        this.sendClose(temp);
    }

    @Emit('eMapPanelEdit')
    private send(val: any) {
        return val;
    }

    @Emit('panelEditClose')
    private sendClose(val: any) {
        return val;
    }

    private remove() {
        this.$confirm('是否删除标绘？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.editorComponent = '';
          this.$emit('delete', this.id);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {
            //
        });
    }

    private mounted() {
        const eMapPanelDrag: any = new Drag('#eMapPanelEdit', '.eMapPanelEditTop', this.options.drag);
        eMapPanelDrag.toDrag();
    }

}
</script>
