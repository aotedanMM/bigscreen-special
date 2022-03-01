<template>
    <div class="GisAreaSelection">
        <!--区域选择-->
        <div class="as-title" title="区域选择" @click="areaSelectionClik"></div>

        <!--子窗口-->
        <div class="as-content" v-show="show">
            <div class="bd_item"
                 v-for="(item, i) in secondData"
                 :class="resultNum === i && item.visible ? ('item_' + (i+1)) : ''"
                 @click="itemClick(item, i)">
                <p class="text">{{item.title}}</p>
            </div>
        </div>

        <!--弹窗-->
        <div class="as-prop">
            <Watershed :visible="secondData[0].visible" :eventComp="'AreaSelection.Watershed'"  @compClick="closePanel"></Watershed>
            <RiverNetwork :visible="secondData[1].visible"  :eventComp="'AreaSelection.RiverNetwork'" @compClick="closePanel"></RiverNetwork>
            <RainstormArea :visible="secondData[2].visible"  :eventComp="'AreaSelection.RainstormArea'" @compClick="closePanel"></RainstormArea>
        </div>
    </div>
</template>
<script lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import './AreaSelection.less';
import Watershed from '@/components/feature/GIS/GisAreaSelection/Watershed.vue';
import RiverNetwork from '@/components/feature/GIS/GisAreaSelection/RiverNetwork.vue';
import RainstormArea from '@/components/feature/GIS/GisAreaSelection/RainstormArea.vue';

@Component({
    components: {Watershed, RiverNetwork, RainstormArea},

    mixins: [MapCommon],
})
export default class GisAreaSelection extends Vue {

    private show: boolean = false; // 子窗口展示状态
    private secondData: any = [// 子窗口相关数据
        {id: 1, title: '流域', visible: false},
        {id: 2, title: '河网水系', visible: false},
        {id: 3, title: '暴雨落区', visible: false},
    ];

    private num: number = -1;

    // 点击区域选择框
    private areaSelectionClik() {
        this.show = !this.show;
        // 每次关闭区域选择时，this.id恢复为默认值
        if ( this.show) {
            this.messsageBus.emit('changeToShow', '区域选择');
            this.$store.commit('mapTools/changeNearbyQueryVisible', false);
            this.$store.commit('mapTools/changeRegionPanelVisible', false);
        }

    }

    // 点击区域选择下的子窗
    private itemClick(val: any, index: number) {
        // 点击后显示弹窗
        // this.id = this.id === val.id ? 0 : val.id;
        this.num = index;
        val.visible = !val.visible;
        this.secondData.map((obj: any, i: number) => {
            if (i !== index) {
                obj.visible = false;
            }
        });
    }
    get resultNum() {
        return this.num;
    }

    private closePanel() {
        this.num = -1;
    }

    private created() {
        this.messsageBus.on('changeToShow', (data: string) => {
            if (data !== '区域选择' ) {
               this.show = false;
            }
        });
    }
}
</script>
