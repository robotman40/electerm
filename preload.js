const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('app', {
    createNewWindow: () => ipcRenderer.invoke('create-new-window'),
    showAboutWindow: () => ipcRenderer.invoke('show-about-window'),
    quitApp: () => ipcRenderer.invoke('quit-app'),
    getOS: () => ipcRenderer.invoke('get-os'),
    getVersion: () => ipcRenderer.invoke('get-version'),
    createPTYSession: (rows, cols) => ipcRenderer.invoke('create-pty-session', rows, cols),
    resizePTY: (rows, cols) => ipcRenderer.invoke('resize-pty', rows, cols),
    sendDataToPTY: (data) => ipcRenderer.invoke('send-data-to-pty', data),
    sendDataToTerm: (callback) => ipcRenderer.on('send-data-to-term', (event, value) => callback(value))
});