/**
 * Created by muzin on 2018-02-09 16:14:57.
 */

function MapperInterface(mapper, args){

    this.mapper = mapper;

    this.args = args;

    this.param = this.mapper.param;

};

/**
 * 销毁 MapperInterface 对象，
 * 解除对象间引用，
 * 等待gc回收
 */
MapperInterface.prototype.destory = function(){
    delete this.mapper;
    delete this.param;
    delete this.args;
};

exports = module.exports = MapperInterface;