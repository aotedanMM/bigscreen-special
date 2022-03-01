地图切换:
```vue
<template>
    <div class="container">
        <!--加载一个地图-->
        <EMap ref="map" targetId="switchMap" :config="mapConfig"></EMap>
        <!--地图-->
        <gis-switch-map-test :options="options" style="position:relative;"></gis-switch-map-test>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                mapConfig:window.EMAP_CONFIG,
                options:{
                    mapId: 'map',
                    baseLayers:
                    [
                        {
                            "id": "tiandituLayer_img",
                            "title": "影像",
                            "name": "影像",
                            "icon": "./imgs/gisSwitchMap/earth.png",
                            "type": "group",
                            "attr": "basics",
                            "visible": true,"//": "是否显示",
                            "style": "default",
                            "layers": [
                                {
                                    "layers": "img",
                                    "matrixSet": "c",
                                    "format": "tiles",
                                    "tileType": 102,
                                    "style": "default",
                                    "url": "http://t0.tianditu.gov.cn/img_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&",
                                    "projection": "EPSG:4326"
                                },
                                {
                                    "layers": "cta",
                                    "matrixSet": "c",
                                    "format": "tiles",
                                    "tileType": 102,
                                    "style": "default",
                                    "url": "http://t0.tianditu.gov.cn/cta_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&",
                                    "projection": "EPSG:4326"
                                }
                            ]
                        },
                        {
                            "id": "tiandituLayer_vec",
                            "icon": "./imgs/gisSwitchMap/vector.png",
                            "title": "矢量",
                            "type": "group",
                            "layers": [
                                {
                                    "layers": "vec",
                                    "matrixSet": "c",
                                    "format": "tiles",
                                    "tileType": 102,
                                    "url": "http://t0.tianditu.gov.cn/vec_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&",
                                    "projection": "EPSG:4326"
                                },
                                {
                                    "layers": "cva",
                                    "matrixSet": "c",
                                    "format": "tiles",
                                    "tileType": 102,
                                    "url": "http://t0.tianditu.gov.cn/cva_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&",
                                    "projection": "EPSG:4326"
                                }
                            ]
                        },
                        {
                            "id": "tiandituLayer_vec",
                            "icon": "./imgs/gisSwitchMap/ter.png",
                            "title": "地形",
                            "type": "group",
                            "layers": [
                                {
                                    "layers": "ter",
                                    "matrixSet": "c",
                                    "format": "tiles",
                                    "tileType": 102,
                                    "url": "http://t0.tianditu.gov.cn/ter_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&",
                                    "projection": "EPSG:4326"
                                },
                                {
                                    "layers": "cta",
                                    "matrixSet": "c",
                                    "format": "tiles",
                                    "tileType": 102,
                                    "url": "http://t0.tianditu.gov.cn/cta_c/wmts?tk=4f62e1d82bd46e2ff470b291c2260156&&",
                                    "projection": "EPSG:4326"
                                }
                            ]
                        },
                        {
                            "id": "tiandituLayer_vec",
                            "icon": "./imgs/gisSwitchMap/ter.png",
                            "title": "高清影像",
                            "type": "group",
                            "layers": [
                                {
                                    "id":"xyz",
                                    "layerType":1,
                                    "wrapX":true,
                                    "title": "谷歌地图",
                                    "tileType": 104,
                                    "url":"http://www.google.cn/maps/vt?lyrs=s@852&gl=cn&x={x}&y={y}&z={z}"
                                },
                                {
                                    "id":"xyz",
                                    "layerType":1,
                                    "wrapX":true,
                                    "title": "谷歌地图",
                                    "tileType": 104,
                                    "url":"http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
</script>

```
