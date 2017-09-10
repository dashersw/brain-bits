import { spawn } from 'child_process';
import EventEmitter from 'events';

const emotivProcess = spawn('node', ['--napi-modules', 'lib/emotiv-reader.js'], { stdio: ['ipc', 'ignore', 'ignore'] });

emotivProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

export default class Emotiv extends EventEmitter {
    start() {
        if (emotivProcess.listenerCount > 0) return;

        emotivProcess.on('message', data => this.emit('data', data, Date.now()));
    }

    stop() {
        emotivProcess.removeAllListeners();
    }
}
