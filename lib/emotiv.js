const emotiv = require('bindings')('emotiv');

let emit = () => {};

let rv = 1;

do {
    rv = emotiv.connect();
} while (rv);

(function work() {
    emotiv.read((e, res) => {
        emit(e, res);

        work();
    });
}());

module.exports = (cb) => {
    emit = cb;
};
