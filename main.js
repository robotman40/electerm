const { app, dialog, BrowserWindow, ipcMain, Menu } = require('electron');
const { startServer } = require('./javascript/server');
const fixPath = require('fix-path').default;
const path = require('path');

fixPath(); // Ensure the server has the correct PATH environment variable

const createWindow = () => {
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
    try {
        startServer()
    } catch (e) {
        const options = {
            type: 'error',
            title: 'Server Error',
            message: 'Failed to start the server',
        };
        dialog.showMessageBoxSync(null, options)
        app.quit();
    };

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});