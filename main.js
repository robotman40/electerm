const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { PTYSession } = require('./javascript/server');
const { createWindow, showAboutWindow } = require('./javascript/windows')
const fixPath = require('fix-path').default;
const os = require('os');
const os_name = require('os-name').default;

fixPath(); // Ensure the server has the correct PATH environment variable

const ptySessions = new Map(); // Keep a map of every PTY session spawned by each window

let termCount = 0;

function createNewTermSession() {
    // Create a new terminal window

    window = createWindow(); // Call the create Window function

    window.once('ready-to-show', () => {
        window.show(); // Show window when it is fully rendered and ready
    });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit(); // Ensure the program doesn't automatically close on MacOS
  }
});

app.on('activate', () => {
    // If no windows are open when the icon is clicked, create a new one
    if (BrowserWindow.getAllWindows().length === 0) {
        createNewTermSession();
    }
});

app.whenReady().then(() => {
    Menu.setApplicationMenu(null); // Disable to use Electerm's built-in menu bar

    ipcMain.handle('create-new-window', () => {
        // When creating a new Window from Electerm, create a new terminal session
        createNewTermSession()
    });

    ipcMain.handle('show-about-window', () => {
        // When clicking the about option, show the About window
        showAboutWindow();
    });

    ipcMain.handle('quit-app', () => {
        // Quit the app if this is called (destroys all associated windows on MacOS)
        app.quit()
    });

    ipcMain.handle('get-os', () => {
        // Get the platform
        return os.platform();
    });

    ipcMain.handle('get-os-release', () => {
        // Get the operating system release name
        return os_name();
    })

    ipcMain.handle('get-version', () => {
        // Get the app version
        return app.getVersion();
    });

    ipcMain.handle('create-pty-session', (event, rows, cols) => {
        // Create a new PTY session

        // Ensure each new session is unique
        const ptyId = termCount;
        termCount += 1;

        const ptyInstance = new PTYSession(rows, cols, window); // Create a new PTY session for the window
        ptySessions.set(ptyId, ptyInstance); // Map the window ID and PTY session together

        return ptyId; // Return the PTY session ID on success
    });

    ipcMain.handle('resize-pty', (event, id, rows, cols) => {
        // Handles resizing the PTY session during window resizing
        const ptyInstance = ptySessions.get(id); // Get the PTY session with the associated ID

        if (ptyInstance) {
            // If a session was found, resize the PTY session
            ptyInstance.resizePTY(rows, cols);
        }
    });

    ipcMain.handle('send-data-to-pty', (event, id, data) => {
        // If data from the terminal can be sent, send it to the PTY
        const ptyInstance = ptySessions.get(id); // Get the PTY session with the associated ID

        if (ptyInstance) {
            // If a session was found, write to the PTY session
            ptyInstance.writeToPTY(data);
        }
    });

    createNewTermSession(); // Create a new terminal session every launch
});