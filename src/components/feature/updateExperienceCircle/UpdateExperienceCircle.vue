<template>
  <div>
      <ParamForm :radius = 'radius' @getDoughnutData='getDoughnutData'></ParamForm>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ParamForm from '@/components/feature/updateExperienceCircle/paramForm.vue';
import { updateEadsEaffectRange } from '@/api/installServer';
@Component({
  name: 'UpdateExperienceCircle',
   components: {
        ParamForm,
    },
})
export default class UpdateExperienceCircle extends Vue {
    private radius: any = [];
    private newRadius: any = []; // 手动改变经验圈半径
    private eventId = ''; // 事件ID
    private EventType = ''; // 事件类型

    // 监听经验圈半径以及事件类型以及事件id的变化
    @Watch('$store.state.eventPushStore', {deep: true })
    private changeRadius() {
        if (this.eventId === this.$store.state.eventPushStore.eventId && this.newRadius.length > 0) {
            if (this.EventType === this.$store.state.eventPushStore.eventLocation.EventType) {
                this.radius = this.newRadius;
                this.upDataArrRadius(this.radius);
            } else {
                if (this.$store.state.eventPushStore.eventLocation.radius) {
                    this.radius = this.$store.state.eventPushStore.eventLocation.radius.split(',');
                    this.upDataArrRadius(this.radius);
                } else {
                    this.radius = ['', '', '', ''];
                }
                this.EventType = this.$store.state.eventPushStore.eventLocation.EventType;
                this.newRadius = [];
            }
        } else {
            if (this.$store.state.eventPushStore.eventLocation.radius) {
                this.radius = this.$store.state.eventPushStore.eventLocation.radius.split(',');
                this.upDataArrRadius(this.radius);
            } else {
                this.radius = ['', '', '', ''];
            }
            this.eventId = this.$store.state.eventPushStore.eventId;
            this.EventType = this.$store.state.eventPushStore.eventLocation.EventType;
            this.newRadius = [];
        }
    }
    private getDoughnutData(arr: any) {
        let flag1 = true;
        let flag2 = true;
        let empty = true;
        let j = 0;
        const length1 = arr.length;
        for (var i = 0 ; i < length1 ; i++) {
            const a = parseInt(arr[i], 10);
            const b = parseInt(arr[i + 1], 10);
            // 判断数值是不是1-999之间；
            if (a > 999 || a < 1 ) {
                flag2 = false;
            }
            // 判断输入是否按从小到大排序；
            if (a >= b) {
                flag1 = false;
            }
            // 判断数值是不是为空；
            if (isNaN(a)) {
                j++;
                if (j === 4) {
                    empty = false;
                }
            }
        }
        if (!flag1 || !flag2 || !empty) {
            if (!flag1) {
                this.$message({
                    type : 'success',
                    message : '请按从小到大顺序输入经验圈数值',
                });
                return;
            }
            if (!flag2) {
                this.$message({
                    type : 'success',
                    message : '请输入经验圈数值范围1-999',
                });
                return;
            }
            if (!empty) {
                this.$message({
                    type : 'success',
                    message : '经验圈数输入值不能为空',
                });
                return;
            }
        } else {
          /**
           * 更改本地经验圈以后,通知支撑屏变更
           * */

          this.newRadius = arr; // 手动改变经验圈半径存储值
          // gis所需经验圈范围
          const are = arr.filter((item: any) => {
            return item && item.trim();
          });
          const data: any = {
            eventExtra: {
              affectRange: are.toString(), // 经验圈  '5,10,20,50'
            },
            id: this.$store.state.eventPushStore.eventId, // 事件id
          };
          updateEadsEaffectRange.postUpdateEadsEaffectRange(data).then((res: any): void => {
            if (res.code === 0) {
              /**
               * 修改支撑屏成功后 修改本地经验圈
               * */
              this.$store.commit('eventPushStore/UpdateExperienceCircleRadius', are.toString());
              // 打开经验圈,
              this.messsageBus.emit('ExperienceInCircleSetting');
            } else {
              /**
               * 带需求确认是否提示 提示啥
               * */
              // this.$message.error(res.msg);
              console.log(res.msg);
            }
          });
        }
    }
    // 经验圈范围默认必须展示4个input框；
    private upDataArrRadius(data: any) {
        const j = 4 - data.length;
        if (data.length < 4 ) {
            for (let i = 0 ; i < j ; i ++ ) {
                data.push('');
            }
        }
    }
    private created() {
        this.changeRadius();
    }
}
</script>
<style lang="less" scoped>
</style>
