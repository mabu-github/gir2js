var NS = {};

/**
 * Not a valid symbol in library. Just helps autocompletion.
 * @ignore
 */
const __MAAmbiguous_signals = function() {
    this.sigFirst = function() {};
    this.sigSecond = function() {};
    this.sigThird = function() {};
    this.sigFourth = function() {};
    this.sigDoNotShowInCompletion = function() {};
};

NS.MAAmbiguous = function() {
    this.signal = new __MAAmbiguous_signals();
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
const __MAA_signals = function() {
    this.sigFirst = function() {};
    this.sigSecond = function() {};
};

NS.MAA = function() {
    this.signal = new __MAA_signals();
    this.propA = '';
    this.propB = '';
    this.funcA = function () {};
};

/**
 * Not a valid symbol in library. Just helps autocompletion.
 * @ignore
 */
const __MAB_signals = function() {
    this.sigThird = function() {};
};

NS.MAB = function() {
    this.signal = new __MAB_signals();
    this.propC = '';
    this.funcB = function () {};
    this.funcC = function () {};
};

/**
 * Not a valid symbol in library. Just helps autocompletion.
 * @mixes __MAA_signals
 * @mixes __MAB_signals
 * @ignore
 */
const __MAD_signals = function() {
    this.sigFourth = function() {};
};

/**
 * @mixes MAA
 * @mixes MAB
 */
NS.MAD = function() {
    this.signal = new __MAD_signals();
    this.propD = '';
};

let mad = new NS.MAD();
// complete here and find properties of B, A
// and also find signals (must show up before hasOwnProperty in WebStorm)
mad.signal;