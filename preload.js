const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.executeInMainWorld('electronAPI', {
    getOS: () => ipcRenderer.send('get-os'),
});