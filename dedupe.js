var _ = require('underscore');
var dedupe;

module.exports = dedupe = function(fn, getter) {
    var lastCall;
    var lastResult;

    return function () {
        var args = arguments;
        if (getter) {
            args = getter.call(this);
            if (!_.isArray(args)) args = [ args ];
        }

        if (_.isEqual(args, lastCall)) return lastResult;

        lastResult = fn.apply(this, args);
        lastCall = args;
        return lastResult;
    };
};
