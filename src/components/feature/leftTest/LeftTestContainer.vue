<!-- 16比9 左侧的功能性工具条 -->
<template>
  <div class="aaaa">
      <LeftTest></LeftTest>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import LeftTest from '@/components/feature/leftTest/LeftTest.vue';
@Component({
  name: 'LeftTestContainer',
  components: {
    LeftTest,
  },
})
export default class LeftTestContainer extends Vue {
}
</script>
<style scoped lang="less">
    .aaaa{
        height: 500px;
        width: 300px;
    }
</style>
