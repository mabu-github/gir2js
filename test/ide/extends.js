var EAmbiguous = function() {
    this.signal = {
        sigFirst: '',
        sigSecond: '',
        sigThird: ''
    };
    this.propA = '';
    this.propB = '';
    this.propC = '';
    this.propDoNotShowInCompletion = '';
    this.funcA = function () {};
    this.funcB = function () {};
    this.funcC = function () {};
    this.funcDoNotShowInCompletion = '';
};

var EA = function() {
    this.signal = {
        sigFirst: '',
        sigSecond: ''
    };
    this.propA = '';
    this.propB = '';
    this.funcA = function () {};
};

/**
 * @augments EA
 * @constructor
 */
var EB = function() {
    this.signal = {
        sigThird: ''
    };
    this.propC = '';
    this.funcB = function () {};
    this.funcC = function () {};
};

/**
 * @augments EB
 * @constructor
 */
var EC = function() {
    this.signal = {
        sigFourth: ''
    };
    this.propD = '';
};

let ec = new EC();
// complete here and find properties and functions of B, A but literal objects are not mixed
ec;