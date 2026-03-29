const { BrowserWindow } = require('electron');
const path = require('node:path');

function showAboutWindow() {
    // Create a new show window
    const aboutWin = new BrowserWindow({
        show: false,
        width: 400,
        height: 550,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    aboutWin.loadFile('about.html')
    aboutWin.once('ready-to-show', () => {
        aboutWin.show()
    });
}

function createWindow() {
    // Create new terminal windows
    const win = new BrowserWindow({
        show: false,
        width: 800,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        } 
    });

    win.loadFile('index.html');
    win.webContents.openDevTools(); // Uncomment for debugging purposes

    return win;
}

module.exports = { createWindow, showAboutWindow };