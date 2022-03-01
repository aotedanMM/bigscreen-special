
# 区域选择组件
```xml
    <RegionSelection style="z-index:999; left:400px"
      v-if="$store.state.mapModule.showRegionPanel" 
      :option="regionSelectionOtion" 
      @change="onRegionSelectionChange" @close="onRegionSelectionClose">
    </RegionSelection>
```
```ts
import RegionSelection from '@/components/feature/gis/RegionSelection/RegionSelection.vue';
import { locationServer, regionSelectionServer } from '@/api/installServer';
  /**
   * 区域选择初始化参数（默认为全国）
   */
  private regionSelectionOtion: any = {
    districtCode: '000000',
    service: regionSelectionServer,
  };

  private onRegionSelectionClose() {
    
  }; 
  // 区域选择变化
  private onRegionSelectionChange(data: any) {
    console.log(data);
  };
```
