const emotiv = require('./emotiv');

emotiv((e, res) => process.send(res));
