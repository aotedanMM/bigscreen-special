/**
 *  切换而已的操作
*/

export default {
    namespaced : true,
    state: {
        left : '',
        right : '',
        theme : '',
        normal: '',
        unNormal: '',
        changeTheme : '',
    },
    mutations: {
        /**
         *  切换左边的布局
        */
        changeLeft(content: any, data: any) {
            content.left = data;
        },
        /**
         *  切换右边的布局
        */
        changeRight(content: any, data: any) {
            content.right = data;
        },
         /**
         *  切换主题
        */
        changeTheme(content: any, data: any) {
            content.theme = data;
        },
         /**
         *  缓冲数据
         *  针对辅助决策的缓冲的数据
        */
       fuzhujuece(content: any, data: any) {
            content.normal = data.normal;
            content.unNormal = data.unNormal;
            content.changeTheme = data.changeTheme;
        },
         /**
         *  缓冲数据
         *  针对佛山大屏的缓冲的数据
        */
        foshan(content: any, data: any) {
            content.normal = data.normal;
        },
        /**
         *
        */
       darkGreen(content: any, data: any) {
        content.normal = data.normal;
        content.unNormal = data.unNormal;
        content.changeTheme = data.changeTheme;
       },
         /**
         *  针对辅助决策的缓冲的数据
        */
        setChange(content: any, data: any) {
            /**
             * 切换非常态的情况
            */
            if (data === 'unNormal') {
                content.left = JSON.parse(JSON.stringify(content[data])).left;
                content.right = JSON.parse(JSON.stringify(content[data])).right;
            }
            if (data && data.type === 'changeTheme') {
                content.right =  JSON.parse(JSON.stringify(content.changeTheme[data.index])).right;
            }

        },

    },
    actions: {
        setChangeAll(content: any, data: any) {
            content.commit('changeLeft', data.left);
            content.commit('changeRight', data.right);
        },
        setTheme(content: any, data: any) {
            content.commit('changeTheme', data.theme);
            content.commit('changeLeft', data.left);
            content.commit('changeRight', data.right);
        },
        /**
         * 缓冲数据
        */
        cacheData(content: any, data: any) {
            content.commit(data.theme, data);
        },
    },
};
