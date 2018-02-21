# 动态sql

动态sql需要通过xml文件进行配置，写法和Java中的Mybatis框架类似，比Mybatis更灵活。

在程序运行中，会将动态sql的xml生成成js代码，然后解析成js函数，在调用js函数时获取最终sql。


### 支持标签

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

### sql
sql片段标签

可以通过`include`标签将sql片段嵌入到其他标签中。

sql片段暂不支持参数。

示例：
```xml
<sqls>
    <sql id="user_table_name">
        table_user
    </sql>
    
    <select id="getAllUsers">
        SELECT
            *
        FROM
            <include ref="user_table_name"/>
    </select>
    <!-- 相当于 -->
    <!--
        SELECT
            *
        FROM
            table_user
    -->
</sqls>
```
### select
查询sql的容器

**属性:**

id:sql的id

param：sql的参数，，支持多个参数

示例：
```xml
<select id="getUsersByType" param="user,type">
    SELECT
        *
    FROM
        table_user
    <where>
        <if>
            id = ${ user.id }
        </if>
        <if test="type != null and type != ''">
            type = ${ type }
        </if>
    </where>
</select>
```



### insert
插入sql的容器

**属性:**

id:sql的id

param：sql的参数，，支持多个参数

示例：
```xml
<insert id="addUsers" param="users">
    INSERT INTO
        table_user
    (name, sex, age, remarks)
    <for var="let user of users" prefix="values(" separate="),(" suffix=")">
        ${ user.name    },
        ${ user.sex     },
        ${ user.age     },
        ${ user.remarks }
    </for>
</insert>
```

### update
更新sql的容器

**属性:**

id:sql的id

param：sql的参数，支持多个参数

示例：
```xml
<update id="updateUser" param="user">
    UDPATE
        table_user
    <set>
        <if test="user.name != null and user.name != ''">
            name = ${ user.name }
        </if>
        <if test="user.sex != null and user.sex != ''">
            sex = ${ user.sex }
        </if>
        <if test="user.age != null and user.age != ''">
            age = ${ user.age }
        </if>
    </set>
    <where>
        id = ${ user.id }
    </where>
</update>
```

### delete
删除sql的容器

**属性:**

id:sql的id

param：sql的参数，支持多个参数

示例：
```xml
<delete id="deleteUser" param="user">
    DELETE FROM
        table_user
    <where>
        id = ${ user.id }
    </where>
</delete>
```

### where
条件限定标签

`where`标签会将标签中的标签按照`AND`关键字分开。

示例：
```xml
<select id="getUsers" param="user">
    SELECT
        *
    FROM
        table_user
    <where>
        <if test="user.age != null and user.age != ''">
            age = ${ user.age }
        </if>
        <if test="user.sex != null and user.sex != ''">
            sex = ${ user.sex }
        </if>
    </where>
    <!-- 相当于 -->
    <!--
        SELECT
            *
        FROM
            table_user
        WHERE
            age = ${ user.age }
        AND
            sex = ${ user.sex }
    -->
</select>

```

### set
set标签

`set`标签会将标签中的标签按照`,`分开。

示例：
```xml
<update id="updateUser" param="user">
    UPDATE
        table_user
    <set>
        <if test="user.sex != null">
            sex = ${ user.sex }
        </if>
        <if test="user.age != null">
            age = ${ user.age }
        </if>
    </set>
    <where>
        id = ${ user.id }
    </where>
    <!-- 相当于 -->
    <!--
        UPDATE
            table_user
        SET
            sex = ${ user.sex },
            age = ${ user.age }
        WHERE
            id = ${ user.id }
    -->
</select>
```
### include
include标签

`include`标签将`sql`标签的sql片段导入到sql中。

示例：
```xml
<sqls>
    <sql id="user_table_name">
        table_user
    </sql>
    
    <select id="updateUser" param="user">
        SELECT
            *
        FROM
            <include ref="user_table_name"/>
        WHERE
            id = ${ user.id }
    </select>
</sqls>
```

### if
if标签

在满足条件的情况下，显示标签内的内容。

在进行`&&`，`||`逻辑运算时，分别使用`and`，`or`代替。

示例：
```xml
<select param="user">
    SELECT
        *
    FROM
        table_user
    <where>
        <if test="user.age != null and user.age != ''">
            age = ${ user.age }
        </if>
    </where>

</select>
```
### for
for标签


示例：
```xml
<insert id="addUsers" param="users">
    INSERT INTO
        table_user
    (name, sex, age, remarks)
    <for var="let user of users" prefix="values(" separate="),(" suffix=")">
        ${ user.name    },
        ${ user.sex     },
        ${ user.age     },
        ${ user.remarks }
    </for>
</insert>
```

### choose, when, otherwise
choose，when，otherwise配合使用相当于`if(){}else if(){} else{}`.

示例：
```xml
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
    <!-- 相当于 -->
    <!--
        if(type == 1){
            // type = 1
        }else if(test == 2){
            // type = 2
        }else if(type ==3){
            // type = 3
        }else{
            // type = 0
        }
    -->
</select>
```
