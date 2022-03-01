<script lang='ts'>
import {Component, Vue, Prop} from 'vue-property-decorator';
import { ILegendItem, ILegend } from '@/interface/feature/common/legend/Legend.interface';

@Component
export default class RenderLegend extends Vue {
    @Prop() public legendData!: ILegend;
   /* private isShow: boolean = this.tagss.isShow || true;
    private title?: string = this.tagss.title || '图例';
    private data: ILegendItem[] =[];*/

    public FnIsHideLegend(flag: boolean) {
            this.legendData.isShow = !flag;
    }

    public render() {
        return (this.$scopedSlots.default as any)({
            legendData: this.legendData,
            FnIsHideLegend: this.FnIsHideLegend,
        });
    }

}
</script>