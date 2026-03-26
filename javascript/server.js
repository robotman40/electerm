const { spawn } = require('node-pty');
const os = require('os');

class PTYSession {
    constructor(rows, cols, window) {
        try {
            // On Windows, cmd.exe must be used since powershell.exe has rendering problems. On Unix-like systems, use the default shell.
            const plat = os.platform();
            const shell = plat === 'win32' ? 'cmd.exe' : process.env.SHELL || '/bin/sh' ; 

            this.ptyProcess = spawn(shell, [], {
                cwd: process.env.HOME,
                env: process.env,
                encoding: 'utf8',
                rows: rows,
                cols: cols
            }); 

            this.ptyProcess.on('data', (data) => {
                window.webContents.send('send-data-to-term', data)
            });

            this.ptyProcess.on('exit', (code, signal) => {
                console.log(`The shell excited with code ${code} and signal ${signal}`);
                window.close();
            })

        } catch (e) {
            console.log(e)
            return e;
        }
    }

    resizePTY(rows, cols) {
        this.ptyProcess.resize(cols, rows);
    }

    writeToPTY(data) {
        this.ptyProcess.write(data);
    }

    destroy() {
        this.ptyProcess.kill();
    }
}

module.exports = { PTYSession }