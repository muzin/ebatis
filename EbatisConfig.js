
var config = {

    dataSources : [
        {
            host : '',
            port : '',
            username : '',
            password : ''
        },
        {

        }
    ],

    // or

    dataSources : {
        "$name" : 'database1',
        "$type" : 'mysql',
        host : '',
        port : '',
        username : '',
        password : ''
    },

    mappers : [
        'classpath:/conf/ebatisConfig.'
    ],
    mapperPackage : [

    ],
    // or
    mapperPackage : '*/*'


}

exports = module.exports = config;
