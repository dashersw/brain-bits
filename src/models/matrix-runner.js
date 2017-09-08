import _ from 'lodash';
import EventEmitter from 'events';

import { createArray, createRNAG } from '../util';
import { Matrix, Cell } from './matrix';

export default class MatrixRunner extends EventEmitter {
    /**
     * @param {Matrix} Matrix
     */
    constructor(matrix) {
        super();
        this.matrix = matrix;
        this._matrixIndexes = this.createMatrixIndexes();
        this._matrixAlphabet = matrix.alphabet;
        this._colors = Cell.ColorsList;
        this.timeout = null;
    }

    start() {
        if (this.timeout) return;

        this.reset();

        this.loop();
    }

    reset() {
        this.stop();

        this.resetMatrixIndexes();
        this.matrix.dim();
        this.iteration = 0;
    }

    stop() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    createMatrixIndexes() {
        const arr = createArray(this.matrix.size).map((e, i) => i);

        return createRNAG(arr, this.matrix.rows, this.matrix.cols);
    }

    resetMatrixIndexes() {
        this.matrixIndexes = _.shuffle(this.createMatrixIndexes());
    }

    loop() {
        const now = Date.now();
        this.lastLoop = now;

        if (!this.matrixIndexes.length) {
            this.resetMatrixIndexes();
            this.iteration++;
        }

        this.colors = this._colors.slice();

        this.activeIndex = this.matrixIndexes.shift();
        this.formatAndPublishData(this.activeIndex, now);
        this.matrix.dim();

        this.activeIndex.forEach(c => this.matrix.highlightCell(c, this.colors.shift()));

        this.timeout = setTimeout(() => this.loop(), 300);
    }

    formatAndPublishData(activeIndex, now) {
        const symbols = activeIndex.map(i => [i, this._matrixAlphabet[i]]);
        this.emit('data', symbols, now);
    }
}
