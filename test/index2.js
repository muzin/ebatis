
var Ebatis          = require('../lib/ebatis');
var SqlChainFactory = Ebatis.SqlChainFactory;
var ebatis_config   = require('./ebatisConfig');
var UserMapper      = require('./user');

var ebatis = Ebatis();

ebatis.setRootPath(__dirname);

//ebatis.loadConfig(ebatis_config);
ebatis.loadConfigFile('./ebatis_config.yml');
ebatis.dev(true);

process.on('uncaughtException',function(e){
    console.log(e.stack);
});

;(async ()=>{

    await ebatis.finish.promise();

    console.log('finish');
    console.time('use time');
    for(var i = 0; i < 300000; i++) {
        var sqlChain = SqlChainFactory.createSqlChain();

        var users = await sqlChain.exec.promise(UserMapper.getUsers({id: 100}));
        //console.log(users);
        var user = await sqlChain.exec.promise('select * from t_user where id = 2');
        //console.log(user);
        console.log(i);

        var pool = sqlChain.connectionInfo;

        console.log(`_acquiringConnections : ${pool._acquiringConnections.length}`);
        console.log(`_allConnections : ${pool._allConnections.length}`);
        console.log(`_connectionQueue : ${pool._connectionQueue.length}`);
        console.log(`_freeConnections : ${pool._freeConnections.length}`);

        sqlChain.close();
    }

    console.timeEnd('use time');
})();




