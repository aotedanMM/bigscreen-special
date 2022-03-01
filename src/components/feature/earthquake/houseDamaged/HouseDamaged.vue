<template>
    <div class="echart-wrap">
        <bar-chart :id="id"  :option="option"  :nodata="nodata"></bar-chart>
    </div>
</template>

<script lang="ts">
    // import echarts from 'echarts';
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import BarChart from '@/components/common/chart/Bar.common.vue';
    import {IHouseDamagedOption} from '@/interface/feature/earthquake/HouseDamaged.interface';
    /**
      * 房屋损毁组件
      */
    @Component({
        name: 'HousesDamaged',
        components: {
            BarChart,
        },
    })

    export default class HousesDamaged extends Vue {
    /**
      * id,类型：string;
      */
        @Prop(String) public id!: string;
    /**
      * option,类型：Object;
      */
        @Prop(Object) public option!: IHouseDamagedOption;
        /* 暂无数据 */
        @Prop() public nodata!: boolean;
        private created() {
            // alert(JSON.stringify(this.option));
        }
    }

</script>
<style lang='less'  scoped>
    // @import url(); 引入公共css类
    .echart-wrap {
        width: 100%;
        height: 250px;
    }
</style>
