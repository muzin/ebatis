/**
 * Created by muzin on 2018-01-26 01:13:05.
 */

var EventEmitter    = require('events').EventEmitter;
var Util            = require('util');
var colors          = require('colors');

var Scope           = require('../scope');
var mixin           = require('../utils/mixin');
var aop             = require('../utils/aop');
var beautifysql     = require('../utils/beautifysql');
var MapperInterface = require('../core/mapperinterface');


exports = module.exports = SqlChain;
Util.inherits(SqlChain, EventEmitter);

/**
 * @param connection
 * @constructor
 */
function SqlChain (config, conninfo){

    if(!conninfo)
        throw new TypeError('The connection param must exists.');

    this.setConnectionInfo(conninfo);

    // check is open transaction
    this.on(this.EVENT.TRANSACTION, this.onTransactionCallback.bind(this));
    // check sql chain
    this.on(this.EVENT.CHECKCHAIN, this.onCheckChainCallback.bind(this));
    // exec sql chain
    this.on(this.EVENT.EXECCHAIN, this.onExecChainCallback.bind(this));

    this.exec.parent = this;
    this.commit.parent = this;
    this.rollback.parent = this;
    this.getConnection.parent = this;

    let transaction = false;
    // 判断是否开启事务,如果允许开启事务将开启事务
    if('transaction' in config && config.transaction == true){
        transaction = true;
    }

    let timeout = this.getTimeout();
    // 判断是否开启事务,如果允许开启事务将开启事务
    if('timeout' in config && !isNaN(config.timeout)){
        timeout = config.timeout;
    }

    if(config && 'printsql' in config && (typeof config.printsql === 'boolean'))
        this.isPrintSql = config.printsql;

    this.emit(this.EVENT.TRANSACTION, transaction);

    // 设置定时器，到时间后自动关闭sqlChain, 释放连接资源
    this.resetTimeout(timeout);
}

/**
 * @private
 * @type {string}
 */
SqlChain.prototype.status = 'pending';

/**
 * @private
 * @type {number}
 */
SqlChain.prototype.statusCode = 1;

/**
 * @type {{PENDING: number, OK: number, CLOSE: number}}
 */
SqlChain.prototype.STATUS_CODE = {
    PENDING : 1,
    OK : 2,
    CLOSE : 3
};

/**
 * @type {{PENDING: string, OK: string, CLOSE: string}}
 */
SqlChain.prototype.STATUS = {
    PENDING : 'pending',
    OK : 'ok',
    CLOSE : 'close'
};

/**
 * @type {{TRANSACTION: string, CHECKCHAIN: string, EXECCHAIN: string}}
 */
SqlChain.prototype.EVENT = {
    TRANSACTION : 'transaction',
    CHECKCHAIN : 'checkchain',
    EXECCHAIN : 'execchain'
};

/**
 * 连接对象
 * @type {null}
 */
SqlChain.prototype.connection = null;

/**
 * 连接对象的信息
 * @type {null}
 */
SqlChain.prototype.connectionInfo = null;

/**
 * 是否开启事务
 * @type {boolean}
 */
SqlChain.prototype.openTransaction = false;

/**
 * timeout of sql chain
 * @type {number}
 */
SqlChain.prototype.timeout = 30000;

/**
 * timeout timer
 * @type {null}
 */
SqlChain.prototype.timeouttimer = null;

/**
 * the chain of sql
 * @type {Array}
 */
SqlChain.prototype.chains = [];

/**
 * sql chain is executing
 * @type {boolean}
 */
SqlChain.prototype.executing = false;

/**
 * sql chain is commited
 * @type {boolean}
 */
SqlChain.prototype.commited = false;

/**
 * sql chain is rollbacked
 * @type {boolean}
 */
SqlChain.prototype.rollbacked = false;

/**
 * sql chain is closed
 * @type {boolean}
 */
SqlChain.prototype.closed = false;

/**
 * sql chain is timeouted
 * @type {boolean}
 */
SqlChain.prototype.timeouted = false;

/**
 * sql chain is throwed
 * @type {boolean}
 */
SqlChain.prototype.throwed = false;

/**
 * is print sql
 * @type {boolean}
 */
SqlChain.prototype.isPrintSql = true;

/**
 * the space of sql chain, save data
 * @type {{}}
 */
SqlChain.prototype.$scope = {};

/**
 * set timeout
 * @param timeout {number}
 */
SqlChain.prototype.resetTimeout = function resetTimeout(timeout){
    this.timeout = timeout;
    if(this.timeouttimer)
        clearTimeout(this.timeouttimer);

    if(this.timeout < 0) return;

    let timeouttimer = setTimeout(this.onTimeoutCallback.bind(this), this.timeout);
    this.timeouttimer = timeouttimer;
};

/**
 * get timeout
 * @returns {number}
 */
SqlChain.prototype.getTimeout = function getTimeout(){
    return this.timeout;
};

/**
 * if timeout, sql chain will execute callback
 * if open transaction, invoke rollback, after close timer
 * @private
 */
SqlChain.prototype.onTimeoutCallback = function onTimeoutCallback(){
    if(this.timeouted) return;
    console.log('timeout');
    this.close();
};

/**
 * 监听开始处理事务的回调
 * 主要用于获取数据库连接
 * 判断是否开启事务
 * 完成之后，发射检查chain指令，准备执行sql
 * @private
 * @param status
 */
SqlChain.prototype.onTransactionCallback = function onTransactionCallback(status){

    let connInfo = this.getConnectionInfo();

    if(connInfo){
        connInfo.getConnection((err, conn)=>{
            if(err)
                throw err;

            conn['__EBATIS_DS_TYPE__'] = connInfo['__EBATIS_DS_TYPE__'];

            if(conn) {
                this.connection = conn;
                if (status) {
                    conn.beginTransaction((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            this.openTransaction = true;
                        }

                        this.status = this.STATUS.OK;
                        this.statusCode = this.STATUS_CODE.OK;

                        this.emit(this.EVENT.CHECKCHAIN);
                    });
                } else {

                    this.status = this.STATUS.OK;
                    this.statusCode = this.STATUS_CODE.OK;

                    this.emit(this.EVENT.CHECKCHAIN);
                }
            }
        });
    }else{
        throw Error('The data source is not exists.')
    }

};

/**
 * check chain callback
 * @private
 */
SqlChain.prototype.onCheckChainCallback = function onCheckChainCallback(){
    let chains = this.chains;
    if(chains && chains.length > 0 && !this.executing && this.isAvailable()) {
        this.emit(this.EVENT.EXECCHAIN, chains);
    } else if(chains && chains.length == 0 && this.hasend){
        this._end.apply(this, [null, this.$scope]);
    }
};

/**
 * exec chain callback
 * @private
 * @param chains
 */
SqlChain.prototype.onExecChainCallback = function onExecChainCallback(chains){
    if(this.executing) return;

    this.executing = true;
    let chain = chains.shift();

    if(chain.type == 'sql'){
        this._exec.apply(this, chain.args);
    } else if(chain.type == 'throw'){
        console.log('throw');
        this.throwed = true;
        this._end.apply(this, chain.args);
    } else {
        if(chain.type == 'function'){
            chain.args.apply(this, []);
        }
        this.executing = false;
        this.emit(this.EVENT.CHECKCHAIN);
    }
};

/**
 * @description 获取数据库连接
 * @method getConnection
 * @param cb {Function} function(err, conn){} 回调函数的参数 err错误信息， conn 连接对象
 */
SqlChain.prototype.getConnection = function(){
    return this.connection;
};

/**
 * 设置连接对象
 * @param connection {Object}
 */
SqlChain.prototype.setConnectionInfo = function (conninfo){
    this.connectionInfo = conninfo;
};

/**
 * 获取连接对象的信息
 * @param connection {Object}
 */
SqlChain.prototype.getConnectionInfo = function (){
    return this.connectionInfo;
};

/**
 * get mapper
 * @param name
 * @returns {Function}
 */
SqlChain.prototype.getMapper = function getMapper(name){
    let mapperScope = Scope.getScope('mapper');
    return mapperScope[name];
};

/**
 * sql chain is available
 * @returns {boolean}
 */
SqlChain.prototype.isAvailable = function isAvailable(){
    return !this.closed
        && !this.timeouted
        && !this.rollbacked
        && !this.commited
        && !this.throwed;
};

/**
 * exec sql
 * @param sql {String}
 * @param val {Array}
 * @param cb {Function}
 */
SqlChain.prototype.exec = function(sql, val,  cb) {
    if(!this.isAvailable()) return this;

    if(sql instanceof Function){
        this.chains.push({
            type : 'function',
            args : sql
        });
    }else if(sql instanceof MapperInterface){
        let mapper = sql.mapper;
        let src_args = sql.args;
        let args = [];
        for(let i = 0; i < src_args.length; i++) args.push(src_args[i]);
        let vals = mapper.toFunction().apply(mapper, args);
        this.chains.push({
            type : 'sql',
            args : [vals.sql, vals.values, cb]
        });
    }else{
        this.chains.push({
            type : 'sql',
            args : [sql, val, cb]
        });
    }

    if(this.status != this.STATUS.OK) return this;
    this.emit(this.EVENT.CHECKCHAIN);

    return this;
};


/**
 * exec method promise
 * @param sql
 * @param vals
 * @returns {Promise<any>}
 */
SqlChain.prototype.exec.promise = function(sql, val) {
    let _self = this.parent.exec;
    let _parent = this.parent;
    return new Promise((resolve, reject)=>{
        let _selfargs = [sql];

        if(val) _selfargs.push(val);
        _selfargs.push(function(err, result) {
            if(!err){
                resolve(result);
            }else{
                reject(err);
            }
        });
        _self.apply(_parent, _selfargs);
    });
};

/**
 *
 * @param sql
 * @param val
 * @param cb
 * @private
 */
SqlChain.prototype._exec = function _exec(sql, val, cb) {

    var _self = this;

    if(this.isPrintSql)
        var stime = new Date().getTime();

    function execSql (sql, val, cb) {
        let conn = _self.getConnection();
        var connargs = [sql];
        let callback = null;

        let sqllog = {};

        if(this.isPrintSql)
            if(typeof sql === 'string'){
                sqllog.sql = sql;
            }else if(sql instanceof Object){
                if('sql' in sql && 'values' in sql){
                    sqllog.sql = sql.sql;
                    sqllog.param = sql.values;
                }
            }

        if(val instanceof Function) {
            callback = val;
        }else if(cb instanceof Function) {
            if(this.isPrintSql)
                sqllog.param = val;
            connargs.push(val);
            callback = cb;
        } else if(val && !cb) {
            if(this.isPrintSql)
                sqllog.param = val;
            connargs.push(val);
            callback = function () {};
        } else {
            connargs.push(undefined);
            callback = function () {};
        }

        // 在 执行回调函数时, 切入 错误处理，执行状态变更等操作
        callback = callback._around((joinpoint)=>{
            var fn = joinpoint.source;
            var fnargs = joinpoint.args;
            var err = fnargs[0];
            var result = fnargs[1];

            if(this.isPrintSql) {
                var etime = new Date().getTime();

                var usedtime = etime - stime;

                sqllog.err = err;
                sqllog.result = result;
                sqllog.usedtime = usedtime;
            }

            // 打印sql信息
            if(this.isPrintSql)
                printSqlLog(sqllog);

            // if has error and open transaction,
            // this sqlchain will be rollback.
            // 如果有错误，且开启事务，这个sqlchain将会回滚
            if(err && _self.openTransaction){
                _self.rollback((roll_err)=>{
                    _self.close();
                    throw Error(sql + '\n' + err.message);
                });
            }else{
                this.executing = false;
                try{
                    joinpoint.invoke(this);
                } catch(e){
                    console.trace(e);
                    _self.rollback((roll_err)=>{
                        _self.close();
                    });
                }
                this.emit(this.EVENT.CHECKCHAIN);
            }
        });

        connargs.push(callback);

        conn.query.apply(conn, connargs);
    }

    if(typeof sql === 'string'){
        execSql.apply(this, [sql, val, cb]);
    }else if(sql instanceof Object){
        if('sql' in sql && 'values' in sql){
            execSql.apply(this, [sql, val, cb]);
        }
    }
};

/**
 * @private
 * @param sqllog
 */
function printSqlLog(sqllog){

    console.info(`\n[Sql   ] : `.green);
    console.info(beautifysql.beautiful2(sqllog.sql));
    console.info(`\n[Param ] : `.green);
    console.info(sqllog.param);

    if(!sqllog.err) {
        console.info(`\n[Result] : `.green);
        console.info(sqllog.result);
    }else {
        console.info(`\n[Error ] : `.red);
        if(sqllog.err instanceof Error) {
            console.info(sqllog.err.stack.red);
        }else{
            console.info(sqllog.err.red);
        }
    }

    if(sqllog.usedtime <= 100) {
        console.info(`\n[Time  ] : ${ sqllog.usedtime }ms`.green);
    }else if(sqllog.usedtime > 100 && sqllog.usedtime <= 500){
        console.info(`\n[Time  ] : ${ sqllog.usedtime }ms`.yellow);
    }else{
        console.info(`\n[Time  ] : ${ sqllog.usedtime }ms`.red);
    }

}


/**
 * commit connection
 * @param cb function(err){ } return err info
 */
SqlChain.prototype.commit = function(cb){
    if(!this.isAvailable()) {
        if(cb instanceof Function)
            cb(null);
    }else{
        this.commited = true;
        this.getConnection().commit(cb instanceof Function ? cb : function(){});
    }
    return this;
};

SqlChain.prototype.commit.promise = function() {
    let _self = this.parent.commit;
    let _parent = this.parent;
    return new Promise((resolve, reject)=>{
        _self.apply(_parent, [(err)=>{
            if(!err){
                resolve();
            }else{
                reject(err);
            }
        }]);
    });
};

/**
 * commit connection
 * @param cb function(err){ } return err info
 */
SqlChain.prototype.rollback = function(cb){
    if(!this.isAvailable()) {
        if(cb instanceof Function)
            cb(null);
    }else{
        console.log('rollback');
        this.rollbacked = true;
        this.getConnection().rollback(cb instanceof Function ? cb : function(){});
    }
    return this;
};

SqlChain.prototype.rollback.promise = function() {
    let _self = this.parent.rollback;
    let _parent = this.parent;
    return new Promise((resolve, reject)=>{
        _self.apply(_parent, [(err)=>{
            if(!err){
                resolve();
            }else{
                reject(err);
            }
        }]);
    });
};

/**
 * close timeout timer
 * @private
 */
SqlChain.prototype._closeTimer = function _closeTimer(){
    if(this.timeouttimer != null){
        clearTimeout(this.timeouttimer);
        this.timeouttimer = null;
    }
};

/**
 * 关闭sqlChain，关闭后将不能使用
 *
 */
SqlChain.prototype.close = function close() {

    if(this.closed) return;

    this._closeTimer();

    if(this.openTransaction){
        if(this.rollbacked){
            this._close();
        }else{
            this.commit(()=>{
                this._close();
            });
        }
    }else{
        this._close();
    }
};


/**
 * default 'end' callback function
 * @private
 */
SqlChain.prototype._end = function _end(){
    if(this.throwed){
        this.rollback(()=>{
            this.close();
        });
    }else{
        this.close();
    }
};

/**
 * end function
 * When the SQL on the sqlchain is completed, the callback will be invoke
 * @param callback
 */
SqlChain.prototype.end = function end(callback){
    let _self = this;
    _self.hasend = callback instanceof Function ? true : false;
    _self._end = _self._end._around(function(joinpoint){
        let args = joinpoint.args;
        let cb = callback instanceof Function ? callback : function(){};
        cb.apply(_self, args);
        joinpoint.invoke(_self);
    });
};

SqlChain.prototype.hasend = false;

SqlChain.prototype._throw = { err : null, data : null};

/**
 * throw exception
 * when throw exception, sqlchain will be stop.
 * @param err
 * @param data
 * @returns {SqlChain}
 */
SqlChain.prototype.throw = function (err, data){
    if(!this.isAvailable()) return this;

    this.chains.unshift({
        type : 'throw',
        args : [err, data]
    });

    if(this.status != this.STATUS.OK) return this;
    this.emit(this.EVENT.CHECKCHAIN);

    return this;

};

/**
 * 关闭sqlChain，关闭后将不能使用
 * @private
 */
SqlChain.prototype._close = function _close() {
    let conn = this.getConnection();

    console.log('close');
    this.status = this.STATUS.CLOSE;
    this.statusCode = this.STATUS_CODE.CLOSE;
    this.closed = true;

    if(conn) conn.release();

    this._destory();
};

/**
 * destory object
 * @private
 */
SqlChain.prototype._destory = function(){

    this.connection = null;
    this.connectionInfo = null;
    this.chains = null;

    delete this.exec.parent;
    delete this.commit.parent;
    delete this.rollback.parent;
    delete this.getConnection.parent;
};

