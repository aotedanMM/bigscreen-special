<template>
  <div class="listDistrict popupPanelRight_bg">
    <!-- <p class="list_search">
      <input type="text" v-model="leftClickType" />
    </p>-->
    <!-- <div>{{listData}}</div> -->
    <list-common
      :data="disposeData"
      :keyWord="inputData"
      pageContent="8"
      v-slot="{
        listComKeyWord,
        listComPages,
        listComCur,
        listComFnBtnClick,
        listComAll,
        listComCOMindexs,
        listComFnLast,
        listComFnNext,
      }"
    >
      <div style="padding:40px 45px">
        <h1 class="list_title">{{ setting.title }}</h1>
        <p class="list_search" style="line-height: 40px;font-size:30px">
          搜索：
          <input type="text" v-model="inputData" />
          <!-- <button style="margin-right:10px;">排序1</button>
          <button>排序2</button> -->
        </p>
        <ol class="list_head">
          <li
            v-for="(item, index) in setting.liTitle"
            :key="index"
            :style="item.width"
          >
            {{ item.contnet }}
          </li>
        </ol>
        <div class="list_body">
          <ul
            v-for="(item, index) in listComPages[listComCur - 1]"
            :key="index"
          >
            <li style="width: 30%;">{{ index }}</li>
            <li title="item.name" style="width: 30%;">{{ item.name }}</li>
            <!-- <li
              title="item.address"
              style="width: 25%;"
              
            >{{item.address}}</li>
            <li
              title="item.contact"
              style="width: 20%;"
              
            >{{item.contact}}</li>
            <li
              title="item.telephone"
              style="width: 25%;"
              
            ><i class="el-icon-phone"></i>{{item.telephone}}
            </li> -->
          </ul>
        </div>
        <div class="page-bar-box">
          <div class="page-bar">
            <ul>
              <li v-if="listComCur > 1">
                <a v-on:click="listComFnLast()">上一页</a>
              </li>
              <li v-if="listComCur == 1"><a class="banclick">上一页</a></li>
              <!--当前页背景色为蓝色-->
              <li
                v-for="index in listComCOMindexs"
                :key="index"
                v-bind:class="{ active: listComCur == index }"
              >
                <a v-on:click="listComFnBtnClick(index)">{{ index }}</a>
              </li>
              <li v-if="listComCur < listComAll">
                <a v-on:click="listComFnNext()">下一页</a>
              </li>
              <li v-if="listComCur == listComAll">
                <a class="banclick">下一页</a>
              </li>
              <li>
                <a
                  >共<i style="color:#fff">{{ listComAll }}</i
                  >页</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </list-common>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ListCommon from '@/components/common/render/list.common.vue';
@Component({
  name: 'ListDistrict',
  components: {
    ListCommon,
  },
})
export default class ListDistrict extends Vue {
  @Prop() public setting!: any; // 定义 传入的配置文件
  @Prop() public listData!: any; // 定义 传入的数据
  public inputData: any = ''; // 定义 input框取过来的值并同步给rend层
  public disposeData: any = [];

  // 监听 重组过来的数据 传给render
  @Watch('listData')
  public FnDisposeData(): void {
    this.disposeData = [];
    for (const iterator of this.listData.allData) {
      this.disposeData.push(iterator.tag);
    }
  }
  // 测试数据和方法 开始 完毕删掉

  // 测试数据和方法 完毕 完毕删掉
}
</script>
<style lang="less" scoped>
// @path: '../../../../assets/img/gisModule/districtDialog'; // 定义路径
// .listDistrict {
//   height: 990px;
//   width: 1012px;
//   color: #fff;
//   z-index: 99999;
//   background: url('@{path}/team_bg.png') no-repeat;
//   background-size: 100% 100%;
//   position: absolute;
//   padding: 28px 22px;
// }
// .list_title {
//   font-size: 30px;
//   padding-left: 10px;
//   cursor: move;
//   height: 64px;
//   line-height: 80px;
//   color: #fda100;
// }
// .list_search {
//   display: flex;
//   margin-bottom: 10px;
// }
// .list_search input {
//   -webkit-appearance: none;
//   background: rgba(1, 11, 24, 0.26);
//   background-image: none;
//   border-radius: 4px;
//   box-sizing: border-box;
//   color: #fff;
//   display: inline-block;
//   font-size: inherit;
//   height: 39px;
//   line-height: 39px;
//   outline: none;
//   padding: 0 2px;
//   width: 50%;
//   margin-right: 20px;
//   border: 1px solid #2bf6fd;
// }
// .list_search button {
//   height: 39px;
//   line-height: 43px;
//   width: 100px;
//   border: none;
//   background: rgba(0, 227, 255, 0.6);
//   color: #fff;
//   border-radius: 3px;
//   font-size: 22px;
// }
// .list_head {
//   background: url('@{path}/team_th.png') no-repeat;
//   background-size: 100% 100%;
//   font-weight: 600;
//   width: calc(100% - 8px);
//   padding: 4px 20px;
//   font-size: 26px;
//   text-align: center;
//   display: flex;
//   justify-content: space-between;
// }
// .list_head li {
//   list-style: none;
// }
// .list_body {
//   overflow: auto;
//   height: 78%;
// }
// .list_body ul {
//   display: flex;
//   padding: 0px 20px;
//   font-size: 26px;
//   cursor: pointer;
//   line-height: 45px;
// }
// .list_body ul li {
//   text-overflow: ellipsis;
//   overflow: hidden;
//   white-space: nowrap;
//   text-align: left;
//   text-align: center;
//   width: 200px;
//   list-style: none;
// }

// .page-bar-box {
//   position: absolute;
//   bottom: 40px;
//   right: 20px;
//   width: 100%;
//   height: 80px;
//   display: flex;
//   justify-content: flex-end;
// }
// .page-bar {
//   margin: 40px;
//   width: 450px;
//   height: auto;
// }
// .page-bar ul,
// li {
//   margin: 0px;
//   padding: 0px;
// }
// .page-bar li {
//   list-style: none;
//   margin: 3px;
// }
// .page-bar li:first-child > a {
//   margin-left: 0px;
// }
// .page-bar a {
//   text-decoration: none;
//   position: relative;
//   float: left;
//   padding: 6px 12px;
//   margin-left: -1px;
//   line-height: 1.42857143;
//   color: #c3c3c4;
//   cursor: pointer;
//   background-color: #006c90;
// }
// .page-bar a:hover {
//   background-color: #eee;
// }
// .page-bar a.banclick {
//   cursor: not-allowed;
// }
// .page-bar .active a {
//   color: #fff;
//   cursor: default;
//   background-color: #337ab7;
//   border-color: #337ab7;
// }
// .page-bar i {
//   font-style: normal;
//   color: #d44950;
//   margin: 0px 4px;
//   font-size: 12px;
// }
</style>
