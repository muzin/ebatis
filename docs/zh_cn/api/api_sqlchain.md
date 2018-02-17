# SqlChain Api

SqlChain继承了EventEmitter,基于事件去执行。每个SqlChain都是异步的，在调用`exec`函数时，相当于把sql以及回调函数注册到SqlChain的chain上，
在sqlChain初始化完毕，获取数据库连接后，在执行chain上的sql以及回调函数。sql的执行顺序会按照`exec`函数注册sql的顺序去执行。
当前一个sql执行完毕后才会执行下一个sql。

SqlChain中有$scope属性，可以用来存放查询出来的数据。


#### exec((sql:string[[,param:array], callback:function])

exec函数支持三种格式的参数：

**sql, param(可选), callback(可选)**

    sql:string[[,param:array], callback:function]

**sql对象, callback(可选)**

    {sql:string, values:array}[,callback:function])

**function**

    func:function


#### end([callback:function])
SqlChain执行完毕后设置的回调函数, `end`函数调用后会立即执行。

建议在SqlChain声明完最后一个需要执行的sql后，声明`end`函数的调用

#### throw(err, data)
在执行`exec`函数中，如果想让SqlChain停下来，可以在`exec`函数中调用`throw`函数。调用`throw`后，如果SqlChain开启事务，将会会回滚；
如果指定了`end`函数的回调函数，将会执行`end`函数

#### resetTimeout(timeout:number)
重置超时时间


#### getTimeout()
获取SqlChain设置的超时时间


#### getConnection()
获取当前SqlChain的数据库连接


#### commit([callback:function])
在SqlChain开启事务后，需要执行`commit`函数来提交数据库的操作。


#### rollback([callback:function])
在SqlChain开启事务后，如果需要回滚，执行`rollback`函数来回滚。
SqlChain开启事务后，触发回滚的时机：
1. 当执行的sql有误;
2. 当sql执行后的回调函数中有异常;
3. 当SqlChain设置超时并且在规定时间内没有执行正常执行完所有sql时


#### close([callback:function])
关闭SqlChain。
如果SqlChain开启事务，关闭后会自动提交对数据库的操作，释放数据库链接。