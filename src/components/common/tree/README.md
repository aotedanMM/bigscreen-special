# vedio

```js

  <Tree :treeList="list"/>

  const list = [
        {
            id:'1',
            label:'湖北省',
            children:[
                {
                    id:'1-1',
                    label:'武汉',
                    children:[
                        {
                            id:'1-1-1',
                            label:'江汉区'
                        },
                        {
                            id:'1-1-2',
                            label:'江夏区'
                        },
                        {
                            id:'1-1-3',
                            label:'南昌区'
                        },
                        {
                            id:'1-1-4',
                            label:'硚口区'
                        },
                        {
                            id:'1-1-5',
                            label:'洪山区'
                        }
                    ]
                },
                {
                    id:'1-2',
                    label:'黄石',
                    children:[
                        {
                            id:'1-2-1',
                            label:'下陆区',
                            children:[
                                {
                                    id:'1-2-1-1',
                                    label:'下陆一区'
                                },
                                {
                                    id:'1-2-1-2',
                                    label:'下陆二区'
                                },
                                {
                                    id:'1-2-1-3',
                                    label:'下陆三区'
                                },
                                {
                                    id:'1-2-1-4',
                                    label:'下陆四区'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
      ]
```

