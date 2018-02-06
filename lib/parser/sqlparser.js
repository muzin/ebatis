/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
var SqlFuncInfoParser = require('./sqlfuncinfoparser');
var SqlScope = require('../scope/sqlscope');

function SqlParser(){}

SqlParser.prototype.parse = function(...mapper){

    let ret = {};

    let datalist = [];

    if(arguments.length == 1){
        if(arguments[0] instanceof Array){
            for(let i of arguments[0])
                datalist.push(i);
        }else{
            datalist.push(arguments[0]);
        }
    }else if(arguments.length > 1){
        datalist.concat(mapper);
    }

    let sqllist = datalist.map((mapper)=>{
        let sqlsInfo = new SqlFuncInfoParser(mapper).parse()
        let _namespace = sqlsInfo._namespace;
        let _includes = sqlsInfo._includes;
        let _database = sqlsInfo._database;
        let _srcpath = sqlsInfo._srcpath;
        delete sqlsInfo._namespace;
        delete sqlsInfo._includes;

        let sqlScope = new SqlScope();
        sqlScope.namespace = _namespace;
        sqlScope.database = _database;
        sqlScope.srcpath = _srcpath;
        Object.assign(sqlScope.includes, _includes);
        Object.assign(sqlScope.sqls, sqlsInfo);

        return sqlScope;

    });

    for(let item of sqllist){
        var namespace = item.namespace;
        ret[namespace] = item;
    }

    return ret;
};



SqlParser.prototype.parseXmlData = function(){

};

SqlParser.prototype.parseXmlFile = function(){

};


exports = module.exports = new SqlParser();