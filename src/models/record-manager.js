import MatrixRecorder from './matrix-recorder';
import MatrixRunner from './matrix-runner';

export default class RecordManager {
    /**
     * @param {MatrixRunner} runner
     */
    constructor(runner) {
        this.runner = runner;
        const { alphabet, rows, cols } = this.runner.grid;

        this.recorder = new MatrixRecorder({
            alphabet,
            size: { rows, cols },
        });

        this.runner.on('data', this.onData.bind(this));
    }

    setup() {

    }

    onData(data, now) {
        // data.forEach(l => this.recorder.record(l, now));
        this.recorder.record([now, data]);
    }
}
