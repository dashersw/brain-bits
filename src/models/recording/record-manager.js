import dateformat from 'dateformat';
import fs from 'fs';
import mkdirp from 'mkdirp';
import DisplayRecorder from './display-recorder';
import EmotivRecorder from './emotiv-recorder';
import MatrixRecorder from './matrix-recorder';
import formatter from './formatter';

export default class RecordManager {
    constructor(runner, emotivSource) {
        this.runner = runner;
        this.emotivSource = emotivSource;

        this.setup();
    }

    setup() {
        const { alphabet, rows, cols } = this.runner.matrix;

        this.matrixRecorder = new MatrixRecorder({
            alphabet,
            size: { rows, cols },
        });

        this.emotivRecorder = new EmotivRecorder();
        this.displayRecorder = new DisplayRecorder();

        this.onMatrixData = this.onMatrixData.bind(this);
        this.onEmotivData = this.onEmotivData.bind(this);
        this.onDisplayData = this.onDisplayData.bind(this);

        this.runner.on('data', this.onMatrixData);
        this.emotivSource.on('data', this.onEmotivData);
    }

    onMatrixData(data, now) {
        this.matrixRecorder.record([data, now]);
    }

    onEmotivData(data, now) {
        this.emotivRecorder.record([data, now]);
    }

    onDisplayData(data, now) {
        this.displayRecorder.record([data, now]);
    }

    save(session) {
        const data = formatter(this.matrixRecorder.dump(), this.emotivRecorder.dump(), this.displayRecorder.dump());

        const log = { data, meta: {} };
        log.meta.matrixSettings = this.matrixRecorder.settings;
        log.meta.session = session;
        log.meta.date = new Date();
        log.meta.timestamp = +log.meta.date;

        mkdirp.sync('./sessions');


        fs.writeFileSync(`./sessions/${dateformat(log.meta.date, 'yyyy.mm.dd_HH.MM.ss')}.json`, JSON.stringify(log, null, '\t'));
    }

    dispose() {
        this.runner.removeListener(this.onMatrixData);
        this.emotivSource.removeListener(this.onEmotivData);

        this.runner = null;
        this.matrixRecorder = null;
    }
}
