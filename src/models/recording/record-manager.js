import EmotivRecorder from './emotiv-recorder';
import MatrixRecorder from './matrix-recorder';
import MatrixRunner from '../matrix/matrix-runner';

export default class RecordManager {
    /**
     * @param {MatrixRunner} runner
     */
    constructor(runner, emotivSource) {
        this.runner = runner;
        this.emotivSource = emotivSource;

        const { alphabet, rows, cols } = this.runner.matrix;

        this.matrixRecorder = new MatrixRecorder({
            alphabet,
            size: { rows, cols },
        });

        this.emotivRecorder = new EmotivRecorder();

        this.onMatrixData = this.onMatrixData.bind(this);
        this.onEmotivData = this.onEmotivData.bind(this);

        this.runner.on('data', this.onMatrixData);
        this.emotivSource.on('data', this.onEmotivData);
    }

    setup() {

    }

    onMatrixData(data, now) {
        this.matrixRecorder.record([now, data]);
    }

    onEmotivData(data, now) {
        this.emotivRecorder.record([now, data]);
    }

    dispose() {
        this.runner.removeListener(this.onData);
        this.runner = null;
        this.matrixRecorder = null;
    }
}
