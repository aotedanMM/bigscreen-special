import * as  echarts from 'echarts';
import Vue from 'vue';

export default class BaseChart extends Vue {
    public ehcartsObj: any;
    public init(id: string) {
        const div = document.getElementById(id) as HTMLDivElement ;
        this.ehcartsObj  = echarts.init(div);
    }

    public getEchartsObj() {
        return this.ehcartsObj;
    }

    public setOption(option: any) {
        this.ehcartsObj.setOption(option);
        this.$nextTick(() => {
            this.ehcartsObj.resize();
        });
    }
    public getOptions() {
        return this.ehcartsObj.getOptions();
    }

    public destoryted() {
        this.ehcartsObj.dispose();
    }
}
