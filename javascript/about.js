const { ipcRenderer } = require('electron');
const { platform } = require('os');

window.onload = function() {
    ipcRenderer.invoke('get-version').then((version) => {
        document.getElementById('version').textContent = version;
    });

    const iconImage = document.getElementById('app-icon');
    if (platform() === 'darwin') {
        iconImage.src = "assets/electerm_logo_macos.png";
    } else {
        iconImage.src = "assets/electerm_logo.png";
    }
}