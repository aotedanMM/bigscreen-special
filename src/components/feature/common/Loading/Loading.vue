<template>
    <div class="loadings">
      <div v-if="status === 'nodata'" class="nothingData--bg"></div>
      <div class="text" v-else-if="status === 'loading'" v-loading="true"></div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'Loading',
  components: {},
})
export default class Loading extends Vue {
  // @Prop() private loadings: any = false;
  @Prop({
    default: '',
  })
  public status?: string;

  @Prop({
    default: '暂无数据',
  })
  public default?: string;
}
</script>

<style lang="less" scoped >
.loadings {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // .noDataClass {
  //   font-size: 28px;
  //   color: #bdebef;
  // }
}
</style>