import Vue, {DirectiveOptions} from 'vue';
import store from '../../store/index';

export const vueBus: any = new Vue({store});
const eventArr = vueBus.$store.state.comMutexState.AreaSelection;

export const mutex: DirectiveOptions = {
    inserted(el: any, binding: any, vnode: any) {
        const event1 = eventArr.concat();
        if (binding.value) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
        let eventname: string = '';
        if (binding.arg.includes('.')) {
            const arr = binding.arg.split('.');
            eventname = arr[0];
        } else {
            eventname = binding.arg;
        }
        vueBus.$on(eventname, function(value: any) {
            value.forEach((key: any) => {
                if (value.includes(binding.arg)) {
                    el.style.display = 'none';
                }
            });
        });
    },
    update(el: any, binding: any, vnode: any) {
        const event1 = eventArr.concat();

        if (binding.value !== binding.oldValue) {
            if (binding.value) {
                let eventname: string = '';
                let index: number = -1;
                if (binding.arg.includes('.')) {
                    const arr = binding.arg.split('.');
                    eventname = arr[0];
                    index = event1.indexOf(arr[1]);
                    event1.splice(index, 1); // 从数组中去掉唯一标识
                } else {
                    eventname = binding.arg;
                    index = event1.indexOf(eventname);
                }
                event1.splice(event1.indexOf(eventname), 1); // 从数组中去掉唯一标识
                vueBus.$emit(eventname, event1);
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        }
    },
};
