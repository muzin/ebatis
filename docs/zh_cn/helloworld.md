# Hello World

### 快速集成

1. 导入ebatis
```js
var Ebatis = require('ebatis');
```

2. 导入配置
```js
var ebatis = Ebatis();

var ebatis_config = require('./xxx');

// 固定写法，以这个目录为基准，去寻找动态sql的mapper文件
ebatis.setRootPath(__dirname);

// 装载配置文件，配置文件的写法详见 步骤3
ebatis.loadConfig(ebatis_config)
// or
ebatis.loadConfigFile('../ebatis_config.yml');
ebatis.loadConfigFile('../ebatis_config.js');
ebatis.loadConfigFile('../ebatis_config.json');
```
> 这里的配置信息写在了js对象里，需要装载json，yaml文件，[请点击这里]()

> 查看配置文件的详细参数，[请点击这里]()



3. 创建sqlchain
```js
var SqlChainFactory = Ebatis.SqlChainFactory;

// 如果不填参数默认获取名称为‘default’的数据源
var sqlchain = SqlChainFactory.createSqlChain();
```
> 注：在配置文件中可以为sqlchain设置是否开启事务

4. 查询数据

4.1 回调函数版
```js
// 导入 动态sql 的 映射(mapper) 对象, 已生成的mapper文件的路径为准
var UserMapper = require('./xxx/mapper/user');

sqlchain
    // 执行 sql
    .exec(`
        SELECT * FROM user where id = 123
    `,function(err, result){
        if(err)
            console.log(err);
        this.$scope.one = result;
    })
    // 执行 sql, 带参数
    .exec(`
        SELECT * FROM user where id = ?
    `, [123],function(err,result){
        this.$scope.two = result;
    })
    .exec(UserMapper.getUsers(),function(err, result){
        this.$scope.userlist = result;
    })
    
    // end 函数在回调函数执行完毕后，自动关闭sqlchain，并且释放资源
    .end(function(err, scope){
        console.log(scope.one);
        console.log(scope.two);
        console.log(scope.userlist);
    });
```

4.2 异步函数版
```js
// 导入 动态sql 的 映射(mapper) 对象, 已生成的mapper文件的路径为准
var UserMapper = require('./xxx/mapper/user');

(async ()=>{
    
    
    // 执行 sql
    var ret = await sqlchain.exec.promise(`SELECT * FROM user where id = 123`);
    sqlchain.$scope.one = ret;
    
    // 执行 sql, 带参数
    var ret = await sqlchain.exec.promise(`SELECT * FROM user where id = ?`, [123]);
    sqlchain.$scope.two = result;
        
        
    var ret = await sqlchain.exec.promise(UserMapper.getUsers());
    this.$scope.userlist = result;
    
    
    // 查询完毕后,需要关闭sqlchain，已释放连接
    // 推荐：为sqlchain 配置 超时时间，超时后自动释放连接，关闭sqlchain
    // 
    sqlchain.close();
    
    console.log(scope.one);
    console.log(scope.two);
    console.log(scope.userlist);
        
})();    
```

> `SqlChain`对象内置了`$scope`属性可以将查询出来的数据存储到`$scope`中，sqlchain的`exec`函数声明的回调函数的`this`指向的是当前的`SqlChain`对象

> `SqlChain`对象在调用了`end`函数的回调函数后，自动关闭`SqlChain`对象，释放数据库连接资源; 或者等到`SqlChain`超时后，自动关闭并且释放资源