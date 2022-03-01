<template>
    <div class="ImportantGoodsNeed">
        <GoodsNeed :goodsNeedList="obj">
        </GoodsNeed>
    </div>
</template>
<script lang='ts'>
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import GoodsNeed from '@/components/feature/earthquake/goodsNeed/GoodsNeed.feature.vue';
    @Component({
        name: 'ImportantGoodsNeed',
        components: {
            GoodsNeed,
        },
    })
    export default class ImportantGoodsNeed extends Vue {
        public obj = [
            {
                type: 'tent',
                name: '救灾帐篷',
                total: 20,
                unit: '顶',
                notdispatch: '1',
                dispatching: '2',
            },
            {
                type: 'quilt',
                name: '救灾被服',
                total: 20,
                unit: '件',
                notdispatch: '1',
                dispatching: '2',
            },
            {
                type: 'food',
                name: '救灾食品',
                total: 20,
                unit: '件',
                notdispatch: '1',
                dispatching: '2',
            },
            {
                type: 'goods',
                name: '生活用品',
                total: 20,
                unit: '件',
                notdispatch: '1',
                dispatching: '2',
            },
            {
                type: 'light',
                name: '照明用具',
                total: 20,
                unit: '件',
                notdispatch: '1',
                dispatching: '2',
            },
            {
                type: 'source',
                name: '能源动力',
                total: 20,
                unit: '件',
                notdispatch: '1',
                dispatching: '2',
            },
            {
                type: 'rescue',
                name: '应急救生',
                total: 20,
                unit: '件',
                notdispatch: '1',
                dispatching: '2',
            },
            {
                type: 'traffictool',
                name: '交通工具',
                total: 20,
                unit: '件',
                notdispatch: '1',
                dispatching: '2',
            },
        ];
    }
</script>
<style lang="less" scoped>
.ImportantGoodsNeed{
}
</style>