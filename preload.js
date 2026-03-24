const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('app', {
    getOS: () => ipcRenderer.invoke('get-os'),
    getVersion: () => ipcRenderer.invoke('get-version')
});