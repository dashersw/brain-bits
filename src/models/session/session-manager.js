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
            Analyzer.on('decision', (d) => {
                Analyzer.cancelPendingAnalyses();
                this.session.next(d[0]);
            });
        } else if (this.mode == Session.Mode.TRAINING) {
            this.session = new TrainingSession(message);
        }

        this.runner = new MatrixRunner(this.matrix, this.session.runCount);

        this.recordManager = new RecordManager(this.runner, this.source);
        Analyzer.setSource(this.recordManager.emotivRecorder);

        this.runner.on('endRun', () => this.session.next());
        this.session.on('display', () => {
            this.runner.stop();
            this.display = this.session.display;
        });
        this.session.on('run', (symbol) => {
            this.recordManager.onDisplayData(symbol, Date.now());
            this.runner.start();
            Analyzer.reset();
        });

        this.session.on('end', () => {
            const { session } = this;

            this.saveSession(session);
            this.resetSession();

            if (session instanceof LiveSession) this.display = session.message;
            else this.display = 'done';
        });

        this.runner.on('data', (data, timestamp) => {
            Analyzer.feed(data, timestamp);
        });

        this.source.start();
        this.session.start();
        Analyzer.start();
    }

    resetSession() {
        this.runner.reset();
        this.display = null;
        this.session = null;
        this.source.stop();
        Analyzer.reset();
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
