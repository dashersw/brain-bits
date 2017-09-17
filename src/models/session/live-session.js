import StateMachine from 'javascript-state-machine';
import Session from './session';

export default class LiveSession extends Session {
    constructor() {
        super('');

        const session = this;

        this.done = false;

        this.runCount = Infinity;

        this.fsm = new StateMachine({
            init: 'stopped',
            transitions: [
                { name: 'start', from: 'stopped', to: 'countdown' },
                { name: 'run', from: 'countdown', to: 'running' },
                { name: 'next', from: 'running', to: 'showingSymbol' },
                { name: 'run', from: 'showingSymbol', to: 'running' },
                { name: 'end', from: 'running', to: 'ended' },
            ],
            methods: {
                onCountdown() {
                    (function tick() {
                        session._display(session.countdownMessages.shift());

                        if (!session.countdown--) {
                            session.fsm.run();
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

                            setTimeout(() => session.fsm.run(), 3000);
                        }, 2000);
                    }, 1000);
                },
                onLeaveShowingSymbol() {
                    session.runs++;
                },
                onRunning() {
                    setTimeout(() => session.emit('run'), 3000);
                },
                onEnded() { session.emit('end'); },
            },
        });
    }

    start() {
        this.fsm.start();
    }

    next(symbol) {
        this.message += symbol;
        this.fsm.next();
    }

    end() {
        this.fsm.end();
    }

    get type() {
        return Session.Mode.LIVE;
    }
}

LiveSession.DEFAULT_RUN_COUNT = Infinity;
