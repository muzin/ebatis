/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
let ConfigScope = require('./configscope');
let ConnectionScope = require('./connectionscope');
let DataSourceScope = require('./datasourcescope');
let SqlScope = require('./sqlscope');


function Scope(){

    this.datasourcescope = new DataSourceScope();
    this.connectionscope = new ConnectionScope();
    this.sqlscope = {};
    this.mapperscope = {};
    this.configscope = new ConfigScope();

};

/**
 * get Scope
 * @param name
 * @returns {*}
 */
Scope.prototype.getScope = function getScope (name) {
    let scopename = name+'scope';
    let ret = null;
    if(scopename in this)
        ret = this[scopename];
    return ret;
};

exports = module.exports = new Scope();