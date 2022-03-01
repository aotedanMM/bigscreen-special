测绘:
```vue
<template>
    <div class="container">
        <!--加载一个地图-->
        <EMap ref="map" targetId="cehuiMap" :config="mapConfig"></EMap>
        <!--测绘-->
        <gis-cehui :options="options"></gis-cehui>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                mapConfig:window.EMAP_CONFIG,
                options:{
                    mapId: 'map'
                }
            }
        }
    }
</script>

```
