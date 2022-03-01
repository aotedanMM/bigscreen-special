<template>     
            <PanelView title="事件信息" :type="1"  v-if="warningInfoFlag" ref="panelWarningInfo" style="height:420px;">
              <WarningInfo :warningInfoData="warningInfoData" :clickItemWarning="clickItemWarning"></WarningInfo>
            </PanelView>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import WarningInfo from '@/components/feature/common/warningInfo/WarningInfo.feature.vue';
import {warningInfoServer} from '@/api/installServer.ts';
import {IWarningInfo } from '@/interface/feature/common/warningInfo/WarningInfo.interface';
@Component({
   name : 'WarningInfoView',
   components: {
      WarningInfo   },
})
export default class WarningInfoView extends Vue {
    private warningInfoFlag = false;
    private warningInfoData: IWarningInfo[] = [] ;
}
</script>
<style lang="less">

</style>