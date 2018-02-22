# ebatis

Ebatis is a relational database data access framework For Node.js.

The biggest feature of ebatis is to support dynamic SQL, transaction control, simple configuration and easy to handle.

Note：
1. ebatis requires Node.js to support es6/7 syntax, and if the version is too low, it is recommended to upgrade the node version;

2. currently only support the Mysql database.

[切换为中文](./zh_cn/index.md)


### table of contents

##### [Hello World](./zh_cn/helloworld.md)

##### [Configuration](./zh_cn/ebatis_config.md)

##### [Api](./zh_cn/api/api.md)

###### - [Api Ebatis](./zh_cn/api/api_ebatis.md)

###### - [Api SqlChain](./zh_cn/api/api_sqlchain.md)

###### - [Api SqlChainFactory](./zh_cn/api/api_sqlchainfactory.md)

###### - [Api Mapper](./zh_cn/api/api_mapper.md)

##### [Dynamic Sql](./zh_cn/dynamic_sql.md)

##### [Example]()

### How to use

#### Install module:
```sh
npm install ebatis

# or

npm install -g ebatis
```
#### Use it:
``` js
let Ebatis = require('ebatis');
let ebatis = Ebatis();

# set root path
ebatis.setRootPath(__dirname);

# load configuration info
ebatis.loadConfig(ebatis_config);
```

#### Simple Configuration:

###### config by js
```js
exports = module.exports = {
    datasource : {
        _name : 'default',                 // datasource name, default 'default'
        _type : 'mysql',                   // datasource type, requires
        _mode : 'pool',                    // datasource mode, [connection | pool], requires
        hostname : '127.0.0.1',            // other parameter refence mysql configuration
        user : 'root',
        password : '**********',
        database : 'test'
    },
    sql : {                                               
        mapper : `./*.xml`                 // dynamic sql xml
    },
    sqlchain : {
        transaction : true,                // open transaction
        timeout : -1,                       // timeout time, default 30000ms, if timeout > 0, Invalid timeout action.
        printsql : true
    }
};
```

###### config by json
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

###### config by yaml
```yaml
datasource : 
  _name : default           
  _type : mysql  
  _mode : pool
  hostname : 127.0.0.1,
  user : root,
  password : **********
  database : test

sql :                                               
  mapper : ./*.xml

sqlchain :
  transaction : true, 
  timeout : -1,
  printsql : true
```

