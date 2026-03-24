async function getVersion() {
    return await window.app.getVersion();
}

async function getOS() {
    return await window.app.getOS();
}

window.onload = function() {
     getVersion().then(version => {
        document.getElementById('version').textContent = version;
     });

    const iconImage = document.getElementById('app-icon');
    getOS().then(os => {
        if (os === 'darwin') {
            iconImage.src = "assets/electerm_logo_macos.png";
        } else {
            iconImage.src = "assets/electerm_logo.png";
        }
    });
}