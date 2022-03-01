export default {
    namespaced: true,
    state: {
        companyName: '',
    },
    mutations: {

    },
    actions: {
        getCompanyName(state: any, data: any) {
            console.log(data);
            state.companyName = data;
        },
    },
};
