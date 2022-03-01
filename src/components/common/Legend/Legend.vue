<template>
    <div class="legend-layout"  @click="select">
        <!--<span  :class="icon"></span>-->
        <!--<img class="img" :src="'@/assets/img/gisModule/legendPlanel/'+iconName "alt />-->
        <img class="img" :src="iconName" alt />
        <span  class="text f-txt-com"
                :class="{legend_sign_class: checked,DayNightShow:DayNightShow,DayNightHide:DayNightHide}"
                :title="title"
        >{{ title }}</span>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
@Component({
    name: 'Legend',
})
export default class Legend extends Vue {
    @Prop() public iconName!: string;
    @Prop() public title!: string;
    @Prop() public checked!: boolean;
    @Prop() public DayNightShow!: boolean;
    @Prop() public DayNightHide!: boolean;
    // @Prop() public visible!: boolean;


    public select() {
        // 选中每项自己这项更改
        this.$emit('click'); // 交给父亲的更改
    }
}
</script>

<style lang="less" scoped>
    @import "./Legend.less";
    @imgPath: '../../../assets/img/gisModule/legendPlanel';
</style>