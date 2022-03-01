### 1目录

```
-	IFrameMessageBus.ts					IFrame消息分发
-	IFrameMessageNames.ts				IFrame消息名，所有窗口交互的消息（根据业务扩展）
-	IFrameMessageInterface.ts			IFrame消息参数格式定义，所有窗口交互的消息格式（根据业务扩展）
-	IFrameMessageListeners.ts			IFrame消息监听处理，所有IFrame消息监听（根据业务扩展）	
-	IFrameMessageBusTest.ts				测试
```

### 2 说明

#### 2.1 大屏

##### 2.1.1 集成

```
//此方法要在中间地图的IFrame初始化完成后执行
  private initIFrameBus() {
    const iframeMessageBus: IFrameMessageBus = new IFrameMessageBus();
    // 绑定窗口
    iframeMessageBus.bind(window);
    if ((window as any).parent) { // 绑定接收消息的窗口为父窗口window
      iframeMessageBus.addTargetWindow((window as any).parent.window);
    }
    // iframe 消息监听
    const iframeMessageListeners: IFrameMessageListeners = new IFrameMessageListeners(iframeMessageBus, this);
    iframeMessageListeners.bind();
    (ModuleLoader as any).gcontainer.register('iframeMessageBus', iframeMessageBus);
  }
```

##### 2.1.2 发送事件

```
import { Injectable, Container } from 'ca-middleware';
import {MessageNames} from './IFrameMessageNames';
export default class TestVue extends Vue {
  @Injectable() public container!: Container;
  private btnClick() {
    // 点击按钮显示预警信息
    const visible: boolean = true;
    const iframeMessageBus: any = this.container.resolve('iframeMessageBus');
    iframeMessageBus.dispatch(MessageNames.bigScreen.TOGGLE_EARLYWARNING, { visible} );
  }
}
```

#### 2.2 地图屏

##### 2.2.1 集成

```
// eads App.vue
  private initIFrameBus() {
     const iframeMessageBus: IFrameMessageBus = new IFrameMessageBus();
    // 注册到共享变量，vue组件中通过 this.$ioc.resolve('iframeMessageBus') 获取
    this.$ioc.register('iframeMessageBus', iframeMessageBus);
    // 绑定窗口
    iframeMessageBus.bind(window);
    if ((window as any).parent) { // 绑定接收消息的窗口为父窗口window
      iframeMessageBus.addTargetWindow((window as any).parent.window);
    }
    // iframe 消息监听
    const iframeMessageListeners: IFrameMessageListeners = new IFrameMessageListeners(iframeMessageBus, this);
    iframeMessageListeners.bind();
  }
```

##### 2.2.2 监听

> 定义事件

```
// IFrameMessageNames.ts 定义消息名
export const MessageNames: any = {
    // 大屏发出的事件
    bigScreen: {
        // 切换预警信息显示隐藏
        TOGGLE_EARLYWARNING: 'TOGGLE_EARLYWARNING',
    },
    // 中间地图发出的事件
    eads: {
    },
};
```

```
// IFrameMessageInterface.ts 定义消息参数
export interface ToggleEarlyWarning {
    visible: boolean; // true显示，false隐藏
}
```

> 监听

```
// IFrameMessageListeners.ts 监听
import {IFrameMessageBus} from './IFrameMessageBus';
import {MessageNames} from './IFrameMessageNames';
import {
    ToggleEarlyWarning,
} from './IFrameMessageInterface';
import Vue from 'vue';
/**
 * IFrame消息监听，触发不同的动作
 */
export class IFrameMessageListeners {
    private bus: IFrameMessageBus;
    private app: Vue; // App.vue 实例
    constructor(bus: IFrameMessageBus, app: Vue) {
        this.bus = bus;
        this.app = app;
    }

    public bind() {
        const messageBus: any = (this.app as any).messsageBus;
        const store: any = (this.app as any).$store;
        // 大屏触发的切换预警信息显示隐藏
        this.bus.listen(MessageNames.bigScreen.TOGGLE_EARLYWARNING, (data: ToggleEarlyWarning) => {
          // 这里通过messageBus或者store来通知到预警模块，控制显隐
        });
    }
}

```