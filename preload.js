const { contextBridge, ipcRenderer, webUtils } = require('electron/renderer');

contextBridge.exposeInMainWorld('app', {
    createNewWindow: () => ipcRenderer.invoke('create-new-window'), // Handles creating new windows
    showAboutWindow: () => ipcRenderer.invoke('show-about-window'), // Handles showing the About window
    quitApp: () => ipcRenderer.invoke('quit-app'), // Handles exiting the app
    getOS: () => ipcRenderer.invoke('get-os'), // Gets the OS in use
    getOSRelease: () => ipcRenderer.invoke('get-os-release'), // Get the OS release
    getVersion: () => ipcRenderer.invoke('get-version'), // Gets the application version
    createPTYSession: (rows, cols) => ipcRenderer.invoke('create-pty-session', rows, cols), // Creates a new PTY session
    resizePTY: (id, rows, cols) => ipcRenderer.invoke('resize-pty', id, rows, cols), // Resizes the PTY session
    sendDataToPTY: (id, data) => ipcRenderer.invoke('send-data-to-pty', id, data), // Sends data to the PTY
    sendDataToTerm: (callback) => ipcRenderer.on('send-data-to-term', (event, value) => callback(value)), // Sends data to the terminal
    getFilePath(file) {
        // Get file file path
        const path = webUtils.getPathForFile(file);
        return path;
    }
});