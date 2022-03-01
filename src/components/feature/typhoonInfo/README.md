
# 台风组件
```xml
    <Typhoon class = "TyphoonPanelMonitor-wrap" 
      :option="typhoonOption" @close="closeTyphoon" 
      v-if="$store.state.mapTools.typhoonVisible">
    </Typhoon> 
```
```ts
import Typhoon from '@/components/feature/gis/typhoon/Typhoon.vue';

  // 台风初始化参数
  private typhoonOption = {
    service: this.getTyphoonServer(),
  };
  // 打开台风
  public showTyphoon() {
    this.$store.commit('mapTools/changeTyphoonVisible', true);
  }
  // 关闭台风
  public closeTyphoon() {
    this.$store.commit('mapTools/changeTyphoonVisible', false);
  }
  private getTyphoonServer() {
    const typhoonServerConf =  publishObjectPath.value.typhoonServer;
    typhoonServerConf.httpRequest = new G.base.HttpRequest();
    const typhoonServer = new G.service.TyphoonServiceImpl(typhoonServerConf);
    return typhoonServer;
  }
```
