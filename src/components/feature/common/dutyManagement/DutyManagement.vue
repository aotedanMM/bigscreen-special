<template>
    <div>
        <!-- <div class="DutyManagement">
            <div class="DutyManagement-title">
                <div class="DutyManagement-title-tab1">
                    <div class="DutyManagement-title-tab1-pie"  @click="FnStatusFlag(1)">应急管理部</div>
                    <div class="DutyManagement-title-tab1-pie">更多</div>
                </div>
                <div class="DutyManagement-title-tab2" @click="FnStatusFlag(2)">省应急管理厅（局）</div>
            </div>
            <div class="DutyManagement-tab1" v-if="flag === true">
                <div class="DutyManagement-select">
                    <div class="DutyManagement-select-leader">
                        部领导:{{MEMdata.leader}}
                    </div>
                    <div class="DytyManagement-select-content">
                        <el-dropdown split-button type="primary" @command='handleCommand'>
                            {{selectTitle}}
                            <el-dropdown-menu slot="dropdown" >
                                    <el-dropdown-item v-for="(item,index) in MEMdata.selectList" :key="index" :command="item">{{item.selectName}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="DutyManagement-content">
                    <div class="DutyManagement-content-list" v-for="(item,index) in catchkeeper.personName" :key="index">
                        <div>{{item.title}}</div>
                        <div v-for="(value,number) in item.content" :key="number">
                            <div>{{value.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="DutyManagement-tab2" v-if="flag === false" >
                <div class="DutyManagement-tab2-list">
                    <div>{{MEMdata.MEMinfo.title}}</div>
                </div>
                <div class="DutyManagement-tab2-list">
                    <div>代班厅领导：</div>
                    <div>{{MEMdata.MEMinfo.leader}}</div>
                </div>
                <div class="DutyManagement-tab2-list">
                    <div>值班长：</div>
                    <div>
                        <div v-for="(item,index) in MEMdata.MEMinfo.monitor" :key="index">{{item.name}}({{item.time}})</div>
                    </div>
                    
                </div>
                <div class="DutyManagement-tab2-list">
                    <div>信息岗：</div>
                    <div>{{MEMdata.MEMinfo.information}}</div>
                </div>
                <div class="DutyManagement-tab2-list">
                    <div>调度岗</div>
                    <div>{{MEMdata.MEMinfo.yardman}}</div>
                </div>
                <div class="DutyManagement-tab2-list">
                    <div>消防岗</div>
                    <div>{{MEMdata.MEMinfo.firemen}}</div>
                </div>
                <div class="DutyManagement-tab2-list">
                    <div>综合岗</div>
                    <div>{{MEMdata.MEMinfo.synthesis}}</div>
                </div>
            </div>
        </div> -->
    </div>
    
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch} from 'vue-property-decorator';
 /**
 * 值班信息组件
 */
@Component({
    name : 'DutyManagement',
})
export default class PlottingTool extends Vue {
    /**
    * 传入的值班信息的数据
    */
    @Prop() public MEMdata!: any;
    public flag: boolean = true ;
    public catchkeeper: any = '';
    public selectTitle: string = '请选择';
    public handleCommand(command: any): void {
        this.selectTitle = command.selectName;
        this.catchkeeper = command;

    }
    public FnStatusFlag(i: number): void {
        if (i === 1) {
            this.flag = true;
        } else if (i === 2) {
            this.flag = false;
        }
    }



}
</script>
<style lang="css">
.DutyManagement{
    width: 100%;
    height: auto;
    border: 2px solid #000;
}
.DutyManagement-title{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    
}
.DutyManagement-title-tab1{
    display: flex;
    justify-content: space-between;
}
.DutyManagement-select{
    display: flex;
    justify-content: space-between;
}
.DutyManagement-content-list{
        display: flex;
    justify-content: space-between;
}
.DutyManagement-tab2-list{
    display: flex;
    justify-content: space-between;
}
</style>
