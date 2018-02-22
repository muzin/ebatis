# ebatis

ebatis 是一个关系型数据库数据访问框架 For Node.js。

ebatis最大的特点是支持动态sql，事务控制，配置简便，易于上手。

注意：

1. ebatis需要Node.js支持es6/7语法, 如果版本过低,建议升级Node.js版本;

2. 目前只支持Mysql数据库.

[Change To English](../index.md)

### 目录

##### [Hello World](./helloworld.md)

##### [Configuration](./ebatis_config.md)

##### [Api](./api/api.md)

###### - [Api Ebatis](./api/api_ebatis.md)

###### - [Api SqlChain](./api/api_sqlchain.md)

###### - [Api SqlChainFactory](./api/api_sqlchainfactory.md)

###### - [Api Mapper](./api/api_mapper.md)

##### [Dynamic Sql](./dynamic_sql.md)

##### [Example](./example.md)


### 如何使用

#### 安装模块:
```sh
npm install ebatis

# or

npm install -g ebatis
```
#### 使用:
``` js
let Ebatis = require('ebatis');
let ebatis = Ebatis();

// 导入 ebatis 的 配置信息
let ebatis_config = require('./conf/ebatis_config');

// 设置根目录，这里的根目录是为动态sql的xml作参考，以此路径为基准
ebatis.setRootPath(__dirname);

// 加载配置信息
ebatis.loadConfig(ebatis_config);
```

#### 简单配置:

###### 通过js配置
```js
exports = module.exports = {
    datasource : {
        _name : 'default',                 // 数据源名称, 默认为 'default'
        _type : 'mysql',                   // 数据源类型, (mysql), 必须
        _mode : 'pool',                    // 数据源模式, (connection | pool), 必须
        hostname : '127.0.0.1',            // 其他参数参考mysql模块的配置信息
        user : 'root',
        password : '**********',
        database : 'test'
    },
    sql : {                                               
        mapper : `./*.xml`                 // 配置了动态sql的xml文件
    },
    sqlchain : {
        transaction : true,                // open transaction
        timeout : -1,                       // timeout time, default 30000ms, if timeout > 0, Invalid timeout action.
        printsql : true
    }
}
```

###### 通过json配置
```json
{
    "datasource" : {
        "_name" : "default",                
        "_type" : "mysql",
        "_mode" : "pool",
        "hostname" : "127.0.0.1",
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

###### 通过yaml配置
```yaml
datasource : 
  _name : default           
  _type : mysql  
  _mode : pool
  hostname : 127.0.0.1
  user : root
  password : **********
  database : test

sql :                                               
  mapper : ./*.xml

sqlchain :
  transaction : true
  timeout : -1
  printsql : true
```

#### 动态sql

动态sql文件的编写

```xml
<?xml version="1.0" encoding="UTF-8"?>

<sqls namespace="user" database="default" >

    <sql id="table_name">t_user</sql>

    <sql id="field_all_names">*</sql>

    
    <select id="getAllUsers" >
        SELECT
            <include ref="field_all_names"/>
        FROM
            <include ref="table_name"/>
    </select>

    
    <select id="getUsers" param="user">
        SELECT
            <include ref="field_all_names"/>
        FROM
            <include ref="table_name"/>
        <where>
            <if test="!~[null, ''].indexOf( user.id )">
                id &lt;= ${ user.id }
            </if>
        </where>
    </select>

</sqls>
```

#### 动态sql支持的标签

- sqls
- sql 
- select
- insert
- update
- delete
- where
- set
- include
- if
- for
- choose
- when
- otherwise
