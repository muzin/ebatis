/**
 * Created by muzin on 17-8-2.
 */

var Mixin = {

    // single inheritance
    extend : function (destClass, srcClass, methods) {
        var srcProto  = srcClass.prototype;
        var destProto = destClass.prototype ;
        for (var i=0; i<methods.length; i++) {
            var method = methods[i];
            if (!destProto[method]) {
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