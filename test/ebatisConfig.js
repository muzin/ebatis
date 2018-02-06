
exports = module.exports = {

    datasource : {
        _name : 'default',
        _type : 'mysql',
        _mode : 'pool', // mode  connection | pool | cluster, default connection
        hostname : '127.0.0.1',
        user : 'root',
        password : 'muzin123admin',
        database : 'test',
        connectionLimit : 50
    },

// datasource : [
//     {
//         _name : 'db1',
//         _type : 'mysql',
//         _mode : ' connection', // mode  connection | pool | cluster, default connection
//         hostname : '127.0.0.1',
//         username : 'root',
//         password : 'Muzin123admin',
//     }
// ],

    sql : {                                                 // sql 对象

        mapper : `./*.xml`,                                 // sql mapper 对象

        // mapper : [
        //     './*.xml',
        //     './*.xml'
        // ]

    },

    sqlchain : {                                            // sqlchain 配置信息

        transaction : true,                                 //          是否开启事务，默认开启事务

        //timeout : 3000,                                       // 每个sqlchain执行的超时时间，负数为不超时 （默认：30000 ms）

    },

    logger : {                                              // sql 日志

        enable              : true,

        console             : true,
        file                : true,
        filepath            : './logs/sql/',

        timeoutlog          : true                          // 是否记录超时日志，   记录可以跟踪哪些sqlchain未关闭chain，或者

    }

};


