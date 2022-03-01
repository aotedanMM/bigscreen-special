/**
 *  推送事件id，和当前location id 存放的位置
*/

export default {
    namespaced : true,
    state: {
        eventId: '',
        locationId: '',
        newEventState: false, // 当前是否为新事件
        newLocationStateArr: [], // 推送过来，未被点击过的工具条
    },
    mutations: {
        /**
         *  当前事件发生改变
        */
        changeEventId(content: any, data: any) {
            content.eventId = data.eventId;
        },
        /**
         *  当前事件发生改变
        */
        changeLocationId(content: any, data: any) {
            content.locationId = data.locationId;
        },

    },
    actions: {
        setChangeEventId(content: any, data: any) {
            content.commit('changeEventId', data);
        },
        setChangeLocationId(content: any, data: any) {
            content.commit('changeLocationId', data);
        },
    },
};
