const { ipcRenderer } = require('electron');

window.onload = function() {
    const version = ipcRenderer.invoke('get-version').then((version) => {
        document.getElementById('version').textContent = version;
    });
    
}