
# 区域选择高亮地图并更新研判数据
```xml
    <CitySelectShowInfo style="z-index:999; left:400px"
      v-if="$store.state.mapModule.showRegionPanel" 
      :option="citySelectShowInfoOption" 
      @change="onCitySelectShowInfoChange" @close="onCitySelectShowInfoClose">
    </CitySelectShowInfo>
```
```ts
import CitySelectShowInfo from '@/components/feature/gis/CitySelectShowInfo/CitySelectShowInfo.vue';
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
