import { createArray, getRowIndexes, getColIndexes } from '../../util';

const _alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const _shuffledIndexes = [
    [6, 19, 7, 9, 31, 13, 1, 35, 27, 2, 18, 22, 24, 17, 30, 11, 26, 16, 5, 8, 21, 32, 23, 0, 10, 28, 3, 20, 33, 25, 34, 12, 4, 14, 15, 29],
    [18, 34, 24, 35, 14, 31, 30, 1, 28, 9, 16, 33, 19, 15, 26, 12, 10, 29, 6, 22, 20, 13, 25, 23, 7, 27, 4, 17, 5, 2, 0, 11, 32, 3, 8, 21],
    [9, 4, 15, 32, 35, 0, 2, 21, 33, 13, 10, 12, 16, 14, 11, 19, 7, 18, 30, 24, 23, 6, 17, 27, 25, 3, 28, 5, 8, 1, 22, 26, 29, 20, 31, 34],
    [33, 0, 20, 21, 16, 7, 27, 28, 35, 15, 4, 29, 31, 9, 26, 23, 13, 3, 19, 11, 34, 12, 10, 8, 5, 22, 1, 24, 2, 17, 18, 6, 14, 30, 25, 32],
    [2, 19, 3, 21, 4, 5, 25, 13, 22, 10, 35, 0, 8, 29, 16, 17, 26, 30, 27, 11, 33, 20, 28, 15, 7, 32, 18, 34, 9, 14, 12, 24, 23, 6, 1, 31],
    [33, 29, 22, 11, 35, 32, 14, 13, 21, 10, 17, 20, 16, 12, 4, 19, 5, 23, 25, 0, 1, 34, 28, 27, 9, 18, 8, 26, 24, 30, 3, 15, 6, 7, 2, 31],
    [23, 15, 31, 13, 28, 21, 4, 3, 1, 19, 24, 10, 5, 20, 16, 9, 27, 25, 18, 14, 7, 30, 34, 6, 29, 8, 11, 32, 33, 26, 17, 12, 35, 2, 22, 0],
    [21, 24, 8, 17, 16, 34, 13, 32, 23, 5, 0, 28, 35, 27, 31, 3, 33, 14, 12, 9, 7, 18, 11, 4, 30, 26, 25, 15, 6, 29, 22, 10, 2, 20, 1, 19],
    [24, 17, 21, 26, 11, 20, 35, 10, 19, 2, 7, 0, 29, 18, 6, 5, 25, 31, 28, 22, 34, 23, 33, 16, 32, 3, 9, 27, 30, 8, 1, 4, 14, 12, 15, 13],
    [13, 10, 24, 8, 21, 22, 9, 19, 20, 28, 3, 35, 15, 32, 14, 17, 31, 1, 6, 7, 26, 4, 34, 2, 0, 29, 16, 18, 11, 30, 27, 12, 25, 5, 23, 33],
];

export class Cell {
    constructor(symbol = '?') {
        this.defaultColor = Cell.Colors.RED;
        this.color = '';
        this.symbol = symbol;
    }

    highlight(color = this.defaultColor) {
        this.color = color;
    }

    dim() {
        this.color = '';
    }

    get highlighted() {
        return !!this.color;
    }
}

Cell.Colors = {
    BLUE: 'blue',
    GREEN: 'green',
    RED: 'red',
    ORANGE: 'orange',
    PURPLE: 'purple',
    YELLOW: 'yellow',
};

Cell.ColorsList = Object.keys(Cell.Colors).map(key => Cell.Colors[key]);

export default class Matrix {
    constructor(rows = 6, cols = 6, alphabet = _alphabet, shuffledIndexes = _shuffledIndexes[2]) {
        this.defaultColor = Cell.Colors.RED;

        this.rows = rows;
        this.cols = cols;
        this.alphabet = alphabet;
        this.shuffledIndexes = shuffledIndexes;

        this.cells = createArray(this.size)
            .map((cell, i) => new Cell(alphabet[i]));

        this.rowIndexes = getRowIndexes(this.rows, this.cols);
        this.colIndexes = getColIndexes(this.rows, this.cols);
    }

    get size() {
        return this.rows * this.cols;
    }

    highlightCell(i, color = this.defaultColor) {
        this.cells[i].color = color;
    }

    highlightCellAtCoord(row, col, color = this.defaultColor) {
        this.getCellAt(row, col).highlight(color);
    }

    highlightCells(cellIndexes, color = this.defaultColor) {
        cellIndexes.forEach(i => this.cells[i].highlight(color));
    }

    dimCellAtCoord(row, col) {
        this.getCellAt(row, col).dim();
    }

    getIndexFromCoord(row, col) {
        return (row * this.rows) + col;
    }

    getCellAt(row, col) {
        return this.cells[this.getIndexFromCoord(row, col)];
    }

    highlightRow(row, color = this.defaultColor) {
        this.rowIndexes[row].forEach(i => this.cells[i].highlight(color));
    }

    dimRow(row) {
        this.rowIndexes[row].forEach(c => c.dim());
    }

    highlightCol(col, color = this.defaultColor) {
        this.colIndexes[col].forEach(i => this.cells[i].highlight(color));
    }

    dimCol(col) {
        this.colIndexes[col].forEach(c => c.dim());
    }

    dim() {
        this.cells.forEach(c => c.dim());
    }
}
