<template>
  <div>
    <div class="btn">
      <!-- <button @click="getpoint()">点</button>
      <button @click="getline()">线</button>
      <button @click="getpolygon()">面</button> -->
      <button @click="closePop()">清空弹窗</button>
      <button @click="clearAll()">清空所有</button>
      <ul>
        <li v-for="(item) in riskTrouble" :key="item.name">
          <div class="type">{{item.name}}</div>
          <ul>
            <li v-for="(value,key,index) in item.value" :key="index">
              {{key}}: {{value.length}}
              <button @click="add(value, key ,item.id)">show</button>
              <button @click="remove(value, key ,item.id)">hide</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import RiskTroubleCmponent from './RiskTroubleCmponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
@Component({
  name: 'RiskTroubleCmponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class IndexTest extends Vue {

  private mapId: string = '';
  private component: any = '';
  private riskTrouble: any = [
    {
      id: 'dz',
      name: '地灾隐患点',
      value: [
        {name: '特大', num: 0},
        {name: '重大', num: 0},
        {name: '较大', num: 0},
        {name: '一般', num: 0},
      ],
    },
    {
      id: 'qy',
      name: '重大企业',
      value: [
        {name: '特大', num: 0},
        {name: '重大', num: 0},
        {name: '较大', num: 0},
        {name: '一般', num: 0},
      ],
    },
    {
      id: 'ss',
      name: '重点设施',
      value: [
        {name: '特大', num: 0},
        {name: '重大', num: 0},
        {name: '较大', num: 0},
        {name: '一般', num: 0},
      ],
  }];
  private mounted() {
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
    //
    const eventInfo = new EarthQuakeEventInfo('', {});
    this.component = new RiskTroubleCmponent({
      map,
      symbolConfig,
      eventInfo,
      GISComponents,
    });
    this.component.load();
    this.getOneType('dz');
    this.getOneType('qy');
    this.getOneType('ss');
  }

  private getOneType(type: any) {
    this.component._queryRisk(type).then((result: any) => {
      const obj = this.riskTrouble.find((item: any) => {
        return item.id === type;
      });
      console.log('result', result);
      console.log('key', Object.keys(result)[0]);
      obj.value = Object.values(result)[0];
      console.log(obj.value);
    });
  }

  private getline() {
    // this.component.load();
    // let self = this;
    // this.component.queryRisk('dz').then((res: any) => {
    //   self.component.addPointData(res,3,'dz');
    // })
  }
  // 添加数据
  private add(value: any, levels: any, type: any) {
    this.component.addResource({type, levels});
  }
  // 移除数据
  private remove(value: any, levels: any, type: any) {
    this.component.removeResource({type, levels});
  }
  // 关闭弹窗
  private closePop() {
    this.component.closePopup();
  }
  // 清空所有
  private clearAll() {
    this.component.clearAll();
  }
}
</script>
<style lang="less" scoped>
.btn{
  position: absolute;
  left: 100px;
  top: 200px;
  z-index: 1000;
  background-color: gray;
  .type{
    background-color: #333;
    color: white;
  }
}
</style>