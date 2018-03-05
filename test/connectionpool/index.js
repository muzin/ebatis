
var mysql = require('mysql');

var pool = mysql.createPool({
    hostname : '127.0.0.1',
    user : 'root',
    password : 'muzin123admin',
    database : 'test',
    connectionLimit : 100,
});


Array.from({length:300000}).map((item, index)=>{
    pool.getConnection((err, conn)=>{
        conn.query('select * from t_user',function(err, result){
            console.log(`_${index}`);
            //console.log(result);

            var pool = conn._pool;

            console.log(`_acquiringConnections : ${pool._acquiringConnections.length}`);
            console.log(`_allConnections : ${pool._allConnections.length}`);
            console.log(`_connectionQueue : ${pool._connectionQueue.length}`);
            console.log(`_freeConnections : ${pool._freeConnections.length}`);

            conn.release();
        })
    });
});
