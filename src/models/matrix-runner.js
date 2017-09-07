import _ from 'lodash';
import { createArray, createRNAG } from '../util';
import { Grid, Cell } from './grid';

export default class MatrixRunner {
    /**
     * @param {Grid} grid
     */
    constructor(grid) {
        this.grid = grid;
        this._gridIndexes = this.createGridIndexes();
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
        this.grid.dim();

        this.activeIndex.forEach(c => this.grid.highlightCell(c, this.colors.shift()));

        this.timeout = setTimeout(() => this.loop(), 300);
    }
}
