export const createArray = length => Array.from(new Array(length));

export const getRowIndexes = (rows, cols) => createArray(rows)
    .map((r, ri) => createArray(cols)
        .map((c, ci) => (ri * rows) + ci));

export const getColIndexes = (rows, cols) => createArray(cols)
    .map((c, ci) => createArray(rows)
        .map((r, ri) => (ri * rows) + ci));


const adjacent = (i1, i2) => {
    const diff = Math.abs(i1 - i2);

    if (diff == 1 || diff == 6 || diff == 7 || diff == 5) return true;

    return false;
};

const rnd = limit => Math.floor(Math.random() * limit);

export const createRNAM = (/** @type { Array.<number> } */arr, groupCount, groupSize) => {
    const tempArr = arr.slice();

    const rv = [];

    for (let i = 0; i < groupCount; i++) {
        const group = rv[i] = [];
        let iteration = 0;

        const groupTempArr = tempArr.slice();

        if (groupTempArr.length == groupSize) {
            group.push(...groupTempArr);
            continue;
        }

        while (group.length < groupSize) {
            iteration++;

            const rndIndex = rnd(groupTempArr.length);
            const rndItem = groupTempArr.splice(rndIndex, 1)[0];
            if (rndItem == null) debugger;
            if (group.some(r => adjacent(r, rndItem)) && iteration / 2 < groupTempArr.length) {
                continue;
            }

            const itemIndexInTempArr = tempArr.findIndex(e => e == rndItem);
            tempArr.splice(itemIndexInTempArr, 1);

            group.push(rndItem);
        }
    }

    return rv;
};
