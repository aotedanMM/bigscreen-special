import Vue from 'vue';


/**
 * 解决组件与组件消息通信的中间通信， 通过引用，进行调用
*/
export const messsageBus = new Vue();

function message(types: string, data: any) {
    messsageBus.$emit(types, data);
}

export default message;

declare module 'vue/types/vue' {
    interface Vue {
        messsageBus: any;
        global: any;
    }
}
/**
 * 组件通信，通过挂到vue 上进行调用
 * 通信
 * 使用在main.ts 里面
 * import {messagePlugin} from '@/util/message';
 * 调用：默认
 * Vue.use(messagePlugin);
 * 使用：在.vue文件使用
 * 监听：
 *  this.global.on('tttt',function(){
 *   // do something
 *  })
 * 发送：
 * this.global.emit('tttt','sss')
 * 调用：传入命名空间
 * Vue.use(messagePlugin,'messsageBus');
 * 监听：
 *  this.messsageBus.on('tttt',function(){
 *   // do something
 *  })
 * 发送：
 * this.messsageBus.emit('tttt','sss')
 * 定义属性：
 * 在方法，已定义好global 与 messsageBus，如果传入不同的命名空间时，则需要自己进行定义
*/
export function messagePlugin(vue: any, namespace: string = 'global') {
    const obj: any = {};
    obj[namespace] = new vue();

    obj[namespace].on = (...rest: any) => {
        return obj[namespace].$on(...rest);
    };
    obj[namespace].off = (...rest: any) => {
        return obj[namespace].$off(...rest);
    };
    obj[namespace].emit = (...rest: any) => {
        return obj[namespace].$emit(...rest);
    };
    obj[namespace].once = (...rest: any) => {
        return obj[namespace].$once(...rest);
    };
    Object.defineProperty(vue.prototype, namespace, {
        get() {
            return obj[namespace];
        },
    });
}







