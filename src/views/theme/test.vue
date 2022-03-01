<template>
    <div>11111</div>
</template>


<script lang='ts'>

import {Component, Vue, Prop} from 'vue-property-decorator';

// cosnt requestBuffer = new RequestBuffer();
import {dizhenServer} from '@/api/installServer';

@Component({
    name: 'TestServer',
})
export default class TestServer  extends Vue {


    // 请求缓冲测试
    // created() {
    //     console.log(dizhenServer)
    //     dizhenServer.getData(() => {
    //     })
    //     dizhenServer.getData(() => {
    //     })
    //     // console.log(res);
    // }
}

</script>