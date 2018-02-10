
var Ebatis          = require('../lib/ebatis');
var SqlChainFactory = Ebatis.SqlChainFactory;
var ebatis_config   = require('./ebatisConfig');
var UserMapper      = require('./user');

var ebatis = Ebatis();

ebatis.setRootPath(__dirname);

//ebatis.loadConfig(ebatis_config);
ebatis.loadConfigFile('./ebatis_config.yml');

process.on('uncaughtException',function(e){
    console.log(e.stack);
});


// 运行日志
// sqlchain 日志
// 错误日志

// 测试   注释，   日志





ebatis.finish(function(){
    console.log('finish');
    console.time('use time');
    var sqlChain = SqlChainFactory.createSqlChain();
    var getUsers = sqlChain.getMapper('user.getUsers');

    console.time('one')


    getUsers.param.promise({id : 20}).then((list)=>{
        console.log('list');
        console.log(list);
    });


console.time('g sql')
    let s = getUsers.toFunction()({id:20});
    console.timeEnd('g sql');
    sqlChain
        .exec(UserMapper.getUsers({id : 100}))
        .exec('select * from t_user where id = 2')
        .exec(s, function(err,result){
            console.log('getAllUsers');


            setTimeout(function(){
                sqlChain.exec(s, function(err,result){
                    console.log('getAllUsers1');


                    sqlChain.close();
                })/*.end(function(err, scope){
                    console.log('end');
                    console.log(scope);
                    console.timeEnd('use time');
                });*/
            },3000)

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


