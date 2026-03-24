const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { createWindow, showAboutWindow } = require('./javascript/windows')
const fixPath = require('fix-path').default;
const os = require('os');

fixPath(); // Ensure the server has the correct PATH environment variable

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
    ipcMain.handle('create-new-window', () => {
        createWindow()
    });

    ipcMain.handle('show-about-window', () => {
        showAboutWindow();
    });

    ipcMain.handle('quit-app', () => {
        app.quit()
    })

    ipcMain.handle('get-os', () => {
        return os.platform();
    });

    ipcMain.handle('get-version', () => {
        return app.getVersion();
    })

    createWindow();
    Menu.setApplicationMenu(null);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});