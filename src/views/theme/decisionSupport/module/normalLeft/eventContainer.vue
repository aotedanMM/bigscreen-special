<template>
  <div class="EventContainer">
    <!-- <span class="EventContainer_point" @click="showTwoEvent = !showTwoEvent"></span> -->
    <EventInfoTwoView v-show="showTwoEvent" />
    <EventInfoView v-show="!showTwoEvent" :modulename='modulename' />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EventInfoView from '@/views/theme/decisionSupport/module/normalLeft/eventInfo.vue';
import EventInfoTwoView from '@/views/theme/decisionSupport/module/normalLeft/eventInfoTwo.vue';
@Component({
  name: 'EventContainer',
  components: {
    EventInfoView,
    EventInfoTwoView,
  },
})
export default class EventContainer extends Vue {
  @Prop() public modulename: any;
  private showTwoEvent = false;

}
</script>
<style lang="less" scoped>
.EventContainer {
  height: 100%;
  position: relative;
  padding-left: 15px;   
  margin-top:-20px;
  &_point {
    cursor: pointer;
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #00e4ff;
    border-radius: 50%;
    position: absolute;
    left: 60%;
    top: -35px;
  }
}
</style>