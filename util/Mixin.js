/**
 * Created by muzin on 17-8-2.
 */

/**
 * @deprecated
 * @type {{extend: Mixin.extend, extends: Mixin.extends}}
 */
var Mixin = {

    // single inheritance
    extend : function (destClass, srcClass, methods) {
        var srcProto  = srcClass.prototype;
        var destProto = destClass.prototype ;
        for (var method in srcProto) {
            if(method == '__proto__') continue;
            if (!(method in destProto)) {
                destProto[method] = srcProto[method];
            }
        }
    },

    // multiple inheritance
    extends : function (destClass) {
        var classes = Array.prototype.slice.call(arguments, 1);
        for (var i=0; i<classes.length; i++) {
            var srcClass = classes[i];
            var srcProto  = srcClass.prototype;
            var destProto = destClass.prototype;
            for (var method in srcProto) {
                if (!destProto[method]) {
                    destProto[method] = srcProto[method];
                }
            }
        }
    }
}

exports = module.exports = Mixin;