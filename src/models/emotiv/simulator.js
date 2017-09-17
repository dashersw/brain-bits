import EventEmitter from 'events';
import { resolution, channels } from './constants';

let counter = 0;

export default class EmotivSimulator extends EventEmitter {
    constructor(filename) {
        super();

        this.rate = resolution;
        this.timeout = null;

        if (filename) {
            this.data = require(filename).data.electrodes;
            this.counter = 0;
            this.mode = EmotivSimulator.Mode.REPLAY;
        } else {
            this.mode = EmotivSimulator.Mode.RANDOM;
        }
    }

    start() {
        this.timeout = setTimeout(() => {
            this.emit('data', this.generateData(), Date.now());

            this.start();
        }, 1000 / this.rate);
    }

    stop() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    generateData() {
        if (this.mode == EmotivSimulator.Mode.REPLAY) {
            return this.data[counter++];
        }

        const electrodes = {};
        channels.forEach(c => electrodes[c] = this.generateRandomReading());

        return { levels: electrodes };
    }

    generateRandomReading() {
        return Math.floor(Math.random() * 16384);
    }
}

EmotivSimulator.Mode = {
    RANDOM: 'random',
    REPLAY: 'replay',
};
