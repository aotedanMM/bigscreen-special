
<template>
    
    <div @dragstart="dragstart($event)" @dragenter="dragenter($event)" @dragover.navive="dragover($event)" @drop="drop($event)" draggable=true>
        <template >
            <slot :name="slotNameEnd"></slot>
        </template>  
    </div>
</template>


<script lang="ts">
import {Component, Vue, Prop } from 'vue-property-decorator';
let content: any;
@Component({
    name: 'DragPanal',
})
export default class DragPanal extends Vue {
    @Prop() public slotName: any;
    private slotNameEnd: any;
    private dragstart(e: any) {
        e.dataTransfer.setData('value', this.slotNameEnd);
        content = this;
    }
    private dragenter(e: any) {
        e.preventDefault();
    }
    private dragover(e: any) {
        e.preventDefault();
    }
    private drop(e: any) {
        const obj = e.dataTransfer.getData('value');
        const temp = this.slotNameEnd ;
        this.slotNameEnd = obj;
        this.$nextTick(() => {
            this.$forceUpdate();
        });
        this.changeBefore(temp);
    }
    private  changeBefore(temp: any) {
        content.slotNameEnd = temp ;
        content.$nextTick(() => {
            content.$forceUpdate();
        });
    }

    private created() {
        this.slotNameEnd = this.slotName ;
    }
}


</script>