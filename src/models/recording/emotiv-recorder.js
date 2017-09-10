export default class EmotivRecorder {
    constructor(settings = {}) {
        this.settings = settings;
        this.records = [];
    }

    record(data) {
        this.records.push(data);
    }

    dump() {
        return {
            settings: this.settings,
            records: this.records,
        };
    }
}
