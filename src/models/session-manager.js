import RecordManager from './record-manager';
import MatrixRunner from './matrix-runner';

export default class SessionManager {
    /**
     * @param {MatrixRunner} runner
     */
    constructor(runner) {
        this.runner = runner;
        this.recordManager = new RecordManager(this.runner);
    }
}
