window.onload = async function() {
     document.getElementById('version').textContent = await window.app.getVersion(); // Gets the application version

    const iconImage = document.getElementById('app-icon'); // Get the app-icon element
    const os = await window.app.getOS(); // Get the OS version
    document.getElementById('os_release').textContent = await window.app.getOSRelease();

    // Use a different icon based on the OS in use
    if (os === 'darwin') {
        iconImage.src = "assets/electerm_logo_macos.png";
    } else {
        iconImage.src = "assets/electerm_logo.png";
    }

    const sourceCodeLink = document.getElementById('src-link');
    sourceCodeLink.onclick = function() {
        window.app.openInBrowserWindow('https://github.com/robotman40/electerm');
    }
    sourceCodeLink.onmouseover = function() {
        sourceCodeLink.style.backgroundColor = 'white';
        sourceCodeLink.style.color = 'black';
    }
    sourceCodeLink.onmouseout = function() {
        sourceCodeLink.style.backgroundColor = 'black';
        sourceCodeLink.style.color = 'white';
    }
}