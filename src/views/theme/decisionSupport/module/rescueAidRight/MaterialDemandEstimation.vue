<template>
    <GoodsneedPredict :goodsneedPredicLlist="goodsDB" ></GoodsneedPredict>
</template>
<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    import GoodsneedPredict from '@/components/feature/earthquake/goodsneedPredict/GoodsneedPredict.feature.vue';
    @Component({
        name: 'MaterialDemandEstimation',
        components: {
            GoodsneedPredict,
        },
    })
    export default class KeyMaterialDemand extends Vue {
        private goodsDB = [{
            type: 'clothes',
            name: '衣服',
            number: 0,
            unit: '顶',
        },
        {
            type: 'quilt',
            name: '防寒棉被',
            number: 0,
            unit: '套',
        },
        {
            type: 'dustbin',
            name: '垃圾箱',
            number: 0,
            unit: '个',
        },
        {
            type: 'blood',
            name: '血浆',
            number: 0,
            unit: '毫升',
        },
        {
            type: 'water',
            name: '饮用水',
            number: 0,
            unit: '毫升',
        },
        {
            type: 'food',
            name: '食品',
            number: 0,
            unit: '千克/日',
        },
        {
            type: 'goods',
            name: '生活用品',
            number: 0,
            unit: '件',
        },
        {
            type: 'light',
            name: '照明用具',
            number: 0,
            unit: '件',
        },
        {
            type: 'source',
            name: '能源动力',
            number: 0,
            unit: '件',
        },
        {
            type: 'rescue',
            name: '应急救生',
            number: 0,
            unit: '件',
        },
        {
            type: 'traffictool',
            name: '交通工具',
            number: 0,
            unit: '件',
        },
        ];
    }
</script>