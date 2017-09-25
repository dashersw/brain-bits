import b__ from 'brain.js';

export default class NNAnalyzer {
    constructor() {
        if (process.env.MODEL) {
            const { model, opts } = require(process.env.MODEL);
            console.log(model, opts);
            this.net = new brain.NeuralNetwork(opts);
            this.net.fromJSON(model);

            this.trained = true;
        }
    }

    classify(data, matrix, predictions) {
        const o = this.net.run(data);

        // if (o[0] < 0.7) {
        // console.log(`output ${o[0]} is too small for analysis.`);
        // return;
        // }

        matrix.forEach(([, target]) => {
            predictions[target] = predictions[target] || -1;
            // predictions[target] = (2 ** o[0]) * (predictions[target] || Math.E);

            if (o[0] > 0.3) {
                if (predictions[target] == -1) predictions[target] = 1;
                predictions[target] *= 2 + o[0];
            }
        });

        console.log(matrix.map(m => m[1]).join(' | '));
        console.log(`output ${o[0]}`, predictions);

        const prediction = this.getPredictedSymbol(predictions, 4);

        if (prediction) {
            console.log('predicted', prediction);
            return prediction;
        }
    }

    getPredictedSymbol(predictions, coeff) {
        predictions = _.map(predictions, (v, k) => [k, v]);

        predictions.sort((a, b) => b[1] - a[1]);

        console.log(predictions[0], predictions[1], predictions[2]);

        if (predictions[1][1] > 0 && predictions[0][1] > predictions[1][1] * coeff) {
            return predictions[0];
        }

        return null;
    }
}
