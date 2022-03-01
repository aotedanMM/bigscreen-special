<template>
    <BarChart :id='id' :option='option'
    ></BarChart>
</template>

<script lang='ts'>
import {Component, Prop, Vue} from 'vue-property-decorator';
import {IFieldTeamDemo} from '@/interface/feature/earthquake/FieldTeam.interface';
import BarChart from '@/components/common/chart/Bar.common.vue';

// 现场队伍demo
@Component({
    name: 'FieldTeam',
    components: {
        BarChart ,
    },
})
export default class FieldTeam extends Vue {
        /**
      * id,类型：string;
      */
        @Prop(String) public id!: string;
    /**
      * option,类型：Object;
      */
        @Prop() public option!: IFieldTeamDemo;

}
</script>