<template>
    <div>
        <div v-for="(item,index) in chooseData"  :key="index">
            <p @click="changeClick(item)">{{item.title}}</p>
        </div> 
    </div>  
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { chooseScreen } from '@/api/installServer.js' ;

@Component({
  name: 'Choose',
})
export default class Choose extends Vue {
    public chooseData: any = {} ;
    private changeClick(item: any) {
        const tempWin: any = window;
        const tmepData = JSON.parse(tempWin.sessionStorage.getItem('token')).data.role.userId;
        if (item.type === '1') {
            window.open(item.url + '?auser&newreceiver=' + tmepData);
        }
        if (item.type === '2') {
            window.open(item.url + '?event=' + tmepData );
        }
    }
    private created() {
        const that = this;
        chooseScreen.getData().then((data: any) => {
            that.chooseData = data.data ;
        });
    }
}
</script>