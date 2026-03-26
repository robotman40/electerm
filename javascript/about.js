window.onload = async function() {
     document.getElementById('version').textContent = await window.app.getVersion();

    const iconImage = document.getElementById('app-icon');
    const os = await window.app.getOS();
    if (os === 'darwin') {
        iconImage.src = "assets/electerm_logo_macos.png";
    } else {
        iconImage.src = "assets/electerm_logo.png";
    }
}