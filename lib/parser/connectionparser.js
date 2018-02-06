/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
function ConnectionParser(){}

/**
 * 加载数据源配置
 * @param dsScope   数据源scope
 * @returns {{}}
 */
ConnectionParser.prototype.parse = function parse(dsScope){

    let ret = {};
    let dsobj = dsScope;

    for(let dsname in dsobj){

        let ds = dsobj[dsname];
        let ds_type = ds['_type'];
        let ds_name = ds['_name'];
        let ds_mode = ds['_mode'];

        if(!ds_name) {
            continue;
        }

        if(!~[this.MODE.CONNECTION, this.MODE.POOL, this.MODE.CLUSTER].indexOf(ds_mode))
            throw TypeError(`Invalid mode of The data source. [Name] : ${ ds_name }`);

        let connobj = this.build(ds);

        ret[ds_name] = connobj;
    }

    return ret;
};

/**
 * 连接模式
 * @type {{
 * CONNECTION: string, POOL: string, CLUSTER: string
 * }}
 */
ConnectionParser.prototype.MODE = {
    CONNECTION : 'connection',                                 // 单连接模式
    POOL : 'pool',                                             // 连接池模式
    CLUSTER : 'cluster',                                       // 连接池集群模式
};

ConnectionParser.prototype.build = function build(ds){

    let ds_type = ds['_type'];
    let ds_mode = ds['_mode'];
    let connobj = null;

    if(ds_type == 'mysql'){
        if(ds_mode == this.MODE.CONNECTION){
            connobj = this.MysqlConnectionBuilder.BuildConnection(ds);
        } else if(ds_mode == this.MODE.POOL){
            connobj = this.MysqlConnectionBuilder.BuildPool(ds);
        }else if(ds_mode == this.MODE.CLUSTER){
            connobj = this.MysqlConnectionBuilder.BuildPoolCluster(ds);
        }
    }else if(ds_type == 'oracle'){
        // TODO ...
    }else if(ds_type == 'postgresql'){
        // TODO ...
    }else if(ds_type == 'sqlserver'){
        // TODO ...
    }

    return connobj;
};


ConnectionParser.prototype.MysqlConnectionBuilder = new MysqlConnectionBuilder();

function MysqlConnectionBuilder(){}

MysqlConnectionBuilder.prototype.getMysql = function getMysql(){
    return require('mysql');
};

MysqlConnectionBuilder.prototype.BuildConnection = function(config){

    let mysql = this.getMysql();
    let connection = mysql.createConnection(config);
    connection.connect();


    connection.getConnection = function getConnection(cb){
        cb(null, connection);
    };

    connection.getConnection.promise = getConnectionPromise;

    return connection;

};

MysqlConnectionBuilder.prototype.BuildPool = function(config){

    let mysql = this.getMysql();
    let pool = mysql.createPool(config);

    pool.getConnection.promise = getConnectionPromise;

    return pool;

};

MysqlConnectionBuilder.prototype.BuildPoolCluster = function(config){

    let mysql = this.getMysql();
    let cluster = mysql.createPoolCluster(config);

    cluster.getConnection.promise = function getConnection(pattern, selector){
        let _self = this;
        return new Promise((resolve, reject)=>{
            _self(pattern, selector, (err, conn)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(conn);
                }
            });
        });
    };

    return cluster;

};


function getConnectionPromise () {
    let _self = this;
    return new Promise((resolve, reject)=>{
        _self((err, conn)=>{
            if(err){
                reject(err);
            }else{
                resolve(conn);
            }
        });
    });
}

exports = module.exports = new ConnectionParser();