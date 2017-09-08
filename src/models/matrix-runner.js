import _ from 'lodash';
import EventEmitter from 'events';

import { createArray, createRNAG } from '../util';
import { Grid, Cell } from './grid';

export default class MatrixRunner extends EventEmitter {
    /**
     * @param {Grid} grid
     */
    constructor(grid) {
        super();
        this.grid = grid;
        this._gridIndexes = this.createGridIndexes();
        this._gridAlphabet = grid.alphabet;
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

        this.resetGridIndexes();
        this.grid.dim();
        this.iteration = 0;
    }

    stop() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    createGridIndexes() {
        const arr = createArray(this.grid.size).map((e, i) => i);

        return createRNAG(arr, this.grid.rows, this.grid.cols);
    }

    resetGridIndexes() {
        this.gridIndexes = _.shuffle(this.createGridIndexes());
    }

    loop() {
        const now = Date.now();
        this.lastLoop = now;

        if (!this.gridIndexes.length) {
            this.resetGridIndexes();
            this.iteration++;
        }

        this.colors = this._colors.slice();

        this.activeIndex = this.gridIndexes.shift();
        this.formatAndPublishData(this.activeIndex, now);
        this.grid.dim();

        this.activeIndex.forEach(c => this.grid.highlightCell(c, this.colors.shift()));

        this.timeout = setTimeout(() => this.loop(), 300);
    }

    formatAndPublishData(activeIndex, now) {
        const symbols = activeIndex.map(i => [i, this._gridAlphabet[i]]);
        this.emit('data', symbols, now);
    }
}
