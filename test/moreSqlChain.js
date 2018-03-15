
var Ebatis          = require('../lib/ebatis');
var SqlChainFactory = Ebatis.SqlChainFactory;
var ebatis_config   = require('./ebatisConfig');
var UserMapper      = require('./user');

var ebatis = Ebatis();

ebatis.setRootPath(__dirname);

//ebatis.loadConfig(ebatis_config);
ebatis.loadConfigFile('./ebatis_config.yml');
ebatis.dev(true);


(async ()=>{

    var count = 1;
    setInterval(async ()=>{
        var sqlChain = SqlChainFactory.createSqlChain();

        var users = await sqlChain.exec.promise(UserMapper.getUsers({id: 100}));
        var user = await sqlChain.exec.promise('select * from t_user where id = 2');

        var pool = sqlChain.connectionInfo;

        console.log(`_acquiringConnections : ${pool._acquiringConnections.length}`);
        console.log(`_allConnections : ${pool._allConnections.length}`);
        console.log(`_connectionQueue : ${pool._connectionQueue.length}`);
        console.log(`_freeConnections : ${pool._allConnections.length}`);

        /*if(pool._allConnections.length - pool._allConnections.length > 10){
            console.log('h')
        };*/

        sqlChain.close();
        console.log('finish')
        count ++;
        console.log(count);
    }, 1);

})()