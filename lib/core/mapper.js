/**
 * Created by muzin on 2018-01-26 01:13:05.
 */
let beautifulsql = require('../utils/beautifysql')

function Mapper(name, namespace, sqls, conn){

    this.name = name;
    this.namespace = namespace;
    this.fullname = namespace + '.' + name;
    this.toFunction = sqls;
    this.toSourceCode = this.toFunction.toString();
    this.connection = conn;

    this.param = function param(){
        let args = [];
        let cb = function(){};
        for(let i = 0; i < arguments[0].length; i++){
            let item = arguments[0][i];
            args.push(item);
        }
        if(arguments[1])
        cb = arguments[1];
        console.log(this.toFunction.toString());

        let sqls = this.toFunction.apply(this, args);
        sqls.sql = beautifulsql.beautiful2(sqls.sql);
        console.log(sqls.sql);
        console.log(sqls.values);
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
            _self.bind(_parent)(args, (err, result)=>{
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
