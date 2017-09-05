const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

class Cell {
    constructor(letter = '?') {
        this.highlighted = false;
        this.letter = letter;
    }
}

class Grid {
    constructor() {
        this.cells = Array.from(new Array(36)).map((l, i) => new Cell(alphabet[i]));
    }
}

module.exports = Grid;
