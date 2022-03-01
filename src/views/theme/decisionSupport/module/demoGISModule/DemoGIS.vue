<template>
    <div class="layout-grid-3cols" style="position:absolute;top:30px">
        <!-- <gis-cehui v-if="isMeasureShow" :mapId="mapId"></gis-cehui> -->
        <gis-cehui v-if="isMeasureShow" :options="optionsMeasure"></gis-cehui>
        <span>
            <input type="button" value="标绘" @click="showPlot" />
        </span>    
        <!--<gis-plot v-if="isPlotShow" :options="options"></gis-plot>-->
        <gis-switch-map v-if="isSwitchShow" :options="optionsSwitch"></gis-switch-map>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import gisCehui from '@/components/feature/GIS/GisCehui/GisCehui.vue';
import gisPlot from '@/components/feature/GIS/GisPlot/GisPlot.vue';
import GisSwitchMap from '@/components/feature/GIS/GisSwitchMap/GisSwitchMap.vue';
import {disasterJudgeServer } from '@/api/installServer';
import EarthQuakeEventInfo from '@/gis/event/EarthQuakeEventInfo';
// 通用
import commonComps from '@/gis/common/index';
// 灾情研判
import disasterJudgeComps from '@/gis/disasterJudge/index';


// GIS模块

@Component({
    name: 'DemoGIS',
    components : {
        gisCehui,
        gisPlot,
        GisSwitchMap,
    },
    mixins: [MapCommon],
})
export default class DemoGIS  extends Vue {

    public mapId: string = '';
    public options: any;
    public optionsMeasure: any;
    private optionsSwitch: any;
    private gisComponent: any;
    private isMeasureShow: boolean = false;
    private isPlotShow: boolean = false;
    private isSwitchShow: boolean = false;

    public beforeDestroy() {
        if (this.gisComponent) {
            this.gisComponent.destroy();
        }
    }

    private mounted() {
        // 地图容器id
        this.mapId = 'map';
        (this as any).resolveMap(this.mapId).then((data: any) => {
            this.init(data.map);
            this.initMeasure(data.map);
        });
    }

    //  地图加载完成后，初始化
    private init(map: any) {
        // 地图配置
        const mapConfig = this.$ioc.resolve(`mapConfig-${this.mapId}`);
        // 符号配置
        const symbolConfig = this.$ioc.resolve(`symbolConfig-${this.mapId}`);
        // 通用的地图组件实例
        const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
        //
        // this.testZaiSunDistrict(map);
        //
        this.testPop(map);
        //
        this.testResource(map);
    }

    // 灾损的行政区划功能
    private testZaiSunDistrict(map: any) {
        const eventInfo = new EarthQuakeEventInfo([], []);
        const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
        const disasterJudgeDistrictComponent = new disasterJudgeComps.DisasterJudgeDistrictComponent({
            map,
            service: disasterJudgeServer,
            eventInfo,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            popupManager: GISComponents.popupManager,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
        });
        // 点击按钮时调用
        disasterJudgeDistrictComponent.load();
        // 显示乡镇
        // disasterJudgeDistrictComponent.toggleTownLayer(true);
        // 显示区县
        // disasterJudgeDistrictComponent.toggleCountyLayer(true);
    }

    // 灾情研判人口热力
    private testPop(map: any) {
        const eventInfo = new EarthQuakeEventInfo([], []);
        const component = new disasterJudgeComps.DisasterJudgePopComponent({
            map,
            service: disasterJudgeServer,
            eventInfo,
        });
        //
        component.load();
        //
        component.showHeatMap();
    }


    // 灾情研判资源
    private testResource(map: any) {
        const eventInfo = new EarthQuakeEventInfo([], []);
        const component = new disasterJudgeComps.DisasterJudgeResourceComponent({
            map,
            // 资源类型
            type: 'School',
            service: disasterJudgeServer,
            eventInfo,
        });
        //
        component.load();
        // test
        component.showResource(['Level10']);
    }

    // 示例初始化测量
    private initMeasure(map: any) {
        const lengthTipFn = (type: any, length: any) => {
            if (!isNaN(length) ) {
                length = (length / 1000).toFixed(2);
            }
            const createHtmlFn: any = {
                // 起点
                start() {
                    return '起点';
                },
                // 中间点
                node( length1: any) {
                    return length1 + '公里';
                },
                // 终点
                end( length1: any) {
                    return '总长:' + length1 + '公里';
                },
            };
            const fn = createHtmlFn[type];
            if (Object.prototype.toString.call(fn) === '[object Function]') {
                return createHtmlFn[(type)](length);
            }
        };
        // 测面积的显示内容，需返回要显示的html字符串
        const areaTipFn = (length: any, area: any) => {
            length = (length / 1000).toFixed(2);
            area = (area / 1000000).toFixed(2);
            return '周长:' + length + '公里 <br/>面积:' + area + '平方公里';
        };
        // 预先创建测量图层-可选
        const measureLayerId: string = 'measure-layer';
        // 测量组件
        const measureComponent = new window.G.common.Measure({
            layerId: measureLayerId,
            map,
            styleName: ['emap-measure-node-tooltip', 'emap-measure-tooltip'],
            lengthTipFn,
            areaTipFn,
        });
        // test，通过控制台调用方法测试
        (window as any).measureComponent = measureComponent;
    }
}
</script>
<style lang="less" scoped>
</style>
