export default {
    namespaced: true,
    state: {
        disasterJudgeType: '',
    },
    mutations: {
        setDisasterJudgeType(state: any, val: any) {
            state.disasterJudgeType = val;
        },
    },
};
