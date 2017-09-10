import { channels } from '../emotiv/constants';

export const analyze = (matrixData, emotivData) => {
    const arrLength = emotivData.length;
    const formattedData = {
        time: new Array(arrLength),
        matrix: new Array(arrLength),
        emotivRaw: new Array(arrLength),
    };

    const { time, matrix, emotivRaw } = formattedData;

    emotivData.records.forEach((d, i) => {
        time[i] = d[0];
        emotivRaw[i] = format(d[1]);
    });

    let timeIndex = 0;

    matrixData.records.forEach((d) => {
        while (time[timeIndex++] <= d[0]) {
            // skip until we find the right time.
        }

        matrix[timeIndex] = d[1];
    });

    console.log(time, matrix, emotivRaw);
};

export const save = () => { };

function format(d) {
    return channels.map(c => d.levels[c]);
}

export default {
    analyze, save,
};
