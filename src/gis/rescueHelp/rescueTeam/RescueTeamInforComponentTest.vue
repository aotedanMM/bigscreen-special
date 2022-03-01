<template>
    <div class = 'rt'>
        <button @click='clearAll()'>清空所有类型数据</button>
        <button @click='clearPopup()'>清空弹窗</button>
        <div>
            互斥
            <ul>
                <li v-for = "item in testData" :key="item.id">{{item.name}}<button @click='selectSingle(item)'>添加</button><button @click='cancelSingle(item)'>移除</button></li>
            </ul>
        </div>
        <div>
            非互斥
            <ul>
                <li v-for = "item in testData" :key="item.id">{{item.name}}<button @click='selectNotSingle(item)'>添加</button><button @click='cancelNotSingle(item)'>移除</button></li>
            </ul>
        </div>
    </div>
</template>>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import RescueTeamInforComponent from './RescueTeamInforComponent';
import { rescueTeamServer, rescueSuppliesServer} from '@/api/installServer';
@Component({
  name: 'RescueTeamInforComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class IndexTest extends Vue {

    private mapId: string = '';
    private testData: any = [
        { id: 1000, pId: 1, name: '矿山隧道救援队', code: 'floodteam' },
        { id: 1001, pId: 1, name: '危险化学品救援队', code: 'fireteam' },
        { id: 1002, pId: 1, name: '消防救援队', code: 'transportationteam' },
        { id: 1003, pId: 1, name: '森林消防救援队', code: 'forestfireteam' },
        { id: 1004, pId: 1, name: '地震灾害救援队', code: 'hazardousteam' },
        { id: 1005, pId: 1, name: '医疗防疫救援队', code: 'mineteam' },
        { id: 1006, pId: 1, name: '安全水上救援队', code: 'nonmineteam' },
        { id: 1007, pId: 1, name: '社会救援队', code: 'corecompetenceteam' },
    ];
    private component: any = null;
    private mounted() {
        console.log('testgis');
        // 地图容器id
        this.mapId = 'map';
        (this as any).resolveMap(this.mapId).then((data: any) => {
            this.init(data.map);
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

        this.component = new RescueTeamInforComponent({
            map,
            mapConfig,
            symbolConfig,
            GISComponents,
            // service: rescueTeamServer,
            rescueTeamServer,
            rescueSuppliesServer,
        });
        this.component.load();
    }
    // 互斥-选中
    private selectSingle(item: any) {
        this.clearAll();
        this.component.addResource({districtCode: '110000', resourceKey: item.code});
    }
    // 互斥-取消
    private cancelSingle(item: any) {
        this.component.removeResource({districtCode: '110000', resourceKey: item.code});
    }
    // 非互斥-选中
    private selectNotSingle(item: any) {
        this.component.addResource({districtCode: '110000', resourceKey: item.code});
    }
    // 非互斥-取消
    private cancelNotSingle(item: any) {
        this.component.removeResource({districtCode: '110000', resourceKey: item.code});
    }
    // 关闭弹窗
    private clearPopup() {
        this.component.removePopup();
    }
    // 清空所有救援资源相关
    private clearAll() {
        this.component.clearAll();
    }
}
</script>
<style lang="less" scoped>
    .rt{
        position: absolute;
        top: 200px;
        left: 100px;
        background-color: aqua;
    }
</style>
