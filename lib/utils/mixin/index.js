/**
 * Created by muzin on 17-9-23.
 */

var util = require('util');

/**
 * 继承对象
 * @param dest 目标
 * @param src  源对象
 * @param isDeep  是否深拷贝
 * @private
 */
var _extend = function(dest, src, isDeep){
    for(var field in src){
        if(field == '__proto') continue;
        if(!(field in dest))
            dest[field] = src[field];
    }
    return dest;
}

var _override = function(dest, src){
    for(var field in src){
        if(field == '__proto') continue;
        if(field in dest)
            dest[field] = src[field];
    }
    return dest;
};

var _implements = function(impls){
    var _self = this;
    var _impls = impls;
    for(var i in _self){
        if(i in _impls){
            _self[i] = _impls[i];
        }else{
            if(_self[i] instanceof Function){
                console.warn(`The ${ i } of ${ _self.__proto__.constructor.name } has not been implemented.`);
            }
        }
    }
    return _self;
}

/**
 * 实例对象继承
 * @param parent
 * @return {Object}
 */
Object.prototype._extend = function(parent){

    for(var field in parent){
        if(field == '__proto__') continue;
        if(!(field in this))
            this[field] = parent[field];
    }
    return this;
}

/**
 * 为接口函数指定实现函数
 * @param impls
 */
Object.prototype._implements = function(impls){
    var _self = this;
    var _impls = impls;
    for(var i in _self){
        if(i in _impls){
            _self[i] = _impls[i];
        }else{
            if(_self[i] instanceof Function){
                console.warn(`The ${ i } of ${ _self.__proto__.constructor.name } has not been implemented.`);
            }
        }
    }
    return _self;
}

/**
 * 为接口函数指定实现函数
 * @param impls 目标实现类的函数（不是实体类）
 * @return { Object } 当前对象的实例
 */
Function.prototype._implements = function(impls){
    var _self = new this();
    var _impls = new impls();
    for(var i in _self){
        //if(i == '__proto__') continue;
        if(i in _impls){
            _self[i] = _impls[i];
        }else{
            if(_self[i] instanceof Function){
                console.warn(`The ${ i } of ${ _self.__proto__.constructor.name } has not been implemented.`);
            }
        }
    }
    return _self;
}

exports = module.exports = {

    extend : _extend,

    override : _override,

    implement : _implements

}
