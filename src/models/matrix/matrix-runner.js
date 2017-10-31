import _ from 'lodash';
import EventEmitter from 'events';

import { createRCM } from '../../util';
import { Cell } from './matrix';

export default class MatrixRunner extends EventEmitter {
    /**
     * @param {Matrix} Matrix
     */
    constructor(matrix, runCount = 1) {
        super();
        this.matrix = matrix;
        this.matrixIndexes = [];
        this.lastTwoIndexes = [];

        this.matrixAlphabet = matrix.alphabet;
        this.shuffledMatrixIndexes = matrix.shuffledIndexes;

        this._colors = Cell.ColorsList;
        this.timeout = null;
        this.iteration = 0;
        this.runCount = runCount;
        this.highlightInterval = MatrixRunner.DEFAULT_HIGHLIGHT_INTERVAL;
    }

    get iterationLimit() {
        return this.runCount;
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
        // return createRNAM(arr, this.matrix.rows, this.matrix.cols);
        return createRCM(this.shuffledMatrixIndexes, this.matrix.rows, this.matrix.cols);
    }

    resetMatrixIndexes() {
        this.matrixIndexes = _.shuffle(this.createMatrixIndexes());
        while (
            _.isEqual(`${this.lastTwoIndexes[0]}`, `${this.matrixIndexes[0]}`) ||
            _.isEqual(`${this.lastTwoIndexes[0]}`, `${this.matrixIndexes[1]}`) ||
            _.isEqual(`${this.lastTwoIndexes[1]}`, `${this.matrixIndexes[0]}`) ||
            _.isEqual(`${this.lastTwoIndexes[1]}`, `${this.matrixIndexes[1]}`)
        ) {
            this.matrixIndexes = _.shuffle(this.createMatrixIndexes());
        }

        this.lastTwoIndexes = _.takeRight(this.matrixIndexes, 2);
    }

    loop() {
        const now = Date.now();
        this.lastLoop = now;

        if (!this.matrixIndexes.length) {
            this.iteration++;

            if (this.iteration == this.iterationLimit) {
                setTimeout(() => this.emit('endRun'), 2000);

                this.reset();
                return;
            }

            this.resetMatrixIndexes();
        }

        this.colors = _.shuffle(this._colors.slice());

        this.activeIndex = this.matrixIndexes.shift();
        this.formatAndPublishData(this.activeIndex, now);

        this.matrix.dim();
        console.log(this.activeIndex.sort((a, b) => a - b).join(' | '));

        this.activeIndex.forEach(c => this.matrix.highlightCell(c, this.colors.shift()));

        setTimeout(() => this.matrix.dim(), this.highlightInterval * 2 / 2);

        this.timeout = setTimeout(() => this.loop(), this.highlightInterval * 2);
    }

    formatAndPublishData(activeIndex, now) {
        const symbols = activeIndex.map(i => [i, this.matrixAlphabet[i]]);
        this.emit('data', symbols, now);
    }
}

MatrixRunner.DEFAULT_HIGHLIGHT_INTERVAL = 150;
// MatrixRunner.DEFAULT_HIGHLIGHT_INTERVAL = 45;
