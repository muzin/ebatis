# Mapper Api

#### name *[Field]*
Mapper的名称

#### namespace *[Field]*
Mapper的命名空间

#### fullname *[Field]*
Mapper的全名

#### connection *[Field]*
Mapper对象对应的数据库连接

#### toFunction() => Function
获取Mapper对应的sql生成函数

#### toSourceCode() => String
获取Mapper对应的sql生成函数的源代码

#### param([...args:any, callback:function]) => void
当指定参数后，会立即执行该sql，不支持事务。

只有sqlchain支持事务。

args : sql生成函数所需的参数

callback : 执行完毕的回调函数

事例：
```js
var sqlChain = SqlChainFactory.createSqlChain();
var getUsers = sqlChain.getMapper('user.getUsers');

getUsers.param({id : 10},(err, result)=>{
    var list = result;
    console.log('list');
    console.log(list);
});
```

#### param.promise([...args:any]) => Promise
param函数Promise化 

事例：
```js
var sqlChain = SqlChainFactory.createSqlChain();
var getUsers = sqlChain.getMapper('user.getUsers');

getUsers.param.promise({id : 10}).then((list)=>{
    console.log('list');
    console.log(list);
});         