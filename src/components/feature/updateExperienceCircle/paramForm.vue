<template>
  <div class='ExperienceCircleSetting_wrap'>
      <div class='ExperienceCircleSetting'>
        <div class='ExperienceCircleSetting_cont'>
          <p>经验圈设置</p>
          <div class='ExperienceCircleSetting_echo_radius'>
            <input  v-for='(each, index) in radius' :key="index" type='text' v-model="radius[index]" placeholder='' @input="handleInput" />
          </div>
          <p class='ExperienceCircleSetting_button_cancel'>KM</p>
          <div class='ExperienceCircleSetting_button_confirm' @click="UpdateExperienceCircle"></div>
        </div>
        <div class='ExperienceCircleSetting_cont_close' @click="ExperienceCircleSettingClose()"></div>
      </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
  name: 'ParamForm',
})

export default class ParamForm extends Vue {
     @Prop() private radius?: any ;
     private val: any = '';
     private UpdateExperienceCircle() {
        this.radius = this.radius.map((item: any) => {
            const isNum = Number(item);
            return isNum ? String(isNum) : item;
        });
        this.$emit('getDoughnutData', this.radius);
    }
    private handleInput(e: any) {
        const j = this.radius.length;
        for (var i = 0 ; i < j ; i ++) {
            this.radius[i] = this.radius[i].replace(/[^\d]/g, '');
        }
    }
    private ExperienceCircleSettingClose() {
        this.messsageBus.emit('updateExperienceCircle', { isShow: false });
        this.messsageBus.emit('commonTools', 'updateExperienceCircle' , false);
    }
}
</script>
<style lang="less" scoped>
@url: '../../../assets/img/halfScreen/eventAndTopics';
.ExperienceCircleSetting_wrap{
  width: 529px;
  height: 74px;
}
.ExperienceCircleSetting {
    width: 528px;
    height: 60px;
    background: url("../../../assets/img/updateExperienceCircle/bg.png") no-repeat;
    background-size: 100% 100%;
    overflow:hidden;
    position: relative;
}
.ExperienceCircleSetting_cont{
    display: flex;
    align-items: center;
    width: 93%;
    height: 68%;
    margin: auto;
    margin-top: 10px;
}
.ExperienceCircleSetting_cont>p{
    font-family: MicrosoftYaHei;
    font-size: 22px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
    margin-right: 7px;
    line-height:56px;
}
.ExperienceCircleSetting_cont>p:nth-child(2){
    margin:0 10px;
}
.ExperienceCircleSetting_cont>div{
    display: flex;
    align-items: center; 
}
.ExperienceCircleSetting_cont>div>input{
    width: 56px;
    height: 37px;
    background: url("../../../assets/img/updateExperienceCircle/kuang.png") no-repeat;
    background-size: 100% 100%;
    color: #ffffff;
    text-align: center;
    font-size: 24px;
    border: none;
    outline: none;
    line-height: 35px;
    margin-right: 3px;
    box-sizing: border-box;
    padding: 0 8px;
}

.ExperienceCircleSetting_cont>div>input::-webkit-input-placeholder {
    color: #585c89;
}
.ExperienceCircleSetting_button_confirm{
    width: 39px;
    height: 39px;
    background: url("../../../assets/img/updateExperienceCircle/confirm.png") no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
}
.ExperienceCircleSetting_cont_close{
    position: absolute;
    right: -4px;
    width: 80px;
    height:35px;
    background: url('@{url}/eventAndTopics_close.png') no-repeat 0 50%;
    background-size:100% 100%;
    z-index: 1;
    cursor: pointer;
    top: 4px;
    &:hover{
    background-image: url('@{url}/eventAndTopics_close_h.png');
    background-size:100% 100%;
    }
}
</style>