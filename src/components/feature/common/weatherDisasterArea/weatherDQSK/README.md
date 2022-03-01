
# 当前实况（天气基础组件样式二）

最基本的用法

 组件内容高宽百分百，需要内容调用者来决定显示的位置、大小及组件的外框样式。

```js

let weatherDQSKObj = {
        DAYMS: '多云',
        DQ: '北京',
        DQQW: '1℃',
        FL: '3级',
        FX: '北风',
        icon: 'en_8',
        SD:'15%',
        JS:'0.3mm'
    };

<WeatherDqsk :weatherDQSKObj="weatherDQSKObj" ></WeatherDqsk>

```