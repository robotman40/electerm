const { ipcRenderer } = require('electron');

window.onload = function() {
    ipcRenderer.invoke('get-version').then((version) => {
        document.getElementById('version').textContent = version;
    });
}