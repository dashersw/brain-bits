import LiveSession from './live-session';
import Matrix from '../matrix/matrix';
import MatrixRunner from '../matrix/matrix-runner';
import RecordManager from '../recording/record-manager';
import Session from './session';
import TrainingSession from './training-session';
// import Simulator from '../emotiv/simulator';
import Emotiv from '../emotiv/emotiv';
import Analyzer from '../analysis/analyzer';

export default class SessionManager {
    /**
     * @param {Matrix} matrix
     */
    constructor(matrix) {
        this.matrix = matrix;

        this.session = null;
        this.runner = null;
        this.display = null;
        // this.source = new Simulator();
        this.source = new Emotiv();
    }

    startSession(mode = Session.Mode.TRAINING, message = 'HELLO') {
        if (this.session) return;

        this.mode = mode;

        if (this.mode == Session.Mode.LIVE) {
            this.session = new LiveSession();
        } else if (this.mode == Session.Mode.TRAINING) {
            this.session = new TrainingSession(message);
        }

        this.runner = new MatrixRunner(this.matrix, this.session.runCount);

        this.recordManager = new RecordManager(this.runner, this.source);

        this.runner.on('endRun', () => this.session.next());
        this.session.on('display', () => {
            this.display = this.session.display;
        });
        this.session.on('run', (symbol) => {
            this.runner.start();
            this.recordManager.onDisplayData(symbol, Date.now());
        });

        this.session.on('end', () => {
            const { session } = this;

            this.saveSession(session);
            this.resetSession();

            if (session instanceof LiveSession) this.display = session.message;
            else this.display = 'done';
        });

        this.source.start();
        this.session.start();

        /* live sessions

        Analyzer.on('decision', (d) => {
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
        this.source.stop();
    }

    saveSession(session) {
        const {
            runCount, runs, message, type,
        } = session;

        this.recordManager.save({
            runCount, runs, message, type,
        });
    }

    analyze() {
        Analyzer.analyze();
    }
}
