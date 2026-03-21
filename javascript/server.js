const { platform } = require('os');
const { spawn } = require('node-pty');
const process = require('process');

function attachPtyProcess(terminalObject) {
    try {
        // On Windows, cmd.exe must be used since powershell.exe has rendering problems. On Unix-like systems, use the default shell.
        const plat = platform();
        const shell = plat === 'win32' ? 'cmd.exe' : process.env.SHELL || '/bin/sh' ; 

        const ptyProcess = spawn(shell, [], {
            cwd: process.env.HOME,
            env: process.env,
            encoding: 'utf8',
            rows: terminalObject.rows,
            cols: terminalObject.cols
        });

        ptyProcess.on('data', (data) => terminalObject.write(data));
        ptyProcess.on('exit', (code, signal) => {
            console.log(`The shell excited with code ${code} and signal ${signal}`);
            window.close();
        })
        terminalObject.onData((data) => ptyProcess.write(data));
        terminalObject.onResize((size) => {
            ptyProcess.resize(size.cols, size.rows);
        });

    } catch (e) {
      return e;
    }
}

module.exports = { attachPtyProcess }