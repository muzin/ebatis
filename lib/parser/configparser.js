/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
let gulp             = require('gulp');
let path             = require('path');
let fs               = require('fs');

let Scope            = require('../scope');
let DataSourceParser = require('./datasourceparser');
let ConnectionParser = require('./connectionparser');
let SqlParser        = require('./sqlparser');
let Mapper           = require('../core/mapper');


function ConfigParser(){}

ConfigParser.prototype.rootpath = null;

ConfigParser.prototype.parse = function parse(config, callback){

    // 加载数据源
    if('datasource' in config){
        let datasource = config.datasource;
        let dsscope = Scope.getScope('datasource');
        Object.assign(dsscope, DataSourceParser.parse(datasource));
    }

    // 如果存在数据源, 解析成连接对象
    if(Object.keys(Scope.getScope('datasource')).length > 0){

        let dsscope = Scope.getScope('datasource');
        let connscope = Scope.getScope('connection');

        let newConnScope = ConnectionParser.parse(dsscope);

        Object.assign(connscope, newConnScope);

    }


    // 解析sql配置
    if('sql' in config){
        let sqlConfig = config['sql'];
        if('mapper' in sqlConfig && sqlConfig.mapper != null){

            if(this.rootpath == null)
                throw 'rootpath cannot be null.';

            let mpath = null;
            if(sqlConfig.mapper instanceof Array) {
                mpath = [];
                for(let m of sqlConfig)
                    mpath.push(path.resolve(this.rootpath, m));
            }else if(typeof sqlConfig.mapper === 'string'){
                mpath = path.resolve(this.rootpath, sqlConfig.mapper);
            }

            let flist = [];

            gulp.src(mpath).on('data',function(file){
                flist.push(file.history[0]);
            }).on('end', function(e){
                let sqls = SqlParser.parse(flist);

                wiredMapper(sqls);

                let mps = createMapperJs(sqls);

                wiredMapperJs(sqls, mps);

                (callback instanceof Function ? callback : function(){})();
            });

        }
    }

};

function createMapperJs(mappers){
    let ret = {};

    for(let m in mappers){
        if(m.startsWith('_')) continue;

        let mapper = mappers[m];
        let namespace = mapper.namespace;
        let srcpath = mapper.srcpath;
        let destpath = srcpath.substring(0, srcpath.lastIndexOf('.xml')) + '.js';

        let fconts = [];
        fconts.push(`\n/**\n * Ebatis generator mapper, it's not editable.\n */`);
        fconts.push(`let ${namespace}Mapper = {`);

        for(let f in mapper['sqls']){
            if(f.startsWith('_')) continue;
            let fn = mapper['sqls'][f];
            let funcname = fn.name;
            let funcparams = /\(\s*([\s\S]*?)\s*\)/.exec(fn)[1].split(/\s*,\s*/);

            fconts.push(`\n\t/**\n\t * @returns {{sql: string, values: Array}}\n\t */`);
            fconts.push(`\t${funcname} : function ${funcname} (${funcparams.join(', ')}) { \n\t\treturn {sql : '', values : []};\n\t},`);

        }
        fconts.push(`};\n\nexports = module.exports = ${namespace}Mapper;`);

        fs.writeFileSync(destpath, fconts.join('\n'));

        ret[namespace] = destpath;
    }

    return ret;
}

function wiredMapperJs(mappers, mps){

    for(let name in mappers) {
        if (name.startsWith('_')) continue;

        let mapperInterface = require(mps[name]);
        let mapper = mappers[name];
        for(let fnname in mapper['sqls']){
            if(fnname.startsWith('_')) continue;

            mapperInterface[fnname] = function(){
                let f = Scope.getScope('mapper')[name + '.' + fnname];
                let args = [];
                for(let i = 0; i < arguments.length; i++) args.push(arguments[i]);
                return f.toFunction.apply(f, args);
            }
        }


    }
}

function wiredMapper(mapper){

    let sqlScope = Scope.getScope('sql');
    let dsscope = Scope.getScope('datasource');
    let connscope = Scope.getScope('connection');

    Object.assign(sqlScope, mapper);

    for(let i in sqlScope) {
        if(i.startsWith('_')) continue;
        let item = sqlScope[i];
        let database = item['database'] || 'default';
        if(database in dsscope)
            item.datasource = dsscope[database];
        if(database in connscope)
            item.connectioner = connscope[database];
    }

    let mapperScope = Scope.getScope('mapper');

    for(let i in sqlScope) {
        if(i.startsWith('_')) continue;
        let item = sqlScope[i];
        let database = item['database'];
        if(database in dsscope)
            item.datasource = dsscope[database];
        if(database in connscope)
            item.connectioner = connscope[database];
    }

    var sqllist = [];
    for(let i in sqlScope) {
        if(i.startsWith('_')) continue;
        let item = sqlScope[i];
        let connectioner = item.connectioner;

        for(let s in item.sqls){
            if(s.startsWith('_')) continue;
            let sqls = item.sqls[s];
            sqllist.push(new Mapper(s, i, sqls, connectioner));
        }
    }

    for(let item of sqllist){
        let fullname = item['fullname'];
        mapperScope[fullname] = item;
    }
}


exports = module.exports = new ConfigParser();
