<template>
  <!-- 禁火令 -->
  <div>
    禁火令
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as echarts from 'echarts';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
/**
 * 禁火令
 */
@Component({
  name: 'FireBan',
  components: {},
  mixins: [MapCommon],
})
export default class FireBan extends Vue {
}
</script>

<style lang="less" scoped>
</style>
