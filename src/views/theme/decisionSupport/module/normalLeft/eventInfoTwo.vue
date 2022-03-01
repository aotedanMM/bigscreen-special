<template>
  <div class="EventInfoView" style="height:100%;">
     <EventInfoTwo v-if="data.length" :list="data" :param="param" :total="total" :pages="pages" :changePage="changePage" />
    <LoadingElement v-else :status="status" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EventInfoTwo from '@/components/feature/common/eventInfo/EventInfoTwo.feature.vue';
import { eventInfoServer } from '@/api/installServer';
import LoadingElement from '@/components/feature/common/Loading/Loading.vue';
import { getDateFormat } from '@/util/tools';
@Component({
  name: 'EventInfoTwoView',
  components: {
    EventInfoTwo,
    LoadingElement,
  },
})
export default class EventInfoTwoView extends Vue {
  private param = {
    startTime: getDateFormat({ last: 'month' }),
    endTime: getDateFormat(),
    nowPage: 1,
    pageSize: 5,
  };

  private data = [];

  private pages = 0;

  private total = 0;

  private loading: any = true;

  private interValT: any;

  private status = 'loading';

  private mounted() {
    this.interValT = setInterval(() => {
      this.changePage();
    }, 300000);
  }

  private beforeDestroy() {
    clearInterval(this.interValT);
  }

  private changePage(val?: number) {
    if (val) {
      this.param.nowPage = val;
    }
    this.init();
  }

  private init() {
    eventInfoServer.getEventInfoList(this.param).then((res: any) => {
      if (res.data) {
          const { list, total, pages } = res.data;
          this.data = list;
          this.total = total;
          this.status = '';
      } else {
        this.status = 'nodata';
      }
    }).catch(() => {
        this.status = 'nodata';
      });
  }

  private async created() {
    this.init();
  }
}
</script>

<style lang="less" scoped>
.eventInfoTwo {
  height: 100%;
  display: flex;
  flex-direction: column;
  &_list {
    overflow: hidden;
    margin-right:14px;
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
      margin: 16px 0;
      padding-bottom: 16px;
      color: #fff;
      &_info {
        &_val {
          color: #52728c;
          font-size: 27px;
        }
        &_single {
          display: flex;
          margin-bottom: 10px;
          color: #fff;
          font-size: 28px;
        }
        &_label {
          color: #e5f4ff;
          // background: url('../../../../../../../../../assets/img/eventInfo/locationbg.png');
        }
      }
      &_txt {
        padding: 0 20px;
        font-size: 28px;
      }
    }
  }
}
</style>