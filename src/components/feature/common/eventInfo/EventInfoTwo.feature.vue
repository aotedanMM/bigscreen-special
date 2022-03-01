<template>
  <!-- 事件信息的第二种页面 -->
  <div class="eventInfoTwo">
    <div class="eventInfoTwo_list" v-if="list">
      <el-scrollbar class="cmp-scrollbar-y" style="height:100%" wrap-style="height:100%">
        <ul class="eventInfoTwo_ul">
          <li class="eventInfoTwo_ul_li" v-for="(item,key) in list" :key="key">
            <div class="eventInfoTwo_ul_li_info">
              <div class="eventInfoTwo_ul_li_info_single">
                <span class="eventInfoTwo_ul_li_info_label">发布时间：</span>
                <div>
                  <div
                    class="eventInfoTwo_ul_li_info_val"
                    :title="item.reportTime"
                  >{{item.reportTime}}</div>
                </div>
              </div>
              <div class="eventInfoTwo_ul_li_info_single">
                <span class="eventInfoTwo_ul_li_info_label">事件类型：</span>
                <div>
                  <div
                    class="eventInfoTwo_ul_li_info_val"
                    :title="item.eventType"
                  >{{item.eventType}}</div>
                </div>
              </div>
              <div class="eventInfoTwo_ul_li_info_single">
                <span class="eventInfoTwo_ul_li_info_label">上报单位：</span>
                <div class="eventInfoTwo_ul_li_info_val">
                  <div :title="item.sendDeptName">{{item.sendDeptName}}</div>
                </div>
              </div>
            </div>
            <div class="eventInfoTwo_ul_li_txt" v-html="item.title"></div>
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <div v-else>
      <loading-element :loadings="loading"></loading-element>
    </div>
    <div class="eventInfoTwo_page">
      共
      <span class="red">{{total}}</span> 条
      <el-pagination
        layout="prev, pager, next, jumper"
        :pager-count="5"
        @current-change="changePage"
        :current-page="param.nowPage"
        :page-size="param.pageSize"
        :total="total"
        small
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { eventInfoServer } from '@/api/installServer';
import { getDateFormat } from '@/util/tools';
import LoadingElement from '@/components/feature/common/Loading/Loading.vue';
@Component({
  name: 'EventInfoTwo',
  components: {
    LoadingElement,
  },
})
export default class EventInfoTwo extends Vue {
  @Prop({
    default: () => [],
  })
  public list?: any;
  @Prop() public handleSizeChange: any;
  @Prop() public changePage: any;
  @Prop() public param: any;
  @Prop({
    default: 0,
  })
  public total?: number;
  private loading: any = false;
  private mounted() {
    if ( this.list) {
      this.loading = true;
    }
  }
  // private param = {
  //   startTime: getDateFormat({ last: 'month' }),
  //   endTime: getDateFormat(),
  //   nowPage: 1,
  //   pageSize: 5,
  // };

  // private data = [];

  // private pages = 0;

  // private total = 0;

  // private async getData() {
  //   return await eventInfoServer.getEventInfoList(this.param);
  // }

  // private changePage(val: number) {
  //   this.param.nowPage = val;
  //   this.init();
  // }

  // private async init() {
  //   const { data }: any = await this.getData();
  //   const { list, total, pages } = data;
  //   this.data = list;
  //   this.pages = total;
  //   this.total = total;
  // }

  // private created() {
  //   this.init();
  // }
}
</script>
<style lang="less">
.eventInfoTwo_page {
  .el-pager li{
    background-color: transparent;
    color:#d2e1ec;
  }.el-pager li.active{
    color:#3ef7fe;
  }
  .el-pagination button{
    background-color: transparent;
      &:hover{
          color:#3ef7fe;  
        }
  }
  .el-pagination button:disabled{
    background-color: transparent;
  }
  .el-pagination .btn-next, .el-pagination .btn-prev{
    color:#fff;
  }

  .el-pagination {
    .el-pagination__jump {
      color: #fff;
      font-size: 16px;
    }
    .el-input__inner {
      background-color: rgba(20, 212, 250, 0);
      color: #fff;
      font-size: 16px;
      border: none;
      border-bottom: 1px solid #fff;
    }
    .el-pager li {
      font-size: 16px;
    }
  }

}

</style>

<style lang="less" scoped>
.eventInfoTwo {
  height: 100%;
  display: flex;
  flex-direction: column;
  &_list {
    overflow: hidden;
    height: 100%;
  }
  &_page {
    height: 50px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 16px;
    .red {
      color: #ff6800;
      margin: 0 10px;
    }
  }
  &_ul {
    &_li {
      border-bottom: 1px solid rgba(0, 228, 255, 0.5);
      margin: 0 0 30px;
      padding-bottom: 16px;
      color: #fff;
      &_info {
        &_val {
          color: #52728c;
          font-size: 27px;
          flex-grow: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          > div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 20px;
          }
        }
        &_single {
          display: flex;
          margin-bottom: 10px;
          color: #fff;
          font-size: 28px;
        }
        &_label {
          height: 42px;
          background: url('../../../../assets/img/eventInfo/locationbg.png');
          background-size: 100% 100%;
          color: #e5f4ff;
          font-size: 26px;
          line-height: 42px;
          padding-left: 5px;
          flex-shrink: 0;
        }
      }
      &_txt {
        padding: 0 25px;
        font-size: 28px;
      }
    }
  }
  .eventInfoTwo_ul_li{
    width: 97%;
  }
  .eventInfoTwo_ul{
    margin-left: 8px
  }
}
</style>
<style>
 .eventInfoTwo .el-pager li.btn-quicknext, .el-pager li.btn-quickprev{
    color: #ffffff;
  }
</style>