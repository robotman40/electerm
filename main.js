const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { PTYSession } = require('./javascript/server');
const { createWindow, showAboutWindow } = require('./javascript/windows')
const fixPath = require('fix-path').default;
const os = require('os');

fixPath(); // Ensure the server has the correct PATH environment variable

const ptySessions = new Map(); // Keep a map of every PTY session spawned by each window

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

    ipcMain.handle('get-version', () => {
        // Get the app version
        return app.getVersion();
    });

    ipcMain.handle('create-pty-session', (event, rows, cols) => {
        // Create a new PTY session
        const window = BrowserWindow.fromWebContents(event.sender); // Get the window that sent the request
        const windowId = window.id; // Get the window ID

        // Clean up existing session if it previously existed (and somehow wasn't cleaned up)
        if (ptySessions.has(windowId)) {
            ptySessions.get(windowId).destroy(); // Kill the PTY session
            ptySessions.delete(windowId); // Finally delete the object from the map
        }

        const ptyInstance = new PTYSession(rows, cols, window); // Create a new PTY session for the window
        ptySessions.set(windowId, ptyInstance); // Map the window ID and PTY session together
    });

    ipcMain.handle('resize-pty', (event, rows, cols) => {
        // Handles resizing the PTY session during window resizing
        const window = BrowserWindow.fromWebContents(event.sender); // Get the window that sent the request
        const windowId = window.id; // Get the window ID
        const ptyInstance = ptySessions.get(windowId); // Get the PTY session associated with the window

        if (ptyInstance) {
            // If a session was found, resize the PTY session
            ptyInstance.resizePTY(rows, cols);
        }
    });

    ipcMain.handle('send-data-to-pty', (event, data) => {
        // If data from the terminal can be sent, send it to the PTY
        const window = BrowserWindow.fromWebContents(event.sender); // Get the window that sent the request
        const windowId = window.id; // Get the window ID
        const ptyInstance = ptySessions.get(windowId); // Get the PTY session associated with the window

        if (ptyInstance) {
            // If a session was found, write to the PTY session
            ptyInstance.writeToPTY(data);
        }
    });

    createNewTermSession(); // Create a new terminal session every launch
});