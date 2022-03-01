import Commmon from './common/Module';
import Normal from './normal/Module';
import DisasterJudge from './disasterJudge/Module';
import DisasterSta from './disasterSta/Module';
import RescueHelp from './rescueHelp/Module';
import RescueProgress from './rescueProgress/Module';
import MonitorWarning from './monitorWarning/Module';
import DefensivePreparation from './defensivePreparation/Module';
import disasterStatistics from './disasterStatistics/Module';
import ModelDisplay from './model/Module';
import forestFire from './forestFire/Module';
export default {
    commonFactory: Commmon,
    normalFactory: Normal,
    disasterJudgeFactory: DisasterJudge,
    disasterStaFactory: DisasterSta,
    rescueHelpFactory: RescueHelp,
    rescueProgressFactory: RescueProgress,
    monitorWarningFactory: MonitorWarning,
    defensivePreparationFactory: DefensivePreparation,
    ModelDisplayFactory: ModelDisplay,
    disasterStatisticsFactory: disasterStatistics,
    forestFireFactory: forestFire,
};
