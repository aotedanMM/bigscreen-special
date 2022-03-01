

## 外部标绘相关说明

### businessPlot发出请求，GisPlot.vue 接收

#### 开始外部标绘
    this.messageBus.on('startBusinessPlot', (opts: any) => {});
    opts = {
        businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
        options: {
            "name": "多边形",
            "type": "Polygon",
            "key": "polygon",
            "symbol": {
                "type": "SimpleFillSymbol",
                "options": {
                    "borderColor": { "a": 179, "r": 255, "g": 0, "b": 0 },
                    "fillColor": { "a": 179, "r": 255, "g": 0, "b": 0 },
                    "borderThickness": 2
                }
            }
        }
    }

#### 外部标绘编辑
    this.messageBus.on('businessPlotEdit', (opts: any) => {});
    opts =  {
        id: "e65283a9-1da3-870d-c525-39cc03c0022c",
        symbol:
        {
            borderColor: "#BA7979",
            borderOpacity: 184,
            fillColor: "#FF0000",
            fillOpacity: 179,
            inputDesc: "",
            lineStyle: "5",
            linewidth: 2,
            type: "SimpleFillSymbol"
        }
    }
#### 外部标绘保存
    this.messageBus.on('businessPlotSave', (opts: any) => {});
    opts =  {
        businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
        name: "红"
    }
#### 外部标绘方案列表查询
    this.messageBus.on('businessPlotList', (opts: any) => {});
    opts =  {
        businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
        page: 1,
        pageSize: 5
    }
#### 外部标绘方案列表 关键字查询
    this.messageBus.on('businessPlotListSearch', (opts: any) => {});
    opts =  {
        businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
        name: '红',
        page: 1,
        pageSize: 5
    }
#### 外部标绘方案加载
    this.messageBus.on('businessPlotSchemaShow', (opts: any) => {});
    opts =  {
        schemaId: "1ca46c2eae917a0d4d15f269c5c36a18",
    }
#### 外部标绘方案隐藏
    this.messageBus.on('businessPlotSchemaClean', (opts: any) => {});
    opts =  {
        schemaId: "1ca46c2eae917a0d4d15f269c5c36a18",
    }
#### 外部标绘方案删除
    this.messageBus.on('businessPlotSchemaDelete', (opts: any) => {});
    opts =  {
        schemaId: "1ca46c2eae917a0d4d15f269c5c36a18",
        businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
        page: 1,
        pageSize: 5
    }
#### 暴雨落区 标绘 进入处置
    this.messageBus.on('businessPlotStartDisposal', (opts: any) => {});
    opts =  {
        businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
        name: '', // 如果flag=true 自动保存 则name必须传值
        flag: true // 是否自动保存
    }


###  GisPlot.vue发出请求，businessPlot接收

#### 查询标绘方案列表回调
this.messsageBus.emit('refreshBusinessPlotSchemaList', opts);
opts = {
    data: {
        list: [ // data.list 存方案列表
            {
                方案内容
            }
        ]
    }, 
    flag  // 当前是否需要自动高亮第一个方案，是否需要再议
}

#### 点击标绘图形打开编辑面板
this.messsageBus.emit('businessPlotStartEdit', opts);
opts = {
    id: "9da893e9-c8e3-9740-f942-db5a73dc275c",
    businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
    schemaId: "1ca46c2eae917a0d4d15f269c5c36a18",
    symbol: {
        borderColor: "#1414FA",
        borderOpacity: 100,
        fillColor: "#FFFFFF",
        fillOpacity: 100,
        inputDesc: "",
        lineStyle: "5",
        linewidth: 4,
        type: "SimpleFillSymbol"
    },
    plotProperty: ""
}

#### 标绘方案保存回调-成功
this.messsageBus.emit('businessSchemaSaveSuccess');
无参数

#### 标绘方案保存回调-失败
this.messsageBus.emit('businessSchemaSaveFail', opts);
opts = 错误信息

#### 地图触发删除标绘图形
this.messsageBus.emit('businessDeletePlotElement', {data});
data = 当前删除的图形信息
