/*

    Given a TRAINING_RECORD, a TEST_RECORD and optionally a MODEL, this file
    classifies the test recording with a Neural Network and prints out the
    predictions.

*/

const {
    train, getEpochData, prepareElectrodesData, getSessionFromRecording, splitSessionIntoTrainingAndTest
} = require('../lib/methods');

const _ = require('lodash');

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

const recording = require(process.env.TRAINING_RECORD);

function work(channels) {
    const session = getSessionFromRecording(recording, channels);
    const { training } = splitSessionIntoTrainingAndTest(session, 1);

    const testRecording = require(process.env.TEST_RECORD);
    const electrodesData = prepareElectrodesData(testRecording.data.electrodes, channels);
    const matrixKeys = Object.keys(testRecording.data.matrix);

    const reset = matrixKeys.filter((k, i) => matrixKeys[i + 1] > +k + 500).map(k => matrixKeys.indexOf(k))

    const epochs = matrixKeys.map(Number)
        .map(key => getEpochData(electrodesData, key));

    const net = train(training, channels, process.env.MODEL);

    let predictions = {};
    let counter = 0;
    let totalCounter = 0;

    epochs.forEach((e, i) => {
        counter++;
        totalCounter++;

        const score = net.run(e)[0];
        const matrix = testRecording.data.matrix[matrixKeys[i]];

        const setName = matrix.map(m => m[1]).join('');
        predictions[setName] = predictions[setName] || 0;
        predictions[setName] += score;

        console.log(matrix.map(m => m[1]).join(' '));
        console.log(`output ${score} ${counter}`);

        const prediction = getPredictedSymbol(testRecording.meta.matrixSettings.alphabet, predictions, 2);
        console.log('=======');
        if (prediction) {
            console.log(`predicted ${prediction} in ${counter} trials`);
        }

        if (totalCounter == reset[0]) {
            counter = 0;
            predictions = {};
            reset.shift();
        }
    });

    console.log('done');
}

function getPredictedSymbol(alphabet, predictions, coeff = 1) {
    let matrix = {};

    Object.keys(predictions).forEach(set => {
        set.split('').forEach(char => matrix[char] = predictions[set] + (matrix[char] || 0))
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
