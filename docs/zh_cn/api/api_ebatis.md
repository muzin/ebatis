# Ebatis Api

#### setRootPath(rootpath:string) => void
设置根路径, 作用是以此路径为基准去查找动态sql的xml文件等其他文件。

> 建议：以`__dirname`为根目录
```js
ebatis.setRootPath(__dirname);
```

#### loadConfig(config : object) => void
加载配置信息。
配置文件

```js
ebatis.loadConfig(ebatis_config);
```

#### loadConfigFile(filename : string) => void
加载配置文件。
配置文件支持js，json，yaml。

```js
ebatis.loadConfigFile('./ebatis_config.js');
// or
ebatis.loadConfigFile('./ebatis_config.json');
ebatis.loadConfigFile('./ebatis_config.yaml');
```
#### dev(bool:boolean) => void
开启开发者模式

在开发者模式下，如果动态sql的xml文件进行了修改，将在xml的目录下，重新生成动态sql所对应的Mapper对象

#### getMapper(fullname:string) => MapperInterface
获取动态sql的对应的Mapper对象，用于数据查询.

fullname的规则: namespace:id

namespace : 动态sql所在的namespace

id        : 动态sql的id
```js
let getUsers = ebatis.getMapper('user:getUsers');

let userlist = getUsers.param.promise({id : 123});

console.log(userlist);
```

#### finish(callback:function) => void
Ebatis 加载完毕以后会调用设置的回调函数。操作时应在Ebatis加载完毕后进行数据查询等操作。
在Web项目中建议将server的`listen`放到Ebatis.finish的回调函数中去执行。
```js
ebatis.finish(function(){
    let PORT = 8080;
    server.listen(PORT,function(){
       console.log(`listen to ${ PORT }`);
    }); 
});
```

#### finish.promise() => void
`finish`函数的Promise化

> 注：调用时需要在前面加`await`关键字来得到结果，否则返回Promise对象, 具体原理参考ES7的async/await。
