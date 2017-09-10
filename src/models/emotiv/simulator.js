import EventEmitter from 'events';
import { resolution, channels } from './constants';

export default class EmotivSimulator extends EventEmitter {
    constructor() {
        super();

        this.rate = resolution;
        this.timeout = null;
    }

    start() {
        this.timeout = setTimeout(() => {
            this.emit('data', generateData(), Date.now());

            this.start();
        }, 1000 / this.rate);
    }

    stop() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
}

function generateRandomReading() {
    return Math.floor(Math.random() * 16384);
}

function generateData() {
    const electrodes = {};
    channels.forEach(c => electrodes[c] = generateRandomReading());

    return electrodes;
}
