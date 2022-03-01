<template>
  <div></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { rescueAssistanceServer } from '@/api/feature/RescueAssistance/installRescueAssistanceServer';
import disasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import searchReosurce from '@/api/feature/searchresource/installSearchReosurce';

@Component({
  name: 'ServiceTest',
  components: {},
})
export default class ServiceTest extends Vue {
  public mounted() {
    (window as any).serviceTest = this;
  }

  // 队伍需求-调派
  public testRescueTeamDispatch() {
    const opts: any = {
      point: [116, 39],
      needSet: {
        T002: 100, // 类型T002 需要 100人
        T003: 200, // 类型T003 需要 200人
      },
    };
    rescueAssistanceServer
      .getRescueByTypeAndNeedLoc(opts)
      .then((result: any) => {
        console.log(result);
        console.log(JSON.stringify(result, null, 2));
        // 样例结果
        // const demoResult: any = [
        //   {
        //     "type": "T002",
        //     "list": [
        //       {
        //         "name": "新钢救援队",
        //         "typeCode": "T002",
        //         "typeName": "危化",
        //         "num": 14,
        //         "distance": 35183.06039885108,
        //         "address": "河北省廊坊市文安县新镇镇新钢钢铁有限公司",
        //         "carNum": null,
        //         "contact": null,
        //         "tel": null,
        //         "x": 116.405699,
        //         "y": 39.022756,
        //         "id": "RESQRR0026"
        //       },
        //       {
        //         "name": "中国石油华北油田公司消防支队",
        //         "typeCode": "T002",
        //         "typeName": "危化",
        //         "num": 86,
        //         "distance": 36200.01340718186,
        //         "address": "河北省任丘市北站西路0001号",
        //         "carNum": null,
        //         "contact": null,
        //         "tel": null,
        //         "x": 116.098446,
        //         "y": 38.683977,
        //         "id": "RESQRR0332"
        //       }
        //     ]
        //   },
        //   {
        //     "type": "T003",
        //     "list": []
        //   }
        // ];
      });
  }

  public testRescueDetail() {
    disasterJudgeServer.rescueTeamServer
      .getEquipmentByTeamId({
        id: 'RESQRR0077',
        pageSize: 3,
        pageNo: 1,
      })
      .then((result: any) => {
        console.log(result);
      });
  }

  public testWarbaseDetail() {
    searchReosurce.resourceServer
      .getEquipmentByWarBaseId({
        id: 'guiyang94',
        pageSize: 3,
        pageNo: 1,
      })
      .then((result: any) => {
        console.log(result);
      });
  }

  public testReposityMaterial() {
    searchReosurce.resourceServer
      .getMaterialByReposityId({
        id: 'J001',
        pageSize: 3,
        pageNo: 1,
      })
      .then((result: any) => {
        console.log(result);
      });
  }
}
</script>
<style lang="less" scoped>
</style>