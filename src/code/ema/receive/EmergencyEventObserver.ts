import EmergencyEvent from '../../eedm/data/EmergencyEvent';
import EventInfo from '../../eedm/data/EventInfo';
export default interface EmergencyEventObserver {
    onEvent(event: EmergencyEvent, info: EventInfo): void;
}
