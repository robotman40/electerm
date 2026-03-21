const { BrowserWindow } = require('electron');

function showAboutWindow() {
    const aboutWin = new BrowserWindow({
        show: false,
        width: 400,
        height: 550,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    aboutWin.loadFile('about.html')
    aboutWin.once('ready-to-show', () => {
        aboutWin.show()
    });
}

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
    // win.webContents.openDevTools(); // Uncomment for debugging purposes

    win.once('ready-to-show', () => {
        win.show();
    });
}

module.exports = { createWindow, showAboutWindow };