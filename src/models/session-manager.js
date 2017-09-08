import RecordManager from './record-manager';
import MatrixRunner from './matrix-runner';
import Session from './session';

export default class SessionManager {
    /**
     * @param {MatrixRunner} runner
     */
    constructor(runner) {
        this.runner = runner;
        this.session = null;
    }

    startSession() {
        if (this.session) return;

        this.session = new Session();
        this.recordManager = new RecordManager(this.runner);
        this.runner.start();
    }

    stopSession() {
        this.runner.stop();
    }

    resetSession() {
        this.runner.reset();
        this.session = null;
    }
}
