import EventEmitter from 'events';
import _ from 'lodash';
import { getEpochData } from '../../lib/methods';

import BLDAAnalyzer from './blda-analyzer';
import NNAnalyzer from './nn-analyzer';

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
    constructor(method = Analyzer.Methods.NN) {
        super();

        if (method == Analyzer.Methods.NN) {
            this.classifier = new NNAnalyzer();
        } else if (method == Analyzer.Methods.BLDA) {
            this.classifier = new BLDAAnalyzer();
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
        if (!this.classifier.trained) {
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

        const prediction = this.classifier.classify(epochData, matrix, this.predictions);

        if (prediction) {
            this.emit('decision', prediction);
        }
    }
}

Analyzer.Methods = {
    NN: 'nn',
    BLDA: 'blda',
};

export default new Analyzer();
