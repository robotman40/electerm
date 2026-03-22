const { ipcRenderer } = require('electron');

window.onload = function() {
    // create Terminal and get object
    const term = createTerminal();

    // Create menu bar buttons
    const menuBar = document.getElementById('menu-bar');
    const buttons = {
            'Shell': {'New Window' : function () {
                ipcRenderer.send('create-new-window');
            }, 
            'Exit' : function () {
                window.close();
            }
        },
        'Edit': {'Cut' : function () {
            const selectedText = term.getSelection().toString();
            if (selectedText) {
                navigator.clipboard.writeText(selectedText).then(() => {
                    console.log('Text copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        }, 'Copy' : function () {
            const selectedText = term.getSelection().toString();
            if (selectedText) {
                navigator.clipboard.writeText(selectedText).then(() => {
                    console.log('Text copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        }, 'Paste' : function () {
            navigator.clipboard.readText().then(text => {
                term.paste(text);
            }).catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
        }},
        'View': {'Zoom In' : function () {
            // Zoom In functionality
            term.zoomIn();
        }, 'Zoom Out' : function () {
            term.zoomOut(); // Decrease font size to zoom out
        }, 'Reset Zoom' : function () {
            term.resetZoom(); // Reset to default font size
        }},
        'Help': {'About' : function () {
            ipcRenderer.send('show-about-window');
        }}
    };
    // Create buttons and dropdowns for the menu bar
    for (const [btnText, subButtons] of Object.entries(buttons)) {
        const btn = document.createElement('button');
        btn.textContent = btnText;
        btn.style.backgroundColor = 'darkslategray';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '5px 10px';
        btn.style.marginRight = '10px';
        btn.onmouseover = () => {
            btn.style.backgroundColor = 'slategray';
            dropdown.style.display = 'flex'; // Show dropdown on hover
        };
        btn.onmouseout = () => {
            btn.style.backgroundColor = 'darkslategray';
            dropdown.style.display = 'none'; // Hide dropdown on mouse out
        };
        const dropdown = document.createElement('div');
        dropdown.style.position = 'absolute';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.display = 'none';
        dropdown.style.minWidth = '100px';
        dropdown.style.zIndex = '1000';
        dropdown.style.flexDirection = 'column';
        Object.entries(subButtons).forEach(([subBtnText, subBtnFunction]) => {
            const subBtn = document.createElement('button');
            subBtn.textContent = subBtnText;
            subBtn.style.textAlign = 'left';
            subBtn.style.backgroundColor = 'white';
            subBtn.style.color = 'black';
            subBtn.style.border = 'none';
            subBtn.style.padding = '5px 10px';
            subBtn.onmouseover = () => subBtn.style.backgroundColor = '#a19b9b';
            subBtn.onmouseout = () => subBtn.style.backgroundColor = 'white';
            subBtn.onclick = () => subBtnFunction(); // Call the corresponding function on click
            dropdown.appendChild(subBtn);
        });
        btn.appendChild(dropdown);
        btn.onclick = () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
        }
        menuBar.appendChild(btn);
    };
}