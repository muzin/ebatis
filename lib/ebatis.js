
var fs              = require('fs');
var path            = require('path');
var EventEmitter    = require('events').EventEmitter;
var Yaml            = require('yamljs');
var gulp            = require('gulp');

var proto           = require('./application');
var mixin           = require('./utils/mixin');
var SqlChainFactory = require('./chain/sqlchainfactory');
var Scope           = require('./scope');
var ConfigParser    = require('./parser/configparser');
var SqlParser       = require('./parser/sqlparser');

function Ebatis(){

    this.finish.parent = this;

};
/**
 *
 * @type {Ebatis}
 */
var app = new Ebatis();

/**
 * set root path
 * @param rootpath
 */
Ebatis.prototype.setRootPath = function setRootPath(rootpath){
    this.$root = rootpath;
};

/**
 * load config info
 * @param obj
 */
Ebatis.prototype.loadConfig = function loadConfig (obj) {

    if(!('$root' in this))
        console.warn('root path is null');

    this.load('config', obj);
    this.emit('loadconfigfinish', this.getScope('config'));
};

/**
 * load config file
 * @param filename
 */
Ebatis.prototype.loadConfigFile = function loadConfigFile (filename) {

    let filepath = filename.toLowerCase();

    let config = {};

    if(filepath.endsWith('yml')){
        config = Yaml.load(filename);
    } else if(filepath.endsWith('js')){
        config = require(filename);
    } else if(filepath.endsWith('json')){
        config = JSON.parse(fs.readFileSync(filename).toString());
    }

    this.load('config', config);
    this.emit('loadconfigfinish', this.getScope('config'));
};

/**
 * @deprecated
 * @param data
 */
Ebatis.prototype.loadMapper = function (data){ };
/**
 * @deprecated
 * @param file
 */
Ebatis.prototype.loadMapperFile = function (file){
    var filedata = fs.readFileSync(file);
    this.loadMapper(filedata);
};

/**
 * ebatis 装载完成的回调函数
 * @private
 */
Ebatis.prototype._finish = function _finish(){  };

/**
 * 设置ebatis装载完成的回调函数
 * @param callback
 */
Ebatis.prototype.finish = function finish (callback){
    if(callback instanceof Function){
        this._finish = callback;
    }
    this.on('finish', this._finish);
};

Ebatis.prototype.finish.promise = function(){
    let _self = this.parent.finish;                     // _self points to `finish` function
    let _parent = this.parent;                          // _parent points to this
    return new Promise((resolve, reject)=>{
        _parent._finish = function _finish(){
            resolve();
        };
        this.on('finish', _parent._finish);
    });
};

/**
 * 获取mapper对象
 * @param name
 * @returns {*}
 */
Ebatis.prototype.getMapper = function getMapper(name){
    let mapperScope = Scope.getScope('mapper');
    return mapperScope[name];
};

/**
 * @param bool
 */
Ebatis.prototype.dev = function devMode(bool = false){
    if(!bool) return;

    if(!('$scope' in this)) return;

    let configScope = this.getScope('config');

    if('sql' in configScope && 'mapper' in configScope['sql']){

        let _self = this;
        let mpath = null;
        let mappers = configScope['sql']['mapper'];
        if(mappers instanceof Array) {
            mpath = [];
            for(let m of mappers) {
                mpath.push(path.resolve(_self.$root, m));
            }
        }else if(typeof mappers === 'string'){
            mpath = path.resolve(_self.$root, mappers);
        }

        gulp.watch(mpath, function(evt){
            var filepath = evt.path;
            var type = evt.type;
            if(~['added', 'changed'].indexOf(type)){
                console.log(`dynamic sql : ${type} : ${filepath}`);
                ConfigParser.createMapperJs(SqlParser.parse([filepath]));
            }else{
                console.log(`deleted ${ filepath }`);
            }
        });
    }
};

mixin.extend(app, EventEmitter.prototype);
mixin.extend(app, proto);


app.init();

function createApplication(){
    return app;
}

exports = module.exports = createApplication;
exports.application = proto;

/**
 * exports SqlChainFactory
 * @type {SqlChainFactory}
 */
exports.SqlChainFactory = SqlChainFactory;