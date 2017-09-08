import EventEmitter from 'events';

export default class Session extends EventEmitter {
    constructor(mode = Session.Mode.LIVE, message = '') {
        super();
        this.mode = mode;
        this.message = message;
    }
}

Session.Mode = {
    TRAINING: 'training',
    LIVE: 'live',
};
