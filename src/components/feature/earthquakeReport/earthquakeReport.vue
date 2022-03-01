<!-- 16比9 head部分事件列表与专题选择 -->
<template>
    <div>
        <Rendless type="eventList" v-slot="{data}">
                <EventinfoList v-model="isShow"  :list="data" />
        </Rendless>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop , Watch} from 'vue-property-decorator';
import Rendless from '@/components/common/rander/Rendless.vue';
import EventinfoList from '@/components/feature/earthquake/eventinfolist/EventinfoList.vue';
@Component({
  name: 'earthquakeReport',
  components: {
    Rendless,
    EventinfoList, // 地震速报
  },
})
export default class EarthquakeReport extends Vue {
  @Prop() private isShow?: any;
}
</script>
<style lang="less" scoped>
</style>