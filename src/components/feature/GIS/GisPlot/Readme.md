测绘:
```vue
<template>
    <div class="container">
        <!--加载一个地图-->
        <EMap targetId="PlotMap" :config="mapConfig"></EMap>
        <!--标绘-->
        <gis-plot-test :options="options"></gis-plot-test>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                mapConfig:window.EMAP_CONFIG,
                //标绘参数
                options:{
                    //地图容器唯一标识
                    mapId: "map",
                    //配置文件目录
                    configDir: "./json/plot/",
                    //图片资源目录
                    iconImageDir: "./imgs/gisPlot/",
                    //服务配置
                    service: {
                        RestPlotService: "NOSQL",
                        serverUrl: "http://172.17.10.131:3001"
                    },
                    //面板样式
                    panelStyle: {
                        // right: "10px",
                        // top: "20px",
                    },
                    //编辑框
                    editorStyle: {
                        // right: "10px",
                        // top: "20px",
                    },
                    //拖拽参数
                    drag: {
                        container: ".layoutMain"
                    }
                    }
            }
        }
    }
</script>

```
