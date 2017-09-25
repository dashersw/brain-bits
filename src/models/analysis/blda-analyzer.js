const { trainBLDA } = require('../../lib/methods');

const _ = require('lodash');

export default class BLDAAnalyzer {
    constructor() {
        if (process.env.MODEL) {
            this.classifier = trainBLDA(null, null, process.env.MODEL);

            this.trained = true;
        }
    }

    classify(data, matrix, predictions) {
        const score = this.classifier.classify(data.map(v => [v]))[0];

        matrix.forEach(([, target]) => {
            predictions[target] = predictions[target] || -1;

            const coeff = 1;

            predictions[target] += score * coeff;
        });

        console.log(matrix.map(m => m[1]).join(' | '));
        console.log(`output ${score}`, predictions);

        const prediction = this.getPredictedSymbol(predictions);

        if (prediction) {
            console.log('predicted', prediction);
            return prediction;
        }
    }

    getPredictedSymbol(predictions, coeff = 1) {
        predictions = _.map(predictions, (v, k) => [k, v]);

        predictions.sort((a, b) => b[1] - a[1]);

        console.log('leading predictions:', predictions[0].join(':'), predictions[1].join(':'), predictions[2].join(':'));

        if (predictions[1][1] > 0 && predictions[0][1] > predictions[1][1] + 1.5 * coeff && predictions[0][1] > predictions[2][1] + 2.5) {
            return predictions[0];
        }

        return null;
    }
}
