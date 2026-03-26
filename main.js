const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { PTYSession } = require('./javascript/server');
const { createWindow, showAboutWindow } = require('./javascript/windows')
const fixPath = require('fix-path').default;
const os = require('os');

fixPath(); // Ensure the server has the correct PATH environment variable

function createNewTermSession() {
    window = createWindow();

    window.once('ready-to-show', () => {
        window.show();
    });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
    // If no windows are open when the icon is clicked, create a new one
    if (BrowserWindow.getAllWindows().length === 0) {
        createNewTermSession();
    }
});

app.whenReady().then(() => {
    let ptyInstance;
    
    Menu.setApplicationMenu(null);

    ipcMain.handle('create-new-window', () => {
        createNewTermSession()
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

    ipcMain.handle('create-pty-session', (event, rows, cols) => {
        ptyInstance = new PTYSession(rows, cols, window);
    })

    ipcMain.handle('resize-pty', (event, rows, cols) => {
        ptyInstance.resizePTY(rows, cols);
    })

    ipcMain.handle('send-data-to-pty', (event, data) => {
       ptyInstance.writeToPTY(data);
    })

    createNewTermSession();
});