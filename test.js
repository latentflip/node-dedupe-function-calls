var assert = require('assert');
var dedupe = require('./dedupe');

var spy = {
    calls: [],
    empty: function () { this.calls = []; },
    log: function (value) { this.calls.push(value); }
};

var logSomething = dedupe(function (value) {
    spy.log(value);
});

spy.empty();
logSomething(1);
logSomething(2);
assert.deepEqual(spy.calls, [1,2], 'It logs calls');

spy.empty();
logSomething(1);
logSomething(1);
logSomething(2);
logSomething(2);
assert.deepEqual(spy.calls, [1,2], 'It skips duplicate calls');

spy.empty();
logSomething(1);
logSomething(2);
logSomething(1);
logSomething(2);
assert.deepEqual(spy.calls, [1,2,1,2], 'It only skips sequential duplicate calls, not all calls with same args');



var makeGetter = function (vals) {
    return function () {
        return vals.shift();
    };
};

spy.empty();
var get = makeGetter([1,1,2,2,1,2]);
var logWithGetter = dedupe(function (value) {
        spy.log(value);
    }, {
        getter: get
    }
);

logWithGetter();
logWithGetter();
logWithGetter();
logWithGetter();
logWithGetter();
logWithGetter();

assert.deepEqual(spy.calls, [1,2,1,2], 'It works with a getter function');

console.log('All tests passed');
