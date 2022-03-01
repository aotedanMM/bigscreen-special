import IEComponentView from './IEComponentView';
import IComponent from './IComponent';
import Vue from 'vue';
export default class EComponentVueView<T extends IComponent> extends Vue implements IEComponentView<T> {
   private component!: T;

   public accept(component: T) {
        this.component = component;
   }

   public getComponent(): T {
       return this.component;
   }
}
