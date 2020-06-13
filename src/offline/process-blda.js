const {
    trainBLDA, getEpochData, prepareElectrodesData, getSessionFromRecording,
} = require('../lib/methods');

const numeric = require('../lib/numeric');

const BLDA = require('../lib/blda');

const _ = require('lodash');

const b = new BLDA();

const channelsMap = {
    F3: 1,
    F4: 1,
    FC5: 1,
    FC6: 1,
    F7: 1,
    F8: 1,
    P7: 1,
    P8: 1,
    O1: 1,
    O2: 1,
    T7: 1,
    T8: 1,
    AF3: 1,
    AF4: 1,
};
const channels = Object.keys(channelsMap).filter(c => channelsMap[c]);

process.env.RECORD = '../../sessions/2018.04.11_14.20.35';
const recording = require(process.env.RECORD);

function work(channels) {
    const session = getSessionFromRecording(recording, channels);

    const trainingData = numeric.transpose(_.flatten(_.toArray(session).map(s => s.epochs.map(e => e.data))));
    const trainingLabels = _.flatten(_.toArray(session).map(s => s.epochs.map(e => (e.label ? 1 : -1))));

    trainBLDA({ vectors: trainingData, labels: trainingLabels }, channels, process.env.MODEL, (classifier) => {
        console.log('done');
    });
}

function getPredictedSymbol(alphabet, predictions, coeff = 1) {
    let matrix = {};

    Object.keys(predictions).forEach((set) => {
        set.split('').forEach(char => matrix[char] = predictions[set] + (matrix[char] || 0));
    });

    matrix = _.map(matrix, (v, k) => [k, 2 ** v]);

    matrix.sort((a, b) => b[1] - a[1]);

    console.log('leading predictions:', matrix[0].join(':'), matrix[1].join(':'), matrix[2].join(':'));

    if (matrix[1][1] > 0 && matrix[0][1] > matrix[1][1] * 2 * coeff && matrix[0][1] > matrix[2][1] * 4) {
        return matrix[0];
    }

    return null;
}


work(channels);
