const { spawn } = require('node-pty');
const os = require('os');

class PTYSession {
    // Session class that serves as an interface with PTY session

    constructor(rows, cols, window) {
        // Try starting a PTY session
        try {
            // On Windows, cmd.exe must be used since powershell.exe has rendering problems. On Unix-like systems, use the default shell.
            const plat = os.platform();
            const shell = plat === 'win32' ? 'cmd.exe' : process.env.SHELL || '/bin/sh' ; 

            // Spawn the default shell
            this.ptyProcess = spawn(shell, [], {
                cwd: plat === 'win32' ? process.env.USERPROFILE : process.env.HOME,
                env: process.env,
                encoding: 'utf8',
                rows: rows,
                cols: cols
            }); 

            // Send data when new data is available from the pTY
            this.ptyProcess.on('data', (data) => {
                window.webContents.send('send-data-to-term', data)
            });

            // Close the window if the PTY session ends
            this.ptyProcess.on('exit', (code, signal) => {
                console.log(`The shell excited with code ${code} and signal ${signal}`);
            })

        } catch (e) {
            // Throw an error if PTY session creation fails
            console.log(e)
            return e;
        }
    }

    resizePTY(rows, cols) {
        // Handles resizing the PTY
        this.ptyProcess.resize(cols, rows);
    }

    writeToPTY(data) {
        // Writes to the PTY
        this.ptyProcess.write(data);
    }

    endSession() {
        this.ptyProcess.kill();
    }
}

module.exports = { PTYSession }