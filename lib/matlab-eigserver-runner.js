import { spawn } from 'child_process';
import path from 'path';

if (process.env.MATLAB_EIG_SERVER && process.env.MATLAB_PATH) {
    const pwd = path.resolve('./lib');
    const matlabProcess = spawn(process.env.MATLAB_PATH, ['-nodisplay', '-nosplash', `-r "cd ${pwd}; run eigserver.m"`], {
        stdio: 'inherit',
    });

    matlabProcess.on('close', (code) => {
        console.log(`matlab child process exited with code ${code}`);
    });

    process.on('exit', () => {
        matlabProcess.kill();
    });
}
