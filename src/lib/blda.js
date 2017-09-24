const _ = require('lodash');
const numeric = require('../lib/numeric');
const jsfeat = require('jsfeat');
const request = require('request');

module.exports = class BLDA {
    constructor() {
        this.evidence = 0; // log evidence
        this.beta = 0; // inverse variance of noise
        this.alpha = 0; // inverse variance of prior
        this.w = zeros(1, 1); // weight vector (mean of posterior)
        this.p = zeros(1, 1); // precision matrix of posterior
    }

    /*
     training procedure for Bayesian LDA
     INPUT:
        featureVectors - m*n matrix containing n feature vectors of size m*1
        labels         - 1*n matrix containing class labels (-1,1)

     OUTPUT:
        b       - updated object of type bayeslda

     Author: Ulrich Hoffmann - EPFL, 2006
     Copyright: Ulrich Hoffmann - EPFL

     The algorithm implemented here was originally described by
     MacKay, D. J. C., 1992. Bayesian interpolation.
     Neural Computation 4 (3), pp. 415-447.
    */
    train(featureVectors, labels, cb) {
        // compute regression targets from class labels (to do lda via regression)
        const n_posexamples = labels.filter(l => l == 1).length;
        const n_negexamples = labels.length - n_posexamples;
        const n_examples = labels.length;

        labels = labels.map(l => (l == 1 ? n_examples / n_posexamples : -n_examples / n_negexamples));

        // add feature that is constantly one (bias term)
        featureVectors.push(_.fill(Array(1906), 1));

        // initialize variables for fast iterative estimation of alpha and beta
        const n_features = featureVectors.length; // dimension of feature vectors
        let d_beta = Infinity; // (initial) diff. between new and old beta
        let d_alpha = Infinity; // (initial) diff. between new and old alpha
        let alpha = 25; // (initial) inverse variance of prior distribution
        const biasalpha = 0.00000001; // (initial) inverse variance of prior for bias term
        let beta = 1; // (initial) inverse variance around targets
        const stopeps = 0.0001; // desired precision for alpha and beta
        let i = 1; // keeps track of number of iterations
        const maxit = 500; // maximal number of iterations

        featureVectors = matrix(featureVectors.length, featureVectors[0].length, _.flatten(featureVectors));

        labels = matrix(1, labels.length, labels);

        const aaT = AAt(featureVectors);

        const aaTdata = [];
        _.times(aaT.rows, (rowNo) => {
            aaTdata.push(...aaT.data.slice(rowNo * aaT.rows, rowNo * aaT.rows + aaT.cols));
        });

        let [v, d] = eig(aaT);

        if (process.env.MATLAB_EIG_SERVER) {
            request.post({ url: process.env.MATLAB_EIG_SERVER, json: true, body: { data: aaTdata } }, onEig.bind(this));
        } else {
            onEig.call(this);
        }

        function onEig(error, res) {
            if (process.env.MATLAB_EIG_SERVER) {
                v = matrix(v.rows, v.cols, _.flatten(res.body));
            }

            const vTx = AtB(v, featureVectors);
            const vxy = ABt(vTx, labels);

            const e = ones(n_features - 1, 1); // dito
            d = d.data.reverse();

            let m = zeros(featureVectors.rows, 1);
            let mAtA;
            let m1;
            let err;
            // estimate alpha and beta iteratively

            while (((d_alpha > stopeps) || (d_beta > stopeps)) && (i < maxit)) {
                const alphaold = alpha;
                const betaold = beta;

                m1 = d.map(item => beta * item + alpha);
                m1[m.length - 1] = beta * m[m.length - 1] + biasalpha;
                const m2 = m1.map(item => item ** -1).map((item, index) => item * vxy.data[index]);
                let betaV = v.data.map(item => beta * item);
                betaV = matrix(v.rows, v.cols, betaV);
                const m3 = matrix(featureVectors.rows, 1, m2);

                m = multiply(betaV, m3);

                const mTx = AtB(m, featureVectors);
                err = labels.data.map((label, i) => (label - mTx.data[i]) ** 2).reduce((i, v) => i + v);

                const gamma = d.map((item, index) => beta * item / m1[index]).reduce((i, v) => i + v);

                mAtA = AtA(m).data[0];
                alpha = gamma / mAtA;
                beta = (n_examples - gamma) / err;
                d_alpha = Math.abs(alpha - alphaold);
                d_beta = Math.abs(beta - betaold);
                i++;
            }

            // process results of estimation

            if (i < maxit) {
                // compute the log evidence
                // this can be used for simple model selection tasks
                // (see MacKays paper)

                this.evidence = n_features / 2 * Math.log(alpha) + n_examples / 2 * Math.log(beta) -
                    beta / 2 * err - alpha / 2 * mAtA -
                    0.5 * m1.map(Math.log).reduce((i, v) => i + v) - n_examples / 2 * Math.log(2 * Math.PI);

                // store alpha, beta, the posterior mean and the posterrior precision-
                // matrix in class attributes

                this.alpha = alpha;
                this.beta = beta;
                this.w = m;

                const p1 = numeric.diag(m1.map(m => m ** -1));
                const p2 = multiply(v, matrix(p1.length, p1[0].length, _.flatten(p1)));
                this.p = multiply(p2, transpose(v));
            }

            cb();
        }
    }
    /*
     prediction procedure for bayeslda
     INPUT:
        b          - object of type bayeslda
        x          - m*n matrix containing n feature vectors of size m*1

     OUTPUT:
        varargout  - if classify is called with one output argument an array
                     containing the mean value of the predictive distribution
                     for each example in x is returned
                   - if classify is called with two output arguments the
                     mean value and the variance of the predictive
                     distribution are returned

     Author: Ulrich Hoffmann - EPFL, 2006
     Copyright: Ulrich Hoffmann - EPFL

     The algorithm implemented here was originally described by
     MacKay, D. J. C., 1992. Bayesian interpolation.
     Neural Computation 4 (3), pp. 415-447.
    */
    classify(featureVectors) {
        featureVectors.push(_.fill(Array(featureVectors[0].length), 1));
        featureVectors = matrix(featureVectors.length, featureVectors[0].length, _.flatten(featureVectors));

        const m = multiply(transpose(this.w), featureVectors);

        return m.data;
    }
};

function eig(a) {
    const v = zeros(a.rows, a.rows);

    const d = zeros(1, a.rows);

    jsfeat.linalg.eigenVV(a, v, d);

    return [v, d];
}

function AAt(a) {
    const rv = zeros(a.rows, a.rows);

    jsfeat.matmath.multiply_AAt(rv, a);

    return rv;
}

function AtA(a) {
    const rv = zeros(a.cols, a.cols);

    jsfeat.matmath.multiply_AtA(rv, a);

    return rv;
}

function AtB(a, b) {
    const rv = zeros(a.cols, b.cols);

    jsfeat.matmath.multiply_AtB(rv, a, b);

    return rv;
}

function ABt(a, b) {
    const rv = zeros(a.rows, b.rows);

    jsfeat.matmath.multiply_ABt(rv, a, b);

    return rv;
}

function multiply(a, b) {
    const rv = zeros(a.rows, b.cols);
    jsfeat.matmath.multiply(rv, a, b);

    return rv;
}

function transpose(m) {
    const rv = zeros(m.cols, m.rows);
    jsfeat.matmath.transpose(rv, m);

    return rv;
}

function matrix(rows, cols, data) {
    return new jsfeat.matrix_t(cols, rows, jsfeat.F64_t, new jsfeat.data_t(rows * cols, data));
}

function ones(rows, cols) {
    return fill(1, rows, cols);
}

function zeros(rows, cols) {
    return fill(0, rows, cols);
}

function fill(val, rows, cols) {
    return matrix(rows, cols, _.fill(new Array(rows * cols), val));
}
