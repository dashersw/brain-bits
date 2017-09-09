import LiveSession from './live-session';
import Matrix from '../matrix/matrix';
import MatrixRunner from '../matrix/matrix-runner';
import RecordManager from '../recording/record-manager';
import Session from './session';
import TrainingSession from './training-session';

export default class SessionManager {
    /**
     * @param {Matrix} matrix
     */
    constructor(matrix) {
        this.matrix = matrix;

        this.session = null;
        this.runner = null;
        this.display = null;
    }

    startSession(mode, message = 'HELLO') {
        if (this.session) return;

        this.mode = mode;

        if (this.mode == Session.Mode.LIVE) {
            this.session = new LiveSession();
        } else if (this.mode == Session.Mode.TRAINING) {
            this.session = new TrainingSession(message);
        }

        this.runner = new MatrixRunner(this.matrix, Infinity);

        this.runner.runCount = this.session.runCount;

        this.runner.on('endRun', () => this.session.next());
        this.session.on('display', () => this.display = this.session.display);
        this.session.on('run', () => this.runner.start());

        this.session.on('end', () => {
            const { session } = this;

            this.resetSession();

            if (session instanceof LiveSession) this.display = session.message;
            else this.display = 'done';
        });

        this.session.start();

        this.recordManager = new RecordManager(this.runner);

        /* live sessions

        this.analyzer.on('decision', (d) => {
            if (d == 'end') {
                this.session.end();
            } else {
                this.session.next(d);
            }
        });

        */
    }

    resetSession() {
        this.runner.reset();
        this.display = null;
        this.session = null;
    }
}
