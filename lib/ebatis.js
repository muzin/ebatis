
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var Yaml = require('yamljs');
var gulp = require('gulp');

var proto = require('./application');
var mixin = require('./utils/mixin');
var SqlChainFactory = require('./chain/sqlchainfactory');
var Scope = require('./scope');


function Ebatis(){};
var app = Ebatis;

Ebatis.setRootPath = function setRootPath(rootpath){
    this.$root = rootpath;
};

/**
 * load config info
 * @param obj
 */
Ebatis.loadConfig = function loadConfig (obj) {
    this.load('config', obj);
    this.emit('loadconfigfinish', this.getScope('config'));
};

Ebatis.loadConfigFile = function loadConfigFile (filename) {

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

Ebatis.loadMapper = function (data){

};

Ebatis.loadMapperFile = function (file){
    var filedata = fs.readFileSync(file);
    this.loadMapper(filedata);
};

Ebatis._finish = function _finish(){  };

Ebatis.finish = function finish (callback){
    if(callback instanceof Function){
        this._finish = callback;
    }
    this.on('finish', this._finish);
};


Ebatis.getMapper = function getMapper(name){
    let mapperScope = Scope.getScope('mapper');
    return mapperScope[name];
};

Ebatis.dev = function devMode(bool = false){
    if(!bool) return;

    gulp.watch('./**/**.js');



};

mixin.extend(app, EventEmitter.prototype);
mixin.extend(app, proto);


app.init();

function createApplication(){
    return app;
}

exports = module.exports = createApplication;
exports.application = module.exports.application = proto;

/**
 * exports SqlChainFactory
 * @type {SqlChainFactory}
 */
exports.SqlChainFactory = module.exports.SqlChainFactory = SqlChainFactory;