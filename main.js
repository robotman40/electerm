const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { startServer } = require('./javascript/server');
const fixPath = require('fix-path').default;
const path = require('path');
const net = require('net');
const { start } = require('repl');

fixPath(); // Ensure the server has the correct PATH environment variable

function createWindow() {
    const win = new BrowserWindow({
        show: false,
        width: 800,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile('index.html');
    // win.webContents.openDevTools(); // Uncomment for debugging purposes

    win.once('ready-to-show', () => {
        win.show()
    })
}

async function checkPortInUse(port) {
    return new Promise((resolve) => {
        const server = new net.Server();

        server.once('error', (error) => {
            if (error.code === 'EADDRINUSE') resolve(true);
            else resolve(false);
        });

        server.once('listening', () => {
            server.close();
            resolve(false);
        });

        server.listen(port);
    })
}

Menu.setApplicationMenu(null);

ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('open-about-window', () => {
    const aboutWindow = new BrowserWindow({
        show: false,
        width: 500,
        height: 550,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    aboutWindow.loadFile('about.html');
    
    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show()
    })
})

ipcMain.handle('new-terminal', () => {
    createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
    checkPortInUse(45875).then(inUse => {
        if (!inUse) {
            startServer(45875);
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});