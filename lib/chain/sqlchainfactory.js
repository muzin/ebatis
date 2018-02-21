/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
let Scope    = require('../scope');
let SqlChain = require('./sqlchain');

function SqlChainFactory(){}

SqlChainFactory.prototype.createSqlChain = function(namespace){

    if(!namespace) namespace = 'default';

    let configScope = Scope.getScope('config');
    let sqlChainConfig = configScope.sqlchain || {};
    let connObj = this.getConnectionScope(namespace);
    let sqlChain = new SqlChain(sqlChainConfig, connObj);

    return sqlChain;
};

SqlChainFactory.prototype.getConnectionScope = function getConnectionScope(name) {
    let connectionscope = Scope.getScope('connection');
    if(name in connectionscope){
        return connectionscope[name];
    }else{
        throw `名称为${ name }的Scope不存在`;
    }
};

exports = module.exports = new SqlChainFactory();