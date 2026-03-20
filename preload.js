const { contextBridge, ipcRenderer } = require('electron');

// Expose these methods
contextBridge.exposeInMainWorld('electron', {
    sendMessage: (channel, data) => {
        let validChannels = ['toMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },

    onMessage: (channel, func) => {
        let validChannels = ['fromMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    },
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    openAbout: () => ipcRenderer.invoke('open-about-window'),
    showErrorDialog: (message) => ipcRenderer.invoke('show-error-dialog', message),
    newTerminalWindow: () => ipcRenderer.invoke('new-terminal'),
});