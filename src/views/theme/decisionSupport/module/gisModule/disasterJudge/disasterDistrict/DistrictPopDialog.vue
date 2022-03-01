<template>
    <div id="DistrictPopDialog">
        <DistrictPopModule></DistrictPopModule>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import DistrictPopModule from '@/components/feature/gisModle/disasterJudgeDialog/DistrictPopModule.vue';

  @Component({
    name: 'DistrictPopDialog',
    components: {
      DistrictPopModule,
    },
  })
  export default class DistrictPopDialog extends Vue {
  }
</script>
<style lang="less" scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #DistrictPopDialog {
        position: fixed;
        top: 30vh;
        left: 51vw;
        z-index: 9999;
        width: 343px;
        height: auto;
        border: 1px solid white;
    }
</style>
