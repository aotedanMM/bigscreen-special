<template>
    <div id="ControlTraffic">
        <MapDialogTitle>
            <template v-slot:title>
                交通管制
            </template>
        </MapDialogTitle>
        <ul class="dieTotalBox" @click="checkListFunc('')" :class="listCheck === '' ? 'checkSty' : ''">
            <li>
                共<span>515</span>处交通管制
            </li>
        </ul>
        <ul class="dieListBox">
            <li v-for="(i,index) in listData" :key="index+'a'" @click="checkListFunc(index)"
                :class="listCheck === index ? 'checkSty' : ''">
                <span class="address">名称</span>
                <div class="listCont">
                    <span>
                        <span>{{i.dieNum}}</span>
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    import MapDialogTitle from '@/views/theme/decisionSupport/common/MapDialogTitle.vue';
    @Component({
        name: 'ControlTraffic',
        components: {
            MapDialogTitle,
        },
    })
    export default class ControlTraffic extends Vue {
        private listCheck: any = '';
        private listData: any = [
            {
                address: '朝阳区',
                dieNum: '291',
                hurtNum: '129',
                missingNum: '133',
            }, {
                address: '朝阳区',
                dieNum: '291',
                hurtNum: '129',
                missingNum: '133',
            },
        ];
        private checkListFunc(index: number) {
            this.listCheck = index;
        }
    }
</script>
<style lang="less" scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .checkSty {
        box-shadow: 0 0 50px rgb(240, 234, 17) inset;
    }

    #ControlTraffic {
        position: fixed;
        top: 30vh;
        left: 51vw;
        z-index: 9999;
        width: 343px;
        height: auto;

        li {
            list-style-type: none;
        }

        // .dieTotalBox {
        //     width: 100%;
        //     padding: 0;
        //     margin: 10px 0px;
        //     cursor: pointer;
        //     background: rgba(7, 25, 65, .8);
        //     background-size: 100% 100%;
        //     border-radius: 20px;

        //     li {
        //         // font-size: 28px;
        //         color: #ffffff;
        //         font-weight: bolder;
        //         display: flex;
        //         align-items: center;
        //         justify-content: center;

        //         span {
        //             font-size: 40px;
        //             cursor: pointer;
        //             margin: 0 10px 0 10px;
        //             color: #ff8d10;
        //             font-weight: 600;
        //             display: flex;
        //             align-items: center;
        //         }
        //     }
        // }

        .dieListBox {
            height: 450px;
            overflow-y: scroll;

            li {
                width: 100%;
                background: rgba(7,25,65,.8);
                background-size: 100% 100%;
                border-radius: 20px;
                margin-bottom: 10px;
                cursor: pointer;
                color: #ffffff;
                display: flex;
                justify-content: flex-start;
                padding: 5px 25px 5px 5px;

                .address {
                    width: 25%;
                    display: inline-block;
                    text-align: center;
                    font-size: 28px;
                    border-radius: 10px;
                    background: rgba(48,35,35,.7) no-repeat;
                }

                .listCont {
                    display: flex;
                    flex-direction: column;
                    font-size: 24px;
                    padding-left: 10px;
                    line-height: 40px;
                }
            }
        }

        .dieListBox::-webkit-scrollbar {
            display: none;
        }
    }
</style>
