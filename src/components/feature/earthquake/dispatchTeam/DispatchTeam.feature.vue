<template>
  <ul class="dispatch-team-ul">
    <li class="dispatch-team-li">
      <span class="dispatch-icon-local"></span>现场队伍
      <p class="dispatch-teamnum">
        <i class="icon-arrow" :class="[ animateFlag.liveTeam > 0 ? 'icon-arrow-up' : '', animateFlag.liveTeam < 0 ? 'icon-arrow-down' : '']"></i>
       
        <b class="ellipsis" :class="{'scale_value' : !(animateFlag.liveTeam === 0)}">{{local}}</b>
      </p>支
      <p class="dispatch-personnum">
        <strong class="ellipsis" :class="{'scale_value' : !(animateFlag.liveTeam === 0)}">{{localperson}}</strong>
      </p>人
    </li>
    <li class="dispatch-team-li">
      <span class="dispatch-icon-ontheway"></span>赶赴队伍
      <p class="dispatch-teamnum">
        <i class="icon-arrow"  :class="[ animateFlag.rushToTeam > 0 ? 'icon-arrow-up' : '', animateFlag.rushToTeam < 0 ? 'icon-arrow-down' : '']"></i>
       
        <b class="ellipsis"  :class="{'scale_value' : !(animateFlag.rushToTeam === 0)}">{{ontheway}}</b>
      </p>支
      <p class="dispatch-personnum">        
        <strong class="ellipsis" :class="{'scale_value' : !(animateFlag.rushToTeam === 0)}">{{onthewayperson}}</strong>
      </p>人
    </li>
    <li class="dispatch-team-li">
      <span class="dispatch-icon-wait"></span>待命队伍
      <p class="dispatch-teamnum">
        <i class="icon-arrow"  :class="[ animateFlag.standbyTeam > 0 ? 'icon-arrow-up' : '', animateFlag.standbyTeam < 0 ? 'icon-arrow-down' : '']"></i>
        <b class="ellipsis" :class="{'scale_value' : !(animateFlag.standbyTeam === 0)}">{{wait}}</b>
      </p>支
      <p class="dispatch-personnum">
        <strong class="ellipsis" :class="{'scale_value' : !(animateFlag.standbyTeam === 0)}">{{waitperson}}</strong>
      </p>人
    </li>
  </ul>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
/**
 * 队伍调派组件
 */
@Component({
  name: 'DispatchTeam',
})
export default class DispatchTeam extends Vue {
 @Prop() public animateFlag?: any;

  /**
   * 现场队伍数量，有多少支队伍
   */
  @Prop() public local?: number;
  /**
   * 现场队伍数量，有多少人
   */
  @Prop() public localperson?: number;
  /**
   * 赶赴队伍数量，有多少支队伍
   */
  @Prop() public ontheway?: number;
  /**
   * 赶赴队伍数量，有多少人
   */
  @Prop() public onthewayperson?: number;
  /**
   * 待命队伍数量，有多少支队伍
   */
  @Prop() public wait?: number;
  /**
   * 待命队伍数量，有多少人
   */
  @Prop() public waitperson?: number;


}
</script>
<style scoped lang="less">
@url: '../../../../assets/img/dispatchTeam/';
.dispatch-team-ul {
  margin: 0;
  padding: 0 14px 0 14px;
}
.dispatch-team-li {
  line-height: 65px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0 10px 0 0px;
  color: #e5f4ff;
  font-size: 28px;
  font-style: normal;
  white-space: nowrap;
  vertical-align: middle;
  font-family: 'myYahei';
  span {
    display: inline-block;
    width: 60px;
    height: 65px;
    vertical-align: middle;
  }
}
.dispatch-icon-local {
  background: url('@{url}xianchangicon.png') no-repeat 50% 50%;
  background-size: 100%;
}
.dispatch-icon-ontheway {
  background: url('@{url}ganfuicon.png') no-repeat 50% 50%;
  background-size: 100%;
}
.dispatch-icon-wait {
  background: url('@{url}daimingicon.png') no-repeat 50% 50%;
  background-size: 100%;
}

.dispatch-teamnum {
  width: 19%;
  margin: 0;
  cursor: default;
}
.dispatch-teamnum b {
  font-family: 'Impact';
  font-size: 30px;
  font-weight: 900;
  color: #fff001;
  text-align: center;
  padding-right: 5px;
  vertical-align: top;
  width: 100%;
  display: inline-block;
}
.dispatch-personnum {
  width: 28%;
  margin: 0;
  margin-right: 5px;
}
.dispatch-personnum strong {
  font-family: 'Impact';
  display: inline-block;
  font-size: 30px;
  font-weight: 900;
  color: #2cf7ff;
  vertical-align: top;
  width: 100%;
  text-align: right;
  // padding-right: 5px;
}
</style>