
exports = module.exports = {
    datasource : {
        _name : 'default',
        _type : 'mysql',
        _mode : 'pool',
        host : '127.0.0.1',
        user : 'root',
        password : '**********',
        database : 'test',
        connectionLimit : 50
    },
    sql : {
        mapper : './*.xml',
    },
    sqlchain : {
        transaction : true,
        timeout : 5000,
        printsql : false
    }
};


