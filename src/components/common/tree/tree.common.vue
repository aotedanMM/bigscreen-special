<template>
    <div class="tree">
        <ul class="tree_list">
            <li v-for="(item,key) in getList" :key="key">
                <div class="tree_list_label" :title="item[getConfig.label]" >
                    <div class="checkbox" v-if="checkbox" :class="{checkend:item.checkend}" @click="checkboxHandler(item)"></div>
                    <div class="tree_list_label_retract " v-else :class="{'open':item.show,'uncertain':item[getConfig.children]&&!item[getConfig.children].length && !item.show}" @click="showChildren(item,key)"></div>
                    <div class="tree_list_label_txt" @click="showChildren(item,key)">
                        <div :class="item.choiceActive === key && 'active'" >{{item[getConfig.label]}}</div>
                    </div>
                </div>
                <div class="tree_list_children" v-show="item.show && item[getConfig.children] &&　item[getConfig.children].length > 0">
                    <tree-list 
                        :treeList="item[getConfig.children] || []" 
                        @getChildrenData="deliver"
                        :prop="prop"
                        :children="getConfig.children"
                        :parent="{...item,'key':key}"
                        @clickHandler="clickHandler"
                        :checkbox="checkbox"
                        @changeItem="(e,data)=>changeItem(e,key,data)"
                        @getCheckends="getCheckends"
                        :showAll="showAll"/>
                </div>
            </li>
        </ul>
    </div>
</template>

<script  lang="ts">
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
 /**
    *  树形图组件
    */
@Component({
    name : 'TreeList',
})
export default class TreeList extends Vue {

    // 实时获取树状图的数据
    get getList() {
        return this.list;
    }

    get getConfig() {
        return this.config();
    }

    /**
     *  接收的树形图结构数据
    */
    @Prop({default: []}) public treeList?: any[];

    /**
     * 是否全部显示
    */
    @Prop({default: false}) public showAll?: boolean;

    /**
     *  是否显示复选框
     */
    @Prop({default: false}) public checkbox?: boolean;

    /**
     *  是否单列展示
     */
    // @Prop({default:false}) public singleRow?:boolean

    /**
     *  显示文字部分的字段 默认label
     */
    @Prop({default: 'label'}) public prop?: string;

    /**
     *  显示列表部分的字段 默认children
     */
    @Prop({default: 'children'}) public children?: string;
    // 这个字段无关紧要，这个是用来处理组建内部事务的
    @Prop({default: () => {
        return {};
    }}) public parent?: any;

    private index: number | null = -1;

    // 将传进来的treeList参数进行存储
    private list: any[] = [];

    // 当前点击的数据
    private currentItem: any = null;

    public created() {
        this.list = this.resetList(this.treeList || []);
    }
    private config() {
        return {
            label: this.prop || 'label',
            children: this.children || 'children',
        };
    }

    // 监听数据是否有变化
    @Watch('treeList')
    private watchTreeList(list: any[] = []) {
        this.list = this.resetList(list);
    }

    // 重置列表
    private resetList(list: any[]): any[] {
        return list.map((item, key) => {
            const res = {
                ...item,
                show: (item.selfOperation ? item.show : this.showAll ) || false,
                checkend: item.checkend || (this.parent && this.parent.checkend) || false,
                choiceActive: item.choiceActive > -1 ? item.choiceActive : -1,
                selfOperation: item.selfOperation || false,
            };
            res[this.config().children] = this.resetList(item[this.config().children] || []);
            return res;
        });
    }

    // 获取自己数据
    private getChildrenData(list: any[]) {
        const res = this.resetList(list || []);
        this.list.forEach((item) => item.show = item === this.currentItem);
        this.currentItem[this.config().children] =  res;
        this.currentItem.show = !!res.length;
        if (this.currentItem.show) {
            this.$emit('changeItem', this.list);
        }
        this.list = this.resetList(this.list);
    }

    // 获取原有的数据
    private listTiemToTreeListItem(item: any = {}) {
        const res = JSON.parse(JSON.stringify(item));
        delete res.show;
        delete res.checkend;
        delete res.choiceActive;
        delete res.selfOperation;
        return res;
    }

    // 将事件交付出去
    private deliver(item: any, callBack: () => {}) {
        this.$emit('getChildrenData', item, callBack);
    }

    // 显示子级目录 没有子级目录的话就会进行请求
    private showChildren(item: any, key: number) {
        this.list.forEach((single, index) => {
            single.choiceActive = index === key ? key : -1;
        });
        if (item[this.config().children] && item[this.config().children].length > 0) {
            item.show = !item.show;
            item.choiceActive = key;
            if (!this.showAll) {
                this.$emit('changeItem', this.list, item);
            }
        } else {
            this.currentItem = item || {};
            this.$emit('getChildrenData', this.listTiemToTreeListItem(item), this.getChildrenData);
        }
        this.$emit('clickHandler', item, key);
    }

    private clickHandler(arg: any, key?: number) {
        const argStr = JSON.stringify(this.listTiemToTreeListItem(arg));
        this.rootDataHandler(() => {
            let first = 0;
            this.searchPosition(this.list, argStr, (children: any, index: number, arr: any[]) => {
               arr.forEach((item, i) => {
                    if (i !== index) {
                        item.choiceActive = -1;
                        this.childrenDataHandler(item, (single: any) => {
                            single.choiceActive = -1;
                        });
                    }
                });
               children.choiceActive = index;
               children.selfOperation = true;
               if (!first) {
                    children.show = arg.show;
                    first++;
                }
            });
            this.list = this.resetList(this.list);
            // console.log(JSON.parse(JSON.stringify(this.list)))
        });
        this.$emit('clickHandler', arg);
    }

    private searchPosition(list: any[], objStr: string, callBack: (arg: any, index: number, arr: any[]) => void): any {
        for (let i = 0; i < list.length; i++) {
            const singleStr = JSON.stringify(this.listTiemToTreeListItem(list[i]));
            if (singleStr === objStr) {
                callBack(list[i], i, list);
                return list[i];
            } else if (list[i][this.config().children] && list[i][this.config().children].length) {
                const res = this.searchPosition(list[i][this.config().children], objStr, callBack);
                if (res) {
                    callBack(list[i], i, list);
                    return res;
                }
            }
        }
    }

    private childrenDataHandler(single: any, callBack: (arg: any) => void): void {
        if (single[this.config().children] && single[this.config().children].length) {
            single[this.config().children].forEach((cd: any) => {
                this.childrenDataHandler(cd, callBack);
            });
        }
        callBack(single);
    }

    // 根数据进行操作
    private rootDataHandler(callBack: () => void) {
        if (!this.parent) {
            callBack();
        }
    }



    private getArgIndex(arg: any): number {
        const argStr =  JSON.stringify(this.listTiemToTreeListItem(arg));
        let index = -1;
        let existence = false;
        this.list.forEach((item, i) => {
            if (!existence) {
                this.popChildren(item, (single: any) => {
                    if (!existence) {
                        existence = argStr === JSON.stringify(this.listTiemToTreeListItem(single));
                    }
                });
                if (existence) {
                    index = i;
                }
           }
        });
        return index;
    }

    /**
     *  将当前列表的具体状况告知父组件
    */
    private changeItem(list: any[], key: number, children?: any) {
        this.list[key][this.config().children] = list;
        if (children) {
             if (children.show) {
                this.list[key][this.config().children].forEach((single: any) => {
                    single.show = single === children;
                    if (!single.show) {
                        single[this.config().children].forEach((item: any) => {
                            this.popChildren(item, (s: any) => {
                                s.show = single.show;
                            });
                        });
                    }
                });
             } else {
                 this.list[key][this.config().children].forEach((item: any) => {
                    this.popChildren(item, (single: any) => {
                        single.show = children.show;
                    });
                });
            }
        }
        this.$emit('changeItem', this.list, null);
    }

    // 复选框操作
    private checkboxHandler(item: any) {
        item.checkend = !item.checkend;
        const checkendArr: any[] = [];
        this.popChildren(item, (single: any) => {
           single.checkend = item.checkend;
           if (single.checkend) {
              checkendArr.push(this.listTiemToTreeListItem(single));
            }
        });
        this.list = this.resetList(this.list);
        this.$emit('changeItem', this.list);
        this.$emit('getCheckends', checkendArr);
    }

    private getCheckends(arr: any[]) {
        const checkendArr: any[] = [];
        this.list.forEach((item) => {
            this.popChildren(item, (single: any) => {
                if (single.checkend) {
                    checkendArr.push(this.listTiemToTreeListItem(single));
                }
            });
        });

        this.$emit('getCheckends', checkendArr);
    }

    // 递归遍历子级
    private popChildren(single: any, callBack: (arg: any) => void) {
        (single[this.config().children] || []).forEach((s: any) => {this.popChildren(s, callBack); });
        callBack(single);
    }
}
</script>
<style lang="less" scoped>
.tree{
    &_list{
        padding:0;
        margin:0;
        list-style:none;
        text-align:left;
        &_label{
            cursor:pointer;
            display:flex;
            align-items:center;
            margin-left:5px;
            margin-bottom:5px;
            &_retract{
                width:1em;
                height:1em;
                border:1px solid #eee;
                display:flex;
                justify-content:center;
                flex-shrink: 0;
                align-items:center;
                transition:all .3s;
                border-radius:.2em;
                &:before{
                    content:'+';
                    color:#666;
                }
                &.open{
                    border:1px solid  #3a8ee6;
                    color: #3a8ee6;
                    &:before{
                        content:'';
                        width:.4em;
                        height:.1em;
                        background:#3a8ee6;
                    }
                }
                &.uncertain{
                    &:before{
                        content:'?';
                        font-size:.4em;
                    }
                }
            }
            &_txt{
                flex-grow:1;
                overflow:hidden;
                 margin-left:5px;
                >div{
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                    &:hover{
                        color:#3a8ee6
                    }
                    &.active{
                         color:#3a8ee6
                    }
                }
            }
        }
        &_children{
            margin-left:20px;
        }
    }
}

.checkbox{
    width:1em;
    height:1em;
    border:1px solid #eee;
    flex-shrink: 0;
    transition:all .3s;
    border-radius:.2em;
    &.checkend{
        border:1px solid #3a8ee6;
        position:relative;
        background:#3a8ee6;
        &:after{
            content: '';
            position: absolute;
            background: #fff;
            width: .06em;
            height: .6em;
            left: 58%;
            top: 29%;
            margin: -.15em 0 0;
            transform: rotateZ(45deg);
        }
        &:before{
            content: '';
            position: absolute;
            background: #fff;
            width: .06em;
            height: 0.3em;
            left: 30%;
            top: 40%;
            transform: rotateZ(-45deg);
        }
    }
}
</style>