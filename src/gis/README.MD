### 目录说明

> 当前GIS功能

```

- common								通用功能、通用工具
	-	index.ts		    			组件索引
- normal							    常态
- monitorWarning					监测预警
- defensivePreparation		防御准备
- disasterJudge						灾情研判
- disasterSta						 	灾情统计
- rescueHelp						 	救援救助
- rescueProgress					 	救援进展
- message							    消息推送处理
- TestGIS.vue						    开发过程测试功能的Vue组件入口
```



### 配置说明

- 服务地址统一在配置文件中：

  ```
  # 路径
  /public/json/publishObjectPath.json
  ```

- 地图基础配置

  ```
  # 路径
  public/json/map.json
  # 如何取值
  # vue 文件中取地图配置，resolve中的参数格式为 mapConfig-${地图divId}，如
  this.$ioc.resolve('mapConfig-map');
  ```

- 地图符号统一在配置文件中：

  ```
  # 路径
  /public/json/symbol.json
  # 图片图标
  "icons": {
          "图标key值": "图标内容",
          "图标key值": {}
   },
   // 符号样式配置
   "symbols":{
     "normal":{},// 常态
     "common":{},// 通用
     "disasterJudge":{},// 灾情研判
     "disasterSta":{},// 灾情统计
     "rescueHelp":{},// 救援救助
     "rescueProgress":{},// 救援进展
   }
   # 如何取值
   # vue 文件中取地图配置，resolve中的参数格式为 symbolConfig-${地图divId}，如
   this.$ioc.resolve('symbolConfig-map');
  ```


### 开发说明

#### 开发流程

##### 创建目录

在对应场景下建功能的文件夹，如灾情研判-行政区划

目录为  demomodule/democomponent/

##### 创建代码文件

如： demomodule/democomponent/DemoComponent.ts，编码​

```
// 
// 继承于一张图组件基类
// 模块的GIS逻辑
import Util from '../../Util';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        highLightId: 'demo_comp', // 高亮id
        popupId: 'popup_demo_comp', // 弹窗唯一标识
        popupEventName: 'popup', // 详情框事件名
        featureType: 'demo_comp', // 图层标识
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
    },
    //  销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },

    load() {
        componentBase.prototype.load.call(this);
        //
        this._load();
    },

    addListeners() {
        // 添加事件监听，load调用时父类触发
    },

    unload() {
        this.options.simpleRenderMgr.remove(this.options.featureType);
        this.closePopup();
        this._removehighlight();
        componentBase.prototype.unload.call(this);
    },

    removeListeners() {
        // 移除事件监听，unload调用时父类触发
    },

    closePopup() {
        this.options.popupManager.remove(this.options.popupId);
    },

    async _load() {
        const list: any = await this.options.service.getDemoData();
        const opts: any = {};
        opts.featureType = this.options.featureType;
        opts.idField = 'id'; // 数据唯一标识的属性
        opts.list = list; // 数据列表
        opts.type = 1; // 使用feature渲染
        opts.geometryBuilder = new this.options.PointGeometryBuilder({
            geometryField: ['longitude', 'latitude'],
        });
        const symbolObj: any = {
            type: 'PictureMarkerSymbol',
            options: {
                width: 34,
                height: 46,
                offsetX: 17,
                offsetY: 46,
                opacity: '1',
                rotation: '0',
                source: this.options.symbolConfig.icons.demo_icon,
            },
        };
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                return G.utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        opts.symbolBuilder = new SymbolBuilder(),
        opts.listeners = {
            click: (event: any) => {
                const element: any = event[0].element;
                console.debug('点击：');
                console.debug(element);
                this.closePopup();
                this._removehighlight();
                this._addHighlight(element);
                this.options.popupManager.addSimple({
                    id: this.options.popupId,
                    anchor: [ element.geometry.x, element.geometry.y],
                    className: 'demo-tooltip',
                }).then((content: any) => {
                    this.fire(this.options.popupEventName, {
                        data: Util.attributeSet2Object(element.attributeSet),
                        containerId: content.containerId,
                        type: 'demo',
                    });
                });
            },
        };
        this.options.simpleRenderMgr.add(opts);
        this._fit();
    },

    // 调整视野
    _fit() {
        const layer: any = this.options.simpleRenderMgr.getLayer(this.options.featureType);
        const extent: any = G.utils.LayerUtil.getLayerExtent(layer);
        this.map.pan(extent, new Array(4).fill(100));
    },

    // 添加高亮
    _addHighlight(element: any) {
        const coordinate: any = [element.geometry.x, element.geometry.y];
        const symbolObj: any = {
            type: 'PictureMarkerSymbol',
            options: {
                width: 64,
                height: 70,
                offsetX: 32,
                offsetY: 70,
                opacity: 1,
                rotation: 0,
                source: this.options.symbolConfig.icons.demo_icon_hover,
            },
        };
        const options = {
            data: {
              type: 'wkt',
              geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
            },
            style: symbolObj,
            // 不闪烁
            blink: {
              enable: false,
            },
          };
        this.options.featureHighlight.addHighlight(this.options.highLightId, options);
    },

    // 移除高亮
    _removehighlight() {
        this.options.featureHighlight.removeHighlight(this.options.highLightId);
    },
});

export default component;

```

##### 测试验证

1、在ts文件同级目录下创建对应的vue文件 ，如DisasterJudgeDistrictComponentTest.vue；

引入ts文件，初始化并测试功能

```
<template>
  <div>
    <input type="button" value="加载" @click="load">
    <input type="button" value="卸载" @click="unload">
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import DemoComponent from './DemoComponent';
import {demoServer} from '@/api/installServer';

@Component({
  name: 'DemoComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class DemoComponentTest extends Vue {

  private mapId: string = '';
  private getComponent: any ;

  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
    });
  }

  //  地图加载完成后，初始化
  private init(map: any) {
    const temp: any = this;
    // 地图配置
    const mapConfig = temp.$ioc.resolve(`mapConfig-${this.mapId}`);
    // 符号配置
    const symbolConfig = temp.$ioc.resolve(`symbolConfig-${this.mapId}`);
    // 通用的地图组件实例
    const GISComponents = temp.$ioc.resolve(`GISComponents-${this.mapId}`);
    //
    const component = new DemoComponent({
      map,
      symbolConfig,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      popupManager: GISComponents.popupManager,
      PointGeometryBuilder: GISComponents.PointGeometryBuilder,
      featureLocate: GISComponents.featureLocate,
      featureHighlight: GISComponents.featureHighlight,
      service: demoServer,
    });
    this.getComponent = () => {
      return component;
    };
  }

  private load() {
    this.getComponent().load();
  }

  private unload() {
    this.getComponent().unload();
  }
}
</script>
<style lang="less" scoped>
</style>
```

2、在TestGIS.vue中引入测试的vue（TestGIS文件不提交）；

##### 功能集成

1、 模块索引文件中添加模块文件引入，如：

```
// file  gis/index.ts
import DemoModule from './demomodule/Module';
// 模块文件索引 key 为模块名，value为模块类
export default {
    demo: DemoModule,
};

```

2、 在对应模块的目录下的index.ts引入组件，如：

```
// file  gis/demomodule/index.ts
import DemoComponent from './democomponent/DemoComponent';
export default {
    DemoComponent,
};
```

3、在对应模块下的Module.ts中初始化组件，如：

```
// file  gis/demomodule/module.ts
import BaseModule from '../BaseModule';
import componentCol from './index';
import {demoServer} from '@/api/installServer';
export default class Module extends BaseModule {
    constructor(opts: any) {
        super(opts);
        this.componentClazzes = componentCol;
    }
    /**
     * 创建组件
     * @param opts {Object}
     */
    public createComponents(opts: any) {
        const components: any = componentCol;
        // 示例
        const demoComponent = new components.DemoComponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            popupManager: this.options.GISComponents.popupManager,
            featureLocate: this.options.GISComponents.featureLocate,
            featureHighlight: this.options.GISComponents.featureHighlight,
            service: demoServer,
        });
        // demo为组件名
        this.components.demo = demoComponent;
    }
}
```

##### 前端联调

1、前端页面通过vue-container共享获取到GIS功能，如下

> ​	注意：在vue文件中不允许把component定义到vue的属性上（会使GIS组件属性被监测，导致性能问题），按如下的方法获取

```
 private getComponent() {
    const gisModules = this.$ioc.resolve('GISModules-map');
    // gisModules.模块名.getComponent('组件名')
    const component = gisModules.demo.getComponent('demo');
    return component;
  }
```

2、对地图功能的监听，需要在解析完地图后执行，如下

```
 private mounted() {
    (this as any).resolveMap('map').then(() => {
      this.getComponent().on('popup', this.onPuppup, this);
      this.getComponent().load();
    });
  }
```

3、完整代码如下：

```
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'DistrictLeftDialog',
  mixins: [MapCommon], // GIS 将地图解析方法混入当前组件
})
export default class DistrictLeftDialog extends Vue {
  // 获取地图功能
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISModules-map');
    const component = gisModules.demo.getComponent('demo');
    return component;
  }
  private mounted() {
    (this as any).resolveMap('map').then(() => {
      this.getComponent().on('popup', this.onPuppup, this);
      this.getComponent().load();
    });
  }
  // 离开页面清理地图
  private beforeDestroy() {
    const component = this.getComponent();
    component.off('popup', this.onPuppup, this);
    component.unload();
  }
}
</script>
```



#### 约定规则

##### 最小依赖

- 组件依赖api下的server、其他通用组件的依赖、公共配置，必须通过构造传递。

  ```

  import TeamDispatchComponent from './TeamDispatchComponent';
  import SimpleRouterPlanComponent from '../../common/routeplan/SimpleRouterPlanComponent';
  import {rescueTeamServer} from '@/api/installServer';
  import publishObjectPath from '@/util/configRegistry';
  const simpleRouterComponent = new SimpleRouterPlanComponent({
          map,
          server: publishObjectPath.value.egis,
      });
  // 调度部署
  const teamDispatchComponent = new TeamDispatchComponent({
        map,
        service: rescueTeamServer,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        featureHighlight: GISComponents.featureHighlight,
        featureLocate: GISComponents.featureLocate,
        popupManager: GISComponents.popupManager,
        symbolConfig,
        eventInfo,
        egisServer: publishObjectPath.value.egis,
        simpleRouter: simpleRouterComponent,
  });
  ```

- ……

##### 方法约定

- initialize  只初始化对象实例

- destroy 销毁对象实例

- load 实现状态激活（加载图层、事件监听等）

- unload  实现状态清理（卸载图层、卸载监听等）

- openPopup 实现根据数据类型+id完成地图定位、弹出详情框；

- closePopup 实现地图弹出框清理；

- 地图点击弹出详情框，事件名称统一为popup

  ```
  // 派发弹框事件
  const event: any ={
    type: 'RescueTeam',
    content: {
      containerId: '', // 容器id
    },
    data: {
      id: '', // 数据唯一标识
      x: '',  // 属性名统一，提供周边查询、路径规划使用
      y: '',  // 属性名统一，提供周边查询、路径规划使用
    }
  };
  this.fire('popup',);
  ```

- ……


##### 事件约定

- 地图要素点击弹框的事件，默认统一命名为popup，如果有多种弹框事件则以 popup结尾，如 county_popup
- ……


##### 变量共享

- Vue组件中获取地图对象

  ```
  // 1 混入地图工具
  import MapCommon from '@/util/MapCommon';
  @Component({
    mixins: [MapCommon],
  })

  // 2 获取地图对象
  // 地图容器ID
  const mapId = 'map';
  (this as any).resolveMap(mapId).then((data: any) => {
      // 获取地图
      const map = data.map;
  });
  ```

- 通用地图功能组件

  ```
  // 在Vue中获取地图功能组件
  const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);

  // 内容：包括
  {
      // 弹出框管理器
      popupManager,
      // 要素定位
      featureLocate,
      // 要素高亮
      featureHighlight,
      // 图层管理
      layerManager,
      // 快速渲染组件
      simpleRenderMgr,
      // 缓冲区
      bufferDraw,
      // 点数据坐标构建器，配合simpleRenderMgr使用，统一检查坐标
      PointGeometryBuilder,
      // 全局事件派发器，可通过dispatcher 向messageBus分发事件
      eventDispatcher,
  };
  ```

- 事件信息：通过全局vue-container容器中的eventInfo变量进行共享，该变量保存了事件相关信息，均集成于事件信息类；

  ```
  // 事件信息
  common\EventInfo.ts
  // 地震事件信息
  common\EarthQuakeEventInfo.ts
  ```



#### 其他

##### 消息推送监听

- 代码目录

  ```
  message\
  ```



