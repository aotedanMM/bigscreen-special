

export default {
    namespaced : true,
    state: {
        msg: 'hello',
    },
    mutations: {
        msgUpdate(state: any, data: any) {
            state.msg = data;
        },
    },
    actions: {
        msgEmit(content: any, data: any) {
            content.commit('msgUpdate', data);
        },
    },
};


