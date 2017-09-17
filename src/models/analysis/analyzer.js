import EventEmitter from 'events';
import _ from 'lodash';
import { getEpochData } from '../../lib/methods';


import b__ from 'brain.js';

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

class Analyzer extends EventEmitter {
    constructor() {
        super();

        if (process.env.MODEL) {
            const { model, opts } = require(process.env.MODEL);
            console.log(model, opts);
            this.net = new brain.NeuralNetwork(opts);
            this.net.fromJSON(model);
        }
    }

    setSource(source) {
        this.source = source;
    }

    reset() {
        this.predictions = {};
        this.cancelPendingAnalyses();
    }

    start() {
        this.reset();
    }

    cancelPendingAnalyses() {
        _.forEach(this.timeouts, clearTimeout);
        this.timeouts = {};
    }

    feed(matrix, timestamp) {
        const startIndex = this.source.records.length;

        const timeout = setTimeout(() => {
            this.analyze(matrix, startIndex);

            delete this.timeouts[timeout];
        }, 1300);

        this.timeouts[timeout] = timeout;
    }

    analyze(matrix, startIndex) {
        if (!this.net) {
            console.warn('Analysis failed: no classifier trained');
            return;
        }

        const data = channels
            .map(c => this.source.filteredRecords[c].slice(startIndex, startIndex + 128));

        if (data[0].length < 128) {
            console.warn('Not enough data for analysis. Think of increasing the feed buffer size.');
            return;
        }

        const epochData = getEpochData(data);

        const o = this.net.run(epochData);


        matrix.forEach(([, target]) => {
            this.predictions[target] = this.predictions[target] || -1;

            if (o[0] > 0.3) {
                if (this.predictions[target] == -1) this.predictions[target] = 1;
            }

            this.predictions[target] *= 2 + o[0];
        });

        console.log(matrix.map(m => m[1]).join(' | '));
        console.log(`output ${o[0]}`, this.predictions);

        const prediction = this.getPredictedSymbol(this.predictions, 50);

        if (prediction) {
            console.log('predicted', prediction);
            this.emit('decision', prediction);
        }
    }

    getPredictedSymbol(predictions, coeff) {
        predictions = _.map(predictions, (v, k) => [k, v]);

        predictions.sort((a, b) => b[1] - a[1]);

        console.log(predictions[0], predictions[1], predictions[2]);

        if (predictions[0][1] > predictions[1][1] * coeff) {
            return predictions[0];
        }

        return null;
    }
}

export default new Analyzer();
