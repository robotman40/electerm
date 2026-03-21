const WebSocket = require('ws');
const { spawn } = require('node-pty');
const os = require('os');
const process = require('process');

function startServer(port) {
    try {
        const server = new WebSocket.Server({ port: port });
        server.on('connection', (ws, req) => {
            // On Windows, cmd.exe must be used since powershell.exe has rendering problems. On Unix-like systems, use the default shell.
            const shell = os.platform() === 'win32' ? 'cmd.exe' : process.env.SHELL || '/bin/sh' ; 

            const term = spawn(shell, [], {
                cwd: process.env.HOME,
                env: process.env,
                encoding: 'utf8'
            });

            console.log(`New connection from ${req.socket.remoteAddress}`);
            term.on('data', (data) => ws.send(data));
            term.on('exit', (code, signal) => {
                console.log(`The shell excited with code ${code} and signal ${signal}`);

                ws.close(1000, 'Shell terminated');
            })
            ws.on('message', (msg) => term.write(msg));
        });
    } catch (e) {
      return e;
    }
}

module.exports = { startServer }