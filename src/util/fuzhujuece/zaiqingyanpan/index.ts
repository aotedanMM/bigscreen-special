/**
 * 灾情研判的管理
*/
import {messsageBus} from '@/util/message';
export const zaiqingyanpan =  {
    // 发送方法
    emit : {
        // 行政区域开始
        // 列表hover的通知
        listMouse(data: any) {
            messsageBus.$emit('listMouseEmit', data) ;
        },
        // 列表clik的通知
        listOnclick(data: any) {
            messsageBus.$emit('listClickEmit', data) ;
        },
        // 面板点击的通知
        listPanalClick(data: any) {
            messsageBus.$emit('listPanalClick', data) ;
        },
        // 行政区域结束
    },
    on : {
        listMouse(cb: any) {
            messsageBus.$on('listMouseEmit', cb) ;
        },
        listOnclick(cb: any) {
            messsageBus.$on('listClickEmit', cb) ;
        },
        listPanalClick(cb: any) {
            messsageBus.$on('listPanalClick', cb) ;
        },
    },
};
