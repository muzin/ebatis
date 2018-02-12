# SqlChainFactory Api
SqlChainFactory 用来创建SqlChain.

#### createSqlChain(namespace:string) => SqlChain
创建一个sqlchain。通过指定namespace来获取相应数据源的sqlchain。

sqlchain可以用来串行执行sql，和函数。

如果没有参数，默认创建数据源名称为`default`的sqlchain。

注意：sqlchain只能用在一个流程上，执行完毕后会关闭掉，不能重复使用。

```js
// 默认创建数据源名为`default`的sqlchain
let sqlchain = SqlChainFactory.createSqlChain();   
// or
let sqlchain = SqlChainFactory.createSqlChain('default');   

// 默认创建数据源名为`db1`的sqlchain
let sqlchain = SqlChainFactory.createSqlChain('db1');



sqlchain.exec(sql, function(err,result){
   // code ...
});

```