import MatrixRecorder from '../matrix/matrix-recorder';
import MatrixRunner from '../matrix/matrix-runner';

export default class RecordManager {
    /**
     * @param {MatrixRunner} runner
     */
    constructor(runner) {
        this.runner = runner;
        const { alphabet, rows, cols } = this.runner.matrix;

        this.recorder = new MatrixRecorder({
            alphabet,
            size: { rows, cols },
        });

        this.onData = this.onData.bind(this);

        this.runner.on('data', this.onData);
    }

    setup() {

    }

    onData(data, now) {
        this.recorder.record([now, data]);
    }

    dispose() {
        this.runner.removeListener(this.onData);
        this.runner = null;
        this.recorder = null;
    }
}
