const { ipcRenderer } = require('electron');
const { platform } = require('os');

window.onload = function() {
    ipcRenderer.invoke('get-version').then((version) => {
        document.getElementById('version').textContent = version;
    });

    if (platform() === 'darwin') {
        document.getElementById('app-icon').src = "assets/electerm_logo_macos.png";
    }
}