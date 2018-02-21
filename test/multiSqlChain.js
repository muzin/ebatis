
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

ebatis.finish(()=>{

    console.log('finish')
    var count = 0;
    console.time('used time')
    for(var i = 0; i < 3000; i++){

        var sqlchain = SqlChainFactory.createSqlChain();

            sqlchain
                .exec(UserMapper.getAllUsers(), function (err, result) {
                    this.$scope.users = result;
                    count++;
                    //console.log(count);
                })
                .end(function(err, scope){
                    if(count == 2999) {
                        console.log(count);
                        console.timeEnd('used time');
                    }
                })

    }

})

