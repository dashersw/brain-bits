import b__ from 'brain.js';
import _ from 'lodash';

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

    classify(data, matrix, predictions, alphabet) {
        const score = this.net.run(data)[0];

        const setName = matrix.map(m => m[1]).join('');
        predictions[setName] = predictions[setName] || 0;
        predictions[setName] += score;

        console.log(matrix.map(m => m[1]).join(' | '));
        console.log(`output ${score}`, predictions);

        const prediction = this.getPredictedSymbol(alphabet, predictions, 2);

        if (prediction) {
            console.log('predicted', prediction);
            return prediction;
        }
    }

    getPredictedSymbol(alphabet, predictions, coeff = 1) {
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
}
