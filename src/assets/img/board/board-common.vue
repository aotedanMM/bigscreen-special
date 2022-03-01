<template>
  <div >
    <accidSmulation v-if="boardId === '02020203'"></accidSmulation>
    <alarmDisposal v-else-if="boardId === '02010003'"></alarmDisposal>
    <alarmTrend v-else-if="boardId === '02010002'"></alarmTrend>
    <compIndicator v-else-if="boardId === '02020102'"></compIndicator>
    <disposalSchedule v-else-if="boardId === '02020201'" ></disposalSchedule>
    <dangerAlarmDisposal v-else-if="boardId === '02020002'"></dangerAlarmDisposal>
    <dangerAlarmTrend v-else-if="boardId === '02020001'"></dangerAlarmTrend>
    <enterpriseInfo v-else-if="boardId === '02020101'"></enterpriseInfo>
    <focusOn v-else-if="boardId === '02020104'"></focusOn>
    <moniAlarm v-else-if="boardId === '02010001'"></moniAlarm>
    <moniReal v-else-if="boardId === '02020202'"></moniReal>
    <objAssociation v-else-if="boardId === '02020103'"></objAssociation>
    <surveVideo v-else-if="boardId === '02010004'"></surveVideo>
    <videoLinkage v-else-if="boardId === '02020204'"></videoLinkage>
    <cityIndustry v-else-if="boardId === '02010005'"></cityIndustry>
    <dangerFocusOn v-else-if="boardId === '02020003'"></dangerFocusOn>
    <densePlace  v-else-if="boardId === '02010008'"></densePlace>
    <dangerMoniRadar v-else-if="boardId === '02020004'"></dangerMoniRadar>
    <naturalDisaster  v-else-if="boardId === '02010007'"></naturalDisaster>
    <publicFacilities v-else-if="boardId === '02010006'" ></publicFacilities> 
    <riskAnalysis v-else-if="boardId === '01000002'" ></riskAnalysis>
    <riskDetails  v-else-if="boardId === '01000004'"	></riskDetails>
    <riskManage 	v-else-if="boardId === '01000003'"></riskManage>
    <riskProfile 	v-else-if="boardId === '01000001'"></riskProfile>    
    <singleVideo v-else-if="boardId === '02020005'"></singleVideo>
    <monitorAlarm v-else-if="boardId === '02030001'"></monitorAlarm>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import board from './board.vue';
import accidSmulation from '../../feature/board-enumeration/accid-simulation.vue';
import alarmDisposal from '../../feature/board-enumeration/alarm-disposal.vue';
import alarmTrend from '../../feature/board-enumeration/alarm-trend.vue';
import compIndicator from '../../feature/board-enumeration/comp-indicator.vue';
import cityIndustry from '../../feature/board-enumeration/city-industry.vue';
import dangerAlarmDisposal from '../../feature/board-enumeration/danger-alarm-disposal.vue';
import dangerAlarmTrend from '../../feature/board-enumeration/danger-alarm-trend.vue';
import dangerFocusOn from '../../feature/board-enumeration/danger-focus-on.vue';
import dangerMoniRadar from '../../feature/board-enumeration/danger-moni-radar.vue';
import densePlace from '../../feature/board-enumeration/dense-place.vue';
import enterpriseInfo from '../../feature/board-enumeration/enterprise-info.vue';
import focusOn from '../../feature/board-enumeration/focus-on.vue';
import moniAlarm from '../../feature/board-enumeration/moni-alarm.vue';
import moniReal from '../../feature/board-enumeration/moni-real.vue';
import naturalDisaster from '../../feature/board-enumeration/natural-disaster.vue';
import objAssociation from '../../feature/board-enumeration/obj-association.vue';
import publicFacilities from '../../feature/board-enumeration/public-facilities.vue';
import riskAnalysis from '../../feature/board-enumeration/risk-analysis.vue';
import riskDetails from '../../feature/board-enumeration/risk-details.vue';
import riskManage from '../../feature/board-enumeration/risk-manage.vue';
import riskProfile from '../../feature/board-enumeration/risk-profile.vue';
import surveVideo from '../../feature/board-enumeration/surve-video.vue';
import videoLinkage from '../../feature/board-enumeration/video-linkage.vue';
import disposalSchedule from '../../feature/board-enumeration/disposal-schedule.vue';
import singleVideo from '../../feature/board-enumeration/single-video.vue';
import monitorAlarm from '../../feature/board-enumeration/monitor-alarm.vue';
@Component({
  components: {
    board,
    accidSmulation,
    alarmDisposal,
    alarmTrend,
    compIndicator,
    cityIndustry,
    dangerFocusOn,
    dangerMoniRadar,
    densePlace,
    enterpriseInfo,
    focusOn,
    moniAlarm,
    moniReal,
    naturalDisaster,
    objAssociation,
    publicFacilities,
    surveVideo,
    videoLinkage,
    disposalSchedule,
    dangerAlarmDisposal,
    dangerAlarmTrend,
    riskAnalysis,
    riskDetails ,
    riskManage ,
    riskProfile,
    singleVideo,
    monitorAlarm,
  },
})
export default class BoardCommon extends Vue {
  @Prop({ default: '02010001' })
  private boardId!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.board-container {
  width: 100%;
  height: 100%;
  background: pink;
}
</style>
