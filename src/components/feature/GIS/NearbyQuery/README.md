
# 区域选择组件
```xml
    <NearByQuery style="z-index:999"
      v-if ="$store.state.mapTools.nearbyQueryVisible &&!$store.state.gisMenuSearch.showResultPanel" 
      @change="onNearbyChange" @close="onNearbyClose">
    </NearByQuery>  
```
```ts
import NearByQuery from '@/components/feature/GIS/NearbyQuery/NearbyQuery.vue';
  // 关闭
  private onNearbyClose() {
    
  }; 
  // 变化
  private onNearbyChange(data: any) {
    console.log(data);
  };
```
