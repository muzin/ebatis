# ebatis

Ebatis is a relational database data access framework For Node.js.

The biggest feature of ebatis is to support dynamic SQL, transaction control, simple configuration and easy to handle.

Note：
1. ebatis requires Node.js to support es6/7 syntax, and if the version is too low, it is recommended to upgrade the node version;

2. currently only support the Mysql database.

[切换为中文](./docs/zh_cn/index.md)

### table of contents

##### [Hello World](./docs/zh_cn/helloworld.md)

##### [Configuration](./docs/zh_cn/ebatis_config.md)

##### [Api](./docs/zh_cn/api/api.md)

###### - [Api Ebatis](./docs/zh_cn/api/api_ebatis.md)

###### - [Api SqlChain](./docs/zh_cn/api/api_sqlchain.md)

###### - [Api SqlChainFactory](./docs/zh_cn/api/api_sqlchainfactory.md)

###### - [Api Mapper](./docs/zh_cn/api/api_mapper.md)

##### [Dynamic Sql](./docs/zh_cn/dynamic_sql.md)

##### [Example](./docs/zh_cn/example.md)


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
        timeout : -1                       // timeout time, default 30000ms, if timeout > 0, Invalid timeout action.
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
        "timeout" : -1
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
  timeout : -1
```

### Example

#### 1. 编写Ebatis配置文件
ebatis_config.yml

```yaml
datasource :                                # 数据源配置信息
  _name : default                           # 数据源名称
  _type : mysql                             # 数据源类型 (暂时只支持mysql)
  _mode : pool                              # 数据源模式  connection | pool | cluster, default connection
  hostname : 127.0.0.1                      # 数据源ip地址
  user : root
  password : **********
  database : test
  connectionLimit : 50

sql :                                       # sql配置信息
  mapper : ./sql/*.xml                      # mapper文件位置，已rootpath为基准

  # or
  mapper :
    - ./sql/*.xml 
    - ./sql/*.xml 

sqlchain :                                  # sqlchain配置信息
  transaction : true                        # 开启事务
  timeout : 3000                            # 设置超时时间，到期后没有执行完毕，自动回滚
  printsql : false                          # 是否打印执行sql的信息
```

#### 2. 编写Mapper文件
sql/user.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE sqls
        PUBLIC "-//ebatis.muzin.cn//DTD Config 3.0//EN"
        "http://mithub.oss-cn-beijing.aliyuncs.com/ebatis/ebatis-sqls.dtd">

<sqls namespace="user" >

    <sql id="table_name">t_user</sql>

    <sql id="field_all_names">*</sql>

    <!-- get all user  -->
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

    <!-- insert user -->
    <insert id="addUser" param="user">
        INSERT INTO t_user
        <for suffix="(" separate=", " prefix=")" var="item of Object.keys(user) ">
            #{ item }
        </for>
        <for suffix=" VALUES(" separate=", " prefix=")" var="item of Object.values(user) ">
            ${ item }
        </for>
    </insert>

    <!-- get users by type-->
    <select id="getUsersByType" param="user, type">
        SELECT
        *
        FROM
        t_user
        <where>
            <choose>
                <when test="type == 1">
                    <if test="user.name != null">
                        type = 1
                    </if>
                </when>
                <when test="type == 2">
                    type = 2
                </when>
                <when test="type == 3">
                    type = 3
                </when>
                <otherwise>
                    type = 0
                </otherwise>
            </choose>
        </where>
    </select>

    <!-- add users -->
    <insert id="addUsers" param="users">
        INSERT INTO t_user
        <for suffix="(" separate=", " prefix=")" var="item of Object.keys(users[0])">
            #{ item }
        </for>
        VALUES
        <for separate=", " var="user of users">
            <for suffix="(" separate=", " prefix=")" var="item of Object.values(user)">
                ${ item }
            </for>
        </for>
    </insert>

    <!-- update user info -->
    <update id="updateUser" param="user">
        update
            <include ref="table_name" />
        <set>
            <if test="user.name != null and user.name != ''">
                name = ${ user.name }
            </if>
            <if test="user.age != null and user.age != ''">
                age = ${ user.age }
            </if>
        </set>
        <where>
            id = ${ user.id }
            <if test="user.name != null">
                name = ${ user.name }
            </if>
        </where>

    </update>

    <!-- delete user -->
    <delete id="deleteUser" param="id">
        DELETE FROM
            <include ref="table_name" />
        WHERE
            id = ${ id }
    </delete>

</sqls>
```

##### 2.1 生成Mapper对应的js接口文件
在程序启动后会在xml所在的目录生成对应的js接口文件，直接引入js接口文件，即可调用动态sql。

如下：
```js
/**
 * Ebatis generator mapper, it's not editable.
 */
let userMapper = {

	/**
	 * @returns {MapperInterface}
	 */
	getAllUsers : function getAllUsers () { 
		return { };
	},

	/**
	 * @returns {MapperInterface}
	 */
	getUsers : function getUsers (user) { 
		return { };
	},

	/**
	 * @returns {MapperInterface}
	 */
	addUser : function addUser (user) { 
		return { };
	},

	/**
	 * @returns {MapperInterface}
	 */
	getUsersByType : function getUsersByType (user, type) { 
		return { };
	},

	/**
	 * @returns {MapperInterface}
	 */
	addUsers : function addUsers (users) { 
		return { };
	},

	/**
	 * @returns {MapperInterface}
	 */
	updateUser : function updateUser (user) { 
		return { };
	},

	/**
	 * @returns {MapperInterface}
	 */
	deleteUser : function deleteUser (id) { 
		return { };
	},
};

exports = module.exports = userMapper;
```


#### 3. 编写逻辑代码
[async/await/Promise版逻辑代码](./docs/zh_cn/index.md)
```js

var Ebatis          = require('ebatis');
var SqlChainFactory = Ebatis.SqlChainFactory;


var ebatis = Ebatis();

// set root path
ebatis.setRootPath(__dirname);

//ebatis.loadConfig(ebatis_config);
ebatis.loadConfigFile('./ebatis_config.yml');

// 开启开发模式，自动生成Mapper的js接口文件
ebatis.dev(true);

process.on('uncaughtException',function(e){
    console.log(e.stack);
});

// 当ebatis完成时，调用
ebatis.finish(function(){
    
    // 导入Mapper的js接口文件
    var UserMapper      = require('./sql/user');
    
    console.log('finish');
    console.time('use time');
    
    var sqlChain = SqlChainFactory.createSqlChain();
    // 获取user命名空间下getUsers的Mapper
    var getUsers = sqlChain.getMapper('user.getUsers');
    // or
    var getUsers = ebatis.getMapper('user.getUsers');

    console.time('one');

    // 单独执行的动态sql没有事务
    getUsers.param.promise({id : 20}).then((list)=>{
        console.log('list');
        console.log(list);
    });

    console.time('g sql');
    let s = getUsers.toFunction()({id:20});
    console.timeEnd('g sql');
    
    sqlChain
        .exec(UserMapper.getUsers({id : 100}))
        .exec('select * from t_user where id = 2')
        .exec(s, function(err,result){
            console.log('getAllUsers');

            setTimeout(function(){
                sqlChain
                    .exec(s, function(err,result){
                        console.log('getAllUsers1');

                    })
                    .end(function(err, scope){
                        console.log('end');
                        console.log(scope);
                        console.timeEnd('use time');
                    });
                    // 如果不设置结束后的回调，尽量调用SqlChain的close函数
                    // 不建议等待SqlChain超时，会影响数据不能及时提交
            },3000);

        });

    /*(async function(){
        try {
            let scope = ebatis.getScope();
            let getUsers = ebatis.getMapper('user.getUsers');
            let a = await getUsers.param.promise({id : 100});
            console.log(a);
        }catch(e){
            console.log(e);
        }
    })();*/
});

```