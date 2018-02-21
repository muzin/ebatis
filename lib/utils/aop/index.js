/**
 * Created by muzin on 17-9-23.
 */


/**
 * 引入此文件可以在方法上使用aop
 */

/**
 * 切入点对象
 * 不允许切入对象多次调用
 * @param obj   对象
 * @param args  参数
 * @constructor
 */
function JoinPoint(obj, args){
    var isapply = false;
    var result = null;

    this.source = obj;
    this.args = args;

    this.invoke = function(thiz){
        if(isapply){ return; }
        isapply = true;
        result = this.source.apply(thiz || this.source, this.args);

        return result;
    };

    this.getResult = function(){
        return result;
    }
}

/**
 * 给方法加入前置切片函数
 * 可以在执行方法之前执行一些操作,
 * 前置切片的返回值为false时，不影响原方法的执行
 * @param func {Function}
 * @return {Function}
 * @constructor
 */
Function.prototype._before = function(func){
    var __self = this;
    return function(){
        func.apply(__self, arguments);
        return __self.apply(__self, arguments);
    }
}

/**
 * 方法环绕通知
 * 原方法的执行需在环绕通知方法中执行
 * @param func
 * @constructor
 */
Function.prototype._around = function(func){
    var __self = this;
    return function(){
        //arguments[arguments.length] = new JoinPoint(__self, arguments); arguments.length++;
        var args = [new JoinPoint(__self, arguments)];
        return func.apply(this, args);
    }
}


/**
 * 给方法加入后置切片函数
 * 可以在执行方法之之后执行一些操作
 * 后置切片的返回值为false时，不影响原方法的执行
 * @param func
 * @return {Function}
 * @constructor
 */
Function.prototype._after = function(func){
    var __self = this;
    return function(){
        var ret = __self.apply(__self, arguments);
        func.apply(__self, arguments);
        return ret;
    }
}


/**
 * 给方法加入后置切片函数
 * 可以在执行方法之之后执行一些操作
 * 如果不需要往下执行，返回false即可
 * @param func
 * @return {Function}
 * @constructor
 */
Function.prototype._then = function(func){
    var __self = this;
    return function(){
        var ret = __self.apply(__self, arguments);
        if(ret === false){
            return false;
        }else{
            ret = func.apply(__self, arguments);
        }
        return ret;
    }
}

/**
 * 异常处理切面函数
 * 用于函数出现异常时，执行所指定的操作
 * 异常变量，也将跟随到指定函数的末尾
 * @param func
 * @returns {Function}
 * @constructor
 */
Function.prototype._catch = (func) => {
    var __self = this;
    return ()=>{
        try{
            __self.apply(__self, arguments);
        }catch(e){
            arguments[arguments.length] = e; arguments.length++;     // 将异常变量加入到异常处理函数的参数末尾中
            func.apply(__self, arguments);
        }
    }
}