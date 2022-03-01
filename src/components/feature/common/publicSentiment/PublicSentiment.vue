<template>
    <div>
        <div v-for="(item,index) in ReArr" :key="index" >
            <div @click="FnSkip(item.url)">
                {{item.title}} -- {{item.time}}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch} from 'vue-property-decorator';
/**
* 舆情系统
*/
@Component({
    name : 'PublicSentiment',
})
export default class PublicSentiment extends Vue {
    @Prop() public PSdata!: any;
    private ReArr: any = [];
    // public flag: boolean = true ;

    // 将传进来的数组从大到小排列
    public FnReconsitutionArr(): any {
        for (let i = 0; i < this.PSdata.length; i++) {
                for (let j = i; j < this.PSdata.length; j++) {
                    if (this.PSdata[i].time < this.PSdata[j].time) {
                                this.ReArr = this.PSdata[j];
                                this.PSdata[j] = this.PSdata[i];
                                this.PSdata[i] = this.ReArr;
                }
            }
        }
        return this.ReArr = this.PSdata;
    }

    public created() {
        this.FnReconsitutionArr();
    }

    // 点击连接跳转到响应页面
    public FnSkip(i: string): void {
        window.location.href = i;
    }


}
</script>