import { createArray, getRowIndexes, getColIndexes } from '../../util';

const _alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

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
    constructor(rows = 6, cols = 6, alphabet = _alphabet) {
        this.defaultColor = Cell.Colors.RED;

        this.rows = rows;
        this.cols = cols;
        this.alphabet = alphabet;

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
