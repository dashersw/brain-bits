import { channels } from '../emotiv/constants';

export default function format(matrixData, emotivData, displayData) {
    const arrLength = emotivData.records.length;

    const formattedData = {
        time: new Array(arrLength),
        matrix: {},
        electrodes: new Array(arrLength),
        display: {},
    };

    const {
        time, matrix, electrodes, display,
    } = formattedData;

    for (let i = 0; i < arrLength; i++) {
        const [data, timestamp] = emotivData.records[i];

        time[i] = timestamp;
        electrodes[i] = formatElectrodesData(data);
    }

    let timeIndex = -1;

    matrixData.records.forEach((d) => {
        const [data, timestamp] = d;

        while (time[++timeIndex] <= timestamp) {
            // skip until we find the right time.
        }

        matrix[timeIndex] = data;
    });

    timeIndex = -1;

    displayData.records.forEach((d) => {
        const [data, timestamp] = d;

        while (time[++timeIndex] <= timestamp) {
            // skip until we find the right time.
        }

        display[timeIndex] = data;
    });

    return formattedData;
}

function formatElectrodesData(d) {
    return d;
    // return channels.map(c => d.levels[c]);
}

