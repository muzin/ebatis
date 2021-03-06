# Ebatis Configuration (Ebatis 配置)


### Datasource
下划线开头为Ebatis的配置信息，必须填写
数据源支持多数据源，

##### _name
数据源名称
默认为 `default`

> 多数据源时必须指定数据源的名称，否则Ebatis将不加载该数据源

##### _type
数据源的类型 

必须指定

目前数据源类型支持： Mysql。

预计会加入Postgresql, SqlServer, Sqlite3

##### _mode
数据源模式

模式支持 connection(单个连接) | pool（连接池） | cluster(集群，暂不支持)
默认模式: connection

```js
datasource : {
    _name : 'default',
    _type : 'mysql',                    // 数据库类型
    _mode : 'pool',                     // 模式支持 connection(单个连接) | pool（连接池） | cluster(集群，暂不支持), 默认模式: connection
    host : '127.0.0.1',
    user : 'root',
    password : '**********',
    database : 'test',
    connectionLimit : 50,
    ... 
}

// or

datasource : [{
    _name : 'default',
    _type : 'mysql',                    // 数据库类型
    _mode : 'pool',                     // 模式支持 connection(单个连接) | pool（连接池） | cluster(集群，暂不支持), 默认模式: connection
    host : '127.0.0.1',
    user : 'root',
    password : '**********',
    database : 'test',
    connectionLimit : 50,
    ... 
},{
    _name : 'db1',
    _type : 'mysql',                    // 数据库类型
    _mode : 'connection',                     // 
    host : '127.0.0.1',
    user : 'root',
    password : '**********',
    database : 'test',
    connectionLimit : 50,
    ... 
}]
```
更多数据源参数参考mysql模块 [点击这里](https://github.com/mysqljs/mysql/blob/master/Readme.md)

### Sql

##### mapper

动态sql xml文件的路径

支持指定多个路径

```js
sql : {                                                 // sql 对象

    mapper : './*.xml',                                 // sql mapper 对象

    // 支持多个mapper路径
    mapper : [
        './*.xml',
        './*.xml'
    ]
}
```

### SqlChain

```js
// sqlchain 配置信息
sqlchain : {                                            
    
    // 是否开启事务，默认开启事务
    transaction : true,                                         

    // 每个sqlchain执行的超时时间，负数为不超时 （默认：30000 ms）
    timeout : 5000,
    
    // 打印sql代码以及参数和查询出来的结果
    printsql : true                                     

}
```


## 配置文件格式
#### config for js
```js 
exports = module.exports = {

    datasource : {
        _name : 'default',
        _type : 'mysql',                    // 数据库类型
        _mode : 'pool',                     // 模式支持 connection(单个连接) | pool（连接池） | cluster(集群，暂不支持), 默认模式: connection
        host : '127.0.0.1',
        user : 'root',
        password : '**********',
        database : 'test',
        connectionLimit : 50,
        ... 
    }
    // 支持多数据源
    datasource : [
        {
            _name : 'db1',
            _type : 'mysql',
            _mode : ' connection', 
            host : '127.0.0.1',
            user : 'root',
            password : '**********',
        },
        {
            _name : 'db2',
            _type : 'mysql',
            _mode : ' connection',
            host : '127.0.0.1',
            user : 'root',
            password : '**********',
        }
    ],

    sql : {                                                 // sql 对象
    
        mapper : './*.xml',                                 // sql mapper 对象
    
        // 支持多个mapper路径
        mapper : [
            './*.xml',
            './*.xml'
        ]
    },

    // sqlchain 配置信息
    sqlchain : {                                            
        
        // 是否开启事务，默认开启事务
        transaction : true,                                         
    
        // 每个sqlchain执行的超时时间，负数为不超时 （默认：30000 ms）
        timeout : 5000,
        
        printsql : true                                     
    
    }

};

```

#### 通过json配置
```json
{
    "datasource" : {
        "_name" : "default",                
        "_type" : "mysql",
        "_mode" : "pool",
        "host" : "127.0.0.1",
        "user" : "root",
        "password" : "**********",
        "database" : "test"
    },
    "sql" : {                                               
        "mapper" : "./*.xml"
    },
    "sqlchain" : {
        "transaction" : true, 
        "timeout" : -1,
        "printsql" : true
    }
}
```

#### 通过yaml配置
```yaml
datasource : 
  _name : default           
  _type : mysql  
  _mode : pool
  host : 127.0.0.1
  user : root
  password : **********
  database : test

sql :                                               
  mapper : ./*.xml
  mapper :
    - : ./*.xml
    - : ./*.xml

sqlchain :
  transaction : true
  timeout : -1
  printsql : true
```
