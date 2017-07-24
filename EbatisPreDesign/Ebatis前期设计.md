# Ebatis

Ebatis是一个node.js访问数据库的框架。
Ebatis可以将关系型数据库的表抽象成实体对象，通过访问表的实体对象来对表中的数据进行添加、修改、删除、查询。
Ebatis可以编写动态sql，以确保可以完成复杂的sql查询等操作。

Ebatis
主要有N层
应用层
逻辑层
处理层
访问层
Ebatis 以 访问mysql数据库(访问实体对象模型)为例：
``` js
UserModel.find({name:'aaa',age:12},{name:1});

// --------
ModelName.find({where},{$show:[],$orderBy:['xxx',[asc,desc]],$groupBy:[]},callback);


UserModel.findOne({name:'aaa'},{},callback)

UserModel.update({name:'aaa'},{$set:{title:'asdfasdf'}},callback);
UserModel.newAndSave({name:'aaa'},{$set:{title:'asdfasdf'}},callback);

UserModel.delete({},callback);

UserModel.insert([{},{}],callback);
UserModel.insert({},callback);
```

Ebatis 以 访问mysql数据库(编写动态sql，访问动态sql)为例：

编写 动态sql.xml 或 js
``` xml
<mapper namespace="com.fali.user">
    <sql id="mysql" param="a">
        
    </sql>
    
    <select id="getUser" param="" result="">
        select
            * <include refid="mysql" param="a"/>
        from User
        <where>
            <if test="">
                aaa = ${ user.name }
                bbb = #{ user.age + user.age }
            </if>
        </where>
    </select>
    
    <update id="updateUser" param="" >
         * from User
        <set>
            
        </set>
        <where>
            <if test="'name' in user and user.name != ''">
                aaa = ${ user.name }
                bbb = #{ user.age + user.age }
            </if>
        </where>
    </update>

    <insert id="" param="list">
        insert into User
        <trim prefix="values (" suffix=")" suffixOverrides=",">
	    	<include refid="Base_Insert_Columns_Values" />
	    </trim>
        
    </insert>
    
    <delete id="deleteUser" param="id,user">
        delete from user where id = ${id}
    </delete>

</mapper>
```

结构：
业务层
通过最简单代码来访问数据库


解析层
    (访问实体)将业务层代码解析成sql，准备让底层数据库访问。
    (访问xml中sql的id)将xml中配置的sql，加载到ebatis中，供程序使用。


最底层 访问数据库



在命名空间中加入，数据库信息
如:
    数据库类型（mysql, oracle, mongodb）
    
写一个数据库连接池，供ebatis使用。
可以使用一个数据库源，也可以使用多个数据库源。(默认使用一个数据库源)。


配置文件
    ebatis-config.json
``` txt
    {
        // 如果database是数组，则代表多个数据源，
        // 如果是对象，则代表一个数据库
        database:[
            {
               url:'mysql://localhost:3306/test？charset=utf8',
               username:'' | user:'',
               password:'',
               ...
            },
            {
                url:'oracle://localhost:1205/test？charset=utf8',
               username:'' | user:'',
               password:'',
               ...
            }
        ]
    }            
```


mysql连接种类：
单个连接，
连接池
连接池集群
        
        
        
        





    







