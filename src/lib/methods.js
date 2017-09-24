const fs = require('fs');
const _ = require('lodash');
const Fili = require('fili');
const m = require('mathjs');
const mkdirp = require('mkdirp');
const { Matrix, Vector } = require('vectorious');
const brain = require('brain.js');
const dateformat = require('dateformat');

function normalize(min, max, v) {
    return (v - min) / (max - min);
}

function winsor(percentile, arr) {
    let rv = arr.slice();
    const len = rv.length;

    const mean = m.mean(rv);
    const std = m.std(rv);

    rv = rv.map(v => (v - mean) / std);

    const percentage = percentile / 100 / 2;
    // const min = m.min(rv);
    const min = m.quantileSeq(rv, percentage);
    // const max = m.max(rv);
    const max = m.quantileSeq(rv, 1 - percentage);

    for (let i = 0; i < len; i++) {
        // if (rv[i] < min) rv[i] = min;
        // else if (rv[i] > max) rv[i] = max;

        rv[i] = normalize(min, max, rv[i]);
    }

    return rv;
}

function decimator(arr) {
    const rv = [];

    for (let i = 0; i < arr.length; i++) {
        if (i % 4 == 0) rv.push(arr[i]);
    }

    return rv;
}

function getFeatureVector(data) {
    return _.flatten(data);
}

function getEpochData(data, key = 0) {
    return getFeatureVector(data
        .map(e => e.slice(key, key + 128))
        .map(winsor.bind(null, 5))
        .map(decimator));
}

function filterLp(arr) {
    const iirCalculator = new Fili.CalcCascades();

    const iirFilterCoeffs = iirCalculator.lowpass({
        order: 1,
        characteristic: 'butterworth',
        Fs: 128,
        Fc: 16,
    });

    const iirFilter = new Fili.IirFilter(iirFilterCoeffs);

    return iirFilter.multiStep(arr);
}


function filterHp(arr) {
    const iirCalculator = new Fili.CalcCascades();

    const iirFilterCoeffs = iirCalculator.highpass({
        order: 1,
        characteristic: 'butterworth',
        Fs: 128,
        Fc: 1,
    });

    const iirFilter = new Fili.IirFilter(iirFilterCoeffs);

    return iirFilter.multiStep(arr);
}

function filter(arr) {
    return filterHp(filterLp(arr));
}

function l(...args) {
    console.log(...args);
}


function getPredictedSymbol(predictions, coeff) {
    predictions = _.map(predictions, (v, k) => [k, v]);

    predictions.sort((a, b) => b[1] - a[1]);

    if (predictions[0][1] >= predictions[1][1] * coeff) {
        l(predictions.map(p => [p[0], p[1].toFixed(2)]).map(p => p.join(': ')).join(' '));
        return predictions[0];
    }

    return null;
}

function classify(net, data) {
    const targets = {};
    let lastTarget = null;

    data.forEach((run, i) => {
        if (lastTarget && lastTarget != run.target || i == data.length - 1) {
            l(`${lastTarget} done. predicted:`, ...getPredictedSymbol(targets[lastTarget], 1));
        }

        const target = lastTarget = run.target;

        const o = net.run(run.input);

        targets[target] = targets[target] || {};
        l(o[0] > 0.3 ? 'y' : ' ', run.matrix, o[0].toFixed(2), run.matrix.includes(target) ? '+' : '');

        run.matrix.split('').forEach((symbol) => {
            targets[target][symbol] = targets[target][symbol] || -1;
            // targets[target][symbol] = targets[target][symbol] * (2 ** o[0]) || Math.E;

            if (o[0] > 0.3) {
                if (targets[target][symbol] == -1) targets[target][symbol] = 1;
                targets[target][symbol] *= 2 + o[0];
            }
        });
    });
}

function prepareElectrodesData(data, channels) {
    data = data.map(record => channels.map(c => record.levels[c]));

    return new Matrix(data)
        .transpose()
        .toArray()
        .map(v => new Vector(v).toArray())
        .map(filter);
}

function getSessionFromRecording(r, channels) {
    const electrodesData = prepareElectrodesData(r.data.electrodes, channels);

    const displayTimeKeys = Object.keys(r.data.display);
    const matrixKeys = Object.keys(r.data.matrix);
    const dataLength = r.data.electrodes.length;

    const targets = {};

    displayTimeKeys.forEach((k, i) => {
        const symbol = r.data.display[k];
        const nextDisplayKey = displayTimeKeys[i + 1] || dataLength;
        const matrixKeysForTarget = matrixKeys
            .slice(matrixKeys.indexOf(k), matrixKeys.indexOf(nextDisplayKey));

        const matrix = matrixKeysForTarget
            .map(key => r.data.matrix[key])
            .map(t => (t.map(u => u[1]).join('')));

        const electrodes = electrodesData.map(e => e.slice(+k, +nextDisplayKey));

        const epochs = matrixKeysForTarget.map((key, index) => ({
            data: getEpochData(electrodes, key - k),
            label: matrix[index].includes(symbol) ? 1 : 0,
            matrix: matrix[index],
            target: symbol,
        }));

        targets[symbol] = {
            target: symbol,
            times: r.data.time.slice(+k, +nextDisplayKey),
            electrodes,
            keys: { from: +k, to: +nextDisplayKey },
            matrix,
            matrixKeys: matrixKeysForTarget,
            epochs,
        };
    });

    return targets;
}

function formatDataForNN(targets) {
    return _.flatten(targets.map(t => t.epochs))
        .map(e => ({
            input: e.data,
            output: [e.label],
            matrix: e.matrix,
            target: e.target,
        }));
}

function splitSessionIntoTrainingAndTest(targets, ratio) {
    const targetKeys = Object.keys(targets);
    const targetsArr = targetKeys.map(k => targets[k]);

    const trainingTargets = targetsArr.splice(0, targetKeys.length * ratio);
    l(trainingTargets.map(t => t.target));

    return {
        training: formatDataForNN(trainingTargets),
        test: formatDataForNN(targetsArr),
    };
}

function train(data, channels, modelFilename) {
    if (modelFilename) {
        const { model, opts } = require(modelFilename);

        const net = new brain.NeuralNetwork(opts);
        return net.fromJSON(model);
    }

    const opts = {
        // activation: 'leaky-relu',
        learningRate: 0.01,
        // hiddenLayers: [240, 160, 80, 32],
    };

    const net = new brain.NeuralNetwork(opts);

    const o = net.train(data, {
        log: true,
        // iterations: 100,
        // errorThresh: 0.0005,
    });
    l(o);

    mkdirp.sync('./nn-models');
    const savedData = {
        opts: {
            // activation: net.activation,
            learningRate: net.learningRate,
            sizes: net.sizes,
            errorThresh: net.errorThresh || brain.NeuralNetwork.trainDefaults.errorThresh,
            channels,
        },
        model: net.toJSON(),
        output: o,
    };

    const filename = `./nn-models/${savedData.opts.learningRate}-${savedData.opts.sizes.join('|')}-${dateformat(new Date(), 'yyyy.mm.dd_HH.MM.ss')}.json`;

    fs.writeFileSync(filename, JSON.stringify(savedData, null, '\t'));

    return net;
}


module.exports = {
    filter,
    l,
    getEpochData,
    classify,
    getSessionFromRecording,
    splitSessionIntoTrainingAndTest,
    train,
};
