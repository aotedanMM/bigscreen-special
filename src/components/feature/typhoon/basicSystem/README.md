#Basic BasicSystem

```vue
<template>
    <div class="layoutSidebar">
        <basic-system v-model="tags"   v-slot="{ tagsw , test}">
           <div>
               <div v-for="(item,index) of tagsw" :key="index" @click="test(item.url)">
                {{item.title}}
                </div>
           </div>
        </basic-system>
    </div>
</template>
<script>
    export default{
          data() {
            return {
                tags:[
                          {
                              title: '我是标题',
                              url: 'https://www.baidu.com',
                          },
                          {
                              title: '我是标题',
                              url: 'https://www.baidu.com',
                          },
                          {
                              title: '我是标题',
                              url: 'https://www.baidu.com',
                          },
                          {
                              title: '我是标题',
                              url: 'https://www.baidu.com',
                          }
                      ]
              }
            }
    }
</script>

 
```
