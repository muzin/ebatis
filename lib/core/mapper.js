/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
let beautifulsql = require('../utils/beautifysql')

function Mapper(name, namespace, sqls, conn){

    this.name = name;
    this.namespace = namespace;
    this.fullname = namespace + '.' + name;
    this.connection = conn;
    this.toFunction = function(){
        return sqls;
    };
    this.toSourceCode = sqls.toString();

    this.param = function param(){
        let args = [];
        let cb = function(){};
        for(let i = 0; i < arguments.length; i++){
            let maxindex = arguments.length;
            let item = arguments[i];
            if(i == maxindex - 1){
                if(item instanceof Function){
                    cb = item;
                }else{
                    args.push(item);
                }
            }else{
                args.push(item);
            }
        }

        let sqls = this.toFunction().apply(this, args);
        //sqls.sql = beautifulsql.beautiful2(sqls.sql);

        this.connection.query(sqls, cb);
    };

    this.param.parent = this;

    this.param.promise = function param(param){
        var _self = this;
        var _parent = this.parent;
        var args = [];
        for(let i = 0; i < arguments.length; i++)
            args.push(arguments[i]);
        return new Promise((resolve, reject)=>{
            _self.bind(_parent)(arguments, (err, result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    };

}


exports = module.exports = Mapper;
