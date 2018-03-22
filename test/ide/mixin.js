/**
 * Not a valid symbol in library. Just helps autocompletion.
 * @ignore
 */
const __MAmbiguous_signals = function() {
    this.sigFirst = function() {};
    this.sigSecond = function() {};
    this.sigThird = function() {};
    this.sigFourth = function() {};
    this.sigDoNotShowInCompletion = function() {};
};

var MAmbiguous = function() {
    this.signal = new __MAmbiguous_signals();
    this.propA = '';
    this.propB = '';
    this.propC = '';
    this.funcA = function () {};
    this.funcB = function () {};
    this.funcC = function () {};
};

/**
 * Not a valid symbol in library. Just helps autocompletion.
 * @ignore
 */
const __MA_signals = function() {
    this.sigFirst = function() {};
    this.sigSecond = function() {};
};

var MA = function() {
    this.signal = new __MA_signals();
    this.propA = '';
    this.propB = '';
    this.funcA = function () {};
};

/**
 * Not a valid symbol in library. Just helps autocompletion.
 * @ignore
 */
const __MB_signals = function() {
    this.sigThird = function() {};
};

var MB = function() {
    this.signal = new __MB_signals();
    this.propC = '';
    this.funcB = function () {};
    this.funcC = function () {};
};

/**
 * Not a valid symbol in library. Just helps autocompletion.
 * @ignore
 */
const __MC_signals = function() {
    this.sigFourth = function() {};
};

/**
 * @mixes MA
 * @mixes MB
 */
var MC = function() {
    this.signal = new _MC_signals();
    this.propD = '';
};

let mc = new MC();
// complete here and find properties of B, A but signals are not mixed
mc;

/**
 * Not a valid symbol in library. Just helps autocompletion.
 * @mixes __MA_signals
 * @mixes __MB_signals
 * @ignore
 */
const __MD_signals = function() {
    this.sigFourth = function() {};
};

/**
 * @mixes MA
 * @mixes MB
 */
var MD = function() {
    this.signal = new __MD_signals();
    this.propD = '';
};

let md = new MD();
// complete here and find properties of B, A
// and also find signals (must show up before hasOwnProperty in WebStorm)
md.signal;