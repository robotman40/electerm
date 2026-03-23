const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { createWindow, showAboutWindow } = require('./javascript/windows')
const fixPath = require('fix-path').default;

fixPath(); // Ensure the server has the correct PATH environment variable

ipcMain.on('create-new-window', () => {
    createWindow()
});

ipcMain.on('show-about-window', () => {
    showAboutWindow();
});

ipcMain.handle('get-version', () => {
    return app.getVersion();
})

ipcMain.handle('quit-app', () => {
    app.quit()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
    createWindow();
    Menu.setApplicationMenu(null);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});