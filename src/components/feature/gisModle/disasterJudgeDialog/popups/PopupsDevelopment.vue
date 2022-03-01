<template>
    <div class="popups-block" v-if="showPopups">
        <div class="popups-head">
            <div class="popups-head-thumb">
                <img class="thumb-img" src="@/assets/img/gisModule/compentsPopups/dot.png" alt="">
            </div>
            <div class="popups-title">{{title}}</div>
            <div class="popups-close" @click="closePopups">
                <img src="@/assets/img/gisModule/compentsPopups/maptooltipclose.png" alt="">
            </div>
        </div>
        <div class="popups-body">
            <div class="popups-list">
                <div class="popups-list-item" v-for="(item, index) in list" :key="index">
                    <span class="label">{{item.name}}：</span>
                    <span class="value" :title="item.value">{{item.value}}</span>
                </div>
            </div>
        </div>
        <div class="popups-foot" v-if="btnText">
            <button class="btn" @click="$emit('btnEvent')">{{btnText}}</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class PopupsDevelopment extends Vue {
    @Prop() private title?: string;
    @Prop({default: () => [{name: '', value: ''}]}) private list?: object[];
    @Prop() private btnText?: string;
    @Prop({default: false}) private showPopups?: boolean;
    private closePopups() {
        this.showPopups = false;
    }
}
</script>

<style lang="less" scoped>
@imgPath: "../../../../../assets/img/gisModule/compentsPopups";
.popups-block {
    display: inline-block;
    min-width: 260px;
    max-width: 350px;
    background: rgba(7,25,65,0.8);
    border-radius: 1px;
    box-shadow: 0 0 15px #071941;
    .popups-head {
        padding-right: 10px;    
        display: flex;
        align-items: center;
        height: 70px;
        background-image: url("@{imgPath}/title.png");
        background-size: 100% 100%;
        .popups-title {
            padding-right: 10px;
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #fff;
            font-size: 24px;
            font-weight: 600;
        }
        .popups-close {
            padding: 10px;
            cursor: pointer;
        }
    }
    .popups-body {
        padding: 15px;
        .popups-list {
            .popups-list-item {
                display: flex;
                font-size: 22px;
                line-height: 30px;
                white-space: nowrap;
                .label {
                    color: #0EDBE4;
                }
                .value {
                    color: #fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
    .popups-foot {
        text-align: right;
        .btn {
            color: #fff;
            border: 1px solid #20a5aa;
            background-color: transparent;
            cursor: pointer;
        }
    }
}
</style>
