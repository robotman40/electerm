const { app, BrowserWindow, Menu } = require('electron');
const { attachTerminalInternal } = require('./javascript/server');
const fixPath = require('fix-path').default;
const path = require('path');

fixPath(); // Ensure the server has the correct PATH environment variable

function createWindow() {
    const win = new BrowserWindow({
        show: false,
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
    win.webContents.openDevTools(); // Uncomment for debugging purposes

    win.once('ready-to-show', () => {
        win.show()
    })
}

Menu.setApplicationMenu(null);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});