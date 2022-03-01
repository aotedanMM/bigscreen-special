<template>
  <div class='TyphoonInfoContainer'>
    <el-scrollbar class="cmp-scrollbar-y" style="height:100%;">
      <Typhoon 
            :option="typhoonOption">
      </Typhoon>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Typhoon from '@/components/feature/typhoonInfo/Typhoon.vue';
import publishObjectPath from '@/util/configRegistry';
@Component({
  name: 'TyphoonInfoContainer',
  components: {
    Typhoon,
  },
})
export default class TyphoonInfoContainer extends Vue {
  private typhoonOption = {
    service: this.getTyphoonServer(),
  };
  private getTyphoonServer() {
    const typhoonServerConf =  publishObjectPath.value.typhoonServer;
    typhoonServerConf.httpRequest = new G.base.HttpRequest();
    const typhoonServer = new G.service.TyphoonServiceImpl(typhoonServerConf);
    return typhoonServer;
  }
}
</script>
<style lang="less" scoped>
.TyphoonInfoContainer{
    width: 100%;
    height: 846px;
}
</style>
