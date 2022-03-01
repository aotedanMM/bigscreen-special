<template>
    <div>
        <div id="buttons" class="cehuimain" style="z-index: 99999;position:absolute">
            <span>
                <input type="button" value="测量线" id="measureline" @click="allTestFunc('measureline')">
                <input type="button" value="测量多边形" id="measurepolygon" @click="allTestFunc('measurepolygon')">
                <input type="button" value="取消测量" id="cancel" @click="allTestFunc('cancel')">
                <input type="button" value="完成测量" id="finish" @click="allTestFunc('finish')">
                <input type="button" value="清除测量" id="clear" @click="allTestFunc('clear')">
            </span>
        </div>
        <div id="mousePositionDiv" class="cehuimain">
            <div id='mousePosition'> 
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import GISToolComponent from './GISToolComponent';
import publishObjectPath from '@/util/configRegistry';

@Component({
    name: 'GisMeaComponnet',
    mixins: [MapCommon],
})
export default class GisMeaComponnet extends Vue {

    @Prop() public options: any;
    // 监听地图初始化
    public measureComponent: any;

    private mounted() {
        // 获取地图，地图加载完成后进入回调
        const self: any = this;
        self.resolveMap('map').then((event: any) => {
            this.initMeasure(event.map);
        });
    }

    private allTestFunc(type: any) {
        // 测距的显示内容，需返回要显示的html字符串
        switch (type) {
            case 'measureline':
                this.measureComponent.measureLength();
                break;
            case 'measurepolygon':
                this.measureComponent.measureArea();
                break;
            case 'finish':
                this.measureComponent.finish();
                break;
            case 'cancel':
                this.measureComponent.cancel();
                break;
            case 'clear':
                this.measureComponent.clear();
                break;
        }

    }
    private initMeasure(map?: any) {
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
                    return '总长:' + length1 + '公里fff';
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
            console.debug('>> 测量面积');
        };

        // 预先创建测量图层-可选
        const measureLayerId: string = 'measure-layer';
        // 测量组件
        this.measureComponent = new G.common.Measure({
            layerId: measureLayerId,
            map,
            styleName: ['emap-measure-node-tooltip', 'emap-measure-tooltip'],
            lengthTipFn,
            areaTipFn,
        });
        const gisToolComponent = new GISToolComponent({
            map,
            measureComponent: this.measureComponent,
            config: publishObjectPath.value,
       });
    }

}
</script>
<style lang="less">
  .emap-measure-node-tooltip{
  display: none;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 1px;
  border-radius: 1px;
  border: 1px solid #7B7878;
  font-size: 12px;
  color:#7B7878;
}
.emap-measure-tooltip{
  display: none;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 3px;
  border-radius: 1px;
  border: 1px solid #c80000;
  font-size: 12px;
  color:#000;
  font-weight:bold;
}
</style>
