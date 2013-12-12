var dedupe = require('./dedupe');

var double = function (value) {
    var doubled = value * 2;
    console.log('Doubled = ', doubled);
    return doubled;
};

//Without dedupe
console.log('Without dedupe');
double(1); // logs 2, returns 2
double(1); // logs 2, returns 2
double(1); // logs 2, returns 2
double(2); // logs 4, returns 4
double(1); // logs 1, returns 2

//With dedupe
console.log('With dedupe');
var deduped = dedupe(double);
deduped(1); // logs 2, returns 2
deduped(1); // no log, returns 2
deduped(1); // no log, returns 2
deduped(2); // logs 4, returns 4
deduped(1); // logs 1, returns 2


console.log('Objects');
var myObject = {
    value: 1,
    _double: dedupe(function (value) {
        var doubled = value * 2;
        console.log('Doubled =', doubled);
        return doubled;
    }),
    double: function () {
        return this._double(this.value);
    }
};

myObject.double(); //logs 2, returns 2
myObject.double(); //no log, returns 2
myObject.double(); //no log, returns 2
myObject.value = 2;
myObject.double(); //logs 4, returns 4
myObject.double(); //no log, returns 4


console.log('Objects with getter');
myObject = {
    value: 1,
    double: dedupe(
        function (value) {
            var doubled = value * 2;
            console.log('Doubled =', doubled);
            return doubled;
        },
        function () { return this.value; }
    )
};

myObject.double(); //logs 2, returns 2
myObject.double(); //no log, returns 2
myObject.double(); //no log, returns 2
myObject.value = 2;
myObject.double(); //logs 4, returns 4
myObject.double(); //no log, returns 4
