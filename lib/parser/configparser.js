/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
let path             = require('path');
let fs               = require('fs');

let Scope            = require('../scope');
let DataSourceParser = require('./datasourceparser');
let ConnectionParser = require('./connectionparser');
let SqlParser        = require('./sqlparser');
let Mapper           = require('../core/mapper');
let MapperInterface  = require('../core/mapperinterface');


function ConfigParser(){}

ConfigParser.prototype.rootpath = null;

ConfigParser.prototype.parse = function parse(config, callback){

    let _self = this;
    let Ebatis = require('../ebatis')();
    let Logger = Ebatis.Logger;

    Logger.info('Loading Datasource');

    // 加载数据源
    if('datasource' in config){
        let datasource = config.datasource;
        let dsscope = Scope.getScope('datasource');
        Object.assign(dsscope, DataSourceParser.parse(datasource));
    }

    Logger.info('Loading Connections');

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

            Logger.info('Loading Mapper');

            if(this.rootpath == null)
                throw 'rootpath cannot be null.';

            // 拼接 rootpath 和 mapper的路径
            let mpath = null;
            if(sqlConfig.mapper instanceof Array) {
                mpath = [];
                for(let m of sqlConfig.mapper) {
                    mpath.push(path.resolve(this.rootpath, m));
                }
            }else if(typeof sqlConfig.mapper === 'string'){
                mpath = path.resolve(this.rootpath, sqlConfig.mapper);
            }

            let flist = [];

            Logger.info('Scanning Mapper Files');
            var gulp = require('gulp');

            gulp.src(mpath).on('data',function(file){
                let filepath = file.history[0];

                Logger.info('Found mapper file\t\t: ' + filepath);

                flist.push(filepath);
            }).on('end', function(e){
                let sqls = SqlParser.parse(flist);

                _self.wiredMapper(sqls);

                let mps = _self.createMapperJs(sqls);

                _self.wiredMapperJs(sqls, mps);

                (callback instanceof Function ? callback : function(){})();
            });

        }
    }

};

/**
 * 将动态sql的函数映射到生成的Mapper对象的函数上面
 * 以便加载完框架后，直接调用Mapper对象的函数生成sql
 * @param mappers
 * @param mps
 */
ConfigParser.prototype.createMapperJs = function createMapperJs(mappers){

    let Ebatis = require('../ebatis')();
    let Logger = Ebatis.Logger;

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

            fconts.push(`\n\t/**\n\t * @returns {MapperInterface}\n\t */`);
            fconts.push(`\t${funcname} : function ${funcname} (${funcparams.join(', ')}) { \n\t\treturn { };\n\t},`);

        }
        fconts.push(`};\n\nexports = module.exports = ${namespace}Mapper;`);

        fs.writeFileSync(destpath, fconts.join('\n'));

        Logger.info('Create mapper object\t:', destpath);

        ret[namespace] = destpath;
    }

    return ret;
};

ConfigParser.prototype.wiredMapperJs = function wiredMapperJs(mappers, mps){

    for(let name in mappers) {
        if (name.startsWith('_')) continue;

        let mapperInterface = require(mps[name]);
        let mapper = mappers[name];
        for(let fnname in mapper['sqls']){
            if(fnname.startsWith('_')) continue;

            mapperInterface[fnname] = function(){
                let f = Scope.getScope('mapper')[name + '.' + fnname];
                return new MapperInterface(f, arguments);
            }
        }


    }
};

ConfigParser.prototype.wiredMapper = function wiredMapper(mapper){

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
};


exports = module.exports = new ConfigParser();
