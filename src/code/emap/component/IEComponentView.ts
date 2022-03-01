import IComponent from './IComponent';
export default interface IEComponentView <T extends IComponent> {
   accept(component: T): void;
}
