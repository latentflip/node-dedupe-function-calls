# Dedupe Function Calls

Prevents a function being called multiple times with the same arguments + memoizes the return value;

## Installation

```
npm install dedupe-function-calls
```

Works in node or the browser with browserify. Depends on underscore.

## Usage

Can be used in two ways.

1. Typical use

    ```javascript
    //Given a function which doubles a value:
    var double = function (value) {
        var doubled = value * 2;
        console.log('Doubled = ', doubled);
        return doubled;
    };

    //Without dedupe
    double(1); // logs 2, returns 2 
    double(1); // logs 2, returns 2
    double(1); // logs 2, returns 2
    double(2); // logs 4, returns 4
    double(1); // logs 1, returns 2

    //With dedupe
    var deduped = dedupe(double);
    deduped(1); // logs 2, returns 2 
    deduped(1); // no log, returns 2
    deduped(1); // no log, returns 2
    deduped(2); // logs 4, returns 4
    deduped(1); // logs 1, returns 2
    ```
    
    * Note that:
    * the function return value is memoized so subsequent calls still return values, they just don't execute the function body.
    * the original function can take any number of args (deduplication is based on all of the provided arguments).
    * It is different to memoization, in that it only dedupes sequential calls with the same value, not all calls


2. With a getter:

    * 

        ```javascript
        // Sometimes you want to use an objects value in a function, e.g:
        var myObject = {
            value: 2,
            double: function () {
                var doubled = this.value * 2;
                console.log('Doubled =', doubled)
                return doubled;
            }
        };

        //Deduping this is kind of a pain, as double isn't being passed any arguments, you could do this: 

        var myObject = {
            value: 2,
            _double: dedupe(function (value) {
                var doubled = value * 2;
                console.log('Doubled =', doubled)
                return doubled;
            }),
            double: function () {
                return this._double(this.value);
            }
        };

        myObject.double(1); //logs 2, returns 2
        myObject.double(1); //no log, returns 2
        myObject.double(1); //no log, returns 2
        myObject.value = 2;
        myObject.double(); //logs 4, returns 4
        myObject.double(); //no log, returns 4

        //But dedupe can actually take a getter function in it's optional arguments, so you can do:
        // (note that both the getter and the function will be called in the context of your object)

        var myObject = {
            value: 2,
            double: dedupe(
                function (value) {
                    var doubled = value * 2;
                    console.log('Doubled =', doubled);
                    return doubled;
                }, {
                    getter: function () { return this.value; }
                }
            )
        };

        ```
