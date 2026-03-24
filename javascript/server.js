function attachPtyProcess(terminalObject, fitAddonObject) {
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

        ptyProcess.updateSize = function(cols, rows) {
            ptyProcess.resize(cols, rows);
        }

        ptyProcess.on('data', (data) => terminalObject.write(data));
        ptyProcess.on('exit', (code, signal) => {
            console.log(`The shell excited with code ${code} and signal ${signal}`);
            window.close();
        })
        terminalObject.onData((data) => ptyProcess.write(data));

        return ptyProcess;

    } catch (e) {
      return e;
    }
}