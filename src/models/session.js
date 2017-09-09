import EventEmitter from 'events';

import StateMachine from 'javascript-state-machine';

export default class Session extends EventEmitter {
    constructor(message) {
        super();
        this.message = message;

        this.countdownMessages = [3, 2, 1, 0];
        this.countdown = this.countdownMessages.length;
        this.runs = 0;
        this.display = null;

        this.runCount = Session.DEFAULT_RUN_COUNT;
    }

    _display(msg) {
        this.display = msg;
        this.emit('display');
    }
}

Session.DEFAULT_RUN_COUNT = 5;

Session.Mode = {
    TRAINING: 'training',
    LIVE: 'live',
};
