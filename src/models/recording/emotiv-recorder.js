import Fili from 'fili';
import { channels } from '../emotiv/constants';

export default class EmotivRecorder {
    constructor(settings = {}) {
        this.settings = settings;
        this.records = [];
        this.filteredRecords = {};

        this.initFilters();

        channels.forEach(c => this.filteredRecords[c] = []);
    }

    record(data) {
        this.records.push(data);
        channels.forEach((c, i) => this.filteredRecords[c].push(...this.filter(i, data[0].levels[c])));
    }

    filter(filterIndex, data) {
        return this.highpassFilters[filterIndex].multiStep(this.lowpassFilters[filterIndex].multiStep([data]));
    }

    initFilters() {
        const iirCalculator = new Fili.CalcCascades();

        this.highpassFilters = channels.map(c => new Fili.IirFilter(iirCalculator.highpass({
            order: 1,
            characteristic: 'butterworth',
            Fs: 128,
            Fc: 1,
        })));

        this.lowpassFilters = channels.map(c => new Fili.IirFilter(iirCalculator.lowpass({
            order: 1,
            characteristic: 'butterworth',
            Fs: 128,
            Fc: 16,
        })));
    }

    dump() {
        return {
            settings: this.settings,
            records: this.records,
        };
    }
}
