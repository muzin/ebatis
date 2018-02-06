
var Ebatis          = require('../lib/ebatis');
var SqlChainFactory = Ebatis.SqlChainFactory;
var ebatis_config   = require('./ebatisConfig');
var UserMapper      = require('./user');

var ebatis = Ebatis();
ebatis.setRootPath(__dirname);
ebatis.loadConfig(ebatis_config);

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
    var getAllUsers = sqlChain.getMapper('user.getAllUsers');

    console.time('one')


console.time('g sql')
    let s = getAllUsers.toFunction();
    console.timeEnd('g sql');
    sqlChain
        .exec(UserMapper.getUsers({id : 100}),function(err, result){
            console.log('get Users')
            console.log(result);
        })
        .exec('select * from t_user where id = 2', function(err ,result){
            console.log('two');
            console.timeEnd('one');
            console.time('two');
            this.$scope.four = result;

        })
        .exec(s, function(err,result){
            console.log('getAllUsers');

            //throw 'break'
            console.timeEnd('two')

setTimeout(function(){
    sqlChain.exec(s, function(err,result){
        console.log('getAllUsers1');

        //throw 'break'
        console.timeEnd('two')


    })
},1000)


        })
        .end(function(err, scope){
            console.log('end');
            console.log(scope);
            console.timeEnd('use time');
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


