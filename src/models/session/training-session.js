import StateMachine from 'javascript-state-machine';
import Session from './session';

export default class TrainingSession extends Session {
    constructor(message = '') {
        super(message);

        const session = this;

        this.runCount = TrainingSession.DEFAULT_RUN_COUNT;

        this.fsm = new StateMachine({
            init: 'stopped',
            transitions: [
                { name: 'start', from: 'stopped', to: 'countdown' },
                { name: 'showSymbol', from: 'countdown', to: 'showingSymbol' },
                { name: 'run', from: 'showingSymbol', to: 'running' },
                { name: 'next', from: 'running', to() { return session.isDone() ? 'ended' : 'showingSymbol'; } },
            ],
            methods: {
                onCountdown() {
                    (function tick() {
                        session._display(session.countdownMessages.shift());

                        if (!session.countdown--) {
                            session.fsm.showSymbol();
                        } else {
                            setTimeout(tick, 1000);
                        }
                    }());
                },
                onShowingSymbol() {
                    session._display('');

                    setTimeout(() => {
                        session._display(session.message[session.runs]);

                        setTimeout(() => {
                            session._display(null);

                            setTimeout(() => session.fsm.run(), 2000);
                        }, 2000);
                    }, 1000);
                },
                onRun() {
                    session.runs++;
                },
                onRunning() {
                    session.emit('run', session.message[session.runs]);
                },
                onEnded() { session.emit('end'); },
            },
        });
    }

    isDone() {
        return this.runs == this.message.length;
    }

    start() {
        this.fsm.start();
    }

    next() {
        this.fsm.next();
    }

    get type() {
        return Session.Mode.TRAINING;
    }
}

TrainingSession.DEFAULT_RUN_COUNT = 5;
